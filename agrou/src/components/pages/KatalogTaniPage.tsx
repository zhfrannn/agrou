import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  BadgeCheck,
  Star,
  Store,
  Search,
  ShoppingCart,
} from "lucide-react";

// --- TYPES ---

type TaniProduct = {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount: number;
  unit: string;
  weight: string;
  rating: number;
  sold: string;
  tag: string;
  verified: boolean;
  image: string;
};

type Filters = {
  brand: string[];
  verified: boolean;
  minPrice: string;
  maxPrice: string;
  rating: string;
  pengiriman: string[];
};

// --- DATA ---

const PRODUCTS: TaniProduct[] = [
  {
    id: 1,
    name: "Fungisida Tricyclazole 75WP",
    brand: "Syngenta",
    category: "pestisida",
    price: 75000,
    originalPrice: 92000,
    discount: 18,
    unit: "/250gr",
    weight: "250gr",
    rating: 4.8,
    sold: "1.2rb",
    tag: "Pestisida",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 2,
    name: "Pupuk NPK Mutiara 16-16-16",
    brand: "Yaramila",
    category: "pupuk",
    price: 55000,
    originalPrice: 70000,
    discount: 21,
    unit: "/kg",
    weight: "1kg",
    rating: 4.6,
    sold: "3.4rb",
    tag: "Pupuk",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 3,
    name: "Probiotik EM4 Pertanian 1L",
    brand: "Songgolangit",
    category: "probiotik",
    price: 28000,
    originalPrice: undefined,
    discount: 0,
    unit: "/botol",
    weight: "1L",
    rating: 4.7,
    sold: "5.1rb",
    tag: "Probiotik",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1574226516831-e1dff420e562?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 4,
    name: "Benih Padi Ciherang 5kg",
    brand: "Balitbangtan",
    category: "benih",
    price: 115000,
    originalPrice: 135000,
    discount: 15,
    unit: "/5kg",
    weight: "5kg",
    rating: 4.8,
    sold: "2.8rb",
    tag: "Benih",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 5,
    name: "Beauveria Bassiana 100g",
    brand: "BioAgri",
    category: "hayati",
    price: 62000,
    originalPrice: 80000,
    discount: 22,
    unit: "/100gr",
    weight: "100gr",
    rating: 4.5,
    sold: "870",
    tag: "Hayati",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1628186100298-b8058204b7b6?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 6,
    name: "Insektisida Klorantraniliprol 200SC",
    brand: "DuPont",
    category: "pestisida",
    price: 88000,
    originalPrice: 108000,
    discount: 19,
    unit: "/100ml",
    weight: "100ml",
    rating: 4.7,
    sold: "1.5rb",
    tag: "Pestisida",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 7,
    name: "Pupuk Kalium KCL Premium",
    brand: "Petrokimia",
    category: "pupuk",
    price: 48000,
    originalPrice: undefined,
    discount: 0,
    unit: "/kg",
    weight: "1kg",
    rating: 4.4,
    sold: "2.1rb",
    tag: "Pupuk",
    verified: false,
    image:
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 8,
    name: "Benih Cabai Rawit HOT 10g",
    brand: "Known You Seed",
    category: "benih",
    price: 38000,
    originalPrice: 48000,
    discount: 21,
    unit: "/sachet",
    weight: "10gr",
    rating: 4.5,
    sold: "1.9rb",
    tag: "Benih",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1592982537447-6f29fb443831?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 9,
    name: "Hormon Auksin Rootone-F",
    brand: "Bayer",
    category: "hormon",
    price: 32000,
    originalPrice: undefined,
    discount: 0,
    unit: "/50gr",
    weight: "50gr",
    rating: 4.3,
    sold: "650",
    tag: "Hormon",
    verified: false,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 10,
    name: "Perangkap Lalat Buah Massal",
    brand: "AgroTrap",
    category: "perangkap",
    price: 45000,
    originalPrice: 55000,
    discount: 18,
    unit: "/set",
    weight: "-",
    rating: 4.2,
    sold: "430",
    tag: "Perangkap",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 11,
    name: "Paket Solusi Blast Padi Pro",
    brand: "Syngenta",
    category: "bundle",
    price: 185000,
    originalPrice: 230000,
    discount: 20,
    unit: "/paket",
    weight: "-",
    rating: 4.8,
    sold: "1.1rb",
    tag: "Bundle",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 12,
    name: "Pupuk Organik Cair Hantu",
    brand: "NASA",
    category: "pupuk",
    price: 35000,
    originalPrice: undefined,
    discount: 0,
    unit: "/500ml",
    weight: "500ml",
    rating: 4.6,
    sold: "4.2rb",
    tag: "Pupuk",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 13,
    name: "Herbisida Gramoxone 276SL",
    brand: "Syngenta",
    category: "pestisida",
    price: 65000,
    originalPrice: 78000,
    discount: 17,
    unit: "/250ml",
    weight: "250ml",
    rating: 4.5,
    sold: "2.3rb",
    tag: "Pestisida",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 14,
    name: "Trichoderma Granul 500g",
    brand: "BioAgri",
    category: "hayati",
    price: 72000,
    originalPrice: 90000,
    discount: 20,
    unit: "/500gr",
    weight: "500gr",
    rating: 4.6,
    sold: "780",
    tag: "Hayati",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1628186100298-b8058204b7b6?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 15,
    name: "Benih Tomat Servo F1",
    brand: "Known You Seed",
    category: "benih",
    price: 42000,
    originalPrice: undefined,
    discount: 0,
    unit: "/10gr",
    weight: "10gr",
    rating: 4.7,
    sold: "1.4rb",
    tag: "Benih",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1592982537447-6f29fb443831?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 16,
    name: "Pupuk TSP Super Fosfat",
    brand: "Petrokimia",
    category: "pupuk",
    price: 42000,
    originalPrice: undefined,
    discount: 0,
    unit: "/kg",
    weight: "1kg",
    rating: 4.3,
    sold: "1.8rb",
    tag: "Pupuk",
    verified: false,
    image:
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 17,
    name: "Probiotik Ternak EM Plus",
    brand: "Songgolangit",
    category: "probiotik",
    price: 45000,
    originalPrice: 58000,
    discount: 22,
    unit: "/1L",
    weight: "1L",
    rating: 4.8,
    sold: "920",
    tag: "Probiotik",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1574226516831-e1dff420e562?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 18,
    name: "ZPT Gibberellin GA3 10g",
    brand: "Bayer",
    category: "hormon",
    price: 55000,
    originalPrice: 65000,
    discount: 15,
    unit: "/10gr",
    weight: "10gr",
    rating: 4.4,
    sold: "340",
    tag: "Hormon",
    verified: false,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 19,
    name: "Paket Wereng Batang Coklat",
    brand: "DuPont",
    category: "bundle",
    price: 210000,
    originalPrice: 262000,
    discount: 20,
    unit: "/paket",
    weight: "-",
    rating: 4.7,
    sold: "650",
    tag: "Bundle",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 20,
    name: "Pupuk Urea Granul 1kg",
    brand: "Petrokimia",
    category: "pupuk",
    price: 22000,
    originalPrice: undefined,
    discount: 0,
    unit: "/kg",
    weight: "1kg",
    rating: 4.5,
    sold: "6.1rb",
    tag: "Pupuk",
    verified: true,
    image:
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=400",
  },
];

