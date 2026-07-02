# PHASE 4 — Role-Based Dashboards

> Tujuan: Dashboard terpisah untuk petani, pembeli, admin dengan data real Supabase.
> Estimasi: 90-120 menit | Prasyarat: Phase 1, 2, 3 selesai

---

## 4.1 — Update DashboardPage.tsx

### Tambah imports di atas file:
```typescript
import DashboardBerandaPetani from "./DashboardBerandaPetani";
import DashboardBerandaPembeli from "./DashboardBerandaPembeli";
import DashboardBerandaAdmin from "./DashboardBerandaAdmin";
import DashboardPesananPembeli from "./DashboardPesananPembeli";
import { useBuyerStats } from "../../lib/queries/orders";
import { useMyKoperasi, useKoperasiStats } from "../../lib/queries/koperasi";
```

### Tambah di dalam DashboardPage() setelah `const { profile } = useAuth()`:
```typescript
const role = profile?.role ?? "pembeli";
const { data: koperasi } = useMyKoperasi(profile?.id ?? "");
const { data: koperasiStats } = useKoperasiStats(koperasi?.id ?? "");
const { data: buyerStats } = useBuyerStats(profile?.id ?? "");
```

---

## 4.2 — Nav Items per Role

Tambahkan konstanta ini SEBELUM fungsi DashboardPage():

```typescript
const NAV_KOPERASI = [
  { view: "beranda",         icon: Home,         label: "Beranda" },
  { view: "produk",          icon: Package,      label: "Produk" },
  { view: "pesanan",         icon: ShoppingBag,  label: "Pesanan" },
  { view: "pendapatan",      icon: BarChart2,    label: "Pendapatan" },
  { view: "member-needs",    icon: Users,        label: "Kebutuhan Anggota" },
  { view: "shield-store",    icon: Shield,       label: "Toko Shield" },
  { view: "shield-orders",   icon: ShoppingCart, label: "Pesanan Shield" },
  { view: "profil-koperasi", icon: User,         label: "Profil Koperasi" },
];
const NAV_PETANI = [
  { view: "beranda",       icon: Home,        label: "Beranda" },
  { view: "produk",        icon: Package,     label: "Produk Saya" },
  { view: "pesanan",       icon: ShoppingBag, label: "Pesanan Masuk" },
  { view: "pendapatan",    icon: BarChart2,   label: "Pendapatan" },
  { view: "shield-orders", icon: Shield,      label: "Asuransi Saya" },
];
const NAV_PEMBELI = [
  { view: "beranda",       icon: Home,        label: "Beranda" },
  { view: "pesanan",       icon: ShoppingBag, label: "Pesanan Saya" },
  { view: "shield-orders", icon: Shield,      label: "Asuransi Saya" },
];
const NAV_ADMIN = [
  { view: "beranda",  icon: Home,        label: "Dashboard" },
  { view: "users",    icon: Users,       label: "Manajemen User" },
  { view: "koperasi", icon: Store,       label: "Koperasi" },
  { view: "produk",   icon: Package,     label: "Produk" },
  { view: "pesanan",  icon: ShoppingBag, label: "Semua Pesanan" },
  { view: "shield",   icon: Shield,      label: "Shield Products" },
];
```

Di dalam DashboardPage():
```typescript
const navMap = { koperasi: NAV_KOPERASI, petani: NAV_PETANI, pembeli: NAV_PEMBELI, admin: NAV_ADMIN };
const navItems = navMap[role as keyof typeof navMap] ?? NAV_PEMBELI;
```

Ganti loop sidebar dengan dynamic navItems:
```tsx
{navItems.map((item) => (
  <button
    key={item.view}
    onClick={() => setActiveView(item.view)}
    className={[
      "flex items-center gap-3 px-4 py-2 rounded-xl transition-colors text-sm font-medium w-full text-left",
      activeView === item.view
        ? "bg-white/15 text-white"
        : "hover:bg-white/5 text-white/80 hover:text-white",
    ].join(" ")}
  >
    <item.icon size={18} className="shrink-0" />
    {item.label}
  </button>
))}
```

