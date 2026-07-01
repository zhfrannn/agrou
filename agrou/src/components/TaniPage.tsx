import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare,
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  Truck,
  Shield,
  Leaf,
  Zap,
  Heart,
  Clock,
  Search,
} from "lucide-react";
import DiagnosisChatbot from "./DiagnosisChatbot";
import heroShield2 from "../../assets/hero-shield-2.jpg";
import { useNavigate } from "react-router-dom";
import { useShieldProducts } from "../lib/queries/shield";
import { ProductCardSkeleton } from "./ui/LoadingSkeleton";
// ─── COLOUR TOKENS ─────────────────────────────────────────────────────────────
// Primary: #1B4D3E (dark green)   Accent: #F59E0B (amber/orange)
// Light green surface: #F0FFF4    Dark green hover: #163D30

// ─── DATA ─────────────────────────────────────────────────────────────────────

const CATEGORY_CIRCLES = [
  {
    id: "pestisida",
    label: "Pestisida",
    count: 12,
    img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=120",
  },
  {
    id: "pupuk",
    label: "Pupuk & Nutrisi",
    count: 18,
    img: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=120",
  },
  {
    id: "benih",
    label: "Benih",
    count: 8,
    img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=120",
  },
  {
    id: "hormon",
    label: "Hormon & ZPT",
    count: 6,
    img: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=120",
  },
  {
    id: "probiotik",
    label: "Probiotik",
    count: 9,
    img: "https://images.unsplash.com/photo-1574226516831-e1dff420e562?auto=format&fit=crop&q=80&w=120",
  },
  {
    id: "hayati",
    label: "Peng. Hayati",
    count: 7,
    img: "https://images.unsplash.com/photo-1628186100298-b8058204b7b6?auto=format&fit=crop&q=80&w=120",
  },
  {
    id: "perangkap",
    label: "Perangkap",
    count: 5,
    img: "https://images.unsplash.com/photo-1592982537447-6f29fb443831?auto=format&fit=crop&q=80&w=120",
  },
  {
    id: "bundle",
    label: "Paket Bundle",
    count: 15,
    img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=120",
  },
];

const FEATURED_PRODUCT = {
  name: "Paket Solusi Blast Padi Pro",
  desc: "Fungisida + nutrisi anti-stres, solusi terpadu penyakit blast padi.",
  priceMin: "Rp 150.000",
  priceMax: "Rp 230.000",
  rating: 4.8,
  reviews: 312,
  sold: "1.2k terjual",
  badge: "Terlaris",
  discount: 20,
  image:
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
  endDate: new Date(
    Date.now() + 3 * 60 * 60 * 1000 + 42 * 60 * 1000 + 18 * 1000,
  ),
};

const GRID_PRODUCTS = [
  {
    id: 1,
    name: "Fungisida Tricyclazole 100ml",
    cat: "Pestisida",
    price: 75000,
    originalPrice: 92000,
    discount: 18,
    rating: 4.8,
    reviews: 529,
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 2,
    name: "Pupuk NPK Mutiara 1kg",
    cat: "Pupuk",
    price: 55000,
    originalPrice: 70000,
    discount: 21,
    rating: 4.6,
    reviews: 876,
    image:
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 3,
    name: "Paket Hama Wereng Lengkap",
    cat: "Bundle",
    price: 210000,
    originalPrice: 262000,
    discount: 20,
    rating: 4.7,
    reviews: 198,
    image:
      "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 4,
    name: "Probiotik Udang Super 1L",
    cat: "Probiotik",
    price: 95000,
    originalPrice: null,
    discount: 0,
    rating: 4.9,
    reviews: 214,
    image:
      "https://images.unsplash.com/photo-1574226516831-e1dff420e562?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 5,
    name: "Beauveria Bassiana 100g",
    cat: "Hayati",
    price: 62000,
    originalPrice: null,
    discount: 0,
    rating: 4.5,
    reviews: 87,
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 6,
    name: "Pupuk Kalium Premium 1kg",
    cat: "Pupuk",
    price: 89000,
    originalPrice: 110000,
    discount: 19,
    rating: 4.7,
    reviews: 387,
    image:
      "https://images.unsplash.com/photo-1592982537447-6f29fb443831?auto=format&fit=crop&q=80&w=300",
  },
];

const TRENDING_PRODUCTS = [
  {
    id: 1,
    name: "Paket Solusi Blast Padi Pro",
    cat: "Bundle",
    priceMin: 150000,
    priceMax: 230000,
    discount: 20,
    rating: 4.8,
    reviews: 312,
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 2,
    name: "Insektisida Fipronil 250ml",
    cat: "Pestisida",
    priceMin: 68000,
    priceMax: 82000,
    discount: 17,
    rating: 4.6,
    reviews: 441,
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 3,
    name: "Benih Padi Ciherang 5kg",
    cat: "Benih",
    priceMin: 115000,
    priceMax: 135000,
    discount: 15,
    rating: 4.8,
    reviews: 634,
    image:
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 4,
    name: "Paket Antraknosa Cabai",
    cat: "Bundle",
    priceMin: 175000,
    priceMax: 210000,
    discount: 17,
    rating: 4.9,
    reviews: 241,
    image:
      "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 5,
    name: "Hormon Auksin Sintetik 50ml",
    cat: "Hormon",
    priceMin: 42000,
    priceMax: 42000,
    discount: 0,
    rating: 4.4,
    reviews: 103,
    image:
      "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 6,
    name: "Fungisida Mankozeb 500g",
    cat: "Pestisida",
    priceMin: 58000,
    priceMax: 72000,
    discount: 19,
    rating: 4.5,
    reviews: 220,
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 7,
    name: "Pupuk Daun Gandasil-D 250g",
    cat: "Pupuk",
    priceMin: 38000,
    priceMax: 48000,
    discount: 21,
    rating: 4.3,
    reviews: 178,
    image:
      "https://images.unsplash.com/photo-1592982537447-6f29fb443831?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 8,
    name: "Probiotik Tambak Vaname Pro",
    cat: "Probiotik",
    priceMin: 120000,
    priceMax: 150000,
    discount: 20,
    rating: 4.7,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1574226516831-e1dff420e562?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 9,
    name: "Paket Wereng Batang Coklat",
    cat: "Bundle",
    priceMin: 195000,
    priceMax: 240000,
    discount: 19,
    rating: 4.8,
    reviews: 290,
    image:
      "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 10,
    name: "Perangkap Lalat Buah Massal",
    cat: "Perangkap",
    priceMin: 45000,
    priceMax: 55000,
    discount: 18,
    rating: 4.2,
    reviews: 89,
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=400",
  },
];

const POPULAR_PRODUCTS = [
  {
    id: 1,
    name: "Pupuk NPK Mutiara 1kg",
    cat: "Pupuk",
    priceMin: 55000,
    priceMax: 70000,
    discount: 21,
    rating: 4.6,
    reviews: 876,
    image:
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=400",
    featured: true,
  },
  {
    id: 2,
    name: "Pestisida Klorantraniliprol",
    cat: "Pestisida",
    priceMin: 88000,
    priceMax: 108000,
    discount: 18,
    rating: 4.7,
    reviews: 342,
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=400",
    featured: false,
  },
  {
    id: 3,
    name: "Benih Cabai Rawit HOT",
    cat: "Benih",
    priceMin: 32000,
    priceMax: 42000,
    discount: 24,
    rating: 4.5,
    reviews: 218,
    image:
      "https://images.unsplash.com/photo-1592982537447-6f29fb443831?auto=format&fit=crop&q=80&w=400",
    featured: false,
  },
  {
    id: 4,
    name: "Probiotik Ternak Plus",
    cat: "Probiotik",
    priceMin: 145000,
    priceMax: 175000,
    discount: 17,
    rating: 4.8,
    reviews: 127,
    image:
      "https://images.unsplash.com/photo-1574226516831-e1dff420e562?auto=format&fit=crop&q=80&w=400",
    featured: false,
  },
  {
    id: 5,
    name: "Beauveria bassiana Granul",
    cat: "Hayati",
    priceMin: 78000,
    priceMax: 95000,
    discount: 18,
    rating: 4.4,
    reviews: 93,
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=400",
    featured: false,
  },
];

