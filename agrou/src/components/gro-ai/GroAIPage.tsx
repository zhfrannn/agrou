import { useState } from "react";
import { motion } from "motion/react";
import { Sprout, Building2, ArrowRight, Sparkles } from "lucide-react";
import GroAIModeA from "./GroAIModeA";
import GroAIModeB from "./GroAIModeB";
import groAiBg from "@assets/gro-ai-bg.jpg";

type Mode = "petani" | "koperasi" | null;

export default function GroAIPage() {
  const [selected, setSelected] = useState<Mode>(null);

  if (selected === "petani")
    return <GroAIModeA onBack={() => setSelected(null)} />;
  if (selected === "koperasi")
    return <GroAIModeB onBack={() => setSelected(null)} />;

  return (
    <div
      className="min-h-[calc(100vh-53px)] flex flex-col items-center justify-center px-4 sm:px-8 py-6 lg:py-10 relative overflow-hidden"
      style={{
        backgroundImage: `url(${groAiBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#0d2918",
      }}
    >
      {/* dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #b5f23d 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#b5f23d]/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#f77f00]/5 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6 lg:mb-8 relative z-10"
      >
        <div className="inline-flex items-center gap-2 bg-[#b5f23d]/10 border border-[#b5f23d]/30 text-[#b5f23d] text-[10px] font-black tracking-[0.15em] px-3.5 py-1.5 rounded-full mb-3 uppercase">
          <Sparkles size={10} />
          Gro AI — Powered by Anthropic Claude
        </div>
        <h1 className="font-display font-black text-white text-3xl lg:text-4xl leading-[1.1] mb-1.5">
          Kamu siapa
          <span className="text-[#b5f23d] italic"> hari ini?</span>
        </h1>
        <p className="text-white/60 text-sm lg:text-base max-w-md mx-auto font-medium leading-relaxed">
          Gro AI akan menyesuaikan bantuan berdasarkan kebutuhanmu — diagnosis
          lahan atau konsultasi ekspor.
        </p>
      </motion.div>

      {/* mode cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 w-full max-w-5xl relative z-10">
        {/* Mode A */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onClick={() => setSelected("petani")}
          className="group relative overflow-hidden rounded-3xl p-6 text-left cursor-pointer bg-linear-to-br from-white/8 via-white/5 to-transparent border border-white/10 hover:border-[#b5f23d]/50 hover:shadow-[0_0_60px_rgba(181,242,61,0.12),inset_0_1px_0_rgba(181,242,61,0.1)] transition-all duration-400"
        >
          <div className="absolute inset-0 bg-linear-to-br from-[#b5f23d]/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-3xl" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#b5f23d]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#b5f23d]/10 transition-all duration-400 -translate-y-1/2 translate-x-1/2" />
          <div className="w-12 h-12 rounded-xl bg-[#b5f23d]/10 border border-[#b5f23d]/20 flex items-center justify-center mb-4 group-hover:bg-[#b5f23d]/20 group-hover:border-[#b5f23d]/50 group-hover:shadow-[0_0_20px_rgba(181,242,61,0.2)] transition-all duration-300">
            <Sprout size={24} className="text-[#b5f23d]" />
          </div>
          <div className="text-[#b5f23d] text-[9px] font-black tracking-[0.15em] uppercase mb-2">
            Mode A
          </div>
          <h2 className="font-display font-black text-white text-xl leading-tight mb-2">
            Saya Petani
            <br />
            atau Nelayan
          </h2>
          <p className="text-white/50 text-xs lg:text-sm leading-relaxed mb-4 font-medium">
            Diagnosis masalah lahan, rekomendasi produk tepat, dan panduan
            budidaya berbasis AI.
          </p>
          <div className="space-y-1.5 mb-4">
            {[
              "Diagnosis gejala lahan & tanaman",
              "Rekomendasi pestisida & pupuk",
              "Panduan budidaya komoditas",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#b5f23d] rounded-full shrink-0" />
                <span className="text-white/60 text-xs font-medium">{f}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[#b5f23d] font-black text-sm group-hover:gap-4 transition-all duration-300">
            Mulai Diagnosis <ArrowRight size={16} />
          </div>
        </motion.button>

        {/* Mode B */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onClick={() => setSelected("koperasi")}
          className="group relative overflow-hidden rounded-3xl p-6 text-left cursor-pointer bg-linear-to-br from-white/8 via-white/5 to-transparent border border-white/10 hover:border-[#f77f00]/50 hover:shadow-[0_0_60px_rgba(247,127,0,0.12),inset_0_1px_0_rgba(247,127,0,0.1)] transition-all duration-400"
        >
          <div className="absolute inset-0 bg-linear-to-br from-[#f77f00]/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-3xl" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#f77f00]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#f77f00]/10 transition-all duration-400 -translate-y-1/2 translate-x-1/2" />
          <div className="w-12 h-12 rounded-xl bg-[#f77f00]/10 border border-[#f77f00]/20 flex items-center justify-center mb-4 group-hover:bg-[#f77f00]/20 group-hover:border-[#f77f00]/50 group-hover:shadow-[0_0_20px_rgba(247,127,0,0.2)] transition-all duration-300">
            <Building2 size={24} className="text-[#f77f00]" />
          </div>
          <div className="text-[#f77f00] text-[9px] font-black tracking-[0.15em] uppercase mb-2">
            Mode B
          </div>
          <h2 className="font-display font-black text-white text-xl leading-tight mb-2">
            Saya Koperasi
            <br />
            atau Unit Usaha
          </h2>
          <p className="text-white/50 text-xs lg:text-sm leading-relaxed mb-4 font-medium">
            Konsultasi ekspor, analisis regulasi pasar global, dan dokumen
            kelayakan ekspor berbasis AI.
          </p>
          <div className="space-y-1.5 mb-4">
            {[
              "Konsultasi regulasi ekspor global",
              "Export readiness score & checklist",
              "Analisis harga pasar internasional",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#f77f00] rounded-full shrink-0" />
                <span className="text-white/60 text-xs font-medium">{f}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[#f77f00] font-black text-sm group-hover:gap-4 transition-all duration-300">
            Mulai Konsultasi <ArrowRight size={16} />
          </div>
        </motion.button>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-white/30 text-xs mt-6 lg:mt-8 text-center relative z-10"
      >
        Gro AI menggunakan data regulasi terkini dari Kementan, BPOM, dan
        database ekspor internasional.
      </motion.p>
    </div>
  );
}
