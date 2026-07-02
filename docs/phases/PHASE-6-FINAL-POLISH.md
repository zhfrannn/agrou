# PHASE 6 — Final Polish & Production Ready

> Tujuan: Error handling, loading states, env check, build optimization, deployment config.
> Estimasi: 60-90 menit | Prasyarat: Phase 1-5 selesai

---

## 6.1 — Fix ENV Key Mismatch (CRITICAL — jalankan PERTAMA)

File: `agrou/agrou/.env` (buat jika belum ada)

```env
VITE_SUPABASE_URL=https://hodtuvbkrshvtjesacab.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_XBrg2E-1EwKSf2XZhPolxg_nlQxpRjv
```

File: `agrou/agrou/src/lib/supabase.ts` — pastikan membaca key yang benar:

```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
```

Jika masih ada referensi ke `VITE_SUPABASE_PUBLISHABLE_KEY` di mana pun, ganti ke `VITE_SUPABASE_ANON_KEY`.

---

## 6.2 — Global Error Boundary (sudah ada, verifikasi)

File: `agrou/agrou/src/components/layout/ErrorBoundary.tsx`

Pastikan sudah di-wrap di `App.tsx`. Jika belum, tambahkan:

```tsx
// Di App.tsx, wrap seluruh Routes dengan ErrorBoundary:
<ErrorBoundary>
  <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* ... semua routes */}
    </Routes>
  </Suspense>
</ErrorBoundary>
```

---

## 6.3 — Loading Skeleton Components (sudah ada, verifikasi)

File: `agrou/agrou/src/components/ui/LoadingSkeleton.tsx`

Pastikan `TableRowSkeleton` dan skeleton lainnya dipakai di semua dashboard view saat `isLoading === true`.

Pattern yang harus konsisten di semua dashboard components:

```tsx
if (isLoading) {
  return (
    <div className="p-6 space-y-4">
      {[...Array(5)].map((_, i) => (
        <TableRowSkeleton key={i} />
      ))}
    </div>
  );
}
```

---

## 6.4 — Toast Notifications Konsisten

Semua operasi CRUD harus punya toast feedback. Pattern standar:

```typescript
// Success
toast.success("Berhasil disimpan");

// Error
toast.error("Gagal menyimpan. Coba lagi.");

// Loading (untuk operasi async panjang)
const toastId = toast.loading("Menyimpan...");
// ... setelah selesai:
toast.dismiss(toastId);
toast.success("Tersimpan!");
```

Pastikan `<Toaster />` sudah ada di `main.tsx` atau `App.tsx`:

```tsx
import { Toaster } from "react-hot-toast";
// Di dalam JSX root:
<Toaster position="top-right" />
```

---

## 6.5 — Koperasi Onboarding Flow

Saat user dengan role `koperasi` login tapi belum punya data koperasi, tampilkan form setup.

Tambahkan di `DashboardPage.tsx`:

