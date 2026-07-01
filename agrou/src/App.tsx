import { lazy, Suspense } from "react";
import type { ReactNode } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { ErrorBoundary } from "./components/layout/ErrorBoundary";

// Static imports — needed on the initial / render
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Hero from "./components/home/Hero";
import MarqueeStrip from "./components/home/MarqueeStrip";
import ValuePropStrip from "./components/home/ValuePropStrip";
import ModuleIntro from "./components/home/ModuleIntro";
import PromoBanner from "./components/home/PromoBanner";
import BestSellers from "./components/home/BestSellers";
import EkosistemBridge from "./components/home/EkosistemBridge";
import KoperasiTerpercaya from "./components/home/KoperasiTerpercaya";
import HomeBottom from "./components/home/HomeBottom";
import heroBg from "../assets/backgorund-hero.jpg";

// Lazy-loaded page routes — split into separate chunks
const TaniPage = lazy(() => import("./components/pages/TaniPage"));
const BrandPage = lazy(() => import("./components/pages/BrandPage"));
const DashboardPage = lazy(
  () => import("./components/dashboard/DashboardPage"),
);
const KoperasiPage = lazy(() => import("./components/pages/KoperasiPage"));
const KoperasiProfilePage = lazy(
  () => import("./components/pages/KoperasiProfilePage"),
);
const AboutPage = lazy(() => import("./components/pages/AboutPage"));
const KatalogPage = lazy(() => import("./components/pages/KatalogPage"));
const GroAIPage = lazy(() => import("./components/gro-ai/GroAIPage"));
const ConnectPage = lazy(() => import("./components/pages/ConnectPage"));
const ImportirProfilePage = lazy(
  () => import("./components/pages/ImportirProfilePage"),
);
const LoginPage = lazy(() => import("./components/pages/LoginPage"));
const RegisterPage = lazy(() => import("./components/pages/RegisterPage"));

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#0d1f15] flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-[#2d7a4f] rounded-full border-t-transparent" />
    </div>
  );
}

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
    <div
      className={`min-h-screen text-(--color-text-primary) font-sans overflow-x-hidden selection:bg-(--color-orange) selection:text-white ${location.pathname === "/gro-ai" ? "bg-white" : ""}`}
    >
      <Header />
      <main
        className={
          location.pathname === "/gro-ai" || location.pathname === "/connect"
            ? "bg-white"
            : "pb-18 md:pb-0"
        }
      >
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/katalog" element={<KatalogPage />} />
            <Route path="/pasar" element={<BrandPage />} />
            <Route
              path="/tani"
              element={
                <ErrorBoundary>
                  <TaniPage />
                </ErrorBoundary>
              }
            />
            <Route path="/koperasi" element={<KoperasiPage />} />
            <Route path="/koperasi/:slug" element={<KoperasiProfilePage />} />
            <Route
              path="/connect/importir/:id"
              element={<ImportirProfilePage />}
            />
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
        </Suspense>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
