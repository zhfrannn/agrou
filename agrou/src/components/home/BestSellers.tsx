import { useRef } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Star,
  MapPin,
  Flame,
} from "lucide-react";
import { useBestSellers, formatPrice } from "../../lib/queries/products";
import { ProductCardSkeleton } from "../ui/LoadingSkeleton";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";

// Category → badge colour mapping
const CATEGORY_BADGE: Record<string, { label: string; color: string }> = {
  padi: { label: "Pertanian", color: "bg-(--color-forest)" },
  jagung: { label: "Pertanian", color: "bg-(--color-forest)" },
  kedelai: { label: "Pertanian", color: "bg-(--color-forest)" },
  sayuran: { label: "Sayuran", color: "bg-(--color-forest)" },
  buah: { label: "Buah", color: "bg-(--color-forest)" },
  perkebunan: { label: "Perkebunan", color: "bg-(--color-forest)" },
  peternakan: { label: "Peternakan", color: "bg-(--color-forest-dark)" },
  perikanan: { label: "Perikanan", color: "bg-(--color-forest-dark)" },
  lainnya: { label: "Lainnya", color: "bg-gray-500" },
};

export default function BestSellers() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: products, isLoading, error, refetch } = useBestSellers(6);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-white pt-16 pb-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame size={18} style={{ color: "var(--color-orange)" }} />
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--color-orange)" }}
              >
                Produk Terlaris
              </span>
            </div>
            <h2
              className="font-display font-black text-2xl md:text-3xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              Best Sellers Minggu Ini
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Scroll kiri"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Scroll kanan"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading && <ProductCardSkeleton count={6} />}

        {error && (
          <ErrorState
            message={(error as Error).message}
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !error && (!products || products.length === 0) && (
          <EmptyState
            title="Belum Ada Produk"
            description="Produk terlaris akan muncul di sini."
          />
        )}

        {!isLoading && !error && products && products.length > 0 && (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
          >
            {products.map((product, i) => {
              const badge =
                CATEGORY_BADGE[product.category] ?? CATEGORY_BADGE.lainnya;
              const image =
                product.images?.[0] ??
                "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600";

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="group shrink-0 w-55 snap-start bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer"
                >
                  <div className="relative h-36 overflow-hidden bg-gray-100">
                    <img
                      src={image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span
                      className={`absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.color}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <div className="p-3 flex flex-col gap-1">
                    <p className="font-bold text-[13px] text-gray-900 line-clamp-2 leading-tight">
                      {product.name}
                    </p>

                    {product.koperasi && (
                      <p className="text-[11px] text-gray-500 font-medium truncate">
                        {(product.koperasi as { name?: string }).name}
                      </p>
                    )}

                    {product.koperasi &&
                      (product.koperasi as { location?: string | null })
                        .location && (
                        <span className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                          <MapPin size={9} />
                          {
                            (product.koperasi as { location?: string | null })
                              .location
                          }
                        </span>
                      )}

                    <div className="flex items-center gap-1 mt-0.5">
                      <Star
                        size={11}
                        className="fill-amber-400 text-amber-400"
                      />
                      <span className="text-[11px] font-bold text-gray-700">
                        4.8
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                      <div>
                        <span
                          className="font-bold text-sm"
                          style={{ color: "var(--color-orange)" }}
                        >
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-(--color-text-secondary) text-[10px] font-medium">
                          /{product.unit}
                        </span>
                      </div>
                      <button
                        className="flex items-center gap-1 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-xl transition-colors active:scale-95 shadow-sm"
                        style={{
                          backgroundColor: "var(--color-orange)",
                          borderRadius: "var(--radius-pill)",
                        }}
                        aria-label={`Pesan ${product.name}`}
                      >
                        <ShoppingCart size={12} />
                        Pesan
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* View all link */}
        <div className="mt-6 flex justify-center">
          <button
            className="flex items-center gap-2 text-sm font-bold hover:underline transition-colors"
            style={{ color: "var(--color-forest)" }}
          >
            Lihat Semua Produk
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
