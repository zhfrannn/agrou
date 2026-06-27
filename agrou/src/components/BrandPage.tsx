import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight, Store, MapPin, Users, Award, Star,
  ShoppingBag, MessageSquare, ArrowRight, Sparkles,
  BadgeCheck, Leaf, ShoppingCart, Search
} from "lucide-react";

import promoAceh from "../../assets/promo-koperasi-aceh.jpg";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "semua", emoji: "🛒", label: "Semua" },
  { id: "ikan", emoji: "🐟", label: "Ikan & Laut" },
  { id: "padi", emoji: "🌾", label: "Padi & Serealia" },
  { id: "kopi", emoji: "☕", label: "Kopi & Rempah" },
  { id: "sayur", emoji: "🥬", label: "Sayuran" },
  { id: "udang", emoji: "🦐", label: "Udang & Budidaya" },
  { id: "rumput", emoji: "🌿", label: "Rumput Laut" },
  { id: "olahan", emoji: "🍯", label: "Produk Olahan" },
];

const FEATURED_KOPERASI = [
  {
    id: 1,
    name: "Koperasi Tani Maju Gayo",
    location: "Bener Meriah, Aceh",
    members: 47,
    rating: 4.9,
    reviews: 124,
    tags: ["☕ Kopi", "🌿 Rempah", "🍯 Olahan"],
    desc: "Koperasi kopi arabika generasi ketiga di dataran tinggi Gayo dengan proses natural dan mutu terjamin.",
    cover: "https://images.unsplash.com/photo-1524803507119-a9a3b6f2fb48?auto=format&fit=crop&q=80&w=800",
    logo: "https://ui-avatars.com/api/?name=Koperasi+Gayo&background=F77F00&color=fff&size=100",
    products: [
      { name: "Kopi Natural", price: "Rp 180rb", image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=200" },
      { name: "Honey Process", price: "Rp 210rb", image: "https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&q=80&w=200" },
      { name: "Green Bean", price: "Rp 95rb", image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&q=80&w=200" }
    ]
  },
  {
    id: 2,
    name: "Koperasi Nelayan Sejahtera",
    location: "Demak, Jawa Tengah",
    members: 112,
    rating: 4.8,
    reviews: 89,
    tags: ["🐟 Hasil Laut", "🦐 Tangkapan"],
    desc: "Nelayan tradisional Demak berkomitmen menyajikan tangkapan laut segar bebas bahan pengawet.",
    cover: "https://images.unsplash.com/photo-1534062590479-79a0cf833215?auto=format&fit=crop&q=80&w=800",
    logo: "https://ui-avatars.com/api/?name=Nelayan+Sejahtera&background=0077B6&color=fff&size=100",
    products: [
      { name: "Ikan Asin", price: "Rp 120rb", image: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&q=80&w=200" },
      { name: "Cumi Segar", price: "Rp 85rb", image: "https://images.unsplash.com/photo-1534062590479-79a0cf833215?auto=format&fit=crop&q=80&w=200" },
      { name: "Kakap Merah", price: "Rp 98rb", image: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&q=80&w=200" }
    ]
  },
  {
    id: 3,
    name: "KUD Subur Makmur",
    location: "Cianjur, Jawa Barat",
    members: 230,
    rating: 5.0,
    reviews: 215,
    tags: ["🌾 Padi", "🥬 Sayuran"],
    desc: "Pusat produsen beras pandan wangi organik Cianjur premium yang dibudidayakan secara tradisional.",
    cover: "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=800",
    logo: "https://ui-avatars.com/api/?name=Subur+Makmur&background=2D6A4F&color=fff&size=100",
    products: [
      { name: "Beras Pandan", price: "Rp 24rb", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200" },
      { name: "Sayur Organik", price: "Rp 15rb", image: "https://images.unsplash.com/photo-1628186100298-b8058204b7b6?auto=format&fit=crop&q=80&w=200" },
      { name: "Cabai Merah", price: "Rp 35rb", image: "https://images.unsplash.com/photo-1592982537447-6f29fb443831?auto=format&fit=crop&q=80&w=200" }
    ]
  },
  {
    id: 4,
    name: "Koperasi Bahari Jaya",
    location: "Sidoarjo, Jawa Timur",
    members: 88,
    rating: 4.7,
    reviews: 76,
    tags: ["🦐 Udang", "🐟 Hasil Laut"],
    desc: "Pusat budidaya udang vaname unggulan dengan pengelolaan tambak modern ramah ekosistem.",
    cover: "https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&q=80&w=800",
    logo: "https://ui-avatars.com/api/?name=Bahari+Jaya&background=008080&color=fff&size=100",
    products: [
      { name: "Udang Windu", price: "Rp 150rb", image: "https://images.unsplash.com/photo-1621852004158-f3bc188ace2d?auto=format&fit=crop&q=80&w=200" },
      { name: "Ebi Kering", price: "Rp 90rb", image: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&q=80&w=200" },
      { name: "Terasi Udang", price: "Rp 25rb", image: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&q=80&w=200" }
    ]
  },
  {
    id: 5,
    name: "KUD Samudra Hijau",
    location: "Nusa Penida, Bali",
    members: 65,
    rating: 4.9,
    reviews: 94,
    tags: ["🌿 Rumput Laut", "🌊 Budidaya"],
    desc: "Petani rumput laut nusantara penghasil komoditas karagenan kualitas ekspor bersertifikat.",
    cover: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&q=80&w=800",
    logo: "https://ui-avatars.com/api/?name=Samudra+Hijau&background=2E8B57&color=fff&size=100",
    products: [
      { name: "Seaweed A", price: "Rp 35rb", image: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&q=80&w=200" },
      { name: "Seaweed Powder", price: "Rp 48rb", image: "https://images.unsplash.com/photo-1628186100298-b8058204b7b6?auto=format&fit=crop&q=80&w=200" },
      { name: "Gelatin Alami", price: "Rp 60rb", image: "https://images.unsplash.com/photo-1592982537447-6f29fb443831?auto=format&fit=crop&q=80&w=200" }
    ]
  },
  {
    id: 6,
    name: "Koperasi Garam Kusamba",
    location: "Klungkung, Bali",
    members: 42,
    rating: 4.8,
    reviews: 58,
    tags: ["🧂 Garam", "🍯 Olahan"],
    desc: "Garam kristal tradisional Kusamba yang diproses secara turun temurun menggunakan air laut murni.",
    cover: "https://images.unsplash.com/photo-1587049352847-4d4b1ed74dc4?auto=format&fit=crop&q=80&w=800",
    logo: "https://ui-avatars.com/api/?name=Garam+Kusamba&background=708090&color=fff&size=100",
    products: [
      { name: "Garam Kusamba", price: "Rp 18rb", image: "https://images.unsplash.com/photo-1587049352847-4d4b1ed74dc4?auto=format&fit=crop&q=80&w=200" },
      { name: "Fleur de Sel", price: "Rp 45rb", image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=200" },
      { name: "Spiced Salt", price: "Rp 32rb", image: "https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&q=80&w=200" }
    ]
  }
];

const PRODUCTS = [
  {
    id: 1,
    name: "Kopi Arabika Gayo Grade 1",
    koperasi: "Koperasi Tani Maju Gayo",
    location: "Bener Meriah, Aceh",
    price: "Rp 85.000",
    unit: "/ kg",
    stock: "320 kg",
    minOrder: "5 kg",
    tag: "☕ Kopi",
    category: "kopi",
    verified: true,
    image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    name: "Ikan Asin Jambal Roti",
    koperasi: "Koperasi Nelayan Sejahtera",
    location: "Demak, Jateng",
    price: "Rp 120.000",
    unit: "/ kg",
    stock: "45 kg",
    minOrder: "1 kg",
    tag: "🐟 Hasil Laut",
    category: "ikan",
    verified: true,
    image: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    name: "Beras Merah Organik Premium",
    koperasi: "KUD Subur Makmur",
    location: "Cianjur, Jabar",
    price: "Rp 24.000",
    unit: "/ kg",
    stock: "1.2 Ton",
    minOrder: "10 kg",
    tag: "🌾 Pertanian",
    category: "padi",
    verified: true,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    name: "Udang Kering (Ebi) Super",
    koperasi: "Koperasi Bahari Jaya",
    location: "Sidoarjo, Jatim",
    price: "Rp 150.000",
    unit: "/ kg",
    stock: "80 kg",
    minOrder: "2 kg",
    tag: "🦐 Hasil Laut",
    category: "udang",
    verified: false,
    image: "https://images.unsplash.com/photo-1621852004158-f3bc188ace2d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 5,
    name: "Rumput Laut Kering Grade A",
    koperasi: "KUD Samudra Hijau",
    location: "Nusa Penida, Bali",
    price: "Rp 35.000",
    unit: "/ kg",
    stock: "500 kg",
    minOrder: "5 kg",
    tag: "🌿 Hasil Laut",
    category: "rumput",
    verified: true,
    image: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 6,
    name: "Garam Laut Kusamba Asli",
    koperasi: "Koperasi Garam Kusamba",
    location: "Klungkung, Bali",
    price: "Rp 18.000",
    unit: "/ kg",
    stock: "250 kg",
    minOrder: "10 kg",
    tag: "🍯 Olahan",
    category: "olahan",
    verified: true,
    image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 7,
    name: "Madu Hutan Liar Sumbawa",
    koperasi: "Koperasi Wanabakti",
    location: "Sumbawa, NTB",
    price: "Rp 145.000",
    unit: "/ botol",
    stock: "120 botol",
    minOrder: "2 botol",
    tag: "🍯 Olahan",
    category: "olahan",
    verified: true,
    image: "https://images.unsplash.com/photo-1587049352847-4d4b1ed74dc4?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 8,
    name: "Kopi Bubuk Robusta Lereng Kelud",
    koperasi: "KUD Lereng Kelud",
    location: "Kediri, Jatim",
    price: "Rp 65.000",
    unit: "/ kg",
    stock: "180 kg",
    minOrder: "3 kg",
    tag: "☕ Kopi",
    category: "kopi",
    verified: false,
    image: "https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 9,
    name: "Beras Pandan Wangi Premium",
    koperasi: "KUD Subur Makmur",
    location: "Cianjur, Jabar",
    price: "Rp 28.000",
    unit: "/ kg",
    stock: "850 kg",
    minOrder: "10 kg",
    tag: "🌾 Pertanian",
    category: "padi",
    verified: true,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 10,
    name: "Cumi Segar Kupas Super",
    koperasi: "Koperasi Nelayan Sejahtera",
    location: "Demak, Jateng",
    price: "Rp 95.000",
    unit: "/ kg",
    stock: "150 kg",
    minOrder: "2 kg",
    tag: "🐟 Hasil Laut",
    category: "ikan",
    verified: true,
    image: "https://images.unsplash.com/photo-1534062590479-79a0cf833215?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 11,
    name: "Sayur Bayam Organik Segar",
    koperasi: "KUD Subur Makmur",
    location: "Cianjur, Jabar",
    price: "Rp 12.000",
    unit: "/ ikat",
    stock: "90 ikat",
    minOrder: "5 ikat",
    tag: "🥬 Sayuran",
    category: "sayur",
    verified: true,
    image: "https://images.unsplash.com/photo-1628186100298-b8058204b7b6?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 12,
    name: "Cabai Rawit Merah Gembong",
    koperasi: "KUD Subur Makmur",
    location: "Cianjur, Jabar",
    price: "Rp 45.000",
    unit: "/ kg",
    stock: "110 kg",
    minOrder: "2 kg",
    tag: "🥬 Sayuran",
    category: "sayur",
    verified: false,
    image: "https://images.unsplash.com/photo-1592982537447-6f29fb443831?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 13,
    name: "Teh Hitam Gunung Dempo",
    koperasi: "Koperasi Wanabakti",
    location: "Sumbawa, NTB",
    price: "Rp 32.000",
    unit: "/ kotak",
    stock: "400 kotak",
    minOrder: "5 kotak",
    tag: "🍯 Olahan",
    category: "olahan",
    verified: true,
    image: "https://images.unsplash.com/photo-1587049352847-4d4b1ed74dc4?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 14,
    name: "Udang Vaname Premium Size 50",
    koperasi: "Koperasi Bahari Jaya",
    location: "Sidoarjo, Jatim",
    price: "Rp 110.000",
    unit: "/ kg",
    stock: "230 kg",
    minOrder: "5 kg",
    tag: "🦐 Hasil Laut",
    category: "udang",
    verified: true,
    image: "https://images.unsplash.com/photo-1621852004158-f3bc188ace2d?auto=format&fit=crop&q=80&w=800"
  }
];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function BrandPage() {
  const [activeCategory, setActiveCategory] = useState("semua");
  const [selectedKoperasi, setSelectedKoperasi] = useState("");
  const [selectedKomoditas, setSelectedKomoditas] = useState("");
  const [shippingDest, setShippingDest] = useState("");
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilterKoperasi, setSelectedFilterKoperasi] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [minStockLimit, setMinStockLimit] = useState(0);
  const [minOrderLimit, setMinOrderLimit] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter products based on active filters
  const filteredProducts = PRODUCTS.filter((p) => {
    // 1. Category Filter
    const matchesCategory = activeCategory === "semua" || p.category === activeCategory;
    // 2. Search Query Filter
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.koperasi.toLowerCase().includes(searchQuery.toLowerCase());
    // 3. Koperasi Filter
    const matchesKoperasi = !selectedFilterKoperasi || p.koperasi === selectedFilterKoperasi;
    // 4. Verified Status Filter
    const matchesVerified = !onlyVerified || p.verified;
    // 5. Min Stock Filter
    const stockVal = parseFloat(p.stock.replace(/[^0-9.]/g, "")) * (p.stock.toLowerCase().includes("ton") ? 1000 : 1);
    const matchesStock = !minStockLimit || stockVal >= minStockLimit;
    // 6. Min Order Filter
    const minOrderVal = parseFloat(p.minOrder.replace(/[^0-9.]/g, "")) * (p.minOrder.toLowerCase().includes("ton") ? 1000 : 1);
    const matchesMinOrder = !minOrderLimit || minOrderVal >= minOrderLimit;

    return matchesCategory && matchesSearch && matchesKoperasi && matchesVerified && matchesStock && matchesMinOrder;
  }).sort((a, b) => {
    if (sortBy === "termurah") {
      const priceA = parseInt(a.price.replace(/[^0-9]/g, ""));
      const priceB = parseInt(b.price.replace(/[^0-9]/g, ""));
      return priceA - priceB;
    }
    if (sortBy === "termahal") {
      const priceA = parseInt(a.price.replace(/[^0-9]/g, ""));
      const priceB = parseInt(b.price.replace(/[^0-9]/g, ""));
      return priceB - priceA;
    }
    return 0; // Default order
  });

  return (
    <div className="w-full bg-(--color-cream) min-h-screen">
      {/* === SECONDARY NAVBAR AGROU PASAR === */}
      <div className="w-full bg-transparent sticky top-13 z-40 pt-1.5 pb-0.5">
        <div className="max-w-360 mx-auto px-8">
          <div className="bg-[#7a2e00] rounded-2xl shadow-lg shadow-[#7a2e00]/15 flex items-center gap-3 h-12 px-5">

            {/* Semua Kategori button */}
            <button className="flex items-center gap-2 bg-(--color-orange-dark) text-white font-bold text-xs px-4 py-2 rounded-full whitespace-nowrap hover:bg-(--color-orange) transition-all shrink-0 cursor-pointer">
              <span className="text-base leading-none">≡</span>
              Semua Komoditas
            </button>

            {/* Divider */}
            <div className="w-px h-5 bg-white/20 shrink-0" />

            {/* Quick links */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1">
              {[
                "Ikan & Laut",
                "Padi & Serealia",
                "Kopi & Rempah",
                "Sayuran Segar",
                "Udang & Budidaya",
                "Produk Olahan"
              ].map((item) => (
                <button
                  key={item}
                  className="text-white/75 hover:text-white text-xs font-semibold whitespace-nowrap px-3 py-1.5 rounded-full hover:bg-white/10 transition-all"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="w-px h-5 bg-white/20 shrink-0" />

            {/* Search bar */}
            <div className="relative shrink-0">
              <input
                type="text"
                placeholder="Cari komoditas..."
                className="bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-full px-4 py-1.5 text-xs w-36 focus:outline-none focus:border-(--color-lime) focus:bg-white/15 transition-all"
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          1. HERO BANNER — 2-column layout
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="max-w-360 mx-auto px-8 pt-3.5">
        <div
          className="relative w-full overflow-hidden rounded-2xl"
          style={{ minHeight: 320 }}
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-linear-to-br from-[#7a2e00] via-(--color-orange-dark) to-(--color-orange)" />

          {/* Dot pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-10 px-6 md:px-14 min-h-80">
            {/* Left Column (Text & Stats) */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 bg-(--color-lime) text-(--color-forest-dark) text-[10px] font-black tracking-[0.12em] px-3 py-1.5 rounded-full mb-5 w-fit uppercase">
                🏪 AGROU PASAR
              </div>

              {/* H1 */}
              <h1
                className="font-display font-black text-white leading-[1.05] mb-4 max-w-2xl text-left"
                style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
              >
                Produk Segar Langsung<br />
                <span className="text-(--color-lime) italic">dari Koperasi Desa.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-white/75 text-sm md:text-base leading-relaxed mb-6 max-w-xl font-medium text-left">
                Temukan hasil panen terbaik langsung dari koperasi desa terverifikasi — tanpa perantara, harga adil, kualitas terjamin dari sumber aslinya.
              </p>

              {/* CTA row */}
              <div className="flex flex-wrap items-center gap-3">
                <button className="bg-(--color-lime) text-(--color-forest-dark) font-black px-6 py-3 rounded-full text-sm hover:brightness-110 transition-all shadow-[0_4px_20px_rgba(181,242,61,0.3)] cursor-pointer">
                  Ceritakan Kebutuhanmu
                </button>
                <button
                  onClick={() => setActiveCategory("semua")}
                  className="bg-white/10 backdrop-blur border border-white/30 text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-white/20 transition-all cursor-pointer"
                >
                  Cari &amp; Filter Produk
                </button>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-5 mt-5 pt-5 border-t border-white/10 max-w-xl">
                {[
                  { num: "2.400+", label: "Koperasi Aktif" },
                  { num: "47", label: "Komoditas" },
                  { num: "Rp 0 Komisi", label: "Langsung Petani" },
                ].map(({ num, label }) => (
                  <div key={label} className="flex flex-col text-left">
                    <span className="text-(--color-lime) font-black text-lg font-sans">{num}</span>
                    <span className="text-white/50 text-[10px] font-sans tracking-wide mt-0.5">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column (The Small Order Card) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
              {orderSubmitted ? (
                <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-85 text-gray-800 border border-white/20 relative z-20 flex flex-col items-center justify-center text-center min-h-88 animate-fade-in">
                  <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-4 animate-bounce">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="font-sans font-extrabold text-lg text-[#0d2918]">Permintaan Terkirim!</h3>
                  <p className="text-gray-500 text-xs mt-2 leading-relaxed px-2">
                    Permintaan untuk Koperasi <strong>{selectedKoperasi || "Mitra"}</strong> untuk komoditas <strong>{selectedKomoditas || "Terpilih"}</strong> dengan tujuan <strong>{shippingDest || "Lokasi Anda"}</strong> berhasil dibuat. Petani akan segera menghubungi Anda.
                  </p>
                  <button 
                    onClick={() => {
                      setOrderSubmitted(false);
                      setSelectedKoperasi("");
                      setSelectedKomoditas("");
                      setShippingDest("");
                    }}
                    className="mt-6 bg-(--color-orange) hover:bg-(--color-orange-dark) text-white text-xs font-bold px-6 py-2.5 rounded-full transition-all cursor-pointer shadow-md hover:shadow-lg"
                  >
                    Kirim Pesanan Lain
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-85 text-gray-800 border border-white/20 relative z-20">
                  <div className="mb-4 text-left">
                    <h3 className="font-sans font-extrabold text-lg text-[#0d2918] tracking-tight">Pesan Cepat</h3>
                    <p className="text-gray-400 text-[11px]">Hubungi langsung koperasi petani</p>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Select Koperasi */}
                    <div className="relative">
                      <select 
                        value={selectedKoperasi}
                        onChange={(e) => setSelectedKoperasi(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl pl-4 pr-10 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-(--color-orange) focus:border-transparent appearance-none cursor-pointer"
                      >
                        <option value="">Pilih Koperasi Desa</option>
                        {FEATURED_KOPERASI.map(kop => (
                          <option key={kop.id} value={kop.name}>{kop.name}</option>
                        ))}
                        <option value="Koperasi Bahari Jaya">Koperasi Bahari Jaya</option>
                        <option value="KUD Samudra Hijau">KUD Samudra Hijau</option>
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>

                    {/* Select Komoditas */}
                    <div className="relative">
                      <select
                        value={selectedKomoditas}
                        onChange={(e) => setSelectedKomoditas(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl pl-4 pr-10 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-(--color-orange) focus:border-transparent appearance-none cursor-pointer"
                      >
                        <option value="">Pilih Komoditas</option>
                        {PRODUCTS.map(prod => (
                          <option key={prod.id} value={prod.name}>{prod.name} ({prod.price})</option>
                        ))}
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>

                    {/* Tujuan Pengiriman */}
                    <div className="relative">
                      <select
                        value={shippingDest}
                        onChange={(e) => setShippingDest(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl pl-4 pr-10 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-(--color-orange) focus:border-transparent appearance-none cursor-pointer"
                      >
                        <option value="">Pilih Tujuan Pengiriman</option>
                        <option value="Jakarta">Jakarta (DKI)</option>
                        <option value="Bandung">Bandung (Jabar)</option>
                        <option value="Surabaya">Surabaya (Jatim)</option>
                        <option value="Medan">Medan (Sumut)</option>
                        <option value="Makassar">Makassar (Sulsel)</option>
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>

                  {/* Mitra Row */}
                  <div className="mt-4 mb-5 text-left">
                    <div className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400 mb-2">Mitra Pilihan</div>
                    <div className="flex items-center gap-1.5">
                      {FEATURED_KOPERASI.map((kop) => (
                        <div key={kop.id} className="relative group cursor-pointer" onClick={() => setSelectedKoperasi(kop.name)}>
                          <img 
                            src={kop.logo} 
                            alt={kop.name} 
                            className={`w-8 h-8 rounded-full border-2 object-cover hover:scale-105 transition-all ${selectedKoperasi === kop.name ? "border-(--color-orange)" : "border-gray-200"}`}
                            title={kop.name}
                          />
                        </div>
                      ))}
                      {/* Farmer Avatar */}
                      <div className="relative group cursor-pointer" onClick={() => setSelectedKoperasi("KUD Subur Makmur")}>
                        <img 
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" 
                          alt="Petani" 
                          className={`w-8 h-8 rounded-full border-2 object-cover hover:scale-105 transition-all ${selectedKoperasi === "KUD Subur Makmur" ? "border-(--color-orange)" : "border-gray-200"}`}
                          title="Pak Slamet (Petani Mitra)"
                        />
                      </div>
                      
                      {/* Lainnya pill */}
                      <button className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-0.5 hover:bg-gray-200 transition-colors ml-auto cursor-pointer">
                        Semua
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button 
                    onClick={() => {
                      if (!selectedKoperasi || !selectedKomoditas || !shippingDest) {
                        alert("Silakan lengkapi formulir terlebih dahulu!");
                        return;
                      }
                      setOrderSubmitted(true);
                    }}
                    className="w-full bg-(--color-orange) hover:bg-(--color-orange-dark) text-white text-xs font-black py-3 rounded-xl transition-all shadow-[0_4px_12px_rgba(247,127,0,0.2)] active:scale-[0.98] uppercase tracking-wider cursor-pointer"
                  >
                    Hubungi Koperasi
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* ════════════════════════════════════════════════════════════════════════
          3. FEATURED KOPERASI
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="max-w-360 mx-auto px-8 py-10 lg:py-14">
        {/* Title Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display font-black text-2xl text-(--color-forest-dark)">Koperasi Pilihan Minggu Ini</h2>
            <p className="text-(--color-text-secondary) text-sm mt-1">Koperasi desa terverifikasi dengan rekam jejak proteksi lahan dan kualitas produk terjamin</p>
          </div>
          <button className="text-(--color-orange) font-bold text-sm flex items-center gap-1 hover:text-(--color-orange-dark) transition-colors cursor-pointer">
            Lihat Koperasi Lainnya <ArrowRight size={14} />
          </button>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Introducing Card (lg:col-span-4) - Split vertically */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Top main card */}
            <div className="bg-[#fcf7ee] rounded-3xl p-8 border border-(--color-border) shadow-sm flex flex-col justify-between relative overflow-hidden flex-1 group hover:shadow-md transition-shadow duration-300">
              {/* Photo background */}
              <img 
                src={promoAceh} 
                alt="Farm landscape background" 
                className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700 pointer-events-none z-0"
              />
              {/* Soft overlay gradient to ensure readability */}
              <div className="absolute inset-0 bg-linear-to-r from-[#fcf7ee]/95 via-[#fcf7ee]/80 to-[#fcf7ee]/30 z-10 pointer-events-none" />
              
              <div className="relative z-20">
                <span className="text-[10px] bg-(--color-orange)/10 text-(--color-orange-dark) font-black tracking-wider px-3 py-1.5 rounded-full uppercase">
                  ⭐ Koperasi Utama
                </span>
                
                <h3 className="font-display font-black text-2xl text-(--color-forest-dark) mt-6 leading-tight text-left">
                  Koperasi Desa Unggul &amp; Terverifikasi
                </h3>
                
                <p className="text-(--color-text-secondary) text-xs mt-3 leading-relaxed max-w-70 text-left">
                  Kami menghubungkan Anda langsung dengan koperasi desa yang telah melewati proses kurasi ketat untuk memastikan kualitas hasil tani terbaik dan keberlanjutan lingkungan lahan.
                </p>
              </div>

              <div className="relative z-20 mt-8 text-left">
                <button className="bg-(--color-forest) hover:bg-(--color-forest-dark) text-white text-xs font-bold px-6 py-3 rounded-full flex items-center gap-1.5 transition-all shadow-[0_4px_12px_rgba(26,61,46,0.15)] group-hover:translate-x-1 duration-200 cursor-pointer">
                  Jelajahi Semua Mitra <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Bottom split card for Chatbot assistant */}
            <div className="bg-white rounded-3xl p-8 border border-(--color-border) shadow-sm hover:shadow-md transition-all duration-300 text-left flex flex-col justify-between min-h-55">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-sans font-extrabold text-sm text-(--color-forest-dark) flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Tanya Asisten AI
                  </h4>
                  <span className="text-[9px] bg-green-50 text-green-700 font-extrabold px-2 py-0.5 rounded">ONLINE</span>
                </div>
                
                {chatMessage ? (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-xs text-gray-700 mb-4 animate-fade-in text-left">
                    <div className="font-bold text-[9px] text-(--color-orange-dark) mb-1 uppercase tracking-wider">Asisten Agrou:</div>
                    <p className="leading-relaxed">
                      Untuk rekomendasi komoditas sesuai pencarian Anda, saya menyarankan <strong>KUD Subur Makmur</strong> untuk Beras Organik premium, atau <strong>Koperasi Tani Maju Gayo</strong> untuk Kopi Arabika berkualitas tinggi.
                    </p>
                    <button 
                      onClick={() => setChatMessage("")}
                      className="text-[10px] text-gray-400 hover:text-gray-600 font-bold mt-3.5 underline block text-right w-full cursor-pointer"
                    >
                      Tanya Lagi
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-[11px] text-gray-500 mb-3 leading-relaxed">
                      Tulis komoditas atau lokasi yang dicari untuk mendapatkan rekomendasi koperasi terbaik secara instan.
                    </p>
                    
                    {/* Preset buttons to enlarge card and add features */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {[
                        { label: "🌾 Cari Beras", text: "Saya ingin membeli beras Cianjur premium" },
                        { label: "☕ Kopi Gayo", text: "Tunjukkan koperasi penghasil kopi Gayo Arabika" },
                        { label: "🦐 Udang Segar", text: "Cari produsen udang vaname berkualitas" }
                      ].map((preset) => (
                        <button 
                          key={preset.label}
                          onClick={() => setChatMessage(preset.text)}
                          className="bg-gray-50 hover:bg-(--color-orange)/15 hover:text-(--color-orange-dark) text-gray-500 hover:border-(--color-orange)/35 text-[9px] font-bold px-2.5 py-1.5 rounded-lg border border-gray-200 transition-colors cursor-pointer text-left"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              {!chatMessage && (
                <div className="relative flex items-center mt-2">
                  <input 
                    type="text" 
                    placeholder="Tulis pesan (misal: beras premium cianjur)..." 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && chatInput.trim()) {
                        setChatMessage(chatInput);
                        setChatInput("");
                      }
                    }}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 placeholder:text-gray-400 rounded-xl pl-4 pr-10 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-(--color-orange) focus:border-transparent font-medium"
                  />
                  <button 
                    onClick={() => {
                      if (chatInput.trim()) {
                        setChatMessage(chatInput);
                        setChatInput("");
                      }
                    }}
                    className="absolute right-1.5 bg-(--color-orange) hover:bg-(--color-orange-dark) text-white w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow active:scale-95"
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Grid of 6 smaller layouts (lg:col-span-8) */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 h-full">
              {FEATURED_KOPERASI.map((kop, idx) => (
                <motion.div
                  key={kop.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="bg-white rounded-3xl overflow-hidden border border-(--color-border) hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer group text-left pb-4 w-full relative"
                >
                  {/* 1. Cover Image Block */}
                  <div className="h-20 relative bg-gray-100 overflow-hidden">
                    <img 
                      src={kop.cover} 
                      alt={kop.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/45 to-transparent" />

                    {/* Verified badge */}
                    <div className="absolute top-2 right-2 bg-(--color-lime) text-(--color-forest-dark) text-[7px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                      <BadgeCheck size={8} />
                      Verified Farm
                    </div>
                  </div>

                  {/* 2. Overlapping Logo Avatar */}
                  <div className="relative px-4 text-left">
                    <div className="absolute -top-6 left-4 w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow bg-white">
                      <img src={kop.logo} alt="Logo" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* 3. Header Info */}
                  <div className="pt-6 px-4 flex-1 flex flex-col text-left">
                    <h4 className="font-display font-black text-sm text-(--color-orange-dark) leading-tight tracking-tight mt-1 group-hover:text-(--color-orange) transition-colors line-clamp-1">
                      {kop.name}
                    </h4>

                    <div className="flex flex-wrap items-center gap-1.5 text-[9px] text-gray-500 mt-1 font-bold">
                      <span className="flex items-center gap-0.5"><MapPin size={9} className="text-gray-400" /> {kop.location.split(",")[0]}</span>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-0.5"><Users size={9} className="text-gray-400" /> {kop.members} Anggota</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {kop.tags.map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-600 text-[8px] font-extrabold px-1.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Description */}
                    <p className="text-[10px] text-gray-500 mt-2.5 leading-relaxed line-clamp-2 min-h-7.5">
                      {kop.desc}
                    </p>

                    {/* 4. Products Preview Box */}
                    <div className="grid grid-cols-3 gap-1.5 mt-3">
                      {kop.products.map((p, pIdx) => (
                        <div key={pIdx} className="bg-gray-50 rounded-xl p-1 border border-gray-100 flex flex-col justify-between min-h-20.5 hover:border-gray-200 transition-colors">
                          <div className="w-full h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="mt-1 flex flex-col justify-end">
                            <div className="text-[7.5px] font-extrabold text-gray-700 truncate w-full text-left leading-none" title={p.name}>
                              {p.name}
                            </div>
                            <div className="text-[8px] text-(--color-orange) font-black truncate w-full text-left mt-0.5 leading-none">
                              {p.price}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 5. Rating & Stock Info */}
                    <div className="flex items-center justify-between mt-3.5 pt-2.5 border-t border-gray-100 text-[10px]">
                      <div className="flex items-center gap-1.5 font-bold text-gray-600">
                        <span className="flex items-center gap-0.5"><Star size={10} className="text-yellow-400 fill-yellow-400" /> {kop.rating}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-[9px] text-gray-400 font-medium">{kop.reviews} ulasan</span>
                      </div>
                      <span className="text-[8px] bg-green-50 text-green-600 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide">
                        Stok tersedia
                      </span>
                    </div>

                    {/* 6. Buttons */}
                    <div className="flex items-center gap-1.5 mt-3 pt-1">
                      <button className="flex-1 bg-(--color-cream) hover:bg-(--color-orange) hover:text-white border border-(--color-orange)/25 text-(--color-orange-dark) font-bold text-[9px] py-1.5 rounded-lg text-center transition-all cursor-pointer">
                        🏪 Kunjungi Toko
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 font-extrabold text-[9px] px-2 py-1.5 whitespace-nowrap cursor-pointer">
                        + Bandingkan
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          4. PRODUCT CATALOG
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="max-w-360 mx-auto px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-black text-xl text-(--color-forest-dark)">Produk Tersedia Sekarang</h2>
            <p className="text-sm text-(--color-text-secondary) mt-0.5">Langsung dari koperasi, siap dipesan hari ini</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Filter Column (lg:col-span-3) */}
          <div className="lg:col-span-3 sticky top-20 z-10">
            <div className="bg-white rounded-3xl p-5 border border-(--color-border) shadow-sm text-left flex flex-col gap-5">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-sans font-black text-xs text-(--color-forest-dark) tracking-wider uppercase flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-(--color-orange) animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                  Filter &amp; Kategori
                </h3>
                {(searchQuery || selectedFilterKoperasi !== "" || sortBy !== "default" || onlyVerified || activeCategory !== "semua" || minStockLimit > 0 || minOrderLimit > 0) && (
                  <button 
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedFilterKoperasi("");
                      setSortBy("default");
                      setOnlyVerified(false);
                      setActiveCategory("semua");
                      setMinStockLimit(0);
                      setMinOrderLimit(0);
                    }}
                    className="text-[10px] text-(--color-orange-dark) hover:underline font-bold cursor-pointer"
                  >
                    Reset Semua
                  </button>
                )}
              </div>

              {/* SECTION 1: KATEGORI KOMODITAS */}
              <div>
                <label className="block text-[9px] uppercase tracking-wider font-black text-gray-400 mb-2">Kategori Komoditas</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {CATEGORIES.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-2 rounded-xl border transition-all text-left cursor-pointer ${
                          isActive
                            ? "bg-(--color-forest) text-white border-transparent shadow-sm"
                            : "text-gray-600 bg-gray-50 border-gray-100 hover:bg-gray-100"
                        }`}
                      >
                        <span className="text-xs leading-none shrink-0">{cat.emoji}</span>
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: CARI KOMODITAS */}
              <div>
                <label className="block text-[9px] uppercase tracking-wider font-black text-gray-400 mb-1.5">Cari Komoditas</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Beras, kopi, cumi..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 placeholder:text-gray-400 rounded-xl pl-3 pr-8 py-2 text-[10px] focus:outline-none focus:ring-1 focus:ring-(--color-orange) focus:border-transparent font-medium"
                  />
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Search size={12} />
                  </div>
                </div>
              </div>

              {/* SECTION 3: MITRA UNGGULAN */}
              <div>
                <label className="block text-[9px] uppercase tracking-wider font-black text-gray-400 mb-2">Mitra Unggulan</label>
                <div className="space-y-2">
                  {[
                    { name: "Siti Rahma", title: "KUD Subur Makmur", role: "padi", roleLabel: "Padi", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100", active: activeCategory === "padi" },
                    { name: "Pak Slamet", title: "Koperasi Nelayan", role: "ikan", roleLabel: "Ikan", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100", active: activeCategory === "ikan" }
                  ].map((p, index) => (
                    <div 
                      key={index}
                      onClick={() => setActiveCategory(p.active ? "semua" : p.role)}
                      className={`flex items-center gap-2.5 p-2 rounded-2xl border transition-all cursor-pointer ${p.active ? "border-(--color-orange) bg-(--color-orange)/5" : "border-gray-100 hover:bg-gray-50"}`}
                    >
                      <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover shadow-sm border border-white" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-black text-(--color-forest-dark) leading-none mb-0.5">{p.name}</div>
                        <div className="text-[8.5px] text-gray-400 font-medium truncate">{p.title}</div>
                      </div>
                      <span className="text-[7.5px] bg-gray-100 text-gray-500 font-bold px-1.5 py-0.5 rounded-full shrink-0">{p.roleLabel}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 4: STATUS & VERIFIKASI */}
              <div>
                <label className="block text-[9px] uppercase tracking-wider font-black text-gray-400 mb-2">Status &amp; Verifikasi</label>
                <div className="flex flex-wrap gap-1.5">
                  <button 
                    onClick={() => setOnlyVerified(!onlyVerified)}
                    className={`text-[9px] font-black px-2.5 py-1 rounded-full border transition-all cursor-pointer ${onlyVerified ? "bg-(--color-lime) text-(--color-forest-dark) border-transparent" : "bg-gray-50 text-gray-500 border-gray-200"}`}
                  >
                    ✓ Verified Farm
                  </button>
                  <button 
                    onClick={() => setMinStockLimit(minStockLimit > 0 ? 0 : 50)}
                    className={`text-[9px] font-black px-2.5 py-1 rounded-full border transition-all cursor-pointer ${minStockLimit > 0 ? "bg-(--color-orange) text-white border-transparent" : "bg-gray-50 text-gray-500 border-gray-200"}`}
                  >
                    ⚡ Ready Stock
                  </button>
                </div>
              </div>

              {/* SECTION 5: PARAMETERS */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[8px] uppercase tracking-wider font-extrabold text-gray-400 mb-1">Min Order</label>
                    <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-2 py-1">
                      <button 
                        onClick={() => setMinOrderLimit(Math.max(0, minOrderLimit - 5))}
                        className="text-gray-500 hover:text-black font-extrabold text-xs cursor-pointer select-none"
                      >
                        -
                      </button>
                      <span className="text-[10px] font-black text-gray-700 flex-1 text-center">{minOrderLimit || 0} kg</span>
                      <button 
                        onClick={() => setMinOrderLimit(minOrderLimit + 5)}
                        className="text-gray-500 hover:text-black font-extrabold text-xs cursor-pointer select-none"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[8px] uppercase tracking-wider font-extrabold text-gray-400 mb-1">Stok Minimum</label>
                    <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-2 py-1">
                      <button 
                        onClick={() => setMinStockLimit(Math.max(0, minStockLimit - 10))}
                        className="text-gray-500 hover:text-black font-extrabold text-xs cursor-pointer select-none"
                      >
                        -
                      </button>
                      <span className="text-[10px] font-black text-gray-700 flex-1 text-center">{minStockLimit || 0} kg</span>
                      <button 
                        onClick={() => setMinStockLimit(minStockLimit + 10)}
                        className="text-gray-500 hover:text-black font-extrabold text-xs cursor-pointer select-none"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[8px] uppercase tracking-wider font-extrabold text-gray-400 mb-1">Urutan Harga</label>
                    <div className="relative">
                      <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl pl-2.5 pr-6 py-1.5 text-[9.5px] font-bold focus:outline-none focus:ring-1 focus:ring-(--color-orange) appearance-none cursor-pointer"
                      >
                        <option value="default">Rekomendasi</option>
                        <option value="termurah">Termurah</option>
                        <option value="termahal">Termahal</option>
                      </select>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[8px] uppercase tracking-wider font-extrabold text-gray-400 mb-1">Pilih Mitra</label>
                    <div className="relative">
                      <select 
                        value={selectedFilterKoperasi}
                        onChange={(e) => setSelectedFilterKoperasi(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl pl-2.5 pr-6 py-1.5 text-[9.5px] font-bold focus:outline-none focus:ring-1 focus:ring-(--color-orange) appearance-none cursor-pointer"
                      >
                        <option value="">Semua Koperasi</option>
                        {FEATURED_KOPERASI.map(kop => (
                          <option key={kop.id} value={kop.name}>{kop.name}</option>
                        ))}
                        <option value="Koperasi Bahari Jaya">Koperasi Bahari Jaya</option>
                        <option value="KUD Samudra Hijau">KUD Samudra Hijau</option>
                      </select>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terapkan Button */}
              <button 
                onClick={() => {
                  alert(`Berhasil memfilter: ditemukan ${filteredProducts.length} produk`);
                }}
                className="w-full bg-(--color-orange) hover:bg-(--color-orange-dark) text-white text-[10px] font-black py-2.5 rounded-xl transition-all shadow-[0_4px_12px_rgba(247,127,0,0.15)] active:scale-[0.98] uppercase tracking-wider cursor-pointer text-center"
              >
                Terapkan Filter ({filteredProducts.length})
              </button>
            </div>
          </div>

          {/* Catalog Column (lg:col-span-9) */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="py-24 bg-white rounded-3xl border border-(--color-border) flex flex-col items-center text-center">
                <div className="text-6xl mb-4">🌾</div>
                <p className="font-bold text-gray-500 text-lg mb-1">Produk tidak ditemukan</p>
                <p className="text-gray-400 text-sm">Coba sesuaikan filter atau kategori lain</p>
              </div>
            ) : (() => {
              const itemsPerPage = 12;
              const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
              const validCurrentPage = Math.min(currentPage, totalPages);
              const paginatedProducts = filteredProducts.slice(
                (validCurrentPage - 1) * itemsPerPage,
                validCurrentPage * itemsPerPage
              );

              return (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5">
                    {paginatedProducts.map((prod, idx) => (
                  <motion.div
                    key={prod.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.03 }}
                    className="bg-white rounded-xl overflow-hidden border border-(--color-border) hover:shadow-[0_4px_16px_rgba(26,61,46,0.08)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col w-full text-left"
                  >
                    {/* Image area */}
                    <div className="h-20 relative overflow-hidden bg-gray-100 bg-center">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover transition-transform duration-700"
                      />
                      {prod.verified && (
                        <div className="absolute top-1.5 left-1.5 bg-(--color-lime) text-(--color-forest-dark) text-[7px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
                          ✓ Verified
                        </div>
                      )}
                      <div className="absolute top-1.5 right-1.5 bg-(--color-forest-dark)/85 backdrop-blur text-white text-[7.5px] font-bold px-1.5 py-0.5 rounded-full">
                        {prod.tag}
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-extrabold text-[10px] text-(--color-text-primary) leading-tight mb-0.5 line-clamp-2 min-h-6">{prod.name}</h3>

                        <div className="text-(--color-text-secondary) text-[8px] mb-0.5 flex items-center gap-1 font-bold">
                          <Store size={8} className="text-gray-400 shrink-0" /> <span className="truncate">{prod.koperasi}</span>
                        </div>
                        <div className="text-(--color-text-secondary) text-[8px] flex items-center gap-1">
                          <MapPin size={8} className="text-gray-400 shrink-0" /> <span className="truncate">{prod.location}</span>
                        </div>

                        {/* Info row */}
                        <div className="flex items-center justify-between text-[8px] bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 mt-1.5">
                          <div>
                            <span className="text-gray-400 font-medium">Stok: </span>
                            <span className="font-extrabold text-(--color-forest-dark)">{prod.stock}</span>
                          </div>
                          <div className="w-px h-2 bg-gray-200" />
                          <div>
                            <span className="text-gray-400 font-medium">Min: </span>
                            <span className="font-extrabold text-(--color-forest-dark)">{prod.minOrder}</span>
                          </div>
                        </div>
                      </div>

                      {/* Price + button */}
                      <div className="mt-2.5">
                        <div className="text-(--color-orange) font-black text-sm">
                          {prod.price}<span className="text-gray-400 text-[9px] font-normal ml-0.5">{prod.unit}</span>
                        </div>
                        <button className="w-full bg-(--color-orange) hover:bg-(--color-orange-dark) text-white font-extrabold text-[9px] py-1.5 rounded-lg mt-2 transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer">
                          <ShoppingCart size={10} />
                          Pesan
                        </button>
                      </div>
                    </div>
                  </motion.div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="mt-10 flex justify-center items-center gap-1.5 animate-fade-in">
                      {/* Previous Page Button */}
                      <button
                        onClick={() => setCurrentPage(Math.max(1, validCurrentPage - 1))}
                        disabled={validCurrentPage === 1}
                        className={`w-8 h-8 rounded-xl border flex items-center justify-center text-xs font-black transition-all cursor-pointer select-none ${
                          validCurrentPage === 1
                            ? "text-gray-300 border-gray-100 bg-gray-50/50 cursor-not-allowed"
                            : "text-(--color-forest-dark) border-gray-200 bg-white hover:border-(--color-orange) hover:text-(--color-orange) hover:shadow-sm active:scale-95"
                        }`}
                        title="Halaman Sebelumnya"
                      >
                        &lt;
                      </button>

                      {/* Page Buttons */}
                      {Array.from({ length: totalPages }).map((_, pIdx) => {
                        const pNum = pIdx + 1;
                        const isActive = validCurrentPage === pNum;
                        return (
                          <button
                            key={pNum}
                            onClick={() => setCurrentPage(pNum)}
                            className={`w-8 h-8 rounded-xl border flex items-center justify-center text-[11px] font-black transition-all cursor-pointer select-none ${
                              isActive
                                ? "bg-(--color-orange) text-white border-transparent shadow-sm shadow-(--color-orange)/15"
                                : "text-gray-600 border-gray-200 bg-white hover:border-(--color-orange) hover:text-(--color-orange) hover:shadow-sm active:scale-95"
                            }`}
                          >
                            {pNum}
                          </button>
                        );
                      })}

                      {/* Next Page Button */}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, validCurrentPage + 1))}
                        disabled={validCurrentPage === totalPages}
                        className={`w-8 h-8 rounded-xl border flex items-center justify-center text-xs font-black transition-all cursor-pointer select-none ${
                          validCurrentPage === totalPages
                            ? "text-gray-300 border-gray-100 bg-gray-50/50 cursor-not-allowed"
                            : "text-(--color-forest-dark) border-gray-200 bg-white hover:border-(--color-orange) hover:text-(--color-orange) hover:shadow-sm active:scale-95"
                        }`}
                        title="Halaman Selanjutnya"
                      >
                        &gt;
                      </button>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          FLOATING CHATBOT BUTTON
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-6 right-6 z-50 group">
        <button
          className="bg-(--color-orange) text-white w-14 h-14 rounded-full flex items-center justify-center hover:bg-(--color-orange-dark) hover:scale-110 transition-all duration-200"
          style={{ boxShadow: "0 0 0 0 rgba(247,127,0,0.4), 0 8px 32px rgba(247,127,0,0.35)" }}
        >
          <MessageSquare size={24} className="fill-white/20" />
        </button>
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-(--color-orange-dark) text-white text-xs font-bold py-2 px-3.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none shadow-xl">
          Ceritakan Kebutuhanmu
          <div className="absolute -right-1.25 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-(--color-orange-dark) rotate-45" />
        </div>
      </div>

    </div>
  );
}
