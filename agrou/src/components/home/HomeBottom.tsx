import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2,
  Shovel,
  ShoppingBag,
  ShieldCheck,
  Store,
  ArrowRight,
  Star,
  TrendingUp,
  Handshake,
  CheckCircle2,
  UserCheck,
  Coins,
  MessageSquare,
  PackageCheck,
  Search,
  BadgeCheck,
  ShoppingCart,
  Calendar,
} from "lucide-react";
import bgCta from "@assets/bg-cta.jpg";

const HOW_IT_WORKS_TABS = [
  { id: "koperasi", label: "Untuk Koperasi", icon: Building2 },
  { id: "petani", label: "Untuk Petani/Nelayan", icon: Shovel },
  { id: "pembeli", label: "Untuk Pembeli", icon: ShoppingBag },
];

const STEPS_DATA: Record<
  string,
  Array<{
    icon: any;
    title: string;
    desc: string;
    color: string;
    textColor: string;
  }>
> = {
  koperasi: [
    {
      icon: UserCheck,
      title: "Daftar & Verifikasi",
      desc: "Buat akun koperasi dan unggah dokumen legalitas pengurus desa.",
      color: "bg-(--color-forest)/10",
      textColor: "text-(--color-forest)",
    },
    {
      icon: ShieldCheck,
      title: "Aktifkan Agrou Tani",
      desc: "Akses katalog produk proteksi lahan dan gunakan chatbot diagnosis untuk anggota.",
      color: "bg-(--color-forest-dark)/10",
      textColor: "text-(--color-forest-dark)",
    },
    {
      icon: Store,
      title: "Buka Storefront di Pasar",
      desc: "Tampilkan produk hasil panen anggota dengan branding koperasi dan stok real-time.",
      color: "bg-(--color-orange)/10",
      textColor: "text-(--color-orange)",
    },
    {
      icon: Coins,
      title: "Terima Revenue Split Otomatis",
      desc: "Sistem hitung dan bagi hasil penjualan ke setiap anggota secara proporsional.",
      color: "bg-(--color-orange-dark)/10",
      textColor: "text-(--color-orange-dark)",
    },
  ],
  petani: [
    {
      icon: Handshake,
      title: "Datang ke Koperasi",
      desc: "Tidak perlu smartphone — cukup datang ke kantor koperasi terdekat.",
      color: "bg-(--color-forest)/10",
      textColor: "text-(--color-forest)",
    },
    {
      icon: MessageSquare,
      title: "Ceritakan Masalah Lahan",
      desc: "Pengurus koperasi input gejalamu ke chatbot diagnosis Agrou.",
      color: "bg-(--color-forest-dark)/10",
      textColor: "text-(--color-forest-dark)",
    },
    {
      icon: PackageCheck,
      title: "Terima Produk Tepat",
      desc: "Produk proteksi yang sesuai dikirim ke titik koperasi, kamu tinggal ambil.",
      color: "bg-(--color-orange)/10",
      textColor: "text-(--color-orange)",
    },
    {
      icon: TrendingUp,
      title: "Jual dengan Harga Lebih Baik",
      desc: "Hasil panenmu dijual lewat storefront koperasi ke pembeli premium.",
      color: "bg-(--color-orange-dark)/10",
      textColor: "text-(--color-orange-dark)",
    },
  ],
  pembeli: [
    {
      icon: Search,
      title: "Cari Produk atau Koperasi",
      desc: "Filter berdasarkan komoditas, lokasi, atau gunakan chatbot kebutuhan.",
      color: "bg-(--color-forest)/10",
      textColor: "text-(--color-forest)",
    },
    {
      icon: BadgeCheck,
      title: "Cek Badge Verified",
      desc: "Lihat rekam jejak proteksi lahan koperasi sebagai jaminan kualitas produk.",
      color: "bg-(--color-forest-dark)/10",
      textColor: "text-(--color-forest-dark)",
    },
    {
      icon: ShoppingCart,
      title: "Pesan Langsung",
      desc: "Order dan bayar di platform, koperasi langsung dikonfirmasi otomatis.",
      color: "bg-(--color-orange)/10",
      textColor: "text-(--color-orange)",
    },
    {
      icon: Calendar,
      title: "Jadi Pembeli Langganan",
      desc: "Atur jadwal pembelian rutin langsung dari koperasi pilihanmu.",
      color: "bg-(--color-orange-dark)/10",
      textColor: "text-(--color-orange-dark)",
    },
  ],
};

const TESTIMONIALS = [
  {
    id: 1,
    name: "Pak Ridwan",
    role: "Ketua Koperasi Gayo Mandiri",
    location: "Bener Meriah, Aceh",
    quote:
      "Sebelum Agrou, setiap anggota bergerak sendiri. Kini kami membeli produk proteksi bersama dan memasarkan kopi ke luar pulau. Omzet koperasi naik 40% dalam setahun.",
    avatar:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200",
    rating: 5,
  },
  {
    id: 2,
    name: "Ibu Ningsih",
    role: "Pengurus KUD Sari Laut",
    location: "Demak, Jawa Tengah",
    quote:
      "Sistem bagi hasil otomatis Agrou menyelesaikan masalah transparansi yang selama ini menjadi sumber konflik. Semua transaksi tercatat dan terdistribusi secara proporsional.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
    rating: 5,
  },
  {
    id: 3,
    name: "Bapak Supardi",
    role: "Ketua Kelompok Tani Subur",
    location: "Cianjur, Jawa Barat",
    quote:
      "Rekam jejak proteksi lahan dari Agrou Tani menjadi modal kepercayaan. Produk kami mendapat badge Verified dan pembeli dari kota pun berani membeli dengan harga premium.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    rating: 5,
  },
];

