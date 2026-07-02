import { useAuth } from "../../hooks/useAuth";
import {
  useMyPurchases,
  formatCurrency,
  formatDate,
  formatOrderId,
  ORDER_STATUS_LABEL,
} from "../../lib/queries/orders";
import { Package } from "lucide-react";

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function DashboardPesananPembeli() {
  const { profile } = useAuth();
  const { data: orders, isLoading } = useMyPurchases(profile?.id ?? "");

  if (isLoading) {
    return (
      <div className="p-6 text-gray-500 text-sm">Memuat pesanan...</div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Pesanan Saya</h2>
      {!orders?.length ? (
        <div className="text-center py-16 text-gray-400">
          <Package size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Belum ada pesanan</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-gray-900">
                  {formatOrderId(order.id)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    STATUS_COLOR[order.status] ?? "bg-gray-100 text-gray-600"
                  }`}
                >
                  {ORDER_STATUS_LABEL[order.status]}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {formatDate(order.created_at)}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm text-gray-600">Total</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(order.total_amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
