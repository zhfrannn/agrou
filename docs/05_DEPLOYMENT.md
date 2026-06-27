# Agrou — Deployment & Setup Guide

> Panduan lengkap untuk setup development lokal, konfigurasi Supabase, dan deploy ke Cloudflare Pages.

---

## 1. Prerequisites

- Node.js 18+
- npm / pnpm
- Akun Supabase (sudah ada — lihat credentials di `02_DATABASE.md`)
- Akun Cloudflare (untuk Pages + Worker)

---

## 2. Setup Development Lokal

### 2a. Clone & Install

```bash
cd agrou
npm install
```

### 2b. Environment Variables

Buat file `agrou/.env.local`:

```env
VITE_SUPABASE_URL=https://[your-project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
```

Ambil nilai ini dari: **Supabase Dashboard → Project Settings → API**.

> ⚠️ `.env.local` tidak boleh di-commit ke git. Pastikan ada di `.gitignore`.

### 2c. Jalankan Dev Server

```bash
cd agrou
npm run dev
```

Buka `http://localhost:3000`.

---

## 3. Setup Supabase (Fresh Project)

Jika perlu setup Supabase dari nol:

### 3a. Jalankan Schema

Di Supabase Dashboard → SQL Editor, jalankan seluruh isi `agrou/supabase/01_schema.sql`.

> Ini adalah one-time migration. Jangan dijalankan ulang pada project yang sudah ada karena akan error duplikasi.

### 3b. Jalankan Seed Data (Opsional)

```bash
cd agrou
node supabase/seed_full.cjs
```

Ini akan mengisi data awal: 5 koperasi, 6 produk, 3 promo.

> ⚠️ `seed_full.cjs` menggunakan REST API Supabase (bukan koneksi DB langsung) karena DNS pg direct tidak bisa diakses dari environment build.

### 3c. Konfigurasi Auth Redirect URLs

Di **Supabase Dashboard → Authentication → URL Configuration**:

- **Site URL**: `https://[your-cloudflare-pages-domain].pages.dev`
- **Redirect URLs**: tambahkan:
  - `http://localhost:3000/**`
  - `https://[your-cloudflare-pages-domain].pages.dev/**`

### 3d. Konfigurasi Storage Buckets

Bucket sudah dibuat via schema: `avatars`, `products`, `koperasi`, `promos`.

Pastikan RLS policy untuk storage sudah dijalankan — ada di bagian bawah `01_schema.sql`.

---

## 4. Deploy ke Cloudflare Pages

### 4a. Build Lokal (Verifikasi)

```bash
cd agrou
npm run build
```

Output ada di `agrou/dist/`. Pastikan tidak ada error TypeScript:

```bash
npm run lint
```

### 4b. Deploy via Cloudflare Dashboard

1. Buka **Cloudflare Dashboard → Pages → Create a project**
2. Connect ke repository Git atau upload `dist/` folder langsung
3. Build settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `agrou` (penting — app ada di subfolder)

### 4c. Environment Variables di Cloudflare Pages

Di **Cloudflare Pages → Project → Settings → Environment variables**, tambahkan:

| Variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://[project-id].supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `[anon-key]` |

Tambahkan untuk environment **Production** dan **Preview**.

### 4d. SPA Routing Fix

File `agrou/public/_redirects` sudah ada dengan isi:

```
/* /index.html 200
```

Ini memastikan semua route (seperti `/katalog`, `/dashboard`) tidak 404 saat di-refresh.

---

## 5. Deploy Cloudflare Worker (Gro AI)

### 5a. Install Wrangler

```bash
npm install -g wrangler
wrangler login
```

### 5b. Konfigurasi Worker

Di `agrou-worker/`, buat atau update `wrangler.toml`:

```toml
name = "agrou-worker"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[vars]
# Non-secret vars here

[[secrets]]
# OPENAI_API_KEY akan diset via CLI
```

### 5c. Set Secret API Key

```bash
cd agrou-worker
wrangler secret put OPENAI_API_KEY
```

Masukkan API key saat diminta.

### 5d. Deploy Worker

```bash
cd agrou-worker
wrangler deploy
```

Worker akan live di `https://agrou-worker.[your-subdomain].workers.dev`.

### 5e. Update Worker URL di App

Update URL endpoint Gro AI di `agrou/src/components/GroAIPage.tsx` dan `DiagnosisChatbot.tsx` dengan URL worker production.

---

## 6. Checklist Sebelum Submit Kompetisi

### Code Quality
- [ ] Perbaiki schema drift `shield_products` (lihat `04_KNOWN_ISSUES.md` #2)
- [ ] Perbaiki schema drift `order_items` (lihat `04_KNOWN_ISSUES.md` #3)
- [ ] Cek asset `backgorund-hero.jpg` — pastikan file ada dan nama match (isu #1)
- [ ] Update `package.json` name dari `react-example` ke `agrou` (isu #8)
- [ ] Tambah `manualChunks` di `vite.config.ts` untuk code splitting (isu #9)

### Cleanup
- [ ] Hapus `Agrou/src/` dan `Agrou/supabase/` scaffold lama di root (isu #7)
- [ ] Hapus `debug_seed.cjs` dan `run_seed.cjs` dari `agrou/supabase/` (isu #10)
- [ ] Amankan `seed_full.cjs` — pindahkan credential ke env variable (isu #4)

### Supabase
- [ ] Tambahkan domain production ke Auth redirect URLs (isu #12)
- [ ] Pastikan storage bucket RLS policies sudah aktif
- [ ] Verifikasi semua 11 tabel ada dan accessible

### Cloudflare
- [ ] Set `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` di Pages environment variables
- [ ] Deploy dan test worker Gro AI dengan LLM API key
- [ ] Test SPA routing — refresh di `/katalog`, `/dashboard`, dll tidak 404

### Testing Manual
- [ ] Register akun baru → profile terbuat otomatis via trigger
- [ ] Login → redirect ke `/dashboard`
- [ ] Upload avatar → tampil di profil
- [ ] Buat produk baru → muncul di katalog
- [ ] Realtime: buka dua browser, buat order → toast muncul di browser penjual
- [ ] Gro AI Mode A: diagnosis tanpa login
- [ ] Gro AI Mode B: login sebagai koperasi → akses modul ekspor

---

## 7. Perintah Berguna

```bash
# Dev server
cd agrou && npm run dev

# Build production
cd agrou && npm run build

# Type check
cd agrou && npm run lint

# Preview build lokal
cd agrou && npm run preview

# Push schema ke Supabase (via REST API)
cd agrou && node supabase/push.cjs

# Seed data
cd agrou && node supabase/seed_full.cjs
```

---

## 8. Demo Credentials

| Field | Value |
|---|---|
| Email | `demo@agrou.id` |
| Password | `Demo1234!` |
| Role | `koperasi` |

Akun ini punya akses penuh ke dashboard koperasi, Gro AI Mode B, dan semua fitur protected.
