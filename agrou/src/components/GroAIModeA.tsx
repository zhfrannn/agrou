import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Camera,
  Upload,
  Send,
  ShoppingCart,
  Star,
  X,
  Sprout,
  Sparkles,
  Menu,
  Plus,
  Search,
  MessageSquare,
  Globe,
  Bug,
  Droplet,
  FlaskConical,
  Waves,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { MODULES } from "../constants/gro-ai-modules";
import { MOCK_PRODUCTS } from "../constants/gro-ai-products";
import { callGroAI } from "../lib/groai-client";
import { getModeASystemPrompt } from "../lib/groai-prompts";
import { useConversations } from "../hooks/useConversations";
import { MarkdownRenderer } from "./gro-ai/shared/MarkdownRenderer";
import { MessageSkeleton } from "./gro-ai/shared/MessageSkeleton";
import type { GroAIModule } from "../types/gro-ai";
import sidebarKiriImg from "../assets/sidebar-kiri-a.png";
import sidebarKananImg from "../assets/sidebar-kanan-a.png";

// ── Component ─────────────────────────────────────────────────────────────────

export default function GroAIModeA({ onBack }: { onBack: () => void }) {
  const { user, profile } = useAuth();
  const [activeModule, setActiveModule] = useState<GroAIModule>(MODULES[0]);
  const [isNewChatMode, setIsNewChatMode] = useState(false);
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const {
    conversations,
    activeId: activeConversationId,
    setActiveId: setActiveConversationId,
    activeConversation,
    createConversation,
    appendMessage,
  } = useConversations();

  const currentMessages = activeConversation?.messages ?? [];
  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const userInitial =
    profile?.full_name?.[0]?.toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    "A";

  // ── Effects ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (currentMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentMessages.length, activeConversationId]);

  useEffect(() => {
    const msgs = activeConversation?.messages ?? [];
    setShowProducts(activeConversationId !== null && msgs.length > 2);
  }, [activeConversationId, activeConversation]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleModuleClick = (mod: GroAIModule) => {
    setIsNewChatMode(false);
    setActiveModule(mod);
    setLeftOpen(false);
    const existing = conversations.find((c) => c.moduleId === mod.id);
    setActiveConversationId(existing?.id ?? null);
  };

  const handleNewChat = () => {
    setIsNewChatMode(true);
    setActiveConversationId(null);
    setInput("");
    setImagePreview(null);
    setLeftOpen(false);
  };

  const sendMessage = async (text: string, image?: string) => {
    if (!text.trim() && !image) return;
    setIsNewChatMode(false);
    setInput("");
    setImagePreview(null);
    setLoading(true);

    const userMsg = {
      role: "user" as const,
      content: text,
      image: image || undefined,
    };
    let convId = activeConversationId;
    let history;

    if (!convId) {
      const title =
        text.length > 30
          ? text.slice(0, 30) + "..."
          : text || "Analisis Gambar";
      const welcomeMsg = {
        role: "assistant" as const,
        content: "Halo! Saya Gro AI, asisten pertanian dan perikanan Agrou. 🌱",
      };
      convId = createConversation(title, activeModule.id, welcomeMsg);
      appendMessage(convId, userMsg);
      history = [welcomeMsg, userMsg];
    } else {
      appendMessage(convId, userMsg);
      history = [...(activeConversation?.messages ?? []), userMsg];
    }

    try {
      const result = await callGroAI({
        message: text,
        systemPrompt: getModeASystemPrompt(activeModule),
        history: history
          .slice(-8)
          .map((m) => ({ role: m.role, content: m.content })),
      });
      appendMessage(convId, { role: "assistant", content: result.reply });
      setShowProducts(true);
    } catch {
      appendMessage(convId, {
        role: "assistant",
        content:
          "⚠️ Koneksi ke Gro AI bermasalah. Pastikan internet tersambung dan coba lagi.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // ── Sidebar ───────────────────────────────────────────────────────────────

  const sidebarStyle = {
    backgroundImage: `url(${sidebarKiriImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundColor: "#233226",
  };

  const SidebarInner = () => (
    <div className="flex flex-col h-full text-white/90" style={sidebarStyle}>
      {/* Header */}
      <div className="p-3 pb-2 border-b border-white/10 flex flex-col items-start">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 text-white/80 hover:text-white text-[10px] font-bold transition-all border border-white/10 cursor-pointer mb-2.5"
        >
          <ArrowLeft size={11} className="text-white/60" />
          <span>Ganti Mode</span>
        </button>
        <div className="flex items-center gap-2 px-1.5 mt-0.5">
          <div className="w-5 h-5 rounded-md bg-[#b5f23d]/20 flex items-center justify-center">
            <Sprout size={11} className="text-[#b5f23d]" />
          </div>
          <div>
            <h2 className="font-display font-black text-white text-sm leading-tight">
              Gro AI
            </h2>
            <p className="text-white/40 text-[9px]">Mode Petani & Nelayan</p>
          </div>
        </div>
      </div>

      {/* New Chat */}
      <div className="px-3 pt-3 pb-2 shrink-0">
        <button
          onClick={handleNewChat}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl bg-[#b5f23d]/15 hover:bg-[#b5f23d]/25 border border-[#b5f23d]/30 text-[#b5f23d] text-xs font-bold transition-all cursor-pointer"
        >
          <Plus size={13} />
          New Chat
        </button>
      </div>

      {/* Modules */}
      <div className="pb-1 px-3 shrink-0">
        <p className="text-white/30 text-[8px] font-black uppercase tracking-[0.15em] mb-1.5 px-1">
          MODUL
        </p>
        <div className="space-y-0.5">
          {MODULES.map((mod) => {
            const isActive = !isNewChatMode && activeModule.id === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => handleModuleClick(mod)}
                className={
                  isActive
                    ? "flex items-center gap-2 px-2.5 py-1.5 bg-[#b5f23d]/20 border-l-2 border-[#b5f23d] text-white font-bold text-xs w-full text-left rounded-r-lg transition-all cursor-pointer"
                    : "flex items-center gap-2 px-2.5 py-1.5 text-white/50 text-xs w-full text-left hover:bg-white/5 hover:text-white/80 transition-all cursor-pointer rounded-r-lg border-l-2 border-transparent"
                }
              >
                <span className="text-sm">{mod.icon}</span>
                <span className="truncate">{mod.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat history */}
      <div className="px-3 pt-2 pb-2 border-t border-white/10 mt-2 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-1.5 shrink-0">
          <p className="text-white/30 text-[8px] font-black uppercase tracking-[0.15em]">
            RIWAYAT
          </p>
        </div>
        <div className="relative mb-1.5 shrink-0">
          <Search
            size={10}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-white/30"
          />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari chat..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-6 pr-2 py-1 text-[10px] text-white placeholder:text-white/30 outline-none focus:border-white/20"
          />
        </div>
        <div
          className="space-y-0.5 overflow-y-auto flex-1"
          style={{ scrollbarWidth: "none" }}
        >
          {filteredConversations.length === 0 ? (
            <p className="text-white/20 text-[10px] text-center py-2">
              Belum ada riwayat
            </p>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => {
                  setActiveConversationId(conv.id);
                  const mod = MODULES.find((m) => m.id === conv.moduleId);
                  if (mod) setActiveModule(mod);
                  setLeftOpen(false);
                }}
                className={
                  activeConversationId === conv.id
                    ? "w-full text-left px-2 py-1 rounded-lg bg-[#b5f23d]/15 border border-[#b5f23d]/30 text-white text-[10px] font-bold truncate cursor-pointer"
                    : "w-full text-left px-2 py-1 rounded-lg text-white/50 text-[10px] hover:bg-white/5 hover:text-white/80 truncate cursor-pointer transition-colors"
                }
              >
                <MessageSquare size={9} className="inline mr-1 opacity-60" />
                {conv.title}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );

  // ── Right Panel ───────────────────────────────────────────────────────────

  const RightPanelInner = () => (
    <div
      className="h-full flex flex-col text-white p-4"
      style={{
        backgroundImage: `url(${sidebarKananImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#233226",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={13} className="text-[#b5f23d]" />
        <p className="text-[#b5f23d] text-[10px] font-black uppercase tracking-[0.15em]">
          Produk Rekomendasi
        </p>
      </div>

      {!showProducts ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-xl bg-[#b5f23d]/10 border border-[#b5f23d]/20 flex items-center justify-center mb-3">
            <ShoppingCart size={18} className="text-[#b5f23d]/50" />
          </div>
          <p className="text-white/40 text-xs font-medium leading-relaxed">
            Produk akan direkomendasikan AI setelah diagnosis.
          </p>
        </div>
      ) : (
        <div
          className="space-y-3 flex-1 overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {MOCK_PRODUCTS.map((product) => {
            const mockupEmoji =
              product.category === "Pestisida"
                ? "🧪"
                : product.category === "Pupuk"
                  ? "🌱"
                  : "🍶";
            const mockupBg =
              product.category === "Pestisida"
                ? "from-emerald-800 to-emerald-600"
                : product.category === "Pupuk"
                  ? "from-lime-700 to-lime-500"
                  : "from-teal-800 to-teal-600";
            return (
              <div
                key={product.id}
                className="rounded-xl overflow-hidden border border-[#b5f23d]/20 hover:border-[#b5f23d]/50 transition-all shadow-sm"
                style={{ backgroundColor: "#f5f0e3" }}
              >
                {/* Mockup image area */}
                <div
                  className={`h-16 bg-gradient-to-br ${mockupBg} flex items-center justify-center relative`}
                >
                  <span className="text-3xl">{mockupEmoji}</span>
                  {product.badge && (
                    <span className="absolute top-1.5 left-1.5 bg-[#b5f23d] text-black text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                      {product.badge}
                    </span>
                  )}
                </div>
                {/* Info area */}
                <div className="p-2.5">
                  <p className="text-[#1a2e1a] font-bold text-xs leading-tight mb-0.5">
                    {product.name}
                  </p>
                  <p className="text-[#3d5a3d] text-[9px] mb-2">
                    {product.category}
                  </p>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-[#2d6a2d] font-black text-sm">
                        {product.price}
                      </span>
                      <span className="text-[#4a6a4a] text-[9px] ml-0.5">
                        {product.unit}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[#4a6a4a] text-[9px]">
                      <Star
                        size={9}
                        className="text-yellow-500 fill-yellow-500"
                      />
                      {product.rating} · {product.sold}
                    </div>
                  </div>
                  <button className="w-full bg-[#b5f23d]/20 hover:bg-[#b5f23d]/40 border border-[#b5f23d]/40 text-[#1a4a1a] text-[10px] font-bold py-1.5 rounded-lg transition-colors cursor-pointer">
                    Lihat Produk
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // ── New Chat Welcome Screen ──────────────────────────────────────────────

  const NewChatWelcomeScreen = () => (
    <div
      className="flex-1 flex flex-col items-center justify-center px-4 py-4 overflow-y-auto"
      style={{ scrollbarWidth: "none" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-4 w-full max-w-md"
      >
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-[#1a3d1a]/10 border border-[#1a3d1a]/20 flex items-center justify-center mx-auto mb-3">
          <Sprout size={22} className="text-[#1a3d1a]" />
        </div>
        <h2 className="font-display font-black text-[#1a2e1a] text-xl mb-0.5">
          Gro AI
        </h2>
        <p className="text-[#3d5a3d] text-xs font-semibold mb-0.5">
          Mode Petani & Nelayan
        </p>
        <p className="text-[#5a7a5a] text-[11px]">
          Asisten AI untuk diagnosis tanaman, perikanan, dan pertanian.
        </p>
      </motion.div>

      {/* Upload area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="w-full max-w-md mb-4"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleImageUpload}
        />
        {imagePreview ? (
          <div className="relative rounded-2xl overflow-hidden border border-[#b5f23d]/30">
            <img
              src={imagePreview}
              alt="preview"
              className="w-full max-h-48 object-cover"
            />
            <button
              onClick={() => setImagePreview(null)}
              className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X size={12} className="text-white" />
            </button>
            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
              Gambar siap dikirim
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-[#1a3d1a]/20 hover:border-[#1a3d1a]/40 bg-[#1a3d1a]/5 hover:bg-[#1a3d1a]/8 rounded-lg p-5 flex flex-col items-center gap-2.5 transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#1a3d1a]/10 border border-[#1a3d1a]/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Upload size={16} className="text-[#1a3d1a]" />
            </div>
            <div className="text-center">
              <p className="text-[#1a2e1a] font-bold text-xs">
                Upload Foto Tanaman / Lahan
              </p>
              <p className="text-[#5a7a5a] text-[10px] mt-0.5">
                atau gunakan kamera untuk foto langsung
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                cameraInputRef.current?.click();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1a3d1a]/10 border border-[#1a3d1a]/20 text-[#1a2e1a] text-[10px] font-bold hover:bg-[#1a3d1a]/20 transition-colors cursor-pointer"
            >
              <Camera size={11} /> Buka Kamera
            </button>
          </div>
        )}
      </motion.div>

      {/* Ada yang bisa dibantu */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="w-full max-w-md"
      >
        <p className="text-[#5a7a5a] text-[10px] font-black uppercase tracking-[0.12em] mb-2 text-center">
          ADA YANG BISA DIBANTU?
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            {
              icon: "🌿",
              label: "Diagnosis Penyakit",
              prompt: "Tanaman saya terlihat layu dan ada bercak kuning",
            },
            {
              icon: "🐟",
              label: "Konsultasi Perikanan",
              prompt: "Ikan di kolam saya banyak yang mati mendadak",
            },
            {
              icon: "💧",
              label: "Masalah Irigasi",
              prompt: "Bagaimana sistem irigasi tetes yang efisien?",
            },
            {
              icon: "🌾",
              label: "Tips Panen",
              prompt: "Kapan waktu panen padi yang optimal?",
            },
          ].map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              onClick={() =>
                sendMessage(item.prompt, imagePreview ?? undefined)
              }
              className="flex items-start gap-2 p-3 rounded-xl bg-black/5 border border-black/8 hover:border-[#b5f23d]/50 hover:bg-[#b5f23d]/8 transition-all text-left cursor-pointer group"
            >
              <span className="text-base shrink-0 mt-0.5">{item.icon}</span>
              <div>
                <p className="text-[#1a2e1a] font-bold text-xs leading-tight">
                  {item.label}
                </p>
                <p className="text-[#5a7a5a] text-[10px] mt-0.5 leading-snug line-clamp-2">
                  {item.prompt}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );

  // ── Welcome Screen ────────────────────────────────────────────────────────

  const WelcomeScreen = () => (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-6"
      >
        <div className="w-14 h-14 rounded-2xl bg-[#b5f23d]/10 border border-[#b5f23d]/20 flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">{activeModule.icon}</span>
        </div>
        <h2 className="font-display font-black text-[#b5f23d] text-xl mb-1">
          {activeModule.label}
        </h2>
        <p className="text-[#3d5a3d] text-sm">{activeModule.desc}</p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
        {activeModule.prompts.map((prompt, i) => (
          <motion.button
            key={prompt}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => sendMessage(prompt)}
            className="text-left p-3 rounded-xl bg-black/5 border border-black/10 hover:border-[#b5f23d]/60 hover:bg-[#b5f23d]/10 transition-all text-[#2d472d] hover:text-[#1a2e1a] text-xs leading-relaxed cursor-pointer"
          >
            <Sparkles
              size={10}
              className="text-[#b5f23d] mb-1.5 inline-block mr-1"
            />
            {prompt}
          </motion.button>
        ))}
      </div>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────

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
          className="sticky top-0 z-10 flex items-center justify-between px-4 py-2.5 border-b border-white/8 lg:hidden"
          style={{ background: "#f5f2ea" }}
        >
          <button
            onClick={() => setLeftOpen(true)}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-[#1a2e1a]/50"
          >
            <Menu size={16} />
          </button>
          <div className="flex items-center gap-2">
            {!isNewChatMode && (
              <span className="text-sm">{activeModule.icon}</span>
            )}
            <span className="text-[#1a2e1a] font-bold text-sm">
              {isNewChatMode ? "Gro AI" : activeModule.label}
            </span>
          </div>
          <button
            onClick={() => setRightOpen(true)}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-[#1a2e1a]/50"
          >
            <ShoppingCart size={16} />
          </button>
        </div>

        {/* Quick prompts bar */}
        {activeConversationId && currentMessages.length > 0 && (
          <div
            className="px-4 py-2 border-b border-black/5 overflow-x-auto flex gap-2 shrink-0"
            style={{ scrollbarWidth: "none" }}
          >
            {activeModule.prompts.map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                disabled={loading}
                className="shrink-0 text-[10px] text-[#1a2e1a]/50 bg-black/5 border border-black/10 hover:border-[#b5f23d]/30 hover:text-[#1a2e1a]/80 px-2.5 py-1 rounded-full transition-colors disabled:opacity-40"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Messages or Welcome */}
        {isNewChatMode ? (
          <NewChatWelcomeScreen />
        ) : !activeConversationId ? (
          <WelcomeScreen />
        ) : (
          <div
            className="flex-1 overflow-y-auto py-4"
            style={{ scrollbarWidth: "none" }}
          >
            {currentMessages.map((msg, i) =>
              msg.role === "user" ? (
                <div key={i} className="flex gap-3 px-4 py-2.5 justify-end">
                  <div className="max-w-[80%] space-y-1">
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="upload"
                        className="w-full max-w-xs rounded-xl border border-white/10 mb-1"
                      />
                    )}
                    <div className="px-3.5 py-2.5 rounded-2xl rounded-tr-sm text-[#1a2e1a] text-sm leading-relaxed bg-[#b5f23d]/10 border border-[#b5f23d]/20">
                      {msg.content}
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[11px] font-black mt-0.5 bg-[#b5f23d]/20 text-[#b5f23d] border border-[#b5f23d]/40">
                    {userInitial}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex gap-3 px-4 py-2.5">
                  <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[11px] mt-0.5 bg-[#b5f23d]/20 border border-[#b5f23d]/30">
                    🌱
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#b5f23d] font-bold text-xs mb-1.5">
                      Gro AI
                    </p>
                    <div className="bg-black/5 border border-black/8 rounded-2xl rounded-tl-sm px-3.5 py-2.5">
                      <MarkdownRenderer content={msg.content} />
                    </div>
                  </div>
                </div>
              ),
            )}
            {loading && (
              <MessageSkeleton label="Gro AI sedang menganalisis..." />
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input area */}
        <div
          className="px-4 py-3 border-t border-white/8 shrink-0"
          style={{ background: "#f0ece0" }}
        >
          {imagePreview && (
            <div className="relative inline-block mb-2 ml-1">
              <img
                src={imagePreview}
                alt="preview"
                className="h-14 w-auto rounded-lg border border-white/20"
              />
              <button
                onClick={() => setImagePreview(null)}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
              >
                <X size={8} className="text-white" />
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleImageUpload}
          />
          <div className="flex items-end gap-2 bg-black/5 border border-black/10 rounded-2xl px-3 py-2 focus-within:border-black/20 transition-colors">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-[#1a2e1a]/70 hover:bg-black/8 transition-colors shrink-0"
            >
              <Camera size={15} />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-[#1a2e1a]/70 hover:bg-black/8 transition-colors shrink-0"
            >
              <Upload size={15} />
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input, imagePreview ?? undefined);
                }
              }}
              onInput={(e) => {
                const t = e.currentTarget;
                t.style.height = "auto";
                t.style.height = Math.min(t.scrollHeight, 120) + "px";
              }}
              placeholder="Ceritakan masalah tanaman atau lahanmu..."
              disabled={loading}
              rows={1}
              className="flex-1 bg-transparent text-[#1a2e1a] text-sm placeholder:text-[#1a2e1a]/40 resize-none outline-none leading-relaxed disabled:opacity-50 py-0.5"
              style={{
                scrollbarWidth: "none",
                maxHeight: "120px",
                overflowY: "auto",
              }}
            />
            <button
              onClick={() => sendMessage(input, imagePreview ?? undefined)}
              disabled={loading || (!input.trim() && !imagePreview)}
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 mb-0.5 disabled:opacity-30"
              style={{
                background:
                  !loading && (input.trim() || imagePreview)
                    ? "#b5f23d"
                    : "transparent",
                border:
                  !loading && (input.trim() || imagePreview)
                    ? "none"
                    : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Send
                size={14}
                className={
                  !loading && (input.trim() || imagePreview)
                    ? "text-black"
                    : "text-white/40"
                }
              />
            </button>
          </div>
          <p className="text-[#1a2e1a]/30 text-[10px] text-center mt-1.5">
            Enter kirim · Shift+Enter baris baru
          </p>
        </div>
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
