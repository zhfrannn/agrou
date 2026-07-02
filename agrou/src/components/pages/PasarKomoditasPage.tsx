import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  BadgeCheck,
  MapPin,
  Building2,
  Package,
  Search,
  Star,
  Truck,
} from "lucide-react";

// ─── TYPES ────────────────────────────────────────────────────────────────

type Commodity = {
  id: number;
  name: string;
  koperasi: string;
  location: string;
  price: number;
  unit: string;
  stock: string;
  minOrder: string;
  tag: string;
  category: string;
  verified: boolean;
  image: string;
  rating?: number;
};

type Filters = {
  koperasi: string[];
  verified: boolean;
  stokAda: boolean;
  minPrice: string;
  maxPrice: string;
  provinsi: string[];
  rating: string; // "4", "3", or "" (empty = semua)
  pengiriman: string[]; // ["Gratis Ongkir", "Same Day", "Ekspedisi"]
};

// ─── DATA ────────────────────────────────────────────────────────────────

const PRODUCTS: Commodity[] = [
  {
    id: 1,
    name: "Kopi Arabika Gayo Grade 1",
    koperasi: "Koperasi Tani Maju Gayo",
    location: "Bener Meriah, Aceh",
    price: 85000,
    unit: "/ kg",
    stock: "320 kg",
    minOrder: "5 kg",
    tag: "☕ Kopi",
    category: "kopi",
    verified: true,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    name: "Ikan Asin Jambal Roti",
    koperasi: "Koperasi Nelayan Sejahtera",
    location: "Demak, Jateng",
    price: 120000,
    unit: "/ kg",
    stock: "45 kg",
    minOrder: "1 kg",
    tag: "🐟 Hasil Laut",
    category: "ikan",
    verified: true,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    name: "Beras Merah Organik Premium",
    koperasi: "KUD Subur Makmur",
    location: "Cianjur, Jabar",
    price: 24000,
    unit: "/ kg",
    stock: "1.2 Ton",
    minOrder: "10 kg",
    tag: "🌾 Padi",
    category: "padi",
    verified: true,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    name: "Udang Kering (Ebi) Super",
    koperasi: "Koperasi Bahari Jaya",
    location: "Sidoarjo, Jatim",
    price: 150000,
    unit: "/ kg",
    stock: "80 kg",
    minOrder: "2 kg",
    tag: "🦐 Udang",
    category: "udang",
    verified: false,
    rating: 4.2,
    image:
      "https://images.unsplash.com/photo-1621852004158-f3bc188ace2d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 5,
    name: "Rumput Laut Kering Grade A",
    koperasi: "KUD Samudra Hijau",
    location: "Nusa Penida, Bali",
    price: 35000,
    unit: "/ kg",
    stock: "500 kg",
    minOrder: "5 kg",
    tag: "🌿 Rempah",
    category: "rempah",
    verified: true,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 6,
    name: "Garam Laut Kusamba Asli",
    koperasi: "Koperasi Garam Kusamba",
    location: "Klungkung, Bali",
    price: 18000,
    unit: "/ kg",
    stock: "250 kg",
    minOrder: "10 kg",
    tag: "🍯 Olahan",
    category: "olahan",
    verified: true,
    rating: 4.3,
    image:
      "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 7,
    name: "Madu Hutan Liar Sumbawa",
    koperasi: "Koperasi Wanabakti",
    location: "Sumbawa, NTB",
    price: 145000,
    unit: "/ botol",
    stock: "120 botol",
    minOrder: "2 botol",
    tag: "🍯 Olahan",
    category: "olahan",
    verified: true,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1587049352847-4d4b1ed74dc4?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 8,
    name: "Kopi Bubuk Robusta Lereng Kelud",
    koperasi: "KUD Lereng Kelud",
    location: "Kediri, Jatim",
    price: 65000,
    unit: "/ kg",
    stock: "180 kg",
    minOrder: "3 kg",
    tag: "☕ Kopi",
    category: "kopi",
    verified: false,
    rating: 4.1,
    image:
      "https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 9,
    name: "Beras Pandan Wangi Premium",
    koperasi: "KUD Subur Makmur",
    location: "Cianjur, Jabar",
    price: 28000,
    unit: "/ kg",
    stock: "850 kg",
    minOrder: "10 kg",
    tag: "🌾 Padi",
    category: "padi",
    verified: true,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 10,
    name: "Cumi Segar Kupas Super",
    koperasi: "Koperasi Nelayan Sejahtera",
    location: "Demak, Jateng",
    price: 95000,
    unit: "/ kg",
    stock: "150 kg",
    minOrder: "2 kg",
    tag: "🐟 Hasil Laut",
    category: "ikan",
    verified: true,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1534062590479-79a0cf833215?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 11,
    name: "Bayam Organik Segar",
    koperasi: "KUD Subur Makmur",
    location: "Cianjur, Jabar",
    price: 12000,
    unit: "/ ikat",
    stock: "90 ikat",
    minOrder: "5 ikat",
    tag: "🥬 Sayuran",
    category: "sayur",
    verified: true,
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1628186100298-b8058204b7b6?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 12,
    name: "Cabai Rawit Merah Gembong",
    koperasi: "KUD Subur Makmur",
    location: "Cianjur, Jabar",
    price: 45000,
    unit: "/ kg",
    stock: "110 kg",
    minOrder: "2 kg",
    tag: "🥬 Sayuran",
    category: "sayur",
    verified: false,
    rating: 3.9,
    image:
      "https://images.unsplash.com/photo-1592982537447-6f29fb443831?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 13,
    name: "Teh Hitam Gunung Dempo",
    koperasi: "Koperasi Wanabakti",
    location: "Sumbawa, NTB",
    price: 32000,
    unit: "/ kotak",
    stock: "400 kotak",
    minOrder: "5 kotak",
    tag: "🍯 Olahan",
    category: "olahan",
    verified: true,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1587049352847-4d4b1ed74dc4?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 14,
    name: "Udang Vaname Premium Size 50",
    koperasi: "Koperasi Bahari Jaya",
    location: "Sidoarjo, Jatim",
    price: 110000,
    unit: "/ kg",
    stock: "230 kg",
    minOrder: "5 kg",
    tag: "🦐 Udang",
    category: "udang",
    verified: true,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1621852004158-f3bc188ace2d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 15,
    name: "Jagung Manis Hibrida F1",
    koperasi: "KUD Subur Makmur",
    location: "Cianjur, Jabar",
    price: 8000,
    unit: "/ kg",
    stock: "600 kg",
    minOrder: "5 kg",
    tag: "🌽 Jagung",
    category: "jagung",
    verified: true,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 16,
    name: "Kedelai Lokal Grobogan",
    koperasi: "Koperasi Tani Grobogan",
    location: "Grobogan, Jateng",
    price: 15000,
    unit: "/ kg",
    stock: "900 kg",
    minOrder: "10 kg",
    tag: "🫘 Kedelai",
    category: "kedelai",
    verified: true,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1574316945476-82d5e20abf84?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 17,
    name: "Mangga Gedong Gincu Super",
    koperasi: "KUD Indramayu Jaya",
    location: "Indramayu, Jabar",
    price: 35000,
    unit: "/ kg",
    stock: "400 kg",
    minOrder: "3 kg",
    tag: "🍊 Buah",
    category: "buah",
    verified: true,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 18,
    name: "Pisang Cavendish Export Grade",
    koperasi: "Koperasi Buah Nusantara",
    location: "Lampung",
    price: 22000,
    unit: "/ sisir",
    stock: "300 sisir",
    minOrder: "10 sisir",
    tag: "🍊 Buah",
    category: "buah",
    verified: false,
    rating: 4.0,
    image:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 19,
    name: "Jahe Merah Kering",
    koperasi: "Koperasi Herbal Merapi",
    location: "Magelang, Jateng",
    price: 55000,
    unit: "/ kg",
    stock: "280 kg",
    minOrder: "2 kg",
    tag: "🌿 Rempah",
    category: "rempah",
    verified: true,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 20,
    name: "Jagung Pipilan Kering",
    koperasi: "KUD Lereng Kelud",
    location: "Kediri, Jatim",
    price: 6500,
    unit: "/ kg",
    stock: "1.5 Ton",
    minOrder: "10 kg",
    tag: "🌽 Jagung",
    category: "jagung",
    verified: true,
    rating: 4.3,
    image:
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&q=80&w=800",
  },
];

