import { ArrowLeft, Shield, Sun, CheckCircle2, AlertCircle, ShoppingCart, Search } from "lucide-react";

export default function DesignSystem({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-8 pb-20">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header */}
        <header className="flex items-center justify-between border-b-2 border-gray-200 pb-8">
          <div>
            <h1 className="font-display font-bold text-4xl text-[#2D6A4F] mb-2">Agrou Design System</h1>
            <p className="text-gray-500 font-medium text-lg">Panduan Visual & Komponen UI (Agro-tech E-commerce)</p>
          </div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 bg-white px-6 py-3 rounded-full font-bold text-gray-600 border-2 border-gray-200 hover:border-[#F77F00] hover:text-[#F77F00] transition-colors"
          >
            <ArrowLeft size={20} />
            Kembali ke Aplikasi
          </button>
        </header>

        {/* 1. Color Palette */}
        <section>
          <h2 className="font-display font-bold text-2xl text-gray-900 mb-6 flex items-center gap-2 border-l-4 border-[#F77F00] pl-4">
            1. Color Palette
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <ColorSwatch name="Primary Green" hex="#2D6A4F" colorClass="bg-[#2D6A4F]" textClass="text-white" desc="Shield / Nature" />
            <ColorSwatch name="Harvest Orange" hex="#F77F00" colorClass="bg-[#F77F00]" textClass="text-white" desc="Brand / Selling" />
            <ColorSwatch name="Ocean Blue" hex="#0077B6" colorClass="bg-[#0077B6]" textClass="text-white" desc="Marine / Fishery" />
            <ColorSwatch name="Neutral Cream" hex="#FFFDF7" colorClass="bg-[#FFFDF7]" textClass="text-gray-800" desc="Background" border />
            <ColorSwatch name="Dark Brown" hex="#3E2723" colorClass="bg-[#3E2723]" textClass="text-white" desc="Headlines / Text" />
            <ColorSwatch name="Light Green" hex="#74C69D" colorClass="bg-[#74C69D]" textClass="text-white" desc="Badges / Success" />
          </div>
        </section>

        {/* 2. Typography */}
        <section>
          <h2 className="font-display font-bold text-2xl text-gray-900 mb-6 flex items-center gap-2 border-l-4 border-[#F77F00] pl-4">
            2. Typography System
          </h2>
          <div className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-sm grid md:grid-cols-2 gap-12">
            <div>
              <div className="mb-4">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Display Font - Quicksand</span>
              </div>
              <div className="space-y-6">
                <div>
                  <h1 className="font-display font-bold text-5xl text-[#3E2723]">H1. Solusi Petani</h1>
                  <p className="text-gray-400 text-sm mt-1">Font: Quicksand Bold, 48px</p>
                </div>
                <div>
                  <h2 className="font-display font-bold text-4xl text-[#3E2723]">H2. Koperasi Desa</h2>
                  <p className="text-gray-400 text-sm mt-1">Font: Quicksand Bold, 36px</p>
                </div>
                <div>
                  <h3 className="font-display font-bold text-2xl text-[#3E2723]">H3. Perlindungan Panen Terbaik</h3>
                  <p className="text-gray-400 text-sm mt-1">Font: Quicksand Bold, 24px</p>
                </div>
              </div>
            </div>
            <div>
              <div className="mb-4">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Body Font - Nunito</span>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="font-sans text-lg text-gray-700 leading-relaxed font-semibold">
                    Body Large (Semibold): Agrou hadir untuk menghubungkan produk laut dan kebun langsung dari tangan pahlawan pangan ke meja Anda.
                  </p>
                  <p className="text-gray-400 text-sm mt-1">Font: Nunito SemiBold, 18px</p>
                </div>
                <div>
                  <p className="font-sans text-base text-gray-600 leading-relaxed">
                    Body Regular: Lindungi masa depan panen dan tangkapanmu dengan solusi perlindungan tepercaya. Aman, bersahabat, dan dapat diandalkan!
                  </p>
                  <p className="text-gray-400 text-sm mt-1">Font: Nunito Regular, 16px</p>
                </div>
                <div>
                  <p className="font-sans text-sm text-gray-500">
                    Caption: Dipercaya oleh 12,000+ petani & nelayan di seluruh Nusantara.
                  </p>
                  <p className="text-gray-400 text-sm mt-1">Font: Nunito Regular, 14px</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Component Library */}
        <section>
          <h2 className="font-display font-bold text-2xl text-gray-900 mb-6 flex items-center gap-2 border-l-4 border-[#F77F00] pl-4">
            3. Component Library
          </h2>
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Interactive elements */}
            <div className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-sm space-y-8">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Buttons</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <button className="bg-[#2D6A4F] text-white px-8 py-3 rounded-full font-bold hover:bg-[#1B4332] transition-colors shadow-lg shadow-[#2D6A4F]/30 flex items-center gap-2">
                    <ShoppingCart size={18} />
                    Primary Action
                  </button>
                  <button className="bg-white border-2 border-[#F77F00] text-[#F77F00] px-8 py-3 rounded-full font-bold hover:bg-orange-50 transition-colors flex items-center gap-2">
                    Secondary Outline
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Input Fields</h3>
                <div className="max-w-md relative">
                  <input 
                    type="text" 
                    placeholder="Cari pupuk, alat nelayan..." 
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-full py-3 pl-5 pr-12 focus:outline-none focus:border-[#F77F00] focus:bg-white font-medium text-gray-700 transition-all shadow-sm"
                  />
                  <Search size={20} className="absolute right-4 top-3.5 text-gray-400" />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Chips & Tags</h3>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-[#E76F51]/10 text-[#E76F51] border border-[#E76F51]/20 px-4 py-1.5 rounded-full text-sm font-bold">
                    🔥 Kategori Populer
                  </span>
                  <span className="bg-[#2D6A4F]/10 text-[#2D6A4F] border border-[#2D6A4F]/20 px-4 py-1.5 rounded-full text-sm font-bold">
                    🌿 Pertanian Organik
                  </span>
                  <span className="bg-[#0077B6]/10 text-[#0077B6] border border-[#0077B6]/20 px-4 py-1.5 rounded-full text-sm font-bold">
                    ⚓ Pasokan Nelayan
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Alerts & Badges</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-[#74C69D]/20 border border-[#74C69D]/30 text-[#2D6A4F] p-4 rounded-2xl">
                    <CheckCircle2 size={24} className="text-[#2D6A4F]" />
                    <div>
                      <h4 className="font-bold text-sm">Pembayaran Berhasil!</h4>
                      <p className="text-xs font-medium opacity-80">Pesanan KUD sedang diproses oleh penjual.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-[#FFB703]/20 border border-[#FFB703]/30 text-[#B8860B] p-4 rounded-2xl">
                    <AlertCircle size={24} className="text-[#B8860B]" />
                    <div>
                      <h4 className="font-bold text-sm">Promo Berakhir Hari Ini</h4>
                      <p className="text-xs font-medium opacity-80">Gunakan voucher TANI10 untuk diskon 10%.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Card Showcase */}
            <div className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-sm flex flex-col justify-center items-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
              <h3 className="text-sm font-bold text-gray-400 uppercase w-full max-w-sm mb-4">Card Component UI</h3>
              
              <div className="w-full max-w-sm relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-[#2D6A4F] to-[#74C69D] rounded-4xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative bg-[#FFFDF7] rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                  <div className="h-56 relative overflow-hidden bg-orange-100">
                    <img 
                      src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=800" 
                      alt="Product" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-[#74C69D] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                      <Shield size={12} />
                      Tersertifikasi
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-1.5 text-gray-400 mb-2">
                       <span className="text-xs font-bold uppercase">Agrou Tani</span>
                    </div>
                    <h3 className="font-display font-bold text-xl text-gray-800 mb-2 leading-tight">Paket Perlindungan Panen Padi Extra</h3>
                    <p className="text-gray-500 font-medium text-sm mb-6 line-clamp-2">Cakupan proteksi cuaca ekstrem dan gagal panen untuk 1 Hektar lahan.</p>
                    <div className="flex items-center justify-between">
                      <div className="font-display font-bold text-[#E76F51] text-xl">Rp 150.000<span className="text-sm text-gray-400 font-sans">/bln</span></div>
                      <button className="bg-orange-50 text-[#F77F00] p-3 rounded-xl hover:bg-[#F77F00] hover:text-white transition-colors">
                        <ShoppingCart size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 4. Mascot Placeholder */}
        <section>
          <h2 className="font-display font-bold text-2xl text-gray-900 mb-6 flex items-center gap-2 border-l-4 border-[#F77F00] pl-4">
            4. Mascot Concept (Placeholder)
          </h2>
          <div className="bg-[#FFFDF7] p-8 rounded-3xl border-2 border-orange-100 shadow-sm">
            <p className="text-gray-600 mb-6 font-medium">Karena keterbatasan kuota generasi gambar saat ini, berikut adalah deskripsi konsep maskot yang diterapkan untuk panduan ilustrator:</p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-orange-50 border-2 border-orange-100 p-6 rounded-2xl flex items-start gap-4">
                <div className="bg-[#F77F00] text-white p-3 rounded-xl mt-1">
                  <Sun size={28} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-[#3E2723] mb-2">Pak Tani (Bapak Bumi)</h3>
                  <p className="text-gray-600 text-sm font-medium leading-relaxed">
                    Karakter petani ramah dengan topi caping bambu. Mengenakan kemeja hijau bumi (#2D6A4F) dan selalu tersenyum hangat. Direpresentasikan sedang memegang kotak produk hasil panen atau menunjukkan jempol. Menggambarkan Agrou Pasar.
                  </p>
                </div>
              </div>
              <div className="bg-blue-50 border-2 border-blue-100 p-6 rounded-2xl flex items-start gap-4">
                <div className="bg-[#0077B6] text-white p-3 rounded-xl mt-1">
                  <Shield size={28} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-[#3E2723] mb-2">Bang Nelayan (Sobat Laut)</h3>
                  <p className="text-gray-600 text-sm font-medium leading-relaxed">
                    Karakter nelayan bersemangat dengan ikat kepala khas. Mengenakan jaket pelindung anti-air berwarna biru laut (#0077B6). Direpresentasikan sedang menggenggam jaring perlindungan atau memegang sebuah tameng (shield). Menggambarkan Agrou Tani.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

function ColorSwatch({ name, hex, colorClass, textClass, desc, border }: { name: string, hex: string, colorClass: string, textClass: string, desc: string, border?: boolean }) {
  return (
    <div className="flex flex-col">
      <div className={`h-32 rounded-2xl ${colorClass} ${border ? 'border-2 border-gray-200' : ''} flex items-end p-4 shadow-sm mb-3`}>
        <span className={`font-mono text-sm font-bold ${textClass}`}>{hex}</span>
      </div>
      <span className="font-bold text-gray-800">{name}</span>
      <span className="text-sm font-medium text-gray-500">{desc}</span>
    </div>
  )
}
