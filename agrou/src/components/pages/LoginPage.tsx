import React, { useState } from "react";
import { Eye, EyeOff, ArrowLeft, Leaf } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

interface LoginPageProps {
  onSuccess: () => void;
  onGoToRegister: () => void;
  onBack: () => void;
}

export default function LoginPage({
  onSuccess,
  onGoToRegister,
  onBack,
}: LoginPageProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      onSuccess();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Login gagal. Periksa email dan password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d2918] flex flex-col">
      {/* Back button */}
      <div className="p-5">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#b5f23d] hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-5 pb-10">
        <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-[#b5f23d] rounded-2xl flex items-center justify-center mb-3">
              <Leaf className="w-6 h-6 text-[#0d2918]" />
            </div>
            <h1 className="text-2xl font-bold text-white font-display">
              Agrou
            </h1>
            <p className="text-[#b5f23d]/70 text-sm mt-1">Masuk ke akun Anda</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm text-white/70 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="nama@email.com"
                className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#b5f23d] transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-white/70 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 pr-12 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#b5f23d] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#b5f23d] hover:bg-[#9fcb1f] text-[#0d2918] font-semibold rounded-xl py-3 mt-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-[#0d2918]/40 rounded-full border-t-[#0d2918] animate-spin" />
              )}
              Masuk
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Belum punya akun?{" "}
            <button
              onClick={onGoToRegister}
              className="text-[#b5f23d] hover:text-white transition-colors font-medium"
            >
              Daftar
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
