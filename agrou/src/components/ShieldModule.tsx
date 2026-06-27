import { motion } from "motion/react";
import { Shield, Umbrella, Droplets, ArrowRight } from "lucide-react";
import type { Product } from "../types";

const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Paket Anti-Hama Organik Lestari",
    description: "Perlindungan alami untuk padi tanpa merusak kesuburan tanah.",
    price: "Rp 120.000",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=800",
    category: "Pertanian",
    badge: "Terlaris",
    badgeColor: "bg-[#F77F00]"
  },
  {
    id: "p2",
    name: "Jaring Tahan Badai Krakatau",
    description: "Kuat menahan cuaca ekstrem, investasi jangka panjang nelayan.",
    price: "Rp 350.000",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800",
    category: "Perikanan",
    badge: "Tahan Lama",
    badgeColor: "bg-[#0077B6]"
  },
  {
    id: "p3",
    name: "Asuransi Panen Padi Micro Proteksi",
    description: "Jaminan ganti rugi jika terjadi kekeringan atau banjir.",
    price: "Rp 50.000 / bln",
    image: "https://images.unsplash.com/photo-1592982537447-6f29fb443831?auto=format&fit=crop&q=80&w=800",
    category: "Asuransi",
    badge: "Banyak Dicari",
    badgeColor: "bg-[#2D6A4F]"
  }
];

export default function ShieldModule() {
  return (
    <section id="shield" className="max-w-7xl mx-auto px-6 py-20 relative">
      <div className="bg-[#2D6A4F] rounded-[3rem] p-8 lg:p-16 relative overflow-hidden shadow-2xl">
        {/* Playful background blobs inside the green container */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1B4332] rounded-full blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#FFB703]/20 rounded-full blur-2xl transform -translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <Shield size={28} className="text-[#FFB703]" />
              </div>
              <h2 className="font-display font-bold text-4xl lg:text-5xl">Agrou Tani</h2>
            </div>
            <p className="text-white/80 text-lg font-medium">Lindungi masa depan panen dan tangkapanmu dengan solusi perlindungan tepercaya. Aman, bersahabat, dan dapat diandalkan!</p>
          </div>
          <button className="flex items-center gap-2 bg-white text-[#2D6A4F] px-6 py-3 rounded-full font-bold hover:bg-orange-50 transition-colors shadow-lg">
            Lihat Semua Proteksi
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="relative z-10 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_PRODUCTS.map((product, idx) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#FFFDF7] rounded-3xl overflow-hidden hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_16px_50px_rgb(0,0,0,0.2)] border border-[#2D6A4F]/10 group flex flex-col"
            >
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {product.badge && (
                  <div className={`absolute top-4 left-4 ${product.badgeColor} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md`}>
                    {product.badge}
                  </div>
                )}
                {/* Playful category icon */}
                <div className="absolute -bottom-4 right-4 bg-white p-2 rounded-2xl shadow-lg border-2 border-gray-50 transform rotate-3 group-hover:rotate-12 transition-transform">
                  {product.category === 'Pertanian' ? (
                    <Umbrella className="text-[#F77F00]" size={24} />
                  ) : product.category === 'Perikanan' ? (
                    <Droplets className="text-[#0077B6]" size={24} />
                  ) : (
                    <Shield className="text-[#2D6A4F]" size={24} />
                  )}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="text-xs font-bold text-gray-400 uppercase mb-2">{product.category}</div>
                <h3 className="font-display font-bold text-xl text-gray-800 mb-2 leading-tight">{product.name}</h3>
                <p className="text-gray-500 font-medium text-sm mb-6 flex-1 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="font-display text-[#E76F51] font-bold text-xl">
                    {product.price}
                  </div>
                  <button className="bg-orange-50 hover:bg-[#F77F00] hover:text-white text-[#F77F00] p-3 rounded-xl transition-colors">
                    <Shield size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
