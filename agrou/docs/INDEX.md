# Agrou — Backend Integration Master Plan
## Supabase + Cloudflare, Full Stack dari Nol

> **Dibuat:** 2026-06-26
> **Status app saat ini:** Full dummy — semua data hardcoded, zero backend
> **Stack frontend aktual:** Vite + React 19 + TypeScript + TailwindCSS 4 + Framer Motion
> **Target stack:** Supabase (Auth + PostgreSQL + Storage + Realtime) + Cloudflare (Pages + Workers)

---

## Ringkasan Temuan Analisis

App Agrou adalah **Vite SPA murni** di folder `agrou/`. Folder `src/` di root adalah skeleton Next.js yang tidak terhubung ke frontend aktual dan tidak dipakai.

Ada **2 critical security issue** yang harus difix sebelum apapun:
1. API key ter-log ke browser console (`App.tsx` baris 119)
2. Gemini AI dipanggil langsung dari frontend — key exposed di JavaScript bundle

Dari 32 komponen yang ada, **semua data adalah hardcoded dummy**. Tidak ada satu pun koneksi ke backend.

---

## Peta Fase

```
Phase 0 → Foundation & Security Fixes        [2-3 jam]  ← MULAI DARI SINI
Phase 1 → Authentication System              [3-4 jam]
Phase 2 → Database Schema & RLS              [3-4 jam]
Phase 3 → Data Integration (dummy → real)   [6-8 jam]
Phase 4 → Cloudflare + AI Security          [3-4 jam]
Phase 5 → Storage & Media Upload            [2-3 jam]
Phase 6 → Realtime Features                 [2-3 jam]
Phase 7 → URL Routing                       [2-3 jam]
─────────────────────────────────────────────────────
Total estimasi:                             ~24-34 jam
```

---

## Dependency Antar Phase

```
Phase 0 (Foundation)
├── Phase 1 (Auth)         — butuh Supabase client dari Phase 0
│   └── Phase 7 (Routing)  — butuh auth guard dari Phase 1
├── Phase 2 (Database)     — butuh Supabase project dari Phase 0
│   ├── Phase 3 (Data)     — butuh schema dari Phase 2 + auth dari Phase 1
│   └── Phase 6 (Realtime) — butuh tabel + data dari Phase 2 & 3
├── Phase 4 (Cloudflare)   — bisa paralel dengan Phase 1 & 2
└── Phase 5 (Storage)      — butuh auth dari Phase 1 + bucket setup
```

**Urutan pengerjaan yang direkomendasikan:**
1. Phase 0 (wajib selesai dulu)
2. Phase 1 + Phase 2 (bisa paralel, independen satu sama lain)
3. Phase 4 (bisa dikerjakan kapan saja setelah Phase 0)
4. Phase 3 (setelah Phase 1 + 2 selesai)
5. Phase 5 + Phase 6 (setelah Phase 3 selesai)
6. Phase 7 (bisa dikerjakan kapan saja, paling akhir jika mau)

---

## Index Dokumen

| File | Isi |
|---|---|
| `docs/00-current-state.md` | Analisis lengkap kondisi codebase sekarang, semua 32 komponen, critical issues |
| `docs/01-phase0-foundation.md` | Security fixes, setup Supabase project, install deps, buat Supabase client |
| `docs/02-phase1-auth.md` | AuthContext, useAuth hook, login/register pages, auth guard, profile trigger |
| `docs/03-phase2-database.md` | Full SQL schema (11 tabel), indexes, triggers, RLS policies, seed data |
| `docs/04-phase3-data-integration.md` | Pattern React Query, query files, update semua 32 komponen ke data real |
| `docs/05-phase4-cloudflare-ai.md` | Cloudflare Worker setup, AI proxy, pindahkan Gemini calls, deploy ke CF Pages |
| `docs/06-phase5-storage.md` | Supabase Storage buckets, upload helpers, AvatarUpload, ProductImageUpload |
| `docs/07-phase6-realtime.md` | Realtime subscriptions, notifikasi order, badge di header |
| `docs/08-phase7-routing.md` | React Router v6, route map, ProtectedRoute, URL-based navigation |

---

## Database Schema Overview

```
auth.users (Supabase managed)
    │
    └──► profiles (id, full_name, avatar_url, role, is_verified)
              │
              ├──► koperasi (id, owner_id, name, slug, location, rating)
              │        │
              │        └──► member_needs
              │
              ├──► products (id, seller_id, koperasi_id, name, price, stock, category, images)
              │        │
              │        └──► order_items (product_id, quantity, price)
              │                  │
              │                  └──► orders (buyer_id, seller_id, status, total_amount)
              │
              ├──► shield_orders (user_id, shield_product_id, status, lahan_ha)
              │        │
              │        └──► shield_products (name, commodity, premium, coverage)
              │
              ├──► posts (author_id, title, content, tags, likes)
              │        │
              │        └──► comments (post_id, author_id, content)
              │
              └──► promos (title, image_url, is_active)
```

---

## Komponen per Module

### Agrou Brand (marketplace produk pertanian)
- `BrandPage.tsx` — list KUD/brand
- `BrandModule.tsx` — produk dalam brand
- `KatalogPage.tsx` — katalog semua produk dengan filter
- `BestSellers.tsx` — produk terlaris
- `DashboardBrandOrders.tsx` — manajemen order
- `DashboardBrandRevenue.tsx` — laporan revenue
- `DashboardBrandStock.tsx` — manajemen stok produk

