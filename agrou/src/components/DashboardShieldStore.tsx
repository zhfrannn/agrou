import { useState } from "react";
import {
  Search,
  Shield,
  ShoppingCart,
  Plus,
  Minus,
  Package,
  Tag,
} from "lucide-react";
import { motion } from "motion/react";
import { useShieldProducts } from "../lib/queries/shield";
import { ProductCardSkeleton } from "./ui/LoadingSkeleton";
import { ErrorState } from "./ui/ErrorState";
import { EmptyState } from "./ui/EmptyState";
import { formatCurrency } from "../lib/queries/orders";

export default function DashboardShieldStore() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [cart, setCart] = useState<Record<string, number>>({});

  const { data: products, isLoading, error, refetch } = useShieldProducts();

  const categories = [
    "Semua",
    ...Array.from(
      new Set((products ?? []).map((p) => p.commodity ?? "Lainnya")),
    ),
  ];

  const filtered = (products ?? []).filter((p) => {
    const matchCat =
      activeCategory === "Semua" || p.commodity === activeCategory;
    const matchSearch =
      !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const changeQty = (id: string, delta: number) => {
    setCart((prev) => {
      const next = (prev[id] ?? 0) + delta;
      if (next <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const cartCount = (Object.values(cart) as number[]).reduce(
    (a, b) => a + b,
    0,
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
      {/* HEADER */}
      <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between shrink-0 shadow-sm z-10 w-full">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 flex items-center gap-3">
            <Shield className="text-[#2D6A4F]" size={28} />
            Toko Proteksi
          </h1>
          <p className="text-sm font-medium text-gray-500">
            Beli paket perlindungan saprodi untuk lahan Anda.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 h-9 bg-slate-100 rounded-xl text-sm font-medium text-gray-700 placeholder:text-gray-400 border-none outline-none w-48"
            />
          </div>
          {cartCount > 0 && (
            <button className="relative flex items-center gap-2 bg-[#1B4332] text-white px-4 py-2 rounded-xl text-sm font-bold">
              <ShoppingCart size={16} />
              Keranjang
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#F77F00] rounded-full text-[10px] font-black flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          )}
        </div>
      </header>

      {/* CATEGORY TABS */}
      <div className="bg-white border-b border-gray-100 px-8 flex items-center gap-1 overflow-x-auto shrink-0">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
              activeCategory === cat
                ? "border-[#1B4332] text-[#1B4332]"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 w-full max-w-[1440px] mx-auto">
        {isLoading && <ProductCardSkeleton count={6} />}

        {error && (
          <ErrorState
            message={(error as Error).message}
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !error && filtered.length === 0 && (
          <EmptyState
            icon={Package}
            title="Produk Tidak Ditemukan"
            description="Coba ubah kategori atau kata kunci pencarian."
          />
        )}

        {!isLoading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((product, i) => {
              const qty = cart[product.id] ?? 0;
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all"
                >
                  {/* Image */}
                  <div className="relative h-36 bg-gray-100 overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={(product as any).image_url ?? ""}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Shield size={40} />
                      </div>
                    )}
                    {(product as any).commodity && (
                      <span className="absolute top-2 left-2 bg-[#2D6A4F] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {(product as any).commodity}
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <p className="font-bold text-sm text-gray-900 leading-snug mb-1">
                      {product.name}
                    </p>
                    {product.description && (
                      <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                        {product.description}
                      </p>
                    )}
                    <p className="font-black text-base text-[#2D6A4F] mb-3">
                      {formatCurrency(product.premium)}
                      <span className="text-xs text-gray-400 font-medium">
                        /ha
                      </span>
                    </p>

                    {/* Add to cart */}
                    <div className="flex items-center gap-2">
                      {qty > 0 ? (
                        <div className="flex items-center gap-2 flex-1">
                          <button
                            onClick={() => changeQty(product.id, -1)}
                            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                            aria-label="Kurangi"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-bold text-sm text-gray-900 flex-1 text-center">
                            {qty}
                          </span>
                          <button
                            onClick={() => changeQty(product.id, 1)}
                            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                            aria-label="Tambah"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => changeQty(product.id, 1)}
                          className="flex-1 bg-[#2D6A4F] hover:bg-[#1B4332] text-white h-9 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                        >
                          <ShoppingCart size={14} /> Beli
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