const CATEGORY_TABS = [
  { id: "semua", emoji: "", label: "Semua" },
  { id: "pestisida", emoji: "🧪", label: "Pestisida" },
  { id: "pupuk", emoji: "🌿", label: "Pupuk" },
  { id: "benih", emoji: "🌱", label: "Benih" },
  { id: "probiotik", emoji: "🦠", label: "Probiotik" },
  { id: "hayati", emoji: "🍃", label: "Hayati" },
  { id: "hormon", emoji: "⚗️", label: "Hormon & ZPT" },
  { id: "perangkap", emoji: "🪤", label: "Perangkap" },
  { id: "bundle", emoji: "📦", label: "Bundle" },
];

const CAT_COLORS: Record<string, string> = {
  pestisida: "bg-red-100 text-red-800",
  pupuk: "bg-green-100 text-green-800",
  benih: "bg-lime-100 text-lime-800",
  probiotik: "bg-teal-100 text-teal-800",
  hayati: "bg-emerald-100 text-emerald-700",
  hormon: "bg-violet-100 text-violet-800",
  perangkap: "bg-yellow-100 text-yellow-800",
  bundle: "bg-orange-100 text-orange-800",
};

const SORT_OPTIONS = ["Populer", "Terbaru", "Terlaris", "Harga ↑", "Harga ↓"];
const ITEMS_PER_PAGE = 12;

