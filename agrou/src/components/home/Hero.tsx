import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    id: 0,
    badge: "AGROU TANI",
    badgeColor: "bg-(--color-lime) text-(--color-forest-dark)",
    title: "Hasil Panen Maksimal Dimulai dari Produk yang Tepat",
    accentWord: "Produk yang Tepat",
    subtext:
      "Diagnosis lahan berbasis AI membantu petani memilih produk proteksi yang sesuai, bukan sekadar berdasarkan kebiasaan.",
    cta: "Mulai Diagnosis",
    targetId: "module-intro",
  },
  {
    id: 1,
    badge: "AGROU PASAR",
    badgeColor: "bg-(--color-lime) text-(--color-forest-dark)",
    title: "Kualitas Panen Terbaik Layak Mendapat Harga Terbaik",
    accentWord: "Harga Terbaik",
    subtext:
      "Platform kami menghubungkan hasil panen koperasi langsung ke pembeli premium tanpa perantara berlapis.",
    cta: "Jual di Pasar",
    targetId: "module-intro",
  },
  {
    id: 2,
    badge: "AGROU TANI",
    badgeColor: "bg-(--color-lime) text-(--color-forest-dark)",
    title: "47 Komoditas. Langsung dari Sumbernya.",
    accentWord: "Sumbernya",
    subtext:
      "Produk pertanian dan perikanan terbaik Indonesia, langsung dari koperasi terverifikasi tanpa markup tengkulak.",
    cta: "Lihat Produk",
    targetId: "module-intro",
  },
];

const renderTitle = (title: string, accentWord?: string) => {
  if (!accentWord) return title;
  const index = title.indexOf(accentWord);
  if (index === -1) return title;

  const before = title.substring(0, index);
  const match = title.substring(index, index + accentWord.length);
  const after = title.substring(index + accentWord.length);

  return (
    <>
      {before}
      <span className="text-(--color-lime) italic">{match}</span>
      {after}
    </>
  );
};

const slideVariants = {
  enter: {
    opacity: 0,
  },
  center: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("left");

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection("left");
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 20000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setDirection("left");
    setActiveSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setDirection("right");
    setActiveSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  return (
    <section className="w-full relative z-10 bg-transparent">
      <div className="w-full h-125 relative overflow-hidden group bg-transparent">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            className="absolute inset-0 w-full h-full bg-transparent"
          >
            {/* Slide Content with fixed vertical spacing */}
            <div className="absolute inset-0 pt-12 md:pt-14 z-10">
              <div className="max-w-360 w-full mx-auto px-8 md:px-16 text-white">
                <div className="max-w-2xl flex flex-col justify-start">
                  {/* Badge Wrapper - Always at the exact same location */}
                  <div className="h-8 mb-3 flex items-center">
                    <span className="inline-flex items-center gap-1.5 bg-(--color-lime) text-(--color-forest-dark) text-[10px] font-black tracking-[0.15em] px-3 py-1.5 rounded-full uppercase w-fit">
                      {SLIDES[activeSlide].badge}
                    </span>
                  </div>

                  {/* Title Wrapper - Fixed minimum height to prevent shifting */}
                  <div className="min-h-17.5 md:min-h-26.25 flex items-end mb-3">
                    <h1 className="font-display font-black text-3xl md:text-5xl leading-[1.05] text-white drop-shadow-sm w-full">
                      {renderTitle(
                        SLIDES[activeSlide].title,
                        SLIDES[activeSlide].accentWord,
                      )}
                    </h1>
                  </div>

                  {/* Description Wrapper - Fixed minimum height to prevent shifting */}
                  <div className="min-h-12 md:min-h-14 flex items-start mb-5">
                    <p className="text-white/85 text-sm md:text-base leading-relaxed max-w-xl font-medium [text-shadow:0_1px_3px_rgba(0,0,0,0.3)]">
                      {SLIDES[activeSlide].subtext}
                    </p>
                  </div>

                  {/* CTA Button Wrapper */}
                  <div className="h-11 flex items-center mb-6">
                    <button
                      onClick={() => {
                        const targetId = SLIDES[activeSlide].targetId;
                        if (targetId) {
                          const el = document.getElementById(targetId);
                          el?.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="bg-(--color-lime) text-(--color-forest-dark) font-black px-7 py-3 rounded-full text-sm tracking-wide hover:brightness-110 hover:scale-105 active:scale-95 transition-all duration-200 shadow-[0_4px_20px_rgba(179,204,4,0.35)]"
                    >
                      {SLIDES[activeSlide].cta} →
                    </button>
                  </div>

                  {/* Stats row integrated beautifully inside the banner */}
                  <div className="flex items-center gap-6 pt-5 border-t border-white/10 max-w-lg">
                    <div>
                      <div className="text-(--color-lime) font-black text-lg md:text-xl font-sans leading-none">
                        2.400+
                      </div>
                      <div className="text-white/60 text-[9px] md:text-[10px] font-sans tracking-widest mt-1 uppercase">
                        Koperasi Tani
                      </div>
                    </div>
                    <div className="w-px h-6 bg-white/10" />
                    <div>
                      <div className="text-(--color-lime) font-black text-lg md:text-xl font-sans leading-none">
                        47
                      </div>
                      <div className="text-white/60 text-[9px] md:text-[10px] font-sans tracking-widest mt-1 uppercase">
                        Komoditas
                      </div>
                    </div>
                    <div className="w-px h-6 bg-white/10" />
                    <div>
                      <div className="text-(--color-lime) font-black text-lg md:text-xl font-sans leading-none">
                        4.8/5
                      </div>
                      <div className="text-white/60 text-[9px] md:text-[10px] font-sans tracking-widest mt-1 uppercase">
                        Rating Kepuasan
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Subtle Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-3 rounded-full backdrop-blur-md transition-all z-20 opacity-0 group-hover:opacity-100 duration-300"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-3 rounded-full backdrop-blur-md transition-all z-20 opacity-0 group-hover:opacity-100 duration-300"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => {
                setDirection(i > activeSlide ? "left" : "right");
                setActiveSlide(i);
              }}
              className={`transition-all duration-300 ${
                activeSlide === i
                  ? "w-8 h-2 bg-(--color-lime) rounded-full"
                  : "w-2 h-2 bg-white/40 hover:bg-white/60 rounded-full"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