const CATEGORY_TABS = [
  { id: "semua", emoji: "", label: "Semua" },
  { id: "padi", emoji: "🌾", label: "Padi" },
  { id: "jagung", emoji: "🌽", label: "Jagung" },
  { id: "kedelai", emoji: "🫘", label: "Kedelai" },
  { id: "kopi", emoji: "☕", label: "Kopi" },
  { id: "sayur", emoji: "🥬", label: "Sayuran" },
  { id: "buah", emoji: "🍊", label: "Buah" },
  { id: "ikan", emoji: "🐟", label: "Hasil Laut" },
  { id: "udang", emoji: "🦐", label: "Udang" },
  { id: "rempah", emoji: "🌿", label: "Rempah" },
  { id: "olahan", emoji: "🍯", label: "Olahan" },
];

const PROVINSI_LIST = [
  "Aceh",
  "Jawa Barat",
  "Jawa Timur",
  "Jawa Tengah",
  "Bali",
  "NTB",
  "Lampung",
];

const SORT_OPTIONS = [
  "Populer",
  "Terbaru",
  "Stok Terbanyak",
  "Harga ↑",
  "Harga ↓",
];

const CAT_COLORS: Record<string, string> = {
  padi: "bg-amber-100 text-amber-800",
  jagung: "bg-yellow-100 text-yellow-800",
  kedelai: "bg-lime-100 text-lime-800",
  sayur: "bg-green-100 text-green-800",
  buah: "bg-orange-100 text-orange-800",
  rempah: "bg-emerald-100 text-emerald-700",
  ikan: "bg-blue-100 text-blue-800",
  udang: "bg-pink-100 text-pink-800",
  kopi: "bg-stone-100 text-stone-800",
  olahan: "bg-purple-100 text-purple-800",
};

