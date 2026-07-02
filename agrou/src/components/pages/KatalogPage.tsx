import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSearchParams } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  ChevronDown,
  Bot,
} from "lucide-react";
import { useProducts } from "../../lib/queries/products";
import { ProductCardSkeleton } from "../ui/LoadingSkeleton";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";
import DiagnosisChatbot from "./DiagnosisChatbot";

// ─── TYPES ─────────────────────────────────────────────────────────────────

// Local product shape for display
type DisplayProduct = {
  id: string;
  name: string;
  cat: string;
  price: number;
  originalPrice?: number;
  discount: number;
  rating: number;
  sold: string;
  image: string;
  komoditas: string[];
  tipe: string[];
};

// Maps UI display label → DB enum value
const CAT_TO_DB: Record<string, string> = {
  "Semua Produk": "",
  Padi: "padi",
  Jagung: "jagung",
  Kedelai: "kedelai",
  Sayuran: "sayuran",
  Buah: "buah",
  Perkebunan: "perkebunan",
  Peternakan: "peternakan",
  Perikanan: "perikanan",
  Lainnya: "lainnya",
};

// Maps DB enum value → UI display label
const DB_TO_LABEL: Record<string, string> = {
  padi: "Padi",
  jagung: "Jagung",
  kedelai: "Kedelai",
  sayuran: "Sayuran",
  buah: "Buah",
  perkebunan: "Perkebunan",
  peternakan: "Peternakan",
  perikanan: "Perikanan",
  lainnya: "Lainnya",
};

function dbToDisplay(p: any): DisplayProduct {
  const originalPrice = p.original_price ? Number(p.original_price) : undefined;
  const price = Number(p.price);
  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;
  return {
    id: String(p.id),
    name: p.name,
    cat: DB_TO_LABEL[p.category] ?? "Lainnya",
    price,
    originalPrice,
    discount,
    rating: p.rating ? Number(p.rating) : 4.5,
    sold: p.sold_count ? String(p.sold_count) : "0",
    image:
      p.images?.[0] ??
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=400",
    komoditas: p.tags ?? [],
    tipe: [],
  };
}

// ─── DATA ──────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Semua Produk",
  "Padi",
  "Jagung",
  "Kedelai",
  "Sayuran",
  "Buah",
  "Perkebunan",
  "Peternakan",
  "Perikanan",
  "Lainnya",
];

const CAT_COLORS: Record<string, string> = {
  Padi: "bg-amber-100 text-amber-800",
  Jagung: "bg-yellow-100 text-yellow-800",
  Kedelai: "bg-lime-100 text-lime-800",
  Sayuran: "bg-green-100 text-green-800",
  Buah: "bg-orange-100 text-orange-800",
  Perkebunan: "bg-emerald-100 text-emerald-700",
  Peternakan: "bg-brown-100 text-stone-700",
  Perikanan: "bg-blue-100 text-blue-800",
  Lainnya: "bg-gray-100 text-gray-700",
};

const SORT_OPTIONS = ["Populer", "Terbaru", "Terlaris", "Harga ↑", "Harga ↓"];

