import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import MarqueeStrip from "./components/MarqueeStrip";
import ValuePropStrip from "./components/ValuePropStrip";
import heroBg from "../assets/backgorund-hero.jpg";
import ModuleIntro from "./components/ModuleIntro";
import PromoBanner from "./components/PromoBanner";
import BestSellers from "./components/BestSellers";
import EkosistemBridge from "./components/EkosistemBridge";
import KoperasiTerpercaya from "./components/KoperasiTerpercaya";
import HomeBottom from "./components/HomeBottom";
import Footer from "./components/Footer";
import TaniPage from "./components/TaniPage";
import BrandPage from "./components/BrandPage";
import DashboardPage from "./components/DashboardPage";
import KoperasiPage from "./components/KoperasiPage";
import KoperasiProfilePage from "./components/KoperasiProfilePage";
import AboutPage from "./components/AboutPage";
import KatalogPage from "./components/KatalogPage";
import GroAIPage from "./components/GroAIPage";
import ConnectPage from "./components/ConnectPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import { useAuth } from "./hooks/useAuth";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen bg-[#0d1f15] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#2d7a4f] rounded-full border-t-transparent" />
      </div>
    );
  if (!user) return <Navigate to="/masuk" replace />;
  return <>{children}</>;
}

function AuthRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen bg-[#0d1f15] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#2d7a4f] rounded-full border-t-transparent" />
      </div>
    );
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function HomePage() {
  return (
    <>
      <div
        className="w-full relative z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-[#0d2918]/80 via-[#0d2918]/45 to-transparent z-0" />
        <div className="absolute inset-0 bg-black/5 z-0" />
        <div className="relative z-10">
          <Hero />
          <MarqueeStrip />
          <ValuePropStrip />
        </div>
      </div>
      <ModuleIntro />
      <PromoBanner />
      <BestSellers />
      <EkosistemBridge />
      <KoperasiTerpercaya />
      <HomeBottom />
    </>
  );
}

function LoginPageWrapper() {
  const navigate = useNavigate();
  return (
    <LoginPage
      onSuccess={() => navigate("/dashboard", { replace: true })}
      onGoToRegister={() => navigate("/daftar")}
      onBack={() => navigate("/")}
    />
  );
}

function RegisterPageWrapper() {
  const navigate = useNavigate();
  return (
    <RegisterPage
      onSuccess={() => navigate("/masuk")}
      onGoToLogin={() => navigate("/masuk")}
      onBack={() => navigate("/")}
    />
  );
}

export default function App() {
  const location = useLocation();
  const hideFooter =
    location.pathname === "/gro-ai" || location.pathname === "/connect";

  return (
    <div className="min-h-screen text-(--color-text-primary) font-sans overflow-x-hidden selection:bg-(--color-orange) selection:text-white">
      <Header />
      <main
        className={
          location.pathname === "/gro-ai" || location.pathname === "/connect"
            ? ""
            : "pb-18 md:pb-0"
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/katalog" element={<KatalogPage />} />
          <Route path="/pasar" element={<BrandPage />} />
          <Route path="/tani" element={<TaniPage />} />
          <Route path="/koperasi" element={<KoperasiPage />} />
          <Route path="/koperasi/:slug" element={<KoperasiProfilePage />} />
          <Route path="/connect" element={<ConnectPage />} />
          <Route path="/gro-ai" element={<GroAIPage />} />
          <Route path="/tentang" element={<AboutPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/masuk"
            element={
              <AuthRoute>
                <LoginPageWrapper />
              </AuthRoute>
            }
          />
          <Route
            path="/daftar"
            element={
              <AuthRoute>
                <RegisterPageWrapper />
              </AuthRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
