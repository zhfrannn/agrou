import { useState } from "react";
import {
  Search,
  Users,
  AlertCircle,
  CheckCircle2,
  ShoppingCart,
  PackageOpen,
  Package,
} from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import { useMyKoperasi } from "../lib/queries/koperasi";
import { useMemberNeedsByKoperasi } from "../lib/queries/memberNeeds";
import { TableRowSkeleton } from "./ui/LoadingSkeleton";
import { ErrorState } from "./ui/ErrorState";
import { EmptyState } from "./ui/EmptyState";
import { formatPrice } from "../lib/queries/products";

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  fulfilled: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLE[status] ?? "bg-gray-100 text-gray-600";
  const labels: Record<string, string> = {
    pending: "Menunggu",
    processing: "Diproses",
    fulfilled: "Terpenuhi",
    cancelled: "Dibatalkan",
  };
  return (
    <span
      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${style}`}
    >
      {labels[status] ?? status}
    </span>
  );
}

export default function DashboardMemberNeeds() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const { data: koperasi } = useMyKoperasi(user?.id ?? "");
  const {
    data: needs,
    isLoading,
    error,
    refetch,
  } = useMemberNeedsByKoperasi(koperasi?.id ?? "");

  const filtered = (needs ?? []).filter(
    (n) => !search || n.title.toLowerCase().includes(search.toLowerCase()),
  );

  const pendingCount = (needs ?? []).filter(
    (n) => n.status === "pending",
  ).length;
  const totalEstimate = (needs ?? []).reduce(
    (sum, n) => sum + (n.quantity ?? 0),
    0,
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
      {/* HEADER */}
      <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between shrink-0 shadow-sm z-10 w-full">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 flex items-center gap-3">
            <Users className="text-[#2D6A4F]" size={28} />
            Kebutuhan Anggota
          </h1>
          <p className="text-sm font-medium text-gray-500">
            Rekap permintaan sarana produksi dari anggota koperasi.
          </p>
        </div>
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Cari kebutuhan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 h-9 bg-slate-100 rounded-xl text-sm font-medium text-gray-700 placeholder:text-gray-400 border-none outline-none w-52"
          />
        </div>
      </header>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 w-full max-w-[1440px] mx-auto space-y-6">
        {/* Summary Cards */}
        {!isLoading && !error && needs && needs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Total Permintaan",
                value: String(needs.length),
                color: "text-[#2D6A4F]",
              },
              {
                label: "Menunggu Diproses",
                value: String(pendingCount),
                color: "text-[#F77F00]",
              },
              {
                label: "Total Estimasi Qty",
                value: `${totalEstimate} unit`,
                color: "text-blue-600",
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
              >
                <p className="text-sm font-medium text-gray-500 mb-1">
                  {label}
                </p>
                <p className={`font-black text-2xl ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {isLoading && <TableRowSkeleton cols={5} />}

        {error && (
          <ErrorState
            message={(error as Error).message}
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !error && filtered.length === 0 && (
          <EmptyState
            icon={PackageOpen}
            title="Belum Ada Permintaan"
            description="Permintaan kebutuhan dari anggota akan muncul di sini."
          />
        )}

        {!isLoading && !error && filtered.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                    ID
                  </th>
                  <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Judul
                  </th>
                  <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Qty
                  </th>
                  <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Tgl
                  </th>
                  <th className="text-center p-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="p-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((need, i) => (
                  <motion.tr
                    key={need.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4 font-bold text-gray-900 text-xs">
                      <span className="border-b border-dashed border-gray-300">
                        #{need.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-gray-900 text-sm">
                        {need.title}
                      </p>
                      {need.description && (
                        <p className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">
                          {need.description}
                        </p>
                      )}
                    </td>
                    <td className="p-4 font-medium text-gray-700">
                      {need.quantity ?? "—"} {need.unit ?? ""}
                    </td>
                    <td className="p-4 text-gray-500 text-xs">
                      {new Date(need.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4 text-center">
                      <StatusBadge status={need.status} />
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-[#2D6A4F] font-bold text-xs hover:underline">
                        Detail
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