const STATIC_PRODUCTS: DisplayProduct[] = [
  {
    id: "s1",
    name: "Benih Padi Ciherang 5kg",
    cat: "Padi",
    price: 45000,
    originalPrice: 55000,
    discount: 18,
    rating: 4.8,
    sold: "2.1rb",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400",
    komoditas: ["padi"],
    tipe: ["benih"],
  },
  {
    id: "s2",
    name: "Pupuk Urea Granul 50kg",
    cat: "Padi",
    price: 115000,
    originalPrice: 130000,
    discount: 12,
    rating: 4.7,
    sold: "1.5rb",
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=400",
    komoditas: ["padi", "jagung"],
    tipe: ["pupuk"],
  },
  {
    id: "s3",
    name: "Benih Jagung Hibrida Pioneer 1kg",
    cat: "Jagung",
    price: 85000,
    originalPrice: 95000,
    discount: 11,
    rating: 4.9,
    sold: "980",
    image:
      "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&q=80&w=400",
    komoditas: ["jagung"],
    tipe: ["benih"],
  },
  {
    id: "s4",
    name: "Pestisida Fungisida Dithane 200g",
    cat: "Lainnya",
    price: 32000,
    originalPrice: 38000,
    discount: 16,
    rating: 4.5,
    sold: "3.2rb",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=400",
    komoditas: ["sayuran", "buah"],
    tipe: ["pestisida"],
  },
  {
    id: "s5",
    name: "Benih Kedelai Anjasmoro 1kg",
    cat: "Kedelai",
    price: 28000,
    originalPrice: 33000,
    discount: 15,
    rating: 4.6,
    sold: "760",
    image:
      "https://images.unsplash.com/photo-1563746924237-f81d1a6a5a7a?auto=format&fit=crop&q=80&w=400",
    komoditas: ["kedelai"],
    tipe: ["benih"],
  },
  {
    id: "s6",
    name: "Bibit Cabai Rawit TM 999 100biji",
    cat: "Sayuran",
    price: 22000,
    originalPrice: 27000,
    discount: 19,
    rating: 4.7,
    sold: "1.8rb",
    image:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=400",
    komoditas: ["sayuran"],
    tipe: ["benih"],
  },
  {
    id: "s7",
    name: "Bibit Tomat Servo F1 50biji",
    cat: "Sayuran",
    price: 18000,
    originalPrice: 22000,
    discount: 18,
    rating: 4.8,
    sold: "2.4rb",
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400",
    komoditas: ["sayuran"],
    tipe: ["benih"],
  },
  {
    id: "s8",
    name: "Bibit Mangga Harum Manis 1m",
    cat: "Buah",
    price: 65000,
    originalPrice: 75000,
    discount: 13,
    rating: 4.6,
    sold: "430",
    image:
      "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=400",
    komoditas: ["buah"],
    tipe: ["bibit"],
  },
  {
    id: "s9",
    name: "Bibit Kelapa Sawit Unggul 1 btg",
    cat: "Perkebunan",
    price: 35000,
    originalPrice: 42000,
    discount: 17,
    rating: 4.5,
    sold: "620",
    image:
      "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=400",
    komoditas: ["perkebunan"],
    tipe: ["bibit"],
  },
  {
    id: "s10",
    name: "Konsentrat Ayam Broiler 10kg",
    cat: "Peternakan",
    price: 145000,
    originalPrice: 160000,
    discount: 9,
    rating: 4.7,
    sold: "890",
    image:
      "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=400",
    komoditas: ["peternakan"],
    tipe: ["pakan"],
  },
  {
    id: "s11",
    name: "Pakan Ikan Lele Apung 10kg",
    cat: "Perikanan",
    price: 95000,
    originalPrice: 108000,
    discount: 12,
    rating: 4.8,
    sold: "1.1rb",
    image:
      "https://images.unsplash.com/photo-1511576661531-b34d7da5d0bb?auto=format&fit=crop&q=80&w=400",
    komoditas: ["perikanan"],
    tipe: ["pakan"],
  },
  {
    id: "s12",
    name: "Pupuk NPK Mutiara 16-16-16 25kg",
    cat: "Padi",
    price: 185000,
    originalPrice: 210000,
    discount: 12,
    rating: 4.9,
    sold: "3.5rb",
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=400",
    komoditas: ["padi", "sayuran"],
    tipe: ["pupuk"],
  },
  {
    id: "s13",
    name: "Bibit Pisang Cavendish Kultur Jaringan",
    cat: "Buah",
    price: 15000,
    originalPrice: 18000,
    discount: 17,
    rating: 4.6,
    sold: "2.7rb",
    image:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=400",
    komoditas: ["buah"],
    tipe: ["bibit"],
  },
  {
    id: "s14",
    name: "Herbisida Roundup 1 Liter",
    cat: "Lainnya",
    price: 78000,
    originalPrice: 90000,
    discount: 13,
    rating: 4.4,
    sold: "1.3rb",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=400",
    komoditas: ["padi", "perkebunan"],
    tipe: ["pestisida"],
  },
  {
    id: "s15",
    name: "Benih Bawang Merah Brebes 500g",
    cat: "Sayuran",
    price: 55000,
    originalPrice: 65000,
    discount: 15,
    rating: 4.7,
    sold: "1.9rb",
    image:
      "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?auto=format&fit=crop&q=80&w=400",
    komoditas: ["sayuran"],
    tipe: ["benih"],
  },
];

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────

