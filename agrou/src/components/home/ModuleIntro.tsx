import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Leaf,
  Sprout,
  Wheat,
  Fish,
  ArrowRight,
  ShoppingCart,
  Bot,
  Send,
  Leaf as LeafIcon,
  ShoppingBag,
  Building2,
  Search,
  MapPin,
  Star,
  CheckCircle2,
} from "lucide-react";

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ DATA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const TANI_CARDS = [
  {
    icon: Leaf,
    bg: "bg-[#E8720C]",
    name: "Pestisida & Fungisida",
    desc: "Lindungi tanaman dari hama & penyakit",
  },
  {
    icon: Sprout,
    bg: "bg-[#2D6A4F]",
    name: "Pupuk & Nutrisi",
    desc: "Tingkatkan hasil panen maksimal",
  },
  {
    icon: Wheat,
    bg: "bg-[#D4A017]",
    name: "Benih Unggul",
    desc: "Varietas pilihan untuk lahan produktif",
  },
  {
    icon: Fish,
    bg: "bg-[#0077B6]",
    name: "Probiotik Budidaya",
    desc: "Nutrisi khusus untuk ikan & udang",
  },
];

const PASAR_CARDS = [
  {
    badge: "Kopi Gayo",
    name: "Kopi Arabika Natural",
    bullets: ["Grade 1 Premium", "Natural Process", "Bener Meriah"],
    price: "Rp 180.000/kg",
    image:
      "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=600",
    koperasi: "Koperasi Gayo Mandiri",
  },
  {
    badge: "Hasil Laut",
    name: "Ikan Tuna Segar",
    bullets: ["Tangkapan Harian", "Nelayan Langsung", "Aceh Besar"],
    price: "Rp 85.000/kg",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600",
    koperasi: "KUD Sari Laut",
  },
  {
    badge: "Budidaya",
    name: "Udang Vaname Segar",
    bullets: ["Bebas Antibiotik", "Budidaya Bersih", "Lampung"],
    price: "Rp 65.000/kg",
    image:
      "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&q=80&w=600",
    koperasi: "KUD Nelayan Mandiri",
  },
];

/* â”€â”€â”€ Chatbot sub-options data â”€â”€â”€ */

const TANI_PROBLEMS = [
  { id: "hama", emoji: "ðŸ›", label: "Serangan Hama" },
  { id: "jamur", emoji: "ðŸ„", label: "Penyakit Jamur" },
  { id: "nutrisi", emoji: "ðŸŒ±", label: "Defisiensi Nutrisi" },
  { id: "air", emoji: "ðŸ’§", label: "Masalah Kualitas Air" },
];

const TANI_RESULTS: Record<
  string,
  { title: string; desc: string; products: string[] }
> = {
  hama: {
    title: "Solusi Anti-Hama",
    desc: "Berdasarkan keluhan serangan hama, berikut rekomendasi produk:",
    products: [
      "Insektisida Imidakloprid 100ml",
      "Perangkap Hama Kuning 10pcs",
      "Pestisida Nabati 500ml",
    ],
  },
  jamur: {
    title: "Solusi Anti-Jamur",
    desc: "Untuk penyakit jamur pada tanaman, kami rekomendasikan:",
    products: [
      "Fungisida Mankozeb 200g",
      "Fungisida Sistemik 100ml",
      "Nutrisi Anti-Stres Daun 500ml",
    ],
  },
  nutrisi: {
    title: "Paket Nutrisi Tanaman",
    desc: "Tingkatkan kesehatan tanaman dengan nutrisi yang tepat:",
    products: [
      "Pupuk NPK 16-16-16 1kg",
      "Pupuk Organik Cair 1L",
      "Trace Element Mikro 500ml",
    ],
  },
  air: {
    title: "Pemulihan Kualitas Air",
    desc: "Solusi untuk masalah kualitas air budidaya:",
    products: [
      "Probiotik Nitrifikasi 1L",
      "Zeolit Penyerap Amonia 2kg",
      "Kapur Dolomit 2kg",
    ],
  },
};

const PASAR_CATEGORIES = [
  { id: "kopi", emoji: "â˜•", label: "Kopi & Rempah" },
  { id: "laut", emoji: "ðŸŸ", label: "Hasil Laut" },
  { id: "sayur", emoji: "ðŸ¥¬", label: "Sayur & Buah" },
  { id: "beras", emoji: "ðŸš", label: "Beras & Biji" },
];