const ITEMS_PER_PAGE = 12;

// ─── UTILS ────────────────────────────────────────────────────────────────

function formatRp(n: number): string {
  return "Rp\u00a0" + n.toLocaleString("id-ID");
}

function getProvince(location: string): string {
  const l = location.toLowerCase();
  if (l.includes("aceh")) return "Aceh";
  if (
    l.includes("jabar") ||
    l.includes("jawa barat") ||
    l.includes("indramayu") ||
    l.includes("cianjur")
  )
    return "Jawa Barat";
  if (
    l.includes("jatim") ||
    l.includes("jawa timur") ||
    l.includes("sidoarjo") ||
    l.includes("kediri")
  )
    return "Jawa Timur";
  if (
    l.includes("jateng") ||
    l.includes("jawa tengah") ||
    l.includes("demak") ||
    l.includes("grobogan") ||
    l.includes("magelang")
  )
    return "Jawa Tengah";
  if (
    l.includes("bali") ||
    l.includes("klungkung") ||
    l.includes("nusa penida")
  )
    return "Bali";
  if (l.includes("ntb") || l.includes("sumbawa")) return "NTB";
  if (l.includes("lampung")) return "Lampung";
  return "";
}

// ─── SUB-COMPONENTS ─────────────────────────────────────────────────────

type FilterPanelProps = {
  filters: Filters;
  onChange: (f: Filters) => void;
  onReset: () => void;
  allKoperasi: string[];
};