---

## 4.3 — Update content renderer di DashboardPage.tsx

Di bagian main content area, tambahkan kondisi role:

```tsx
{/* BERANDA per role */}
{activeView === "beranda" && role === "koperasi" && (
  /* konten beranda koperasi yang sudah ada — TIDAK DIUBAH */
  <BerandaKoperasiExisting stats={koperasiStats} />
)}
{activeView === "beranda" && role === "petani"  && <DashboardBerandaPetani />}
{activeView === "beranda" && role === "pembeli" && <DashboardBerandaPembeli />}
{activeView === "beranda" && role === "admin"   && <DashboardBerandaAdmin />}

{/* PESANAN per role */}
{activeView === "pesanan" && role === "pembeli" && <DashboardPesananPembeli />}
{activeView === "pesanan" && role !== "pembeli" && <DashboardBrandOrders />}

{/* Views lain tetap sama seperti sekarang */}
{activeView === "produk"          && <DashboardBrandStock />}
{activeView === "pendapatan"      && <DashboardBrandRevenue />}
{activeView === "shield-store"    && <DashboardShieldStore />}
{activeView === "shield-orders"   && <DashboardShieldOrders />}
{activeView === "member-needs"    && <DashboardMemberNeeds />}
{activeView === "profil-koperasi" && <DashboardKoperasiProfile />}
```

---

## 4.4 — Buat `src/components/dashboard/DashboardBerandaPetani.tsx`

```typescript
import { formatCurrency, useDashboardStats } from "../../lib/queries/orders";
import { useAuth } from "../../hooks/useAuth";
import { TrendingUp, ShoppingBag, Package, Clock } from "lucide-react";

export default function DashboardBerandaPetani() {
  const { profile } = useAuth();
  const { data: stats } = useDashboardStats(profile?.id ?? "");
  const cards = [
    { label: "Total Pendapatan", value: formatCurrency(stats?.totalRevenue ?? 0), icon: TrendingUp,  color: "bg-emerald-50 text-emerald-600" },
    { label: "Total Pesanan",    value: stats?.totalOrders ?? 0,                  icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
    { label: "Produk Aktif",     value: stats?.totalProducts ?? 0,                icon: Package,     color: "bg-orange-50 text-orange-600" },
    { label: "Pesanan Pending",  value: stats?.pendingOrders ?? 0,                icon: Clock,       color: "bg-yellow-50 text-yellow-600" },
  ];
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Selamat datang, {profile?.full_name}</h1>
        <p className="text-gray-500 text-sm mt-1">Pantau hasil panen dan pesananmu</p>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={"w-10 h-10 rounded-xl flex items-center justify-center mb-3 " + c.color}>
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
```

---

## 4.5 — Buat `src/components/dashboard/DashboardBerandaPembeli.tsx`

```typescript
import { formatCurrency, useBuyerStats } from "../../lib/queries/orders";
import { useAuth } from "../../hooks/useAuth";
import { ShoppingBag, CheckCircle2, Clock, Wallet } from "lucide-react";

export default function DashboardBerandaPembeli() {
  const { profile } = useAuth();
  const { data: stats } = useBuyerStats(profile?.id ?? "");
  const cards = [
    { label: "Total Pesanan",       value: stats?.totalOrders ?? 0,                icon: ShoppingBag,  color: "bg-blue-50 text-blue-600" },
    { label: "Pesanan Selesai",     value: stats?.completedOrders ?? 0,            icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
    { label: "Menunggu Konfirmasi", value: stats?.pendingOrders ?? 0,              icon: Clock,        color: "bg-yellow-50 text-yellow-600" },
    { label: "Total Belanja",       value: formatCurrency(stats?.totalSpent ?? 0), icon: Wallet,       color: "bg-purple-50 text-purple-600" },
  ];
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Halo, {profile?.full_name}</h1>
        <p className="text-gray-500 text-sm mt-1">Pantau semua pesanan dan aktivitasmu</p>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={"w-10 h-10 rounded-xl flex items-center justify-center mb-3 " + c.color}>
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
```

