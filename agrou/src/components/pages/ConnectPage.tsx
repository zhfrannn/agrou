import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  X,
  Heart,
  Share2,
  Eye,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Globe,
  Package,
  ShieldCheck,
  MapPin,
  Clock,
  Send,
  Star,
  BookOpen,
  Recycle,
  Filter,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Upload,
  ChevronRight,
  ExternalLink,
  User,
  MoreHorizontal,
  SquarePen,
  SlidersHorizontal,
  Minimize2,
  Maximize2,
} from "lucide-react";
import bgConnect from "@assets/bg-connect.jpg";
import { useRealtimePosts } from "../../hooks/useRealtimePosts";
import { useNavigate } from "react-router-dom";

// ═══════════════════════════════════════════════════════════════════════════════
// BILINGUAL SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
type Lang = "id" | "en";

const TRANSLATIONS: Record<string, Record<Lang, string>> = {
  // Hero
  heroLabel: { id: "🌐 EXPORT HUB", en: "🌐 EXPORT HUB" },
  heroHeading: {
    id: "Hubungkan Koperasimu ke Pasar Global",
    en: "Connect Your Cooperative to Global Markets",
  },
  heroSub: {
    id: "Importir dari seluruh dunia mencari produk agro-marine Indonesia yang terverifikasi. Temukan mereka — atau biarkan mereka menemukan kamu.",
    en: "Importers worldwide are seeking verified Indonesian agro-marine products. Find them — or let them find you.",
  },
  heroCtaPrimary: { id: "Post Penawaran", en: "Post Offer" },
  heroCtaSecondary: { id: "Cari Produk", en: "Find Products" },
  statKoperasi: { id: "Koperasi Terverifikasi", en: "Verified Cooperatives" },
  statNegara: { id: "Negara Pembeli Aktif", en: "Active Buyer Countries" },
  statTransaksi: {
    id: "Nilai Transaksi Bulan Ini",
    en: "Transaction Value This Month",
  },
  // Stats Bar
  statsOffers: { id: "Penawaran Aktif", en: "Active Offers" },
  statsRequests: { id: "Permintaan Terbuka", en: "Open Requests" },
  statsMatches: { id: "Match Berhasil", en: "Successful Matches" },
  statsRating: { id: "Rating Koperasi", en: "Cooperative Rating" },
  // Filter
  searchPlaceholder: {
    id: "Cari komoditas, koperasi, atau kebutuhan...",
    en: "Search commodities, cooperatives, or needs...",
  },
  askGroAI: { id: "🤖 Tanya Gro AI", en: "🤖 Ask Gro AI" },
  filterAll: { id: "Semua", en: "All" },
  filterOffer: { id: "Penawaran", en: "Offers" },
  filterRequest: { id: "Permintaan", en: "Requests" },
  filterEducation: { id: "Edukasi", en: "Education" },
  filterCoffee: { id: "Kopi & Rempah", en: "Coffee & Spices" },
  filterFish: { id: "Ikan & Laut", en: "Fish & Sea" },
  filterRice: { id: "Padi", en: "Rice" },
  filterShrimp: { id: "Udang", en: "Shrimp" },
  filterVegetable: { id: "Sayuran", en: "Vegetables" },
  filterPlantation: { id: "Perkebunan", en: "Plantation" },
  filterCircular: { id: "Limbah Sirkular", en: "Circular Waste" },
  filterVerified: { id: "✅ Verified Only", en: "✅ Verified Only" },
  filterExportReady: { id: "🌍 Ekspor Ready", en: "🌍 Export Ready" },
  filterStockReady: { id: "🔥 Stok Tersedia", en: "🔥 Stock Available" },
  filterSort: { id: "Urutkan ▾", en: "Sort ▾" },
  // Feed
  createPost: {
    id: "+ Buat Penawaran atau Permintaan",
    en: "+ Create Offer or Request",
  },
  loadMore: { id: "Muat Lebih Banyak", en: "Load More" },
  labelOffer: { id: "PENAWARAN", en: "OFFER" },
  labelRequest: { id: "PERMINTAAN", en: "REQUEST" },
  labelEducation: { id: "EDUKASI", en: "EDUCATION" },
  labelCircular: { id: "♻️ LIMBAH SIRKULAR", en: "♻️ CIRCULAR WASTE" },
  commodity: { id: "Komoditas", en: "Commodity" },
  volume: { id: "Volume", en: "Volume" },
  pricePerKg: { id: "Harga/kg", en: "Price/kg" },
  minOrder: { id: "Min. Order", en: "Min. Order" },
  frequency: { id: "Frekuensi", en: "Frequency" },
  standard: { id: "Standar", en: "Standard" },
  viewed: { id: "dilihat", en: "views" },
  responses: { id: "respons", en: "responses" },
  contactCoop: { id: "Hubungi Koperasi", en: "Contact Cooperative" },
  viewProfile: { id: "Lihat Profil", en: "View Profile" },
  submitOffer: { id: "Ajukan Penawaran", en: "Submit Offer" },
  checkGro: {
    id: "🤖 Cek Kelayakan di Gro AI",
    en: "🤖 Check Eligibility in Gro AI",
  },
  readMore: { id: "Baca Selengkapnya →", en: "Read More →" },
  contact: { id: "Hubungi", en: "Contact" },
  wasteType: { id: "Jenis", en: "Type" },
  condition: { id: "Kondisi", en: "Condition" },
  price: { id: "Harga", en: "Price" },
  // Sidebar
  profileComplete: { id: "Profil {n}% lengkap", en: "Profile {n}% complete" },
  completeProfile: { id: "Lengkapi Profil", en: "Complete Profile" },
  postOfferNow: { id: "Post Penawaran Sekarang", en: "Post Offer Now" },
  joinAs: {
    id: "Bergabung sebagai Koperasi atau Pembeli",
    en: "Join as Cooperative or Buyer",
  },
  registerFree: { id: "Daftar Gratis", en: "Register Free" },
  login: { id: "Masuk", en: "Sign In" },
  globalRequests: {
    id: "🌍 Permintaan dari Importir Global",
    en: "🌍 Requests from Global Importers",
  },
  apply: { id: "Ajukan", en: "Apply" },
  viewAllRequests: {
    id: "Lihat Semua Permintaan →",
    en: "View All Requests →",
  },
  groAITitle: {
    id: "🤖 Gro AI — Export Consultant",
    en: "🤖 Gro AI — Export Consultant",
  },
  groAISub: {
    id: "Siap ekspor? Tanya Gro AI tentang regulasi, dokumen, dan harga pasar.",
    en: "Ready to export? Ask Gro AI about regulations, documents, and market prices.",
  },
  groAIPlaceholder: {
    id: "Contoh: Syarat ekspor udang ke Eropa?",
    en: "Example: Shrimp export requirements to Europe?",
  },
  groAIBtn: { id: "Tanya Gro AI →", en: "Ask Gro AI →" },
  featuredCoop: {
    id: "⭐ Koperasi Pilihan Minggu Ini",
    en: "⭐ Featured Cooperatives This Week",
  },
  exportGuide: {
    id: "📋 Mulai Ekspor dalam 4 Langkah",
    en: "📋 Start Exporting in 4 Steps",
  },
  guideStep1: {
    id: "Dapatkan Badge Verified Protected Farm",
    en: "Get Verified Protected Farm Badge",
  },
  guideStep2: {
    id: "Konsultasi kelayakan di Gro AI",
    en: "Consult eligibility with Gro AI",
  },
  guideStep3: { id: "Post penawaran di Connect", en: "Post offers on Connect" },
  guideStep4: {
    id: "Match dengan importir & mulai transaksi",
    en: "Match with importers & start trading",
  },
  guideQuestion: {
    id: "Punya pertanyaan? Tanya Gro AI →",
    en: "Have questions? Ask Gro AI →",
  },
  // Modal
  modalChooseType: { id: "Pilih Tipe Post", en: "Choose Post Type" },
  modalOfferProduct: { id: "📦 Penawaran Produk", en: "📦 Product Offer" },
  modalRequest: { id: "🔍 Permintaan / Kebutuhan", en: "🔍 Request / Need" },
  modalCircular: { id: "♻️ Limbah Sirkular", en: "♻️ Circular Waste" },
  modalEducation: { id: "📚 Edukasi / Tips", en: "📚 Education / Tips" },
  modalNext: { id: "Lanjut", en: "Next" },
  modalBack: { id: "Kembali", en: "Back" },
  modalPostTitle: { id: "Judul post *", en: "Post title *" },
  modalCommodity: { id: "Komoditas *", en: "Commodity *" },
  modalVolume: { id: "Volume tersedia *", en: "Available volume *" },
  modalPrice: { id: "Harga *", en: "Price *" },
  modalMinOrder: { id: "Minimum order", en: "Minimum order" },
  modalDesc: { id: "Deskripsi", en: "Description" },
  modalPhotos: { id: "Foto produk (max 3)", en: "Product photos (max 3)" },
  modalCerts: { id: "Sertifikasi", en: "Certifications" },
  modalExportReady: { id: "Ekspor ready?", en: "Export ready?" },
  modalPreview: { id: "Preview & Post", en: "Preview & Post" },
  modalPostNow: { id: "Post Sekarang", en: "Post Now" },
  // Empty
  emptyTitle: {
    id: "Belum ada post yang cocok dengan filter ini.",
    en: "No posts match this filter.",
  },
  emptySub: {
    id: "Jadilah yang pertama post di kategori ini!",
    en: "Be the first to post in this category!",
  },
  emptyBtn: { id: "Buat Post", en: "Create Post" },
  // CTA
  ctaHeading: {
    id: "Siap Membawa Koperasimu ke Pasar Global?",
    en: "Ready to Take Your Cooperative Global?",
  },
  ctaSub: {
    id: "Bergabung dengan ribuan koperasi terverifikasi yang sudah terhubung dengan importir dari seluruh dunia.",
    en: "Join thousands of verified cooperatives already connected with importers worldwide.",
  },
  ctaBtn: { id: "Mulai Sekarang — Gratis", en: "Get Started — Free" },
  // Toast
  toastSuccess: {
    id: "Post berhasil dibuat! 🎉",
    en: "Post created successfully! 🎉",
  },
  // Verified badge labels
  verifiedFarm: {
    id: "Verified Protected Farm",
    en: "Verified Protected Farm",
  },
  exportReady: { id: "Ekspor Ready", en: "Export Ready" },
  buyerVerified: { id: "Buyer Terverifikasi", en: "Verified Buyer" },
  // Country labels
  countryLabel: { id: "Negara", en: "Country" },
};

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════
type PostType = "penawaran" | "permintaan" | "edukasi" | "limbah";
type FilterType = "semua" | "penawaran" | "permintaan" | "edukasi";
type CommodityFilter =
  "" | "kopi" | "ikan" | "padi" | "udang" | "sayuran" | "perkebunan" | "limbah";

interface PostBase {
  id: number;
  type: PostType;
  timestamp: string;
  views: number;
  responses: number;
  likes: number;
  tags: string[];
}

interface PostPenawaran extends PostBase {
  type: "penawaran";
  coopName: string;
  coopAvatar: string;
  coopLocation: string;
  verified: boolean;
  exportReady: boolean;
  title: string;
  description: string;
  commodity: string;
  volume: string;
  pricePerKg: string;
  minOrder: string;
  photos: string[];
}

interface PostPermintaan extends PostBase {
  type: "permintaan";
  buyerName: string;
  buyerAvatar: string;
  buyerCountry: string;
  buyerFlag: string;
  verified: boolean;
  title: string;
  description: string;
  commodity: string;
  volume: string;
  frequency: string;
  standard: string;
}

