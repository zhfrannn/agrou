import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BarChart3,
  MessageCircle,
  DollarSign,
  FileCheck,
  Sparkles,
  Camera,
  Globe,
  TrendingUp,
  ArrowLeft,
  Send,
  Upload,
  X,
  Loader2,
  CheckCircle2,
  Building2,
  Menu,
  Copy,
  Star,
  Users,
  Plus,
  Search,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { SAMPLE_KOPERASI } from "../constants/gro-ai-koperasi";
import { CHAT_TOPICS } from "../constants/gro-ai-topics";
import { callGroAI } from "../lib/groai-client";
import {
  getModeBChatSystemPrompt,
  getModeBCalcSystemPrompt,
  getModeBDokumenSystemPrompt,
  getModeBWriterSystemPrompt,
  getModeBVisionSystemPrompt,
} from "../lib/groai-prompts";
import { useConversations } from "../hooks/useConversations";
import { MarkdownRenderer } from "./gro-ai/shared/MarkdownRenderer";
import { MessageSkeleton } from "./gro-ai/shared/MessageSkeleton";
import type { ModuleId, CalcType, DokType, WriterType } from "../types/gro-ai";
import sidebarKiriImg from "../assets/sidebar-kiri-a.png";

// ── Field definitions ──────────────────────────────────────────────────────

const CALC_FIELDS: Record<
  NonNullable<CalcType>,
  Array<{ key: string; label: string; placeholder: string }>
> = {
  logistik: [
    { key: "berat", label: "Berat Kargo (kg)", placeholder: "2400" },
    { key: "tujuan", label: "Pelabuhan Tujuan", placeholder: "Tokyo, Japan" },
    { key: "incoterm", label: "Incoterm", placeholder: "FOB" },
  ],
  proyeksi: [
    { key: "periode", label: "Periode (bulan)", placeholder: "6" },
    { key: "target_volume", label: "Target Volume", placeholder: "5 ton" },
  ],
  bea: [
    { key: "hs_code", label: "HS Code", placeholder: "0901.21.00" },
    { key: "nilai_fob", label: "Nilai FOB (USD)", placeholder: "10080" },
  ],
  breakeven: [
    {
      key: "biaya_tetap",
      label: "Biaya Tetap/bulan (Rp)",
      placeholder: "20000000",
    },
    { key: "harga_jual", label: "Harga Jual/kg (USD)", placeholder: "4.20" },
  ],
};

const DOK_FIELDS: Record<
  NonNullable<DokType>,
  Array<{ key: string; label: string; placeholder: string }>
> = {
  phyto: [
    { key: "eksportir", label: "Nama Eksportir", placeholder: "KSU Maju Gayo" },
    { key: "negara", label: "Negara Tujuan", placeholder: "Japan" },
    { key: "volume", label: "Volume", placeholder: "2.4 Ton" },
  ],
  coo: [
    { key: "eksportir", label: "Nama Eksportir", placeholder: "KSU Maju Gayo" },
    { key: "importir", label: "Nama Importir", placeholder: "Buyer Name" },
    { key: "hs", label: "HS Code", placeholder: "0901.21.00" },
  ],
  invoice: [
    { key: "importir", label: "Nama Buyer", placeholder: "Buyer Name" },
    { key: "tanggal", label: "Tanggal", placeholder: "01/07/2025" },
    { key: "nilai", label: "Total Nilai (USD)", placeholder: "10080" },
    { key: "hs", label: "HS Code", placeholder: "0901.21.00" },
  ],
  packing: [
    { key: "importir", label: "Nama Konsignee", placeholder: "Buyer Name" },
    { key: "koli", label: "Jumlah Koli", placeholder: "48" },
    { key: "berat", label: "Total Berat Bersih", placeholder: "2.4 Ton" },
  ],
};

const WRITER_FIELDS: Record<
  NonNullable<WriterType>,
  Array<{ key: string; label: string; placeholder: string }>
> = {
  proposal: [
    { key: "buyer", label: "Nama Buyer", placeholder: "Ueshima Coffee Co." },
    {
      key: "keunggulan",
      label: "Keunggulan Tambahan",
      placeholder: "altitude 1500m, single origin",
    },
  ],
  email: [
    {
      key: "kepada",
      label: "Kepada",
      placeholder: "Mr. Tanaka, Procurement Manager",
    },
    {
      key: "perusahaan",
      label: "Perusahaan Tujuan",
      placeholder: "Tokyo Coffee Imports Ltd.",
    },
  ],
  katalog: [
    {
      key: "grade",
      label: "Grade / Kualitas",
      placeholder: "Grade 1 Specialty",
    },
    {
      key: "rasa",
      label: "Profil Rasa",
      placeholder: "floral, citrus, caramel",
    },
  ],
  press: [
    {
      key: "acara",
      label: "Acara/Konteks",
      placeholder: "Pameran SIAL Paris 2024",
    },
    {
      key: "pencapaian",
      label: "Pencapaian Utama",
      placeholder: "kontrak ekspor USD 50,000",
    },
  ],
};

