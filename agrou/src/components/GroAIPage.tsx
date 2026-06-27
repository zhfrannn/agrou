import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import {
  Sprout,
  Building2,
  ArrowRight,
  Sparkles,
  Shield,
  TrendingUp,
  FileCheck,
  Globe,
  ArrowLeft,
  Camera,
  Upload,
  Send,
  Bug,
  Droplets,
  FlaskConical,
  Fish,
  Mountain,
  ShoppingCart,
  Star,
  X,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";

export default function GroAIPage() {
  const [selected, setSelected] = useState<"petani" | "koperasi" | null>(null);

  if (selected === "petani") {
    return <GroAIChatMode onBack={() => setSelected(null)} />;
  }
  if (selected === "koperasi") {
    return <GroAIDashboardMode onBack={() => setSelected(null)} />;
  }

  return <GroAISelector onSelect={setSelected} />;
}

interface SelectorProps {
  onSelect: (role: "petani" | "koperasi") => void;
}

function GroAISelector({ onSelect }: SelectorProps) {
  return (
    <div
      className="min-h-[calc(100vh-76px)] flex flex-col items-center justify-center px-4 sm:px-8 py-6 lg:py-10 relative overflow-hidden"
      style={{
        backgroundImage: "url('/src/assets/gro-ai-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#0d2918",
      }}
    >
      {/* Animated background dots */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #b5f23d 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Blob decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#b5f23d]/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#f77f00]/5 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6 lg:mb-8 relative z-10"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#b5f23d]/10 border border-[#b5f23d]/30 text-[#b5f23d] text-[10px] font-black tracking-[0.15em] px-3.5 py-1.5 rounded-full mb-3 uppercase">
          <Sparkles size={10} />
          Gro AI — Powered by Anthropic Claude
        </div>

        <h1 className="font-display font-black text-white text-3xl lg:text-4xl leading-[1.1] mb-1.5">
          Kamu siapa
          <span className="text-[#b5f23d] italic"> hari ini?</span>
        </h1>

        <p className="text-white/60 text-sm lg:text-base max-w-md mx-auto font-medium leading-relaxed">
          Gro AI akan menyesuaikan bantuan berdasarkan kebutuhanmu — diagnosis
          lahan atau konsultasi ekspor.
        </p>
      </motion.div>

      {/* Two Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 w-full max-w-5xl relative z-10">
        {/* Card 1 — Petani/Nelayan */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onClick={() => onSelect("petani")}
          className="group relative overflow-hidden rounded-3xl p-6 text-left cursor-pointer bg-linear-to-br from-white/8 via-white/5 to-transparent border border-white/10 hover:border-[#b5f23d]/50 hover:shadow-[0_0_60px_rgba(181,242,61,0.12),inset_0_1px_0_rgba(181,242,61,0.1)] transition-all duration-400"
        >
          {/* Inner glow layer */}
          <div className="absolute inset-0 bg-linear-to-br from-[#b5f23d]/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-3xl" />

          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#b5f23d]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#b5f23d]/10 transition-all duration-400 -translate-y-1/2 translate-x-1/2" />

          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-[#b5f23d]/10 border border-[#b5f23d]/20 flex items-center justify-center mb-4 group-hover:bg-[#b5f23d]/20 group-hover:border-[#b5f23d]/50 group-hover:shadow-[0_0_20px_rgba(181,242,61,0.2)] transition-all duration-305">
            <Sprout size={24} className="text-[#b5f23d]" />
          </div>

          {/* Label */}
          <div className="text-[#b5f23d] text-[9px] font-black tracking-[0.15em] uppercase mb-2">
            Mode A
          </div>

          {/* Title */}
          <h2 className="font-display font-black text-white text-xl leading-tight mb-2">
            Saya Petani
            <br />
            atau Nelayan
          </h2>

          {/* Desc */}
          <p className="text-white/50 text-xs lg:text-sm leading-relaxed mb-4 font-medium">
            Diagnosis masalah lahan, rekomendasi produk tepat, dan panduan
            budidaya berbasis AI.
          </p>

          {/* Features */}
          <div className="space-y-1.5 mb-4">
            {[
              "Diagnosis gejala lahan & tanaman",
              "Rekomendasi pestisida & pupuk",
              "Panduan budidaya komoditas",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#b5f23d] rounded-full shrink-0" />
                <span className="text-white/60 text-xs font-medium">{f}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2 text-[#b5f23d] font-black text-sm group-hover:gap-4 transition-all duration-300">
            Mulai Diagnosis
            <ArrowRight size={16} />
          </div>
        </motion.button>

        {/* Card 2 — Koperasi/Unit Usaha */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onClick={() => onSelect("koperasi")}
          className="group relative overflow-hidden rounded-3xl p-6 text-left cursor-pointer bg-linear-to-br from-white/8 via-white/5 to-transparent border border-white/10 hover:border-[#f77f00]/50 hover:shadow-[0_0_60px_rgba(247,127,0,0.12),inset_0_1px_0_rgba(247,127,0,0.1)] transition-all duration-400"
        >
          {/* Inner glow layer */}
          <div className="absolute inset-0 bg-linear-to-br from-[#f77f00]/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-3xl" />

          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#f77f00]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#f77f00]/10 transition-all duration-400 -translate-y-1/2 translate-x-1/2" />

          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-[#f77f00]/10 border border-[#f77f00]/20 flex items-center justify-center mb-4 group-hover:bg-[#f77f00]/20 group-hover:border-[#f77f00]/50 group-hover:shadow-[0_0_20px_rgba(247,127,0,0.2)] transition-all duration-305">
            <Building2 size={24} className="text-[#f77f00]" />
          </div>

          {/* Label */}
          <div className="text-[#f77f00] text-[9px] font-black tracking-[0.15em] uppercase mb-2">
            Mode B
          </div>

          {/* Title */}
          <h2 className="font-display font-black text-white text-xl leading-tight mb-2">
            Saya Koperasi
            <br />
            atau Unit Usaha
          </h2>

          {/* Desc */}
          <p className="text-white/50 text-xs lg:text-sm leading-relaxed mb-4 font-medium">
            Konsultasi ekspor, analisis regulasi pasar global, dan dokumen
            kelayakan ekspor berbasis AI.
          </p>

          {/* Features */}
          <div className="space-y-1.5 mb-4">
            {[
              "Konsultasi regulasi ekspor global",
              "Export readiness score & checklist",
              "Analisis harga pasar internasional",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#f77f00] rounded-full shrink-0" />
                <span className="text-white/60 text-xs font-medium">{f}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2 text-[#f77f00] font-black text-sm group-hover:gap-4 transition-all duration-300">
            Mulai Konsultasi
            <ArrowRight size={16} />
          </div>
        </motion.button>
      </div>

      {/* Bottom note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-white/30 text-xs mt-6 lg:mt-8 text-center relative z-10"
      >
        Gro AI menggunakan data regulasi terkini dari Kementan, BPOM, dan
        database ekspor internasional.
      </motion.p>
    </div>
  );
}

// ─── CONSTANTS ──────────────────────────────────────────────────────────────

const MODULES = [
  {
    id: "tanaman",
    icon: "🌱",
    label: "Masalah Tanaman",
    desc: "Gejala daun, batang, buah",
    prompts: [
      "Daun tanaman saya menguning dan rontok",
      "Batang tanaman membusuk di bagian bawah",
      "Buah tidak berkembang dan rontok sebelum matang",
      "Tanaman layu meski sudah disiram",
    ],
  },
  {
    id: "lahan",
    icon: "🌍",
    label: "Masalah Lahan",
    desc: "pH, drainase, kesuburan",
    prompts: [
      "Tanah saya keras dan retak-retak",
      "Air tidak meresap ke tanah setelah hujan",
      "Hasil panen terus menurun tiap musim",
      "Tanah berbau tidak sedap",
    ],
  },
  {
    id: "hama",
    icon: "🐛",
    label: "Hama & Penyakit",
    desc: "Identifikasi & penanganan",
    prompts: [
      "Ada bercak coklat di daun padi saya",
      "Tanaman terserang ulat dan berlubang",
      "Muncul jamur putih di permukaan tanah",
      "Buah banyak yang busuk sebelum panen",
    ],
  },
  {
    id: "air",
    icon: "💧",
    label: "Kebutuhan Air",
    desc: "Irigasi & kelembaban",
    prompts: [
      "Berapa kebutuhan air untuk padi per hari?",
      "Cara mengatur irigasi untuk cabai",
      "Tanaman overdosis air, gejalanya apa?",
      "Sistem irigasi tetes untuk sayuran",
    ],
  },
  {
    id: "nutrisi",
    icon: "🧪",
    label: "Nutrisi & Pupuk",
    desc: "Defisiensi unsur hara",
    prompts: [
      "Tanaman kerdil dan daun pucat",
      "Kapan waktu terbaik pemupukan padi?",
      "Dosis pupuk NPK untuk jagung 1 hektar",
      "Tanda-tanda kekurangan kalium pada tanaman",
    ],
  },
  {
    id: "laut",
    icon: "🐟",
    label: "Budidaya Laut",
    desc: "Tambak, keramba, rumput laut",
    prompts: [
      "Udang saya mati mendadak di tambak",
      "Cara budidaya rumput laut yang benar",
      "Penyakit white spot pada udang vaname",
      "Kualitas air tambak yang ideal untuk udang",
    ],
  },
];

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Fungisida Tricyclazole 75WP",
    category: "Pestisida",
    price: "Rp 75.000",
    unit: "/250gr",
    rating: 4.8,
    sold: "1.2rb",
    badge: "Rekomendasi AI",
  },
  {
    id: 2,
    name: "Pupuk NPK Mutiara 16-16-16",
    category: "Pupuk",
    price: "Rp 55.000",
    unit: "/kg",
    rating: 4.6,
    sold: "3.4rb",
    badge: "Terlaris",
  },
  {
    id: 3,
    name: "Probiotik EM4 Pertanian 1L",
    category: "Probiotik",
    price: "Rp 28.000",
    unit: "/botol",
    rating: 4.7,
    sold: "5.1rb",
    badge: null,
  },
];

// ─── KOMPONEN GroAIChatMode ──────────────────────────────────────────────────

function GroAIChatMode({ onBack }: { onBack: () => void }) {
  const [activeModule, setActiveModule] = useState(MODULES[0]);
  const [messages, setMessages] = useState<
    Array<{
      role: "user" | "assistant";
      content: string;
      image?: string;
    }>
  >([
    {
      role: "assistant",
      content:
        "Halo! Saya Gro AI, asisten pertanian dan perikanan Agrou. 🌱\n\nCeritakan masalah lahan atau tanaman kamu — atau pilih modul di sebelah kiri untuk mulai. Kamu juga bisa foto langsung kondisi tanaman/lahan untuk diagnosis lebih akurat.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string, image?: string) => {
    if (!text.trim() && !image) return;

    const userMsg = { role: "user" as const, content: text, image };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setImagePreview(null);
    setLoading(true);

    try {
      const WORKER_URL = import.meta.env.VITE_WORKER_URL;

      const systemPrompt = `Kamu adalah Gro AI, asisten pertanian dan perikanan cerdas dari platform Agrou Indonesia.

Tugasmu:
1. Diagnosis masalah tanaman, lahan, hama, dan budidaya perikanan
2. Berikan rekomendasi solusi yang praktis dan spesifik
3. Rekomendasikan produk yang tersedia di Agrou Tani (pestisida, pupuk, benih, probiotik)
4. Gunakan bahasa Indonesia yang ramah dan mudah dipahami petani

Format responmu SELALU dalam struktur ini:
**🔍 Diagnosis:**
[Analisis masalah]

**⚠️ Tingkat Urgensi:** [Rendah/Sedang/Tinggi/Kritis]

**✅ Langkah Penanganan:**
1. [Langkah 1]
2. [Langkah 2]
3. [Langkah 3]

**🛒 Produk Rekomendasi di Agrou Tani:**
- [Nama produk 1] — [alasan]
- [Nama produk 2] — [alasan]

**💡 Tips Pencegahan:**
[Tips singkat]

Modul aktif saat ini: ${activeModule.label}
Selalu berikan jawaban yang actionable dan spesifik.`;

      const history = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-8)
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));

      const response = await fetch(`${WORKER_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text || "Tolong analisis gambar ini dan berikan diagnosis.",
          history,
          image,
          module: activeModule.id,
          systemPrompt,
        }),
      });

      if (!response.ok) throw new Error(`Worker error: ${response.status}`);

      const data = await response.json();
      const aiText = data.reply || "Maaf, terjadi kesalahan. Coba lagi ya.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: aiText,
        },
      ]);

      setShowProducts(true);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Maaf, koneksi ke Gro AI bermasalah. Pastikan API key sudah benar dan coba lagi.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const formatMessage = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <p
            key={i}
            className="font-bold text-(--color-forest-dark) mt-3 mb-1 text-sm"
          >
            {line.replace(/\*\*/g, "")}
          </p>
        );
      }
      if (line.match(/^\d+\./)) {
        return (
          <p
            key={i}
            className="text-sm text-(--color-text-primary) ml-3 mb-0.5"
          >
            {line}
          </p>
        );
      }
      if (line.startsWith("- ")) {
        return (
          <p
            key={i}
            className="text-sm text-(--color-text-primary) ml-3 mb-0.5 flex gap-2"
          >
            <span className="text-(--color-lime-dark) shrink-0">•</span>
            {line.slice(2)}
          </p>
        );
      }
      if (line.trim() === "") return <br key={i} />;
      return (
        <p key={i} className="text-sm text-(--color-text-primary) mb-0.5">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-(--color-cream) flex flex-col">
      {/* Top Bar */}
      <div className="bg-(--color-forest-dark) border-b border-white/10 px-8 py-3 flex items-center gap-4 sticky top-0 z-30">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium cursor-pointer"
        >
          <ArrowLeft size={16} />
          Ganti Mode
        </button>
        <div className="w-px h-5 bg-white/20" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#b5f23d] rounded-full animate-pulse" />
          <span className="text-white font-bold text-sm">
            Gro AI — Mode Petani & Nelayan
          </span>
        </div>
        <div className="ml-auto">
          <span className="bg-[#b5f23d]/10 border border-[#b5f23d]/30 text-[#b5f23d] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
            🌱 {activeModule.label}
          </span>
        </div>
      </div>

      {/* Main 3-column layout */}
      <div className="flex flex-1 max-w-360 mx-auto w-full px-6 py-6 gap-5">
        {/* SIDEBAR KIRI — Modules */}
        <div className="w-56 shrink-0 space-y-2 sticky top-20 self-start">
          <p className="text-(--color-text-secondary) text-[10px] font-black uppercase tracking-widest mb-3 px-1">
            Pilih Modul
          </p>
          {MODULES.map((mod) => (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod)}
              className={`w-full text-left px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer
                ${
                  activeModule.id === mod.id
                    ? "bg-(--color-forest) text-white shadow-md"
                    : "bg-white border border-(--color-border) text-(--color-text-primary) hover:border-(--color-forest) hover:bg-(--color-forest)/5"
                }`}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-base">{mod.icon}</span>
                <span className="font-bold text-xs">{mod.label}</span>
              </div>
              <p
                className={`text-[10px] ml-6
                ${
                  activeModule.id === mod.id
                    ? "text-white/60"
                    : "text-(--color-text-secondary)"
                }`}
              >
                {mod.desc}
              </p>
            </button>
          ))}
        </div>

        {/* TENGAH — Chat */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl border border-(--color-border) overflow-hidden shadow-[0_4px_24px_rgba(26,61,46,0.06)]">
          {/* Quick prompts */}
          <div className="px-4 py-3 border-b border-(--color-border) bg-(--color-cream)">
            <p className="text-[10px] font-black text-(--color-text-secondary) uppercase tracking-widest mb-2">
              Pertanyaan Cepat — {activeModule.label}
            </p>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {activeModule.prompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(p)}
                  className="shrink-0 bg-white border border-(--color-border) text-(--color-text-primary) text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap hover:border-(--color-forest) hover:text-(--color-forest) transition-all cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0"
            style={{ maxHeight: "calc(100vh - 340px)" }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-sm font-black
                  ${
                    msg.role === "assistant"
                      ? "bg-(--color-forest) text-white"
                      : "bg-(--color-orange) text-white"
                  }`}
                >
                  {msg.role === "assistant" ? "G" : "U"}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3
                  ${
                    msg.role === "user"
                      ? "bg-(--color-forest) text-white rounded-tr-none"
                      : "bg-(--color-cream) border border-(--color-border) rounded-tl-none"
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="uploaded"
                      className="w-full max-w-xs rounded-xl mb-3 object-cover"
                    />
                  )}
                  {msg.role === "user" ? (
                    <p className="text-sm text-white">{msg.content}</p>
                  ) : (
                    <div>{formatMessage(msg.content)}</div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-(--color-forest) flex items-center justify-center text-white font-black text-sm shrink-0">
                  G
                </div>
                <div className="bg-(--color-cream) border border-(--color-border) rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                  <Loader2
                    size={14}
                    className="text-(--color-forest) animate-spin"
                  />
                  <span className="text-xs text-(--color-text-secondary)">
                    Gro AI sedang menganalisis...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Image preview */}
          {imagePreview && (
            <div className="px-4 py-2 border-t border-(--color-border) bg-(--color-cream)">
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="h-20 w-20 object-cover rounded-xl border border-(--color-border)"
                />
                <button
                  onClick={() => setImagePreview(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center cursor-pointer"
                >
                  <X size={10} />
                </button>
              </div>
            </div>
          )}

          {/* Input bar */}
          <div className="px-4 py-3 border-t border-(--color-border) bg-white flex items-end gap-3">
            {/* Camera */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleImageUpload}
            />
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="w-10 h-10 rounded-xl bg-(--color-cream) border border-(--color-border) flex items-center justify-center hover:border-(--color-forest) hover:bg-(--color-forest)/5 transition-all shrink-0 cursor-pointer"
            >
              <Camera
                size={18}
                className="text-(--color-text-secondary)"
              />
            </button>

            {/* Upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-10 h-10 rounded-xl bg-(--color-cream) border border-(--color-border) flex items-center justify-center hover:border-(--color-forest) hover:bg-(--color-forest)/5 transition-all shrink-0 cursor-pointer"
            >
              <Upload
                size={18}
                className="text-(--color-text-secondary)"
              />
            </button>

            {/* Text input */}
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input, imagePreview || undefined);
                }
              }}
              placeholder="Ceritakan masalah tanaman atau lahan kamu..."
              rows={1}
              className="flex-1 resize-none bg-(--color-cream) border border-(--color-border) rounded-xl px-4 py-2.5 text-sm text-(--color-text-primary) placeholder:text-(--color-text-secondary) focus:outline-none focus:border-(--color-forest) transition-all max-h-32"
            />

            {/* Send */}
            <button
              onClick={() => sendMessage(input, imagePreview || undefined)}
              disabled={loading || (!input.trim() && !imagePreview)}
              className="w-10 h-10 rounded-xl bg-(--color-forest) flex items-center justify-center hover:bg-(--color-forest-dark) disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 cursor-pointer"
            >
              <Send size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* SIDEBAR KANAN — Rekomendasi Produk */}
        <div className="w-64 shrink-0 sticky top-20 self-start space-y-4">
          {showProducts ? (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-black text-(--color-text-secondary) uppercase tracking-widest">
                  Rekomendasi Produk
                </p>
                <span className="bg-[#b5f23d]/15 text-(--color-forest) text-[9px] font-black px-2 py-0.5 rounded-full">
                  AI Pick
                </span>
              </div>

              {MOCK_PRODUCTS.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-(--color-border) overflow-hidden hover:shadow-[0_4px_20px_rgba(26,61,46,0.1)] hover:-translate-y-0.5 transition-all duration-200"
                >
                  {/* Image placeholder */}
                  <div className="h-28 bg-(--color-cream) flex items-center justify-center relative">
                    <span className="text-4xl">🌿</span>
                    {product.badge && (
                      <span className="absolute top-2 left-2 bg-[#b5f23d] text-(--color-forest-dark) text-[8px] font-black px-2 py-0.5 rounded-full">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <div className="p-3">
                    <span className="text-(--color-forest)/70 text-[9px] font-bold uppercase tracking-wide">
                      {product.category}
                    </span>
                    <p className="font-bold text-xs text-(--color-forest-dark) leading-snug mt-0.5 mb-1">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-1 mb-2">
                      <Star
                        size={10}
                        className="text-amber-400 fill-amber-400"
                      />
                      <span className="text-xs font-bold text-(--color-text-primary)">
                        {product.rating}
                      </span>
                      <span className="text-(--color-text-secondary) text-[10px]">
                        ({product.sold} terjual)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-(--color-orange) font-black text-sm">
                          {product.price}
                        </span>
                        <span className="text-(--color-text-secondary) text-[10px]">
                          {product.unit}
                        </span>
                      </div>
                      <button className="bg-(--color-forest) text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg hover:bg-(--color-forest-dark) transition-all flex items-center gap-1 cursor-pointer">
                        <ShoppingCart size={10} />
                        Beli
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button className="w-full text-center text-(--color-orange) font-bold text-xs py-3 border border-(--color-border) rounded-xl bg-white hover:border-(--color-orange) transition-all cursor-pointer">
                Lihat semua di Agrou Tani →
              </button>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-(--color-border) p-5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-(--color-forest)/8 flex items-center justify-center mx-auto mb-3">
                <Sprout size={20} className="text-(--color-forest)" />
              </div>
              <p className="font-bold text-sm text-(--color-forest-dark) mb-1">
                Rekomendasi Produk
              </p>
              <p className="text-(--color-text-secondary) text-xs leading-relaxed">
                Kirim pertanyaan dulu — Gro AI akan merekomendasikan produk yang
                tepat dari Agrou Tani.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ModeProps {
  onBack: () => void;
}

function GroAIDashboardMode({ onBack }: ModeProps) {
  return (
    <div className="min-h-screen bg-(--color-cream) flex items-center justify-center">
      <div className="text-center">
        <button
          onClick={onBack}
          className="text-(--color-forest) font-bold mb-4 block cursor-pointer"
        >
          ← Kembali
        </button>
        <p className="text-(--color-text-secondary)">
          Mode B — Dashboard coming soon
        </p>
      </div>
    </div>
  );
}
