import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Search,
  MapPin,
  Users,
  Award,
  Star,
  Store,
  ChevronRight,
  ChevronLeft,
  Building2,
  CheckCircle2,
  ShieldCheck,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import bgKoperasi from "@assets/bg-koperasi.jpg";
import { useKoperasiList } from "../../lib/queries/koperasi";
import { CardSkeleton } from "../ui/LoadingSkeleton";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";
type KoperasiDisplay = {
  id: string;
  name: string;
  location: string;
  members: number;
  verified: boolean;
  tags: string[];
  desc: string;
  rating: number;
  reviews: number;
  banner: string;
  avatar: string;
  products: { name: string; price: string; img: string }[];
};

function dbToKoperasi(k: any): KoperasiDisplay {
  return {
    id: k.id,
    name: k.name,
    location: k.location ?? "Indonesia",
    members: 0,
    verified: k.is_verified ?? false,
    tags: [],
    desc: k.description ?? "",
    rating: k.rating ?? 4.5,
    reviews: 0,
    banner:
      k.banner_url ??
      "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?auto=format&fit=crop&q=80&w=800",
    avatar:
      k.avatar_url ??
      `https://ui-avatars.com/api/?name=${encodeURIComponent(k.name)}&background=1A3D2E&color=fff&size=100`,
    products: [],
  };
}

const PROVINSI_FILTERS = [
  "Semua Provinsi",
  "Aceh",
  "Sumatera Utara",
  "Jawa Barat",
  "Jawa Tengah",
  "Jawa Timur",
  "Sulawesi",
  "NTB",
  "NTT",
  "Papua",
];

const KOMODITAS_FILTERS = [
  "Semua",
  "🐟 Ikan & Laut",
  "🌾 Padi",
  "☕ Kopi & Rempah",
  "🥬 Sayuran",
  "🦐 Udang",
  "🌿 Rumput Laut",
  "🍯 Olahan",
];