---

## 4.6 — Buat `src/components/dashboard/DashboardBerandaAdmin.tsx`

```typescript
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
        supabase.from("koperasi").select("id",  { count: "exact", head: true }),
        supabase.from("products").select("id",  { count: "exact", head: true }),
        supabase.from("orders").select("status, total_amount"),
      ]);
      const orders = oR.data ?? [];
      return {
        totalUsers:    uR.count ?? 0,
        totalKoperasi: kR.count ?? 0,
        totalProducts: pR.count ?? 0,
        totalOrders:   orders.length,
        totalRevenue:  orders
          .filter((o) => o.status === "delivered")
          .reduce((s, o) => s + (o.total_amount ?? 0), 0),
      };
    },
  });
}

export default function DashboardBerandaAdmin() {
  const { data: s } = useAdminStats();
  const cards = [
    { label: "Total User",     value: s?.totalUsers ?? 0,                  icon: Users,       color: "bg-blue-50 text-blue-600" },
    { label: "Total Koperasi", value: s?.totalKoperasi ?? 0,               icon: Store,       color: "bg-emerald-50 text-emerald-600" },
    { label: "Total Produk",   value: s?.totalProducts ?? 0,               icon: Package,     color: "bg-orange-50 text-orange-600" },
    { label: "Total Revenue",  value: formatCurrency(s?.totalRevenue ?? 0),icon: ShoppingBag, color: "bg-purple-50 text-purple-600" },
  ];
  return (
    <div className="p-6 space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1></div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={"w-10 h-10 rounded-xl flex items-center justify-center mb-3 " + c.color}>
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
```

---

## 4.7 — Buat `src/components/dashboard/DashboardPesananPembeli.tsx`

```typescript
import { useAuth } from "../../hooks/useAuth";
import { useMyPurchases, formatCurrency, formatDate, formatOrderId, ORDER_STATUS_LABEL } from "../../lib/queries/orders";
import { Package } from "lucide-react";

const STATUS_COLOR: Record<string, string> = {
  pending:    "bg-yellow-100 text-yellow-700",
  confirmed:  "bg-blue-100 text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  shipped:    "bg-purple-100 text-purple-700",
  delivered:  "bg-emerald-100 text-emerald-700",
  cancelled:  "bg-red-100 text-red-700",
};

export default function DashboardPesananPembeli() {
  const { profile } = useAuth();
  const { data: orders, isLoading } = useMyPurchases(profile?.id ?? "");
  if (isLoading) return <div className="p-6 text-gray-500">Memuat pesanan...</div>;
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Pesanan Saya</h2>
      {!orders?.length ? (
        <div className="text-center py-16 text-gray-400">
          <Package size={48} className="mx-auto mb-3 opacity-30" />
          <p>Belum ada pesanan</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-gray-900">{formatOrderId(order.id)}</span>
                <span className={"px-3 py-1 rounded-full text-xs font-medium " + (STATUS_COLOR[order.status] ?? "")}>
                  {ORDER_STATUS_LABEL[order.status]}
                </span>
              </div>
              <div className="text-sm text-gray-500">{formatDate(order.created_at)}</div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
                <span className="text-sm text-gray-600">Total</span>
                <span className="font-bold text-gray-900">{formatCurrency(order.total_amount)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Checklist Phase 4

- [ ] `DashboardPage.tsx`: tambah imports, role detection, navItems dynamic, content renderer
- [ ] `DashboardBerandaPetani.tsx` dibuat
- [ ] `DashboardBerandaPembeli.tsx` dibuat
- [ ] `DashboardBerandaAdmin.tsx` dibuat
- [ ] `DashboardPesananPembeli.tsx` dibuat
- [ ] `useBuyerStats` sudah ada di `orders.ts` (dari Phase 3)
- [ ] `npm run build` tidak error
- [ ] Test login tiap role: sidebar sesuai, beranda tampil stats real

**Setelah selesai -> lanjut ke PHASE-5-PRODUCTS-ORDERS.md**
