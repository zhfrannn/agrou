import { useQuery } from "@tanstack/react-query";
import supabase from "../../lib/supabase";
import { formatCurrency } from "../../lib/queries/orders";
import { Users, Store, Package, ShoppingBag } from "lucide-react";

function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [uR, kR, pR, oR] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("koperasi").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("status, total_amount"),
      ]);
      const orders = (oR.data ?? []) as Array<{
        status: string;
        total_amount: number;
      }>;
      return {
        totalUsers: uR.count ?? 0,
        totalKoperasi: kR.count ?? 0,
        totalProducts: pR.count ?? 0,
        totalOrders: orders.length,
        totalRevenue: orders
          .filter((o) => o.status === "delivered")
          .reduce((s, o) => s + (o.total_amount ?? 0), 0),
      };
    },
  });
}

export default function DashboardBerandaAdmin() {
  const { data: s } = useAdminStats();

  const cards = [
    {
      label: "Total User",
      value: s?.totalUsers ?? 0,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Koperasi",
      value: s?.totalKoperasi ?? 0,
      icon: Store,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Total Produk",
      value: s?.totalProducts ?? 0,
      icon: Package,
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(s?.totalRevenue ?? 0),
      icon: ShoppingBag,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Overview platform Agrou secara keseluruhan
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