const PASAR_RESULTS: Record<
  string,
  { title: string; items: { name: string; price: string; origin: string }[] }
> = {
  kopi: {
    title: "Produk Kopi & Rempah Tersedia",
    items: [
      {
        name: "Kopi Arabika Gayo",
        price: "Rp 180.000/kg",
        origin: "Bener Meriah",
      },
      {
        name: "Kopi Robusta Lampung",
        price: "Rp 95.000/kg",
        origin: "Lampung Barat",
      },
    ],
  },
  laut: {
    title: "Produk Hasil Laut Segar",
    items: [
      { name: "Ikan Tuna Segar", price: "Rp 85.000/kg", origin: "Aceh Besar" },
      { name: "Udang Vaname Segar", price: "Rp 65.000/kg", origin: "Lampung" },
    ],
  },
  sayur: {
    title: "Sayur & Buah Segar",
    items: [
      {
        name: "Cabai Merah Keriting",
        price: "Rp 45.000/kg",
        origin: "Cianjur",
      },
      { name: "Tomat Organik", price: "Rp 25.000/kg", origin: "Lembang" },
    ],
  },
  beras: {
    title: "Beras & Biji-bijian",
    items: [
      { name: "Beras Pandan Wangi", price: "Rp 18.000/kg", origin: "Cianjur" },
      {
        name: "Beras Merah Organik",
        price: "Rp 28.000/kg",
        origin: "Boyolali",
      },
    ],
  },
};

const KOPERASI_NEEDS = [
  { id: "pertanian", emoji: "ðŸŒ¾", label: "Pertanian" },
  { id: "perikanan", emoji: "ðŸŸ", label: "Perikanan" },
  { id: "perkebunan", emoji: "ðŸŒ´", label: "Perkebunan" },
  { id: "peternakan", emoji: "ðŸ„", label: "Peternakan" },
];

const KOPERASI_RESULTS: Record<
  string,
  {
    title: string;
    list: {
      name: string;
      location: string;
      members: number;
      rating: number;
      products: string[];
    }[];
  }
> = {
  pertanian: {
    title: "Koperasi Pertanian Terdaftar",
    list: [
      {
        name: "KUD Tani Makmur",
        location: "Cianjur, Jawa Barat",
        members: 245,
        rating: 4.8,
        products: ["Padi", "Jagung", "Cabai"],
      },
      {
        name: "Koperasi Subur Jaya",
        location: "Demak, Jawa Tengah",
        members: 189,
        rating: 4.6,
        products: ["Padi", "Kedelai"],
      },
    ],
  },
  perikanan: {
    title: "Koperasi Perikanan Terdaftar",
    list: [
      {
        name: "KUD Sari Laut",
        location: "Demak, Jawa Tengah",
        members: 156,
        rating: 4.7,
        products: ["Ikan Asin", "Udang", "Bandeng"],
      },
      {
        name: "Koperasi Nelayan Mandiri",
        location: "Aceh Besar",
        members: 98,
        rating: 4.5,
        products: ["Tuna", "Cakalang"],
      },
    ],
  },
  perkebunan: {
    title: "Koperasi Perkebunan Terdaftar",
    list: [
      {
        name: "Koperasi Gayo Mandiri",
        location: "Bener Meriah, Aceh",
        members: 320,
        rating: 4.9,
        products: ["Kopi Arabika", "Kakao"],
      },
      {
        name: "KUD Kebun Sejahtera",
        location: "Lampung Barat",
        members: 210,
        rating: 4.7,
        products: ["Kopi Robusta", "Lada"],
      },
    ],
  },
  peternakan: {
    title: "Koperasi Peternakan Terdaftar",
    list: [
      {
        name: "KUD Ternak Maju",
        location: "Boyolali, Jawa Tengah",
        members: 134,
        rating: 4.6,
        products: ["Susu Segar", "Daging Sapi"],
      },
      {
        name: "Koperasi Peternak Bersatu",
        location: "Malang, Jawa Timur",
        members: 178,
        rating: 4.5,
        products: ["Telur", "Ayam Kampung"],
      },
    ],
  },
};

/* â”€â”€â”€ Chat message types â”€â”€â”€ */
type ChatMode = null | "tani" | "pasar" | "koperasi";
type ChatStep = "choose-mode" | "choose-sub" | "result";