function scoreColor(s: number) {
  return s >= 80 ? "#22c55e" : s >= 60 ? "#f77f00" : "#ef4444";
}
function scoreLabel(s: number) {
  return s >= 80 ? "Siap Ekspor" : s >= 60 ? "Perlu Persiapan" : "Belum Siap";
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function GroAIModeB({ onBack }: { onBack: () => void }) {
  const { user, profile } = useAuth();
  const [activeKopId, setActiveKopId] = useState<number>(1);
  const kop =
    SAMPLE_KOPERASI.find((k) => k.id === activeKopId) ?? SAMPLE_KOPERASI[0];
  const [activeModule, setActiveModule] = useState<ModuleId>("dasbor");
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [konteks, setKonteks] = useState("");

  // Chat state
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [topicSearchQuery, setTopicSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Kalkulator state
  const [calcType, setCalcType] = useState<CalcType>(null);
  const [calcFields, setCalcFields] = useState<Record<string, string>>({});
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcResult, setCalcResult] = useState<string | null>(null);

  // Dokumen state
  const [dokType, setDokType] = useState<DokType>(null);
  const [dokFields, setDokFields] = useState<Record<string, string>>({});
  const [dokLoading, setDokLoading] = useState(false);
  const [dokResult, setDokResult] = useState<string | null>(null);

  // Writer state
  const [writerType, setWriterType] = useState<WriterType>(null);
  const [writerFields, setWriterFields] = useState<Record<string, string>>({});
  const [writerLoading, setWriterLoading] = useState(false);
  const [writerResult, setWriterResult] = useState<string | null>(null);

  // Vision state
  const [visionImage, setVisionImage] = useState<string | null>(null);
  const [visionLoading, setVisionLoading] = useState(false);
  const [visionResult, setVisionResult] = useState<string | null>(null);
  const visionInputRef = useRef<HTMLInputElement>(null);

  // Copy state
  const [copied, setCopied] = useState(false);

  // Conversations (for chat module)
  const {
    conversations,
    activeId: activeConversationId,
    setActiveId: setActiveConversationId,
    activeConversation,
    createConversation,
    appendMessage,
  } = useConversations({ filterByModuleId: "chat" });

  const userInitial =
    profile?.full_name?.[0]?.toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    "K";

  // ── Effects ──────────────────────────────────────────────────────────────

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation, activeConversationId]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [chatInput]);

  useEffect(() => {
    setCalcType(null);
    setCalcFields({});
    setCalcResult(null);
    setDokType(null);
    setDokFields({});
    setDokResult(null);
    setWriterType(null);
    setWriterFields({});
    setWriterResult(null);
    setVisionImage(null);
    setVisionResult(null);
    setTopicSearchQuery("");
    setSelectedCategory("All");
  }, [activeModule]);

  // ── AI Handlers ───────────────────────────────────────────────────────────

  const sendChat = async (text: string) => {
    if (!text.trim() || chatLoading) return;
    setChatInput("");
    setChatLoading(true);

    const userMsg = { role: "user" as const, content: text };
    let convId = activeConversationId;

    if (!convId) {
      const title = text.length > 30 ? text.slice(0, 30) + "..." : text;
      const welcomeMsg = {
        role: "assistant" as const,
        content:
          "Halo! Saya Gro AI, konsultan ekspor untuk " +
          kop.name +
          ". Ada yang bisa saya bantu?",
      };
      convId = createConversation(title, "chat", welcomeMsg);
      appendMessage(convId, userMsg);
    } else {
      appendMessage(convId, userMsg);
    }

    const currentConv = convId
      ? conversations.find((c) => c.id === convId)
      : null;

    try {
      const result = await callGroAI({
        message: text,
        systemPrompt: getModeBChatSystemPrompt(kop, konteks || undefined),
        history: (currentConv?.messages ?? activeConversation?.messages ?? [])
          .slice(-8)
          .map((m) => ({ role: m.role, content: m.content })),
      });
      appendMessage(convId!, { role: "assistant", content: result.reply });
    } catch {
      appendMessage(convId!, {
        role: "assistant",
        content:
          "Koneksi ke Gro AI bermasalah. Periksa internet dan coba lagi.",
      });
    } finally {
      setChatLoading(false);
    }
  };

  const startTopicChat = (topicId: string) => {
    const topic = CHAT_TOPICS.find((t) => t.id === topicId);
    if (!topic) return;
    const welcomeMsg = {
      role: "assistant" as const,
      content:
        "Halo! Saya siap membantu mengenai **" +
        topic.title +
        "** untuk koperasi " +
        kop.name +
        ". Silakan ajukan pertanyaan!",
    };
    const newId = createConversation(
      topic.title + " — " + kop.name,
      "chat",
      welcomeMsg,
    );
    setActiveConversationId(newId);
    setActiveModule("chat");
  };

  const runCalc = async () => {
    if (!calcType) return;
    setCalcLoading(true);
    setCalcResult(null);
    try {
      const result = await callGroAI({
        message:
          "Hitung " +
          calcType +
          " untuk ekspor " +
          kop.komoditas +
          " dari " +
          kop.name,
        systemPrompt: getModeBCalcSystemPrompt(kop, calcType, calcFields),
        history: [],
      });
      setCalcResult(result.reply);
    } catch {
      setCalcResult("Gagal menghitung. Periksa koneksi dan coba lagi.");
    } finally {
      setCalcLoading(false);
    }
  };

  const runDokumen = async () => {
    if (!dokType) return;
    setDokLoading(true);
    setDokResult(null);
    try {
      const result = await callGroAI({
        message:
          "Generate dokumen " + dokType + " untuk ekspor " + kop.komoditas,
        systemPrompt: getModeBDokumenSystemPrompt(kop, dokType, dokFields),
        history: [],
      });
      setDokResult(result.reply);
    } catch {
      setDokResult("Gagal membuat dokumen. Periksa koneksi dan coba lagi.");
    } finally {
      setDokLoading(false);
    }
  };

  const runWriter = async () => {
    if (!writerType) return;
    setWriterLoading(true);
    setWriterResult(null);
    try {
      const result = await callGroAI({
        message:
          "Tulis " + writerType + " untuk " + kop.name + " — " + kop.komoditas,
        systemPrompt: getModeBWriterSystemPrompt(kop, writerType, writerFields),
        history: [],
      });
      setWriterResult(result.reply);
    } catch {
      setWriterResult("Gagal menulis. Periksa koneksi dan coba lagi.");
    } finally {
      setWriterLoading(false);
    }
  };

  const runVision = async () => {
    if (!visionImage) return;
    setVisionLoading(true);
    setVisionResult(null);
    try {
      const result = await callGroAI({
        message: "Analisis gambar atau dokumen ini untuk keperluan ekspor",
        systemPrompt: getModeBVisionSystemPrompt(kop),
        history: [],
      });
      setVisionResult(result.reply);
    } catch {
      setVisionResult("Gagal menganalisis gambar. Coba lagi.");
    } finally {
      setVisionLoading(false);
    }
  };

  const handleVisionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setVisionImage(ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── NAV definition ──────────────────────────────────────────────────────
  const NAV: Array<{
    id: ModuleId;
    icon: React.ReactNode;
    label: string;
    desc: string;
  }> = [
    {
      id: "dasbor",
      icon: <BarChart3 size={13} />,
      label: "Dasbor",
      desc: "Ringkasan & statistik",
    },
    {
      id: "chat",
      icon: <MessageCircle size={13} />,
      label: "AI Chat",
      desc: "Konsultasi ekspor",
    },
    {
      id: "kalkulator",
      icon: <DollarSign size={13} />,
      label: "AI Kalkulator",
      desc: "Hitung biaya & ROI",
    },
    {
      id: "dokumen",
      icon: <FileCheck size={13} />,
      label: "AI Dokumen",
      desc: "Generate dokumen legal",
    },
    {
      id: "writer",
      icon: <Sparkles size={13} />,
      label: "AI Writer",
      desc: "Proposal & email",
    },
    {
      id: "vision",
      icon: <Camera size={13} />,
      label: "AI Vision",
      desc: "Analisis foto & dokumen",
    },
  ];

  // ── Sidebar ──────────────────────────────────────────────────────────────
  const SidebarInner = () => (
    <div
      className="flex flex-col h-full text-white/90"
      style={{
        backgroundImage: `url(${sidebarKiriImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#233226",
      }}
    >
      <div className="p-3 pb-2 border-b border-white/10 flex flex-col items-start">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 text-white/80 hover:text-white text-[10px] font-bold transition-all border border-white/10 cursor-pointer mb-2.5"
        >
          <ArrowLeft size={11} className="text-white/60" />
          <span>Ganti Mode</span>
        </button>
        <div className="flex items-center gap-2 px-1.5 mt-0.5">
          <div className="w-5 h-5 rounded-md bg-[#f77f00]/20 flex items-center justify-center">
            <Building2 size={11} className="text-[#f77f00]" />
          </div>
          <div>
            <h2 className="font-display font-black text-white text-sm leading-tight">
              Gro AI
            </h2>
            <p className="text-white/40 text-[9px]">Mode Koperasi & Ekspor</p>
          </div>
        </div>
      </div>

      <div className="pt-2 pb-1 px-3 border-t border-white/10 mt-2 shrink-0">
        <p className="text-white/30 text-[8px] font-black uppercase tracking-[0.15em] mb-1.5 px-1">
          MENU
        </p>
        <div className="space-y-0.5">
          {NAV.map((n) => {
            const isActive = activeModule === n.id;
            return (
              <button
                key={n.id}
                onClick={() => {
                  setActiveModule(n.id);
                  setLeftOpen(false);
                }}
                className={
                  isActive
                    ? "flex items-center gap-2 px-2.5 py-1.5 bg-[#f77f00]/20 border-l-2 border-[#f77f00] text-white font-bold text-xs w-full text-left rounded-r-lg transition-all cursor-pointer"
                    : "flex items-center gap-2 px-2.5 py-1.5 text-white/50 text-xs w-full text-left hover:bg-white/5 hover:text-white/80 transition-all cursor-pointer rounded-r-lg border-l-2 border-transparent"
                }
              >
                <div
                  className={
                    isActive
                      ? "w-5 h-5 rounded-md bg-[#f77f00]/25 flex items-center justify-center shrink-0"
                      : "w-5 h-5 rounded-md bg-white/5 flex items-center justify-center shrink-0"
                  }
                >
                  {React.cloneElement(n.icon as React.ReactElement, {
                    size: 11,
                    className: isActive ? "text-[#ff9f1c]" : "text-white/40",
                  })}
                </div>
                <span className="truncate">{n.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      {conversations.length > 0 && (
        <div className="px-3 pt-2 pb-2 border-t border-white/10 mt-2 flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-1.5 shrink-0">
            <p className="text-white/30 text-[8px] font-black uppercase tracking-[0.15em]">
              RIWAYAT
            </p>
            <button
              onClick={() => {
                setActiveConversationId(null);
                setActiveModule("chat");
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#f77f00]/20 hover:bg-[#f77f00]/30 text-[#f77f00] text-[10px] font-bold transition-all border border-[#f77f00]/30 cursor-pointer"
            >
              <Plus size={10} /> New Chat
            </button>
          </div>
          <div
            className="space-y-0.5 overflow-y-auto flex-1"
            style={{ scrollbarWidth: "none" }}
          >
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => {
                  setActiveConversationId(conv.id);
                  setActiveModule("chat");
                  setLeftOpen(false);
                }}
                className={
                  activeConversationId === conv.id
                    ? "w-full text-left px-2 py-1 rounded-lg bg-[#f77f00]/15 border border-[#f77f00]/30 text-white text-[10px] font-bold truncate cursor-pointer"
                    : "w-full text-left px-2 py-1 rounded-lg text-white/50 text-[10px] hover:bg-white/5 hover:text-white/80 truncate cursor-pointer transition-colors"
                }
              >
                <MessageSquare size={9} className="inline mr-1 opacity-60" />
                {conv.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // ── Right Panel ──────────────────────────────────────────────────────────
  const RightPanelInner = () => (
    <div
      className="h-full flex flex-col text-white overflow-y-auto"
      style={{
        backgroundImage: `url(${sidebarKiriImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#1a2d20",
        scrollbarWidth: "none",
      }}
    >
      {/* Profile header with gradient */}
      <div className="relative">
        <div className="h-20 bg-gradient-to-br from-[#f77f00]/80 to-[#c85a00]/90 flex items-end px-4 pb-2">
          <div className="absolute top-3 right-3">
            <span className="bg-white/20 text-white text-[8px] font-bold px-2 py-0.5 rounded-full">
              {kop.cert}
            </span>
          </div>
        </div>
        <div className="px-4 pb-3 pt-0 -mt-5 relative">
          <div className="w-10 h-10 rounded-xl bg-[#f77f00] border-2 border-[#1a2d20] flex items-center justify-center shadow-lg mb-2">
            <Building2 size={18} className="text-white" />
          </div>
          <p className="text-white font-black text-sm leading-tight">
            {kop.name}
          </p>
          <p className="text-white/50 text-[10px] mt-0.5">{kop.loc}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            <span className="bg-[#f77f00]/20 text-[#f77f00] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#f77f00]/30">
              {kop.komoditas}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 pb-3">
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Volume", val: kop.volume, icon: "📦" },
            { label: "Target", val: kop.targets, icon: "🌏" },
            { label: "Harga", val: kop.price, icon: "💰" },
            { label: "Anggota", val: kop.anggota + " org", icon: "👥" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white/8 rounded-xl p-2.5 border border-white/10"
            >
              <span className="text-sm block mb-1">{item.icon}</span>
              <p className="text-white font-black text-xs leading-tight">
                {item.val}
              </p>
              <p className="text-white/40 text-[9px] mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Export readiness score */}
      <div className="px-4 pb-3 border-t border-white/10 pt-3">
        <p className="text-white/30 text-[8px] font-black uppercase tracking-[0.15em] mb-2">
          EXPORT READINESS
        </p>
        <div className="bg-white/8 border border-white/10 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-xs">Score</span>
            <span
              className={`font-black text-sm ${scoreColor(kop.exportScore)}`}
              style={{ color: scoreColor(kop.exportScore) }}
            >
              {kop.exportScore}/100
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full transition-all"
              style={{
                width: kop.exportScore + "%",
                background:
                  kop.exportScore >= 80
                    ? "#b5f23d"
                    : kop.exportScore >= 60
                      ? "#f77f00"
                      : "#ef4444",
              }}
            />
          </div>
          <p
            className="text-[10px] font-bold mt-1.5"
            style={{ color: scoreColor(kop.exportScore) }}
          >
            {scoreLabel(kop.exportScore)}
          </p>
        </div>
      </div>

      {/* Konteks input */}
      <div className="px-4 pb-4 border-t border-white/10 pt-3 flex-1">
        <p className="text-white/30 text-[8px] font-black uppercase tracking-[0.15em] mb-2">
          KONTEKS TAMBAHAN
        </p>
        <textarea
          value={konteks}
          onChange={(e) => setKonteks(e.target.value)}
          placeholder="Tambahkan konteks spesifik untuk AI..."
          className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white text-xs placeholder:text-white/30 outline-none focus:border-[#f77f00]/40 resize-none"
          rows={3}
          style={{ scrollbarWidth: "none" }}
        />
      </div>
    </div>
  );

  // ── Module: Dasbor ──────────────────────────────────────────────────────
  const ModuleDasbor = () => (
    <div
      className="flex-1 overflow-y-auto p-4 lg:p-6"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="font-display font-black text-white text-xl mb-1">
            Dasbor Ekspor
          </h2>
          <p className="text-white/40 text-sm">
            {kop.name} · {kop.komoditas} · {kop.loc}
          </p>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            {
              label: "Volume",
              val: kop.volume,
              icon: <TrendingUp size={14} />,
              color: "#f77f00",
            },
            {
              label: "Target Pasar",
              val: kop.targets,
              icon: <Globe size={14} />,
              color: "#22c55e",
            },
            {
              label: "Sertifikasi",
              val: kop.cert,
              icon: <CheckCircle2 size={14} />,
              color: "#3b82f6",
            },
            {
              label: "Anggota",
              val: kop.anggota + " orang",
              icon: <Users size={14} />,
              color: "#a855f7",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-black/5 border border-black/10 rounded-xl p-3"
            >
              <div
                className="flex items-center gap-2 mb-2"
                style={{ color: item.color }}
              >
                {item.icon}
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                  {item.label}
                </span>
              </div>
              <p className="text-white font-black text-sm leading-tight">
                {item.val}
              </p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-black/5 border border-black/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[#1a2e1a] font-bold text-sm">
                Export Readiness Score
              </p>
              <span
                className="text-2xl font-black"
                style={{ color: scoreColor(kop.exportScore) }}
              >
                {kop.exportScore}
              </span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: kop.exportScore + "%" }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-2 rounded-full"
                style={{ background: scoreColor(kop.exportScore) }}
              />
            </div>
            <p
              className="text-xs font-bold mb-4"
              style={{ color: scoreColor(kop.exportScore) }}
            >
              {scoreLabel(kop.exportScore)}
            </p>
            <div className="space-y-2">
              {Object.entries(kop.scoreBreakdown).map(([key, val]) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-white/40 text-[10px] w-24 shrink-0">
                    {key}
                  </span>
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: val + "%" }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="h-1.5 rounded-full"
                      style={{ background: scoreColor(val as number) }}
                    />
                  </div>
                  <span className="text-white/60 text-[10px] w-8 text-right font-bold">
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-black/5 border border-black/10 rounded-2xl p-4">
            <p className="text-[#1a2e1a] font-bold text-sm mb-3">
              Informasi Koperasi
            </p>
            <div className="space-y-2.5">
              {[
                { label: "Harga Jual", val: kop.price },
                { label: "Bergabung", val: kop.bergabung },
                { label: "Lokasi", val: kop.loc },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0"
                >
                  <span className="text-[#4a6a4a] text-xs">
                    {item.label}
                  </span>
                  <span className="text-white text-xs font-bold">
                    {item.val}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {kop.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-[#f77f00]/10 border border-[#f77f00]/20 text-[#f77f00] text-[9px] px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-black/5 border border-black/10 rounded-2xl p-4">
          <p className="text-[#1a2e1a] font-bold text-sm mb-3">
            Mulai Konsultasi AI
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CHAT_TOPICS.slice(0, 4).map((topic) => (
              <button
                key={topic.id}
                onClick={() => startTopicChat(topic.id)}
                className="flex items-start gap-3 p-3 rounded-xl bg-black/3 border border-black/8 hover:border-[#f77f00]/30 hover:bg-[#f77f00]/5 transition-all text-left cursor-pointer group"
              >
                <span className="text-xl shrink-0">{topic.icon}</span>
                <div>
                  <p className="text-white font-bold text-xs">{topic.title}</p>
                  <p className="text-white/40 text-[10px] mt-0.5">
                    {topic.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ── Module: Chat ─────────────────────────────────────────────────────────
  const ModuleChat = () => {
    const categories = [
      "All",
      ...Array.from(new Set(CHAT_TOPICS.map((t) => t.category))),
    ];
    const filteredTopics = CHAT_TOPICS.filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(topicSearchQuery.toLowerCase()) ||
        t.desc.toLowerCase().includes(topicSearchQuery.toLowerCase());
      const matchCat =
        selectedCategory === "All" || t.category === selectedCategory;
      return matchSearch && matchCat;
    });
    const currentMessages = activeConversation?.messages ?? [];
    return (
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {!activeConversationId ? (
          <div
            className="flex-1 overflow-y-auto p-4"
            style={{ scrollbarWidth: "none" }}
          >
            <div className="max-w-2xl mx-auto">
              <div className="mb-4">
                <h3 className="text-[#1a2e1a] font-black text-base mb-1">
                  Pilih Topik Konsultasi
                </h3>
                <p className="text-[#4a6a4a] text-xs">
                  Konsultasi ekspor untuk {kop.name} — {kop.komoditas}
                </p>
              </div>
              <div
                className="flex gap-1.5 mb-3 overflow-x-auto pb-1"
                style={{ scrollbarWidth: "none" }}
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={
                      selectedCategory === cat
                        ? "shrink-0 px-3 py-1 rounded-full bg-[#f77f00]/20 border border-[#f77f00]/40 text-[#f77f00] text-[10px] font-bold cursor-pointer"
                        : "shrink-0 px-3 py-1 rounded-full bg-black/5 border border-black/10 text-[#3d5a3d] text-[10px] font-bold hover:text-[#2d472d] cursor-pointer transition-colors"
                    }
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="relative mb-3">
                <Search
                  size={12}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                />
                <input
                  value={topicSearchQuery}
                  onChange={(e) => setTopicSearchQuery(e.target.value)}
                  placeholder="Cari topik..."
                  className="w-full bg-black/5 border border-black/10 rounded-xl pl-8 pr-3 py-2 text-xs text-[#1a2e1a] placeholder:text-[#4a6a4a] outline-none focus:border-black/20"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => startTopicChat(topic.id)}
                    className="flex items-start gap-3 p-3 rounded-xl bg-black/5 border border-black/10 hover:border-[#f77f00]/40 hover:bg-[#f77f00]/5 transition-all text-left cursor-pointer"
                  >
                    <span className="text-xl shrink-0">{topic.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-xs mb-0.5">
                        {topic.title}
                      </p>
                      <p className="text-white/40 text-[10px] mb-1.5">
                        {topic.desc}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {topic.prompts.slice(0, 2).map((p) => (
                          <span
                            key={p}
                            className="bg-black/5 border border-black/10 text-[#4a6a4a] text-[9px] px-1.5 py-0.5 rounded-md truncate max-w-[140px]"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div
              className="flex-1 overflow-y-auto py-4"
              style={{ scrollbarWidth: "none" }}
            >
              {currentMessages.map((msg, i) =>
                msg.role === "user" ? (
                  <div key={i} className="flex gap-3 px-4 py-2.5 justify-end">
                    <div className="max-w-[80%]">
                      <div className="px-3.5 py-2.5 rounded-2xl rounded-tr-sm text-[#1a2e1a] text-sm leading-relaxed bg-[#f77f00]/10 border border-[#f77f00]/20">
                        {msg.content}
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[11px] font-black mt-0.5 bg-[#f77f00]/20 text-[#f77f00] border border-[#f77f00]/40">
                      {userInitial}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex gap-3 px-4 py-2.5">
                    <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[11px] mt-0.5 bg-[#f77f00]/20 border border-[#f77f00]/30">
                      🌿
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#f77f00] font-bold text-xs mb-1.5">
                        Gro AI
                      </p>
                      <div className="bg-black/5 border border-black/8 rounded-2xl rounded-tl-sm px-3.5 py-2.5">
                        <MarkdownRenderer content={msg.content} />
                      </div>
                    </div>
                  </div>
                ),
              )}
              {chatLoading && (
                <MessageSkeleton label="Gro AI sedang menganalisis..." />
              )}
              <div ref={chatEndRef} />
            </div>
            <div
              className="px-4 py-3 border-t border-black/8 shrink-0"
              style={{ background: "#f0ece0" }}
            >
              <div className="flex items-end gap-2 bg-black/5 border border-black/10 rounded-2xl px-3 py-2 focus-within:border-black/20 transition-colors">
                <textarea
                  ref={textareaRef}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendChat(chatInput);
                    }
                  }}
                  placeholder={"Tanya tentang ekspor " + kop.komoditas + "..."}
                  disabled={chatLoading}
                  rows={1}
                  className="flex-1 bg-transparent text-[#1a2e1a] text-sm placeholder:text-[#4a6a4a] resize-none outline-none leading-relaxed disabled:opacity-50 py-0.5"
                  style={{
                    scrollbarWidth: "none",
                    maxHeight: "120px",
                    overflowY: "auto",
                  }}
                />
                <button
                  onClick={() => sendChat(chatInput)}
                  disabled={chatLoading || !chatInput.trim()}
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 mb-0.5 disabled:opacity-30"
                  style={{
                    background:
                      !chatLoading && chatInput.trim()
                        ? "#f77f00"
                        : "transparent",
                    border:
                      !chatLoading && chatInput.trim()
                        ? "none"
                        : "1px solid rgba(0,0,0,0.1)",
                  }}
                >
                  <Send
                    size={14}
                    className={
                      !chatLoading && chatInput.trim()
                        ? "text-black"
                        : "text-white/40"
                    }
                  />
                </button>
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-white/20 text-[10px]">
                  Enter kirim · Shift+Enter baris baru
                </p>
                <button
                  onClick={() => setActiveConversationId(null)}
                  className="text-[#f77f00]/60 hover:text-[#f77f00] text-[10px] font-bold transition-colors"
                >
                  ← Topik lain
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // ── Module: Kalkulator ───────────────────────────────────────────────────
  const ModuleKalkulator = () => (
    <div
      className="flex-1 overflow-y-auto p-4 lg:p-6"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="mb-5">
          <h3 className="text-[#1a2e1a] font-black text-base mb-1">
            AI Kalkulator Ekspor
          </h3>
          <p className="text-[#4a6a4a] text-xs">
            Kalkulasi finansial ekspor berbasis AI untuk {kop.komoditas}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {(["logistik", "proyeksi", "bea", "breakeven"] as const).map(
            (type) => {
              const labels = {
                logistik: "Biaya Logistik",
                proyeksi: "Proyeksi Pendapatan",
                bea: "Bea Cukai",
                breakeven: "Break-Even",
              };
              return (
                <button
                  key={type}
                  onClick={() => {
                    setCalcType(type);
                    setCalcFields({});
                    setCalcResult(null);
                  }}
                  className={
                    calcType === type
                      ? "p-3 rounded-xl bg-[#f77f00]/20 border border-[#f77f00]/50 text-[#f77f00] font-bold text-xs text-left cursor-pointer"
                      : "p-3 rounded-xl bg-black/5 border border-black/10 text-[#3d5a3d] font-bold text-xs text-left hover:border-[#f77f00]/30 hover:bg-[#f77f00]/5 cursor-pointer transition-all"
                  }
                >
                  {labels[type]}
                </button>
              );
            },
          )}
        </div>
        {calcType && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-black/5 border border-black/10 rounded-2xl p-4 space-y-3">
              {CALC_FIELDS[calcType].map((field) => (
                <div key={field.key}>
                  <label className="text-white/60 text-xs font-bold mb-1 block">
                    {field.label}
                  </label>
                  <input
                    value={calcFields[field.key] ?? ""}
                    onChange={(e) =>
                      setCalcFields((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                    placeholder={field.placeholder}
                    className="w-full bg-black/5 border border-black/10 rounded-xl px-3 py-2 text-[#1a2e1a] text-sm placeholder:text-[#5a7a5a] outline-none focus:border-[#f77f00]/50 transition-colors"
                  />
                </div>
              ))}
              <button
                onClick={runCalc}
                disabled={calcLoading}
                className="w-full bg-[#f77f00] hover:bg-[#ff9f1c] text-black font-black text-sm py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {calcLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Menghitung...
                  </>
                ) : (
                  "Hitung dengan AI"
                )}
              </button>
            </div>
            {calcResult && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-[#f77f00]/20 rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#f77f00] font-black text-xs uppercase tracking-wider">
                    Hasil Kalkulasi
                  </p>
                  <button
                    onClick={() => copyToClipboard(calcResult)}
                    className="flex items-center gap-1 text-white/40 hover:text-white/70 text-[10px] transition-colors"
                  >
                    <Copy size={10} />
                    {copied ? "Tersalin!" : "Salin"}
                  </button>
                </div>
                <MarkdownRenderer content={calcResult} />
              </motion.div>
            )}
          </motion.div>
        )}
        {!calcType && (
          <div className="text-center py-12 text-white/30">
            <DollarSign size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Pilih jenis kalkulasi di atas</p>
          </div>
        )}
      </div>
    </div>
  );

  // ── Module: Dokumen ──────────────────────────────────────────────────────
  const ModuleDokumen = () => (
    <div
      className="flex-1 overflow-y-auto p-4 lg:p-6"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="mb-5">
          <h3 className="text-[#1a2e1a] font-black text-base mb-1">
            AI Dokumen Ekspor
          </h3>
          <p className="text-[#4a6a4a] text-xs">
            Generate dokumen ekspor legal berbasis AI untuk {kop.komoditas}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {(["phyto", "coo", "invoice", "packing"] as const).map((type) => {
            const labels = {
              phyto: "Phytosanitary Certificate",
              coo: "Certificate of Origin",
              invoice: "Commercial Invoice",
              packing: "Packing List",
            };
            return (
              <button
                key={type}
                onClick={() => {
                  setDokType(type);
                  setDokFields({});
                  setDokResult(null);
                }}
                className={
                  dokType === type
                    ? "p-3 rounded-xl bg-[#f77f00]/20 border border-[#f77f00]/50 text-[#f77f00] font-bold text-xs text-left cursor-pointer"
                    : "p-3 rounded-xl bg-black/5 border border-black/10 text-[#3d5a3d] font-bold text-xs text-left hover:border-[#f77f00]/30 hover:bg-[#f77f00]/5 cursor-pointer transition-all"
                }
              >
                {labels[type]}
              </button>
            );
          })}
        </div>
        {dokType && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-black/5 border border-black/10 rounded-2xl p-4 space-y-3">
              {DOK_FIELDS[dokType].map((field) => (
                <div key={field.key}>
                  <label className="text-white/60 text-xs font-bold mb-1 block">
                    {field.label}
                  </label>
                  <input
                    value={dokFields[field.key] ?? ""}
                    onChange={(e) =>
                      setDokFields((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                    placeholder={field.placeholder}
                    className="w-full bg-black/5 border border-black/10 rounded-xl px-3 py-2 text-[#1a2e1a] text-sm placeholder:text-[#5a7a5a] outline-none focus:border-[#f77f00]/50 transition-colors"
                  />
                </div>
              ))}
              <button
                onClick={runDokumen}
                disabled={dokLoading}
                className="w-full bg-[#f77f00] hover:bg-[#ff9f1c] text-black font-black text-sm py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {dokLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Membuat Dokumen...
                  </>
                ) : (
                  "Generate dengan AI"
                )}
              </button>
            </div>
            {dokResult && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-[#f77f00]/20 rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#f77f00] font-black text-xs uppercase tracking-wider">
                    Dokumen Generated
                  </p>
                  <button
                    onClick={() => copyToClipboard(dokResult)}
                    className="flex items-center gap-1 text-white/40 hover:text-white/70 text-[10px] transition-colors"
                  >
                    <Copy size={10} />
                    {copied ? "Tersalin!" : "Salin"}
                  </button>
                </div>
                <pre className="text-white/80 text-[11px] leading-relaxed whitespace-pre-wrap font-mono bg-black/20 rounded-xl p-3 overflow-x-auto">
                  {dokResult}
                </pre>
              </motion.div>
            )}
          </motion.div>
        )}
        {!dokType && (
          <div className="text-center py-12 text-white/30">
            <FileCheck size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Pilih jenis dokumen di atas</p>
          </div>
        )}
      </div>
    </div>
  );

  // ── Module: Writer ───────────────────────────────────────────────────────
  const ModuleWriter = () => (
    <div
      className="flex-1 overflow-y-auto p-4 lg:p-6"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="mb-5">
          <h3 className="text-[#1a2e1a] font-black text-base mb-1">
            AI Writer Ekspor
          </h3>
          <p className="text-[#4a6a4a] text-xs">
            Tulis konten ekspor profesional berbasis AI untuk {kop.name}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {(["proposal", "email", "katalog", "press"] as const).map((type) => {
            const labels = {
              proposal: "Proposal Ekspor",
              email: "Email ke Buyer",
              katalog: "Deskripsi Produk",
              press: "Siaran Pers",
            };
            return (
              <button
                key={type}
                onClick={() => {
                  setWriterType(type);
                  setWriterFields({});
                  setWriterResult(null);
                }}
                className={
                  writerType === type
                    ? "p-3 rounded-xl bg-[#f77f00]/20 border border-[#f77f00]/50 text-[#f77f00] font-bold text-xs text-left cursor-pointer"
                    : "p-3 rounded-xl bg-black/5 border border-black/10 text-[#3d5a3d] font-bold text-xs text-left hover:border-[#f77f00]/30 hover:bg-[#f77f00]/5 cursor-pointer transition-all"
                }
              >
                {labels[type]}
              </button>
            );
          })}
        </div>
        {writerType && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-black/5 border border-black/10 rounded-2xl p-4 space-y-3">
              {WRITER_FIELDS[writerType].map((field) => (
                <div key={field.key}>
                  <label className="text-white/60 text-xs font-bold mb-1 block">
                    {field.label}
                  </label>
                  <input
                    value={writerFields[field.key] ?? ""}
                    onChange={(e) =>
                      setWriterFields((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                    placeholder={field.placeholder}
                    className="w-full bg-black/5 border border-black/10 rounded-xl px-3 py-2 text-[#1a2e1a] text-sm placeholder:text-[#5a7a5a] outline-none focus:border-[#f77f00]/50 transition-colors"
                  />
                </div>
              ))}
              <button
                onClick={runWriter}
                disabled={writerLoading}
                className="w-full bg-[#f77f00] hover:bg-[#ff9f1c] text-black font-black text-sm py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {writerLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Menulis...
                  </>
                ) : (
                  "Tulis dengan AI"
                )}
              </button>
            </div>
            {writerResult && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-[#f77f00]/20 rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#f77f00] font-black text-xs uppercase tracking-wider">
                    Hasil Tulisan AI
                  </p>
                  <button
                    onClick={() => copyToClipboard(writerResult)}
                    className="flex items-center gap-1 text-white/40 hover:text-white/70 text-[10px] transition-colors"
                  >
                    <Copy size={10} />
                    {copied ? "Tersalin!" : "Salin"}
                  </button>
                </div>
                <MarkdownRenderer content={writerResult} />
              </motion.div>
            )}
          </motion.div>
        )}
        {!writerType && (
          <div className="text-center py-12 text-white/30">
            <Sparkles size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Pilih jenis tulisan di atas</p>
          </div>
        )}
      </div>
    </div>
  );

  // ── Module: Vision ───────────────────────────────────────────────────────
  const ModuleVision = () => (
    <div
      className="flex-1 overflow-y-auto p-4 lg:p-6"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="mb-5">
          <h3 className="text-[#1a2e1a] font-black text-base mb-1">
            AI Vision
          </h3>
          <p className="text-[#4a6a4a] text-xs">
            Analisis gambar & dokumen ekspor berbasis AI
          </p>
        </div>
        <input
          ref={visionInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleVisionUpload}
        />
        {!visionImage ? (
          <button
            onClick={() => visionInputRef.current?.click()}
            className="w-full border-2 border-dashed border-black/20 hover:border-[#f77f00]/50 rounded-2xl p-10 flex flex-col items-center gap-3 transition-all cursor-pointer group"
          >
            <Camera
              size={32}
              className="text-white/20 group-hover:text-[#f77f00]/50 transition-colors"
            />
            <div className="text-center">
              <p className="text-white/50 font-bold text-sm">
                Unggah Gambar atau Dokumen
              </p>
              <p className="text-white/30 text-xs mt-1">
                Foto produk, label, sertifikat, atau dokumen ekspor
              </p>
            </div>
          </button>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-white/10">
              <img
                src={visionImage}
                alt="Vision input"
                className="w-full max-h-64 object-contain bg-black/30"
              />
              <button
                onClick={() => {
                  setVisionImage(null);
                  setVisionResult(null);
                }}
                className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
              >
                <X size={12} className="text-white" />
              </button>
            </div>
            <button
              onClick={runVision}
              disabled={visionLoading}
              className="w-full bg-[#f77f00] hover:bg-[#ff9f1c] text-black font-black text-sm py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {visionLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Menganalisis...
                </>
              ) : (
                "Analisis dengan AI"
              )}
            </button>
            {visionResult && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-[#f77f00]/20 rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#f77f00] font-black text-xs uppercase tracking-wider">
                    Hasil Analisis
                  </p>
                  <button
                    onClick={() => copyToClipboard(visionResult)}
                    className="flex items-center gap-1 text-white/40 hover:text-white/70 text-[10px] transition-colors"
                  >
                    <Copy size={10} />
                    {copied ? "Tersalin!" : "Salin"}
                  </button>
                </div>
                <MarkdownRenderer content={visionResult} />
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // ── Main Render ──────────────────────────────────────────────────────────
  const moduleContent = {
    dasbor: <ModuleDasbor />,
    chat: <ModuleChat />,
    kalkulator: <ModuleKalkulator />,
    dokumen: <ModuleDokumen />,
    writer: <ModuleWriter />,
    vision: <ModuleVision />,
  };

  return (
    <div
      className="flex overflow-hidden w-full"
      style={{ height: "calc(100vh - 53px)" }}
    >
      {/* LEFT SIDEBAR desktop */}
      <div className="w-[260px] shrink-0 hidden lg:flex flex-col h-full border-r border-white/10">
        <SidebarInner />
      </div>

      {/* LEFT SIDEBAR mobile overlay */}
      <AnimatePresence>
        {leftOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setLeftOpen(false)}
            />
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-[260px] border-r border-white/10 overflow-y-auto"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              <SidebarInner />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <div
        className="flex-1 flex flex-col min-w-0 overflow-hidden relative"
        style={{ background: "#f5f2ea" }}
      >
        {/* Mobile header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-4 py-2.5 border-b border-black/8 lg:hidden"
          style={{ background: "#f5f2ea" }}
        >
          <button
            onClick={() => setLeftOpen(true)}
            className="p-1.5 rounded-lg bg-black/5 border border-black/10 text-[#3d5a3d]"
          >
            <Menu size={16} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[#1a2e1a] font-bold text-sm">
              {NAV.find((n) => n.id === activeModule)?.label}
            </span>
          </div>
          <button
            onClick={() => setRightOpen(true)}
            className="p-1.5 rounded-lg bg-black/5 border border-black/10 text-[#3d5a3d]"
          >
            <Building2 size={16} />
          </button>
        </div>

        {/* Module tabs (desktop) */}
        <div
          className="hidden lg:flex items-center gap-1 px-4 py-2 border-b border-black/8 overflow-x-auto shrink-0"
          style={{ scrollbarWidth: "none", background: "#f5f2ea" }}
        >
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setActiveModule(n.id)}
              className={
                activeModule === n.id
                  ? "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f77f00]/20 border border-[#f77f00]/40 text-[#f77f00] text-xs font-bold shrink-0 cursor-pointer"
                  : "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#3d5a3d] text-xs font-bold hover:text-[#2d472d] shrink-0 cursor-pointer transition-colors"
              }
            >
              {React.cloneElement(n.icon as React.ReactElement, { size: 12 })}
              {n.label}
            </button>
          ))}
        </div>

        {/* Module content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col min-h-0 overflow-hidden"
          >
            {moduleContent[activeModule]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* RIGHT PANEL desktop */}
      <div className="w-72 shrink-0 hidden lg:flex flex-col h-full border-l border-white/10">
        <RightPanelInner />
      </div>

      {/* RIGHT PANEL mobile overlay */}
      <AnimatePresence>
        {rightOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setRightOpen(false)}
            />
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-72 border-l border-white/10 overflow-y-auto"
              initial={{ x: 280 }}
              animate={{ x: 0 }}
              exit={{ x: 280 }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              <RightPanelInner />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