function ProductCard({ prod }: { prod: DisplayProduct; key?: any }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer">
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={prod.image}
          alt={prod.name}
          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
        />
        {/* Discount badge top-right */}
        {prod.discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm">
            -{prod.discount}%
          </div>
        )}
        {/* Category badge top-left */}
        <div
          className={`absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full ${CAT_COLORS[prod.cat] ?? "bg-gray-100 text-gray-600"}`}
        >
          {prod.cat}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <p className="font-medium text-gray-800 text-[12px] leading-snug line-clamp-2 flex-1 mb-2">
          {prod.name}
        </p>

        {/* Prices */}
        <div className="mb-1">
          {prod.originalPrice && (
            <p className="text-gray-400 text-[10px] line-through leading-none mb-0.5">
              {formatRp(prod.originalPrice)}
            </p>
          )}
          <p className="font-black text-[#1B4D3E] text-sm leading-none">
            {formatRp(prod.price)}
          </p>
        </div>

        {/* Rating & Sold */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={10}
                className={
                  s <= Math.round(prod.rating)
                    ? "fill-[#F59E0B] text-[#F59E0B]"
                    : "fill-gray-200 text-gray-200"
                }
              />
            ))}
          </div>
          <span className="text-gray-400 text-[10px]">{prod.rating}</span>
          <span className="text-gray-300 text-[10px]">·</span>
          <span className="text-gray-400 text-[10px]">{prod.sold} terjual</span>
        </div>

        {/* Add to cart */}
        <button className="w-full border border-[#1B4D3E] text-[#1B4D3E] hover:bg-[#1B4D3E] hover:text-white text-[11px] font-bold py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5">
          <ShoppingCart size={12} />
          Keranjang
        </button>
      </div>
    </div>
  );
}

// ─── FILTER PANEL ─────────────────────────────────────────────────────────

interface FilterState {
  komoditas: string[];
  tipe: string[];
  minPrice: string;
  maxPrice: string;
  rating: string[];
  pengiriman: string[];
}

