import { motion } from "motion/react";
import { Store, MapPin, Star, ShoppingBag } from "lucide-react";
import type { KUDBrand } from "../types";

const MOCK_BRANDS: KUDBrand[] = [
  {
    id: "kb1",
    storeName: "KUD Tani Makmur",
    productName: "Kopi Robusta Lereng Kelud",
    price: "Rp 55.000",
    image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=800",
    location: "Kediri, Jatim",
    rating: 4.9
  },
  {
    id: "kb2",
    storeName: "KUD Samudra Abadi",
    productName: "Ikan Asap Segar Tradisional",
    price: "Rp 85.000",
    image: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&q=80&w=800",
    location: "Banyuwangi, Jatim",
    rating: 4.8
  },
  {
    id: "kb3",
    storeName: "KUD Sinar Jaya",
    productName: "Keripik Singkong Renyah Gurih",
    price: "Rp 25.000",
    image: "https://images.unsplash.com/photo-1621852004158-f3bc188ace2d?auto=format&fit=crop&q=80&w=800",
    location: "Malang, Jatim",
    rating: 4.7
  },
  {
    id: "kb4",
    storeName: "KUD Sejahtera",
    productName: "Beras Organik Pandan Wangi",
    price: "Rp 120.000",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800",
    location: "Cianjur, Jabar",
    rating: 5.0
  }
];

export default function BrandModule() {
  return (
    <section id="brand" className="max-w-7xl mx-auto px-6 py-20 relative">
      <div className="flex flex-col items-center text-center mb-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-orange-100 text-[#F77F00] p-3 rounded-2xl mb-4 transform -rotate-3"
        >
          <Store size={32} />
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display font-bold text-4xl lg:text-5xl text-gray-900 mb-4"
        >
          Karya Asli Koperasi Desa
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, delay: 0.1 }}
          className="text-gray-600 font-medium max-w-2xl text-lg"
        >
          Dukung kemajuan ekonomi lokal dengan membeli produk unggulan berkualitas hasil panen dan tangkapan KUD di seluruh Indonesia.
        </motion.p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_BRANDS.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="group bg-white rounded-3xl p-3 border-2 border-transparent hover:border-orange-100 shadow-[0_4px_20px_rgb(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgb(247,127,0,0.15)] hover:scale-[1.02] transition-all duration-300 flex flex-col"
          >
            <div className="h-44 rounded-2xl overflow-hidden relative mb-4">
              <img 
                src={item.image} 
                alt={item.productName} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                <Star size={12} className="text-[#FFB703] fill-[#FFB703]" />
                <span className="text-xs font-bold text-gray-700">{item.rating}</span>
              </div>
            </div>
            
            <div className="px-2 flex-1 flex flex-col">
              <div className="flex items-center gap-1.5 text-gray-400 mb-1.5">
                <Store size={14} />
                <span className="text-xs font-semibold">{item.storeName}</span>
              </div>
              <h3 className="font-display font-bold text-gray-800 text-lg leading-tight mb-2 line-clamp-2">
                {item.productName}
              </h3>
              
              <div className="flex items-center gap-1 text-[#2D6A4F] mb-4">
                <MapPin size={14} />
                <span className="font-medium text-xs">{item.location}</span>
              </div>
              
              <div className="mt-auto flex items-center justify-between">
                <span className="font-display font-bold text-[#F77F00] text-lg">
                  {item.price}
                </span>
                <button className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white p-2.5 rounded-xl transition-colors">
                  <ShoppingBag size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-12 flex justify-center">
        <button className="bg-orange-50 hover:bg-orange-100 text-[#F77F00] font-bold px-8 py-3 rounded-full transition-colors border-2 border-orange-200">
          Susuri Toko KUD Lainnya
        </button>
      </div>
    </section>
  );
}
