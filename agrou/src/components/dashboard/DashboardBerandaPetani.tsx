import { useAuth } from "../../hooks/useAuth";
import { useDashboardStats, formatCurrency } from "../../lib/queries/orders";
import { TrendingUp, ShoppingBag, Package, Clock } from "lucide-react";

export default function DashboardBerandaPetani() {
  const { profile } = useAuth();
  const { data: stats } = useDashboardStats(profile?.id ?? "");

  const cards = [
    {
      label: "Total Pendapatan",
      value: formatCurrency(stats?.totalRevenue ?? 0),
      icon: TrendingUp,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Total Pesanan",
      value: stats?.totalOrders ?? 0,
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Produk Aktif",
      value: stats?.totalProducts ?? 0,
      icon: Package,
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Pesanan Pending",
      value: stats?.pendingOrders ?? 0,
      icon: Clock,
      color: "bg-yellow-50 text-yellow-600",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Selamat datang, {profile?.full_name ?? "Petani"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Pantau hasil panen dan pesananmu
        </p>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.color}`}
            >
              <c.icon size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{c.value}</div>
            <div className="text-sm text-gray-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