### Agrou Shield (asuransi pertanian)
- `ShieldPage.tsx` — halaman utama asuransi
- `ShieldModule.tsx` — detail modul
- `DiagnosisChatbot.tsx` — chatbot diagnosis tanaman (Gemini)
- `DashboardShieldOrders.tsx` — daftar asuransi aktif
- `DashboardShieldStore.tsx` — produk asuransi tersedia

### Agrou Koperasi
- `KoperasiPage.tsx` — list semua koperasi
- `KoperasiProfilePage.tsx` — profil detail koperasi
- `KoperasiTerpercaya.tsx` — koperasi featured di landing
- `DashboardKoperasiProfile.tsx` — kelola profil koperasi
- `DashboardMemberNeeds.tsx` — kebutuhan anggota

### Gro AI
- `GroAIPage.tsx` — chat AI pertanian (Gemini — wajib pindah ke CF Worker)

### Komunitas
- `KomunitasPage.tsx` — forum diskusi petani

### Landing & Static
- `Hero.tsx`, `MarqueeStrip.tsx`, `ValuePropStrip.tsx`, `ModuleIntro.tsx`
- `EkosistemBridge.tsx`, `HomeBottom.tsx`
- `PromoBanner.tsx` — perlu data dari `promos` table
- `Header.tsx` — perlu auth state
- `Footer.tsx`, `AboutPage.tsx` — tetap statis
- `DesignSystem.tsx` — dokumentasi internal, tidak perlu backend

---

## Tech Stack Final

```
Frontend (agrou/)
├── Vite + React 19 + TypeScript
├── TailwindCSS 4
├── Framer Motion
├── @supabase/supabase-js    ← koneksi ke Supabase
├── @tanstack/react-query    ← data fetching + caching
├── react-hot-toast          ← notifikasi
├── react-router-dom v6      ← routing (Phase 7)
└── lucide-react             ← icons

Backend
├── Supabase PostgreSQL      ← database utama (11 tabel)
├── Supabase Auth            ← auth + session management
├── Supabase Storage         ← upload gambar (avatars, products, koperasi)
└── Supabase Realtime        ← live updates orders + komunitas

Cloudflare
├── Cloudflare Pages         ← hosting frontend SPA
└── Cloudflare Workers       ← AI proxy (Gemini), rate limiting

AI
└── Gemini 1.5 Flash         ← GroAI chat + DiagnosisChatbot
                               (akses HANYA via Cloudflare Worker)
```

---

## Environment Variables

### `agrou/.env.local` (dev, tidak di-commit)
```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_WORKER_URL=https://agrou-ai-worker.xxx.workers.dev
```

### `agrou-worker/` (Cloudflare Worker secrets, via `wrangler secret put`)
```
GEMINI_API_KEY=AIza...   ← RAHASIA, tidak pernah ke frontend
```

### Cloudflare Pages (production env vars)
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_WORKER_URL=https://agrou-ai-worker.xxx.workers.dev
```

> **Anon key Supabase boleh public** — itu memang design-nya untuk client-side.
> Security dihandle oleh **Row Level Security (RLS)** di database level.
> **Gemini API key TIDAK BOLEH** ada di frontend dalam bentuk apapun.

---

## Master Checklist

### Phase 0 — Foundation
- [ ] Hapus `console.log(import.meta.env.VITE_ANTHROPIC_API_KEY)` dari `App.tsx`
- [ ] Hapus `LadangAIPage.tsx` (dead file)
- [ ] Buat Supabase project
- [ ] Buat `agrou/.env.local`
- [ ] Install `@supabase/supabase-js`, `@tanstack/react-query`, `react-hot-toast` ke `agrou/`
- [ ] Buat `agrou/src/lib/supabase.ts`
- [ ] Setup `QueryClientProvider` di `main.tsx`

### Phase 1 — Auth
- [ ] Buat `agrou/src/hooks/useAuth.tsx`
- [ ] Wrap app dengan `AuthProvider`
- [ ] Buat `LoginPage.tsx` dan `RegisterPage.tsx`
- [ ] Auth guard untuk halaman dashboard

### Phase 2 — Database
- [ ] Jalankan SQL schema (11 tabel + enums)
- [ ] Jalankan SQL indexes
- [ ] Jalankan SQL triggers
- [ ] Aktifkan + konfigurasi RLS semua tabel
- [ ] Generate TypeScript types
- [ ] Jalankan seed data

### Phase 3 — Data Integration
- [ ] Buat `agrou/src/lib/queries/` dengan 6 query files
- [ ] Update semua 23 komponen yang pakai dummy data

### Phase 4 — Cloudflare + AI
- [ ] Buat `agrou-worker/` Cloudflare Worker
- [ ] Set `GEMINI_API_KEY` sebagai Worker secret
- [ ] Update `GroAIPage.tsx` pakai Worker
- [ ] Update `DiagnosisChatbot.tsx` pakai Worker
- [ ] Deploy ke Cloudflare Pages

### Phase 5 — Storage
- [ ] Buat 4 Storage buckets
- [ ] Jalankan SQL storage policies
- [ ] Buat `agrou/src/lib/storage.ts`
- [ ] Buat `AvatarUpload` dan `ProductImageUpload` components

### Phase 6 — Realtime
- [ ] Enable realtime untuk `orders`, `posts`, `comments`
- [ ] Buat `useRealtimeOrders` + `useRealtimePosts` hooks
- [ ] Badge notifikasi di Header

### Phase 7 — Routing
- [ ] Install `react-router-dom`
- [ ] Refactor `App.tsx` ke `<Routes>`
- [ ] Update semua navigasi ke `<Link>` dan `useNavigate`
- [ ] Buat `agrou/public/_redirects` untuk Cloudflare Pages