function FilterPanel({
  filters,
  onChange,
  onReset,
  allKoperasi,
}: FilterPanelProps) {
  function toggleArr<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
  }

  return (
    <div className="space-y-6">
      {/* Reset */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-[#1B4D3E] text-sm">Filter</span>
        <button
          onClick={onReset}
          className="text-xs text-gray-400 hover:text-[#F77F00] transition-colors flex items-center gap-1"
        >
          <X size={12} /> Reset
        </button>
      </div>

      {/* Kategori */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Kategori
        </p>
        <div className="space-y-1">
          {CATEGORY_TABS.map((tab) => (
            <label
              key={tab.id}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="category-filter"
                checked={
                  filters.koperasi.length === 0 && tab.id === "semua"
                    ? true
                    : false
                }
                className="accent-[#1B4D3E]"
                onChange={() => onChange({ ...filters, koperasi: [] })}
              />
              <span className="text-sm text-gray-700 group-hover:text-[#1B4D3E] transition-colors">
                {tab.emoji} {tab.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Koperasi */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Koperasi
        </p>
        <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
          {allKoperasi.map((kop) => (
            <label
              key={kop}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.koperasi.includes(kop)}
                onChange={() =>
                  onChange({
                    ...filters,
                    koperasi: toggleArr(filters.koperasi, kop),
                  })
                }
                className="accent-[#1B4D3E] rounded"
              />
              <span className="text-xs text-gray-700 group-hover:text-[#1B4D3E] transition-colors leading-tight">
                {kop}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Status */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Status
        </p>
        <label className="flex items-center gap-2 cursor-pointer mb-1">
          <input
            type="checkbox"
            checked={filters.verified}
            onChange={() =>
              onChange({ ...filters, verified: !filters.verified })
            }
            className="accent-[#1B4D3E] rounded"
          />
          <span className="text-sm text-gray-700">Terverifikasi</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.stokAda}
            onChange={() => onChange({ ...filters, stokAda: !filters.stokAda })}
            className="accent-[#1B4D3E] rounded"
          />
          <span className="text-sm text-gray-700">Stok Tersedia</span>
        </label>
      </div>

      {/* Rentang Harga */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Rentang Harga
        </p>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#1B4D3E]"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#1B4D3E]"
          />
        </div>
      </div>

      {/* Provinsi */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Lokasi / Provinsi
        </p>
        <div className="space-y-1">
          {PROVINSI_LIST.map((prov) => (
            <label
              key={prov}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.provinsi.includes(prov)}
                onChange={() =>
                  onChange({
                    ...filters,
                    provinsi: toggleArr(filters.provinsi, prov),
                  })
                }
                className="accent-[#1B4D3E] rounded"
              />
              <span className="text-xs text-gray-700 group-hover:text-[#1B4D3E] transition-colors">
                {prov}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Rating
        </p>
        <div className="space-y-1">
          {[
            { val: "4", label: "4★ ke atas" },
            { val: "3", label: "3★ ke atas" },
          ].map((r) => (
            <label
              key={r.val}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="rating-filter"
                checked={filters.rating === r.val}
                onChange={() => onChange({ ...filters, rating: r.val })}
                className="accent-[#1B4D3E]"
              />
              <span className="flex items-center gap-1 text-xs text-gray-700 group-hover:text-[#1B4D3E] transition-colors">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={10}
                    className={
                      s <= Number(r.val)
                        ? "fill-[#F59E0B] text-[#F59E0B]"
                        : "fill-gray-200 text-gray-200"
                    }
                  />
                ))}
                <span className="ml-0.5">{r.label}</span>
              </span>
            </label>
          ))}
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="rating-filter"
              checked={filters.rating === ""}
              onChange={() => onChange({ ...filters, rating: "" })}
              className="accent-[#1B4D3E]"
            />
            <span className="text-xs text-gray-700 group-hover:text-[#1B4D3E] transition-colors">
              Semua Rating
            </span>
          </label>
        </div>
      </div>

      {/* Pengiriman */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Pengiriman
        </p>
        <div className="space-y-1">
          {["Gratis Ongkir", "Same Day", "Ekspedisi"].map((item) => (
            <label
              key={item}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.pengiriman.includes(item)}
                onChange={() =>
                  onChange({
                    ...filters,
                    pengiriman: toggleArr(filters.pengiriman, item),
                  })
                }
                className="accent-[#1B4D3E] rounded"
              />
              <span className="text-xs text-gray-700 group-hover:text-[#1B4D3E] transition-colors">
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- CommodityCard ---

function CommodityCard({
  item,
}: {
  item: Commodity;
  key?: string | number | null;
}) {
  const colorCls = CAT_COLORS[item.category] ?? "bg-gray-100 text-gray-700";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Category tag */}
        <span
          className={`absolute top-1.5 left-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${colorCls}`}
        >
          {item.tag}
        </span>
        {/* Verified badge */}
        {item.verified && (
          <span className="absolute top-1.5 right-1.5 bg-white/90 rounded-full p-0.5">
            <BadgeCheck size={13} className="text-[#1B4D3E]" />
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-2.5 flex flex-col flex-1 gap-1">
        <h3 className="font-semibold text-gray-900 text-[11px] leading-snug line-clamp-2">
          {item.name}
        </h3>

        {item.rating && (
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={9}
                className={
                  s <= Math.round(item.rating!)
                    ? "fill-[#F59E0B] text-[#F59E0B]"
                    : "fill-gray-200 text-gray-200"
                }
              />
            ))}
            <span className="text-[10px] text-gray-400 ml-0.5">
              {item.rating}
            </span>
          </div>
        )}

        <div className="flex items-center gap-1 text-gray-400 text-[10px]">
          <Building2 size={10} className="shrink-0" />
          <span className="truncate">{item.koperasi}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-[10px]">
          <MapPin size={10} className="shrink-0" />
          <span className="truncate">{item.location}</span>
        </div>

        <div className="mt-auto pt-1.5 border-t border-gray-100">
          <div className="flex items-baseline gap-0.5">
            <span className="font-bold text-[#1B4D3E] text-xs">
              {formatRp(item.price)}
            </span>
            <span className="text-[10px] text-gray-400">{item.unit}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
              <Package size={9} /> {item.stock}
            </span>
            <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
              <Truck size={9} /> Min. {item.minOrder}
            </span>
          </div>
        </div>

        <button
          className="mt-1.5 w-full border border-[#1B4D3E] text-[#1B4D3E] text-[10px] font-semibold py-1.5 rounded-lg hover:bg-[#1B4D3E] hover:text-white transition-colors duration-200"
          onClick={() => alert(`Hubungi: ${item.koperasi}`)}
        >
          Hubungi Koperasi
        </button>
      </div>
    </motion.div>
  );
}

// --- MAIN PAGE ---

const DEFAULT_FILTERS: Filters = {
  koperasi: [],
  verified: false,
  stokAda: false,
  minPrice: "",
  maxPrice: "",
  provinsi: [],
  rating: "",
  pengiriman: [],
};

export default function PasarKomoditasPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("kategori") ?? "semua";

  const [sort, setSort] = useState("Populer");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const allKoperasi = useMemo(
    () => Array.from(new Set(PRODUCTS.map((p) => p.koperasi))).sort(),
    [],
  );

  function handleCategoryChange(id: string) {
    const next = new URLSearchParams(searchParams);
    if (id === "semua") next.delete("kategori");
    else next.set("kategori", id);
    setSearchParams(next);
    setPage(1);
  }

  function handleFiltersChange(f: Filters) {
    setFilters(f);
    setPage(1);
  }

  function handleReset() {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }

  const filtered = useMemo(() => {
    let items = PRODUCTS;

    // category
    if (activeCategory !== "semua") {
      items = items.filter((p) => p.category === activeCategory);
    }

    // search
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.koperasi.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q),
      );
    }

    // koperasi filter
    if (filters.koperasi.length > 0) {
      items = items.filter((p) => filters.koperasi.includes(p.koperasi));
    }

    // verified
    if (filters.verified) {
      items = items.filter((p) => p.verified);
    }

    // provinsi
    if (filters.provinsi.length > 0) {
      items = items.filter((p) =>
        filters.provinsi.includes(getProvince(p.location)),
      );
    }

    // price range
    const minP = filters.minPrice ? Number(filters.minPrice) : 0;
    const maxP = filters.maxPrice ? Number(filters.maxPrice) : Infinity;
    items = items.filter((p) => p.price >= minP && p.price <= maxP);

    // rating filter
    if (filters.rating) {
      const minRating = Number(filters.rating);
      items = items.filter((p) => (p.rating ?? 0) >= minRating);
    }

    // sort
    const sorted = [...items];
    if (sort === "Harga \u2191") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "Harga \u2193") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "Stok Terbanyak") {
      sorted.sort((a, b) => {
        const numA = parseFloat(a.stock);
        const numB = parseFloat(b.stock);
        return numB - numA;
      });
    }
    // Populer / Terbaru keep original order (or reverse for Terbaru)
    else if (sort === "Terbaru") sorted.sort((a, b) => b.id - a.id);

    return sorted;
  }, [activeCategory, search, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  // Stats
  const totalKoperasi = new Set(PRODUCTS.map((p) => p.koperasi)).size;
  const totalProvinsi = new Set(
    PRODUCTS.map((p) => getProvince(p.location)).filter(Boolean),
  ).size;

  return (
    <div className="min-h-screen bg-(--color-cream)">
      {/* ── HERO BANNER ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0d2918 0%, #1a3d2e 50%, #c75f00 200%)", minHeight: "320px" }}>
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #f77f00 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #b3cc04 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-green-300/70 mb-5 font-medium">
              <span>Beranda</span><span>/</span><span>Marketplace</span><span>/</span><span style={{ color: "#f77f00" }}>Agrou Pasar</span>
            </div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs text-green-200 font-semibold mb-4">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#f77f00" }} />
                  Pasar Komoditas Koperasi Tani Indonesia
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Agrou <span style={{ color: "#f77f00" }}>Pasar</span>
                </h1>
                <p className="text-green-200 text-base leading-relaxed mb-6 max-w-lg">
                  Beli komoditas pangan langsung dari koperasi desa terpercaya. Harga petani, kualitas ekspor, transparansi penuh.
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {["🌾", "☕", "🐟", "🥬"].map((e, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-sm">{e}</div>
                    ))}
                  </div>
                  <span className="text-xs text-green-200">+{totalKoperasi} koperasi aktif bergabung</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 shrink-0">
                {[
                  { label: "Total Produk", value: PRODUCTS.length },
                  { label: "Koperasi", value: totalKoperasi },
                  { label: "Provinsi", value: totalProvinsi },
                ].map((s) => (
                  <div key={s.label} className="text-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-4">
                    <p className="text-3xl font-black text-white">{s.value}</p>
                    <p className="text-xs text-green-300 mt-1 font-medium">{s.label}</p>
                  </div>
                ))}
                <div className="col-span-3 border rounded-2xl px-4 py-3 flex items-center gap-3" style={{ backgroundColor: "rgba(247,127,0,0.15)", borderColor: "rgba(247,127,0,0.3)" }}>
                  <span className="text-2xl">♻️</span>
                  <div>
                    <p className="text-xs font-bold" style={{ color: "#f77f00" }}>Ekonomi Limbah Sirkuler</p>
                    <p className="text-[11px] text-green-300">Sisa panen jadi peluang produktif</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── LIMBAH SIRKULER ──────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-[#1a3d2e] to-[#2d6a4f] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                <span className="text-2xl">♻️</span>
                <h2 className="text-white font-bold text-xl">
                  Ekonomi Limbah Sirkuler
                </h2>
              </div>
              <p className="text-green-200 text-sm max-w-lg">
                Sisa panen? Jangan buang — jual atau tukar jadi input produktif
                bagi petani lain. Agrou menghubungkan limbah pertanian menjadi
                peluang.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex gap-1.5">
                {[
                  { emoji: "🌾", label: "Jerami Padi" },
                  { emoji: "🌽", label: "Tongkol Jagung" },
                  { emoji: "🍃", label: "Daun Kering" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-white/10 rounded-lg px-2 py-1.5 text-center border border-white/20"
                  >
                    <div className="text-sm mb-0.5">{item.emoji}</div>
                    <p className="text-[9px] text-green-200 font-medium whitespace-nowrap">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
              <button className="bg-(--color-lime) hover:bg-(--color-lime-dark) text-[#1a3d2e] font-bold text-xs px-5 py-2.5 rounded-full transition-all shrink-0 cursor-pointer">
                Jual Limbah →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORY TABS ────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleCategoryChange(tab.id)}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === tab.id
                  ? "bg-(--color-orange) text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {tab.emoji && <span>{tab.emoji}</span>}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN LAYOUT ──────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* ── SIDEBAR (desktop) ── */}
          <aside className="hidden lg:block w-[220px] shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-[70px]">
              <FilterPanel
                filters={filters}
                onChange={handleFiltersChange}
                onReset={handleReset}
                allKoperasi={allKoperasi}
              />
            </div>
          </aside>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex-1 min-w-0">
            {/* Sort bar + search + mobile filter toggle */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {/* Mobile filter button */}
              <button
                className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 shadow-sm"
                onClick={() => setSidebarOpen(true)}
              >
                <Filter size={15} /> Filter
              </button>

              {/* Search */}
              <div className="flex-1 min-w-[180px] relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Cari komoditas atau koperasi..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4D3E] bg-white"
                />
              </div>

              {/* Sort pills */}
              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSort(opt);
                      setPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${sort === opt
                      ? "bg-[#F97316] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {/* Result count */}
              <span className="text-sm text-gray-400 ml-auto">
                {filtered.length} produk
              </span>
            </div>

            {/* Product Grid */}
            <AnimatePresence mode="popLayout">
              {paginated.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-24 text-gray-400"
                >
                  <Package size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">
                    Komoditas tidak ditemukan
                  </p>
                  <p className="text-sm mt-1">
                    Coba ubah filter atau kata kunci pencarian
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3"
                >
                  {paginated.map((item) => (
                    <CommodityCard key={item.id} item={item} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Halaman sebelumnya"
                >
                  <ChevronLeft size={18} />
                </button>

                <span className="text-sm text-gray-600 font-medium">
                  Halaman {page} dari {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Halaman berikutnya"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl overflow-y-auto p-6 lg:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="font-bold text-[#1B4D3E] text-lg">Filter</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Tutup filter"
                >
                  <X size={20} />
                </button>
              </div>
              <FilterPanel
                filters={filters}
                onChange={handleFiltersChange}
                onReset={handleReset}
                allKoperasi={allKoperasi}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
