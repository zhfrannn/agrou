import { motion } from "motion/react";
import { 
  Target, Telescope, Users, Shield, TrendingUp, Handshake,
  Leaf, Sprout, Building2, Store, BadgeCheck, Heart, Map, ArrowRight,
  Globe, Briefcase, Code, Palette
} from "lucide-react";

const VALUES = [
  {
    title: "Inklusif",
    icon: Users,
    desc: "Teknologi kami dirancang untuk semua — termasuk mereka di pelosok."
  },
  {
    title: "Adil",
    icon: Handshake,
    desc: "Setiap petani berhak atas harga yang sepadan dengan kerja kerasnya."
  },
  {
    title: "Terpercaya",
    icon: Shield,
    desc: "Data yang jujur, sistem yang transparan, dan komitmen yang nyata."
  },
  {
    title: "Berdampak",
    icon: TrendingUp,
    desc: "Setiap fitur yang kami bangun harus menjawab masalah nyata di lapangan."
  }
];

const STATS = [
  {
    icon: Building2,
    num: "2.418",
    label: "Koperasi Aktif",
    sub: "dari 34 provinsi di Indonesia",
    color: "text-[#FFD166]"
  },
  {
    icon: Users,
    num: "89.000+",
    label: "Petani & Nelayan",
    sub: "yang terlayani via koperasi mitra",
    color: "text-[#74C69D]"
  },
  {
    icon: Sprout,
    num: "47",
    label: "Komoditas",
    sub: "dari padi hingga rumput laut",
    color: "text-[#FFB703]"
  },
  {
    icon: Handshake,
    num: "Rp 847 M",
    label: "Total Transaksi",
    sub: "sejak Agrou diluncurkan",
    color: "text-white"
  },
  {
    icon: BadgeCheck,
    num: "1.203",
    label: "Verified Farms",
    sub: "koperasi dengan badge proteksi aktif",
    color: "text-[#F77F00]"
  }
];

const FOUNDERS = [
  {
    name: "Dimas Pratama",
    role: "Co-Founder & CEO",
    roleColor: "bg-[#2D6A4F] text-white",
    bio: "Berlatar belakang agribisnis IPB, Dimas melihat langsung bagaimana tengkulak merugikan petani. Agrou adalah jawabannya.",
    tags: ["Agribisnis", "Product", "Strategy"],
    avatar: "https://api.dicebear.com/7.x/micah/svg?seed=Dimas&backgroundColor=d4f0f0"
  },
  {
    name: "Layla Nurfitri",
    role: "Co-Founder & CTO",
    roleColor: "bg-[#F77F00] text-white",
    bio: "Engineer dengan passion di teknologi inklusif. Percaya bahwa solusi terbaik adalah yang bisa dipakai siapa saja.",
    tags: ["Engineering", "UX", "Inklusivitas"],
    avatar: "https://api.dicebear.com/7.x/micah/svg?seed=Layla&backgroundColor=ffd166&hair=hijab"
  }
];

const TEAM = [
  {
    name: "Ahmad Rasyid",
    role: "Head of Agronomy",
    icon: Sprout,
    avatar: "https://api.dicebear.com/7.x/micah/svg?seed=Ahmad&backgroundColor=b6e3f4"
  },
  {
    name: "Sari Dewanti",
    role: "Head of Koperasi Relations",
    icon: Building2,
    avatar: "https://api.dicebear.com/7.x/micah/svg?seed=Sari&backgroundColor=c0aede"
  },
  {
    name: "Budi Santoso",
    role: "Lead Engineer",
    icon: Code,
    avatar: "https://api.dicebear.com/7.x/micah/svg?seed=Budi&backgroundColor=ffdfbf"
  },
  {
    name: "Fira Aulia",
    role: "Lead Designer",
    icon: Palette,
    avatar: "https://api.dicebear.com/7.x/micah/svg?seed=Fira&backgroundColor=d1d4f9"
  }
];

