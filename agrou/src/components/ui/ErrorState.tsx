import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Terjadi kesalahan saat memuat data.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <AlertCircle size={22} className="text-red-500" />
      </div>
      <p className="text-sm font-semibold text-gray-700 mb-1">Gagal memuat</p>
      <p className="text-xs text-gray-400 max-w-xs mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 text-xs font-bold text-[#1B4D3E] border border-[#1B4D3E]/30 px-4 py-2 rounded-full hover:bg-[#1B4D3E]/5 transition-colors cursor-pointer"
        >
          <RefreshCw size={13} />
          Coba lagi
        </button>
      )}
    </div>
  );
}