const TOP_RATED_PRODUCTS = [
  {
    id: 1,
    name: "Paket Solusi Blast Padi Pro",
    cat: "Bundle",
    price: 185000,
    originalPrice: 230000,
    discount: 20,
    rating: 4.8,
    reviews: 312,
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 2,
    name: "Fungisida Tricyclazole 100ml",
    cat: "Pestisida",
    price: 75000,
    originalPrice: 92000,
    discount: 18,
    rating: 4.8,
    reviews: 529,
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 3,
    name: "Probiotik Udang Super 1L",
    cat: "Probiotik",
    price: 95000,
    originalPrice: 120000,
    discount: 20,
    rating: 4.9,
    reviews: 214,
    image:
      "https://images.unsplash.com/photo-1574226516831-e1dff420e562?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 4,
    name: "Benih Padi Ciherang 5kg",
    cat: "Benih",
    price: 115000,
    originalPrice: 135000,
    discount: 15,
    rating: 4.8,
    reviews: 634,
    image:
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 5,
    name: "Beauveria Bassiana 100g",
    cat: "Hayati",
    price: 62000,
    originalPrice: 80000,
    discount: 22,
    rating: 4.5,
    reviews: 87,
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 6,
    name: "Pupuk Kalium Premium 1kg",
    cat: "Pupuk",
    price: 89000,
    originalPrice: 110000,
    discount: 19,
    rating: 4.7,
    reviews: 387,
    image:
      "https://images.unsplash.com/photo-1592982537447-6f29fb443831?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 7,
    name: "Insektisida Fipronil 250ml",
    cat: "Pestisida",
    price: 68000,
    originalPrice: 82000,
    discount: 17,
    rating: 4.6,
    reviews: 441,
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=300",
  },
];

const BEST_SELLING_LIST = [
  {
    id: 1,
    name: "Paket Blast Padi Pro",
    price: 185000,
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=80",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Fungisida Tricyclazole",
    price: 75000,
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=80",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Pupuk NPK Mutiara 1kg",
    price: 55000,
    image:
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=80",
    rating: 4.6,
  },
  {
    id: 4,
    name: "Probiotik Udang Super",
    price: 95000,
    image:
      "https://images.unsplash.com/photo-1574226516831-e1dff420e562?auto=format&fit=crop&q=80&w=80",
    rating: 4.9,
  },
  {
    id: 5,
    name: "Insektisida Fipronil 250",
    price: 68000,
    image:
      "https://images.unsplash.com/photo-1628172828620-379e4c1945be?auto=format&fit=crop&q=80&w=80",
    rating: 4.6,
  },
];

const TREND_TABS = ["Semua", "Pestisida", "Pupuk", "Bundle", "Probiotik"];
const POP_TABS = ["Semua", "Pestisida", "Pupuk", "Benih", "Hayati"];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function StarRow({
  rating,
  reviews,
  sm,
}: {
  rating: number;
  reviews: number;
  sm?: boolean;
}) {
  const sz = sm ? 10 : 12;
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={sz}
            className={
              s <= Math.round(rating)
                ? "fill-(--color-orange) text-(--color-orange)"
                : "fill-gray-200 text-gray-200"
            }
          />
        ))}
      </div>
      <span
        className={`font-medium text-gray-400 ${sm ? "text-[10px]" : "text-xs"}`}
      >
        ({reviews})
      </span>
    </div>
  );
}