const KOPERASI_DATA = [
  {
    id: 1,
    name: "Koperasi Tani Maju Gayo",
    location: "Bener Meriah, Aceh",
    members: 47,
    verified: true,
    tags: ["☕ Kopi", "🌿 Rempah", "🫙 Olahan"],
    desc: "Koperasi kopi arabika generasi ketiga di dataran tinggi Gayo dengan proses natural premium.",
    rating: 4.9,
    reviews: 124,
    banner:
      "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?auto=format&fit=crop&q=80&w=800",
    avatar:
      "https://ui-avatars.com/api/?name=Gayo&background=F77F00&color=fff&size=100",
    products: [
      {
        name: "Kopi Natural",
        price: "Rp180rb",
        img: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=200",
      },
      {
        name: "Honey Process",
        price: "Rp210rb",
        img: "https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&q=80&w=200",
      },
      {
        name: "Green Bean",
        price: "Rp95rb",
        img: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&q=80&w=200",
      },
    ],
  },
  {
    id: 2,
    name: "KUB Nelayan Lampulo",
    location: "Banda Aceh, Aceh",
    members: 82,
    verified: true,
    tags: ["🐟 Ikan", "🦐 Udang"],
    desc: "Kelompok usaha bersama nelayan Lampulo yang fokus pada hasil tangkapan ikan pelagis dan udang segar.",
    rating: 4.8,
    reviews: 89,
    banner:
      "https://images.unsplash.com/photo-1534062590479-79a0cf833215?auto=format&fit=crop&q=80&w=800",
    avatar:
      "https://ui-avatars.com/api/?name=Lampulo&background=0077B6&color=fff&size=100",
    products: [
      {
        name: "Tuna Loin",
        price: "Rp110rb",
        img: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&q=80&w=200",
      },
      {
        name: "Ikan Asin",
        price: "Rp85rb",
        img: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&q=80&w=200",
      },
      {
        name: "Udang Tiger",
        price: "Rp145rb",
        img: "https://images.unsplash.com/photo-1621852004158-f3bc188ace2d?auto=format&fit=crop&q=80&w=200",
      },
    ],
  },
  {
    id: 3,
    name: "Koperasi Tani Sejahtera",
    location: "Lembang, Jawa Barat",
    members: 115,
    verified: false,
    tags: ["🥬 Sayuran", "🌾 Padi"],
    desc: "Sentra sayuran organik dataran tinggi dan padi sawah dengan sertifikasi pertanian baik.",
    rating: 4.7,
    reviews: 65,
    banner:
      "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=800",
    avatar:
      "https://ui-avatars.com/api/?name=Sejahtera&background=2D6A4F&color=fff&size=100",
    products: [
      {
        name: "Beras Merah",
        price: "Rp28rb",
        img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200",
      },
      {
        name: "Tomat Cherry",
        price: "Rp35rb",
        img: "https://images.unsplash.com/photo-1592982537447-6f29fb443831?auto=format&fit=crop&q=80&w=200",
      },
      {
        name: "Selada Air",
        price: "Rp15rb",
        img: "https://images.unsplash.com/photo-1628186100298-b8058204b7b6?auto=format&fit=crop&q=80&w=200",
      },
    ],
  },
  {
    id: 4,
    name: "Koperasi Garam Madura",
    location: "Sumenep, Jawa Timur",
    members: 58,
    verified: true,
    tags: ["🫙 Garam Laut", "🐟 Ikan"],
    desc: "Penghasil garam laut kristal murni dan ikan asin kualitas ekspor langsung dari petani garam tradisional.",
    rating: 4.9,
    reviews: 156,
    banner:
      "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&q=80&w=800",
    avatar:
      "https://ui-avatars.com/api/?name=Madura&background=E76F51&color=fff&size=100",
    products: [
      {
        name: "Garam Kasar",
        price: "Rp12rb",
        img: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&q=80&w=200",
      },
      {
        name: "Fish Salted",
        price: "Rp65rb",
        img: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&q=80&w=200",
      },
      {
        name: "Garam Halus",
        price: "Rp18rb",
        img: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&q=80&w=200",
      },
    ],
  },
  {
    id: 5,
    name: "KUB Rumput Laut Sumbawa",
    location: "Sumbawa Besar, NTB",
    members: 34,
    verified: true,
    tags: ["🌿 Rumput Laut"],
    desc: "Kelompok pembudidaya rumput laut kualitas super untuk bahan baku industri dan konsumsi langsung.",
    rating: 4.8,
    reviews: 42,
    banner:
      "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&q=80&w=800",
    avatar:
      "https://ui-avatars.com/api/?name=Sumbawa&background=2A9D8F&color=fff&size=100",
    products: [
      {
        name: "Gracilaria",
        price: "Rp35rb",
        img: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&q=80&w=200",
      },
      {
        name: "Eucheuma",
        price: "Rp45rb",
        img: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&q=80&w=200",
      },
      {
        name: "Bubuk Agar",
        price: "Rp85rb",
        img: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&q=80&w=200",
      },
    ],
  },
  {
    id: 6,
    name: "Koperasi Kopi Toraja",
    location: "Tana Toraja, Sulsel",
    members: 62,
    verified: true,
    tags: ["☕ Kopi Premium"],
    desc: "Spesialisasi kopi Toraja Kalosi dengan profil rasa herbal khas yang dirawat secara organik.",
    rating: 5.0,
    reviews: 215,
    banner:
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800",
    avatar:
      "https://ui-avatars.com/api/?name=Toraja&background=3E2723&color=fff&size=100",
    products: [
      {
        name: "Toraja Peaberry",
        price: "Rp280rb",
        img: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=200",
      },
      {
        name: "Full Washed",
        price: "Rp190rb",
        img: "https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&q=80&w=200",
      },
      {
        name: "Drip Bags",
        price: "Rp65rb",
        img: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&q=80&w=200",
      },
    ],
  },
  {
    id: 7,
    name: "Koperasi Pangan Lestari",
    location: "Klaten, Jawa Tengah",
    members: 210,
    verified: false,
    tags: ["🌾 Beras", "🌽 Jagung"],
    desc: "Koperasi andalan penyedia beras rojolele dan pangan pokok lainnya untuk ketahanan pangan nasional.",
    rating: 4.6,
    reviews: 180,
    banner:
      "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=800",
    avatar:
      "https://ui-avatars.com/api/?name=Lestari&background=457B9D&color=fff&size=100",
    products: [
      {
        name: "Beras Rojolele",
        price: "Rp85rb",
        img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200",
      },
      {
        name: "Jagung Pipil",
        price: "Rp15rb",
        img: "https://images.unsplash.com/photo-1592982537447-6f29fb443831?auto=format&fit=crop&q=80&w=200",
      },
      {
        name: "Dedak Halus",
        price: "Rp8rb",
        img: "https://images.unsplash.com/photo-1628186100298-b8058204b7b6?auto=format&fit=crop&q=80&w=200",
      },
    ],
  },
  {
    id: 8,
    name: "KUB Udang Vaname",
    location: "Tulang Bawang, Lampung",
    members: 45,
    verified: false,
    tags: ["🦐 Udang", "🐟 Ikan"],
    desc: "Pembudidaya udang vaname dan bandeng di pesisir Timur Sumatera dengan sistem bioflok berkelanjutan.",
    rating: 4.5,
    reviews: 32,
    banner:
      "https://images.unsplash.com/photo-1621852004158-f3bc188ace2d?auto=format&fit=crop&q=80&w=800",
    avatar:
      "https://ui-avatars.com/api/?name=Vaname&background=E63946&color=fff&size=100",
    products: [
      {
        name: "Vaname Size 40",
        price: "Rp110rb",
        img: "https://images.unsplash.com/photo-1621852004158-f3bc188ace2d?auto=format&fit=crop&q=80&w=200",
      },
      {
        name: "Vaname Size 80",
        price: "Rp85rb",
        img: "https://images.unsplash.com/photo-1621852004158-f3bc188ace2d?auto=format&fit=crop&q=80&w=200",
      },
      {
        name: "Ikan Bandeng",
        price: "Rp25rb",
        img: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&q=80&w=200",
      },
    ],
  },
  {
    id: 9,
    name: "Koperasi Madu Hutan Papua",
    location: "Merauke, Papua",
    members: 28,
    verified: true,
    tags: ["🍯 Madu", "🌿 Hasil Hutan"],
    desc: "Kumpulan petani hutan mengelola madu murni dan hasil bumi tanpa merusak vegetasi alami hutan Papua.",
    rating: 5.0,
    reviews: 104,
    banner:
      "https://images.unsplash.com/photo-1587049352847-4d4b1ed74dc4?auto=format&fit=crop&q=80&w=800",
    avatar:
      "https://ui-avatars.com/api/?name=Papua&background=D4A373&color=fff&size=100",
    products: [
      {
        name: "Madu Hitam",
        price: "Rp180rb",
        img: "https://images.unsplash.com/photo-1587049352847-4d4b1ed74dc4?auto=format&fit=crop&q=80&w=200",
      },
      {
        name: "Sarang Madu",
        price: "Rp150rb",
        img: "https://images.unsplash.com/photo-1587049352847-4d4b1ed74dc4?auto=format&fit=crop&q=80&w=200",
      },
      {
        name: "Madu Flora",
        price: "Rp120rb",
        img: "https://images.unsplash.com/photo-1587049352847-4d4b1ed74dc4?auto=format&fit=crop&q=80&w=200",
      },
    ],
  },
];