// --- UTILS ---

function formatRp(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

function parseSold(s: string): number {
  if (s.endsWith("rb")) return parseFloat(s) * 1000;
  return parseFloat(s);
}

// --- FILTER PANEL ---

type FilterPanelProps = {
  filters: Filters;
  onChange: (f: Filters) => void;
  onReset: () => void;
  allBrands: string[];
};

function FilterPanel({
  filters,
  onChange,
  onReset,
  allBrands,
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
                name="cat-filter"
                checked={
                  filters.brand.length === 0 && tab.id === "semua"
                    ? true
                    : false
                }
                className="accent-[#1B4D3E]"
                onChange={() => onChange({ ...filters, brand: [] })}
              />
              <span className="text-sm text-gray-700 group-hover:text-[#1B4D3E] transition-colors">
                {tab.emoji} {tab.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Brand
        </p>
        <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
          {allBrands.map((b) => (
            <label
              key={b}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.brand.includes(b)}
                onChange={() =>
                  onChange({ ...filters, brand: toggleArr(filters.brand, b) })
                }
                className="accent-[#1B4D3E] rounded"
              />
              <span className="text-xs text-gray-700 group-hover:text-[#1B4D3E] transition-colors leading-tight">
                {b}
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
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.verified}
            onChange={(e) =>
              onChange({ ...filters, verified: e.target.checked })
            }
            className="accent-[#1B4D3E] rounded"
          />
          <span className="text-xs text-gray-700 group-hover:text-[#1B4D3E] transition-colors">
            Terverifikasi
          </span>
        </label>
      </div>

      {/* Harga */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Rentang Harga
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#1B4D3E]"
          />
          <span className="text-gray-400 text-xs">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#1B4D3E]"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Rating
        </p>
        <div className="space-y-1">
          {[
            { val: "4", label: "4" },
            { val: "3", label: "3" },
            { val: "", label: "Semua Rating" },
          ].map(({ val, label }) => (
            <label
              key={val}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="rating-filter"
                checked={filters.rating === val}
                className="accent-[#1B4D3E]"
                onChange={() => onChange({ ...filters, rating: val })}
              />
              <span className="flex items-center gap-0.5 text-xs text-gray-700 group-hover:text-[#1B4D3E] transition-colors">
                {val && (
                  <>
                    <Star size={10} className="fill-[#F59E0B] text-[#F59E0B]" />
                    <span>{val}★ ke atas</span>
                  </>
                )}
                {!val && <span>{label}</span>}
              </span>
            </label>
          ))}
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

// --- PRODUCT CARD ---

function TaniProductCard({ item }: { item: TaniProduct }) {
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
        <span
          className={`absolute top-1.5 left-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${colorCls}`}
        >
          {item.tag}
        </span>
        {item.discount > 0 && (
          <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            -{item.discount}%
          </span>
        )}
        {item.verified && (
          <span className="absolute bottom-1.5 left-1.5 bg-white/90 rounded-full p-0.5">
            <BadgeCheck size={13} className="text-[#1B4D3E]" />
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-2.5 flex flex-col flex-1 gap-1">
        <h3 className="font-semibold text-gray-900 text-[11px] leading-snug line-clamp-2">
          {item.name}
        </h3>
        <div className="flex items-center gap-1 text-gray-400 text-[10px]">
          <Store size={10} className="shrink-0" />
          <span className="truncate">{item.brand}</span>
        </div>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={9}
              className={
                s <= Math.round(item.rating)
                  ? "fill-[#F59E0B] text-[#F59E0B]"
                  : "fill-gray-200 text-gray-200"
              }
            />
          ))}
          <span className="text-[10px] text-gray-400 ml-0.5">
            {item.rating}
          </span>
          <span className="text-[10px] text-gray-400 ml-1">
            {item.sold} terjual
          </span>
        </div>
        <div className="mt-auto pt-1.5 border-t border-gray-100">
          <div className="flex items-baseline gap-0.5">
            <span className="font-bold text-[#1B4D3E] text-xs">
              {formatRp(item.price)}
            </span>
            <span className="text-[10px] text-gray-400">{item.unit}</span>
          </div>
          {item.originalPrice && (
            <span className="text-[10px] text-gray-400 line-through">
              {formatRp(item.originalPrice)}
            </span>
          )}
          <button className="mt-1.5 w-full flex items-center justify-center gap-1 border border-[#1B4D3E] text-[#1B4D3E] text-[10px] font-semibold py-1.5 rounded-lg hover:bg-[#1B4D3E] hover:text-white transition-colors">
            <ShoppingCart size={10} /> Tambah ke Keranjang
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// --- MAIN PAGE ---

const DEFAULT_FILTERS: Filters = {
  brand: [],
  verified: false,
  minPrice: "",
  maxPrice: "",
  rating: "",
  pengiriman: [],
};

// Normalize incoming kategori param (handles legacy values from Header/TaniPage)
function normalizeCategory(raw: string | null): string {
  if (!raw) return "semua";
  const lower = raw.toLowerCase().trim();
  if (lower === "semua produk" || lower === "semua") return "semua";
  // Map display labels to tab ids
  const map: Record<string, string> = {
    "pupuk & nutrisi": "pupuk",
    "paket bundle": "bundle",
  };
  return map[lower] ?? lower;
}

export default function KatalogTaniPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = normalizeCategory(searchParams.get("kategori"));
  const [sort, setSort] = useState("Populer");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const allBrands = useMemo(
    () => Array.from(new Set(PRODUCTS.map((p) => p.brand))).sort(),
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
    if (activeCategory !== "semua")
      items = items.filter((p) => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q),
      );
    }
    if (filters.brand.length > 0)
      items = items.filter((p) => filters.brand.includes(p.brand));
    if (filters.verified) items = items.filter((p) => p.verified);
    const minP = filters.minPrice ? Number(filters.minPrice) : 0;
    const maxP = filters.maxPrice ? Number(filters.maxPrice) : Infinity;
    items = items.filter((p) => p.price >= minP && p.price <= maxP);
    if (filters.rating) {
      const minRating = Number(filters.rating);
      items = items.filter((p) => p.rating >= minRating);
    }
    const sorted = [...items];
    if (sort === "Harga ↑") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "Harga ↓") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "Terbaru") sorted.sort((a, b) => b.id - a.id);
    else if (sort === "Terlaris")
      sorted.sort((a, b) => parseSold(b.sold) - parseSold(a.sold));
    return sorted;
  }, [activeCategory, search, filters, sort]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const stats = [
    { value: String(PRODUCTS.length), label: "Total Produk" },
    { value: String(CATEGORY_TABS.length - 1), label: "Kategori" },
    {
      value: String(new Set(PRODUCTS.map((p) => p.brand)).size),
      label: "Brand",
    },
  ];

  return (
    <div className="min-h-screen bg-(--color-cream)">
      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0d2918 0%, #1a3d2e 50%, #2d6a4f 100%)", minHeight: "320px" }}>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #b3cc04 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #f77f00 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />
        {/* Background image overlay */}
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=1600" alt="" className="w-full h-full object-cover opacity-10" />
        </div>
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-green-300/70 mb-5 font-medium">
              <span>Beranda</span><span>/</span><span>Marketplace</span><span>/</span><span className="text-[#b3cc04]">Agrou Tani</span>
            </div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs text-green-200 font-semibold mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b3cc04] animate-pulse" />
                  Marketplace Sarana Produksi Pertanian
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Agrou <span style={{ color: "#b3cc04" }}>Tani</span>
                </h1>
                <p className="text-green-200 text-base leading-relaxed mb-6 max-w-lg">
                  Temukan pupuk, pestisida, benih unggul & produk pertanian terverifikasi langsung dari distributor resmi. Harga transparan, pengiriman terjamin.
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {["🌾", "🌿", "🧪", "🌱"].map((e, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-sm">{e}</div>
                    ))}
                  </div>
                  <span className="text-xs text-green-200">+500 petani aktif berbelanja</span>
                </div>
              </div>

              {/* Stats cards */}
              <div className="grid grid-cols-3 gap-3 shrink-0">
                {stats.map((s) => (
                  <div key={s.label} className="text-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-4">
                    <p className="text-3xl font-black text-white">{s.value}</p>
                    <p className="text-xs text-green-300 mt-1 font-medium">{s.label}</p>
                  </div>
                ))}
                <div className="col-span-3 bg-[#b3cc04]/20 border border-[#b3cc04]/30 rounded-2xl px-4 py-3 flex items-center gap-3">
                  <span className="text-2xl">🤖</span>
                  <div>
                    <p className="text-xs font-bold text-[#b3cc04]">Chatbot Diagnosis Hama Gratis</p>
                    <p className="text-[11px] text-green-300">Tanya Gro-AI untuk rekomendasi produk</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="bg-white border-b border-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {[
              { icon: "✅", text: "Produk Terverifikasi" },
              { icon: "🚚", text: "Pengiriman ke Seluruh Indonesia" },
              { icon: "🔒", text: "Transaksi Aman" },
              { icon: "♻️", text: "Program Daur Ulang Kemasan" },
              { icon: "📞", text: "Konsultasi Agronomi Gratis" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY TABS */}
      <section className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleCategoryChange(tab.id)}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === tab.id ? "bg-(--color-orange) text-white shadow" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {tab.emoji && <span>{tab.emoji}</span>}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* SIDEBAR desktop */}
          <aside className="hidden lg:block w-[220px] shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-[70px]">
              <FilterPanel
                filters={filters}
                onChange={handleFiltersChange}
                onReset={handleReset}
                allBrands={allBrands}
              />
            </div>
          </aside>

          {/* RIGHT COLUMN */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <button
                className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 shadow-sm"
                onClick={() => setSidebarOpen(true)}
              >
                <Filter size={15} /> Filter
              </button>
              <div className="flex-1 min-w-[180px] relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Cari produk atau brand..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4D3E] bg-white"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSort(opt);
                      setPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${sort === opt ? "bg-[#F97316] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <span className="text-sm text-gray-400 ml-auto">
                {filtered.length} produk
              </span>
            </div>

            {/* Product grid */}
            {paginated.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg font-medium">Produk tidak ditemukan</p>
                <p className="text-sm mt-1">
                  Coba ubah filter atau kata kunci pencarian
                </p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                  {paginated.map((item) => (
                    <TaniProductCard key={item.id} item={item} />
                  ))}
                </div>
              </AnimatePresence>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Halaman sebelumnya"
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${page === n ? "bg-[#1B4D3E] text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                    >
                      {n}
                    </button>
                  ),
                )}
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

      {/* Mobile drawer */}
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
                allBrands={allBrands}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