export default function HomeBottom() {
  const [activeTab, setActiveTab] = useState("koperasi");

  return (
    <div className="w-full bg-(--color-cream)">
      {/* SECTION 1 - HOW IT WORKS */}
      <section className="pt-12 pb-16 max-w-360 mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="font-display font-black text-4xl lg:text-5xl text-gray-900 mb-4">
            Cara Kerja Agrou
          </h2>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
            Dirancang untuk petani, koperasi, dan pembeli dalam satu alur yang
            terintegrasi.
          </p>
        </div>

        <div className="flex justify-center mb-16">
          <div className="bg-(--color-surface) p-2 rounded-full inline-flex flex-wrap items-center justify-center gap-2 border border-(--color-border)">
            {HOW_IT_WORKS_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
                    isActive
                      ? "bg-(--color-forest) text-(--color-text-on-dark) shadow-lg"
                      : "text-(--color-text-secondary) hover:text-(--color-text-primary) hover:bg-(--color-cream)"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-15 left-24 right-24 h-1 bg-gray-100 -z-10 rounded-full"></div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10"
            >
              {STEPS_DATA[activeTab].map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center text-center relative group"
                  >
                    <div className="w-32 h-32 mb-6 rounded-full bg-(--color-surface) shadow-xl shadow-gray-200/50 flex items-center justify-center border-4 border-(--color-border) group-hover:-translate-y-2 transition-transform duration-300">
                      <div
                        className={`w-20 h-20 rounded-full ${step.color} flex items-center justify-center`}
                      >
                        <Icon size={40} className={step.textColor} />
                      </div>
                    </div>

                    <div className="bg-(--color-forest) text-(--color-text-on-dark) text-sm font-black w-8 h-8 rounded-full flex items-center justify-center absolute -top-2.5 right-1/2 translate-x-12 border-4 border-(--color-cream) shadow-sm">
                      {idx + 1}
                    </div>

                    <h3 className="font-display font-bold text-xl text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 font-medium leading-relaxed px-4 text-sm">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* SECTION 2 - SOCIAL PROOF / TESTIMONIALS */}
      <section className="pt-16 pb-16 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD166]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#74C69D]/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-360 mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-display font-black text-4xl text-gray-900">
              Dipercaya oleh Ribuan Koperasi di Seluruh Indonesia
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-(--color-surface) border border-(--color-border) rounded-4xl p-8 shadow-xl shadow-black/10 flex flex-col relative"
              >
                <div className="absolute top-6 right-8 text-(--color-lime) opacity-30 text-6xl font-serif">
                  "
                </div>

                <div className="flex items-center gap-1 mb-6 text-amber-500">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                <p className="text-(--color-text-primary) font-medium text-lg leading-relaxed mb-8 flex-1 relative z-10">
                  "{t.quote}"
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-(--color-border) shrink-0">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 leading-tight">
                      {t.name}
                    </h4>
                    <p className="text-sm font-medium text-gray-500 mb-0.5">
                      {t.role}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-(--color-orange)">
                        {t.location}
                      </span>
                      <span className="bg-(--color-lime) text-(--color-forest-dark) border border-(--color-lime)/20 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2
                          size={10}
                          className="fill-(--color-forest-dark)/10 text-(--color-forest-dark)"
                        />{" "}
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* SECTION 4 - CTA BANNER */}
      <section
        className="w-full relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgCta})` }}
      >
        {/* Cream Overlay (rgba(247,243,231,0.6)) */}
        <div className="absolute inset-0 bg-(--color-cream)/60 z-0" />

        {/* No transition gradient needed as testimonial background is transparent/cream */}

        <div className="max-w-360 mx-auto px-8 pb-16 pt-12 relative z-10">
          <div className="bg-linear-to-r from-(--color-forest) to-(--color-orange) rounded-[3rem] px-8 py-16 md:p-20 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

            <div className="max-w-xl relative z-10 text-center md:text-left">
              <h2 className="font-display font-black text-4xl lg:text-5xl text-white mb-6 leading-tight">
                Bergabung dengan{" "}
                <span className="text-(--color-lime)">2.400+</span> Koperasi
                Aktif
              </h2>
              <p className="text-white/90 text-lg font-medium mb-0">
                Daftarkan koperasi Anda dan mulai manfaatkan ekosistem Agrou.
                Lindungi lahan, pasarkan hasil panen, dan kelola anggota dalam
                satu platform terintegrasi.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <button className="bg-(--color-surface) text-(--color-forest-dark) hover:bg-(--color-lime) hover:text-(--color-forest-dark) px-8 py-4 rounded-full font-bold shadow-xl transition-all hover:scale-105 active:scale-95 text-lg w-full sm:w-auto cursor-pointer">
                Daftar Koperasi Gratis
              </button>
              <button className="bg-(--color-forest-dark)/40 backdrop-blur-md border border-white/30 text-white hover:bg-(--color-forest-dark)/60 px-8 py-4 rounded-full font-bold transition-all text-lg w-full sm:w-auto cursor-pointer">
                Pelajari Lebih Lanjut
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
