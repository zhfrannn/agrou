import { motion } from "motion/react";
import { ScanLine, Store, ShieldCheck } from "lucide-react";

const PROPS = [
  {
    icon: ScanLine,
    title: "Diagnosis Masalah Lahan",
    desc: "Chatbot AI rekomendasikan produk tepat sesuai gejala lahanmu",
    iconColor: "var(--color-forest)",
    iconBg: "rgba(26, 61, 46, 0.10)",
  },
  {
    icon: Store,
    title: "Koperasi Desa Jadi Brand",
    desc: "Produk desa tampil premium dengan storefront dan branding kolektif",
    iconColor: "var(--color-orange)",
    iconBg: "rgba(247, 127, 0, 0.10)",
  },
  {
    icon: ShieldCheck,
    title: "Verified Protected Farm",
    desc: "Rekam jejak proteksi lahan jadi bukti kualitas yang tidak bisa dipalsukan",
    iconColor: "var(--color-forest)",
    iconBg: "rgba(26, 61, 46, 0.10)",
  },
];

export default function ValuePropStrip() {
  return (
    <section className="w-full bg-transparent relative z-10">
      <div className="max-w-[1440px] mx-auto px-8 pb-6 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROPS.map((prop, idx) => {
            const Icon = prop.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="flex items-center gap-4 px-6 py-4 backdrop-blur-md rounded-2xl border shadow-[0_8px_32px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.05)] transition-all duration-300"
                style={{
                  backgroundColor: "rgba(255,255,255,0.40)",
                  borderColor: "rgba(255,255,255,0.30)",
                }}
              >
                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: prop.iconBg }}
                >
                  <Icon
                    size={20}
                    strokeWidth={2.2}
                    style={{ color: prop.iconColor }}
                  />
                </div>

                {/* Text */}
                <div className="min-w-0">
                  <h4
                    className="font-bold text-[14px] leading-tight mb-0.5"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {prop.title}
                  </h4>
                  <p
                    className="text-[12px] leading-snug line-clamp-1 font-medium"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {prop.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