interface PostEdukasi extends PostBase {
  type: "edukasi";
  authorName: string;
  authorAvatar: string;
  title: string;
  preview: string;
}

interface PostLimbah extends PostBase {
  type: "limbah";
  coopName: string;
  coopAvatar: string;
  coopLocation: string;
  verified: boolean;
  title: string;
  wasteType: string;
  volume: string;
  condition: string;
  price: string;
}

type Post = PostPenawaran | PostPermintaan | PostEdukasi | PostLimbah;

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════
const MOCK_POSTS: Post[] = [
  {
    id: 1,
    type: "penawaran",
    coopName: "KUD Gayo Mandiri",
    coopAvatar: "GM",
    coopLocation: "Aceh Tengah, Aceh",
    verified: true,
    exportReady: true,
    title: "Kopi Arabika Gayo — Specialty Grade, Natural Process",
    description:
      "Kopi Arabika Gayo grade specialty dari ketinggian 1.400 mdpl. Diproses secara natural, rasa fruity dengan body tebal. Sudah lolos cupping test SCA 84+. Siap ekspor dengan dokumen lengkap.",
    commodity: "Kopi Arabika",
    volume: "500 kg/bln",
    pricePerKg: "Rp 85.000",
    minOrder: "100 kg",
    photos: [],
    timestamp: "2 jam lalu",
    views: 234,
    responses: 12,
    likes: 45,
    tags: [
      "Specialty Grade",
      "Natural Process",
      "Sertifikat Halal",
      "Aceh Tengah",
    ],
  },
  {
    id: 2,
    type: "permintaan",
    buyerName: "Yamashita Trading Co., Ltd.",
    buyerAvatar: "YT",
    buyerCountry: "Jepang",
    buyerFlag: "🇯🇵",
    verified: true,
    title: "Mencari: Kopi Arabika Specialty Grade — 2 ton/bulan",
    description:
      "Kami perusahaan importir kopi Jepang yang mencari mitra koperasi Indonesia untuk pasokan rutin kopi arabika specialty. Dibutuhkan sertifikasi JAS Organic dan cupping score minimal 82.",
    commodity: "Kopi Arabika",
    volume: "2.000 kg/bln",
    frequency: "Bulanan",
    standard: "JAS Organic",
    timestamp: "5 jam lalu",
    views: 567,
    responses: 28,
    likes: 89,
    tags: ["Bersedia Kontrak Panjang", "FOB Banda Aceh", "Harga Kompetitif"],
  },
  {
    id: 3,
    type: "penawaran",
    coopName: "KUD Sari Laut",
    coopAvatar: "SL",
    coopLocation: "Aceh Besar, Aceh",
    verified: true,
    exportReady: true,
    title: "Udang Vaname Premium — Fresh Frozen, HACCP Certified",
    description:
      "Udang vaname ukuran 30-40 count, diproses di cold storage berstandar HACCP. Pengiriman via reefer container, minimum order 1 ton. Sudah ekspor ke Singapura dan Malaysia.",
    commodity: "Udang Vaname",
    volume: "3 ton/bln",
    pricePerKg: "Rp 120.000",
    minOrder: "1 ton",
    photos: [],
    timestamp: "6 jam lalu",
    views: 189,
    responses: 8,
    likes: 34,
    tags: ["HACCP", "Fresh Frozen", "30-40 Count", "Cold Chain"],
  },
  {
    id: 4,
    type: "edukasi",
    authorName: "Tim Agrou Connect",
    authorAvatar: "AC",
    title:
      "Panduan Lengkap: Cara Mendapatkan Sertifikat Ekspor untuk Komoditas Perikanan",
    preview:
      "Mengekspor produk perikanan membutuhkan beberapa sertifikat penting. Artikel ini membahas langkah demi langkah cara mendapatkan Health Certificate, HACCP, dan sertifikasi lainnya yang diperlukan untuk ekspor ke berbagai negara tujuan.",
    timestamp: "1 hari lalu",
    views: 1203,
    responses: 45,
    likes: 178,
    tags: ["Ekspor Perikanan", "Sertifikasi", "Panduan"],
  },
  {
    id: 5,
    type: "limbah",
    coopName: "KUD Padi Sejahtera",
    coopAvatar: "PS",
    coopLocation: "Subang, Jawa Barat",
    verified: true,
    title:
      "Tersedia: 800 kg Sekam Padi — cocok untuk bahan bakar biomass atau media tanam",
    wasteType: "Sekam Padi",
    volume: "800 kg",
    condition: "Kering, bersih",
    price: "Rp 500/kg",
    timestamp: "3 jam lalu",
    views: 78,
    responses: 3,
    likes: 12,
    tags: ["Biomass", "Media Tanam", "Tersedia Sekarang"],
  },
  {
    id: 6,
    type: "permintaan",
    buyerName: "Al Habtoor Foods LLC",
    buyerAvatar: "AH",
    buyerCountry: "UAE",
    buyerFlag: "🇦🇪",
    verified: true,
    title: "Mencari: Udang Vaname Head-On, 5 ton/bulan untuk Hotel Chain",
    description:
      "Kami perusahaan F&B yang memasok ke hotel chain di Dubai dan Abu Dhabi. Butuh udang vaname head-on ukuran 16-20 count dengan standar halal MUI dan HACCP compliance.",
    commodity: "Udang Vaname",
    volume: "5.000 kg/bln",
    frequency: "Bulanan",
    standard: "Halal MUI + HACCP",
    timestamp: "8 jam lalu",
    views: 412,
    responses: 15,
    likes: 67,
    tags: ["Kontrak 12 Bulan", "CIF Dubai", "Premium Grade"],
  },
  {
    id: 7,
    type: "penawaran",
    coopName: "KUD Mina Bahari",
    coopAvatar: "MB",
    coopLocation: "Cilacap, Jawa Tengah",
    verified: true,
    exportReady: false,
    title: "Ikan Tuna Sirip Kuning — Sashimi Grade, Hook & Line",
    description:
      "Ikan tuna sirip kuning ditangkap dengan metode hook & line untuk menjaga kualitas sashimi grade. Diproses langsung di TPI dengan suhu terjaga. Tersedia CO treated dan non-CO.",
    commodity: "Ikan Tuna",
    volume: "2 ton/bln",
    pricePerKg: "Rp 95.000",
    minOrder: "500 kg",
    photos: [],
    timestamp: "12 jam lalu",
    views: 156,
    responses: 6,
    likes: 23,
    tags: ["Sashimi Grade", "Hook & Line", "Sustainable Fishing"],
  },
  {
    id: 8,
    type: "edukasi",
    authorName: "Dinas Perikanan Aceh",
    authorAvatar: "DP",
    title:
      "Tips Sukses: Cara Memenuhi Standar Food Safety untuk Pasar Uni Eropa",
    preview:
      "Pasar Uni Eropa memiliki standar food safety yang ketat. Pelajari bagaimana koperasi perikanan di Aceh berhasil memenuhi regulasi EU dan meraih kontrak ekspor pertama mereka ke Spanyol dan Belanda.",
    timestamp: "2 hari lalu",
    views: 890,
    responses: 32,
    likes: 145,
    tags: ["Food Safety", "Uni Eropa", "Best Practice"],
  },
  {
    id: 9,
    type: "permintaan",
    buyerName: "BioGreen GmbH",
    buyerAvatar: "BG",
    buyerCountry: "Jerman",
    buyerFlag: "🇩🇪",
    verified: true,
    title: "Mencari: Minyak Kelapa Virgin Organic — 1 ton/bulan",
    description:
      "Perusahaan produk organik Jerman mencari mitra koperasi untuk minyak kelapa virgin cold-pressed. Wajib sertifikasi EU Organic dan fair trade preferred.",
    commodity: "Minyak Kelapa",
    volume: "1.000 kg/bln",
    frequency: "Bulanan",
    standard: "EU Organic",
    timestamp: "1 hari lalu",
    views: 345,
    responses: 19,
    likes: 56,
    tags: ["Cold Pressed", "Fair Trade", "FOB Jakarta"],
  },
  {
    id: 10,
    type: "limbah",
    coopName: "KUD Kelapa Jaya",
    coopAvatar: "KJ",
    coopLocation: "Indragiri Hilir, Riau",
    verified: true,
    title:
      "Tersedia: 2 ton Sabut Kelapa & Tempurung — siap kirim untuk industri",
    wasteType: "Sabut Kelapa & Tempurung",
    volume: "2.000 kg",
    condition: "Kering, sudah sortir",
    price: "Rp 1.200/kg",
    timestamp: "4 jam lalu",
    views: 95,
    responses: 5,
    likes: 18,
    tags: ["Cocopeat", "Arang Aktif", "Industri"],
  },
];

const GLOBAL_REQUESTS = [
  {
    flag: "🇯🇵",
    country: "Jepang",
    commodity: "Kopi Arabika",
    volume: "2T/bln",
  },
  { flag: "🇦🇪", country: "UAE", commodity: "Udang Vaname", volume: "5T/bln" },
  {
    flag: "🇩🇪",
    country: "Jerman",
    commodity: "Minyak Kelapa Virgin",
    volume: "1T/bln",
  },
  {
    flag: "🇸🇬",
    country: "Singapura",
    commodity: "Beras Organik",
    volume: "3T/bln",
  },
];

const FEATURED_COOPS = [
  {
    avatar: "SL",
    name: "KUD Sari Laut",
    location: "Aceh Besar",
    commodities: "Ikan Tuna, Udang, Rumput Laut",
  },
  {
    avatar: "GM",
    name: "KUD Gayo Mandiri",
    location: "Aceh Tengah",
    commodities: "Kopi Arabika, Rempah",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════
function Avatar({
  initials,
  size = 48,
  color = "#1B4332",
}: {
  initials: string;
  size?: number;
  color?: string;
}) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-black text-white shrink-0"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}, ${color}dd)`,
        fontSize: size * 0.33,
      }}
    >
      {initials}
    </div>
  );
}

function VerifiedBadge({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full border"
      style={{
        background: "#ECFDF5",
        borderColor: "#6EE7B7",
        color: "#065F46",
      }}
    >
      <ShieldCheck size={10} /> {label}
    </span>
  );
}

function ExportReadyBadge({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full border animate-pulse-subtle"
      style={{
        background: "rgba(27,67,50,0.08)",
        borderColor: "rgba(27,67,50,0.15)",
        color: "var(--color-forest)",
      }}
    >
      🌍 {label}
    </span>
  );
}

// Count-up hook
function useCountUp(target: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, ref };
}

