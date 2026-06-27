import { ReactNode } from "react";
import { PackageSearch } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  description?: string;
  icon?: ReactNode;
}

export function EmptyState({
  title = "Tidak ada data",
  message,
  description,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        {icon ?? <PackageSearch size={22} className="text-gray-400" />}
      </div>
      <p className="text-sm font-semibold text-gray-700 mb-1">{title}</p>
      <p className="text-xs text-gray-400 max-w-xs">
        {message ?? description ?? "Belum ada data yang tersedia saat ini."}
      </p>
    </div>
  );
}
