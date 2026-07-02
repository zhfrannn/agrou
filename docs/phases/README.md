# AGROU — Implementation Phases Index

> Production-ready implementation plan untuk Dashboard Koperasi + Integrasi Supabase penuh.
> Total estimasi: 5-7 jam kerja | Eksekusi step-by-step, jangan skip phase.

---

## Urutan Eksekusi

| Phase | File | Scope | Estimasi |
|-------|------|-------|----------|
| 1 | [PHASE-1-DATABASE.md](./PHASE-1-DATABASE.md) | Schema SQL + RLS + Storage Buckets + Seed | 15-20 mnt |
| 2 | [PHASE-2-AUTH-ENV.md](./PHASE-2-AUTH-ENV.md) | Fix .env, useAuth update, query files baru | 20-30 mnt |
| 3 | [PHASE-3-KOPERASI-DASHBOARD.md](./PHASE-3-KOPERASI-DASHBOARD.md) | Koperasi queries, products, orders, member-needs | 60-90 mnt |
| 4 | [PHASE-4-ROLE-DASHBOARDS.md](./PHASE-4-ROLE-DASHBOARDS.md) | Dashboard petani, pembeli, admin | 90-120 mnt |
| 5 | [PHASE-5-PRODUCTS-ORDERS.md](./PHASE-5-PRODUCTS-ORDERS.md) | CRUD produk, order flow, cart, reviews | 90-120 mnt |
| 6 | [PHASE-6-FINAL-POLISH.md](./PHASE-6-FINAL-POLISH.md) | Error handling, build check, deploy config | 60-90 mnt |

---

## Apa yang Diubah per Phase

### Phase 1 — Database Only (SQL di Supabase)
- 13 tabel: profiles, koperasi, products, orders, order_items, shield_products, shield_orders, member_needs, cart_items, wishlists, reviews, notifications, komunitas_posts
- RLS policies semua tabel
- 3 storage buckets: avatars, products, koperasi
- Trigger auto-create profile saat register
- Helper function `get_koperasi_stats()`
- Seed data: 6 shield products

### Phase 2 — Auth & ENV Fix
**Files baru:**
- `agrou/agrou/.env`
- `agrou/agrou/src/lib/queries/profiles.ts`
- `agrou/agrou/src/lib/queries/notifications.ts`

**Files diupdate:**
- `agrou/agrou/src/lib/supabase.ts` — key fix + health log
- `agrou/agrou/src/hooks/useAuth.tsx` — refreshProfile, updateProfile, upsert

### Phase 3 — Koperasi Dashboard Integration
**Files baru:**
- `agrou/agrou/src/lib/queries/member-needs.ts`

**Files diupdate:**
- `agrou/agrou/src/lib/queries/koperasi.ts` — useKoperasiStats, useCreateKoperasi, useUploadKoperasiImage
- `agrou/agrou/src/lib/queries/products.ts` — useCreateProduct, useUpdateProduct, useDeleteProduct, useUploadProductImage
- `agrou/agrou/src/lib/queries/orders.ts` — useMyPurchases, useCreateOrder, useBuyerStats
- `agrou/agrou/src/lib/database.types.ts` — KoperasiRow field baru, CartItem, Wishlist, Review, AppNotification
- `agrou/agrou/src/components/dashboard/DashboardKoperasiProfile.tsx` — phone, email, website, komoditas

### Phase 4 — Role-Based Dashboards
**Files baru:**
- `agrou/agrou/src/components/dashboard/DashboardBerandaPetani.tsx`
- `agrou/agrou/src/components/dashboard/DashboardBerandaPembeli.tsx`
- `agrou/agrou/src/components/dashboard/DashboardBerandaAdmin.tsx`
- `agrou/agrou/src/components/dashboard/DashboardPesananPembeli.tsx`

**Files diupdate:**
- `agrou/agrou/src/components/dashboard/DashboardPage.tsx` — role-based nav, dynamic content renderer, koperasi onboarding

### Phase 5 — Products & Orders Integration
**Files baru:**
- `agrou/agrou/src/lib/queries/cart.ts`
- `agrou/agrou/src/lib/queries/reviews.ts`
- `agrou/agrou/src/lib/queries/checkout.ts`

**Files diupdate:**
- `agrou/agrou/src/components/dashboard/DashboardBrandStock.tsx` — real data
- `agrou/agrou/src/components/dashboard/DashboardBrandOrders.tsx` — real data + status update
- `agrou/agrou/src/components/dashboard/DashboardBrandRevenue.tsx` — real data

### Phase 6 — Final Polish
- Koperasi onboarding flow (jika belum ada koperasi)
- Error boundary verification
- Loading skeletons konsisten
- Toast notifications pattern
- `npm run build` verification
- Vercel deployment config
- Final integration test checklist (10 test cases)

---

## Supabase Project Info
- **URL:** https://hodtuvbkrshvtjesacab.supabase.co
- **Dashboard:** https://supabase.com/dashboard/project/hodtuvbkrshvtjesacab
- **SQL Editor:** https://supabase.com/dashboard/project/hodtuvbkrshvtjesacab/sql/new

---

## Prinsip Utama
1. **Visual tidak berubah** — layout, warna, font, semua komponen yang sudah ada tetap persis sama
2. **Data real** — semua angka dan list dari Supabase, bukan hardcode/mock
3. **Role-based** — koperasi, petani, pembeli, admin masing-masing punya dashboard dan nav berbeda
4. **Type-safe** — semua query pakai `Database` type dari `database.types.ts`
5. **Realtime** — orders dan notifications pakai Supabase Realtime subscription