// ═══════════════════════════════════════════════════════════════════════════════
const DEMAND_CARDS = [
  [
    {
      flag: "🇯🇵",
      country: "Jepang",
      time: "1m ago",
      commodity: "Kopi Arabika Gayo",
      volume: "2.5 Ton",
      status: "Specialty",
    },
    {
      flag: "🇸🇬",
      country: "Singapura",
      time: "12m ago",
      commodity: "Tuna Sirip Kuning",
      volume: "800 Kg",
      status: "Sashimi",
    },
    {
      flag: "🇰🇷",
      country: "Korea Selatan",
      time: "25m ago",
      commodity: "Cengkeh Maluku",
      volume: "3.0 Ton",
      status: "Verified",
    },
  ],
  [
    {
      flag: "🇦🇪",
      country: "UAE",
      time: "4m ago",
      commodity: "Udang Vaname Fresh",
      volume: "5.0 Ton",
      status: "HACCP",
    },
    {
      flag: "🇺🇸",
      country: "Amerika Serikat",
      time: "15m ago",
      commodity: "Biji Kakao Premium",
      volume: "10 Ton",
      status: "Fair Trade",
    },
    {
      flag: "🇳🇱",
      country: "Belanda",
      time: "30m ago",
      commodity: "Pinang Belah Kering",
      volume: "5.0 Ton",
      status: "Urgent",
    },
  ],
  [
    {
      flag: "🇩🇪",
      country: "Jerman",
      time: "7m ago",
      commodity: "Minyak Kelapa Virgin",
      volume: "1.2 Ton",
      status: "Organic",
    },
    {
      flag: "🇨🇳",
      country: "Tiongkok",
      time: "20m ago",
      commodity: "Rumput Laut Kering",
      volume: "15 Ton",
      status: "Grade A",
    },
    {
      flag: "🇦🇺",
      country: "Australia",
      time: "45m ago",
      commodity: "Ikan Kerapu Segar",
      volume: "1.5 Ton",
      status: "Live Air",
    },
  ],
];