const PARTNERS_ROW_1 = [
  "Kementerian Pertanian RI", "Kementerian KKP", "Koperasi Merah Putih", "Bappenas", "IPB University"
];
const PARTNERS_ROW_2 = [
  "Telkom Indonesia", "Bank Rakyat Indonesia", "Agro Jabar", "Himpunan Kerukunan Tani", "Inovasi Desa"
];

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-[#FFFDF7] font-sans">
      
      {/* SECTION 1 - HERO ABOUT */}
      <section className="relative pt-24 pb-0 overflow-hidden bg-gradient-to-b from-[#FFFDF7] to-orange-50/30">
        {/* Floating Elements Background */}
        <div className="absolute top-20 left-10 text-orange-200/50 rotate-45"><Leaf size={64} /></div>
        <div className="absolute top-40 right-20 text-green-200/50 -rotate-12"><Sprout size={80} /></div>
        <div className="absolute bottom-40 left-1/4 text-blue-200/40 rotate-12"><span className="text-6xl">≈</span></div>
        <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full border-4 border-dashed border-orange-100 animate-spin-slow"></div>

        <div className="max-w-[1440px] mx-auto px-8 relative z-10 text-center">
          <div className="inline-flex flex-col items-center mb-8">
            <span className="bg-[#2D6A4F]/10 text-[#2D6A4F] px-4 py-2 rounded-full font-bold text-sm mb-6 flex items-center gap-2 border border-[#2D6A4F]/20">
               🌾 Lahir dari Keresahan, Tumbuh untuk Petani
            </span>
            <h1 className="font-display font-black text-5xl lg:text-7xl text-gray-900 leading-tight mb-6 max-w-4xl mx-auto">
              Kami hadir karena petani Indonesia <br className="hidden md:block"/>
              <span className="text-[#F77F00]">layak mendapat lebih.</span>
            </h1>
            <p className="text-xl text-gray-600 font-medium max-w-3xl mx-auto leading-relaxed">
              Agrou dibangun untuk menjawab dua krisis nyata yang selama ini diabaikan — 
              lahan yang tidak terlindungi dan pasar yang tidak adil.
            </p>
          </div>
        </div>

        {/* Hero Panoramic Illustration */}
        <div className="w-full mt-16 relative">
          {/* Logo floating in center */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-10 z-20 bg-white p-4 rounded-full shadow-2xl border-4 border-orange-50">
             <div className="bg-[#F77F00] p-3 rounded-xl text-white transform -rotate-6 shadow-md">
                <Leaf size={32} className="fill-white" />
             </div>
          </div>
          
          <div className="w-full aspect-[21/9] md:aspect-[21/6] relative bg-gradient-to-t from-orange-100 via-orange-50 to-transparent overflow-hidden border-b-8 border-[#2D6A4F]">
            {/* Split Illustration Placeholder */}
            <div className="absolute inset-0 flex">
              {/* Left Side: Shield/Farm */}
              <div className="w-1/2 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-right opacity-60">
                 <div className="absolute inset-0 bg-gradient-to-r from-[#2D6A4F]/40 to-transparent mix-blend-multiply"></div>
              </div>
              {/* Right Side: Brand/Koperasi */}
              <div className="w-1/2 bg-[url('https://images.unsplash.com/photo-1533659288225-78e7c1f83c07?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-left opacity-60">
                 <div className="absolute inset-0 bg-gradient-to-l from-[#F77F00]/40 to-transparent mix-blend-multiply"></div>
              </div>
            </div>
            {/* Center blend overlay */}
            <div className="absolute inset-x-0 bottom-0 top-0 left-1/2 -translate-x-1/2 w-64 bg-gradient-to-r from-transparent via-[#FFFDF7]/80 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* SECTION 2 - ORIGIN STORY */}
      <section className="py-24 bg-white relative">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* LEFT - Illustration */}
            <div className="lg:w-1/2 w-full relative">
              <div className="aspect-[4/3] rounded-[2rem] bg-orange-100 overflow-hidden shadow-2xl relative border-8 border-white p-2">
                 <img 
                   src="https://images.unsplash.com/photo-1589139884568-15a0c3272d5b?auto=format&fit=crop&q=80&w=800" 
                   alt="Founders with farmers" 
                   className="w-full h-full object-cover rounded-[1.5rem]" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-orange-900/40 to-transparent rounded-[1.5rem]"></div>
              </div>
              
              {/* Decorative blobs */}
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#F77F00] rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#2D6A4F] rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
            </div>

            {/* RIGHT - Story Text */}
            <div className="lg:w-1/2 w-full lg:pl-8">
              <div className="inline-flex bg-orange-50 text-[#F77F00] font-bold text-sm px-4 py-2 rounded-lg mb-6">
                Bagaimana Agrou Lahir
              </div>
              <h2 className="font-display font-black text-4xl lg:text-5xl text-gray-900 mb-8 leading-tight">
                Dari desa ke layar — perjalanan yang dimulai dari satu pertanyaan sederhana.
              </h2>
              
              <div className="space-y-6 text-lg text-gray-600 font-medium leading-relaxed">
                <p>
                  Semuanya bermula dari kenyataan yang tidak bisa kami abaikan — petani Indonesia menghasilkan pangan untuk jutaan orang, namun mereka sendiri sering tidak tahu cara melindungi lahannya dengan tepat.
                </p>
                <p>
                  Di sisi lain, koperasi desa yang punya produk luar biasa tidak punya cara untuk menunjukkan kualitas mereka ke dunia. Produk premium dijual murah ke tengkulak, bukan karena kualitasnya kurang — tapi karena aksesnya tidak ada.
                </p>
                <p className="font-bold text-gray-800 border-l-4 border-[#2D6A4F] pl-6 italic">
                  "Agrou lahir sebagai jawaban atas dua keresahan itu sekaligus. Satu platform. Dua solusi nyata. Untuk petani, nelayan, dan koperasi desa di seluruh Indonesia."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - VISI MISI & VALUES */}
      <section className="py-24 bg-[#F0F7F0] relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2D6A4F]/5 rounded-bl-[100%] pointer-events-none"></div>

        <div className="max-w-[1440px] mx-auto px-8 relative z-10">
          
          {/* VISI MISI TOP */}
          <div className="flex flex-col md:flex-row gap-8 mb-20">
            {/* VISI */}
            <div className="flex-1 bg-white p-10 rounded-[2rem] shadow-xl shadow-[#2D6A4F]/5 border-t-8 border-[#2D6A4F]">
              <div className="w-16 h-16 bg-[#2D6A4F]/10 rounded-2xl flex items-center justify-center mb-6">
                <Telescope size={32} className="text-[#2D6A4F]" />
              </div>
              <h3 className="font-display font-black text-3xl text-gray-900 mb-4">Visi Kami</h3>
              <p className="text-gray-600 text-lg leading-relaxed font-medium">
                Menjadi ekosistem digital agro marine terpercaya yang memberdayakan setiap petani dan nelayan Indonesia untuk hidup lebih sejahtera melalui teknologi yang inklusif dan mudah dijangkau.
              </p>
            </div>

            {/* MISI */}
            <div className="flex-1 bg-white p-10 rounded-[2rem] shadow-xl shadow-[#F77F00]/5 border-t-8 border-[#F77F00]">
              <div className="w-16 h-16 bg-[#F77F00]/10 rounded-2xl flex items-center justify-center mb-6">
                <Target size={32} className="text-[#F77F00]" />
              </div>
              <h3 className="font-display font-black text-3xl text-gray-900 mb-6">Misi Kami</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#F77F00] mt-2.5 shrink-0"></div>
                  <span className="text-gray-600 font-medium text-lg">Menyediakan sistem diagnosis proteksi lahan yang akurat dan terjangkau untuk semua komoditas.</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#F77F00] mt-2.5 shrink-0"></div>
                  <span className="text-gray-600 font-medium text-lg">Membangun infrastruktur digital untuk koperasi desa agar bisa bersaing di pasar premium nasional.</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#F77F00] mt-2.5 shrink-0"></div>
                  <span className="text-gray-600 font-medium text-lg">Menjadikan koperasi sebagai jembatan digital bagi petani & nelayan yang belum melek teknologi.</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#F77F00] mt-2.5 shrink-0"></div>
                  <span className="text-gray-600 font-medium text-lg">Menciptakan siklus ekonomi yang adil — dari lahan sehat hingga harga jual yang layak.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* VALUES ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {VALUES.map((val, i) => {
              const Icon = val.icon;
              return (
                <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-green-100 flex flex-col items-center text-center group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#2D6A4F] transition-colors">
                    <Icon size={36} className="text-[#2D6A4F] group-hover:text-white transition-colors" />
                  </div>
                  <h4 className="font-display font-bold text-2xl text-gray-900 mb-3">{val.title}</h4>
                  <p className="text-gray-500 font-medium leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 4 - DAMPAK & ANGKA */}
      <section className="py-24 bg-[#1B4332] relative overflow-hidden">
        {/* Subtle Map Background Pattern */}
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')]"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#2D6A4F] rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#F77F00] blur-[120px] rounded-full opacity-30"></div>

        <div className="max-w-[1440px] mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-display font-black text-4xl lg:text-5xl text-white mb-4">Dampak Nyata yang Terus Bertumbuh</h2>
            <p className="text-xl text-[#74C69D] font-medium max-w-2xl mx-auto">
              Bukan sekadar angka — ini cerita petani dan nelayan yang hidupnya berubah.
            </p>
          </div>

          {/* 5 Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 gap-y-12 mb-20 text-center">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 backdrop-blur-md border border-white/5`}>
                     <Icon size={28} className={stat.color} />
                  </div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`font-display font-black text-4xl lg:text-5xl mb-2 ${stat.color} drop-shadow-lg`}
                  >
                    {stat.num}
                  </motion.div>
                  <p className="text-white font-bold text-lg mb-1">{stat.label}</p>
                  <p className="text-[#74C69D] text-sm font-medium">{stat.sub}</p>
                </div>
              );
            })}
          </div>

          {/* Map Illustration Place */}
          <div className="w-full max-w-4xl mx-auto border-4 border-white/10 rounded-[3rem] p-4 bg-white/5 backdrop-blur-sm relative overflow-hidden">
             {/* Map Placeholder */}
             <div className="aspect-[2/1] w-full bg-[#153427] rounded-[2.5rem] relative flex items-center justify-center border border-[#2D6A4F]/50 shadow-inner">
                {/* Dots representing activity */}
                <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-[#FFB703] rounded-full shadow-[0_0_15px_#FFB703] animate-pulse"></div>
                <div className="absolute top-[40%] left-[30%] w-2 h-2 bg-[#F77F00] rounded-full shadow-[0_0_10px_#F77F00]"></div>
                <div className="absolute top-[60%] left-[45%] w-4 h-4 bg-[#FFD166] rounded-full shadow-[0_0_20px_#FFD166] animate-pulse"></div>
                <div className="absolute top-[55%] left-[50%] w-3 h-3 bg-[#FFB703] rounded-full shadow-[0_0_15px_#FFB703]"></div>
                <div className="absolute top-[30%] left-[70%] w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white] animate-ping"></div>
                <div className="absolute top-[45%] left-[80%] w-3 h-3 bg-[#74C69D] rounded-full shadow-[0_0_15px_#74C69D]"></div>
                
                <p className="text-[#2D6A4F] font-bold text-lg opacity-50 tracking-widest">[ Peta Aktivitas Koperasi ]</p>
             </div>
          </div>

        </div>
      </section>

      {/* SECTION 5 - TIM & FOUNDERS */}
      <section className="py-24 bg-white relative">
        <div className="max-w-[1440px] mx-auto px-8 relative z-10">
          
          <div className="text-center mb-16">
            <h2 className="font-display font-black text-4xl lg:text-5xl text-gray-900 mb-4">Orang-Orang di Balik Agrou</h2>
            <p className="text-xl text-gray-500 font-medium">Tim kecil dengan misi besar.</p>
          </div>

          {/* Founders Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
             {FOUNDERS.map((f, i) => (
               <div key={i} className="bg-gray-50 rounded-[2.5rem] p-8 md:p-10 border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-sm hover:shadow-xl transition-shadow cursor-default group">
                   <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-8 border-white overflow-hidden shadow-lg shrink-0 bg-white group-hover:scale-105 transition-transform duration-500">
                     <img src={f.avatar} alt={f.name} className="w-full h-full object-cover" />
                   </div>
                   <div className="text-center md:text-left flex-1">
                      <h3 className="font-display font-black text-3xl text-gray-900 mb-3">{f.name}</h3>
                      <div className={`inline-flex px-4 py-1.5 rounded-full text-sm font-bold mb-6 shadow-sm ${f.roleColor}`}>
                         {f.role}
                      </div>
                      <p className="text-gray-600 font-medium mb-6 leading-relaxed">"{f.bio}"</p>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                        {f.tags.map(tag => (
                          <span key={tag} className="bg-white border border-gray-200 text-gray-500 text-xs font-bold px-3 py-1 rounded-md">{tag}</span>
                        ))}
                      </div>
                   </div>
               </div>
             ))}
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((t, i) => {
              const Icon = t.icon;
              return (
                <div key={i} className="bg-white rounded-3xl p-6 border border-gray-200 text-center shadow-sm hover:border-orange-200 transition-colors">
                   <div className="w-24 h-24 mx-auto rounded-full border-4 border-gray-50 overflow-hidden mb-4 bg-gray-50">
                     <img src={t.avatar} alt={t.name} className="w-full h-full object-cover"/>
                   </div>
                   <h4 className="font-bold text-gray-900 text-lg mb-1">{t.name}</h4>
                   <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 rounded-full py-1.5 px-3 w-max mx-auto border border-gray-100">
                     <Icon size={12} className="text-[#F77F00]" /> {t.role}
                   </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 6 - MITRA & DUKUNGAN */}
      <section className="py-24 bg-[#FFFDF7] border-y border-orange-50 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-8 relative z-10 text-center">
          
          <h2 className="font-display font-black text-4xl text-gray-900 mb-4">Dipercaya & Didukung Oleh</h2>
          <p className="text-lg text-gray-500 font-medium mb-16 max-w-2xl mx-auto">
             Bersama mitra terpercaya untuk dampak yang lebih luas.
          </p>

          <div className="flex flex-col gap-6 items-center">
            {/* ROW 1 */}
            <div className="flex flex-wrap justify-center gap-4 lg:gap-8 w-full max-w-5xl">
               {PARTNERS_ROW_1.map((p, i) => (
                 <div key={i} className="h-20 px-8 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-gray-400 font-bold text-sm shadow-sm hover:bg-gray-50 hover:text-gray-600 transition-colors cursor-default whitespace-nowrap">
                   {p}
                 </div>
               ))}
            </div>
            
            {/* ROW 2 */}
            <div className="flex flex-wrap justify-center gap-4 lg:gap-8 w-full max-w-5xl">
               {PARTNERS_ROW_2.map((p, i) => (
                 <div key={i} className="h-20 px-8 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-gray-400 font-bold text-sm shadow-sm hover:bg-gray-50 hover:text-gray-600 transition-colors cursor-default whitespace-nowrap">
                   {p}
                 </div>
               ))}
            </div>
          </div>

          <div className="mt-16 pt-10 border-t border-gray-200 max-w-2xl mx-auto">
            <p className="text-gray-500 font-medium mb-4">Tertarik bermitra dengan Agrou?</p>
            <a href="#" className="inline-flex items-center gap-2 text-[#2D6A4F] font-bold hover:text-[#F77F00] transition-colors border-b-2 border-transparent hover:border-[#F77F00] pb-1">
              Hubungi Kami untuk Kemitraan <ArrowRight size={18} />
            </a>
          </div>

        </div>
      </section>

      {/* SECTION 7 - CTA PENUTUP */}
      <section className="py-24 bg-gradient-to-br from-[#F77F00] to-[#2D6A4F] relative overflow-hidden">
        
        {/* Large Decorative Illustration Scene */}
        <div className="absolute bottom-0 left-0 right-0 h-64 opacity-20 pointer-events-none overflow-hidden flex justify-center items-end text-[200px] gap-8">
           <span className="translate-y-16">🧑‍🌾</span>
           <span className="translate-y-8">👨‍🎣</span>
           <span className="translate-y-16">👩‍🌾</span>
           <span className="translate-y-8">🧑‍🏭</span>
        </div>

        <div className="absolute -top-40 -left-40 w-96 h-96 bg-yellow-300 rounded-full blur-[100px] opacity-40"></div>

        <div className="max-w-4xl mx-auto px-8 relative z-10 text-center">
          
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl">
             <div className="bg-[#2D6A4F] p-2.5 rounded-lg text-white transform -rotate-12 shadow-sm">
                <Leaf size={28} className="fill-white" />
             </div>
          </div>

          <h2 className="font-display font-black text-5xl lg:text-6xl text-white mb-16 leading-tight drop-shadow-md">
            Bergabunglah. <br />Bersama kita ubah pertanian Indonesia.
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button className="w-full sm:w-auto bg-white text-[#2D6A4F] hover:bg-green-50 px-8 py-5 rounded-full font-bold shadow-2xl transition-all hover:scale-105 active:scale-95 text-lg flex items-center justify-center gap-2">
              <Shield size={20} className="fill-[#2D6A4F]/20" /> Mulai di Tani
            </button>
            <button className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-5 rounded-full font-bold transition-all text-lg flex items-center justify-center gap-2">
              <Store size={20} /> Daftarkan Koperasimu
            </button>
          </div>

          <p className="text-white/80 font-medium">
            Sudah punya akun? <a href="#" className="text-white font-bold hover:underline">Masuk di sini →</a>
          </p>

        </div>
      </section>

    </div>
  );
}
