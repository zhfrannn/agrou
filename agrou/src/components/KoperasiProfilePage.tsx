import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, Calendar, Users, Star, MessageSquare, Package, 
  Trophy, Shield, Mail, Phone, Globe, Award, Leaf, Sprout, 
  Wind, ShoppingCart, ChevronRight, MessageCircle, Info, BadgeCheck, CheckCircle2, ShoppingBag
} from "lucide-react";

const PRODUCTS = [
  {
    id: 1,
    name: "Kopi Arabika Gayo Natural",
    price: "Rp 180.000",
    unit: "/ kg",
    stock: "320 kg",
    minOrder: "1 kg",
    image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 2,
    name: "Kopi Honey Process",
    price: "Rp 210.000",
    unit: "/ kg",
    stock: "180 kg",
    minOrder: "1 kg",
    image: "https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 3,
    name: "Kopi Green Bean",
    price: "Rp 95.000",
    unit: "/ kg",
    stock: "320 kg",
    minOrder: "5 kg",
    image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 4,
    name: "Kopi Bubuk Signature Blend",
    price: "Rp 75.000",
    unit: "/ 250gr",
    stock: "500 pcs",
    minOrder: "1 pcs",
    image: "https://images.unsplash.com/photo-1587049352847-4d4b1ed74dc4?auto=format&fit=crop&q=80&w=600"
  }
];

const WEIGHT_OPTIONS = ["250gr", "500gr", "1kg", "5kg"];
const TABS = ["Profil & Cerita", "Katalog Produk", "Ulasan", "Informasi"];

