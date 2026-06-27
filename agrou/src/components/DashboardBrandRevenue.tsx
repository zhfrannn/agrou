import { useState } from "react";
import { Wallet, Building, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useDashboardStats, formatCurrency } from "../lib/queries/orders";
import { useMyOrders } from "../lib/queries/orders";
import { TableRowSkeleton } from "./ui/LoadingSkeleton";
import { ErrorState } from "./ui/ErrorState";
import { EmptyState } from "./ui/EmptyState";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Ags",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

export default function DashboardBrandRevenue() {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useDashboardStats(user?.id ?? "");
  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersError,
  } = useMyOrders(user?.id ?? "", "seller");

  const isLoading = statsLoading || ordersLoading;
  const error = statsError || ordersError;

  // Build member contribution data from delivered orders
  const deliveredOrders = (orders ?? []).filter(
    (o) => o.status === "delivered",
  );
  const totalRev = stats?.totalRevenue ?? 0;

  // Group by buyer for "top contributors" display
  const buyerMap = new Map<string, { name: string; total: number }>();
  deliveredOrders.forEach((o) => {
    const buyerName =
      (o.buyer as { full_name?: string } | null)?.full_name ?? "Pembeli";
    const existing = buyerMap.get(buyerName) ?? { name: buyerName, total: 0 };
    buyerMap.set(buyerName, {
      ...existing,
      total: existing.total + o.total_amount,
    });
  });
  const topBuyers = Array.from(buyerMap.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
  const maxBuyerTotal = topBuyers[0]?.total ?? 1;

  const prevMonth = () => setSelectedMonth((m) => (m === 0 ? 11 : m - 1));
  const nextMonth = () => setSelectedMonth((m) => (m === 11 ? 0 : m + 1));

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
      {/* HEADER */}
      <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center shrink-0 shadow-sm z-10 w-full">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 flex items-center gap-3">
            <Wallet className="text-[#2D6A4F]" size={28} />
            Revenue & Pembagian
          </h1>
          <p className="text-sm font-medium text-gray-500">
            Rekap pendapatan penjualan produk Anda.
          </p>
        </div>
      </header>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 w-full max-w-360 mx-auto space-y-8">
        {/* Month selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={prevMonth}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Bulan sebelumnya"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="font-bold text-gray-900 text-base w-16 text-center">
            {MONTHS[selectedMonth]}
          </span>
          <button
            onClick={nextMonth}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Bulan berikutnya"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {isLoading && <TableRowSkeleton cols={5} />}

        {error && (
          <ErrorState
            message={(error as Error).message}
            onRetry={() => refetchStats()}
          />
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Stats overview */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
              <h2 className="font-bold text-gray-900 text-[15px]">Ringkasan</h2>
              {[
                {
                  label: "Total Revenue (selesai)",
                  value: formatCurrency(totalRev),
                  color: "text-[#2D6A4F]",
                },
                {
                  label: "Total Pesanan",
                  value: String(stats?.totalOrders ?? 0),
                  color: "text-gray-900",
                },
                {
                  label: "Total Produk Aktif",
                  value: String(stats?.totalProducts ?? 0),
                  color: "text-gray-900",
                },
                {
                  label: "Pesanan Selesai",
                  value: String(deliveredOrders.length),
                  color: "text-green-700",
                },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <span className="text-sm font-medium text-gray-600">
                    {label}
                  </span>
                  <span className={`font-bold text-base ${color}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Top buyers */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 text-[15px] mb-4">
                Top Pembeli
              </h2>

              {topBuyers.length === 0 ? (
                <EmptyState
                  title="Belum Ada Transaksi"
                  description="Transaksi yang selesai akan muncul di sini."
                />
              ) : (
                <div className="space-y-4">
                  {topBuyers.map((buyer) => {
                    const pct = Math.round((buyer.total / maxBuyerTotal) * 100);
                    return (
                      <div key={buyer.name}>
                        <div className="flex justify-between text-sm font-bold text-gray-900 mb-1.5">
                          <span className="truncate max-w-[60%]">
                            {buyer.name}
                          </span>
                          <span className="text-[#2D6A4F]">
                            {formatCurrency(buyer.total)}
                          </span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#74C69D] rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-6 pt-5 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-400 flex items-center gap-2 justify-center">
                  <Building size={13} /> Transfer via: BRI / BSI / DANA
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
