import { motion } from "motion/react";
import { ArrowRight, Zap, Award, Waves } from "lucide-react";
import { usePromos } from "../lib/queries/promos";
import promoPadi from "../../assets/promo-proteksi-padi.jpg";
import promoAceh from "../../assets/promo-koperasi-aceh.jpg";
import promoNelayan from "../../assets/promo-nelayan-segar.jpg";
import bgEkosistem from "../../assets/bg-ekosistem.jpg";

const BANNERS = [
  {
    id: 1,
    title: "Bundle Hemat Proteksi Padi",
    subtitle:
      "Hemat hingga 40% untuk paket lengkap perlindungan padi dari hama & penyakit",
    cta: "Lihat Bundle",
    image: promoPadi,
    icon: Zap,
    accent: "from-[var(--color-orange-dark)]/95 to-[var(--color-orange)]/80",
    badge: "PROMO MINGGU INI",
    badgeColor: "bg-[var(--color-lime)] text-[var(--color-forest-dark)]",
    span: "lg:col-span-2",
    height: "h-[260px] lg:h-[280px]",
  },
  {
    id: 2,
    title: "Produk Unggulan Koperasi Aceh",
    subtitle:
      "Kopi Gayo, rempah premium, dan hasil bumi terbaik langsung dari petani",
    cta: "Jelajahi Produk",
    image: promoAceh,
    icon: Award,
    accent: "from-[var(--color-forest-dark)]/95 to-[var(--color-forest)]/80",
    badge: "UNGGULAN",
    badgeColor: "bg-[var(--color-lime)] text-[var(--color-forest-dark)]",
    span: "lg:col-span-1",
    height: "h-[260px] lg:h-[280px]",
  },
  {
    id: 3,
    title: "Komoditas Segar Langsung dari Nelayan",
    subtitle:
      "Ikan tuna, udang vaname, dan hasil laut lainnya — tangkapan hari ini, kirim besok",
    cta: "Pesan Sekarang",
    image: promoNelayan,
    icon: Waves,
    accent:
      "from-[var(--color-orange-dark)]/95 via-[var(--color-orange)]/85 to-transparent",
    badge: "FRESH TODAY",
    badgeColor: "bg-[var(--color-lime)] text-[var(--color-forest-dark)]",
    span: "lg:col-span-3",
    height: "h-[280px] lg:h-[200px]",
  },
];

export default function PromoBanner() {
  const { data: dbPromos } = usePromos();

  const ICON_MAP = [Zap, Award, Waves];
  const ACCENT_MAP = [
    "from-[var(--color-orange-dark)]/95 to-[var(--color-orange)]/80",
    "from-[var(--color-forest-dark)]/95 to-[var(--color-forest)]/80",
    "from-[var(--color-orange-dark)]/95 via-[var(--color-orange)]/85 to-transparent",
  ];
  const SPAN_MAP = ["lg:col-span-2", "lg:col-span-1", "lg:col-span-3"];
  const HEIGHT_MAP = [
    "h-[260px] lg:h-[280px]",
    "h-[260px] lg:h-[280px]",
    "h-[280px] lg:h-[200px]",
  ];
  const BADGE_COLOR = "bg-[var(--color-lime)] text-[var(--color-forest-dark)]";
  const FALLBACK_IMAGES = [promoPadi, promoAceh, promoNelayan];

  const banners =
    dbPromos && dbPromos.length > 0
      ? dbPromos.slice(0, 3).map((p, i) => ({
          id: p.id,
          title: p.title,
          subtitle: p.description ?? "",
          cta: "Lihat Promo",
          image: p.image_url ?? FALLBACK_IMAGES[i % 3],
          icon: ICON_MAP[i % 3],
          accent: ACCENT_MAP[i % 3],
          badge: "PROMO",
          badgeColor: BADGE_COLOR,
          span: SPAN_MAP[i % 3],
          height: HEIGHT_MAP[i % 3],
        }))
      : BANNERS;

  return (
    <section
      className="w-full bg-[var(--color-forest)] pt-16 pb-16 relative z-10 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgEkosistem})` }}
    >
      {/* Dark overlay to retain the dark green feel and ensure text legibility */}
      <div className="absolute inset-0 bg-[var(--color-forest-dark)]/55 z-0" />
      <div className="max-w-[1440px] mx-auto px-8 relative z-10">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <span
              className="font-bold text-sm tracking-wider uppercase bg-[var(--color-surface)] px-4 py-1.5 rounded-full border border-[var(--color-border)] inline-block mb-4"
              style={{ color: "var(--color-orange)" }}
            >
              🔥 Promo & Penawaran
            </span>
            <h2 className="font-display font-black text-3xl lg:text-4xl text-[var(--color-text-on-dark)]">
              Penawaran Spesial Untuk Anda
            </h2>
          </div>
          <a
            href="#"
            className="flex items-center gap-1.5 text-[var(--color-lime)] font-semibold text-sm hover:underline transition-colors group/all shrink-0"
          >
            Lihat Semua Promo
            <ArrowRight
              size={14}
              className="group-hover/all:translate-x-0.5 transition-transform text-[var(--color-lime)]"
            />
          </a>
        </div>

        {/* Banner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {banners.map((banner, idx) => {
            const Icon = banner.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`${banner.span} ${banner.height} relative rounded-2xl overflow-hidden cursor-pointer group
                           shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] transition-shadow duration-300`}
              >
                {/* Background Image */}
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${banner.accent}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Content */}
                {banner.id === 3 ? (
                  <div className="relative z-10 h-full flex flex-col lg:flex-row lg:items-center lg:justify-between p-6 lg:p-8 lg:px-10">
                    <div className="max-w-xl">
                      {/* Badge */}
                      <span
                        className={`${banner.badgeColor} text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-md inline-block mb-3`}
                      >
                        {banner.badge}
                      </span>

                      <h3 className="font-display font-black text-white text-xl lg:text-3xl mb-2 leading-tight">
                        {banner.title}
                      </h3>
                      <p className="text-white/90 text-sm lg:text-base font-medium leading-relaxed max-w-lg">
                        {banner.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mt-5 lg:mt-0">
                      <button className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white font-bold px-6 py-3 rounded-full text-sm transition-all group-hover:bg-[var(--color-lime)] group-hover:text-[var(--color-forest-dark)] group-hover:border-[var(--color-lime)] active:scale-95 shadow-md shrink-0">
                        {banner.cta}
                        <ArrowRight size={14} />
                      </button>
                      <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20 shrink-0">
                        <Icon size={24} className="text-white" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10 h-full flex flex-col justify-between p-6 lg:p-8">
                    <div>
                      {/* Badge */}
                      <span
                        className={`${banner.badgeColor} text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-md inline-block mb-4`}
                      >
                        {banner.badge}
                      </span>

                      <h3 className="font-display font-black text-white text-xl lg:text-2xl mb-2 leading-tight max-w-md">
                        {banner.title}
                      </h3>
                      <p className="text-white/80 text-sm font-medium max-w-sm leading-relaxed line-clamp-2">
                        {banner.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <button className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white font-bold px-5 py-2.5 rounded-full text-sm transition-all group-hover:bg-[var(--color-lime)] group-hover:text-[var(--color-forest-dark)] group-hover:border-[var(--color-lime)] active:scale-95">
                        {banner.cta}
                        <ArrowRight size={14} />
                      </button>
                      <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl border border-white/20">
                        <Icon size={22} className="text-white" />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