export default function KoperasiProfilePage() {
  const [activeTab, setActiveTab] = useState("Profil & Cerita");
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isTabLoading, setIsTabLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (tab: string) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setIsTabLoading(true);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 600);
  };

  return (
    <div className="w-full bg-[#FFFDF7] min-h-screen pb-24">
      
      {/* TOP HERO SECTION */}
      <section className="w-full h-[320px] relative bg-[#2c1c14]">
        {/* Banner Image */}
        <img 
          src="https://images.unsplash.com/photo-1524803507119-a9a3b6f2fb48?auto=format&fit=crop&q=80&w=1920" 
          alt="Gayo Landscape" 
          className="w-full h-full object-cover opacity-80"
        />
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent h-32"></div>

        {/* Floating Badge overlay top-right */}
        <div className="absolute top-6 right-8 bg-gradient-to-r from-[#FFB703] to-[#F77F00] text-white px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 border border-white/20 backdrop-blur-md">
          <Award size={18} className="fill-white/80" />
          <span className="font-bold text-sm tracking-wide">Verified Protected Farm — Aktif 8 Bulan</span>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-8 relative -mt-16">
        
        {/* KOPERASI IDENTITY ROW */}
        <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-8">
          
          <div className="flex flex-col lg:flex-row gap-6 lg:items-end">
            {/* KOPERASI AVATAR */}
            <div className="w-[100px] h-[100px] lg:w-[120px] lg:h-[120px] rounded-full border-[6px] border-white overflow-hidden bg-white shadow-lg shrink-0 -mt-20 lg:-mt-24 relative z-10">
              {isPageLoading ? (
                <div className="w-full h-full bg-gray-200 animate-pulse"></div>
              ) : (
                <img src="https://ui-avatars.com/api/?name=Gayo+Maju&background=F77F00&color=fff&size=200" alt="Logo Koperasi" className="w-full h-full object-cover" />
              )}
            </div>

            {/* IDENTITY INFO */}
            {isPageLoading ? (
              <div className="flex-1 pb-1 animate-pulse">
                <div className="h-10 bg-gray-200 rounded-xl w-3/4 mb-4"></div>
                <div className="h-5 bg-gray-100 rounded-lg w-1/2 mb-6"></div>
                <div className="flex gap-3">
                  <div className="h-8 bg-orange-50 rounded-lg w-24"></div>
                  <div className="h-8 bg-gray-100 rounded-lg w-24"></div>
                  <div className="h-8 bg-green-50 rounded-lg w-28"></div>
                </div>
              </div>
            ) : (
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="font-display font-black text-3xl lg:text-4xl text-gray-900 leading-none">Koperasi Tani Maju Gayo</h1>
                  <BadgeCheck size={28} className="text-[#38b000] fill-[#38b000]/20" />
                </div>
                
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-gray-600 mb-4">
                  <div className="flex items-center gap-1.5"><MapPin size={16} className="text-[#F77F00]" /> Bener Meriah, Aceh, Indonesia</div>
                  <div className="flex items-center gap-1.5"><Calendar size={16} className="text-[#2D6A4F]" /> Berdiri sejak 2012</div>
                  <div className="flex items-center gap-1.5"><Users size={16} className="text-[#0077B6]" /> 47 Anggota Aktif</div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="bg-orange-50 text-[#F77F00] px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold border border-orange-100"><Star size={14} className="fill-[#F77F00]"/> 4.9/5.0</div>
                  <div className="bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold border border-gray-100"><MessageCircle size={14}/> 124 Ulasan</div>
                  <div className="bg-[#2D6A4F]/10 text-[#2D6A4F] px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold border border-[#74C69D]/30"><Package size={14}/> 4 Produk Aktif</div>
                  <div className="bg-blue-50 text-[#0077B6] px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold border border-blue-100"><Trophy size={14}/> Terjual 2.847 kg</div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDE ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 pb-1">
            {isPageLoading ? (
              <>
                <div className="h-12 bg-gray-200 rounded-xl w-40 animate-pulse"></div>
                <div className="h-12 bg-orange-100 rounded-xl w-48 animate-pulse"></div>
              </>
            ) : (
              <>
                <button className="bg-white border-2 border-[#2D6A4F] text-[#2D6A4F] hover:bg-green-50 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm">
                  <MessageSquare size={18} /> Hubungi Koperasi
                </button>
                <button onClick={() => handleTabChange("Katalog Produk")} className="bg-[#F77F00] hover:bg-[#E76F51] text-white border-2 border-transparent px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm shadow-[#F77F00]/20">
                  <ShoppingBag size={18} /> Lihat Semua Produk
                </button>
              </>
            )}
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 sticky top-20 z-40 mb-10 flex overflow-x-auto scrollbar-hide">
          {TABS.map(tab => (
            <button 
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-8 py-3.5 rounded-xl font-bold text-sm transition-all shrink-0 ${
                activeTab === tab 
                ? "bg-gray-900 text-white shadow-md relative" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        <AnimatePresence mode="wait">

          {/* TAB 1: PROFIL & CERITA */}
          {activeTab === "Profil & Cerita" && (
            <motion.div 
              key="profil"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {isPageLoading || isTabLoading ? (
                <>
                  <div className="lg:col-span-8 space-y-10">
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-200 rounded-lg w-48 mb-4"></div>
                      <div className="h-32 bg-gray-100 rounded-2xl w-full"></div>
                    </div>
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-200 rounded-lg w-56 mb-6"></div>
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="h-40 bg-gray-100 rounded-2xl flex-1"></div>
                        <div className="h-40 bg-gray-100 rounded-2xl flex-1"></div>
                        <div className="h-40 bg-gray-100 rounded-2xl flex-1"></div>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-4 space-y-6">
                    <div className="h-48 bg-green-50 rounded-2xl animate-pulse"></div>
                    <div className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>
                    <div className="h-32 bg-gray-100 rounded-2xl animate-pulse"></div>
                  </div>
                </>
              ) : (
                <>
                  {/* LEFT COLUMN (65%) -> 8 cols */}
                  <div className="lg:col-span-8 space-y-10">
                
                {/* Tentang Kami */}
                <section>
                  <h3 className="font-display font-bold text-2xl text-gray-900 mb-4 flex items-center gap-2">
                    Tentang Kami
                  </h3>
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm leading-relaxed text-gray-700 font-medium text-lg">
                    <p>
                      Koperasi Tani Maju Gayo berdiri sejak 2012 di dataran tinggi Bener Meriah, Aceh. Kami adalah kumpulan petani kopi arabika generasi ketiga yang mewarisi tradisi bertani ramah lingkungan selama puluhan tahun. Kopi kami dipanen secara selektif dan diproses di bawah pengawasan ketat, memastikan setiap tetes memberikan profil rasa yang kompleks, manis, dan kaya.
                    </p>
                  </div>
                </section>

                {/* Proses Produksi Kami */}
                <section>
                  <h3 className="font-display font-bold text-2xl text-gray-900 mb-6">Proses Produksi Kami</h3>
                  <div className="flex flex-col md:flex-row gap-4 relative">
                    {/* Connector line */}
                    <div className="hidden md:block absolute top-[40px] left-20 right-20 h-1 bg-gray-100 -z-10 rounded-full"></div>
                    
                    <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center relative z-10 group hover:border-[#2D6A4F] transition-colors">
                      <div className="w-16 h-16 bg-[#2D6A4F]/10 text-[#2D6A4F] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Sprout size={32} />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">Tanam & Rawat</h4>
                      <p className="text-sm text-gray-500 font-medium">Dirawat organik di iklim ideal dataran tinggi 1.400 mdpl.</p>
                    </div>

                    <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center relative z-10 group hover:border-[#F77F00] transition-colors">
                      <div className="w-16 h-16 bg-[#F77F00]/10 text-[#F77F00] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                         <Leaf size={32} />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">Panen Selektif</h4>
                      <p className="text-sm text-gray-500 font-medium">Hanya memetik ceri kopi merah matang sempurna (petik merah).</p>
                    </div>

                    <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center relative z-10 group hover:border-[#E76F51] transition-colors">
                      <div className="w-16 h-16 bg-[#E76F51]/10 text-[#E76F51] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Package size={32} />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">Proses & Kemas</h4>
                      <p className="text-sm text-gray-500 font-medium">Diproses higienis dari cuci hingga sangrai standar artisan.</p>
                    </div>
                  </div>
                </section>

                {/* Foto Aktivitas */}
                <section>
                  <h3 className="font-display font-bold text-2xl text-gray-900 mb-6">Foto Aktivitas</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden group">
                      <img src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=600" alt="Kebun pagi" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="bg-black/50 absolute pl-4 pb-2 bottom-0 w-full opacity-0 group-hover:opacity-100 transition-opacity">
                         <p className="text-white font-medium text-sm pt-4">Kebun kopi di pagi hari</p>
                      </div>
                    </div>
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden group relative">
                      <img src="https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&q=80&w=600" alt="Panen" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="bg-black/50 absolute left-0 bottom-0 w-full p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                         <p className="text-white font-medium text-sm">Petani memanen biji</p>
                      </div>
                    </div>
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden group relative">
                      <img src="https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&q=80&w=600" alt="Penjemuran" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute left-0 bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                         <p className="text-white font-medium text-sm">Proses penjemuran natural</p>
                      </div>
                    </div>
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden group relative">
                      <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=600" alt="Pengemasan" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute left-0 bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                         <p className="text-white font-medium text-sm">Pengemasan higienis</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN (35%) -> 4 cols */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Box 2 - Status Verifikasi */}
                <div className="bg-[#2D6A4F] text-white p-6 rounded-2xl shadow-xl shadow-[#2D6A4F]/20 relative overflow-hidden">
                   <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                   
                   <div className="flex items-center gap-3 mb-4">
                     <div className="bg-gradient-to-tr from-[#FFB703] to-[#F77F00] w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg border border-white/20">
                       <Award size={24} className="fill-white/80" />
                     </div>
                     <h3 className="font-display font-bold text-lg leading-tight uppercase tracking-wider text-[#FFD166]">Verified Protected Farm</h3>
                   </div>
                   
                   <p className="text-sm font-medium text-white/90 mb-6 leading-relaxed">
                     Koperasi ini telah aktif menggunakan sistem proteksi lahan Agrou Tani selama 8 bulan berturut-turut.
                   </p>
                   
                   <div>
                     <div className="flex justify-between text-xs font-bold mb-2">
                       <span>Progres ke tingkat Gold</span>
                       <span>8/10 Bulan</span>
                     </div>
                     <div className="w-full bg-black/20 rounded-full h-2 mb-2 border border-white/10">
                       <div className="bg-gradient-to-r from-[#FFD166] to-[#F77F00] h-2 rounded-full shadow-[0_0_10px_#F77F00]" style={{ width: '80%' }}></div>
                     </div>
                     <p className="text-[10px] text-white/70 font-medium">2 bulan lagi: Gold Verified Status</p>
                   </div>
                </div>

                {/* Box 1 - Informasi Koperasi */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Info size={18} className="text-gray-400" /> Informasi Koperasi
                  </h3>
                  <ul className="space-y-4 text-sm">
                    <li className="flex items-start gap-3">
                      <BadgeCheck size={16} className="text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-gray-500 font-medium text-xs mb-0.5">NIK Koperasi</span>
                        <span className="font-bold text-gray-800">KOP-2024-00847</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Users size={16} className="text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-gray-500 font-medium text-xs mb-0.5">Ketua Pengurus</span>
                        <span className="font-bold text-gray-800">Bapak Ahmad Zulkarnaen</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Phone size={16} className="text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-gray-500 font-medium text-xs mb-0.5">Kontak</span>
                        <span className="font-bold text-gray-800">+62 812-xxxx-xxxx</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Mail size={16} className="text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-gray-500 font-medium text-xs mb-0.5">Email Resmi</span>
                        <span className="font-bold text-[#F77F00]">gayomaju@agrou.id</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Globe size={16} className="text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-gray-500 font-medium text-xs mb-0.5">Bergabung Agrou</span>
                        <span className="font-bold text-gray-800">Maret 2024</span>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Box 3 - Komoditas Unggulan */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4">Komoditas Unggulan</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-[#5c3a21]/5 text-[#5c3a21] border border-[#5c3a21]/20 px-3 py-1.5 rounded-lg text-xs font-bold">☕ Kopi Arabika</span>
                    <span className="bg-[#2D6A4F]/5 text-[#2D6A4F] border border-[#2D6A4F]/20 px-3 py-1.5 rounded-lg text-xs font-bold">🌿 Rempah Lokal</span>
                    <span className="bg-[#F77F00]/5 text-[#F77F00] border border-[#F77F00]/20 px-3 py-1.5 rounded-lg text-xs font-bold">🫙 Produk Olahan</span>
                  </div>
                </div>

                {/* Box 4 - Anggota Terkait */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
                    Anggota Terkait
                    <span className="text-[#2D6A4F] text-xs underline cursor-pointer">Lihat semua</span>
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      <img className="w-10 h-10 rounded-full border-2 border-white bg-gray-100" src="https://ui-avatars.com/api/?name=Zulkarnaen&background=2D6A4F&color=fff" alt="Member 1" />
                      <img className="w-10 h-10 rounded-full border-2 border-white bg-gray-100" src="https://ui-avatars.com/api/?name=Hasan&background=F77F00&color=fff" alt="Member 2" />
                      <img className="w-10 h-10 rounded-full border-2 border-white bg-gray-100" src="https://ui-avatars.com/api/?name=Suparman&background=0077B6&color=fff" alt="Member 3" />
                    </div>
                    <div className="text-xs font-bold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200">
                      + 44 anggota lainnya
                    </div>
                  </div>
                </div>

              </div>
                </>
              )}
            </motion.div>
          )}

          {/* TAB 2: KATALOG PRODUK */}
          {activeTab === "Katalog Produk" && (
            <motion.div 
              key="katalog"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              {/* Filter Bar */}
              {isTabLoading ? (
                <div className="flex items-center gap-3 mb-8 animate-pulse">
                  {[1, 2, 3, 4].map(idx => (
                    <div key={idx} className="h-10 w-24 bg-gray-200 rounded-full"></div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                  {["Semua", "☕ Kopi", "🌿 Rempah", "🫙 Olahan"].map((f) => (
                    <button 
                      key={f}
                      onClick={() => setActiveFilter(f)}
                    className={`px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-colors border-2 ${
                      activeFilter === f 
                      ? "bg-[#F77F00] text-white border-[#F77F00] shadow-md shadow-[#F77F00]/20" 
                      : "bg-white text-gray-600 border-gray-200 hover:border-orange-200 hover:bg-orange-50"
                    }`}
                  >
                    {f}
                  </button>
                  ))}
                </div>
              )}

              {/* Product Grid */}
              {isTabLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
                  {[1, 2, 3, 4, 5, 6].map(idx => (
                    <div key={idx} className="bg-white rounded-3xl border border-gray-100 overflow-hidden animate-pulse">
                      <div className="h-56 bg-gray-200"></div>
                      <div className="p-6 flex flex-col gap-4">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                        <div className="h-12 bg-gray-100 rounded-xl w-full mt-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
                  {PRODUCTS.map((prod, idx) => (
                  <motion.div 
                    key={prod.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:-translate-y-1 hover:shadow-xl hover:border-orange-100 transition-all"
                  >
                    {/* Header Image */}
                    <div className="h-56 relative overflow-hidden bg-gray-100">
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-gray-800 shadow-sm border border-white/50 flex items-center gap-1">
                        <MapPin size={12} className="text-[#F77F00]"/> Aceh
                      </div>
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-[#FFB703] to-[#F77F00] w-8 h-8 rounded-full shadow-lg border border-white/20 flex flex-col items-center justify-center">
                        <Award size={14} className="fill-white/80 text-white" />
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-display font-bold text-xl text-gray-900 mb-4 leading-tight">{prod.name}</h3>

                      <div className="mb-6">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Pilih Ukuran:</p>
                        <div className="flex flex-wrap gap-2">
                          {WEIGHT_OPTIONS.map((w, i) => (
                            <button key={i} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${i === 2 ? 'bg-[#5c3a21] text-white border-[#5c3a21]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#5c3a21]'}`}>
                              {w}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-orange-50/50 border border-orange-100/50 rounded-xl p-3 flex items-center justify-between mb-6">
                        <span className="text-sm font-bold text-gray-600 flex items-center gap-1.5"><Package size={16} className="text-[#F77F00]" /> Stok: {prod.stock}</span>
                        <span className="text-xs font-bold text-gray-500">Min. {prod.minOrder}</span>
                      </div>

                      <div className="mt-auto">
                        <div className="flex items-end gap-1 mb-4">
                           <div className="font-display font-black text-[#F77F00] text-2xl leading-none">{prod.price}</div>
                           <div className="text-sm font-semibold text-gray-500 mb-0.5">{prod.unit}</div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <button className="bg-white border-2 border-gray-200 hover:border-[#2D6A4F] hover:text-[#2D6A4F] text-gray-700 font-bold py-3 px-2 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 whitespace-nowrap text-sm">
                            <ShoppingCart size={18} /> + Keranjang
                          </button>
                          <button className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold py-3 px-2 rounded-xl transition-colors shadow-md shadow-[#2D6A4F]/20 flex items-center justify-center whitespace-nowrap text-sm">
                            Pesan Langsung
                          </button>
                        </div>
                      </div>
                    </div>

                  </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* DUMMY STATES FOR OTHER TABS */}
          {activeTab === "Ulasan" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
              <Star size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Ulasan Pembeli</h3>
              <p className="text-gray-500">Ada 124 ulasan untuk koperasi ini. Area ini dalam tahap pengembangan.</p>
            </motion.div>
          )}

          {activeTab === "Informasi" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
               <Info size={48} className="mx-auto text-gray-300 mb-4" />
               <h3 className="text-2xl font-bold text-gray-800 mb-2">Informasi Lanjut</h3>
               <p className="text-gray-500">Kebijakan pengembalian, perizinan, dan dokumen pendukung.</p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