```tsx
import { useCreateKoperasi } from "../../lib/queries/koperasi";

// Di dalam DashboardPage, setelah koperasi data loaded:
const createKoperasi = useCreateKoperasi();
const [showSetup, setShowSetup] = useState(false);
const [setupForm, setSetupForm] = useState({ name: "", slug: "", location: "", province: "" });

// Jika role koperasi tapi belum ada koperasi:
if (role === "koperasi" && !koperasi && !isLoadingKoperasi) {
  return (
    <div className="flex h-screen bg-slate-50 items-center justify-center">
      <div className="bg-white rounded-3xl p-8 shadow-lg max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Koperasi</h2>
        <p className="text-gray-500 text-sm mb-6">Lengkapi data koperasi Anda untuk mulai berjualan</p>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Nama Koperasi</label>
            <input
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
              value={setupForm.name}
              onChange={(e) => {
                const name = e.target.value;
                const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
                setSetupForm((f) => ({ ...f, name, slug }));
              }}
              placeholder="Koperasi Tani Makmur"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Slug URL</label>
            <input
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
              value={setupForm.slug}
              onChange={(e) => setSetupForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="koperasi-tani-makmur"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Lokasi</label>
            <input
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
              value={setupForm.location}
              onChange={(e) => setSetupForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="Surabaya, Jawa Timur"
            />
          </div>
          <button
            onClick={async () => {
              if (!profile || !setupForm.name || !setupForm.slug) return;
              try {
                await createKoperasi.mutateAsync({
                  owner_id: profile.id,
                  name: setupForm.name,
                  slug: setupForm.slug,
                  location: setupForm.location,
                });
                toast.success("Koperasi berhasil dibuat!");
              } catch (e: any) {
                toast.error(e.message ?? "Gagal membuat koperasi");
              }
            }}
            disabled={createKoperasi.isPending}
            className="w-full bg-[#1B4332] text-white rounded-xl py-3 font-semibold hover:bg-[#1B4332]/90 transition-colors disabled:opacity-50"
          >
            {createKoperasi.isPending ? "Membuat..." : "Buat Koperasi"}
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 6.6 — Update `agrou/agrou/src/lib/database.types.ts` Final

Tambahkan field baru yang ada di schema Phase 1 ke `KoperasiRow`:

```typescript
export interface KoperasiRow {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  location: string | null;
  province: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  established_year: number | null;
  komoditas: string[];
  rating: number;
  member_count: number;
  total_products: number;
  total_orders: number;
  total_revenue: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}
```

Tambahkan interface baru di bawah `KomunitasPost`:

```typescript
export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  qty: number;
  created_at: string;
}

export interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  order_id: string | null;
  rating: number;
  comment: string | null;
  images: string[];
  created_at: string;
  updated_at: string;
}

export type NotificationType = "order" | "shield" | "system" | "promo" | "member";