function FilterPanel({
  activeCategory,
  onCategoryChange,
  filters,
  onFiltersChange,
}: {
  activeCategory: string;
  onCategoryChange: (c: string) => void;
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
}) {
  const toggle = (key: keyof FilterState, value: string) => {
    const arr = filters[key] as string[];
    const next = arr.includes(value)
      ? arr.filter((x) => x !== value)
      : [...arr, value];
    onFiltersChange({ ...filters, [key]: next });
  };

  return (
    <aside className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#1B4D3E] px-4 py-3">
        <p className="text-white font-black text-sm tracking-wide">
          ≡ Semua Kategori
        </p>
      </div>

      {/* Categories */}
      <div className="p-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 mb-0.5 ${
              activeCategory === cat
                ? "bg-orange-50 text-[#F97316] font-bold border-l-[3px] border-[#F97316]"
                : "text-gray-600 hover:bg-gray-50 hover:text-[#1B4D3E]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <hr className="border-gray-100" />

      {/* Filter sections */}
      <div className="p-4 space-y-5">
        <p className="font-black text-gray-800 text-sm tracking-wider uppercase">
          Filter
        </p>

        {/* Komoditas */}
        <div>
          <p className="font-bold text-gray-700 text-xs mb-2 uppercase tracking-wide">
            Komoditas
          </p>
          <div className="space-y-1.5">
            {[
              "Padi",
              "Jagung",
              "Cabai",
              "Udang",
              "Rumput Laut",
              "Ikan",
              "Lainnya",
            ].map((item) => (
              <label
                key={item}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.komoditas.includes(item)}
                  onChange={() => toggle("komoditas", item)}
                  className="w-3.5 h-3.5 accent-[#1B4D3E] cursor-pointer"
                />
                <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Rentang Harga */}
        <div>
          <p className="font-bold text-gray-700 text-xs mb-2 uppercase tracking-wide">
            Rentang Harga
          </p>
          <div className="flex items-center gap-1.5 mb-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) =>
                onFiltersChange({ ...filters, minPrice: e.target.value })
              }
              className="w-full border border-gray-200 rounded-lg text-[11px] px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1B4D3E] text-gray-700"
            />
            <span className="text-gray-400 text-xs shrink-0">–</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) =>
                onFiltersChange({ ...filters, maxPrice: e.target.value })
              }
              className="w-full border border-gray-200 rounded-lg text-[11px] px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1B4D3E] text-gray-700"
            />
          </div>
          <button
            onClick={() => {}}
            className="w-full bg-[#1B4D3E] hover:bg-[#163D30] text-white text-[11px] font-bold py-1.5 rounded-lg transition-colors"
          >
            Terapkan
          </button>
        </div>

        <hr className="border-gray-100" />

        {/* Tipe Produk */}
        <div>
          <p className="font-bold text-gray-700 text-xs mb-2 uppercase tracking-wide">
            Tipe Produk
          </p>
          <div className="space-y-1.5">
            {["Satuan", "Bundle/Paket", "Organik", "Bersertifikat"].map(
              (item) => (
                <label
                  key={item}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.tipe.includes(item)}
                    onChange={() => toggle("tipe", item)}
                    className="w-3.5 h-3.5 accent-[#1B4D3E] cursor-pointer"
                  />
                  <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">
                    {item}
                  </span>
                </label>
              ),
            )}
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Rating */}
        <div>
          <p className="font-bold text-gray-700 text-xs mb-2 uppercase tracking-wide">
            Rating
          </p>
          <div className="space-y-1.5">
            {["4", "3"].map((r) => (
              <label
                key={r}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.rating.includes(r)}
                  onChange={() => toggle("rating", r)}
                  className="w-3.5 h-3.5 accent-[#1B4D3E] cursor-pointer"
                />
                <span className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={10}
                      className={
                        s <= Number(r)
                          ? "fill-[#F59E0B] text-[#F59E0B]"
                          : "fill-gray-200 text-gray-200"
                      }
                    />
                  ))}
                  <span className="text-xs text-gray-600 ml-1">ke atas</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Pengiriman */}
        <div>
          <p className="font-bold text-gray-700 text-xs mb-2 uppercase tracking-wide">
            Pengiriman
          </p>
          <div className="space-y-1.5">
            {["Gratis Ongkir", "Same Day", "Instant"].map((item) => (
              <label
                key={item}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.pengiriman.includes(item)}
                  onChange={() => toggle("pengiriman", item)}
                  className="w-3.5 h-3.5 accent-[#1B4D3E] cursor-pointer"
                />
                <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── MAIN EXPORT ────────────────────────────────────────────────────────────

export default function KatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    data: rawProducts,
    isLoading,
    error,
    refetch,
  } = useProducts({ limit: 100 });
  const activeCategory = searchParams.get("kategori") ?? "Semua Produk";
  const [activeSort, setActiveSort] = useState("Populer");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    komoditas: [],
    tipe: [],
    minPrice: "",
    maxPrice: "",
    rating: [],
    pengiriman: [],
  });

  const ITEMS_PER_PAGE = 15;

  // ── Filter + Sort logic ──
  const filtered = useMemo(() => {
    const allProducts: DisplayProduct[] =
      rawProducts && rawProducts.length > 0
        ? rawProducts.map(dbToDisplay)
        : STATIC_PRODUCTS;
    let items = [...allProducts];

    // Category
    if (activeCategory !== "Semua Produk") {
      items = items.filter((p) => p.cat === activeCategory);
    }

    // Komoditas
    if (filters.komoditas.length > 0) {
      items = items.filter((p) =>
        filters.komoditas.some((k) => p.komoditas.includes(k)),
      );
    }

    // Tipe
    if (filters.tipe.length > 0) {
      items = items.filter((p) => filters.tipe.some((t) => p.tipe.includes(t)));
    }

    // Price range
    if (filters.minPrice) {
      items = items.filter((p) => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      items = items.filter((p) => p.price <= Number(filters.maxPrice));
    }

    // Rating
    if (filters.rating.length > 0) {
      const minRating = Math.min(...filters.rating.map(Number));
      items = items.filter((p) => p.rating >= minRating);
    }

    // Sort
    if (activeSort === "Terlaris") {
      items = items.sort((a, b) => {
        const toNum = (s: string) =>
          parseFloat(s.replace("rb", "")) * (s.includes("rb") ? 1000 : 1);
        return toNum(b.sold) - toNum(a.sold);
      });
    } else if (activeSort === "Harga ↑") {
      items = items.sort((a, b) => a.price - b.price);
    } else if (activeSort === "Harga ↓") {
      items = items.sort((a, b) => b.price - a.price);
    } else if (activeSort === "Terbaru") {
      items = items.sort((a, b) => b.id.localeCompare(a.id));
    } else {
      // Populer — by rating × sold
      items = items.sort((a, b) => b.rating - a.rating);
    }

    return items;
  }, [rawProducts, activeCategory, filters, activeSort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleCategoryChange = (cat: string) => {
    setCurrentPage(1);
    if (cat === "Semua Produk") {
      setSearchParams({});
    } else {
      setSearchParams({ kategori: cat });
    }
  };

  const handleSortChange = (sort: string) => {
    setActiveSort(sort);
    setCurrentPage(1);
  };

  const handleFiltersChange = (f: FilterState) => {
    setFilters(f);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="w-full bg-gray-50 min-h-screen font-sans">
        <div className="max-w-360 mx-auto px-4 sm:px-6 py-6">
          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm"
            >
              <Filter size={15} />
              {showMobileFilter ? "Sembunyikan Filter" : "Tampilkan Filter"}
            </button>
          </div>

          <div className="flex gap-5 items-start">
            {/* ── LEFT: Filter Panel ── */}
            <div
              className={`${showMobileFilter ? "block" : "hidden"} lg:block w-full lg:w-55 xl:w-62.5 shrink-0 sticky top-17.5`}
            >
              <FilterPanel
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>

            {/* ── RIGHT: Sort bar + Grid ── */}
            <div className="flex-1 min-w-0">
              {/* Sort bar */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-gray-500 text-sm">
                  <span className="font-bold text-gray-800">
                    {filtered.length}
                  </span>{" "}
                  produk ditemukan
                </p>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-500 text-xs font-medium">
                    Urutkan:
                  </span>
                  {SORT_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSortChange(s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        activeSort === s
                          ? "bg-[#F97316] text-white shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Pagination nav */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500 text-xs font-medium">
                    {currentPage}/{totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 flex items-center justify-center transition-colors"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Inline error banner */}
              {error && (
                <ErrorState
                  message="Gagal memuat produk. Coba lagi."
                  onRetry={refetch}
                />
              )}

              {/* Product grid — 5 columns */}
              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i}>
                      <ProductCardSkeleton />
                    </div>
                  ))}
                </div>
              ) : paginated.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                  {paginated.map((prod) => (
                    <ProductCard key={prod.id} prod={prod} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Produk tidak ditemukan"
                  description="Coba ubah filter atau kata kunci pencarian"
                />
              )}

              {/* Bottom pagination */}
              {paginated.length > 0 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40 flex items-center justify-center shadow-sm transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pg) => (
                      <button
                        key={pg}
                        onClick={() => setCurrentPage(pg)}
                        className={`w-9 h-9 rounded-full text-sm font-bold transition-all ${
                          pg === currentPage
                            ? "bg-[#1B4D3E] text-white shadow-md"
                            : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {pg}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40 flex items-center justify-center shadow-sm transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Diagnosis AI Floating Button ── */}
      <AnimatePresence>
        {!showDiagnosis && (
          <motion.button
            key="diagnosis-fab"
            initial={{ opacity: 0, scale: 0.8, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            onClick={() => setShowDiagnosis(true)}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-[#1B4D3E] hover:bg-[#163D30] text-white pl-4 pr-5 py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
            aria-label="Buka Diagnosis AI"
          >
            {/* Pulsing indicator */}
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b3cc04] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#b3cc04]"></span>
            </span>
            <Bot size={18} className="shrink-0" />
            <span className="text-sm font-bold tracking-wide">
              Diagnosis AI
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Diagnosis AI Drawer ── */}
      <AnimatePresence>
        {showDiagnosis && (
          <>
            {/* Semi-transparent backdrop — click to close */}
            <motion.div
              key="diagnosis-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowDiagnosis(false)}
              aria-hidden="true"
            />

            {/* Slide-in panel */}
            <motion.div
              key="diagnosis-panel"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] flex flex-col bg-white shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Diagnosis AI"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-[#1B4D3E] shrink-0">
                <div className="flex items-center gap-2">
                  {/* Pulsing dot */}
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b3cc04] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#b3cc04]"></span>
                  </span>
                  <Bot size={18} className="text-white" />
                  <span className="text-white font-bold text-sm tracking-wide">
                    Diagnosis AI
                  </span>
                </div>
                <button
                  onClick={() => setShowDiagnosis(false)}
                  className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10 cursor-pointer"
                  aria-label="Tutup panel"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Chatbot content — scrollable */}
              <div className="flex-1 overflow-y-auto">
                <DiagnosisChatbot
                  isOpen={showDiagnosis}
                  onClose={() => setShowDiagnosis(false)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