function Countdown({ endDate }: { endDate: Date }) {
  const calc = () => {
    const diff = Math.max(0, endDate.getTime() - Date.now());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { h, m, s };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const iv = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(iv);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex items-center gap-1 mt-2">
      <Clock size={11} className="text-(--color-orange)" />
      <span className="text-[10px] font-bold text-(--color-orange)">
        Berakhir dalam
      </span>
      {[pad(t.h), pad(t.m), pad(t.s)].map((v, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="bg-(--color-forest) text-(--color-lime) text-[11px] font-black px-1.5 py-0.5 rounded">
            {v}
          </span>
          {i < 2 && (
            <span className="text-(--color-lime) font-black text-xs">
              :
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

type GridProduct = {
  id: string | number;
  name: string;
  cat: string;
  price: number;
  originalPrice?: number | null;
  discount: number;
  rating: number;
  reviews: number;
  image: string;
};

// Small horizontal product card used in grid rows
function SmallProductCard({ prod }: { prod: GridProduct }) {
  return (
    <div className="flex gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-2.5 group">
      <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
        <img
          src={prod.image}
          alt={prod.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {prod.discount > 0 && (
          <div className="absolute top-1 right-1 bg-(--color-orange) text-white text-[9px] font-black px-1 py-0.5 rounded">
            {prod.discount}%
          </div>
        )}
      </div>
      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div>
          <span className="text-[9px] font-bold text-(--color-forest) bg-(--color-forest)/10 px-1.5 py-0.5 rounded-full">
            {prod.cat}
          </span>
          <p className="font-semibold text-gray-800 text-[12px] leading-tight mt-1 line-clamp-2">
            {prod.name}
          </p>
        </div>
        <div>
          {prod.originalPrice && (
            <p className="text-gray-400 text-[10px] line-through">
              {formatRp(prod.originalPrice)}
            </p>
          )}
          <p className="font-black text-(--color-forest) text-[14px] leading-none">
            {formatRp(prod.price)}
          </p>
          <StarRow rating={prod.rating} reviews={prod.reviews} sm />
        </div>
      </div>
    </div>
  );
}

function FeaturedCountdown({ endDate }: { endDate: Date }) {
  const calc = () => {
    const diff = Math.max(0, endDate.getTime() - Date.now());
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { d, h, m, s };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const iv = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(iv);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex justify-center items-center gap-1.5 mt-2 mb-3">
      {[
        { label: "Days", val: pad(t.d) },
        { label: "Hrs", val: pad(t.h) },
        { label: "Mins", val: pad(t.m) },
        { label: "Secs", val: pad(t.s) },
      ].map((item, idx) => (
        <div
          key={idx}
          className="bg-(--color-orange) text-white flex flex-col items-center justify-center rounded px-1.5 py-0.5 min-w-10.5 shadow-sm"
        >
          <span className="text-xs font-black leading-none">{item.val}</span>
          <span className="text-[7px] font-bold uppercase tracking-wider mt-0.5 leading-none opacity-80">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function FeaturedProductCard({ prod }: { prod: GridProduct }) {
  return (
    <div className="relative flex gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-2.5 group items-stretch h-full">
      {/* Wishlist button */}
      <button className="absolute top-2.5 right-2.5 text-gray-300 hover:text-(--color-orange) transition-colors z-10">
        <Heart size={14} className="fill-current" />
      </button>

      {/* Sisi Kiri: Foto produk kotak 80x80px background putih */}
      <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-white flex items-center justify-center p-1 border border-gray-50">
        <img
          src={prod.image}
          alt={prod.name}
          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badge diskon persen pojok kiri atas foto */}
        {prod.discount > 0 && (
          <div className="absolute top-1 left-1 bg-(--color-orange) text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm leading-none">
            -{prod.discount}%
          </div>
        )}
      </div>

      {/* Sisi Kanan: Detail info */}
      <div className="flex flex-col justify-between flex-1 min-w-0 pr-4">
        <div>
          {/* Kategori text-xs abu di atas */}
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            {prod.cat}
          </span>

          {/* Harga coret text-xs abu + harga aktif hijau bold */}
          <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
            <span className="font-bold text-(--color-forest) text-xs sm:text-sm">
              {formatRp(prod.price)}
            </span>
            {prod.originalPrice && (
              <span className="text-gray-400 text-[10px] line-through">
                {formatRp(prod.originalPrice)}
              </span>
            )}
            {prod.discount > 0 && (
              <span className="bg-(--color-orange)/10 text-(--color-orange) font-black text-[9px] px-1 py-0.5 rounded leading-none">
                -{prod.discount}%
              </span>
            )}
          </div>

          {/* Nama produk 2 baris text-sm font-semibold */}
          <p className="font-semibold text-gray-800 text-xs sm:text-sm leading-tight mt-1 line-clamp-2">
            {prod.name}
          </p>
        </div>

        {/* Rating bintang + jumlah review text-xs */}
        <div className="flex items-center gap-1 mt-1 shrink-0">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={10}
                className={
                  s <= Math.round(prod.rating)
                    ? "fill-(--color-orange) text-(--color-orange)"
                    : "fill-gray-200 text-gray-200"
                }
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-400">({prod.reviews})</span>
        </div>
      </div>
    </div>
  );
}

function FeaturedMiddleCard() {
  const prod = TRENDING_PRODUCTS[3]; // Paket Antraknosa Cabai
  return (
    <div className="relative flex flex-col justify-between bg-white rounded-2xl border border-gray-100 shadow-sm p-4 group h-full hover:shadow-md transition-all duration-200">
      {/* Top Left Category */}
      <div className="flex justify-between items-start">
        <span className="text-[11px] text-gray-400 font-medium">
          {prod.cat}
        </span>
        {/* Wishlist button */}
        <button className="text-gray-300 hover:text-(--color-orange) transition-colors">
          <Heart size={14} className="fill-current" />
        </button>
      </div>

      {/* Centered Large Image */}
      <div className="h-44 w-full bg-white flex items-center justify-center p-2 relative overflow-hidden my-3">
        <img
          src={prod.image}
          alt={prod.name}
          className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Bottom Info */}
      <div className="mt-auto">
        {/* Pill tag */}
        <span className="bg-(--color-lime)/20 text-(--color-forest) px-2 py-0.5 rounded-full text-[9px] font-bold inline-block mb-2">
          Cabai Sehat
        </span>

        {/* Price & Discount */}
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          <span className="font-extrabold text-(--color-orange) text-sm">
            {formatRp(prod.priceMin)}
          </span>
          <span className="text-gray-400 text-[10px] line-through">
            Rp 210.000
          </span>
          <span className="bg-(--color-orange)/10 text-(--color-orange) font-black text-[9px] px-1 py-0.5 rounded">
            -{prod.discount}%
          </span>
        </div>

        {/* Rating & reviews */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={10}
                className={
                  s <= Math.round(prod.rating)
                    ? "fill-(--color-orange) text-(--color-orange)"
                    : "fill-gray-200 text-gray-200"
                }
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-400">({prod.reviews})</span>
        </div>

        {/* Product Name */}
        <p className="font-semibold text-gray-800 text-xs sm:text-sm leading-snug line-clamp-2">
          {prod.name}
        </p>
      </div>
    </div>
  );
}

// Standard vertical card used in trending / popular
function ProductCard({
  prod,
  small,
}: {
  prod: (typeof TRENDING_PRODUCTS)[0];
  small?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group">
      <div
        className={`relative ${small ? "h-36" : "h-44"} bg-gray-50 overflow-hidden`}
      >
        <img
          src={prod.image}
          alt={prod.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 bg-(--color-forest)/90 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
          {prod.cat}
        </div>
        {prod.discount > 0 && (
          <div className="absolute top-2 right-2 bg-(--color-orange) text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
            {prod.discount}%<br />
            OFF
          </div>
        )}
        <button className="absolute bottom-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow text-gray-400 hover:text-(--color-orange) transition-colors opacity-0 group-hover:opacity-100">
          <Heart size={12} />
        </button>
      </div>
      <div className="p-3 flex flex-col flex-1">
        <p className="font-semibold text-gray-800 text-[12px] leading-snug line-clamp-2 mb-1 flex-1">
          {prod.name}
        </p>
        <div className="flex items-center gap-1 mb-1">
          <StarRow rating={prod.rating} reviews={prod.reviews} sm />
        </div>
        <p className="text-gray-400 text-[10px] mb-0.5">
          {prod.priceMin === prod.priceMax
            ? formatRp(prod.priceMin)
            : `${formatRp(prod.priceMin)} – ${formatRp(prod.priceMax)}`}
        </p>
        <button className="mt-2 w-full border border-(--color-forest) text-(--color-forest) hover:bg-(--color-forest) hover:text-white text-[10px] font-bold py-1.5 rounded-xl transition-colors">
          Pilih Opsi
        </button>
      </div>
    </div>
  );
}

function TrendingProductCard({
  prod,
}: {
  prod: (typeof TRENDING_PRODUCTS)[0];
}) {
  const originalPriceMin =
    prod.discount > 0
      ? Math.round(prod.priceMin / (1 - prod.discount / 100))
      : null;
  const variantLabel =
    prod.cat === "Pupuk"
      ? "1kg · 5kg"
      : prod.cat === "Benih"
        ? "100g · 500g"
        : "500ml · 1L";

  return (
    <div className="relative bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-3 flex flex-col justify-between group h-full border border-gray-100/50">
      {/* Icon wishlist hati di pojok kanan atas card */}
      <button className="absolute top-3 right-3 text-gray-300 hover:text-(--color-orange) transition-colors z-10">
        <Heart size={14} className="fill-current" />
      </button>

      {/* Bagian atas: dua pill varian/ukuran kecil sejajar */}
      <div className="flex gap-1.5 mb-2 shrink-0">
        {variantLabel.split(" · ").map((v, idx) => (
          <span
            key={idx}
            className="bg-gray-100 text-gray-400 text-[9px] font-bold px-2 py-0.5 rounded-full"
          >
            {v}
          </span>
        ))}
      </div>

      {/* Tengah: foto produk background putih bersih centered */}
      <div className="h-35 w-full bg-white flex items-center justify-center p-2 relative overflow-hidden mb-3">
        <img
          src={prod.image}
          alt={prod.name}
          className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Bawah foto: info harga, diskon, nama, rating, tombol */}
      <div className="flex flex-col flex-1">
        {/* Harga range bold orange + harga coret abu + badge diskon persen dalam satu baris */}
        <div className="flex items-center gap-1.5 flex-wrap mb-1 shrink-0">
          <span className="font-extrabold text-(--color-orange) text-xs sm:text-sm">
            {prod.priceMin === prod.priceMax
              ? formatRp(prod.priceMin)
              : `${formatRp(prod.priceMin)} - ${formatRp(prod.priceMax)}`}
          </span>
          {originalPriceMin && (
            <span className="text-gray-400 text-[10px] line-through">
              {formatRp(originalPriceMin)}
            </span>
          )}
          {prod.discount > 0 && (
            <span className="bg-(--color-orange)/10 text-(--color-orange) font-black text-[9px] px-1 py-0.5 rounded leading-none">
              -{prod.discount}%
            </span>
          )}
        </div>

        {/* Nama produk 2 baris text-sm */}
        <p className="font-bold text-gray-800 text-xs sm:text-sm leading-tight line-clamp-2 mb-1.5 flex-1">
          {prod.name}
        </p>

        {/* Rating bintang + jumlah review text-xs */}
        <div className="flex items-center gap-1 mb-2 shrink-0">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={10}
                className={
                  s <= Math.round(prod.rating)
                    ? "fill-(--color-orange) text-(--color-orange)"
                    : "fill-gray-200 text-gray-200"
                }
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-400">({prod.reviews})</span>
        </div>

        {/* Tombol "Pilih Opsi" full width outline border hijau text-hijau */}
        <button className="w-full border border-(--color-forest) text-(--color-forest) hover:bg-(--color-forest) hover:text-white text-xs font-bold py-2 rounded-xl transition-all mt-auto flex items-center justify-center gap-1.5 shrink-0">
          Pilih Opsi
        </button>
      </div>
    </div>
  );
}

function TallProductCard({ prod }: { prod: (typeof TOP_RATED_PRODUCTS)[0] }) {
  return (
    <div className="relative flex flex-col justify-between bg-(--color-forest) rounded-2xl border border-white/10 shadow-sm p-4 group h-full hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {/* Category & Wishlist */}
      <div className="flex justify-between items-start shrink-0">
        <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">
          {prod.cat}
        </span>
        <button className="text-white/30 hover:text-(--color-orange) transition-colors">
          <Heart size={14} />
        </button>
      </div>

      {/* Large Image (centered and padded) */}
      <div className="flex-1 flex items-center justify-center p-4 my-4 min-h-55">
        <img
          src={prod.image}
          alt={prod.name}
          className="max-h-60 w-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Product details */}
      <div className="mt-auto shrink-0">
        {/* Price & Original Price */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-extrabold text-(--color-lime) text-base sm:text-lg">
            {formatRp(prod.price)}
          </span>
          {prod.originalPrice && (
            <span className="text-white/40 text-xs line-through">
              {formatRp(prod.originalPrice)}
            </span>
          )}
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 mt-1">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={10}
                className={
                  s <= Math.round(prod.rating)
                    ? "fill-(--color-orange) text-(--color-orange)"
                    : "fill-white/20 text-white/20"
                }
              />
            ))}
          </div>
          <span className="text-[10px] text-white/50">
            ({prod.rating.toFixed(1)})
          </span>
        </div>

        {/* Title */}
        <p className="font-bold text-white text-xs sm:text-sm leading-tight mt-2 line-clamp-2">
          {prod.name}
        </p>
      </div>
    </div>
  );
}

function StandardGridCard({ prod }: { prod: (typeof TOP_RATED_PRODUCTS)[0] }) {
  return (
    <div className="relative flex flex-col justify-between bg-white rounded-2xl border border-gray-100 shadow-sm p-4 group flex-1 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {/* Category & Wishlist */}
      <div className="flex justify-between items-start shrink-0">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
          {prod.cat}
        </span>
        <button className="text-gray-300 hover:text-(--color-orange) transition-colors">
          <Heart size={14} />
        </button>
      </div>

      {/* Image */}
      <div className="h-28 w-full bg-white flex items-center justify-center p-2 relative overflow-hidden my-2">
        <img
          src={prod.image}
          alt={prod.name}
          className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Details */}
      <div className="mt-auto shrink-0">
        {/* Price & Original Price */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-extrabold text-(--color-forest) text-sm">
            {formatRp(prod.price)}
          </span>
          {prod.originalPrice && (
            <span className="text-gray-400 text-[10px] line-through">
              {formatRp(prod.originalPrice)}
            </span>
          )}
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 mt-0.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={10}
                className={
                  s <= Math.round(prod.rating)
                    ? "fill-(--color-orange) text-(--color-orange)"
                    : "fill-gray-200 text-gray-200"
                }
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-400">
            ({prod.rating.toFixed(1)})
          </span>
        </div>

        {/* Title */}
        <p className="font-bold text-gray-800 text-xs leading-tight mt-1.5 line-clamp-2">
          {prod.name}
        </p>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function TaniPage() {
  const navigate = useNavigate();
  const goToKatalog = (category = "Semua Produk") =>
    navigate("/katalog?kategori=" + encodeURIComponent(category));
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Tutup chatbot saat TaniPage unmount (navigasi ke halaman lain)
  // supaya overlay fixed tidak nyangkut di halaman berikutnya
  useEffect(() => {
    return () => {
      setIsChatbotOpen(false);
    };
  }, []);

  const {
    data: dbShieldProducts,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useShieldProducts();

  // Map DB products, then fill remaining slots with static fallback products
  // to guarantee we always have >= 6 items (needed by FeaturedProductCard slots)
  const dbMapped: GridProduct[] =
    !productsError && dbShieldProducts && dbShieldProducts.length > 0
      ? dbShieldProducts.map((p: any) => ({
          id: p.id,
          name: p.name,
          cat: p.category ?? "Pestisida",
          price: p.price,
          originalPrice: p.original_price ?? Math.round(p.price * 1.2),
          discount: p.discount_percent ?? 0,
          rating: p.rating ?? 4.5,
          reviews: p.reviews_count ?? 0,
          image:
            p.images?.[0] ??
            "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=300",
        }))
      : [];

  // Merge DB products with static products; if DB has fewer than 6, pad with static
  const gridProducts: GridProduct[] =
    dbMapped.length >= 6
      ? dbMapped
      : [
          ...dbMapped,
          ...GRID_PRODUCTS.slice(dbMapped.length),
        ];
  const [trendTab, setTrendTab] = useState("Semua");
  const [popTab, setPopTab] = useState("Semua");
  const [trendPage, setTrendPage] = useState(0);
  const [popPage, setPopPage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Trending visible window (5 per page)
  const trendFiltered =
    trendTab === "Semua"
      ? TRENDING_PRODUCTS
      : TRENDING_PRODUCTS.filter((p) =>
          p.cat.toLowerCase().includes(trendTab.toLowerCase()),
        );
  const trendPages = Math.ceil(trendFiltered.length / 5);
  const trendVisible = trendFiltered.slice(trendPage * 5, trendPage * 5 + 5);

  // Popular visible window (5 per page)
  const popFiltered =
    popTab === "Semua"
      ? POPULAR_PRODUCTS
      : POPULAR_PRODUCTS.filter((p) =>
          p.cat.toLowerCase().includes(popTab.toLowerCase()),
        );
  const popPages = Math.ceil(popFiltered.length / 5);
  const popVisible = popFiltered.slice(popPage * 5, popPage * 5 + 5);

  return (
    <div className="w-full bg-gray-50 min-h-screen font-sans">
      {/* ── LOADING STATE ── */}
      {isLoadingProducts && (
        <div className="w-full flex items-center justify-center py-4">
          <div className="flex items-center gap-2">
            <div className="animate-spin w-5 h-5 border-2 border-[#1B4D3E] border-t-transparent rounded-full" />
            <p className="text-xs font-semibold text-[#1B4D3E]">
              Memuat produk...
            </p>
          </div>
        </div>
      )}
      {/* ── SECONDARY NAVIGATION BAR — FLOATING ── */}
      <div className="w-full bg-transparent sticky top-13 z-40 pt-1.5 pb-0.5">
        <div className="max-w-360 mx-auto px-6">
          <div className="bg-[#1B4D3E] rounded-2xl shadow-lg shadow-[#1B4D3E]/30 flex items-center gap-3 h-12 px-5">
            {/* Paling kiri: tombol "≡ Semua Kategori" */}
            <button
              onClick={() => goToKatalog && goToKatalog("Semua Produk")}
              className="flex items-center gap-2 bg-[#2D6A4F] text-white font-bold text-xs px-4 py-2 rounded-full whitespace-nowrap hover:bg-[#163D30] transition-all shrink-0 cursor-pointer"
            >
              <span className="text-base leading-none">≡</span> Semua Kategori
            </button>

            {/* Divider */}
            <div className="w-px h-5 bg-white/20 shrink-0" />

            {/* Tengah: deretan link navigasi cepat */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1">
              {[
                { label: "Pestisida", cat: "Pestisida" },
                { label: "Pupuk & Nutrisi", cat: "Pupuk" },
                { label: "Paket Bundle", cat: "Bundle" },
                { label: "Benih", cat: "Benih" },
                { label: "Pengendali Hayati", cat: "Hayati" },
              ].map(({ label, cat }) => (
                <button
                  key={label}
                  onClick={() => goToKatalog && goToKatalog(cat)}
                  className="text-white/75 hover:text-white text-xs font-semibold whitespace-nowrap px-3 py-1.5 rounded-full hover:bg-white/10 transition-all cursor-pointer"
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="w-px h-5 bg-white/20 shrink-0" />

            {/* Paling kanan: search bar kecil */}
            <div className="relative shrink-0">
              <input
                type="text"
                placeholder="Cari produk..."
                className="bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-full px-4 py-1.5 text-xs w-36 md:w-44 focus:outline-none focus:border-(--color-lime) focus:bg-white/15 transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                <Search size={14} className="stroke-[2.5]" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1 — HERO BANNER (3-COLUMN LAYOUT)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-360 mx-auto px-6 pt-3 pb-2">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-stretch">
          {/* ── COLUMN LEFT (50% / 2-cols on lg) ── */}
          <div className="lg:col-span-2 relative rounded-2xl overflow-hidden shadow-md flex flex-col justify-between p-6 md:p-8 min-h-85 group">
            {/* Background Image */}
            <img
              src={heroShield2}
              alt="Diagnosis Lahan"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 z-0"
            />
            {/* Overlay gradient — bottom heavy untuk teks */}
            <div className="absolute inset-0 bg-linear-to-t from-[#0d2918]/95 via-[#0d2918]/60 to-transparent z-0" />

            <div className="absolute top-5 left-6 z-20">
              <span className="bg-(--color-lime) text-(--color-forest-dark) text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Diagnosis Gratis
              </span>
            </div>

            <div className="relative z-10 flex flex-col justify-between h-full w-full sm:w-[75%] md:w-[70%] lg:w-[65%] pr-4 gap-y-6">
              <div className="pt-8">
                <h1 className="font-display font-black text-white text-2xl lg:text-3xl leading-[1.1] mb-2">
                  Tidak Tahu Harus
                  <br />
                  Beli Apa?
                  <br />
                  <span className="text-(--color-lime)">
                    Ceritakan Masalah Lahanmu.
                  </span>
                </h1>
                <p className="text-white/80 text-xs md:text-sm leading-relaxed max-w-sm mt-2">
                  Chatbot AI kami diagnosis masalah lahan dan rekomendasikan
                  produk yang tepat.
                </p>
              </div>

              <div className="pb-4 mt-auto">
                <div className="flex gap-2.5 flex-wrap items-center">
                  <button
                    onClick={() => setIsChatbotOpen(true)}
                    className="bg-(--color-lime) text-(--color-forest-dark) font-black text-xs px-5 py-2.5 rounded-full hover:brightness-110 transition-all flex items-center justify-center cursor-pointer"
                  >
                    Mulai Diagnosis →
                  </button>
                  <button
                    className="bg-white/10 backdrop-blur border border-white/30 text-white font-bold text-xs px-5 py-2.5 rounded-full hover:bg-white/20 transition-all flex items-center justify-center cursor-pointer"
                    onClick={() => goToKatalog && goToKatalog("Semua Produk")}
                  >
                    Lihat Katalog
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── COLUMN MIDDLE (25% / 1-col on lg) ── */}
          <div className="flex flex-col gap-5 h-full">
            {/* Top Card */}
            <div className="flex-1 relative rounded-2xl bg-(--color-forest) overflow-hidden shadow-md border border-white/10 flex flex-col justify-between group min-h-41 transition-colors p-4">
              <div className="relative z-10 flex flex-col justify-between h-full w-full">
                <div>
                  <span className="inline-block bg-(--color-lime) text-(--color-forest-dark) text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Proteksi Padi
                  </span>
                </div>
                <div className="mt-4">
                  <h4 className="font-bold text-white text-sm leading-snug line-clamp-1">
                    Fungisida Tricyclazole
                  </h4>
                  <div className="flex items-center justify-between mt-1">
                    <div>
                      <p className="text-white/60 text-[9px] leading-none mb-0.5">
                        Hanya
                      </p>
                      <p className="font-black text-(--color-lime) text-base leading-none">
                        Rp 75.000
                      </p>
                    </div>
                    <button className="bg-(--color-orange) hover:bg-(--color-orange-dark) text-white font-bold text-[10px] px-3.5 py-1.5 rounded-full transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer">
                      Beli Sekarang
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Card */}
            <div className="flex-1 relative rounded-2xl bg-(--color-forest) overflow-hidden shadow-md border border-white/10 flex flex-col justify-between group min-h-41 transition-colors p-4">
              <div className="relative z-10 flex flex-col justify-between h-full w-full">
                <div>
                  <span className="inline-block bg-(--color-lime) text-(--color-forest-dark) text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Nutrisi Tanaman
                  </span>
                </div>
                <div className="mt-4">
                  <h4 className="font-bold text-white text-sm leading-snug line-clamp-1">
                    Pupuk NPK Mutiara
                  </h4>
                  <div className="flex items-center justify-between mt-1">
                    <div>
                      <p className="text-white/60 text-[9px] leading-none mb-0.5">
                        Hanya
                      </p>
                      <p className="font-black text-(--color-lime) text-base leading-none">
                        Rp 55.000
                      </p>
                    </div>
                    <button className="bg-(--color-orange) hover:bg-(--color-orange-dark) text-white font-bold text-[10px] px-3.5 py-1.5 rounded-full transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer">
                      Beli Sekarang
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── COLUMN RIGHT (25% / 1-col on lg) ── */}
          <div className="relative rounded-2xl bg-(--color-forest-dark) p-4 overflow-hidden shadow-md border border-(--color-lime)/20 flex flex-col justify-between group min-h-85 transition-colors">
            <div className="relative z-10 flex flex-col justify-between h-full w-full">
              <div>
                <p className="text-[10px] text-(--color-lime) font-bold uppercase tracking-wider mb-1">
                  Solusi Cabai Sehat
                </p>
                <h3 className="font-display font-extrabold text-white text-lg leading-snug">
                  Paket Antraknosa
                  <br />
                  Cabai Lebat
                </h3>
              </div>
              <div>
                <p className="text-white/60 text-[9px] leading-none mb-0.5">
                  Hanya
                </p>
                <p className="font-black text-(--color-lime) text-2xl leading-none mb-3">
                  Rp 175.000
                </p>
                <button className="bg-(--color-lime) text-(--color-forest-dark) font-black text-xs px-5 py-2 rounded-full transition-all hover:brightness-110 hover:scale-105 active:scale-95 cursor-pointer">
                  Beli Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2 — CATEGORY ROW
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-360 mx-auto px-6 py-5">
        <div className="flex items-center gap-3">
          {/* Left Navigation Arrow */}
          <button className="w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center text-gray-500 hover:text-(--color-forest) transition-all hover:scale-105 shrink-0 border border-gray-100/80">
            <ChevronLeft size={18} />
          </button>

          {/* 8 equal-width cards */}
          <div className="flex items-stretch justify-between flex-1 gap-3 overflow-hidden">
            {CATEGORY_CIRCLES.map((cat) => (
              <div
                key={cat.id}
                className="flex-1 flex flex-col items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group min-w-0"
              >
                {/* Circle with lime tint background and cropped image */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-(--color-lime)/20 overflow-hidden flex items-center justify-center mb-2 shrink-0">
                  <img
                    src={cat.img}
                    alt={cat.label}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                {/* Bold text-sm Category Name below circle */}
                <p className="font-bold text-gray-800 text-xs sm:text-sm text-center leading-tight group-hover:text-(--color-forest) transition-colors mt-1 w-full truncate">
                  {cat.label}
                </p>
                {/* Product Count below name */}
                <p className="text-gray-400 text-[10px] sm:text-xs mt-1 text-center leading-none">
                  {cat.count} Produk
                </p>
              </div>
            ))}
          </div>

          {/* Right Navigation Arrow */}
          <button className="w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center text-gray-500 hover:text-(--color-forest) transition-all hover:scale-105 shrink-0 border border-gray-100/80">
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 3 — FEATURED PRODUCTS (4-COLUMN LAYOUT)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-360 mx-auto px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 items-stretch">
          {/* COLUMN 1: Best Selling (25% / col-span-1) */}
          <div className="lg:col-span-1 relative bg-white rounded-2xl border border-(--color-lime)/30 shadow-sm p-4 flex flex-col justify-between h-full group">
            {/* Header within card */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-display font-extrabold text-gray-900 text-base leading-tight">
                  Best Selling
                </h3>
                <div className="h-0.5 w-6 bg-(--color-forest) rounded-full mt-1.5" />
              </div>
              {/* Wishlist button */}
              <button className="text-gray-300 hover:text-(--color-orange) transition-colors">
                <Heart size={14} className="fill-current" />
              </button>
            </div>

            <span className="text-[11px] text-gray-400 font-medium mt-3 block self-start">
              Bundle
            </span>

            {/* Foto produk besar di tengah card dengan background putih bersih */}
            <div className="h-40 w-full bg-white flex items-center justify-center p-2 relative overflow-hidden my-3">
              <img
                src={FEATURED_PRODUCT.image}
                alt={FEATURED_PRODUCT.name}
                className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Countdown timer di bawah foto */}
            <FeaturedCountdown endDate={FEATURED_PRODUCT.endDate} />

            {/* Dua opsi ukuran/varian sebagai pill kecil di bawah timer */}
            <div className="flex justify-center gap-1.5 mb-3 shrink-0">
              <span className="text-[10px] font-semibold text-(--color-forest) bg-(--color-lime)/20 px-2.5 py-0.5 rounded-full">
                210ml
              </span>
              <span className="text-[10px] font-semibold text-gray-400 border border-gray-200 px-2.5 py-0.5 rounded-full">
                500gm
              </span>
            </div>

            {/* Price, Discount & Rating */}
            <div className="mt-auto">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-extrabold text-(--color-orange) text-base">
                  {FEATURED_PRODUCT.priceMin} - {FEATURED_PRODUCT.priceMax}
                </span>
                <span className="bg-(--color-orange)/10 text-(--color-orange) font-black text-[9px] px-1.5 py-0.5 rounded">
                  -{FEATURED_PRODUCT.discount}%
                </span>
              </div>

              {/* Rating bintang + jumlah review */}
              <div className="flex items-center gap-1 mb-1">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={10}
                      className={
                        s <= Math.round(FEATURED_PRODUCT.rating)
                          ? "fill-(--color-orange) text-(--color-orange)"
                          : "fill-gray-200 text-gray-200"
                      }
                    />
                  ))}
                </div>
                <span className="text-[10px] text-gray-400">
                  ({FEATURED_PRODUCT.reviews})
                </span>
              </div>

              {/* Nama produk 2 baris text-sm di bawah rating */}
              <h3 className="font-semibold text-gray-800 text-xs sm:text-sm leading-snug line-clamp-2">
                {FEATURED_PRODUCT.name}
              </h3>
            </div>
          </div>

          {/* COLUMN 2, 3, 4 (75% / col-span-3) */}
          <div className="lg:col-span-3 flex flex-col h-full">
            {/* Header section dengan judul + garis hijau + See More */}
            <div className="flex items-center justify-between mb-4 border-b border-gray-200/50 pb-2 shrink-0">
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-gray-900 text-lg">
                  Featured Products
                </h2>
                <div className="h-0.5 w-6 bg-(--color-forest) rounded-full mt-1.5" />
              </div>
              <button className="text-gray-400 hover:text-(--color-forest) font-bold text-xs hover:underline flex items-center gap-1 border border-gray-200 rounded-xl px-2.5 py-1 bg-white shadow-xs">
                See More <ChevronRight size={12} className="mt-0.5" />
              </button>
            </div>

            {/* Grid 3 kolom untuk Columns 2, 3, 4 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch flex-1">
              {/* Column 2: 3 Stacked Horizontal Cards */}
              <div className="flex flex-col gap-3 h-full">
                <div className="flex-1">
                  <FeaturedProductCard prod={gridProducts[0]} />
                </div>
                <div className="flex-1">
                  <FeaturedProductCard prod={gridProducts[1]} />
                </div>
                <div className="flex-1">
                  <FeaturedProductCard
                    prod={gridProducts[4] ?? gridProducts[0]}
                  />
                </div>
              </div>

              {/* Column 3: 1 Tall Vertical Card */}
              <div className="h-full">
                <FeaturedMiddleCard />
              </div>

              {/* Column 4: 3 Stacked Horizontal Cards */}
              <div className="flex flex-col gap-3 h-full">
                <div className="flex-1">
                  <FeaturedProductCard
                    prod={gridProducts[2] ?? gridProducts[0]}
                  />
                </div>
                <div className="flex-1">
                  <FeaturedProductCard
                    prod={gridProducts[3] ?? gridProducts[0]}
                  />
                </div>
                <div className="flex-1">
                  <FeaturedProductCard
                    prod={gridProducts[5] ?? gridProducts[0]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 4 — TRIPLE PROMO BANNER
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-360 mx-auto px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Promo A — green */}
          <div className="relative bg-linear-to-br from-(--color-forest-dark) to-(--color-forest) rounded-2xl overflow-hidden flex items-end p-5 min-h-40 shadow-lg group">
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #fff 1px, transparent 1px)",
                backgroundSize: "14px 14px",
              }}
            />
            <div className="absolute -right-4 -bottom-2 w-36 h-36 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl rotate-6 group-hover:rotate-3 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=250"
                alt="p"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10 flex-1 pr-28">
              <p className="text-(--color-lime) text-[10px] font-bold uppercase tracking-wider mb-1">
                Paket Terlaris
              </p>
              <h3 className="font-display font-black text-white text-lg leading-tight mb-1">
                Paket Blast Padi Pro
              </h3>
              <p className="font-black text-(--color-lime) text-xl">
                Rp 185.000
              </p>
              <button className="mt-3 bg-(--color-lime) text-(--color-forest-dark) font-black text-xs px-4 py-1.5 rounded-full hover:brightness-110 transition-colors shadow-md">
                Shop Now →
              </button>
            </div>
          </div>

          {/* Promo B — amber/orange */}
          <div className="relative bg-linear-to-br from-(--color-orange-dark) to-(--color-orange) rounded-2xl overflow-hidden flex items-end p-5 min-h-40 shadow-lg group">
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #fff 1px, transparent 1px)",
                backgroundSize: "14px 14px",
              }}
            />
            <div className="absolute -right-4 -bottom-2 w-36 h-36 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl rotate-6 group-hover:rotate-3 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=250"
                alt="p"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10 flex-1 pr-28">
              <p className="text-white/80 text-[10px] font-bold uppercase tracking-wider mb-1">
                Nutrisi Terbaik
              </p>
              <h3 className="font-display font-black text-white text-lg leading-tight mb-1">
                Pupuk NPK Mutiara
              </h3>
              <p className="font-black text-white text-xl">Rp 55.000</p>
              <button className="mt-3 bg-white text-(--color-orange-dark) font-bold text-xs px-4 py-1.5 rounded-full hover:bg-orange-50 transition-colors shadow-md">
                Shop Now →
              </button>
            </div>
          </div>

          {/* Promo C — dark forest */}
          <div className="relative bg-linear-to-br from-(--color-forest) to-(--color-forest-dark) rounded-2xl overflow-hidden flex items-end p-5 min-h-40 shadow-lg group">
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #fff 1px, transparent 1px)",
                backgroundSize: "14px 14px",
              }}
            />
            <div className="absolute -right-4 -bottom-2 w-36 h-36 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl rotate-6 group-hover:rotate-3 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1574226516831-e1dff420e562?auto=format&fit=crop&q=80&w=250"
                alt="p"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10 flex-1 pr-28">
              <p className="text-(--color-lime) text-[10px] font-bold uppercase tracking-wider mb-1">
                Akuakultur
              </p>
              <h3 className="font-display font-black text-white text-lg leading-tight mb-1">
                Probiotik Udang Super
              </h3>
              <p className="font-black text-(--color-lime) text-xl">
                Rp 95.000
              </p>
              <button className="mt-3 bg-(--color-lime) text-(--color-forest-dark) font-black text-xs px-4 py-1.5 rounded-full hover:brightness-110 transition-colors shadow-md">
                Shop Now →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 5 — TRENDING PRODUCTS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-360 mx-auto px-6 pb-6">
        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2.5 flex-wrap gap-3">
          <div className="relative">
            <h2 className="font-display font-extrabold text-gray-900 text-lg">
              Produk Trending
            </h2>
            <div className="absolute -bottom-2.75 left-0 h-0.75 w-12 bg-(--color-orange) rounded-full" />
          </div>

          <div className="flex items-center gap-3">
            {/* Filter pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {TREND_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setTrendTab(tab);
                    setTrendPage(0);
                  }}
                  className={`text-[11px] font-bold px-3.5 py-1.5 rounded-full border transition-all ${
                    trendTab === tab
                      ? "bg-[#1B4D3E] text-white border-[#1B4D3E] shadow-sm"
                      : "bg-white text-gray-500 border-gray-200 hover:border-[#1B4D3E] hover:text-[#1B4D3E]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Navigation arrows */}
            <div className="flex items-center gap-1 border-l border-gray-200 pl-3">
              <button
                onClick={() => setTrendPage((p) => Math.max(0, p - 1))}
                disabled={trendPage === 0}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#1B4D3E] hover:border-[#1B4D3E] disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all bg-white shadow-sm"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() =>
                  setTrendPage((p) => Math.min(trendPages - 1, p + 1))
                }
                disabled={trendPage >= trendPages - 1}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#1B4D3E] hover:border-[#1B4D3E] disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all bg-white shadow-sm"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* 6-column grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-stretch">
          {/* Card 1: Featured Card */}
          <div className="relative bg-linear-to-b from-(--color-forest) to-(--color-forest-dark) rounded-2xl p-5 flex flex-col justify-between overflow-hidden shadow-sm h-full group min-h-80 lg:col-span-1">
            <div className="z-10">
              <span className="text-white font-black text-lg leading-tight uppercase tracking-wider block">
                Proteksi Terbaik
              </span>
              <div className="bg-(--color-lime) text-(--color-forest-dark) font-black text-[9px] px-3 py-1 rounded-full uppercase w-fit mt-2 shadow-sm">
                100% Organik
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[58%] overflow-hidden flex items-end justify-center">
              <img
                src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=300"
                alt="Petani Agrou"
                className="w-full h-full object-cover object-top select-none pointer-events-none origin-bottom group-hover:scale-105 transition-transform duration-500"
                style={{
                  maskImage:
                    "linear-gradient(to top, black 85%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to top, black 85%, transparent 100%)",
                }}
              />
            </div>
          </div>

          {/* Cards 2-6: Product Cards (5 cards) */}
          <AnimatePresence mode="wait">
            {trendVisible.map((prod, i) => (
              <motion.div
                key={prod.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                className="lg:col-span-1 h-full"
              >
                <TrendingProductCard prod={prod} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 6 — FULL WIDTH PROMO BANNER
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-360 mx-auto px-6 pb-6">
        <div className="relative rounded-2xl overflow-hidden shadow-xl min-h-35 flex items-center">
          {/* Background image */}
          <img
            src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=1400"
            alt="Lahan"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-[#1B4D3E]/90 via-[#1B4D3E]/75 to-transparent" />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-between w-full px-10 py-8">
            <div>
              <p className="text-[#74C69D] text-xs font-bold uppercase tracking-widest mb-1">
                Promo Harian Agrou
              </p>
              <h2 className="font-black text-white text-2xl lg:text-3xl leading-tight mb-1">
                Paket Bundle Terbaik
                <br />
                <span className="text-[#F59E0B]">Minggu Ini!</span>
              </h2>
              <p className="text-white/70 text-sm">
                Gabungkan pestisida + pupuk + benih dalam satu paket hemat.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-6">
              {/* Discount badge */}
              <div className="relative w-24 h-24 flex flex-col items-center justify-center text-center shrink-0">
                <div
                  className="absolute inset-0 rounded-full border-4 border-dashed border-[#F59E0B]/60 animate-spin"
                  style={{ animationDuration: "8s" }}
                />
                <div className="absolute inset-2 rounded-full bg-[#F59E0B] shadow-lg" />
                <div className="relative z-10 flex flex-col items-center leading-none">
                  <span className="text-white text-[10px] font-bold">
                    Hemat
                  </span>
                  <span className="text-white font-black text-2xl leading-none">
                    15%
                  </span>
                  <span className="text-white/80 text-[9px] font-bold">
                    Bundle
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsChatbotOpen(true)}
                className="bg-white text-[#1B4D3E] font-black px-6 py-3 rounded-xl shadow-xl hover:bg-[#F0FFF4] transition-colors text-sm"
              >
                Diagnosis Gratis →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 7 — POPULAR PRODUCTS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-360 mx-auto px-6 pb-6">
        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2.5 flex-wrap gap-3">
          <div className="relative">
            <h2 className="font-display font-extrabold text-gray-900 text-lg">
              Produk Populer
            </h2>
            <div className="absolute -bottom-2.75 left-0 h-0.75 w-12 bg-(--color-orange) rounded-full" />
          </div>

          <div className="flex items-center gap-3">
            {/* Filter pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {POP_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setPopTab(tab);
                    setPopPage(0);
                  }}
                  className={`text-[11px] font-bold px-3.5 py-1.5 rounded-full border transition-all ${
                    popTab === tab
                      ? "bg-[#1B4D3E] text-white border-[#1B4D3E] shadow-sm"
                      : "bg-white text-gray-500 border-gray-200 hover:border-[#1B4D3E] hover:text-[#1B4D3E]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Navigation arrows */}
            <div className="flex items-center gap-1 border-l border-gray-200 pl-3">
              <button
                onClick={() => setPopPage((p) => Math.max(0, p - 1))}
                disabled={popPage === 0}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#1B4D3E] hover:border-[#1B4D3E] disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all bg-white shadow-sm"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPopPage((p) => Math.min(popPages - 1, p + 1))}
                disabled={popPage >= popPages - 1}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#1B4D3E] hover:border-[#1B4D3E] disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all bg-white shadow-sm"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* 6-column grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-stretch">
          {/* Card 1: Featured Card (Orange style) */}
          <div className="relative bg-linear-to-b from-(--color-orange) to-(--color-orange-dark) rounded-2xl p-5 flex flex-col justify-between overflow-hidden shadow-sm h-full group min-h-80 lg:col-span-1">
            <div className="z-10">
              <span className="text-white font-black text-lg leading-tight uppercase tracking-wider block">
                Nutrisi Unggulan
              </span>
              <div className="bg-(--color-forest-dark) text-white font-black text-[9px] px-3 py-1 rounded-full uppercase w-fit mt-2 shadow-sm">
                Rekomendasi Ahli
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[58%] overflow-hidden flex items-end justify-center">
              <img
                src="https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?auto=format&fit=crop&q=80&w=300"
                alt="Petani Pilihan Ahli"
                className="w-full h-full object-cover object-top select-none pointer-events-none origin-bottom group-hover:scale-105 transition-transform duration-500"
                style={{
                  maskImage:
                    "linear-gradient(to top, black 85%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to top, black 85%, transparent 100%)",
                }}
              />
            </div>
          </div>

          {/* Cards 2-6: Product Cards (5 cards) */}
          <AnimatePresence mode="wait">
            {popVisible.map((prod, i) => (
              <motion.div
                key={prod.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                className="lg:col-span-1 h-full"
              >
                <TrendingProductCard prod={prod} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 8 — WIDE PROMO BANNER
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-360 mx-auto px-6 pb-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex items-center justify-between gap-6 px-8 py-6">
          <div className="flex-1 min-w-0">
            <p className="text-(--color-forest) text-[10px] font-bold uppercase tracking-widest mb-1">
              ✨ Penawaran Spesial
            </p>
            <h3 className="font-display font-black text-gray-900 text-xl lg:text-2xl leading-tight mb-2">
              Koleksi Terbaru Produk
              <br />
              <span className="text-(--color-forest)">
                Organik & Hayati
              </span>
            </h3>
            <p className="text-gray-500 text-sm max-w-xs">
              Solusi pertanian ramah lingkungan untuk lahan yang lebih sehat dan
              produktif.
            </p>
          </div>
          <div className="text-center shrink-0">
            <p className="text-gray-400 text-xs font-medium">Harga Mulai</p>
            <p className="font-black text-(--color-forest) text-4xl leading-none">
              Rp 45.000
            </p>
            <button className="mt-3 bg-(--color-lime) text-(--color-forest-dark) font-black text-sm px-6 py-2.5 rounded-full hover:brightness-110 transition-colors shadow-lg shadow-(--color-forest)/20">
              Belanja Sekarang →
            </button>
          </div>
          <div className="hidden lg:block w-45 h-30 rounded-2xl overflow-hidden shrink-0">
            <img
              src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=400"
              alt="Organik"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 9 — TOP RATED + BEST SELLING SPLIT
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-360 mx-auto px-6 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-stretch">
          {/* LEFT: Top Rated grid (col-span-3) */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            {/* Header row */}
            <div className="flex items-center justify-between mb-4 border-b border-gray-200/50 pb-2">
              <div className="flex items-center gap-3">
                <h2 className="font-display font-extrabold text-gray-900 text-lg">
                  Top Rated Products
                </h2>
                <div className="h-0.5 w-8 bg-(--color-forest) rounded-full mt-1" />
              </div>
              <button className="text-gray-400 border border-gray-200 rounded-xl px-2.5 py-1 bg-white text-xs hover:underline flex items-center gap-1 shadow-xs hover:text-(--color-forest) transition-colors">
                See More <ChevronRight size={12} className="mt-0.5" />
              </button>
            </div>

            {/* Grid 4 columns matching the layout exactly */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 items-stretch flex-1">
              {/* Column 1: Tall Featured Product Card */}
              <div className="h-full">
                <TallProductCard prod={TOP_RATED_PRODUCTS[0]} />
              </div>

              {/* Column 2: Stacked 2 cards */}
              <div className="flex flex-col gap-3 h-full">
                <StandardGridCard prod={TOP_RATED_PRODUCTS[1]} />
                <StandardGridCard prod={TOP_RATED_PRODUCTS[2]} />
              </div>

              {/* Column 3: Stacked 2 cards */}
              <div className="flex flex-col gap-3 h-full">
                <StandardGridCard prod={TOP_RATED_PRODUCTS[3]} />
                <StandardGridCard prod={TOP_RATED_PRODUCTS[4]} />
              </div>

              {/* Column 4: Stacked 2 cards */}
              <div className="flex flex-col gap-3 h-full">
                <StandardGridCard prod={TOP_RATED_PRODUCTS[5]} />
                <StandardGridCard prod={TOP_RATED_PRODUCTS[6]} />
              </div>
            </div>
          </div>

          {/* RIGHT: Best Selling (col-span-1) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 h-full flex flex-col justify-between">
              <div>
                <h3 className="font-display font-extrabold text-gray-900 text-base leading-tight">
                  Best Selling
                </h3>
                <div className="h-0.5 w-6 bg-(--color-forest) rounded-full mt-1.5 mb-4" />

                <div className="flex flex-col gap-4">
                  {BEST_SELLING_LIST.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 py-1 hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      {/* Square image container with rounded-xl and border */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center p-1.5 shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Info on the right */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-(--color-forest) text-xs sm:text-sm">
                            {formatRp(item.price)}
                          </span>
                          <span className="text-gray-400 text-[10px] line-through">
                            {formatRp(Math.round(item.price * 1.25))}
                          </span>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={10}
                              className={
                                s <= Math.round(item.rating)
                                  ? "fill-(--color-orange) text-(--color-orange)"
                                  : "fill-gray-200 text-gray-200"
                              }
                            />
                          ))}
                        </div>

                        {/* Product Title */}
                        <p className="font-semibold text-gray-800 text-[11px] leading-tight mt-1 line-clamp-2 group-hover:text-(--color-forest) transition-colors">
                          {item.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FLOATING CHATBOT BUTTON
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-10 right-10 z-50 group">
        <div className="absolute inset-0 bg-[#74C69D] rounded-full animate-ping opacity-50" />
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="relative bg-[#1B4D3E] hover:bg-[#163D30] text-white p-5 rounded-full shadow-2xl transition-transform hover:scale-110 flex items-center justify-center border-4 border-white"
        >
          <MessageSquare size={26} className="fill-white/20" />
        </button>
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-[#1B4D3E] text-white text-xs font-bold py-2 px-3.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none shadow-xl">
          Diagnosis Lahan AI
          <div className="absolute -right-1.25 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#1B4D3E] rotate-45" />
        </div>
      </div>

      <AnimatePresence>
        {isChatbotOpen && (
          <DiagnosisChatbot
            isOpen={isChatbotOpen}
            onClose={() => setIsChatbotOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