export interface AppNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}
```

Tambahkan ke `Database` type di dalam `Tables`:

```typescript
cart_items: {
  Row: CartItem;
  Insert: Partial<CartItem> & Pick<CartItem, "user_id" | "product_id">;
  Update: Partial<CartItem>;
};
wishlists: {
  Row: Wishlist;
  Insert: Partial<Wishlist> & Pick<Wishlist, "user_id" | "product_id">;
  Update: Partial<Wishlist>;
};
reviews: {
  Row: Review;
  Insert: Partial<Review> & Pick<Review, "user_id" | "product_id" | "rating">;
  Update: Partial<Review>;
};
notifications: {
  Row: AppNotification;
  Insert: Partial<AppNotification> & Pick<AppNotification, "user_id" | "type" | "title" | "message">;
  Update: Partial<AppNotification>;
};
```

---

## 6.7 — Build & Verify

```bash
cd agrou/agrou
npm run build
```

Build harus selesai tanpa TypeScript errors. Jika ada error:

| Error | Fix |
|-------|-----|
| `Property X does not exist on type KoperasiRow` | Tambahkan field ke interface di `database.types.ts` |
| `Cannot find module` | Cek path import, pastikan file sudah dibuat |
| `Type string is not assignable to product_category` | Cast dengan `as ProductCategory` atau `as any` |
| `useBuyerStats is not exported` | Pastikan export ditambahkan di `orders.ts` |

---

## 6.8 — Vercel Deployment Config

File `agrou/vercel.json` sudah ada. Verifikasi isinya:

```json
{
  "buildCommand": "cd agrou && npm install && npm run build",
  "outputDirectory": "agrou/dist",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Environment variables yang harus di-set di Vercel dashboard:
- `VITE_SUPABASE_URL` = `https://hodtuvbkrshvtjesacab.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `sb_publishable_XBrg2E-1EwKSf2XZhPolxg_nlQxpRjv`

---

## 6.9 — Supabase RLS Final Check

Jalankan di Supabase SQL Editor untuk verifikasi semua RLS aktif:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

Semua kolom `rowsecurity` harus `true`. Jika ada yang `false`, jalankan:

```sql
ALTER TABLE public.nama_tabel ENABLE ROW LEVEL SECURITY;
```

---

## 6.10 — Final Integration Test Checklist

### Auth Flow
- [ ] Register sebagai `pembeli` → profile terbuat di Supabase
- [ ] Register sebagai `koperasi` → profile terbuat, redirect ke dashboard
- [ ] Register sebagai `petani` → profile terbuat, redirect ke dashboard
- [ ] Login → redirect ke `/dashboard`
- [ ] Logout → redirect ke `/`
- [ ] Refresh halaman saat login → session tetap ada

### Dashboard Koperasi
- [ ] Setup koperasi baru (onboarding form)
- [ ] Edit profil koperasi → data tersimpan di Supabase
- [ ] Tambah produk → muncul di tabel stok
- [ ] Lihat pesanan masuk → data real dari orders tabel
- [ ] Update status pesanan → status berubah realtime
- [ ] Lihat pendapatan → angka sesuai delivered orders

### Dashboard Petani
- [ ] Login sebagai petani → sidebar NAV_PETANI tampil
- [ ] Beranda tampil stats real (0 jika belum ada data)
- [ ] Tambah produk → muncul di katalog publik

### Dashboard Pembeli
- [ ] Login sebagai pembeli → sidebar NAV_PEMBELI tampil
- [ ] Beranda tampil stats pembelian
- [ ] Tab pesanan tampil list orders

### Admin
- [ ] Login sebagai admin → sidebar NAV_ADMIN tampil
- [ ] Beranda tampil total users, koperasi, produk, revenue

### Public Pages
- [ ] Katalog produk load dari Supabase
- [ ] Koperasi list load dari Supabase
- [ ] Halaman koperasi profile (slug) load data real

---

## Summary — Semua File yang Dibuat/Diubah

### Files BARU yang dibuat:
```
agrou/agrou/.env
agrou/agrou/src/lib/queries/profiles.ts
agrou/agrou/src/lib/queries/notifications.ts
agrou/agrou/src/lib/queries/member-needs.ts
agrou/agrou/src/lib/queries/cart.ts
agrou/agrou/src/lib/queries/reviews.ts
agrou/agrou/src/lib/queries/checkout.ts
agrou/agrou/src/components/dashboard/DashboardBerandaPetani.tsx
agrou/agrou/src/components/dashboard/DashboardBerandaPembeli.tsx
agrou/agrou/src/components/dashboard/DashboardBerandaAdmin.tsx
agrou/agrou/src/components/dashboard/DashboardPesananPembeli.tsx
```

### Files yang DIUPDATE:
```
agrou/agrou/src/lib/supabase.ts              (env key fix)
agrou/agrou/src/lib/database.types.ts        (field baru + interface baru)
agrou/agrou/src/lib/queries/koperasi.ts      (useKoperasiStats, useCreateKoperasi)
agrou/agrou/src/lib/queries/products.ts      (useCreateProduct, useUpdateProduct, dll)
agrou/agrou/src/lib/queries/orders.ts        (useMyPurchases, useCreateOrder, useBuyerStats)
agrou/agrou/src/hooks/useAuth.tsx            (refreshProfile, updateProfile, upsert)
agrou/agrou/src/components/dashboard/DashboardPage.tsx  (role-based nav + content)
agrou/agrou/src/components/dashboard/DashboardKoperasiProfile.tsx  (field baru)
agrou/agrou/src/components/dashboard/DashboardBrandStock.tsx       (real data)
agrou/agrou/src/components/dashboard/DashboardBrandOrders.tsx      (real data)
agrou/agrou/src/components/dashboard/DashboardBrandRevenue.tsx     (real data)
```

### SQL yang dijalankan di Supabase:
```
docs/phases/PHASE-1-DATABASE.md  (schema + RLS + storage + seed)
```

---

## Checklist Phase 6 (Final)

- [ ] `.env` dibuat dengan `VITE_SUPABASE_ANON_KEY`
- [ ] `database.types.ts` diupdate semua field baru
- [ ] Koperasi onboarding form ditambahkan
- [ ] `npm run build` sukses tanpa error
- [ ] Semua 10 integration tests di 6.10 pass
- [ ] Vercel env vars di-set
- [ ] Deploy ke Vercel / Cloudflare Pages

**SEMUA PHASE SELESAI — Production Ready!**
