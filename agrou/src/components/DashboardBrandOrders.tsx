import { useState } from "react";
import {
  Search,
  ShoppingBag,
  Clock,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Package,
  Printer,
} from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import {
  useMyOrders,
  useUpdateOrderStatus,
  formatCurrency,
  formatDate,
  formatOrderId,
  ORDER_STATUS_LABEL,
} from "../lib/queries/orders";
import { TableRowSkeleton } from "./ui/LoadingSkeleton";
import { ErrorState } from "./ui/ErrorState";
import { EmptyState } from "./ui/EmptyState";
import type { OrderStatus } from "../lib/queries/orders";
import toast from "react-hot-toast";

const TABS: { name: string; status: OrderStatus | "all" }[] = [
  { name: "Semua", status: "all" },
  { name: "Pending", status: "pending" },
  { name: "Diproses", status: "processing" },
  { name: "Dikirim", status: "shipped" },
  { name: "Selesai", status: "delivered" },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

export default function DashboardBrandOrders() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<OrderStatus | "all">("pending");
  const [search, setSearch] = useState("");

  const {
    data: orders,
    isLoading,
    error,
    refetch,
  } = useMyOrders(user?.id ?? "", "seller");
  const updateStatus = useUpdateOrderStatus();

  const handleConfirm = (id: string) => {
    updateStatus.mutate(
      { id, status: "confirmed" },
      {
        onSuccess: () => toast.success("Pesanan dikonfirmasi"),
        onError: () => toast.error("Gagal mengkonfirmasi pesanan"),
      },
    );
  };

  const handleCancel = (id: string) => {
    updateStatus.mutate(
      { id, status: "cancelled" },
      {
        onSuccess: () => toast.success("Pesanan ditolak"),
        onError: () => toast.error("Gagal menolak pesanan"),
      },
    );
  };

  const filtered = (orders ?? []).filter((o) => {
    const matchTab = activeTab === "all" || o.status === activeTab;
    const matchSearch =
      !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      (o.buyer as { full_name?: string } | null)?.full_name
        ?.toLowerCase()
        .includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const tabCounts = TABS.map((t) => ({
    ...t,
    count:
      t.status === "all"
        ? (orders ?? []).length
        : (orders ?? []).filter((o) => o.status === t.status).length,
  }));

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
      {/* HEADER */}
      <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between shrink-0 shadow-sm z-10 w-full">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 flex items-center gap-3">
            <ShoppingBag className="text-[#2D6A4F]" size={28} />
            Pesanan Masuk
          </h1>
          <p className="text-sm font-medium text-gray-500">
            Kelola dan konfirmasi pesanan dari pembeli.
          </p>
        </div>
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Cari pesanan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 h-9 bg-slate-100 rounded-xl text-sm font-medium text-gray-700 placeholder:text-gray-400 border-none outline-none w-56"
          />
        </div>
      </header>

      {/* TABS */}
      <div className="bg-white border-b border-gray-100 px-8 flex items-center gap-1 shrink-0">
        {tabCounts.map((t) => (
          <button
            key={t.status}
            onClick={() => setActiveTab(t.status)}
            className={`px-4 py-3 text-sm font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === t.status
                ? "border-[#1B4332] text-[#1B4332]"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            {t.name}
            {t.count > 0 && (
              <span
                className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeTab === t.status ? "bg-[#1B4332] text-white" : "bg-gray-100 text-gray-500"}`}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 w-full max-w-360 mx-auto">
        {isLoading && <TableRowSkeleton cols={3} />}

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
            description={`Belum ada pesanan${activeTab !== "all" ? ` dengan status "${ORDER_STATUS_LABEL[activeTab as OrderStatus] ?? activeTab}"` : ""}.`}
          />
        )}

        {!isLoading && !error && filtered.length > 0 && (
          <div className="space-y-4">
            {filtered.map((order, i) => {
              const buyer = order.buyer as { full_name?: string } | null;
              const statusColor =
                STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600";
              const isPending = order.status === "pending";

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  {/* Order header */}
                  <div className="grid grid-cols-12 gap-4 items-start px-6 pt-5 pb-4">
                    {/* LEFT — Order info */}
                    <div className="col-span-9">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-black text-sm text-gray-900">
                          {formatOrderId(order.id)}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${statusColor}`}
                        >
                          {ORDER_STATUS_LABEL[order.status as OrderStatus] ??
                            order.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(order.created_at)}
                        </span>
                      </div>

                      {/* Buyer */}
                      <div className="flex items-center gap-2 mb-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs shrink-0">
                          {buyer?.full_name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">
                            {buyer?.full_name ?? "—"}
                          </p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-1">
                        {(order.items ?? []).map((item, j) => (
                          <div
                            key={j}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-gray-700 font-medium">
                              {item.quantity}×{" "}
                              {(item.product as { name?: string } | null)
                                ?.name ?? `Produk`}
                            </span>
                            <span className="font-bold text-gray-900">
                              {formatCurrency(
                                item.subtotal ?? item.quantity * item.price,
                              )}
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between pt-2 border-t border-gray-50 text-sm font-black text-gray-900">
                          <span>Total</span>
                          <span className="text-[#1B4332]">
                            {formatCurrency(order.total_amount)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT — Actions */}
                    <div className="col-span-3 flex flex-col gap-2 pt-1">
                      {isPending && (
                        <>
                          <button
                            onClick={() => handleConfirm(order.id)}
                            disabled={updateStatus.isPending}
                            className="w-full bg-[#1B4332] hover:bg-[#2D6A4F] disabled:opacity-50 text-white rounded-lg h-9 font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                          >
                            <CheckCircle2 size={14} /> Konfirmasi
                          </button>
                          <button
                            onClick={() => handleCancel(order.id)}
                            disabled={updateStatus.isPending}
                            className="w-full bg-white border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 rounded-lg h-9 font-bold text-sm transition-colors"
                          >
                            Tolak
                          </button>
                        </>
                      )}
                      <button className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors">
                        <Printer size={13} /> Cetak Invoice
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
