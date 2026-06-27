import { useState } from "react";
import {
  Search,
  Shield,
  Filter,
  Package,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  FileText,
  Download,
} from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import {
  useMyShieldOrders,
  SHIELD_STATUS_LABEL,
  SHIELD_STATUS_COLOR,
} from "../lib/queries/shield";
import { TableRowSkeleton } from "./ui/LoadingSkeleton";
import { ErrorState } from "./ui/ErrorState";
import { EmptyState } from "./ui/EmptyState";
import { formatCurrency } from "../lib/queries/orders";
import type { ShieldStatus } from "../lib/queries/shield";

const ORDER_STATUSES: (ShieldStatus | "all")[] = [
  "all",
  "active",
  "claimed",
  "expired",
  "cancelled" as ShieldStatus,
];

function StatusBadge({ status }: { status: string }) {
  const color =
    SHIELD_STATUS_COLOR[status as ShieldStatus] ?? "bg-gray-100 text-gray-600";
  const label = SHIELD_STATUS_LABEL[status as ShieldStatus] ?? status;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${color}`}
    >
      {label}
    </span>
  );
}

export default function DashboardShieldOrders() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ShieldStatus | "all">("all");

  const {
    data: orders,
    isLoading,
    error,
    refetch,
  } = useMyShieldOrders(user?.id ?? "");

  const filtered = (orders ?? []).filter(
    (o) => activeTab === "all" || o.status === activeTab,
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
      {/* HEADER */}
      <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center shrink-0 shadow-sm z-10 w-full">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 flex items-center gap-3">
            <Shield className="text-[#2D6A4F]" size={28} />
            Riwayat Proteksi
          </h1>
          <p className="text-sm font-medium text-gray-500">
            Semua paket perlindungan tanaman yang pernah Anda beli.
          </p>
        </div>
      </header>

      {/* TABS */}
      <div className="bg-white border-b border-gray-100 px-8 flex items-center gap-1 overflow-x-auto shrink-0">
        {ORDER_STATUSES.map((s) => {
          const count =
            s === "all"
              ? (orders ?? []).length
              : (orders ?? []).filter((o) => o.status === s).length;
          const label =
            s === "all"
              ? "Semua"
              : (SHIELD_STATUS_LABEL[s as ShieldStatus] ?? s);
          return (
            <button
              key={s}
              onClick={() => setActiveTab(s)}
              className={`px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === s
                  ? "border-[#1B4332] text-[#1B4332]"
                  : "border-transparent text-gray-400 hover:text-gray-700"
              }`}
            >
              {label}
              {count > 0 && (
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeTab === s ? "bg-[#1B4332] text-white" : "bg-gray-100 text-gray-500"}`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 w-full max-w-[1440px] mx-auto space-y-4">
        {isLoading && <TableRowSkeleton rows={4} />}

        {error && (
          <ErrorState
            message={(error as Error).message}
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !error && filtered.length === 0 && (
          <EmptyState
            icon={Package}
            title="Tidak Ada Pesanan"
            description={`Belum ada pesanan proteksi${activeTab !== "all" ? ` dengan status "${SHIELD_STATUS_LABEL[activeTab as ShieldStatus] ?? activeTab}"` : ""}.`}
          />
        )}

        {!isLoading &&
          !error &&
          filtered.length > 0 &&
          filtered.map((order, i) => {
            const product = order.product;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center shrink-0">
                    <Shield size={22} className="text-[#2D6A4F]" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-sm text-gray-900">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="font-bold text-gray-800">
                      {product?.name ?? "Paket Proteksi"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    {(order as any).tracking_number && (
                      <p className="text-xs text-gray-400 font-medium">
                        Resi:{" "}
                        <span className="font-bold text-gray-700">
                          {(order as any).tracking_number}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Price + actions */}
                  <div className="text-right shrink-0 space-y-2">
                    <p className="font-black text-lg text-[#2D6A4F]">
                      {formatCurrency(order.total_premium ?? 0)}
                    </p>
                    {order.status === "active" && (
                      <button className="text-[#2D6A4F] hover:bg-green-50 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all border border-[#2D6A4F]/20">
                        <FileText size={14} /> Ajukan Klaim
                      </button>
                    )}
                    <button className="text-gray-400 hover:bg-gray-50 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all">
                      <Download size={14} /> Invoice
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
}
