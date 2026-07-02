import React from "react";
import {
  Leaf,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Shield,
  Store,
} from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="text-white pt-12 pb-6 border-t-4"
      style={{
        backgroundColor: "var(--color-forest)",
        borderColor: "var(--color-lime)",
      }}
    >
      <div className="max-w-360 mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Column 1: Logo & Tagline */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 text-white mb-4">
              <div
                className="p-1 rounded-lg text-white transform -rotate-6 shadow-md"
                style={{ backgroundColor: "var(--color-orange)" }}
              >
                <Leaf size={18} className="fill-white" />
              </div>
              <span
                className="font-display font-black text-2xl tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Agrou
              </span>
            </div>
            <p className="text-sm text-white/80 font-medium mb-4 leading-relaxed">
              Platform terintegrasi untuk koperasi desa, petani, dan pembeli.
              Membangun rantai nilai pertanian Indonesia yang transparan dan
              berkeadilan.
            </p>
            <div className="flex items-center gap-3">
              <button
                className="bg-white/10 text-white p-2 rounded-xl border border-white/10 transition-colors hover:opacity-80"
                style={
                  { "--hover-bg": "var(--color-orange)" } as React.CSSProperties
                }
              >
                <Instagram size={18} />
              </button>
              <button className="bg-white/10 text-white p-2 rounded-xl border border-white/10 transition-colors hover:opacity-80">
                <Facebook size={18} />
              </button>
            </div>
          </div>

          {/* Column 2: Agrou Tani */}
          <div>
            <h4
              className="font-bold text-white text-base mb-4 flex items-center gap-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <Shield size={16} style={{ color: "var(--color-lime)" }} />
              Agrou Tani
            </h4>
            <ul className="space-y-2.5 text-sm font-medium text-white/70">
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:underline underline-offset-4 transition-all"
                >
                  Diagnosis Lahan (AI)
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:underline underline-offset-4 transition-all"
                >
                  Proteksi Cuaca &amp; Hama
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:underline underline-offset-4 transition-all"
                >
                  Tips Pertanian &amp; Cuaca
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:underline underline-offset-4 transition-all"
                >
                  Toko Obat Tani Terpadu
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Agrou Pasar */}
          <div>
            <h4
              className="font-bold text-white text-base mb-4 flex items-center gap-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <Store size={16} style={{ color: "var(--color-lime)" }} />
              Agrou Pasar
            </h4>
            <ul className="space-y-2.5 text-sm font-medium text-white/70">
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:underline underline-offset-4 transition-all"
                >
                  Koperasi Verified
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:underline underline-offset-4 transition-all"
                >
                  Pasar Komoditas
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:underline underline-offset-4 transition-all"
                >
                  Produk Olahan Desa
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:underline underline-offset-4 transition-all"
                >
                  Distribusi Pembeli
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Perusahaan & Kontak */}
          <div>
            <h4
              className="font-bold text-white text-base mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Perusahaan
            </h4>
            <ul className="space-y-2.5 text-sm font-medium text-white/70 mb-4">
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:underline underline-offset-4 transition-all"
                >
                  Tentang Agrou
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:underline underline-offset-4 transition-all"
                >
                  Cerita Petani
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:underline underline-offset-4 transition-all"
                >
                  Blog &amp; Berita
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:underline underline-offset-4 transition-all"
                >
                  Karir
                </a>
              </li>
            </ul>

            <div className="space-y-2.5 text-sm text-white/70 font-medium pt-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-1.5 rounded-lg text-white">
                  <Phone size={14} />
                </div>
                <span className="hover:text-white transition-colors cursor-pointer">
                  1500-TANI
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-1.5 rounded-lg text-white">
                  <Mail size={14} />
                </div>
                <span className="hover:text-white transition-colors cursor-pointer">
                  halo@agrou.id
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-medium text-white/50 text-sm">
            &copy; {new Date().getFullYear()} Agrou Nusantara. Seluruh hak cipta
            dilindungi.
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-white/50">
            <a href="#" className="hover:text-white transition-colors">
              Kebijakan Privasi
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Syarat &amp; Ketentuan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