export default function KoperasiPage() {
  const navigate = useNavigate();
  const [activeProv, setActiveProv] = useState("Semua Provinsi");
  const [activeKomoditas, setActiveKomoditas] = useState("Semua");

  const { data: rawKoperasi, isLoading, error, refetch } = useKoperasiList();
  const koperasiList: KoperasiDisplay[] =
    rawKoperasi && rawKoperasi.length > 0
      ? rawKoperasi.map(dbToKoperasi)
      : KOPERASI_DATA.map((k) => ({ ...k, id: String(k.id) }));

  return (
    <div className="w-full bg-(--color-cream) min-h-screen font-sans">
      {/* PAGE HEADER SECTION */}
      <section className="relative bg-(--color-forest-dark) pt-10 pb-32 overflow-hidden">
        {/* Background image with overlay */}
        <img
          src={bgKoperasi}
          alt="Agrou Cooperative Farm Background"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.6] z-0 pointer-events-none"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/25 via-transparent to-black/25 z-0 pointer-events-none" />

        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Decorative blob kiri */}
        <div className="absolute -left-32 top-0 w-96 h-96 bg-(--color-lime)/5 rounded-full blur-3xl pointer-events-none" />

        {/* Decorative blob kanan */}
        <div className="absolute -right-32 bottom-0 w-96 h-96 bg-(--color-orange)/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-360 mx-auto px-8 text-center">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-(--color-lime)/10 border border-(--color-lime)/30 text-(--color-lime) text-[10px] font-black tracking-[0.15em] px-4 py-2 rounded-full mb-4 uppercase">
            🏛️ DIREKTORI KOPERASI
          </span>

          <h1 className="font-display font-black text-white text-5xl lg:text-6xl leading-[1.05] mb-3">
            Temukan Koperasi <br />
            <span className="text-(--color-lime) italic">Terpercaya.</span>
          </h1>

          <p className="text-white/60 text-base max-w-xl mx-auto font-medium leading-relaxed mb-6">
            2.400+ koperasi aktif dari seluruh Indonesia siap melayani
            kebutuhanmu
          </p>

          <div className="relative mb-0 w-full max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
              <Search className="text-white/40" size={16} />
            </div>
            <input
              type="text"
              placeholder="Cari nama koperasi atau komoditas..."
              className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-2xl pl-12 pr-32 py-3 text-sm focus:border-(--color-lime) focus:bg-white/15 outline-none transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-(--color-lime) text-(--color-forest-dark) font-black text-xs px-5 py-2 rounded-xl hover:brightness-110 transition-all">
              Cari
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-px mt-6 bg-white/10 rounded-2xl overflow-hidden shadow-lg border border-white/5 max-w-xl mx-auto">
            <div className="bg-(--color-forest)/40 backdrop-blur px-4 py-2 text-center">
              <div className="text-(--color-lime) font-black text-xl font-sans mb-0.5">
                2.400+
              </div>
              <div className="text-white/60 text-[11px] font-sans leading-tight">
                Koperasi Terdaftar
              </div>
            </div>
            <div className="bg-(--color-forest)/40 backdrop-blur px-4 py-2 text-center">
              <div className="text-(--color-lime) font-black text-xl font-sans mb-0.5">
                37
              </div>
              <div className="text-white/60 text-[11px] font-sans leading-tight">
                Provinsi
              </div>
            </div>
            <div className="bg-(--color-forest)/40 backdrop-blur px-4 py-2 text-center">
              <div className="text-(--color-lime) font-black text-xl font-sans mb-0.5">
                81
              </div>
              <div className="text-white/60 text-[11px] font-sans leading-tight">
                Koperasi Aktif
              </div>
            </div>
            <div className="bg-(--color-forest)/40 backdrop-blur px-4 py-2 text-center">
              <div className="text-(--color-lime) font-black text-xl font-sans mb-0.5">
                98%
              </div>
              <div className="text-white/60 text-[11px] font-sans leading-tight">
                Kepuasan
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER TABS */}
      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-30">
        <div className="bg-white border border-(--color-border) rounded-2xl shadow-xl px-5 py-3.5 space-y-3">
          {/* Provinsi Row */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-0.5">
            {PROVINSI_FILTERS.map((prov) => (
              <button
                key={prov}
                onClick={() => setActiveProv(prov)}
                className={
                  activeProv === prov
                    ? "bg-(--color-forest) text-white font-bold text-xs px-4 py-2 rounded-full whitespace-nowrap cursor-pointer shrink-0"
                    : "border border-(--color-border) text-(--color-text-secondary) font-semibold text-xs px-4 py-2 rounded-full whitespace-nowrap cursor-pointer shrink-0 hover:border-(--color-forest) hover:text-(--color-forest) transition-all"
                }
              >
                {prov}
              </button>
            ))}
          </div>

          <div className="h-px bg-(--color-border)" />

          {/* Komoditas Row */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-0.5">
            {KOMODITAS_FILTERS.map((komo) => (
              <button
                key={komo}
                onClick={() => setActiveKomoditas(komo)}
                className={
                  activeKomoditas === komo
                    ? "bg-(--color-forest) text-white font-bold text-xs px-4 py-2 rounded-full whitespace-nowrap cursor-pointer shrink-0"
                    : "border border-(--color-border) text-(--color-text-secondary) font-semibold text-xs px-4 py-2 rounded-full whitespace-nowrap cursor-pointer shrink-0 hover:border-(--color-forest) hover:text-(--color-forest) transition-all"
                }
              >
                {komo}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RESULTS BAR */}
      <div className="max-w-360 mx-auto px-8 py-4 flex items-center justify-between">
        <div className="text-(--color-text-secondary) text-sm">
          Menampilkan <strong>81 koperasi</strong> dari seluruh Indonesia
        </div>
        <div className="flex items-center gap-2 bg-white border border-(--color-border) text-(--color-text-secondary) text-sm font-semibold px-4 py-2 rounded-xl cursor-pointer hover:border-(--color-forest) transition-all">
          <select className="bg-transparent border-none outline-none cursor-pointer text-(--color-text-secondary) text-sm font-semibold appearance-none focus:outline-none">
            <option>Terpopuler ↓</option>
            <option>Paling Baru</option>
            <option>Rating Tertinggi</option>
            <option>Paling Banyak Diulas</option>
          </select>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-360 mx-auto px-8 pb-12">
        <div className="flex gap-6 items-start flex-col lg:flex-row">
          {/* LEFT: GRID SECTION */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {koperasiList.map((kop, idx) => (
                <motion.div
                  key={kop.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden border border-(--color-border) hover:shadow-[0_8px_32px_rgba(26,61,46,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col relative"
                >
                  {/* Card Header (Banner) */}
                  <div className="h-32 relative overflow-hidden shrink-0">
                    <img
                      src={kop.banner}
                      alt={kop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-(--color-forest-dark)/70 to-transparent" />

                    {/* Verified Protected Farm badge */}
                    {kop.verified && (
                      <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1.5 bg-(--color-lime) text-(--color-forest-dark) text-[9px] font-black px-2.5 py-1.5 rounded-full shadow-[0_2px_12px_rgba(163,230,53,0.5)] border border-(--color-lime)/80">
                          <ShieldCheck size={11} strokeWidth={2.5} />
                          <span className="tracking-wide uppercase">
                            Verified
                          </span>
                        </div>
                        <div className="flex items-center gap-1 bg-(--color-forest-dark)/80 backdrop-blur-sm text-(--color-lime) text-[8px] font-bold px-2 py-0.5 rounded-full border border-(--color-lime)/30">
                          <span>🌿</span>
                          <span>Protected Farm</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Avatar */}
                  <div
                    className={`absolute top-26.5 left-4 w-11 h-11 rounded-xl border-2 border-white shadow-md overflow-hidden z-10 ${
                      kop.verified
                        ? "bg-(--color-forest)"
                        : "bg-(--color-orange)"
                    }`}
                  >
                    <img
                      src={kop.avatar}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Card Body */}
                  <div className="pt-7 px-4 pb-4 flex-1 flex flex-col">
                    <h3 className="font-display font-bold text-sm text-(--color-forest-dark) leading-tight mb-1">
                      {kop.name}
                    </h3>

                    {kop.verified && (
                      <div className="flex items-center gap-1 mb-1.5">
                        <ShieldCheck
                          size={10}
                          className="text-emerald-600 shrink-0"
                          strokeWidth={2.5}
                        />
                        <span className="text-[9px] font-black text-emerald-700 tracking-wide uppercase">
                          Verified Protected Farm
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-1 text-(--color-text-secondary) text-xs mb-2">
                      <MapPin size={11} className="text-(--color-orange)" />
                      <span>{kop.location}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-2">
                      {kop.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-(--color-forest)/8 text-(--color-forest) text-[10px] font-bold px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {kop.tags.length > 3 && (
                        <span className="bg-(--color-forest)/8 text-(--color-forest) text-[10px] font-bold px-2 py-0.5 rounded-full">
                          +{kop.tags.length - 3} lagi
                        </span>
                      )}
                    </div>

                    <p className="text-(--color-text-secondary) text-xs leading-relaxed mb-3 line-clamp-2">
                      {kop.desc}
                    </p>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1 text-(--color-text-secondary) text-xs">
                        <Users size={11} />
                        <span>{kop.members} Anggota</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star
                          size={11}
                          className="text-amber-400 fill-amber-400"
                        />
                        <span className="font-bold text-xs text-(--color-text-primary)">
                          {kop.rating}
                        </span>
                        <span className="text-(--color-text-secondary) text-xs">
                          ({kop.reviews} ulasan)
                        </span>
                      </div>
                    </div>

                    {/* Product preview */}
                    <div className="flex gap-1.5 mb-3">
                      {kop.products.slice(0, 3).map((p, i) => (
                        <img
                          key={i}
                          src={p.img}
                          alt={p.name}
                          className="w-14 h-14 rounded-xl object-cover border border-(--color-border)"
                        />
                      ))}
                    </div>

                    <div className="mt-auto border-t border-(--color-border) pt-3 flex items-center gap-2">
                      <button
                        onClick={() => navigate("/koperasi/" + kop.id)}
                        className="flex-1 bg-(--color-forest) text-white font-bold text-xs py-2.5 rounded-xl text-center hover:bg-(--color-forest-dark) transition-all"
                      >
                        Kunjungi Toko
                      </button>
                      <button className="border border-(--color-border) text-(--color-text-secondary) font-bold text-xs py-2.5 px-3 rounded-xl hover:border-(--color-forest) hover:text-(--color-forest) transition-all">
                        Bandingkan
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 py-10">
              <button className="flex items-center gap-1.5 border border-(--color-border) text-(--color-text-secondary) font-semibold text-sm px-4 py-2.5 rounded-xl hover:border-(--color-forest) hover:text-(--color-forest) transition-all">
                <ChevronLeft size={16} /> Sebelumnya
              </button>
              <button className="bg-(--color-forest) text-white font-bold w-10 h-10 rounded-xl flex items-center justify-center">
                1
              </button>
              <button className="border border-(--color-border) text-(--color-text-secondary) font-bold w-10 h-10 rounded-xl hover:border-(--color-forest) hover:text-(--color-forest) transition-all flex items-center justify-center">
                2
              </button>
              <button className="border border-(--color-border) text-(--color-text-secondary) font-bold w-10 h-10 rounded-xl hover:border-(--color-forest) hover:text-(--color-forest) transition-all flex items-center justify-center">
                3
              </button>
              <span className="px-2 text-gray-400 font-bold">...</span>
              <button className="border border-(--color-border) text-(--color-text-secondary) font-bold w-10 h-10 rounded-xl hover:border-(--color-forest) hover:text-(--color-forest) transition-all flex items-center justify-center">
                81
              </button>
              <button className="flex items-center gap-1.5 border border-(--color-border) text-(--color-text-secondary) font-semibold text-sm px-4 py-2.5 rounded-xl hover:border-(--color-forest) hover:text-(--color-forest) transition-all">
                Berikutnya <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* RIGHT: SIDEBAR */}
          <div className="w-full lg:w-72 shrink-0 sticky top-24 space-y-4">
            {/* Card 1 — Daftarkan Koperasi */}
            <div className="bg-(--color-forest-dark) rounded-2xl p-5 text-white">
              <span className="inline-flex bg-(--color-lime)/10 border border-(--color-lime)/30 text-(--color-lime) text-[10px] font-black px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                ✨ Gratis Bergabung
              </span>
              <h3 className="font-display font-bold text-lg text-white mb-2">
                Koperasi Desa Unggul & Terverifikasi
              </h3>
              <p className="text-white/60 text-xs leading-relaxed mb-4">
                Buka akses pasar yang lebih besar untuk hasil panen desa Anda.
                Daftarkan sekarang!
              </p>
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-(--color-lime)" />
                  <span className="text-white/80 text-xs font-medium">
                    Storefront premium gratis selamanya
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-(--color-lime)" />
                  <span className="text-white/80 text-xs font-medium">
                    Akses pembeli premium nasional
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-(--color-lime)" />
                  <span className="text-white/80 text-xs font-medium">
                    Revenue split otomatis transparan
                  </span>
                </div>
              </div>
              <button className="w-full bg-(--color-lime) text-(--color-forest-dark) font-black py-3 rounded-xl text-sm hover:brightness-110 transition-all">
                🚀 Daftarkan Koperasi
              </button>
            </div>

            {/* Card 2 — Asisten AI */}
            <div className="bg-white border border-(--color-border) rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="font-bold text-sm text-(--color-forest-dark)">
                  Asisten Agrou
                </span>
                <span className="text-xs text-green-500 font-medium ml-auto">
                  Online
                </span>
              </div>

              <div className="bg-(--color-cream) rounded-xl rounded-tl-none p-3 text-xs text-(--color-text-primary) leading-relaxed mb-3">
                Halo! Saya bisa bantu temukan koperasi yang sesuai kebutuhanmu.
                Mau cari komoditas apa?
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                <button className="bg-(--color-forest)/8 text-(--color-forest) text-[10px] font-bold px-2.5 py-1.5 rounded-full cursor-pointer hover:bg-(--color-forest)/15 transition-all">
                  ☕ Kopi
                </button>
                <button className="bg-(--color-forest)/8 text-(--color-forest) text-[10px] font-bold px-2.5 py-1.5 rounded-full cursor-pointer hover:bg-(--color-forest)/15 transition-all">
                  🐟 Hasil Laut
                </button>
                <button className="bg-(--color-forest)/8 text-(--color-forest) text-[10px] font-bold px-2.5 py-1.5 rounded-full cursor-pointer hover:bg-(--color-forest)/15 transition-all">
                  🌾 Beras
                </button>
              </div>

              <div className="flex items-center gap-2 bg-(--color-cream) rounded-xl p-2">
                <input
                  type="text"
                  placeholder="Tulis pesanmu..."
                  className="flex-1 bg-transparent text-xs placeholder:text-(--color-text-secondary) focus:outline-none"
                />
                <button className="bg-(--color-orange) text-white w-7 h-7 rounded-lg flex items-center justify-center hover:bg-(--color-orange-dark) transition-all">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