// HERO SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function HeroSection({
  t,
  onOpenModal,
  onScrollToFeed,
}: {
  t: (k: string) => string;
  onOpenModal: () => void;
  onScrollToFeed: () => void;
}) {
  return (
    <section
      className="relative overflow-hidden bg-cover bg-center"
      style={{ minHeight: 320, backgroundImage: `url(${bgConnect})` }}
    >
      {/* Overlay for text readability and forest theme */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d2918]/95 via-[#0d2918]/80 to-transparent z-0" />

      {/* Absolute wrapper for full-height staggered card grid */}
      <div className="absolute inset-0 hidden lg:block overflow-hidden z-10 pointer-events-none">
        <div className="max-w-[1280px] mx-auto px-8 h-full relative">
          <div
            className="absolute right-8 top-0 bottom-0 w-[480px] grid grid-cols-3 gap-4 pointer-events-auto"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 0%, transparent 45px, black 100px, black calc(100% - 100px), transparent calc(100% - 45px), transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, transparent 45px, black 100px, black calc(100% - 100px), transparent calc(100% - 45px), transparent 100%)",
            }}
          >
            {/* Column 1: Scrolling down */}
            <div className="flex flex-col gap-4 animate-marquee-down">
              {[...DEMAND_CARDS[0], ...DEMAND_CARDS[0]].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/[0.22] backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex flex-col justify-between h-[160px] hover:bg-white/[0.28] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-all duration-300 select-none"
                >
                  <div className="flex items-start justify-between gap-1.5 min-w-0">
                    <div className="flex items-start gap-1.5 min-w-0">
                      <span className="inline-flex items-center justify-center bg-white/15 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide shrink-0 mt-0.5">
                        {item.flag}
                      </span>
                      <span className="text-white font-extrabold text-xs leading-snug">
                        {item.country}
                      </span>
                    </div>
                    <div className="flex flex-col items-end leading-[1.1] shrink-0 text-right">
                      <span className="text-white text-[10px] font-black">
                        {item.time.split(" ")[0]}
                      </span>
                      <span className="text-white/70 text-[9px] font-bold uppercase tracking-wider">
                        {item.time.split(" ")[1]}
                      </span>
                    </div>
                  </div>
                  <div className="my-2">
                    <h4 className="text-white font-black text-xs md:text-sm leading-snug font-display line-clamp-2">
                      {item.commodity}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="text-[var(--color-lime)] font-extrabold text-xs">
                      {item.volume}
                    </span>
                    <span className="bg-[var(--color-lime)]/20 text-[var(--color-lime)] text-[9px] font-black px-2 py-0.5 rounded-full border border-[var(--color-lime)]/30 uppercase tracking-wide">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Column 2: Scrolling up */}
            <div className="flex flex-col gap-4 animate-marquee-up">
              {[...DEMAND_CARDS[1], ...DEMAND_CARDS[1]].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/[0.22] backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex flex-col justify-between h-[160px] hover:bg-white/[0.28] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-all duration-300 select-none"
                >
                  <div className="flex items-start justify-between gap-1.5 min-w-0">
                    <div className="flex items-start gap-1.5 min-w-0">
                      <span className="inline-flex items-center justify-center bg-white/15 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide shrink-0 mt-0.5">
                        {item.flag}
                      </span>
                      <span className="text-white font-extrabold text-xs leading-snug">
                        {item.country}
                      </span>
                    </div>
                    <div className="flex flex-col items-end leading-[1.1] shrink-0 text-right">
                      <span className="text-white text-[10px] font-black">
                        {item.time.split(" ")[0]}
                      </span>
                      <span className="text-white/70 text-[9px] font-bold uppercase tracking-wider">
                        {item.time.split(" ")[1]}
                      </span>
                    </div>
                  </div>
                  <div className="my-2">
                    <h4 className="text-white font-black text-xs md:text-sm leading-snug font-display line-clamp-2">
                      {item.commodity}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="text-[var(--color-lime)] font-extrabold text-xs">
                      {item.volume}
                    </span>
                    <span className="bg-[var(--color-lime)]/20 text-[var(--color-lime)] text-[9px] font-black px-2 py-0.5 rounded-full border border-[var(--color-lime)]/30 uppercase tracking-wide">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Column 3: Scrolling down */}
            <div className="flex flex-col gap-4 animate-marquee-down">
              {[...DEMAND_CARDS[2], ...DEMAND_CARDS[2]].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/[0.22] backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex flex-col justify-between h-[160px] hover:bg-white/[0.28] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-all duration-300 select-none"
                >
                  <div className="flex items-start justify-between gap-1.5 min-w-0">
                    <div className="flex items-start gap-1.5 min-w-0">
                      <span className="inline-flex items-center justify-center bg-white/15 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide shrink-0 mt-0.5">
                        {item.flag}
                      </span>
                      <span className="text-white font-extrabold text-xs leading-snug">
                        {item.country}
                      </span>
                    </div>
                    <div className="flex flex-col items-end leading-[1.1] shrink-0 text-right">
                      <span className="text-white text-[10px] font-black">
                        {item.time.split(" ")[0]}
                      </span>
                      <span className="text-white/70 text-[9px] font-bold uppercase tracking-wider">
                        {item.time.split(" ")[1]}
                      </span>
                    </div>
                  </div>
                  <div className="my-2">
                    <h4 className="text-white font-black text-xs md:text-sm leading-snug font-display line-clamp-2">
                      {item.commodity}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="text-[var(--color-lime)] font-extrabold text-xs">
                      {item.volume}
                    </span>
                    <span className="bg-[var(--color-lime)]/20 text-[var(--color-lime)] text-[9px] font-black px-2 py-0.5 rounded-full border border-[var(--color-lime)]/30 uppercase tracking-wide">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-12 md:py-16 relative z-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left Column (Text & CTAs) */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[var(--color-lime)]/10 border border-[var(--color-lime)]/30 text-[var(--color-lime)] text-[10px] font-black tracking-[0.15em] px-4 py-2 rounded-full mb-6 uppercase">
              {t("heroLabel")}
            </div>
            <h1 className="font-display font-black text-white text-4xl lg:text-5xl xl:text-6xl leading-[1.05] mb-4 max-w-xl mx-auto lg:mx-0">
              {t("heroHeading")
                .split("Global")
                .reduce((prev, current, i) => {
                  if (i === 0) return [current];
                  return [
                    ...prev,
                    <span key={i} className="text-[var(--color-lime)] italic">
                      Global
                    </span>,
                    current,
                  ];
                }, [] as React.ReactNode[])}
            </h1>
            <p className="text-white/70 text-base leading-relaxed mb-8 max-w-lg font-medium mx-auto lg:mx-0">
              {t("heroSub")}
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                onClick={onOpenModal}
                className="bg-[var(--color-lime)] text-[var(--color-forest-dark)] font-black px-7 py-3 rounded-full text-sm hover:brightness-110 transition-all shadow-[0_4px_20px_rgba(181,242,61,0.3)] cursor-pointer border-none"
              >
                {t("heroCtaPrimary")}
              </button>
              <button
                onClick={onScrollToFeed}
                className="bg-white/10 backdrop-blur border border-white/30 text-white font-bold px-7 py-3 rounded-full text-sm hover:bg-white/20 transition-all cursor-pointer"
              >
                {t("heroCtaSecondary")}
              </button>
            </div>
          </div>

          {/* Spacer to push text content to the left side and match the grid width */}
          <div className="hidden lg:block w-[480px] shrink-0" />
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATS BAR
// ═══════════════════════════════════════════════════════════════════════════════
function CardStatsAktif({ t, lang }: { t: (k: string) => string; lang: Lang }) {
  const s1 = useCountUp(847);
  const s2 = useCountUp(234);
  const s3 = useCountUp(1203);

  return (
    <div
      ref={s1.ref}
      className="bg-white rounded-2xl border border-[var(--color-border)] p-4"
    >
      <h3 className="font-bold text-sm text-[var(--color-forest-dark)] mb-3 flex items-center gap-2 font-display">
        <Globe size={14} className="text-[var(--color-orange)]" />
        {lang === "id" ? "Aktivitas Platform" : "Platform Activity"}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {[
          { val: s1.count, label: t("statsOffers") },
          { val: s2.count, label: t("statsRequests") },
          { val: s3.count, label: t("statsMatches") },
          { val: "4.8/5", label: t("statsRating"), isStr: true },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-[var(--color-cream)] rounded-xl p-3 text-center"
          >
            <p className="text-[var(--color-forest)] font-black text-lg">
              {item.isStr ? item.val : item.val.toLocaleString()}
            </p>
            <p className="text-[var(--color-text-secondary)] text-[10px] mt-0.5">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STICKY FILTER & SEARCH BAR
// ═══════════════════════════════════════════════════════════════════════════════
function FilterBar({
  t,
  activeFilter,
  setActiveFilter,
  activeCommodity,
  setActiveCommodity,
  searchQuery,
  setSearchQuery,
  verifiedOnly,
  setVerifiedOnly,
  exportOnly,
  setExportOnly,
  stockOnly,
  setStockOnly,
  onAskGroAI,
}: {
  t: (k: string) => string;
  activeFilter: FilterType;
  setActiveFilter: (f: FilterType) => void;
  activeCommodity: CommodityFilter;
  setActiveCommodity: (c: CommodityFilter) => void;
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  verifiedOnly: boolean;
  setVerifiedOnly: (v: boolean) => void;
  exportOnly: boolean;
  setExportOnly: (v: boolean) => void;
  stockOnly: boolean;
  setStockOnly: (v: boolean) => void;
  onAskGroAI: () => void;
}) {
  const filterTypes: { key: FilterType; label: string }[] = [
    { key: "semua", label: t("filterAll") },
    { key: "penawaran", label: t("filterOffer") },
    { key: "permintaan", label: t("filterRequest") },
    { key: "edukasi", label: t("filterEducation") },
  ];

  const commodityFilters: { key: CommodityFilter; label: string }[] = [
    { key: "kopi", label: t("filterCoffee") },
    { key: "ikan", label: t("filterFish") },
    { key: "padi", label: t("filterRice") },
    { key: "udang", label: t("filterShrimp") },
    { key: "sayuran", label: t("filterVegetable") },
    { key: "perkebunan", label: t("filterPlantation") },
    { key: "limbah", label: t("filterCircular") },
  ];

  const activePill =
    "bg-[var(--color-forest)] text-white font-bold text-xs px-4 py-2 rounded-full whitespace-nowrap cursor-pointer shrink-0 active:scale-95 border-none transition-all";
  const inactivePill =
    "border border-[var(--color-border)] text-[var(--color-text-secondary)] font-semibold text-xs px-4 py-2 rounded-full whitespace-nowrap cursor-pointer shrink-0 hover:border-[var(--color-forest)] hover:text-[var(--color-forest)] transition-all bg-white";
  const specialPill =
    "border border-[var(--color-lime)]/40 bg-[var(--color-lime)]/8 text-[var(--color-forest)] font-bold text-xs px-4 py-2 rounded-full whitespace-nowrap cursor-pointer shrink-0 hover:bg-[var(--color-lime)]/15 transition-all";

  return (
    <>
      {/* Wrapper search bar */}
      <div className="bg-white border-b border-[var(--color-border)] shadow-sm">
        <div className="max-w-[1440px] mx-auto px-8 py-3 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--color-text-secondary)]" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--color-cream)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-forest)] transition-all"
            />
          </div>
          <button
            onClick={onAskGroAI}
            className="flex items-center gap-2 bg-[var(--color-forest-dark)] text-[var(--color-lime)] font-bold text-xs px-4 py-2.5 rounded-full whitespace-nowrap hover:bg-[var(--color-forest)] transition-all shrink-0 border-none cursor-pointer"
          >
            {t("askGroAI")}
          </button>
        </div>
      </div>

      {/* Filter pills row */}
      <div className="bg-[var(--color-cream)] border-b border-[var(--color-border)] py-2.5">
        <div className="max-w-[1440px] mx-auto px-8 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {filterTypes.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={activeFilter === f.key ? activePill : inactivePill}
            >
              {f.label}
            </button>
          ))}
          <div className="w-px h-5 bg-[var(--color-border)] shrink-0 mx-1" />
          {commodityFilters.map((c) => (
            <button
              key={c.key}
              onClick={() =>
                setActiveCommodity(activeCommodity === c.key ? "" : c.key)
              }
              className={activeCommodity === c.key ? activePill : inactivePill}
            >
              {c.label}
            </button>
          ))}
          <div className="w-px h-5 bg-[var(--color-border)] shrink-0 mx-1" />
          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={verifiedOnly ? activePill : specialPill}
          >
            {t("filterVerified")}
          </button>
          <button
            onClick={() => setExportOnly(!exportOnly)}
            className={exportOnly ? activePill : specialPill}
          >
            {t("filterExportReady")}
          </button>
          <button
            onClick={() => setStockOnly(!stockOnly)}
            className={stockOnly ? activePill : specialPill}
          >
            {t("filterStockReady")}
          </button>
          <button onClick={() => {}} className={inactivePill}>
            {t("filterSort")}
          </button>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// POST CARDS
// ═══════════════════════════════════════════════════════════════════════════════

// ── PENAWARAN CARD ──
function PenawaranCard({
  post,
  t,
  onViewProfile,
}: {
  post: PostPenawaran;
  t: (k: string) => string;
  onViewProfile: () => void;
  key?: React.Key;
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-2xl border border-[var(--color-border)] mb-4 overflow-hidden hover:shadow-[0_4px_20px_rgba(26,61,46,0.08)] transition-all duration-200"
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-[var(--color-border)] shrink-0 bg-[var(--color-forest)] flex items-center justify-center text-white font-black text-xs">
            {post.coopAvatar}
          </div>
          <div>
            <span className="font-bold text-sm text-[var(--color-forest-dark)] font-display">
              {post.coopName}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              {post.verified && (
                <span className="bg-[var(--color-lime)] text-[var(--color-forest-dark)] text-[8px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <CheckCircle2 size={8} /> {t("verifiedFarm")}
                </span>
              )}
              {post.exportReady && (
                <span className="bg-[var(--color-forest)]/10 text-[var(--color-forest)] text-[8px] font-black px-1.5 py-0.5 rounded-full">
                  {t("exportReady")}
                </span>
              )}
            </div>
            <div className="text-[var(--color-text-secondary)] text-[10px] flex items-center gap-1 mt-0.5">
              <Clock size={10} /> <span>{post.timestamp}</span>
              <span className="mx-1">•</span>
              <MapPin size={10} /> <span>{post.coopLocation}</span>
            </div>
          </div>
        </div>
        <div className="text-[var(--color-text-secondary)] text-[10px]">
          {/* Kanan */}
        </div>
      </div>

      {/* Type badge */}
      <div className="mx-5 mb-3">
        <span className="inline-flex bg-[var(--color-orange)]/10 border border-[var(--color-orange)]/20 text-[var(--color-orange)] text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
          📦 {t("labelOffer")}
        </span>
      </div>

      {/* Title */}
      <h3 className="px-5 font-display font-bold text-base text-[var(--color-forest-dark)] leading-snug mb-2">
        {post.title}
      </h3>

      {/* Desc */}
      <p className="px-5 text-[var(--color-text-secondary)] text-xs leading-relaxed mb-4 line-clamp-2">
        {post.description}
      </p>

      {/* Specs grid */}
      <div className="px-5 mb-4">
        <div className="grid grid-cols-4 gap-3 bg-[var(--color-cream)] rounded-xl p-3">
          <div className="text-center">
            <p className="text-[var(--color-text-secondary)] text-[9px] font-medium uppercase tracking-wide mb-0.5">
              {t("commodity")}
            </p>
            <p className="text-[var(--color-forest-dark)] font-black text-xs truncate">
              {post.commodity}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[var(--color-text-secondary)] text-[9px] font-medium uppercase tracking-wide mb-0.5">
              {t("volume")}
            </p>
            <p className="text-[var(--color-forest-dark)] font-black text-xs truncate">
              {post.volume}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[var(--color-text-secondary)] text-[9px] font-medium uppercase tracking-wide mb-0.5">
              {t("pricePerKg")}
            </p>
            <p className="text-[var(--color-forest-dark)] font-black text-xs truncate">
              {post.pricePerKg}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[var(--color-text-secondary)] text-[9px] font-medium uppercase tracking-wide mb-0.5">
              {t("minOrder")}
            </p>
            <p className="text-[var(--color-forest-dark)] font-black text-xs truncate">
              {post.minOrder}
            </p>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="px-5 mb-4">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-[var(--color-forest)]/8 text-[var(--color-forest)] text-[10px] font-bold px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card footer */}
      <div className="px-5 pb-5">
        <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[var(--color-text-secondary)] text-xs">
              <Eye size={12} /> {post.views}
            </span>
            <span className="flex items-center gap-1 text-[var(--color-text-secondary)] text-xs">
              <MessageSquare size={12} /> {post.responses}
            </span>
            <button
              onClick={() => {
                setLiked(!liked);
                setLikeCount((c) => (liked ? c - 1 : c + 1));
              }}
              className={`flex items-center gap-1 text-xs transition-colors bg-transparent border-none cursor-pointer ${liked ? "text-red-500 font-bold" : "text-[var(--color-text-secondary)]"}`}
            >
              <Heart
                size={12}
                className={liked ? "fill-red-500 text-red-500" : ""}
              />{" "}
              {likeCount}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-[var(--color-orange)] text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-[var(--color-orange-dark)] transition-all cursor-pointer border-none">
              {t("contactCoop")}
            </button>
            <button
              onClick={onViewProfile}
              className="border border-[var(--color-border)] text-[var(--color-text-secondary)] font-bold text-xs px-4 py-2 rounded-xl hover:border-[var(--color-forest)] hover:text-[var(--color-forest)] transition-all cursor-pointer bg-transparent"
            >
              {t("viewProfile")}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PermintaanCard({
  post,
  t,
  onAskGroAI,
  onViewProfile,
}: {
  post: PostPermintaan;
  t: (k: string) => string;
  onAskGroAI: (prompt: string) => void;
  onViewProfile: () => void;
  key?: React.Key;
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-2xl border border-[var(--color-border)] mb-4 overflow-hidden hover:shadow-[0_4px_20px_rgba(26,61,46,0.08)] transition-all duration-200"
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-[var(--color-border)] shrink-0 bg-[var(--color-forest)] flex items-center justify-center text-white font-black text-xs">
            {post.buyerAvatar}
          </div>
          <div>
            <span className="font-bold text-sm text-[var(--color-forest-dark)] font-display">
              {post.buyerName}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              {post.verified && (
                <span className="bg-[var(--color-forest-dark)]/8 text-[var(--color-forest-dark)] text-[8px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <CheckCircle2 size={8} /> {t("buyerVerified")}
                </span>
              )}
            </div>
            <div className="text-[var(--color-text-secondary)] text-[10px] flex items-center gap-1 mt-0.5">
              <Clock size={10} /> <span>{post.timestamp}</span>
              <span className="mx-1">•</span>
              <span className="font-semibold text-[var(--color-text-secondary)]">
                {t("countryLabel")}: {post.buyerCountry} {post.buyerFlag}
              </span>
            </div>
          </div>
        </div>
        <div className="text-[var(--color-text-secondary)] text-[10px]">
          {/* Kanan */}
        </div>
      </div>

      {/* Type badge */}
      <div className="mx-5 mb-3">
        <span className="inline-flex bg-[var(--color-forest)]/10 border border-[var(--color-forest)]/20 text-[var(--color-forest)] text-[9px] font-black px-2.5 py-1 rounded-full uppercase">
          🔍 {t("labelRequest")}
        </span>
      </div>

      {/* Title */}
      <h3 className="px-5 font-display font-bold text-base text-[var(--color-forest-dark)] leading-snug mb-2">
        {post.title}
      </h3>

      {/* Desc */}
      <p className="px-5 text-[var(--color-text-secondary)] text-xs leading-relaxed mb-4 line-clamp-2">
        {post.description}
      </p>

      {/* Specs grid */}
      <div className="px-5 mb-4">
        <div className="grid grid-cols-4 gap-3 bg-[var(--color-cream)] rounded-xl p-3">
          <div className="text-center">
            <p className="text-[var(--color-text-secondary)] text-[9px] font-medium uppercase tracking-wide mb-0.5">
              {t("commodity")}
            </p>
            <p className="text-[var(--color-forest-dark)] font-black text-xs truncate">
              {post.commodity}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[var(--color-text-secondary)] text-[9px] font-medium uppercase tracking-wide mb-0.5">
              {t("volume")}
            </p>
            <p className="text-[var(--color-forest-dark)] font-black text-xs truncate">
              {post.volume}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[var(--color-text-secondary)] text-[9px] font-medium uppercase tracking-wide mb-0.5">
              {t("frequency")}
            </p>
            <p className="text-[var(--color-forest-dark)] font-black text-xs truncate">
              {post.frequency}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[var(--color-text-secondary)] text-[9px] font-medium uppercase tracking-wide mb-0.5">
              {t("standard")}
            </p>
            <p className="text-[var(--color-forest-dark)] font-black text-xs truncate">
              {post.standard}
            </p>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="px-5 mb-4">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-[var(--color-forest)]/8 text-[var(--color-forest)] text-[10px] font-bold px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card footer */}
      <div className="px-5 pb-5">
        <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[var(--color-text-secondary)] text-xs">
              <Eye size={12} /> {post.views}
            </span>
            <span className="flex items-center gap-1 text-[var(--color-text-secondary)] text-xs">
              <MessageSquare size={12} /> {post.responses}
            </span>
            <button
              onClick={() => {
                setLiked(!liked);
                setLikeCount((c) => (liked ? c - 1 : c + 1));
              }}
              className={`flex items-center gap-1 text-xs transition-colors bg-transparent border-none cursor-pointer ${liked ? "text-red-500 font-bold" : "text-[var(--color-text-secondary)]"}`}
            >
              <Heart
                size={12}
                className={liked ? "fill-red-500 text-red-500" : ""}
              />{" "}
              {likeCount}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-[var(--color-forest)] text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-[var(--color-forest-dark)] transition-all cursor-pointer border-none">
              {t("submitOffer")}
            </button>
            <button
              onClick={onViewProfile}
              className="border border-[var(--color-border)] text-[var(--color-text-secondary)] font-bold text-xs px-4 py-2 rounded-xl hover:border-[var(--color-forest)] hover:text-[var(--color-forest)] transition-all cursor-pointer bg-transparent"
            >
              {t("viewProfile")}
            </button>
            <button
              onClick={() =>
                onAskGroAI(
                  `Ada importir dari ${post.buyerCountry} yang butuh ${post.volume} ${post.commodity} per bulan dengan standar ${post.standard}. Apakah koperasi saya layak dan apa yang perlu disiapkan?`,
                )
              }
              className="border border-[var(--color-forest)]/30 bg-[var(--color-forest)]/5 text-[var(--color-forest)] font-bold text-xs px-4 py-2 rounded-xl hover:bg-[var(--color-forest)]/10 transition-all cursor-pointer bg-transparent"
            >
              {t("checkGro")}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EdukasiCard({
  post,
  t,
}: {
  post: PostEdukasi;
  t: (k: string) => string;
  key?: React.Key;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-2xl border border-[var(--color-border)] mb-4 overflow-hidden hover:shadow-[0_4px_20px_rgba(26,61,46,0.08)] transition-all duration-200"
    >
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-[var(--color-border)] shrink-0 bg-[var(--color-forest)] flex items-center justify-center text-white font-black text-xs">
            {post.authorAvatar}
          </div>
          <div>
            <span className="font-bold text-sm text-[var(--color-forest-dark)] font-display">
              {post.authorName}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-[var(--color-text-secondary)] flex items-center gap-1">
                <Clock size={10} /> {post.timestamp}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <span className="inline-flex bg-[var(--color-lime)]/15 border border-[var(--color-lime)]/30 text-[var(--color-lime-dark)] text-[9px] font-black px-2.5 py-1 rounded-full uppercase">
            📚 {t("labelEducation")}
          </span>
        </div>

        <h3 className="font-display font-bold text-base text-[var(--color-forest-dark)] leading-snug mb-2">
          {post.title}
        </h3>
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4 line-clamp-3">
          {post.preview}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-[var(--color-forest)]/8 text-[var(--color-forest)] text-[10px] font-bold px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-4 text-[11px] text-[var(--color-text-secondary)]">
            <span className="flex items-center gap-1">
              <Eye size={12} /> {post.views}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare size={12} /> {post.responses}
            </span>
          </div>
          <button className="text-[var(--color-orange)] font-bold text-xs hover:underline cursor-pointer flex items-center gap-1 bg-transparent border-none">
            {t("readMore")} <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function LimbahCard({
  post,
  t,
}: {
  post: PostLimbah;
  t: (k: string) => string;
  key?: React.Key;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-2xl border border-[var(--color-border)] mb-4 overflow-hidden hover:shadow-[0_4px_20px_rgba(26,61,46,0.08)] transition-all duration-200"
    >
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-[var(--color-border)] shrink-0 bg-[var(--color-forest)] flex items-center justify-center text-white font-black text-xs">
            {post.coopAvatar}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-[var(--color-forest-dark)] font-display">
                {post.coopName}
              </span>
              {post.verified && (
                <span className="bg-[var(--color-lime)] text-[var(--color-forest-dark)] text-[8px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <CheckCircle2 size={8} /> {t("verifiedFarm")}
                </span>
              )}
            </div>
            <div className="text-[var(--color-text-secondary)] text-[10px] flex items-center gap-1 mt-0.5">
              <Clock size={10} /> <span>{post.timestamp}</span>
              <span className="mx-1">•</span>
              <MapPin size={10} /> <span>{post.coopLocation}</span>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <span className="inline-flex bg-green-50 border border-green-200 text-green-700 text-[9px] font-black px-2.5 py-1 rounded-full uppercase">
            ♻️ {t("labelCircular")}
          </span>
        </div>

        <h3 className="font-display font-bold text-base text-[var(--color-forest-dark)] leading-snug mb-3">
          {post.title}
        </h3>

        {/* Specs grid */}
        <div className="mb-4">
          <div className="grid grid-cols-4 gap-3 bg-[var(--color-cream)] rounded-xl p-3">
            <div className="text-center">
              <p className="text-[var(--color-text-secondary)] text-[9px] font-medium uppercase tracking-wide mb-0.5">
                {t("wasteType")}
              </p>
              <p className="text-[var(--color-forest-dark)] font-black text-xs truncate">
                {post.wasteType}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[var(--color-text-secondary)] text-[9px] font-medium uppercase tracking-wide mb-0.5">
                {t("volume")}
              </p>
              <p className="text-[var(--color-forest-dark)] font-black text-xs truncate">
                {post.volume}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[var(--color-text-secondary)] text-[9px] font-medium uppercase tracking-wide mb-0.5">
                {t("condition")}
              </p>
              <p className="text-[var(--color-forest-dark)] font-black text-xs truncate">
                {post.condition}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[var(--color-text-secondary)] text-[9px] font-medium uppercase tracking-wide mb-0.5">
                {t("price")}
              </p>
              <p className="text-[var(--color-forest-dark)] font-black text-xs truncate">
                {post.price}
              </p>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-[var(--color-forest)]/8 text-[var(--color-forest)] text-[10px] font-bold px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-4 text-[11px] text-[var(--color-text-secondary)]">
            <span className="flex items-center gap-1">
              <Eye size={12} /> {post.views}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare size={12} /> {post.responses}
            </span>
          </div>
          <button className="px-5 py-2.5 rounded-xl bg-green-600 text-white font-bold text-xs hover:bg-green-700 transition-all cursor-pointer border-none">
            {t("contact")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SKELETON LOADER
// ═══════════════════════════════════════════════════════════════════════════════
function SkeletonCard() {
  return (
    <div
      className="bg-white rounded-2xl p-5 animate-pulse"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-200" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded-full w-2/3 mb-2" />
          <div className="h-3 bg-gray-100 rounded-full w-1/2" />
        </div>
      </div>
      <div className="h-3 bg-gray-200 rounded-full w-1/4 mb-3" />
      <div className="h-4 bg-gray-200 rounded-full w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded-full w-5/6 mb-4" />
      <div className="bg-gray-100 rounded-xl p-3 mb-4">
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-8 bg-gray-200 rounded-full w-24" />
        <div className="h-8 bg-gray-200 rounded-full w-20" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIDEBAR CARDS
// ═══════════════════════════════════════════════════════════════════════════════

function SidebarProfile({
  t,
  lang,
  onOpenModal,
}: {
  t: (k: string) => string;
  lang: Lang;
  onOpenModal: () => void;
}) {
  const isLoggedIn = true; // mock

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-[var(--color-border)]">
        <p className="text-sm font-bold text-[var(--color-forest-dark)] mb-3">
          {t("joinAs")}
        </p>
        <div className="flex gap-2">
          <button className="flex-1 py-2 rounded-xl bg-[var(--color-forest)] text-white font-bold text-xs cursor-pointer border-none">
            {t("registerFree")}
          </button>
          <button className="flex-1 py-2 rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] font-bold text-xs cursor-pointer bg-transparent">
            {t("login")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[var(--color-border)]">
      {/* Cover area */}
      <div className="h-16 relative bg-gradient-to-r from-[var(--color-forest)] to-[var(--color-forest-mid)]">
        {/* Avatar */}
        <div className="absolute -bottom-6 left-4 w-14 h-14 rounded-xl border-2 border-white shadow-md overflow-hidden bg-[var(--color-forest)] flex items-center justify-center text-white font-black text-lg">
          KT
        </div>
      </div>

      {/* Card body */}
      <div className="pt-8 px-4 pb-4">
        <h4 className="font-display font-bold text-sm text-[var(--color-forest-dark)] mb-0.5">
          KUD Tani Makmur
        </h4>
        <div className="mb-1.5">
          <span className="inline-flex items-center gap-1 bg-[var(--color-lime)] text-[var(--color-forest-dark)] text-[9px] font-black px-2 py-0.5 rounded-full">
            <CheckCircle2 size={10} /> Verified Protected Farm
          </span>
        </div>
        <div className="text-[var(--color-text-secondary)] text-xs flex items-center gap-1 mb-3">
          <MapPin size={11} className="text-[var(--color-orange)]" />
          <span>Surabaya, Jawa Timur</span>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="text-[var(--color-text-secondary)] text-[10px] mb-1 flex justify-between">
            <span>{t("profileComplete").replace("{n}", "75")}</span>
          </div>
          <div className="h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-lime)] rounded-full"
              style={{ width: "75%" }}
            />
          </div>
        </div>

        <div className="border-t border-[var(--color-border)] my-3" />

        {/* Stats 2x2 */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="text-center p-2 bg-[var(--color-cream)] rounded-xl">
            <p className="text-[var(--color-forest)] font-black text-sm">12</p>
            <p className="text-[var(--color-text-secondary)] text-[10px]">
              {lang === "id" ? "Penawaran" : "Offers"}
            </p>
          </div>
          <div className="text-center p-2 bg-[var(--color-cream)] rounded-xl">
            <p className="text-[var(--color-forest)] font-black text-sm">8</p>
            <p className="text-[var(--color-text-secondary)] text-[10px]">
              {lang === "id" ? "Koneksi" : "Connections"}
            </p>
          </div>
          <div className="text-center p-2 bg-[var(--color-cream)] rounded-xl">
            <p className="text-[var(--color-forest)] font-black text-sm">148</p>
            <p className="text-[var(--color-text-secondary)] text-[10px]">
              {lang === "id" ? "Pengunjung" : "Views"}
            </p>
          </div>
          <div className="text-center p-2 bg-[var(--color-cream)] rounded-xl">
            <p className="text-[var(--color-forest)] font-black text-sm">96%</p>
            <p className="text-[var(--color-text-secondary)] text-[10px]">
              {lang === "id" ? "Respon" : "Response"}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenModal}
          className="w-full bg-[var(--color-orange)] text-white font-bold py-2.5 rounded-xl text-xs text-center hover:bg-[var(--color-orange-dark)] transition-all cursor-pointer border-none"
        >
          {t("postOfferNow")}
        </button>
      </div>
    </div>
  );
}

function SidebarGlobalRequests({ t }: { t: (k: string) => string }) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] p-4">
      <h3 className="font-bold text-sm text-[var(--color-forest-dark)] mb-3 flex items-center gap-2 font-display">
        <Globe size={14} className="text-[var(--color-orange)]" />
        {t("globalRequests")}
      </h3>
      <div className="space-y-2">
        {GLOBAL_REQUESTS.map((req, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-2.5 bg-[var(--color-cream)] rounded-xl hover:bg-[var(--color-border)] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{req.flag}</span>
              <div>
                <p className="text-xs font-bold text-[var(--color-forest-dark)]">
                  {req.country}
                </p>
                <p className="text-[10px] text-[var(--color-text-secondary)]">
                  {req.commodity} ({req.volume})
                </p>
              </div>
            </div>
            <button className="bg-[var(--color-orange)] text-white text-[9px] font-black px-2.5 py-1 rounded-full border-none cursor-pointer">
              {t("apply")}
            </button>
          </div>
        ))}
      </div>
      <button className="w-full mt-3 text-[var(--color-orange)] text-xs font-bold block text-center hover:underline cursor-pointer bg-transparent border-none">
        {t("viewAllRequests")}
      </button>
    </div>
  );
}

function SidebarGroAI({
  t,
  onNavigateGroAI,
}: {
  t: (k: string) => string;
  onNavigateGroAI: (prompt: string) => void;
}) {
  const [input, setInput] = useState("");

  return (
    <div className="bg-[var(--color-forest-dark)] rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-[var(--color-lime)] rounded-full animate-pulse" />
        <h3 className="text-white font-bold text-sm font-display">
          {t("groAITitle")}
        </h3>
      </div>
      <p className="text-white/60 text-xs leading-relaxed mb-3">
        {t("groAISub")}
      </p>
      <div className="relative mb-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) onNavigateGroAI(input);
          }}
          placeholder={t("groAIPlaceholder")}
          className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-xl px-3 py-2.5 text-xs mb-3 focus:outline-none focus:border-[var(--color-lime)] transition-all"
        />
      </div>
      <button
        onClick={() => {
          if (input.trim()) onNavigateGroAI(input);
        }}
        className="w-full bg-[var(--color-lime)] text-[var(--color-forest-dark)] font-black py-2.5 rounded-xl text-xs hover:brightness-110 transition-all cursor-pointer border-none"
      >
        {t("groAIBtn")}
      </button>
    </div>
  );
}

function SidebarFeaturedCoops({ t }: { t: (k: string) => string }) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] p-4">
      <h3 className="font-bold text-sm text-[var(--color-forest-dark)] mb-3 font-display">
        {t("featuredCoop")}
      </h3>
      <div className="space-y-2">
        {FEATURED_COOPS.map((coop, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-2 bg-[var(--color-cream)] rounded-xl hover:bg-[var(--color-border)] transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-[var(--color-border)] shrink-0 bg-[var(--color-forest)] flex items-center justify-center text-white font-black text-[10px]">
              {coop.avatar}
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--color-forest-dark)]">
                {coop.name}
              </p>
              <p className="text-[10px] text-[var(--color-text-secondary)]">
                {coop.commodities}
              </p>
            </div>
            <span className="text-[var(--color-lime-dark)] font-black text-sm ml-auto">
              #{i + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarExportGuide({
  t,
  onNavigateGroAI,
}: {
  t: (k: string) => string;
  onNavigateGroAI: (prompt: string) => void;
}) {
  const steps = [
    { icon: "✅", text: t("guideStep1") },
    { icon: "🤖", text: t("guideStep2") },
    { icon: "📝", text: t("guideStep3") },
    { icon: "🤝", text: t("guideStep4") },
  ];

  return (
    <div className="bg-[var(--color-forest-dark)] rounded-2xl p-4 text-white">
      <h3 className="font-bold text-sm text-white mb-3 flex items-center gap-2 font-display">
        {t("exportGuide")}
      </h3>
      <div className="space-y-2.5">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-[var(--color-lime)]/15 border border-[var(--color-lime)]/30 flex items-center justify-center shrink-0 text-[var(--color-lime)] text-[9px] font-black">
              {i + 1}
            </div>
            <p className="text-white/70 text-xs leading-relaxed">
              <span className="mr-1.5">{step.icon}</span>
              {step.text}
            </p>
          </div>
        ))}
      </div>
      <button
        onClick={() =>
          onNavigateGroAI("Saya ingin memulai ekspor, apa langkah pertama?")
        }
        className="text-[var(--color-lime)] text-xs font-bold mt-3 block hover:underline cursor-pointer bg-transparent border-none text-left p-0"
      >
        {t("guideQuestion")}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CREATE POST MODAL
// ═══════════════════════════════════════════════════════════════════════════════
function CreatePostModal({
  t,
  onClose,
  onSuccess,
}: {
  t: (k: string) => string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState(1);
  const [postType, setPostType] = useState<PostType | "">("");
  const [formData, setFormData] = useState({
    title: "",
    commodity: "",
    volume: "",
    price: "",
    minOrder: "",
    description: "",
    exportReady: false,
  });

  const types = [
    {
      key: "penawaran" as PostType,
      label: t("modalOfferProduct"),
      color: "#F4A261",
    },
    {
      key: "permintaan" as PostType,
      label: t("modalRequest"),
      color: "var(--color-forest)",
    },
    { key: "limbah" as PostType, label: t("modalCircular"), color: "#7C3AED" },
    {
      key: "edukasi" as PostType,
      label: t("modalEducation"),
      color: "#0F766E",
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-end md:items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full md:max-w-[600px] md:rounded-[20px] rounded-t-[20px] max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Progress bar */}
          <div className="flex items-center gap-0 p-4 border-b border-gray-100">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 flex items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all ${
                    step >= s
                      ? "bg-[#1B4332] text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-0.5 mx-1.5 rounded-full transition-all ${step > s ? "bg-[#1B4332]" : "bg-gray-100"}`}
                  />
                )}
              </div>
            ))}
            <button
              onClick={onClose}
              className="ml-3 p-1 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer border-none bg-transparent"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6">
            {/* Step 1: Choose Type */}
            {step === 1 && (
              <div>
                <h3 className="font-black text-[#111827] text-lg mb-1 font-display">
                  {t("modalChooseType")}
                </h3>
                <p className="text-sm text-[#6B7280] mb-5">
                  Pilih jenis post yang ingin kamu buat
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {types.map((tp) => (
                    <button
                      key={tp.key}
                      onClick={() => setPostType(tp.key)}
                      className={`p-5 rounded-xl border-2 text-left transition-all cursor-pointer hover:shadow-md ${
                        postType === tp.key
                          ? "shadow-md"
                          : "border-gray-100 hover:border-gray-300"
                      }`}
                      style={
                        postType === tp.key
                          ? {
                              borderColor: tp.color,
                              background: `${tp.color}08`,
                            }
                          : {}
                      }
                    >
                      <p className="text-2xl mb-2">{tp.label.split(" ")[0]}</p>
                      <p className="text-xs font-bold text-[#111827]">
                        {tp.label.substring(tp.label.indexOf(" ") + 1)}
                      </p>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    if (postType) setStep(2);
                  }}
                  disabled={!postType}
                  className="w-full mt-5 py-3 rounded-full bg-[#1B4332] text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#14532D] transition-all cursor-pointer active:scale-[0.97] border-none"
                >
                  {t("modalNext")}{" "}
                  <ChevronRight size={14} className="inline ml-1" />
                </button>
              </div>
            )}

            {/* Step 2: Form */}
            {step === 2 && (
              <div>
                <h3 className="font-black text-[#111827] text-lg mb-5 font-display">
                  Detail Post
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#6B7280] mb-1.5 uppercase tracking-wider">
                      {t("modalPostTitle")}
                    </label>
                    <input
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all"
                      placeholder="Judul yang menarik perhatian..."
                    />
                  </div>

                  {(postType === "penawaran" ||
                    postType === "permintaan" ||
                    postType === "limbah") && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#6B7280] mb-1.5 uppercase tracking-wider">
                            {t("modalCommodity")}
                          </label>
                          <select
                            value={formData.commodity}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                commodity: e.target.value,
                              })
                            }
                            className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#1B4332] transition-all bg-white"
                          >
                            <option value="">Pilih...</option>
                            <option>Kopi Arabika</option>
                            <option>Kopi Robusta</option>
                            <option>Udang Vaname</option>
                            <option>Ikan Tuna</option>
                            <option>Rumput Laut</option>
                            <option>Beras Organik</option>
                            <option>Minyak Kelapa</option>
                            <option>Rempah-rempah</option>
                            <option>Sekam Padi</option>
                            <option>Lainnya</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#6B7280] mb-1.5 uppercase tracking-wider">
                            {t("modalVolume")}
                          </label>
                          <input
                            value={formData.volume}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                volume: e.target.value,
                              })
                            }
                            className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#1B4332] transition-all"
                            placeholder="Contoh: 500 kg/bln"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#6B7280] mb-1.5 uppercase tracking-wider">
                            {t("modalPrice")}
                          </label>
                          <input
                            value={formData.price}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                price: e.target.value,
                              })
                            }
                            className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#1B4332] transition-all"
                            placeholder="Rp .../kg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#6B7280] mb-1.5 uppercase tracking-wider">
                            {t("modalMinOrder")}
                          </label>
                          <input
                            value={formData.minOrder}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                minOrder: e.target.value,
                              })
                            }
                            className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#1B4332] transition-all"
                            placeholder="Contoh: 100 kg"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-[#6B7280] mb-1.5 uppercase tracking-wider">
                      {t("modalDesc")}
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all resize-none"
                      placeholder="Deskripsikan penawaran atau kebutuhan Anda..."
                    />
                  </div>

                  {postType === "penawaran" && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-[#6B7280] mb-1.5 uppercase tracking-wider">
                          {t("modalPhotos")}
                        </label>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-[#1B4332]/40 transition-colors cursor-pointer">
                          <Upload
                            size={20}
                            className="mx-auto text-gray-400 mb-1"
                          />
                          <p className="text-xs text-gray-400">
                            Klik atau drag foto di sini
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#6B7280] mb-1.5 uppercase tracking-wider">
                          {t("modalCerts")}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Halal",
                            "Organik",
                            "SNI",
                            "GAP",
                            "HACCP",
                            "JAS",
                            "EU Organic",
                          ].map((cert) => (
                            <button
                              key={cert}
                              className="text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full hover:border-[#1B4332] hover:text-[#1B4332] hover:bg-green-50 transition-all cursor-pointer"
                            >
                              {cert}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                        <div>
                          <p className="text-xs font-bold text-[#111827]">
                            {t("modalExportReady")}
                          </p>
                          <p className="text-[10px] text-[#6B7280]">
                            Aktifkan jika produk siap ekspor
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            setFormData({
                              ...formData,
                              exportReady: !formData.exportReady,
                            })
                          }
                          className={`w-10 h-5 rounded-full transition-all cursor-pointer border-none relative ${formData.exportReady ? "bg-[#1B4332]" : "bg-gray-300"}`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full shadow transition-transform absolute top-0.5 ${formData.exportReady ? "right-0.5" : "left-0.5"}`}
                          />
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="px-5 py-3 rounded-full border border-gray-200 text-[#6B7280] font-bold text-sm hover:bg-gray-50 transition-all cursor-pointer bg-transparent"
                  >
                    {t("modalBack")}
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!formData.title}
                    className="flex-1 py-3 rounded-full bg-[#1B4332] text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#14532D] transition-all cursor-pointer active:scale-[0.97] border-none"
                  >
                    {t("modalPreview")}{" "}
                    <ChevronRight size={14} className="inline ml-1" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Preview */}
            {step === 3 && (
              <div>
                <h3 className="font-black text-[#111827] text-lg mb-5 font-display">
                  {t("modalPreview")}
                </h3>
                {/* Preview Card */}
                <div className="bg-[#FAFAF8] border border-[#E5E7EB] rounded-2xl p-5 mb-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar initials="MH" size={40} color="#1B4332" />
                    <div>
                      <p className="text-sm font-bold text-[#111827]">
                        KUD Tani Makmur
                      </p>
                      <div className="flex items-center gap-2">
                        <VerifiedBadge label="Verified Protected Farm" />
                      </div>
                    </div>
                  </div>
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3 text-[10px] font-black uppercase tracking-[0.05em] ${
                      postType === "penawaran"
                        ? "bg-orange-50 border border-orange-200 text-[#F4A261]"
                        : postType === "permintaan"
                          ? "bg-[var(--color-forest)]/10 border border-[var(--color-forest)]/20 text-[var(--color-forest)]"
                          : postType === "limbah"
                            ? "bg-purple-50 border border-purple-200 text-[#7C3AED]"
                            : "bg-green-50 border border-green-200 text-[#065F46]"
                    }`}
                  >
                    {postType === "penawaran"
                      ? t("labelOffer")
                      : postType === "permintaan"
                        ? t("labelRequest")
                        : postType === "limbah"
                          ? t("labelCircular")
                          : t("labelEducation")}
                  </div>
                  <h4 className="font-bold text-[#111827] text-sm mb-2">
                    {formData.title || "Judul post..."}
                  </h4>
                  <p className="text-xs text-[#6B7280] mb-3">
                    {formData.description || "Deskripsi post..."}
                  </p>
                  {formData.commodity && (
                    <div className="bg-white rounded-xl border border-gray-100 p-3">
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div>
                          <span className="font-black text-gray-400 uppercase">
                            {t("commodity")}:
                          </span>{" "}
                          <span className="font-bold text-[#111827]">
                            {formData.commodity}
                          </span>
                        </div>
                        <div>
                          <span className="font-black text-gray-400 uppercase">
                            {t("volume")}:
                          </span>{" "}
                          <span className="font-bold text-[#111827]">
                            {formData.volume}
                          </span>
                        </div>
                        <div>
                          <span className="font-black text-gray-400 uppercase">
                            {t("price")}:
                          </span>{" "}
                          <span className="font-bold text-[#111827]">
                            {formData.price}
                          </span>
                        </div>
                        <div>
                          <span className="font-black text-gray-400 uppercase">
                            {t("minOrder")}:
                          </span>{" "}
                          <span className="font-bold text-[#111827]">
                            {formData.minOrder}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setStep(2)}
                    className="px-5 py-3 rounded-full border border-gray-200 text-[#6B7280] font-bold text-sm hover:bg-gray-50 transition-all cursor-pointer bg-transparent"
                  >
                    {t("modalBack")}
                  </button>
                  <button
                    onClick={() => {
                      onSuccess();
                      onClose();
                    }}
                    className="flex-1 py-3 rounded-full bg-[#1B4332] text-white font-bold text-sm hover:bg-[#14532D] transition-all cursor-pointer active:scale-[0.97] shadow-lg shadow-green-900/20 border-none"
                  >
                    {t("modalPostNow")}{" "}
                    <CheckCircle2 size={14} className="inline ml-1" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EMPTY STATE
// ═══════════════════════════════════════════════════════════════════════════════
function EmptyState({
  t,
  onOpenModal,
}: {
  t: (k: string) => string;
  onOpenModal: () => void;
}) {
  return (
    <div
      className="bg-white rounded-2xl p-10 text-center"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
        <Package size={28} className="text-gray-300" />
      </div>
      <h4 className="font-bold text-[#111827] text-sm mb-1">
        {t("emptyTitle")}
      </h4>
      <p className="text-xs text-[#6B7280] mb-4">{t("emptySub")}</p>
      <button
        onClick={onOpenModal}
        className="px-6 py-2.5 rounded-full bg-[#1B4332] text-white font-bold text-xs hover:bg-[#14532D] transition-all cursor-pointer active:scale-[0.97]"
      >
        {t("emptyBtn")}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CTA SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function CTASection({ t }: { t: (k: string) => string }) {
  return (
    <section
      className="py-16 md:py-20"
      style={{ background: "linear-gradient(135deg, #1B4332, #0F766E)" }}
    >
      <div className="max-w-[800px] mx-auto px-6 md:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-black text-white leading-tight tracking-[-0.02em] mb-4">
          {t("ctaHeading")}
        </h2>
        <p className="text-sm md:text-base text-white/70 leading-relaxed mb-8 max-w-lg mx-auto">
          {t("ctaSub")}
        </p>
        <button
          className="px-8 py-3.5 rounded-full font-bold text-sm text-white shadow-lg shadow-orange-900/30 hover:brightness-110 transition-all cursor-pointer active:scale-[0.97]"
          style={{ background: "#F4A261" }}
        >
          {t("ctaBtn")}
        </button>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════════════════════════════════════════
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 z-[300] bg-[#1B4332] text-white px-5 py-3 rounded-xl shadow-2xl font-bold text-sm flex items-center gap-2"
        >
          <CheckCircle2 size={16} />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function ConnectPage() {
  const navigate = useNavigate();

  // Language
  const [lang, setLang] = useState<Lang>("id");
  const t = useCallback(
    (key: string): string => {
      return TRANSLATIONS[key]?.[lang] ?? key;
    },
    [lang],
  );

  // Filters
  const [activeFilter, setActiveFilter] = useState<FilterType>("semua");
  const [activeCommodity, setActiveCommodity] = useState<CommodityFilter>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [exportOnly, setExportOnly] = useState(false);
  const [stockOnly, setStockOnly] = useState(false);

  // Feed
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);

  // Modal & Toast
  const [modalOpen, setModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  // Sidebar mobile accordion
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Chat Messenger Overlay states
  const [messengerOpen, setMessengerOpen] = useState(false);
  const [chatBoxOpen, setChatBoxOpen] = useState(false);
  const [msgTab, setMsgTab] = useState<"prioritas" | "lainnya">("prioritas");
  const [msgSearchQuery, setMsgSearchQuery] = useState("");

  useRealtimePosts();

  const feedRef = useRef<HTMLDivElement>(null);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Filter posts
  const filteredPosts = MOCK_POSTS.filter((post) => {
    // Type filter
    if (activeFilter === "penawaran" && post.type !== "penawaran") return false;
    if (activeFilter === "permintaan" && post.type !== "permintaan")
      return false;
    if (activeFilter === "edukasi" && post.type !== "edukasi") return false;

    // Commodity filter
    if (activeCommodity) {
      const lowerTags = post.tags.map((t) => t.toLowerCase()).join(" ");
      const text =
        (post as any).commodity?.toLowerCase() ||
        (post as any).title?.toLowerCase() ||
        "";
      const combined = lowerTags + " " + text;
      if (
        activeCommodity === "kopi" &&
        !combined.includes("kopi") &&
        !combined.includes("coffee")
      )
        return false;
      if (
        activeCommodity === "ikan" &&
        !combined.includes("ikan") &&
        !combined.includes("tuna") &&
        !combined.includes("fish")
      )
        return false;
      if (
        activeCommodity === "udang" &&
        !combined.includes("udang") &&
        !combined.includes("vaname") &&
        !combined.includes("shrimp")
      )
        return false;
      if (
        activeCommodity === "padi" &&
        !combined.includes("padi") &&
        !combined.includes("beras") &&
        !combined.includes("sekam") &&
        !combined.includes("rice")
      )
        return false;
      if (
        activeCommodity === "sayuran" &&
        !combined.includes("sayur") &&
        !combined.includes("tomat") &&
        !combined.includes("cabai") &&
        !combined.includes("vegetable")
      )
        return false;
      if (
        activeCommodity === "perkebunan" &&
        !combined.includes("kelapa") &&
        !combined.includes("sawit") &&
        !combined.includes("plantation")
      )
        return false;
      if (activeCommodity === "limbah" && post.type !== "limbah") return false;
    }

    // Verified filter
    if (verifiedOnly) {
      if (post.type === "penawaran" && !(post as PostPenawaran).verified)
        return false;
      if (post.type === "permintaan" && !(post as PostPermintaan).verified)
        return false;
      if (post.type === "limbah" && !(post as PostLimbah).verified)
        return false;
    }

    // Export ready filter
    if (
      exportOnly &&
      post.type === "penawaran" &&
      !(post as PostPenawaran).exportReady
    )
      return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const searchable = JSON.stringify(post).toLowerCase();
      if (!searchable.includes(q)) return false;
    }

    return true;
  });

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  const handlePostSuccess = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const handleNavigateGroAI = (_prompt: string) => {
    // In real app, would navigate to LadangAI with prompt
    // For now, simulate by alert or console
    console.log("Navigate to Gro AI with prompt:", _prompt);
  };

  const handleScrollToFeed = () => {
    feedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen font-sans bg-[var(--color-cream)]">
      {/* Language Toggle */}
      <div className="fixed top-[58px] right-4 z-50">
        <button
          onClick={() => setLang(lang === "id" ? "en" : "id")}
          className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md border border-gray-200 rounded-full px-3 py-1.5 text-[11px] font-bold text-[#111827] shadow-sm hover:shadow-md transition-all cursor-pointer border-none"
        >
          <Globe size={12} />
          {lang === "id" ? "EN" : "ID"}
        </button>
      </div>

      {/* Hero */}
      <HeroSection
        t={t}
        onOpenModal={() => setModalOpen(true)}
        onScrollToFeed={handleScrollToFeed}
      />

      {/* Filter Bar */}
      <FilterBar
        t={t}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        activeCommodity={activeCommodity}
        setActiveCommodity={setActiveCommodity}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        verifiedOnly={verifiedOnly}
        setVerifiedOnly={setVerifiedOnly}
        exportOnly={exportOnly}
        setExportOnly={setExportOnly}
        stockOnly={stockOnly}
        setStockOnly={setStockOnly}
        onAskGroAI={() =>
          handleNavigateGroAI(searchQuery || "Bantu saya menemukan pembeli")
        }
      />

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-8 py-6" ref={feedRef}>
        <div className="flex flex-col xl:flex-row gap-5 items-start">
          {/* Left Sidebar - Desktop */}
          <div className="hidden xl:block w-64 shrink-0 sticky top-[24px] self-start space-y-4">
            <SidebarProfile
              t={t}
              lang={lang}
              onOpenModal={() => setModalOpen(true)}
            />
            <SidebarExportGuide t={t} onNavigateGroAI={handleNavigateGroAI} />
          </div>

          {/* Middle Column (Feed) */}
          <div className="flex-1 w-full space-y-4">
            {/* Create Post Bar */}
            <div
              onClick={() => setModalOpen(true)}
              className="bg-white rounded-2xl border border-[var(--color-border)] p-4 mb-4 flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--color-forest)] flex items-center justify-center text-white font-black text-sm shrink-0">
                KT
              </div>
              <div className="flex-1 bg-[var(--color-cream)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] transition-all">
                {t("createPost")}
              </div>
            </div>

            {/* Feed */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : visiblePosts.length === 0 ? (
              <EmptyState t={t} onOpenModal={() => setModalOpen(true)} />
            ) : (
              <div className="space-y-4">
                {visiblePosts.map((post) => {
                  if (post.type === "penawaran")
                    return (
                      <PenawaranCard
                        key={post.id}
                        post={post}
                        t={t}
                        onViewProfile={() =>
                          navigate(`/connect/importir/${post.id}`)
                        }
                      />
                    );
                  if (post.type === "permintaan")
                    return (
                      <PermintaanCard
                        key={post.id}
                        post={post}
                        t={t}
                        onAskGroAI={handleNavigateGroAI}
                        onViewProfile={() =>
                          navigate(`/connect/importir/${post.id}`)
                        }
                      />
                    );
                  if (post.type === "edukasi")
                    return <EdukasiCard key={post.id} post={post} t={t} />;
                  if (post.type === "limbah")
                    return <LimbahCard key={post.id} post={post} t={t} />;
                  return null;
                })}

                {/* Load More */}
                {visibleCount < filteredPosts.length && (
                  <button
                    onClick={() => setVisibleCount((c) => c + 4)}
                    className="w-full py-3 rounded-xl border border-gray-200 text-[#111827] font-bold text-sm hover:bg-gray-50 transition-all cursor-pointer active:scale-[0.99] bg-white"
                  >
                    {t("loadMore")} ({filteredPosts.length - visibleCount} lagi)
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar - Desktop */}
          <div className="hidden xl:block w-72 shrink-0 self-start space-y-4">
            <CardStatsAktif t={t} lang={lang} />
            <SidebarGlobalRequests t={t} />
            <SidebarGroAI t={t} onNavigateGroAI={handleNavigateGroAI} />
            <SidebarFeaturedCoops t={t} />
          </div>

          {/* Mobile Sidebar Accordion */}
          <div className="xl:hidden w-full mt-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-[var(--color-border)] font-bold text-sm text-[var(--color-forest-dark)] cursor-pointer"
            >
              <span>📊 Info & Tools</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${sidebarOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 pt-4">
                    <SidebarProfile
                      t={t}
                      lang={lang}
                      onOpenModal={() => setModalOpen(true)}
                    />
                    <CardStatsAktif t={t} lang={lang} />
                    <SidebarGlobalRequests t={t} />
                    <SidebarGroAI t={t} onNavigateGroAI={handleNavigateGroAI} />
                    <SidebarFeaturedCoops t={t} />
                    <SidebarExportGuide
                      t={t}
                      onNavigateGroAI={handleNavigateGroAI}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <CTASection t={t} />

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <CreatePostModal
            t={t}
            onClose={() => setModalOpen(false)}
            onSuccess={handlePostSuccess}
          />
        )}
      </AnimatePresence>

      {/* LinkedIn-Style Messenger Overlay */}
      <div className="fixed bottom-0 right-4 md:right-8 z-[100] flex items-end gap-4 pointer-events-none font-sans">
        {/* State C: Active Chat Thread Window (opens on the left) */}
        {chatBoxOpen && (
          <div className="w-[340px] h-[460px] bg-white border border-gray-200 rounded-t-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex flex-col pointer-events-auto transition-all duration-300">
            {/* Thread Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white rounded-t-xl">
              <div className="flex items-center gap-2">
                <div className="relative shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200"
                    alt="Joel Nathaniel"
                    className="w-8 h-8 rounded-full object-cover grayscale border border-gray-200"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-600 border-2 border-white rounded-full"></span>
                </div>
                <div className="min-w-0">
                  <h5 className="font-bold text-gray-800 text-xs md:text-sm leading-tight truncate">
                    Joel Nathaniel
                  </h5>
                  <span className="text-[10px] text-gray-400 font-semibold block">
                    Bersponsor
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button className="text-gray-500 hover:bg-gray-100 p-1.5 rounded transition-colors border-none bg-transparent cursor-pointer">
                  <MoreHorizontal size={14} />
                </button>
                <button className="text-gray-500 hover:bg-gray-100 p-1.5 rounded transition-colors border-none bg-transparent cursor-pointer">
                  <Minimize2 size={14} />
                </button>
                <button
                  onClick={() => setChatBoxOpen(false)}
                  className="text-gray-500 hover:bg-gray-100 p-1.5 rounded transition-colors border-none bg-transparent cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Thread Content */}
            <div className="flex-1 overflow-y-auto p-3 bg-gray-50 flex flex-col gap-3 chat-scrollbar">
              {/* Sponsored Banner Box */}
              <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                <div className="flex justify-between items-center text-[10px] text-gray-400 mb-1">
                  <span className="font-semibold text-gray-500">
                    Bersponsor
                  </span>
                  <span>26 Jun</span>
                </div>
                <h6 className="font-bold text-gray-850 text-xs md:text-sm leading-snug">
                  Akses Pasar Ekspor Agro-Marine untuk Koperasi Lokal
                </h6>
                <button
                  onClick={() => window.open("#", "_blank")}
                  className="mt-3 rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold px-4 py-1.5 transition-colors border-none cursor-pointer"
                >
                  Jadwalkan Diskusi
                </button>
              </div>

              {/* Chat Message Bubble */}
              <div className="flex gap-2 items-start mt-2">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200"
                  alt="Joel Nathaniel"
                  className="w-8 h-8 rounded-full object-cover grayscale shrink-0 border border-gray-200"
                />
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-gray-850 text-xs">
                      Joel Nathaniel
                    </span>
                    <span className="text-[10px] text-gray-400">17.21</span>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-3 shadow-xs text-xs text-gray-700 leading-relaxed max-w-[245px]">
                    <p className="mb-2">
                      Halo{" "}
                      <strong className="text-gray-900 font-bold">
                        Muhammad Hafizh
                      </strong>
                      ,
                    </p>
                    <p className="mb-2">
                      Banyak koperasi agro-marine memiliki produk berkualitas
                      ekspor — namun tantangan terbesar justru ada pada
                      sertifikasi, standarisasi global, dan kepatuhan regulasi
                      negara tujuan seperti Jepang, UAE, atau Jerman.
                    </p>
                    <p className="mb-2">
                      Agrou Connect hadir sebagai mitra ekspor Koperasi dengan
                      program pendampingan yang dapat disesuaikan dengan
                      kebutuhan:
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-1 mb-2 font-medium">
                      <li>
                        <strong className="text-gray-900 font-bold">
                          Sertifikasi Global
                        </strong>{" "}
                        — pendampingan sertifikasi HACCP, JAS Organic, Halal
                        MUI, dan Uni Eropa
                      </li>
                      <li>
                        <strong className="text-gray-900 font-bold">
                          Negosiasi Kontrak B2B
                        </strong>{" "}
                        — penyusunan draf kontrak ekspor, penanganan Letter of
                        Credit (L/C), dan CIF/FOB terms
                      </li>
                      <li>
                        <strong className="text-gray-900 font-bold">
                          Rantai Pasok Dingin (Cold Chain)
                        </strong>{" "}
                        — optimalisasi logistik pengiriman laut dan udara
                        terintegrasi
                      </li>
                    </ul>
                    <p>
                      Kami telah terbukti meningkatkan daya saing koperasi...
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Input Box */}
            <div className="p-2 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-2 bg-gray-150 rounded-lg px-3 py-2 border border-gray-200">
                <input
                  type="text"
                  placeholder="Tulis pesan..."
                  className="flex-1 bg-transparent border-none outline-none text-xs text-gray-700"
                  disabled
                />
                <button className="text-gray-400 border-none bg-transparent cursor-pointer">
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* State A & B: Collapsed / Expanded Main Messenger List Window */}
        <div
          className={`w-[320px] bg-white border border-gray-200 rounded-t-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex flex-col pointer-events-auto transition-all duration-300 ${
            messengerOpen ? "h-[460px]" : "h-[48px]"
          }`}
        >
          {/* Header */}
          <div
            onClick={() => setMessengerOpen(!messengerOpen)}
            className="flex items-center justify-between p-3 border-b border-gray-200 bg-white rounded-t-xl cursor-pointer select-none hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="relative shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200"
                  alt="Muhammad Hafizh"
                  className="w-7 h-7 rounded-full object-cover border border-gray-200"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-600 border border-white rounded-full"></span>
              </div>
              <span className="font-bold text-gray-800 text-xs md:text-sm">
                Pesan
              </span>
            </div>

            <div
              className="flex items-center gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="text-gray-500 hover:bg-gray-100 p-1.5 rounded transition-colors border-none bg-transparent cursor-pointer">
                <MoreHorizontal size={14} />
              </button>
              <button className="text-gray-500 hover:bg-gray-100 p-1.5 rounded transition-colors border-none bg-transparent cursor-pointer">
                <SquarePen size={14} />
              </button>
              <button
                onClick={() => setMessengerOpen(!messengerOpen)}
                className="text-gray-500 hover:bg-gray-100 p-1.5 rounded transition-colors border-none bg-transparent cursor-pointer"
              >
                {messengerOpen ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronUp size={14} />
                )}
              </button>
            </div>
          </div>

          {/* Expanded Content */}
          {messengerOpen && (
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
              {/* Search Bar */}
              <div className="p-2.5 border-b border-gray-100 bg-white">
                <div className="flex items-center gap-2 bg-[#edf3f8] px-3 py-1.5 rounded-lg border border-gray-100">
                  <Search size={14} className="text-gray-500 shrink-0" />
                  <input
                    type="text"
                    placeholder="Cari pesan"
                    value={msgSearchQuery}
                    onChange={(e) => setMsgSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-xs text-gray-700 placeholder-gray-400"
                  />
                  <button className="text-gray-500 hover:text-gray-700 border-none bg-transparent cursor-pointer shrink-0">
                    <SlidersHorizontal size={14} />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 text-center font-bold text-xs">
                <button
                  onClick={() => setMsgTab("prioritas")}
                  className={`flex-1 py-2.5 transition-all border-none bg-transparent cursor-pointer ${
                    msgTab === "prioritas"
                      ? "text-[#065f46] border-b-2 border-solid border-[#065f46]"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Prioritas
                </button>
                <button
                  onClick={() => setMsgTab("lainnya")}
                  className={`flex-1 py-2.5 transition-all border-none bg-transparent cursor-pointer ${
                    msgTab === "lainnya"
                      ? "text-[#065f46] border-b-2 border-solid border-[#065f46]"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Lainnya
                </button>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto chat-scrollbar">
                {msgTab === "prioritas" ? (
                  <div
                    onClick={() => setChatBoxOpen(true)}
                    className="flex items-start gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200"
                      alt="Joel Nathaniel"
                      className="w-12 h-12 rounded-full object-cover grayscale shrink-0 border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="font-bold text-gray-800 text-xs md:text-sm">
                          Joel Nathaniel
                        </span>
                        <span className="text-[10px] text-gray-400">17.21</span>
                      </div>
                      <div className="text-[11px] text-gray-550 mb-0.5">
                        <span className="font-semibold text-gray-500">
                          Sponsored
                        </span>
                        &nbsp;&nbsp;Akses Pasar Ekspor
                      </div>
                      <div className="text-[11px] text-gray-400 truncate">
                        Agro-Marine untuk Koperasi Lokal
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-gray-400">
                    Tidak ada pesan lainnya
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      <Toast message={t("toastSuccess")} visible={toastVisible} />

      {/* CSS for verified badge glow and sticky sidebars overflow fix */}
      <style>{`
        @keyframes pulse-subtle {
          0%, 100% { box-shadow: 0 0 0 0 rgba(110, 231, 183, 0); }
          50% { box-shadow: 0 0 8px 2px rgba(110, 231, 183, 0.3); }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 3s ease-in-out infinite;
        }
        /* Infinite scrolling vertical marquee */
        @keyframes marquee-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes marquee-down {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .animate-marquee-up {
          animation: marquee-up 35s linear infinite;
        }
        .animate-marquee-down {
          animation: marquee-down 35s linear infinite;
        }
        .animate-marquee-up:hover,
        .animate-marquee-down:hover {
          animation-play-state: paused;
        }
        /* Enable position: sticky for descendants by resetting overflow on root div wrapper */
        #root > div {
          overflow-x: visible !important;
          overflow-y: visible !important;
          overflow: visible !important;
        }
        /* Custom scrollbar for chat widget */
        .chat-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .chat-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
