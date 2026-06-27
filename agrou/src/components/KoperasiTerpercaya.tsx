import { useRef } from "react";
import { motion } from "motion/react";
import {
  CheckCircle2,
  MapPin,
  Star,
  Users,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useKoperasiList } from "../lib/queries/koperasi";
import { KoperasiCardSkeleton } from "./ui/LoadingSkeleton";
import { ErrorState } from "./ui/ErrorState";
import { EmptyState } from "./ui/EmptyState";

// Deterministic accent colours cycling through brand palette
const ACCENT_COLORS = [
  "from-[#2D6A4F] to-[#1B4332]",
  "from-[#E8720C] to-[#D4A017]",
  "from-[#0077B6] to-[#023E8A]",
  "from-[#2D6A4F] to-[#40916C]",
  "from-[#0077B6] to-[#0096C7]",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function KoperasiTerpercaya() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: koperasiList, isLoading, error, refetch } = useKoperasiList(6);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-(--color-bg-secondary,#f8faf8) pt-16 pb-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={18} style={{ color: "var(--color-forest)" }} />
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--color-forest)" }}
              >
                Koperasi Terverifikasi
              </span>
            </div>
            <h2
              className="font-display font-black text-2xl md:text-3xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              Koperasi Terpercaya
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
        {isLoading && <KoperasiCardSkeleton count={4} />}

        {error && (
          <ErrorState
            message={(error as Error).message}
            onRetry={() => refetch()}
          />
        )}

        {!isLoading &&
          !error &&
          (!koperasiList || koperasiList.length === 0) && (
            <EmptyState
              title="Belum Ada Koperasi"
              description="Koperasi terverifikasi akan muncul di sini."
            />
          )}

        {!isLoading && !error && koperasiList && koperasiList.length > 0 && (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
          >
            {koperasiList.map((kop, i) => {
              const color = ACCENT_COLORS[i % ACCENT_COLORS.length];
              const initials = getInitials(kop.name);
              const thumbnail = kop.banner_url ?? kop.logo_url;

              return (
                <motion.div
                  key={kop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="group shrink-0 w-60 snap-start bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer flex flex-col"
                >
                  {/* Avatar + verified badge */}
                  <div className="p-4 flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-full bg-linear-to-br ${color} flex items-center justify-center text-white font-black text-sm shrink-0`}
                    >
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="font-bold text-[13px] text-gray-900 truncate leading-tight">
                          {kop.name}
                        </p>
                        {kop.is_verified && (
                          <CheckCircle2
                            size={13}
                            className="shrink-0 text-(--color-forest)"
                          />
                        )}
                      </div>
                      <span className="flex items-center gap-1 text-[10px] text-gray-400 font-medium mt-0.5">
                        <MapPin size={9} />
                        {kop.location ?? kop.province ?? "Indonesia"}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="px-4 pb-3 flex items-center gap-3 text-[11px] font-semibold text-gray-600">
                    <span className="flex items-center gap-1">
                      <Star
                        size={11}
                        className="fill-amber-400 text-amber-400"
                      />
                      {kop.rating.toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={11} />
                      {kop.member_count} anggota
                    </span>
                  </div>

                  {/* Thumbnail */}
                  <div className="mx-4 mb-4 h-24 rounded-xl overflow-hidden bg-gray-100">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={kop.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className={`w-full h-full bg-linear-to-br ${color} opacity-30`}
                      />
                    )}
                  </div>

                  {/* Link */}
                  <div className="px-4 pb-4 mt-auto border-t border-gray-100/60 pt-3">
                    <a
                      href="#"
                      className="inline-flex items-center gap-1.5 text-(--color-forest) hover:text-(--color-forest-dark) font-bold text-xs hover:underline transition-colors"
                    >
                      Lihat Profil Koperasi
                      <ArrowRight
                        size={12}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