interface ChatMessage {
  id: number;
  from: "bot" | "user";
  text: string;
  type?: "text" | "options" | "result";
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ COMPONENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export default function ModuleIntro() {
  const [chatMode, setChatMode] = useState<ChatMode>(null);
  const [chatStep, setChatStep] = useState<ChatStep>("choose-mode");
  const [subChoice, setSubChoice] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      from: "bot",
      text: "Halo! ðŸ‘‹ Saya asisten Agrou. Mau cari apa hari ini?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatStep, subChoice]);

  const addMessage = (msg: Omit<ChatMessage, "id">) => {
    setMessages((prev) => [...prev, { ...msg, id: prev.length + 1 }]);
  };

  const handleSelectMode = (mode: ChatMode) => {
    setChatMode(mode);
    setChatStep("choose-sub");

    const labels: Record<string, string> = {
      tani: "ðŸŒ¿ Kebutuhan Tani",
      pasar: "ðŸª Cari Produk Pasar",
      koperasi: "ðŸ¢ Cari Koperasi",
    };
    addMessage({ from: "user", text: labels[mode!] });

    setTimeout(() => {
      const botTexts: Record<string, string> = {
        tani: "Baik! Apa permasalahan lahan kamu saat ini?",
        pasar: "Siap! Produk kategori apa yang sedang kamu cari?",
        koperasi: "Tentu! Kamu ingin mencari koperasi di bidang apa?",
      };
      addMessage({ from: "bot", text: botTexts[mode!] });
    }, 400);
  };

  const handleSelectSub = (id: string, label: string) => {
    setSubChoice(id);
    setChatStep("result");

    addMessage({ from: "user", text: label });

    setTimeout(() => {
      if (chatMode === "tani") {
        const r = TANI_RESULTS[id];
        addMessage({ from: "bot", text: `${r.title} â€” ${r.desc}` });
      } else if (chatMode === "pasar") {
        const r = PASAR_RESULTS[id];
        addMessage({
          from: "bot",
          text: `${r.title} â€” Berikut produk yang tersedia dari koperasi desa:`,
        });
      } else if (chatMode === "koperasi") {
        const r = KOPERASI_RESULTS[id];
        addMessage({
          from: "bot",
          text: `${r.title} â€” Berikut koperasi yang relevan dengan kebutuhanmu:`,
        });
      }
    }, 400);
  };

  const handleReset = () => {
    setChatMode(null);
    setChatStep("choose-mode");
    setSubChoice(null);
    setMessages([
      {
        id: 1,
        from: "bot",
        text: "Halo! ðŸ‘‹ Saya asisten Agrou. Mau cari apa hari ini?",
      },
    ]);
    setInputValue("");
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    addMessage({ from: "user", text: inputValue.trim() });
    setInputValue("");
    setTimeout(() => {
      addMessage({
        from: "bot",
        text: "Terima kasih! Untuk saat ini, silakan pilih dari opsi yang tersedia di atas ya ðŸ˜Š",
      });
    }, 600);
  };

  return (
    <section
      id="module-intro"
      className="w-full bg-(--color-cream) pt-16 pb-12 relative z-10"
    >
      <div className="max-w-360 mx-auto px-8">
        {/* ======== TWO-COLUMN WRAPPER ======== */}
        <div className="flex flex-col lg:flex-row items-stretch gap-8">
          {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• LEFT COLUMN (65%) â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
          <div className="w-full lg:w-[65%] flex flex-col">
            {/* â”€â”€â”€ TANI SECTION â”€â”€â”€ */}
            <div>
              {/* Header row */}
              <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">ðŸŒ¿</span>
                  <div>
                    <h3 className="font-display font-black text-xl text-(--color-text-primary) leading-tight">
                      Agrou Tani
                    </h3>
                    <p className="text-[13px] text-(--color-text-secondary) mt-0.5">
                      Produk proteksi lahan terpercaya
                    </p>
                  </div>
                </div>
                <a
                  href="#"
                  className="flex items-center gap-1.5 text-(--color-forest) font-semibold text-sm hover:underline transition-colors group/link shrink-0"
                >
                  Lihat Semua Produk
                  <ArrowRight
                    size={14}
                    className="group-hover/link:translate-x-0.5 transition-transform"
                  />
                </a>
              </div>

              {/* 4 Tani Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                {TANI_CARDS.map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.4, delay: idx * 0.08 }}
                      className="group flex flex-col items-center text-center px-3 py-5 rounded-2xl cursor-pointer bg-(--color-surface)
                                 border border-(--color-border)
                                 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]
                                 hover:scale-[1.02] transition-all duration-300"
                    >
                      <div
                        className={`w-18 h-18 rounded-full ${card.bg} flex items-center justify-center mb-4
                                    group-hover:scale-105 transition-transform duration-300`}
                      >
                        <Icon size={30} className="text-white" />
                      </div>
                      <h4 className="font-bold text-[14px] text-gray-900 mb-1 leading-snug">
                        {card.name}
                      </h4>
                      <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2 mb-3">
                        {card.desc}
                      </p>
                      <span
                        className="flex items-center gap-1 text-[#1B4D35] text-[12px] font-semibold
                                       group-hover:gap-2 transition-all"
                      >
                        Lihat Lebih
                        <ArrowRight size={12} />
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* â”€â”€â”€ PASAR SECTION â”€â”€â”€ */}
            <div className="mt-12">
              <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">ðŸª</span>
                  <div>
                    <h3 className="font-display font-black text-xl text-(--color-text-primary) leading-tight">
                      Agrou Pasar
                    </h3>
                    <p className="text-[13px] text-(--color-text-secondary) mt-0.5">
                      Produk segar langsung dari koperasi desa
                    </p>
                  </div>
                </div>
                <a
                  href="#"
                  className="flex items-center gap-1.5 text-(--color-forest) font-semibold text-sm hover:underline transition-colors group/link2 shrink-0"
                >
                  Lihat Semua Produk
                  <ArrowRight
                    size={14}
                    className="group-hover/link2:translate-x-0.5 transition-transform"
                  />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {PASAR_CARDS.map((card, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, delay: idx * 0.1 }}
                    className="bg-(--color-surface) rounded-2xl overflow-hidden group
                               border border-(--color-border) shadow-[0_4px_20px_rgba(0,0,0,0.06)]
                               hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:scale-[1.02]
                               transition-all duration-300"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                      <span className="absolute top-3 left-3 bg-(--color-orange) text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-md">
                        {card.badge}
                      </span>
                    </div>
                    <div className="p-4">
                      <p className="text-[11px] text-gray-400 font-medium mb-1">
                        {card.koperasi}
                      </p>
                      <h4 className="font-bold text-[15px] text-gray-900 mb-2">
                        {card.name}
                      </h4>
                      <ul className="space-y-0.5 mb-4">
                        {card.bullets.map((b, i) => (
                          <li key={i} className="text-[12px] text-gray-500">
                            â€¢ {b}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        <span className="text-(--color-orange) font-bold text-base">
                          {card.price}
                        </span>
                        <button className="flex items-center gap-1.5 bg-(--color-orange) hover:bg-(--color-orange-dark) text-white text-[12px] font-bold px-3.5 py-2 rounded-xl transition-colors active:scale-95 shadow-sm">
                          Pesan <ShoppingCart size={13} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• RIGHT COLUMN (35%) â€” CHATBOT â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-[35%] flex flex-col rounded-2xl overflow-hidden shadow-xl border border-(--color-border) bg-(--color-surface) self-stretch"
          >
            {/* â”€â”€â”€ Chat Header â”€â”€â”€ */}
            <div className="bg-linear-to-r from-(--color-forest-dark) to-(--color-forest) px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                  <Bot size={22} className="text-(--color-lime)" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-[15px] leading-tight">
                    Asisten Agrou
                  </h4>
                  <p className="text-(--color-lime) text-[11px] font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-(--color-lime) rounded-full inline-block animate-pulse"></span>
                    Online sekarang
                  </p>
                </div>
              </div>
              {chatStep !== "choose-mode" && (
                <button
                  onClick={handleReset}
                  className="text-white/60 hover:text-white text-xs font-semibold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Mulai Ulang
                </button>
              )}
            </div>

            {/* â”€â”€â”€ Chat Messages Area â”€â”€â”€ */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F9FAFB] min-h-100 lg:min-h-0">
              <AnimatePresence mode="popLayout">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.from === "bot" && (
                      <div className="w-7 h-7 rounded-full bg-(--color-forest) flex items-center justify-center shrink-0 mr-2 mt-1">
                        <Bot size={14} className="text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] px-3.5 py-2.5 text-[13px] font-medium leading-relaxed ${
                        msg.from === "user"
                          ? "bg-(--color-forest) text-(--color-text-on-dark) rounded-2xl rounded-tr-sm"
                          : "bg-(--color-surface) text-(--color-text-primary) rounded-2xl rounded-tl-sm border border-(--color-border) shadow-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* â”€â”€â”€ Mode Selection Buttons â”€â”€â”€ */}
              {chatStep === "choose-mode" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="pl-9 space-y-2 pt-1"
                >
                  <button
                    onClick={() => handleSelectMode("tani")}
                    className="w-full flex items-center gap-3 bg-(--color-surface) border-2 border-(--color-border) hover:border-(--color-forest) hover:bg-(--color-forest)/5 p-3 rounded-xl transition-all group text-left"
                  >
                    <div className="w-9 h-9 rounded-lg bg-(--color-forest)/10 flex items-center justify-center shrink-0 group-hover:bg-(--color-forest)/20 transition-colors">
                      <LeafIcon
                        size={18}
                        className="text-(--color-forest)"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-[13px] text-gray-800">
                        Kebutuhan Tani
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Diagnosis masalah & cari solusi lahan
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectMode("pasar")}
                    className="w-full flex items-center gap-3 bg-(--color-surface) border-2 border-(--color-border) hover:border-(--color-orange) hover:bg-(--color-orange)/5 p-3 rounded-xl transition-all group text-left"
                  >
                    <div className="w-9 h-9 rounded-lg bg-(--color-orange)/10 flex items-center justify-center shrink-0 group-hover:bg-(--color-orange)/20 transition-colors">
                      <ShoppingBag
                        size={18}
                        className="text-(--color-orange)"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-[13px] text-gray-800">
                        Cari Produk Pasar
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Temukan produk segar dari koperasi
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectMode("koperasi")}
                    className="w-full flex items-center gap-3 bg-(--color-surface) border-2 border-(--color-border) hover:border-(--color-forest) hover:bg-(--color-forest)/5 p-3 rounded-xl transition-all group text-left"
                  >
                    <div className="w-9 h-9 rounded-lg bg-(--color-forest)/10 flex items-center justify-center shrink-0 group-hover:bg-(--color-forest)/20 transition-colors">
                      <Building2
                        size={18}
                        className="text-(--color-forest)"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-[13px] text-gray-800">
                        Cari Koperasi
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Cari koperasi sesuai kebutuhanmu
                      </p>
                    </div>
                  </button>
                </motion.div>
              )}

              {/* â”€â”€â”€ Sub-choices: TANI â”€â”€â”€ */}
              {chatStep === "choose-sub" && chatMode === "tani" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="pl-9 grid grid-cols-2 gap-2 pt-1"
                >
                  {TANI_PROBLEMS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() =>
                        handleSelectSub(p.id, `${p.emoji} ${p.label}`)
                      }
                      className="bg-(--color-surface) border-2 border-(--color-border) hover:border-(--color-forest) hover:bg-(--color-forest)/5 p-3 rounded-xl transition-all text-center group"
                    >
                      <span className="text-xl block mb-1 group-hover:scale-110 transition-transform">
                        {p.emoji}
                      </span>
                      <span className="font-bold text-[12px] text-gray-700">
                        {p.label}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}

              {/* â”€â”€â”€ Sub-choices: PASAR â”€â”€â”€ */}
              {chatStep === "choose-sub" && chatMode === "pasar" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="pl-9 grid grid-cols-2 gap-2 pt-1"
                >
                  {PASAR_CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() =>
                        handleSelectSub(c.id, `${c.emoji} ${c.label}`)
                      }
                      className="bg-(--color-surface) border-2 border-(--color-border) hover:border-(--color-orange) hover:bg-(--color-orange)/5 p-3 rounded-xl transition-all text-center group"
                    >
                      <span className="text-xl block mb-1 group-hover:scale-110 transition-transform">
                        {c.emoji}
                      </span>
                      <span className="font-bold text-[12px] text-gray-700">
                        {c.label}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}

              {/* â”€â”€â”€ Sub-choices: KOPERASI â”€â”€â”€ */}
              {chatStep === "choose-sub" && chatMode === "koperasi" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="pl-9 grid grid-cols-2 gap-2 pt-1"
                >
                  {KOPERASI_NEEDS.map((k) => (
                    <button
                      key={k.id}
                      onClick={() =>
                        handleSelectSub(k.id, `${k.emoji} ${k.label}`)
                      }
                      className="bg-(--color-surface) border-2 border-(--color-border) hover:border-(--color-forest) hover:bg-(--color-forest)/5 p-3 rounded-xl transition-all text-center group"
                    >
                      <span className="text-xl block mb-1 group-hover:scale-110 transition-transform">
                        {k.emoji}
                      </span>
                      <span className="font-bold text-[12px] text-gray-700">
                        {k.label}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}

              {/* â”€â”€â”€ Results: TANI â”€â”€â”€ */}
              {chatStep === "result" && chatMode === "tani" && subChoice && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="pl-9 space-y-2 pt-1"
                >
                  {TANI_RESULTS[subChoice].products.map((prod, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-(--color-surface) border border-(--color-border) rounded-xl p-3 hover:border-(--color-forest)/40 transition-colors shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2
                          size={14}
                          className="text-(--color-forest) shrink-0"
                        />
                        <span className="font-semibold text-[12px] text-gray-800">
                          {prod}
                        </span>
                      </div>
                      <button className="bg-(--color-forest) hover:bg-(--color-forest-dark) text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors">
                        + Keranjang
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleReset}
                    className="w-full mt-2 bg-(--color-forest)/10 hover:bg-(--color-forest)/20 text-(--color-forest) font-bold text-[12px] py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Search size={13} /> Cari Kebutuhan Lain
                  </button>
                </motion.div>
              )}

              {/* â”€â”€â”€ Results: PASAR â”€â”€â”€ */}
              {chatStep === "result" && chatMode === "pasar" && subChoice && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="pl-9 space-y-2 pt-1"
                >
                  {PASAR_RESULTS[subChoice].items.map((item, i) => (
                    <div
                      key={i}
                      className="bg-(--color-surface) border border-(--color-border) rounded-xl p-3 hover:border-(--color-orange)/40 transition-colors shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[13px] text-gray-900">
                          {item.name}
                        </span>
                        <span className="text-(--color-orange) font-bold text-[12px]">
                          {item.price}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-[11px] text-gray-500">
                          <MapPin size={10} /> {item.origin}
                        </span>
                        <button className="flex items-center gap-1 bg-(--color-orange) hover:bg-(--color-orange-dark) text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors">
                          Pesan <ShoppingCart size={10} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={handleReset}
                    className="w-full mt-2 bg-(--color-orange)/10 hover:bg-(--color-orange)/20 text-(--color-orange) font-bold text-[12px] py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Search size={13} /> Cari Produk Lain
                  </button>
                </motion.div>
              )}

              {/* â”€â”€â”€ Results: KOPERASI â”€â”€â”€ */}
              {chatStep === "result" &&
                chatMode === "koperasi" &&
                subChoice && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="pl-9 space-y-2 pt-1"
                  >
                    {KOPERASI_RESULTS[subChoice].list.map((kop, i) => (
                      <div
                        key={i}
                        className="bg-(--color-surface) border border-(--color-border) rounded-xl p-3 hover:border-(--color-forest)/40 transition-colors shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-[13px] text-gray-900">
                            {kop.name}
                          </span>
                          <span className="flex items-center gap-0.5 text-[11px] font-bold text-amber-500">
                            <Star size={10} className="fill-amber-400" />{" "}
                            {kop.rating}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 mb-2">
                          <MapPin size={10} /> {kop.location} â€¢ {kop.members}{" "}
                          anggota
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {kop.products.map((p, j) => (
                            <span
                              key={j}
                              className="bg-(--color-lime)/20 text-(--color-forest-dark) text-[10px] font-bold px-2 py-0.5 rounded-full"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={handleReset}
                      className="w-full mt-2 bg-(--color-forest)/10 hover:bg-(--color-forest)/20 text-(--color-forest) font-bold text-[12px] py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Search size={13} /> Cari Koperasi Lain
                    </button>
                  </motion.div>
                )}

              <div ref={chatEndRef} />
            </div>

            {/* â”€â”€â”€ Chat Input â”€â”€â”€ */}
            <div className="border-t border-gray-100 bg-white px-4 py-3 shrink-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ketik pesan..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] text-gray-700 placeholder-gray-400 focus:outline-none focus:border-(--color-forest) focus:ring-1 focus:ring-(--color-forest)/20 transition-colors"
                />
                <button
                  onClick={handleSend}
                  className="bg-(--color-forest) hover:bg-(--color-forest-dark) text-white p-2.5 rounded-xl transition-colors active:scale-95 shrink-0"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
