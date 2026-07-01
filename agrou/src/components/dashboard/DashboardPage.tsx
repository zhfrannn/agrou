import { useState } from "react";
import {
  Home,
  Shield,
  ShoppingBag,
  Users,
  Store,
  BarChart2,
  ShoppingCart,
  Wallet,
  User,
  Settings,
  Bell,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Package,
  LineChart,
  Leaf,
  ChevronRight,
  Award,
  Megaphone,
} from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../../hooks/useAuth";
import { useRealtimeOrders } from "../../hooks/useRealtimeOrders";
import { useDashboardStats, formatCurrency } from "../../lib/queries/orders";
import DashboardShieldStore from "./DashboardShieldStore";
import DashboardShieldOrders from "./DashboardShieldOrders";
import DashboardMemberNeeds from "./DashboardMemberNeeds";
import DashboardBrandStock from "./DashboardBrandStock";
import DashboardBrandOrders from "./DashboardBrandOrders";
import DashboardBrandRevenue from "./DashboardBrandRevenue";
import DashboardKoperasiProfile from "./DashboardKoperasiProfile";

export default function DashboardPage() {
  const [activeView, setActiveView] = useState("beranda");
  const { profile } = useAuth();
  useRealtimeOrders();
  const { data: stats } = useDashboardStats(profile?.id ?? "");

  const displayName = profile?.full_name ?? "Pengguna";
  const avatarUrl =
    profile?.avatar_url ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=F77F00&color=fff&size=100`;
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-[260px] bg-[#1B4332] text-white flex flex-col shrink-0 h-full overflow-y-auto scrollbar-hide">
        {/* Logo */}
        <div className="p-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2 text-white">
            <div className="relative flex items-center justify-center">
              <Shield size={28} className="fill-white text-white" />
              <Leaf
                size={14}
                className="absolute text-[#1B4332] fill-[#1B4332] top-1.5"
              />
            </div>
            <span className="font-display font-black text-2xl tracking-tight">
              Agrou
            </span>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3 shrink-0">
          <div className="w-12 h-12 bg-white rounded-full p-0.5 shrink-0">
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm leading-tight mb-0.5 truncate">
              {displayName}
            </h3>
            <span className="text-[#74C69D] text-xs font-medium capitalize">
              {profile?.role ?? "—"} Dashboard
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-6">
          <div>
            <button
              onClick={() => setActiveView("beranda")}
              className={`flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-xl font-bold transition-colors ${activeView === "beranda" ? "bg-white/10 text-white" : "hover:bg-white/5 text-white/80 hover:text-white"}`}
            >
              <Home size={18} />
              Beranda Dashboard
            </button>
          </div>

          <div>
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-4 mb-3">
              ── TANI ──
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setActiveView("shield_store")}
                className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-xl transition-colors text-sm font-medium ${activeView === "shield_store" ? "bg-white/10 text-white font-bold" : "hover:bg-white/5 text-white/80 hover:text-white"}`}
              >
                <Shield size={18} className="text-[#74C69D]" />
                Toko Tani
              </button>
              <button
                onClick={() => setActiveView("shield_orders")}
                className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-xl transition-colors text-sm font-medium ${activeView === "shield_orders" ? "bg-white/10 text-white font-bold" : "hover:bg-white/5 text-white/80 hover:text-white"}`}
              >
                <ShoppingBag size={18} className="text-[#74C69D]" />
                Pesanan Tani
              </button>
              <button
                onClick={() => setActiveView("member_needs")}
                className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-xl transition-colors text-sm font-medium ${activeView === "member_needs" ? "bg-white/10 text-white font-bold" : "hover:bg-white/5 text-white/80 hover:text-white"}`}
              >
                <Users size={18} className="text-[#74C69D]" />
                Kebutuhan Anggota
              </button>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-4 mb-3">
              ── PASAR ──
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setActiveView("brand_stock")}
                className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-xl transition-colors text-sm font-medium ${activeView === "brand_stock" ? "bg-white/10 text-white font-bold" : "hover:bg-white/5 text-white/80 hover:text-white"}`}
              >
                <Package size={18} className="text-[#FFD166]" />
                Stok & Produk
              </button>
              <button
                onClick={() => setActiveView("brand_orders")}
                className={`flex items-center justify-between w-full px-4 py-2 rounded-xl transition-colors text-sm font-medium ${activeView === "brand_orders" ? "bg-white/10 text-white font-bold" : "hover:bg-white/5 text-white/80 hover:text-white"}`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart size={18} className="text-[#FFD166]" />
                  Pesanan Pasar
                </div>
                <span className="bg-[#E76F51] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  3
                </span>
              </button>
              <button
                onClick={() => setActiveView("brand_revenue")}
                className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-xl transition-colors text-sm font-medium ${activeView === "brand_revenue" ? "bg-white/10 text-white font-bold" : "hover:bg-white/5 text-white/80 hover:text-white"}`}
              >
                <Wallet size={18} className="text-[#FFD166]" />
                Revenue & Pembagian
              </button>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-4 mb-3">
              ── UMUM ──
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setActiveView("profile")}
                className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-xl transition-colors text-sm font-medium ${activeView === "profile" ? "bg-white/10 text-white font-bold" : "hover:bg-white/5 text-white/80 hover:text-white"}`}
              >
                <User size={18} className="text-white/60" />
                Profil Koperasi
              </button>
              <a
                href="#"
                className="flex items-center gap-3 hover:bg-white/5 text-white/80 hover:text-white px-4 py-2 rounded-xl transition-colors text-sm font-medium"
              >
                <Settings size={18} className="text-white/60" />
                Pengaturan
              </a>
            </div>
          </div>
        </nav>

        {/* Badge Bottom */}
        <div className="p-6 shrink-0 mt-auto">
          <div className="bg-gradient-to-r from-[#FFB703] to-[#F77F00] p-4 rounded-2xl flex flex-col items-center text-center shadow-lg">
            <Award size={32} className="text-white fill-white/20 mb-2" />
            <span className="text-xs font-bold text-white/90 uppercase tracking-wider mb-1">
              Status Koperasi
            </span>
            <span className="font-bold text-white">
              Verified Protected Farm
            </span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      {activeView === "beranda" ? (
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          {/* TOP BAR */}
          <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between shrink-0 shadow-sm z-10 w-full lg:max-w-none">
            <div>
              <h1 className="font-display font-bold text-2xl text-gray-900">
                Selamat datang, {displayName} 👋
              </h1>
              <p className="text-sm font-medium text-gray-500">{today}</p>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-[#2D6A4F] transition-colors bg-gray-50 hover:bg-green-50 justify-center rounded-full">
                <Bell size={22} />
                <span className="absolute top-1.5 right-1.5 bg-[#E76F51] text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-white">
                  3
                </span>
              </button>
              <button className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-5 py-2.5 rounded-full font-bold text-sm transition-colors shadow-md flex items-center gap-2">
                <Megaphone size={16} />
                Pesan untuk Anggota
              </button>
            </div>
          </header>

          {/* SCROLLABLE CONTENT AREA */}
          <div className="flex-1 overflow-y-auto p-8 w-full max-w-[1180px] mx-auto">
            {/* STATS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-orange-50 p-2.5 rounded-xl text-[#F77F00]">
                    <Wallet size={24} />
                  </div>
                  <div className="flex items-center gap-1 text-[#2D6A4F] bg-[#74C69D]/10 px-2 py-1 rounded-lg text-xs font-bold">
                    <TrendingUp size={14} /> 12%
                  </div>
                </div>
                <h3 className="text-3xl font-display font-black text-gray-800 tracking-tight mb-1">
                  Rp 24.6jt
                </h3>
                <p className="text-sm font-medium text-gray-500">
                  Penjualan Bulan Ini
                </p>
              </div>

              <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-50 p-2.5 rounded-xl text-[#2D6A4F]">
                    <Users size={24} />
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-1 rounded-lg text-xs font-bold">
                    <ArrowRight size={14} /> Stabil
                  </div>
                </div>
                <h3 className="text-3xl font-display font-black text-gray-800 tracking-tight mb-1">
                  47
                </h3>
                <p className="text-sm font-medium text-gray-500">
                  Anggota Aktif
                </p>
              </div>

              <div className="bg-white p-6 rounded-[1.5rem] border border-orange-200 shadow-[0_4px_20px_rgb(247,127,0,0.1)] flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="bg-[#F77F00] p-2.5 rounded-xl text-white shadow-md shadow-[#F77F00]/20">
                    <ShoppingCart size={24} />
                  </div>
                  <div className="flex items-center gap-1 text-[#E76F51] bg-[#E76F51]/10 px-2 py-1 rounded-lg text-xs font-bold border border-[#E76F51]/20">
                    <AlertCircle size={14} /> Perlu Aksi
                  </div>
                </div>
                <h3 className="text-3xl font-display font-black text-gray-800 tracking-tight mb-1 relative z-10">
                  8
                </h3>
                <p className="text-sm font-medium text-gray-500 relative z-10">
                  Pesanan Pending
                </p>
              </div>

              <div className="bg-white p-6 rounded-[1.5rem] border border-green-200 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-[#74C69D]/20 p-2.5 rounded-xl text-[#2D6A4F] border border-[#74C69D]/30">
                    <Shield size={24} className="fill-[#2D6A4F]/10" />
                  </div>
                  <div className="flex items-center gap-1 text-[#2D6A4F] bg-[#74C69D]/10 px-2 py-1 rounded-lg text-xs font-bold">
                    <CheckCircle2 size={14} /> Aktif 8 bln
                  </div>
                </div>
                <h3 className="text-xl font-display font-black text-[#2D6A4F] tracking-tight mb-1 mt-1 leading-tight">
                  Verified
                </h3>
                <p className="text-sm font-medium text-gray-500">
                  Status Proteksi Lahan
                </p>
              </div>
            </div>

            {/* TWO COLUMN CONTENT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* LEFT COLUMN (60%) lg:col-span-7 or 8 */}
              <div className="lg:col-span-7 space-y-8">
                {/* Pesanan Pasar Terbaru */}
                <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-orange-50/50">
                    <h2 className="font-display font-bold text-xl text-gray-800 flex items-center gap-2">
                      <Store size={20} className="text-[#F77F00]" />
                      Pesanan Pasar Terbaru
                    </h2>
                    <button className="text-sm font-bold text-[#F77F00] hover:text-[#E76F51] transition-colors">
                      Lihat Semua
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-bold">
                          <th className="px-6 py-4 border-b border-gray-100">
                            Produk
                          </th>
                          <th className="px-6 py-4 border-b border-gray-100">
                            Pembeli
                          </th>
                          <th className="px-6 py-4 border-b border-gray-100">
                            Jumlah
                          </th>
                          <th className="px-6 py-4 border-b border-gray-100">
                            Harga
                          </th>
                          <th className="px-6 py-4 border-b border-gray-100 text-right">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 border-b border-gray-100 font-bold text-gray-800">
                            Kopi Arabika Gayo
                          </td>
                          <td className="px-6 py-4 border-b border-gray-100 text-gray-600">
                            PT. Kopi Nusantara
                          </td>
                          <td className="px-6 py-4 border-b border-gray-100 font-medium">
                            10 kg
                          </td>
                          <td className="px-6 py-4 border-b border-gray-100 text-[#F77F00] font-bold">
                            Rp 850.000
                          </td>
                          <td className="px-6 py-4 border-b border-gray-100 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-3 py-1.5 rounded-lg font-bold text-xs transition-colors shadow-sm">
                                Konfirmasi
                              </button>
                              <button className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors">
                                Detail
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 border-b border-gray-100 font-bold text-gray-800">
                            Kopi Honey Process
                          </td>
                          <td className="px-6 py-4 border-b border-gray-100 text-gray-600">
                            Budi Santoso
                          </td>
                          <td className="px-6 py-4 border-b border-gray-100 font-medium">
                            2 kg
                          </td>
                          <td className="px-6 py-4 border-b border-gray-100 text-[#F77F00] font-bold">
                            Rp 230.000
                          </td>
                          <td className="px-6 py-4 border-b border-gray-100 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-3 py-1.5 rounded-lg font-bold text-xs transition-colors shadow-sm">
                                Konfirmasi
                              </button>
                              <button className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors">
                                Detail
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 border-b border-gray-100 font-bold text-gray-800">
                            Bubuk Peaberry
                          </td>
                          <td className="px-6 py-4 border-b border-gray-100 text-gray-600">
                            Cafe Senja
                          </td>
                          <td className="px-6 py-4 border-b border-gray-100 font-medium">
                            5 kg
                          </td>
                          <td className="px-6 py-4 border-b border-gray-100 text-[#F77F00] font-bold">
                            Rp 650.000
                          </td>
                          <td className="px-6 py-4 border-b border-gray-100 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-3 py-1.5 rounded-lg font-bold text-xs transition-colors shadow-sm">
                                Konfirmasi
                              </button>
                              <button className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors">
                                Detail
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Stok Terkini */}
                <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-display font-bold text-xl text-gray-800 flex items-center gap-2">
                      <Package size={20} className="text-gray-400" />
                      Stok Produk
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-4 mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider pb-2 border-b border-gray-100">
                      <div>Produk</div>
                      <div>Stok</div>
                      <div>Status</div>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 items-center">
                        <div className="font-bold text-sm text-gray-800">
                          Kopi Natural
                        </div>
                        <div className="font-bold text-sm text-gray-600">
                          320 kg
                        </div>
                        <div>
                          <span className="inline-flex items-center gap-1.5 bg-[#74C69D]/15 text-[#2D6A4F] px-2.5 py-1 rounded-lg text-xs font-bold border border-[#74C69D]/30">
                            <CheckCircle2 size={14} /> Aman
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 items-center">
                        <div className="font-bold text-sm text-gray-800">
                          Kopi Honey
                        </div>
                        <div className="font-bold text-sm text-[#F77F00]">
                          45 kg
                        </div>
                        <div>
                          <span className="inline-flex items-center gap-1.5 bg-[#FFB703]/15 text-[#B8860B] px-2.5 py-1 rounded-lg text-xs font-bold border border-[#FFB703]/30">
                            <AlertCircle size={14} /> Hampir Habis
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 items-center">
                        <div className="font-bold text-sm text-gray-800">
                          Green Bean
                        </div>
                        <div className="font-bold text-sm text-[#E76F51]">
                          0 kg
                        </div>
                        <div>
                          <span className="inline-flex items-center gap-1.5 bg-[#E76F51]/15 text-[#E76F51] px-2.5 py-1 rounded-lg text-xs font-bold border border-[#E76F51]/30">
                            <AlertCircle size={14} /> Habis
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                      <button className="text-[#F77F00] font-bold text-sm hover:underline">
                        Kelola Stok Lengkap →
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN (40%) lg:col-span-5 */}
              <div className="lg:col-span-5 space-y-8">
                {/* Pembelian Tani Terakhir */}
                <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-green-50/50">
                    <h2 className="font-display font-bold text-xl text-gray-800 flex items-center gap-2">
                      <Shield size={20} className="text-[#2D6A4F]" />
                      Pembelian Tani Terakhir
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center font-bold text-gray-500 shrink-0">
                        H
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800 leading-tight">
                          Hasanudin
                        </p>
                        <p className="text-xs text-gray-500 mb-1">
                          Paket Perlindungan Cuaca Ekstrem Kopi (2 Ha)
                        </p>
                        <span className="text-[10px] font-bold text-[#2D6A4F] bg-[#74C69D]/20 px-2 py-0.5 rounded-md">
                          Status: Aktif
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-px bg-gray-100"></div>

                    <div className="flex items-start gap-4">
                      <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center font-bold text-gray-500 shrink-0">
                        R
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800 leading-tight">
                          Rusli Ahmad
                        </p>
                        <p className="text-xs text-gray-500 mb-1">
                          Fungisida Antraknosa plus Kalsium
                        </p>
                        <span className="text-[10px] font-bold text-[#F77F00] bg-orange-100 px-2 py-0.5 rounded-md">
                          Status: Sedang Dikirim
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue Anggota */}
                <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="font-display font-bold text-xl text-gray-800 flex items-center gap-2">
                        <LineChart size={20} className="text-gray-400" />
                        Revenue Anggota Bulan Ini
                      </h2>
                    </div>
                    <p className="text-xs text-gray-500">
                      Top 3 anggota dengan kontribusi stok terbanyak
                    </p>
                  </div>
                  <div className="p-6 space-y-5">
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-bold text-gray-700">
                          Ahmad Zulkarnaen
                        </span>
                        <span className="font-bold text-[#2D6A4F]">
                          Rp 8.4M
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-[#2D6A4F] h-2 rounded-full"
                          style={{ width: "85%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-bold text-gray-700">
                          Keluarga Bapak Teuku
                        </span>
                        <span className="font-bold text-[#2D6A4F]">
                          Rp 5.2M
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-[#74C69D] h-2 rounded-full"
                          style={{ width: "55%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-bold text-gray-700">
                          Suparman
                        </span>
                        <span className="font-bold text-[#2D6A4F]">
                          Rp 3.1M
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-[#A8DADC] h-2 rounded-full"
                          style={{ width: "35%" }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                      <button className="text-[#2D6A4F] font-bold text-sm hover:underline">
                        Lihat Pembagian Lengkap →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tips & Notifikasi */}
                <div className="bg-gradient-to-br from-white to-orange-50/30 border border-orange-100 rounded-[2rem] shadow-sm overflow-hidden p-6">
                  <h2 className="font-display font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                    <Megaphone size={18} className="text-[#F77F00]" />
                    Tips & Notifikasi
                  </h2>

                  <div className="space-y-3">
                    <div className="bg-orange-50 border border-orange-100 p-3 rounded-xl flex items-start gap-3">
                      <AlertCircle
                        size={18}
                        className="text-[#E76F51] shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-sm font-bold text-[#E76F51]">
                          Peringatan Setoran
                        </p>
                        <p className="text-xs font-medium text-gray-600 mt-0.5">
                          3 anggota terpantau belum memberikan laporan setoran
                          stok minggu ini.
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#74C69D]/10 border border-[#74C69D]/30 p-3 rounded-xl flex items-start gap-3">
                      <Leaf
                        size={18}
                        className="text-[#2D6A4F] shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-sm font-bold text-[#2D6A4F]">
                          Info Cuaca & Proteksi
                        </p>
                        <p className="text-xs font-medium text-gray-600 mt-0.5">
                          Musim hujan akan segera tiba di area Gayo. Ingatkan
                          anggota untuk sedia proteksi anti jamur.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      ) : activeView === "shield_store" ? (
        <DashboardShieldStore />
      ) : activeView === "shield_orders" ? (
        <DashboardShieldOrders />
      ) : activeView === "member_needs" ? (
        <DashboardMemberNeeds
          onGoToStore={() => setActiveView("shield_store")}
        />
      ) : activeView === "brand_stock" ? (
        <DashboardBrandStock />
      ) : activeView === "brand_orders" ? (
        <DashboardBrandOrders />
      ) : activeView === "brand_revenue" ? (
        <DashboardBrandRevenue />
      ) : activeView === "profile" ? (
        <DashboardKoperasiProfile />
      ) : null}
    </div>
  );
}
