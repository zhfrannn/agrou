import {
  ShoppingCart,
  LogOut,
  Bell,
  Shield,
  Leaf,
  X,
  Trash2,
  Plus,
  Minus,
  Package,
  User,
  Award,
  Home,
  Store,
  Building2,
  Menu,
  ChevronDown,
  Search,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import logo from "@assets/logo.svg";
import { useAuth } from "../../hooks/useAuth";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerType, setRegisterType] = useState("koperasi");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const isLoggedIn = !!user;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredFloat, setHoveredFloat] = useState<string | null>(null);
  const [hoveredMain, setHoveredMain] = useState<string | null>(null);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const getActiveTab = (p: string): string | null => {
    if (p === "/") return "beranda";
    if (p === "/tani" || p.startsWith("/tani/katalog") || p === "/pasar")
      return "marketplace";
    if (p === "/koperasi" || p.startsWith("/koperasi/")) return "koperasi";
    if (p === "/gro-ai") return "ladangai";
    if (p === "/connect") return "komunitas";
    return null;
  };

  const activeTab = getActiveTab(pathname);
  const currentActiveFloat = hoveredFloat !== null ? hoveredFloat : activeTab;
  const currentActiveMain = hoveredMain !== null ? hoveredMain : activeTab;

  const getCurrentView = (p: string): string => {
    if (p === "/") return "app";
    if (p === "/tani" || p.startsWith("/tani/katalog")) return "shield";
    if (p === "/pasar") return "pasar";
    if (p === "/koperasi" || p.startsWith("/koperasi/")) return "koperasi";
    if (p === "/dashboard") return "dashboard";
    return "app";
  };
  const currentView = getCurrentView(pathname);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tutup semua modal/dropdown saat navigasi ke halaman lain
  // supaya overlay fixed tidak nyangkut dan bikin blank screen
  useEffect(() => {
    setIsSearchOpen(false);
    setIsCartOpen(false);
    setIsNotificationOpen(false);
    setIsRegisterOpen(false);
    setIsLoginOpen(false);
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* ── FLOATING PILL HEADER (visible when scrolled) ── */}
      <div
        className={`hidden lg:flex fixed top-0 left-0 right-0 z-60 justify-center pointer-events-none transition-all duration-300 ease-out ${isScrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
          }`}
        style={{ paddingTop: "10px" }}
      >
        {/* Single centered pill — logo + nav + profile semuanya dalam satu pill */}
        <div
          className={`flex items-center gap-1 backdrop-blur-xl border border-white/70 shadow-xl shadow-black/10 rounded-full px-2 py-2 transition-all ${isScrolled ? "pointer-events-auto" : "pointer-events-none"
            }`}
          style={{ backgroundColor: "rgba(255,255,255,0.85)" }}
        >
          {/* Logo section (kiri pill) */}
          <div
            className="flex items-center cursor-pointer px-3 py-1 rounded-full hover:bg-gray-50 transition-all duration-150 shrink-0"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="Agrou Logo" className="h-5.75 w-auto" />
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-gray-200/80 mx-1 shrink-0" />

          {/* Nav items */}
          <nav className="flex items-center gap-0.5">
            {/* Beranda */}
            <button
              onClick={() => navigate("/")}
              onMouseEnter={() => setHoveredFloat("beranda")}
              onMouseLeave={() => setHoveredFloat(null)}
              className={`relative px-3.5 py-1.5 rounded-full text-sm font-bold transition-colors duration-150 cursor-pointer ${currentActiveFloat === "beranda"
                ? "text-white"
                : "text-gray-700"
                }`}
            >
              {currentActiveFloat === "beranda" && (
                <motion.div
                  layoutId="sliding-pill-float"
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: "var(--color-forest)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">Beranda</span>
            </button>

            {/* Marketplace dropdown */}
            <div
              onMouseEnter={() => setHoveredFloat("marketplace")}
              onMouseLeave={() => setHoveredFloat(null)}
              className="relative group h-full flex items-center"
            >
              <button
                className={`relative flex items-center gap-1 px-3.5 py-1.5 rounded-full text-sm font-bold transition-colors duration-150 cursor-pointer ${currentActiveFloat === "marketplace"
                  ? "text-white"
                  : "text-gray-700"
                  }`}
              >
                {currentActiveFloat === "marketplace" && (
                  <motion.div
                    layoutId="sliding-pill-float"
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: "var(--color-forest)" }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1">
                  Marketplace
                  <svg
                    className="w-3 h-3 transition-transform duration-150 group-hover:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-120 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-150 ease-out z-50 p-4 grid grid-cols-2 gap-4">
                <div className="border-r border-gray-100 pr-4">
                  <button
                    onClick={() => navigate("/tani")}
                    className="relative w-full text-left p-3 rounded-xl transition-all duration-150 cursor-pointer block group/tani mb-1"
                  >
                    <div
                      className="absolute inset-0 rounded-xl opacity-0 group-hover/tani:opacity-100 transition-opacity duration-150"
                      style={{ backgroundColor: "var(--color-forest)" }}
                    />
                    <h3 className="font-display font-black text-(--color-forest) group-hover/tani:text-white text-sm relative z-10 transition-colors duration-150">
                      Agrou Tani
                    </h3>
                    <p className="text-[11px] text-gray-400 group-hover/tani:text-white/80 font-medium mt-1 leading-relaxed relative z-10 transition-colors duration-150">
                      Sarana produksi &amp; diagnosis perlindungan lahan.
                    </p>
                  </button>
                  <div className="space-y-0.5">
                    {[
                      {
                        label: "Semua Produk",
                        view: "katalog",
                        category: "Semua Produk",
                      },
                      {
                        label: "Pestisida",
                        view: "katalog",
                        category: "Pestisida",
                      },
                      {
                        label: "Pupuk & Nutrisi",
                        view: "katalog",
                        category: "Pupuk",
                      },
                      {
                        label: "Paket Bundle",
                        view: "katalog",
                        category: "Bundle",
                      },
                      {
                        label: "Diagnosis Lahan AI",
                        view: "shield",
                        category: "",
                      },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          if (item.view === "katalog") {
                            navigate(
                              "/tani/katalog?kategori=" +
                              encodeURIComponent(item.category),
                            );
                          } else {
                            navigate("/tani");
                          }
                        }}
                        className="w-full text-left text-xs font-bold text-gray-600 hover:bg-green-100/70 px-2.5 py-1.5 rounded-lg transition-all duration-150 cursor-pointer"
                        style={
                          {
                            "--hover-color": "var(--color-forest)",
                          } as React.CSSProperties
                        }
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => navigate("/pasar")}
                    className="relative w-full text-left p-3 rounded-xl transition-all duration-150 cursor-pointer block group/pasar-title mb-1"
                  >
                    <div
                      className="absolute inset-0 rounded-xl opacity-0 group-hover/pasar-title:opacity-100 transition-opacity duration-150"
                      style={{ backgroundColor: "var(--color-orange)" }}
                    />
                    <h3 className="font-display font-black text-(--color-orange) group-hover/pasar-title:text-white text-sm relative z-10 transition-colors duration-150">
                      Agrou Pasar
                    </h3>
                    <p className="text-[11px] text-gray-400 group-hover/pasar-title:text-white/80 font-medium mt-1 leading-relaxed relative z-10 transition-colors duration-150">
                      Komoditas segar langsung dari koperasi desa.
                    </p>
                  </button>
                  <div className="space-y-0.5">
                    {[
                      "Semua Komoditas",
                      "Ikan & Laut",
                      "Padi & Serealia",
                      "Kopi & Rempah",
                      "Sayuran",
                    ].map((label) => (
                      <button
                        key={label}
                        onClick={() => navigate("/pasar")}
                        className="w-full text-left text-xs font-bold text-gray-600 hover:bg-orange-100/70 px-2.5 py-1.5 rounded-lg transition-all duration-150 cursor-pointer"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Koperasi */}
            <button
              onClick={() => navigate("/koperasi")}
              onMouseEnter={() => setHoveredFloat("koperasi")}
              onMouseLeave={() => setHoveredFloat(null)}
              className={`relative px-3.5 py-1.5 rounded-full text-sm font-bold transition-colors duration-150 cursor-pointer ${currentActiveFloat === "koperasi"
                ? "text-white"
                : "text-gray-700"
                }`}
            >
              {currentActiveFloat === "koperasi" && (
                <motion.div
                  layoutId="sliding-pill-float"
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: "var(--color-forest)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">Koperasi</span>
            </button>

            {/* LadangAI */}
            <button
              onClick={() => navigate("/gro-ai")}
              onMouseEnter={() => setHoveredFloat("ladangai")}
              onMouseLeave={() => setHoveredFloat(null)}
              className={`relative px-3.5 py-1.5 rounded-full text-sm font-bold transition-colors duration-150 cursor-pointer ${currentActiveFloat === "ladangai"
                ? "text-white"
                : "text-gray-700"
                }`}
            >
              {currentActiveFloat === "ladangai" && (
                <motion.div
                  layoutId="sliding-pill-float"
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: "var(--color-lime-dark)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">Gro AI</span>
            </button>
            {/* Connect */}
            <button
              onClick={() => navigate("/connect")}
              onMouseEnter={() => setHoveredFloat("komunitas")}
              onMouseLeave={() => setHoveredFloat(null)}
              className={`relative px-3.5 py-1.5 rounded-full text-sm font-bold transition-colors duration-150 cursor-pointer ${currentActiveFloat === "komunitas"
                ? "text-white"
                : "text-gray-700"
                }`}
            >
              {currentActiveFloat === "komunitas" && (
                <motion.div
                  layoutId="sliding-pill-float"
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: "var(--color-orange)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">Connect</span>
            </button>
          </nav>

          {/* Divider */}
          <div className="w-px h-5 bg-gray-200/80 mx-1 shrink-0" />

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center w-8.5 h-8.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer shrink-0 mr-1"
          >
            <ShoppingCart size={15} className="stroke-[2.5]" />
            <span
              className="absolute -top-1 -right-1 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white shadow-sm"
              style={{ backgroundColor: "var(--color-orange)" }}
            >
              2
            </span>
          </button>

          {/* Profile section (kanan pill) */}
          <div className="relative shrink-0">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-1.5 pl-3 pr-3.5 rounded-full font-bold transition-colors text-sm shadow-sm cursor-pointer select-none"
                  style={{
                    backgroundColor: "var(--color-lime)",
                    color: "var(--color-forest-dark)",
                    height: "34px",
                  }}
                >
                  <User size={14} className="stroke-[2.5]" />
                  <span>{profile?.full_name ?? user?.email ?? "Pengguna"}</span>
                  <ChevronDown
                    size={11}
                    className={`transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-70 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                      <div
                        className="p-4 relative overflow-hidden flex flex-col justify-end min-h-20"
                        style={{ backgroundColor: "var(--color-forest)" }}
                      >
                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                          <svg
                            className="w-full h-full"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                          >
                            <path
                              d="M0,80 Q25,75 50,80 T100,80 L100,100 L0,100 Z"
                              fill="#2d6a4f"
                            />
                            <circle cx="85" cy="35" r="10" fill="#ffb703" />
                          </svg>
                        </div>
                        <h3 className="font-display font-black text-white text-sm leading-tight relative z-10">
                          Kelola Akun Anda!
                        </h3>
                      </div>
                      <div className="p-2 space-y-0.5">
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            setIsCartOpen(true);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-700 text-xs font-bold transition-colors cursor-pointer text-left"
                        >
                          <div className="flex items-center gap-2.5">
                            <ShoppingCart size={15} className="text-gray-400" />
                            <span>Keranjang Saya</span>
                          </div>
                          <span
                            className="text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{ backgroundColor: "var(--color-orange)" }}
                          >
                            2
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate("/koperasi");
                          }}
                          className="w-full flex items-center px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-700 text-xs font-bold transition-colors cursor-pointer text-left gap-2.5"
                        >
                          <User size={15} className="text-gray-400" />
                          <span>Profil Saya</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate("/dashboard");
                          }}
                          className="w-full flex items-center px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-700 text-xs font-bold transition-colors cursor-pointer text-left gap-2.5"
                        >
                          <Award size={15} className="text-gray-400" />
                          <span>Dashboard KUD</span>
                        </button>
                        <div className="h-px bg-red-100 my-1" />
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            signOut();
                            navigate("/");
                          }}
                          className="w-full flex items-center px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 text-xs font-bold transition-colors cursor-pointer text-left gap-2.5"
                        >
                          <LogOut size={15} className="text-red-500" />
                          <span>Keluar</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/masuk")}
                  className="px-3.5 rounded-full font-bold transition-colors text-sm cursor-pointer"
                  style={{ color: "var(--color-forest)", height: "34px" }}
                >
                  Masuk
                </button>
                <button
                  onClick={() => navigate("/daftar")}
                  className="text-white px-3.5 rounded-full font-bold transition-colors text-sm cursor-pointer"
                  style={{
                    backgroundColor: "var(--color-orange)",
                    height: "34px",
                  }}
                >
                  Daftar Gratis
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── REGULAR HEADER (always in DOM, hides when scrolled on desktop) ── */}
      <header
        className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${isScrolled ? "lg:-translate-y-full lg:opacity-0" : ""}`}
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <div
          className="max-w-360 mx-auto flex items-center justify-between px-8 relative z-50"
          style={{ height: "52px", backgroundColor: "var(--color-surface)" }}
        >
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer shrink-0"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="Agrou Logo" className="h-8.25 w-auto" />
          </div>

          {/* Center Nav */}
          <nav className="hidden lg:flex items-center gap-1.5 font-bold text-gray-600 text-sm h-full relative z-50">
            {/* Beranda */}
            <button
              onClick={() => navigate("/")}
              onMouseEnter={() => setHoveredMain("beranda")}
              onMouseLeave={() => setHoveredMain(null)}
              className={`relative px-3 py-1.5 rounded-full text-sm font-bold transition-colors duration-150 cursor-pointer ${currentActiveMain === "beranda" ? "text-white" : "text-gray-600"
                }`}
            >
              {currentActiveMain === "beranda" && (
                <motion.div
                  layoutId="sliding-pill-main"
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: "var(--color-forest)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">Beranda</span>
            </button>

            {/* Marketplace ▾ */}
            <div
              onMouseEnter={() => setHoveredMain("marketplace")}
              onMouseLeave={() => setHoveredMain(null)}
              className="relative group h-full flex items-center"
            >
              <button
                className={`relative flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold transition-colors duration-150 cursor-pointer ${currentActiveMain === "marketplace"
                  ? "text-white"
                  : "text-gray-600"
                  }`}
              >
                {currentActiveMain === "marketplace" && (
                  <motion.div
                    layoutId="sliding-pill-main"
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: "var(--color-forest)" }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1">
                  Marketplace
                  <svg
                    className="w-3 h-3 transition-transform duration-150 group-hover:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>
              {/* Mega Menu Dropdown */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-120 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-150 ease-out z-50 p-4 grid grid-cols-2 gap-4">
                {/* Kolom Kiri: Agrou Tani */}
                <div className="border-r border-gray-100 pr-4">
                  <button
                    onClick={() => navigate("/tani")}
                    className="relative w-full text-left p-3 rounded-xl transition-all duration-150 cursor-pointer block group/tani mb-1"
                  >
                    <div
                      className="absolute inset-0 rounded-xl opacity-0 group-hover/tani:opacity-100 transition-opacity duration-150"
                      style={{ backgroundColor: "var(--color-forest)" }}
                    />
                    <h3 className="font-display font-black text-(--color-forest) group-hover/tani:text-white text-sm relative z-10 transition-colors duration-150">
                      Agrou Tani
                    </h3>
                    <p className="text-[11px] text-gray-400 group-hover/tani:text-white/80 font-medium mt-1 leading-relaxed relative z-10 transition-colors duration-150">
                      Sarana produksi &amp; diagnosis perlindungan lahan.
                    </p>
                  </button>
                  <div className="space-y-0.5">
                    {[
                      {
                        label: "Semua Produk",
                        view: "katalog",
                        category: "Semua Produk",
                      },
                      {
                        label: "Pestisida",
                        view: "katalog",
                        category: "Pestisida",
                      },
                      {
                        label: "Pupuk & Nutrisi",
                        view: "katalog",
                        category: "Pupuk",
                      },
                      {
                        label: "Paket Bundle",
                        view: "katalog",
                        category: "Bundle",
                      },
                      {
                        label: "Diagnosis Lahan AI",
                        view: "shield",
                        category: "",
                      },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          if (item.view === "katalog") {
                            navigate(
                              "/tani/katalog?kategori=" +
                              encodeURIComponent(item.category),
                            );
                          } else {
                            navigate("/tani");
                          }
                        }}
                        className="w-full text-left text-xs font-bold text-gray-600 hover:bg-green-100/70 px-2.5 py-1.5 rounded-lg transition-all duration-150 cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Kolom Kanan: Agrou Pasar */}
                <div>
                  <button
                    onClick={() => navigate("/pasar")}
                    className="relative w-full text-left p-3 rounded-xl transition-all duration-150 cursor-pointer block group/pasar-title mb-1"
                  >
                    <div
                      className="absolute inset-0 rounded-xl opacity-0 group-hover/pasar-title:opacity-100 transition-opacity duration-150"
                      style={{ backgroundColor: "var(--color-orange)" }}
                    />
                    <h3 className="font-display font-black text-(--color-orange) group-hover/pasar-title:text-white text-sm relative z-10 transition-colors duration-150">
                      Agrou Pasar
                    </h3>
                    <p className="text-[11px] text-gray-400 group-hover/pasar-title:text-white/80 font-medium mt-1 leading-relaxed relative z-10 transition-colors duration-150">
                      Komoditas segar langsung dari koperasi desa.
                    </p>
                  </button>
                  <div className="space-y-0.5">
                    {[
                      { label: "Semua Komoditas", view: "brand" },
                      { label: "Ikan & Laut", view: "brand" },
                      { label: "Padi & Serealia", view: "brand" },
                      { label: "Kopi & Rempah", view: "brand" },
                      { label: "Sayuran", view: "brand" },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => navigate("/pasar")}
                        className="w-full text-left text-xs font-bold text-gray-600 hover:bg-orange-100/70 px-2.5 py-1.5 rounded-lg transition-all duration-150 cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Koperasi */}
            <button
              onClick={() => navigate("/koperasi")}
              onMouseEnter={() => setHoveredMain("koperasi")}
              onMouseLeave={() => setHoveredMain(null)}
              className={`relative px-3 py-1.5 rounded-full text-sm font-bold transition-colors duration-150 cursor-pointer ${currentActiveMain === "koperasi"
                ? "text-white"
                : "text-gray-600"
                }`}
            >
              {currentActiveMain === "koperasi" && (
                <motion.div
                  layoutId="sliding-pill-main"
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: "var(--color-forest)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">Koperasi</span>
            </button>

            {/* LadangAI */}
            <button
              onClick={() => navigate("/gro-ai")}
              onMouseEnter={() => setHoveredMain("ladangai")}
              onMouseLeave={() => setHoveredMain(null)}
              className={`relative px-3 py-1.5 rounded-full text-sm font-bold transition-colors duration-150 cursor-pointer ${currentActiveMain === "ladangai"
                ? "text-white"
                : "text-gray-600"
                }`}
            >
              {currentActiveMain === "ladangai" && (
                <motion.div
                  layoutId="sliding-pill-main"
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: "var(--color-lime-dark)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">Gro AI</span>
            </button>

            {/* Connect */}
            <button
              onClick={() => navigate("/connect")}
              onMouseEnter={() => setHoveredMain("komunitas")}
              onMouseLeave={() => setHoveredMain(null)}
              className={`relative px-3 py-1.5 rounded-full text-sm font-bold transition-colors duration-150 cursor-pointer ${currentActiveMain === "komunitas"
                ? "text-white"
                : "text-gray-600"
                }`}
            >
              {currentActiveMain === "komunitas" && (
                <motion.div
                  layoutId="sliding-pill-main"
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: "var(--color-orange)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">Connect</span>
            </button>
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3 relative z-50">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center w-8.5 h-8.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer shrink-0"
            >
              <ShoppingCart size={16} className="stroke-[2.5]" />
              <span
                className="absolute -top-1 -right-1 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white shadow-sm"
                style={{ backgroundColor: "var(--color-orange)" }}
              >
                2
              </span>
            </button>

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 pl-3 pr-4 rounded-full font-bold transition-colors text-sm shadow-sm cursor-pointer select-none"
                  style={{
                    backgroundColor: "var(--color-lime)",
                    color: "var(--color-forest-dark)",
                    height: "34px",
                  }}
                >
                  <User size={15} className="stroke-[2.5]" />
                  <span>{profile?.full_name ?? user?.email ?? "Pengguna"}</span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileOpen(false)}
                    ></div>
                    <div className="absolute right-0 top-full mt-4 w-70 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                      {/* Agricultural illustration header */}
                      <div
                        className="p-5 relative overflow-hidden flex flex-col justify-end min-h-25"
                        style={{ backgroundColor: "var(--color-forest)" }}
                      >
                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                          <svg
                            className="w-full h-full"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                          >
                            <path
                              d="M0,80 Q25,75 50,80 T100,80 L100,100 L0,100 Z"
                              fill="#2d6a4f"
                            />
                            <path
                              d="M0,85 Q35,80 70,85 T100,85 L100,100 L0,100 Z"
                              fill="#40916c"
                            />
                            <circle cx="85" cy="35" r="10" fill="#ffb703" />
                            <path
                              d="M10,80 L20,70 L25,80"
                              stroke="#74c69d"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M40,85 L45,72 L50,85"
                              stroke="#74c69d"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M70,82 L75,70 L80,82"
                              stroke="#74c69d"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        <h3 className="font-display font-black text-white text-base leading-tight relative z-10">
                          Kelola Akun Anda!
                        </h3>
                      </div>

                      <div className="p-3 space-y-0.5">
                        {/* Keranjang Saya */}
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            setIsCartOpen(true);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 text-sm font-bold transition-colors cursor-pointer text-left"
                        >
                          <div className="flex items-center gap-3">
                            <ShoppingCart size={18} className="text-gray-400" />
                            <span>Keranjang Saya</span>
                          </div>
                          <span
                            className="text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: "var(--color-orange)" }}
                          >
                            2
                          </span>
                        </button>

                        {/* Notifikasi */}
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            setIsNotificationOpen(true);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 text-sm font-bold transition-colors cursor-pointer text-left"
                        >
                          <div className="flex items-center gap-3">
                            <Bell size={18} className="text-gray-400" />
                            <span>Notifikasi</span>
                          </div>
                          <span
                            className="text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: "var(--color-orange)" }}
                          >
                            3
                          </span>
                        </button>

                        {/* Profil Saya */}
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate("/koperasi");
                          }}
                          className="w-full flex items-center px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 text-sm font-bold transition-colors cursor-pointer text-left gap-3"
                        >
                          <User size={18} className="text-gray-400" />
                          <span>Profil Saya</span>
                        </button>

                        {/* Transaksi Saya */}
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate("/dashboard");
                          }}
                          className="w-full flex items-center px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 text-sm font-bold transition-colors cursor-pointer text-left gap-3"
                        >
                          <Package size={18} className="text-gray-400" />
                          <span>Transaksi Saya</span>
                        </button>

                        {/* Toko Anda */}
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate("/dashboard");
                          }}
                          className="w-full flex items-center px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 text-sm font-bold transition-colors cursor-pointer text-left gap-3"
                        >
                          <Store size={18} className="text-gray-400" />
                          <span>Toko Anda</span>
                        </button>

                        {/* Dashboard KUD */}
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate("/dashboard");
                          }}
                          className="w-full flex items-center px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 text-sm font-bold transition-colors cursor-pointer text-left gap-3"
                        >
                          <Award size={18} className="text-gray-400" />
                          <span>Dashboard KUD</span>
                        </button>

                        {/* Daftar Koperasi */}
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate("/koperasi");
                          }}
                          className="w-full flex items-center px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 text-sm font-bold transition-colors cursor-pointer text-left gap-3"
                        >
                          <Building2 size={18} className="text-gray-400" />
                          <span>Daftar Koperasi</span>
                        </button>

                        {/* Separator merah */}
                        <div className="h-px bg-red-100 my-1"></div>

                        {/* Keluar */}
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            signOut();
                            navigate("/");
                          }}
                          className="w-full flex items-center px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 text-sm font-bold transition-colors cursor-pointer text-left gap-3"
                        >
                          <LogOut size={18} className="text-red-500" />
                          <span>Keluar</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate("/masuk")}
                  className="border-2 px-3 rounded-full font-bold transition-colors text-sm cursor-pointer"
                  style={{
                    color: "var(--color-forest)",
                    borderColor: "var(--color-forest)",
                    height: "34px",
                  }}
                >
                  Masuk
                </button>
                <button
                  onClick={() => navigate("/daftar")}
                  className="text-white px-3 rounded-full font-bold transition-colors shadow-sm text-sm cursor-pointer"
                  style={{
                    backgroundColor: "var(--color-orange)",
                    height: "34px",
                  }}
                >
                  Daftar Gratis
                </button>
              </>
            )}

            {isNotificationOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsNotificationOpen(false)}
                ></div>
                <div className="absolute right-0 top-full mt-4 w-90 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h3 className="font-bold text-gray-900 text-sm">
                      Notifikasi
                    </h3>
                    <button
                      className="text-xs font-bold hover:underline"
                      style={{ color: "var(--color-forest)" }}
                    >
                      Tandai semua dibaca
                    </button>
                  </div>
                  <div className="max-h-100 overflow-y-auto">
                    {/* Item 1 */}
                    <div className="p-4 flex gap-4 hover:bg-gray-50 transition-colors border-b border-gray-50 cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <ShoppingCart size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900 leading-snug mb-1">
                          Pesanan #RMV-8821 dikonfirmasi
                        </p>
                        <p className="text-xs font-medium text-gray-500">
                          5 menit lalu
                        </p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0"></div>
                    </div>
                    {/* Item 2 */}
                    <div className="p-4 flex gap-4 hover:bg-gray-50 transition-colors border-b border-gray-50 cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                        <Package size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900 leading-snug mb-1">
                          Stok Kopi Honey hampir habis: 15kg
                        </p>
                        <p className="text-xs font-medium text-gray-500">
                          1 jam lalu
                        </p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-1 shrink-0"></div>
                    </div>
                    {/* Item 3 */}
                    <div className="p-4 flex gap-4 hover:bg-gray-50 transition-colors border-b border-gray-50 cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                        <User size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900 leading-snug mb-1">
                          Pembeli baru dari Jakarta memesan 10kg kopi
                        </p>
                        <p className="text-xs font-medium text-gray-500">
                          3 jam lalu
                        </p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-orange-500 mt-1 shrink-0"></div>
                    </div>
                    {/* Item 4 */}
                    <div className="p-4 flex gap-4 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                        <Award size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 leading-snug mb-1">
                          Selamat! Badge Verified Protected Farm aktif
                        </p>
                        <p className="text-xs font-medium text-gray-400">
                          1 hari lalu
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border-t border-gray-100 text-center bg-gray-50/50 flex justify-center">
                    <button
                      className="text-xs font-bold hover:underline"
                      style={{ color: "var(--color-orange)" }}
                    >
                      Lihat Semua Notifikasi
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-gray-500 relative p-1"
            >
              <ShoppingCart size={20} />
              <span
                className="absolute -top-1 -right-1 text-white text-[9px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center border border-white"
                style={{ backgroundColor: "var(--color-orange)" }}
              >
                2
              </span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-gray-500 p-1"
              aria-label="Menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Search Overlay */}
        {isSearchOpen && (
          <>
            <div
              className="absolute top-full left-0 w-full h-screen bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsSearchOpen(false)}
            ></div>

            <div className="absolute top-full left-0 w-full bg-white z-50 border-b border-gray-100 shadow-xl pb-8 pt-6 px-8 animate-in slide-in-from-top-4 fade-in duration-200">
              <div className="max-w-3xl mx-auto relative cursor-text">
                <div className="relative group">
                  <Search
                    size={24}
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--color-forest)" }}
                  />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Cari produk, koperasi, atau komoditas..."
                    className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-gray-200 text-lg focus:outline-none focus:ring-4 transition-all font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-medium"
                    style={
                      {
                        "--tw-ring-color": "var(--color-forest)",
                        outlineColor: "var(--color-forest)",
                      } as React.CSSProperties
                    }
                  />
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span className="text-sm font-bold text-gray-500">
                    Pencarian Populer:
                  </span>
                  {[
                    "Kopi Gayo",
                    "Pupuk NPK",
                    "Udang Vaname",
                    "Rumput Laut",
                    "Benih Padi",
                  ].map((chip) => (
                    <button
                      key={chip}
                      className="bg-gray-50 text-gray-600 border border-gray-200 px-4 py-1.5 rounded-full text-sm font-bold transition-all shadow-sm hover:text-white"
                      style={
                        {
                          "--hover-bg": "var(--color-forest)",
                        } as React.CSSProperties
                      }
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60"
            onClick={() => setIsCartOpen(false)}
          ></div>
          <div className="fixed top-0 right-0 w-95 h-screen bg-white z-70 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Cart Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <h2 className="font-bold text-gray-900 text-lg">
                  Keranjang Belanja
                </h2>
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  2 item
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-gray-900 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Item 1 */}
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                  <img
                    src="https://images.unsplash.com/photo-1628172828620-379e4c1945be?auto=format&fit=crop&q=80&w=200"
                    alt="Paket Solusi Blast Padi"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">
                      Paket Solusi Blast Padi
                    </h3>
                    <p
                      className="font-bold text-sm mb-2"
                      style={{ color: "var(--color-orange)" }}
                    >
                      Rp 185.000
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 border border-gray-200 rounded-lg h-8 px-2">
                      <button className="text-gray-400 hover:text-gray-900">
                        <Minus size={14} />
                      </button>
                      <span className="font-bold text-sm min-w-5 text-center text-gray-900">
                        1
                      </span>
                      <button className="text-gray-400 hover:text-gray-900">
                        <Plus size={14} />
                      </button>
                    </div>
                    <button className="text-gray-400 hover:text-red-500 transition-colors p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                  <img
                    src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=200"
                    alt="Pupuk Kalium Premium"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">
                      Pupuk Kalium Premium
                    </h3>
                    <p
                      className="font-bold text-sm mb-2"
                      style={{ color: "var(--color-orange)" }}
                    >
                      Rp 178.000
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 border border-gray-200 rounded-lg h-8 px-2">
                      <button className="text-gray-400 hover:text-gray-900">
                        <Minus size={14} />
                      </button>
                      <span className="font-bold text-sm min-w-5 text-center text-gray-900">
                        2
                      </span>
                      <button className="text-gray-400 hover:text-gray-900">
                        <Plus size={14} />
                      </button>
                    </div>
                    <button className="text-gray-400 hover:text-red-500 transition-colors p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Cart Footer */}
            <div className="p-6 border-t border-gray-100 shrink-0 bg-gray-50/50">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-gray-500 text-sm">
                  Subtotal
                </span>
                <span
                  className="font-bold text-lg"
                  style={{ color: "var(--color-orange)" }}
                >
                  Rp 363.000
                </span>
              </div>
              <button
                className="w-full text-white font-bold h-12 rounded-xl transition-colors shadow-md"
                style={{ backgroundColor: "var(--color-orange)" }}
              >
                Checkout Sekarang
              </button>
            </div>
          </div>
        </>
      )}

      {/* Registration Modal */}
      {false && isRegisterOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-80"
            onClick={() => setIsRegisterOpen(false)}
          ></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-120 bg-white rounded-2xl z-90 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Close btn */}
            <button
              onClick={() => setIsRegisterOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors bg-white rounded-full p-1 z-10"
            >
              <X size={20} />
            </button>

            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-3">
                  <div className="relative flex items-center justify-center">
                    <Shield
                      size={32}
                      style={{
                        fill: "var(--color-forest)",
                        color: "var(--color-forest)",
                      }}
                    />
                    <Leaf
                      size={16}
                      className="absolute text-white fill-white top-1.5"
                    />
                  </div>
                </div>
                <h2 className="font-display font-bold text-2xl text-gray-900">
                  Daftar Akun Agrou
                </h2>
              </div>

              {/* Account Type Selection */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setRegisterType("koperasi")}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${registerType === "koperasi" ? "border-gray-300" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                  style={
                    registerType === "koperasi"
                      ? {
                        borderColor: "var(--color-forest)",
                        backgroundColor:
                          "color-mix(in srgb, var(--color-forest) 5%, transparent)",
                        color: "var(--color-forest)",
                      }
                      : {}
                  }
                >
                  <Shield size={24} className="mb-2" />
                  <span className="text-sm font-bold text-center leading-tight">
                    Saya Pengurus
                    <br />
                    Koperasi
                  </span>
                </button>
                <button
                  onClick={() => setRegisterType("pembeli")}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${registerType === "pembeli" ? "border-gray-300" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                  style={
                    registerType === "pembeli"
                      ? {
                        borderColor: "var(--color-orange)",
                        backgroundColor:
                          "color-mix(in srgb, var(--color-orange) 5%, transparent)",
                        color: "var(--color-orange)",
                      }
                      : {}
                  }
                >
                  <ShoppingCart size={24} className="mb-2" />
                  <span className="text-sm font-bold text-center leading-tight">
                    Saya
                    <br />
                    Pembeli
                  </span>
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4 mb-6">
                <div>
                  <input
                    type="text"
                    placeholder="Nama Lengkap"
                    className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Nomor HP"
                    className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Submit Action */}
              <button
                className="w-full text-white font-bold h-12 rounded-xl transition-colors shadow-md mb-4"
                style={{ backgroundColor: "var(--color-forest)" }}
              >
                Buat Akun Gratis
              </button>

              {/* Footer */}
              <p className="text-center text-sm font-medium text-gray-500">
                Sudah punya akun?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsRegisterOpen(false);
                    setIsLoginOpen(true);
                  }}
                  className="font-bold hover:underline"
                  style={{ color: "var(--color-forest)" }}
                >
                  Masuk di sini
                </a>
              </p>
            </div>
          </div>
        </>
      )}
      {/* Login Modal */}
      {false && isLoginOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-80"
            onClick={() => setIsLoginOpen(false)}
          ></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-110 bg-white rounded-2xl z-90 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Close btn */}
            <button
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors bg-white rounded-full p-1 z-10"
            >
              <X size={20} />
            </button>

            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-3">
                  <div className="relative flex items-center justify-center">
                    <Shield
                      size={32}
                      style={{
                        fill: "var(--color-forest)",
                        color: "var(--color-forest)",
                      }}
                    />
                    <Leaf
                      size={16}
                      className="absolute text-white fill-white top-1.5"
                    />
                  </div>
                </div>
                <h2 className="font-display font-bold text-2xl text-gray-900">
                  Masuk ke Agrou
                </h2>
              </div>

              {/* Form */}
              <div className="space-y-4 mb-4">
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Actions between input and submit */}
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Ingat saya
                  </span>
                </label>
                <a
                  href="#"
                  className="text-sm font-bold hover:underline"
                  style={{ color: "var(--color-orange)" }}
                >
                  Lupa password?
                </a>
              </div>

              {/* Submit Action */}
              <button
                onClick={() => {
                  setIsLoginOpen(false);
                  navigate("/dashboard");
                }}
                className="w-full text-white font-bold h-12 rounded-xl transition-colors shadow-md mb-6"
                style={{ backgroundColor: "var(--color-forest)" }}
              >
                Masuk
              </button>

              <div className="relative flex items-center justify-center mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative bg-white px-4 text-xs font-bold text-gray-400 uppercase">
                  atau
                </div>
              </div>

              <button className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold h-12 rounded-xl transition-colors mb-6 flex items-center justify-center gap-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Masuk dengan Google
              </button>

              {/* Footer */}
              <p className="text-center text-sm font-medium text-gray-500">
                Belum punya akun?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsLoginOpen(false);
                    setIsRegisterOpen(true);
                  }}
                  className="font-bold hover:underline"
                  style={{ color: "var(--color-forest)" }}
                >
                  Daftar Gratis →
                </a>
              </p>
            </div>
          </div>
        </>
      )}

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="fixed top-0 right-0 w-70 h-screen bg-white z-110 shadow-2xl flex flex-col lg:hidden animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <span
                className="font-display font-black text-xl"
                style={{ color: "var(--color-forest)" }}
              >
                Menu
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-400 hover:text-gray-900 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 py-6 px-6 space-y-4 overflow-y-auto">
              <button
                onClick={() => {
                  navigate("/");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left py-2.5 font-bold text-sm ${currentView === "app" ? "" : "text-gray-600"}`}
                style={
                  currentView === "app" ? { color: "var(--color-forest)" } : {}
                }
              >
                Beranda
              </button>
              <button
                onClick={() => {
                  navigate("/tani");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left py-2.5 font-bold text-sm ${currentView === "shield" || currentView === "katalog" ? "" : "text-gray-600"}`}
                style={
                  currentView === "shield" || currentView === "katalog"
                    ? { color: "var(--color-forest)" }
                    : {}
                }
              >
                Marketplace
              </button>
              <button
                onClick={() => {
                  navigate("/pasar");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left py-2.5 font-bold text-sm ${currentView === "pasar" ? "" : "text-gray-600"}`}
                style={
                  currentView === "pasar"
                    ? { color: "var(--color-orange)" }
                    : {}
                }
              >
                Pasar
              </button>
              <button
                onClick={() => {
                  navigate("/koperasi");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left py-2.5 font-bold text-sm ${currentView === "koperasi" ? "" : "text-gray-600"}`}
                style={
                  currentView === "koperasi"
                    ? { color: "var(--color-forest)" }
                    : {}
                }
              >
                Koperasi
              </button>
              <button
                onClick={() => {
                  navigate("/gro-ai");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left py-2.5 font-bold text-sm text-gray-600"
              >
                Chatbot
              </button>

              <hr className="border-gray-100 my-4" />

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (isLoggedIn) {
                    navigate("/dashboard");
                  } else {
                    setIsLoginOpen(true);
                  }
                }}
                className="w-full text-center border-2 py-2.5 rounded-full font-bold transition-colors"
                style={{
                  borderColor: "var(--color-forest)",
                  color: "var(--color-forest)",
                }}
              >
                {isLoggedIn ? "Dashboard KUD" : "Masuk"}
              </button>

              {!isLoggedIn && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsRegisterOpen(true);
                  }}
                  className="w-full text-center text-white py-2.5 rounded-full font-bold transition-colors shadow-md"
                  style={{ backgroundColor: "var(--color-forest)" }}
                >
                  Daftar Gratis
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Fixed Bottom Navigation Bar for Mobile (< 768px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] h-16.5 flex items-center justify-around px-2">
        {/* Beranda */}
        <button
          onClick={() => navigate("/")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${currentView === "app" ? "" : "text-gray-400 hover:text-gray-600"}`}
          style={currentView === "app" ? { color: "var(--color-forest)" } : {}}
        >
          <Home
            size={20}
            className={currentView === "app" ? "stroke-[2.5]" : "stroke-2"}
          />
          <span className="text-[10px] font-bold mt-1">Beranda</span>
        </button>

        {/* Tani */}
        <button
          onClick={() => navigate("/tani")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${currentView === "shield" || currentView === "katalog" ? "" : "text-gray-400 hover:text-gray-600"}`}
          style={
            currentView === "shield" || currentView === "katalog"
              ? { color: "var(--color-forest)" }
              : {}
          }
        >
          <Shield
            size={20}
            className={
              currentView === "shield" || currentView === "katalog"
                ? "stroke-[2.5]"
                : "stroke-2"
            }
          />
          <span className="text-[10px] font-bold mt-1">Tani</span>
        </button>

        {/* Pasar */}
        <button
          onClick={() => navigate("/pasar")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${currentView === "pasar" ? "" : "text-gray-400 hover:text-gray-600"}`}
          style={
            currentView === "pasar" ? { color: "var(--color-forest)" } : {}
          }
        >
          <Store
            size={20}
            className={currentView === "pasar" ? "stroke-[2.5]" : "stroke-2"}
          />
          <span className="text-[10px] font-bold mt-1">Pasar</span>
        </button>

        {/* Koperasi */}
        <button
          onClick={() => navigate("/koperasi")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${currentView === "koperasi" ? "" : "text-gray-400 hover:text-gray-600"}`}
          style={
            currentView === "koperasi" ? { color: "var(--color-forest)" } : {}
          }
        >
          <Building2
            size={20}
            className={currentView === "koperasi" ? "stroke-[2.5]" : "stroke-2"}
          />
          <span className="text-[10px] font-bold mt-1">Koperasi</span>
        </button>

        {/* Akun */}
        <button
          onClick={() => {
            if (isLoggedIn) {
              navigate("/dashboard");
            } else {
              setIsLoginOpen(true);
            }
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${currentView === "dashboard" ? "" : "text-gray-400 hover:text-gray-600"}`}
          style={
            currentView === "dashboard" ? { color: "var(--color-forest)" } : {}
          }
        >
          <User
            size={20}
            className={
              currentView === "dashboard" ? "stroke-[2.5]" : "stroke-2"
            }
          />
          <span className="text-[10px] font-bold mt-1">Akun</span>
        </button>
      </nav>
    </>
  );
}
