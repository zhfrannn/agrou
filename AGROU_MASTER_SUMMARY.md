# AGROU MASTER SUMMARY
**Platform:** Agrou | **Tagline:** *Grow Local. Reach Global.*
**Kompetisi:** 12th UTU Awards 2026 | **Kategori:** Online Store Design | **Tema:** Agro & Marine Industry
**Terakhir diperbarui:** 2 Juli 2026

---

## DAFTAR ISI
1. [Identitas Platform](#1-identitas-platform)
2. [3 Krisis yang Dipecahkan](#2-3-krisis-yang-dipecahkan)
3. [4 Modul Platform](#3-4-modul-platform)
4. [Filosofi dan Relevansi](#4-filosofi-dan-relevansi)
5. [Tech Stack](#5-tech-stack)
6. [Struktur Repo](#6-struktur-repo)
7. [Routing](#7-routing)
8. [Komponen Lengkap](#8-komponen-lengkap)
9. [Custom Hooks](#9-custom-hooks)
10. [Lib dan Queries](#10-lib-dan-queries)
11. [Database Schema](#11-database-schema)
12. [Cloudflare Worker](#12-cloudflare-worker)
13. [Gro AI System](#13-gro-ai-system)
14. [Auth System](#14-auth-system)
15. [Design System](#15-design-system)
16. [Environment Variables](#16-environment-variables)
17. [Deployment](#17-deployment)
18. [Known Issues dan Technical Debt](#18-known-issues-dan-technical-debt)
19. [What Works vs What Needs Work](#19-whats-working-vs-whats-needs-work)
20. [Competitive Analysis](#20-competitive-analysis)
21. [Commands Berguna](#21-commands-berguna)

---

## 1. IDENTITAS PLATFORM

| Atribut | Detail |
|---|---|
| **Nama** | Agrou |
| **Tagline** | *Grow Local. Reach Global.* |
| **Kompetisi** | 12th UTU Awards 2026 |
| **Kategori** | Online Store Design |
| **Tema** | Agro & Marine Industry |
| **Jenis** | Web-based Marketplace Ekosistem + Export Hub Terintegrasi |
| **Target** | Nasional & Global (Indonesia sebagai basis ekspansi ekspor) |

---

## 2. 3 KRISIS YANG DIPECAHKAN

| # | Krisis | Data |
|---|---|---|
| 1 | **Proteksi Lahan Buruk** | 20-30% kerusakan hortikultura (FAO & IPB 2024), 62.8% kehilangan sayuran (Bappenas 2024) |
| 2 | **Akses Pasar Tidak Adil** | Koperasi desa tidak punya brand, produk dijual murah ke tengkulak |
| 3 | **Pintu Ekspor Tertutup** | Koperasi tidak bisa menembus pasar global karena hambatan regulasi & compliance |

---

## 3. 4 MODUL PLATFORM

| Modul | Ikon | Fungsi |
|---|---|---|
| **FARM** | Tanaman | Marketplace proteksi lahan: produk pestisida, pupuk, benih + chatbot diagnosis AI |
| **MARKET** | Toko | Marketplace produk koperasi: katalog, orders, realtime |
| **GRO AI** | Robot | AI assistant berbasis Claude Anthropic: Mode A (petani/nelayan) + Mode B (koperasi/ekspor) |
| **CONNECT** | Globe | Export Hub: direktori importir, profil importir, matching koperasi-importir |

---

## 4. FILOSOFI DAN RELEVANSI

> *"Agrou mengangkat koperasi sebagai unit digital dan unit ekspor — terinspirasi BRILink dan Agen Pos"*

### Relevansi Strategis

| Konteks | Koneksi ke Agrou |
|---|---|
| **Koperasi Merah Putih 2025** | Infrastruktur digital 70.000-80.000 koperasi desa |
| **SDGs 12.3 & 12.5** | Farm kurangi food loss, Market monetisasi limbah sirkular |
| **Hilirisasi & Ekspor KKP/Kementan** | Gro AI + Connect buka ekspor langsung |

---

## 5. TECH STACK

### Frontend (agrou/)

| Package | Versi |
|---|---|
| React | 19.0.1 |
| Vite | 6.2.3 |
| TypeScript | 5.8.2 |
| React Router DOM | 6.30.0 |
| TailwindCSS | 4.1.14 (via @tailwindcss/vite) |
| TanStack Query (React Query) | v5.101.1 |
| Motion (Framer Motion) | 12.23.24 |
| Lucide React | 0.546.0 |
| React Hot Toast | 2.6.0 |
| Zod | 3.25.76 |
| @supabase/supabase-js | 2.108.2 |

### Backend / Infra

| Komponen | Detail |
|---|---|
| Supabase (PostgreSQL hosted) | Auth, Database, Storage, Realtime |
| Cloudflare Worker (agrou-worker) | AI proxy ke Anthropic Claude Sonnet 4.6 |
| Wrangler | 3.40.0 — deploy tool untuk Worker |

### Deploy

| Platform | Fungsi |
|---|---|
| Cloudflare Pages | Frontend SPA |
| Cloudflare Workers | AI proxy backend |
| Vercel (vercel.json) | Alternatif deploy frontend |

---

## 6. STRUKTUR REPO

```
Agrou/
├── docs/                    <- 6 file dokumentasi teknis
├── agrou/                   <- APP UTAMA (Vite + React SPA)
│   ├── src/
│   │   ├── App.tsx          <- Router utama + ProtectedRoute + AuthRoute + lazy loading
│   │   ├── main.tsx         <- Entry point: AuthProvider + QueryClientProvider + Toaster
│   │   ├── index.css        <- Global styles + TailwindCSS
│   │   ├── types.ts         <- Shared types (Product, KUDBrand)
│   │   ├── components/
│   │   │   ├── home/        <- 9 komponen homepage
│   │   │   ├── layout/      <- Header, Footer, ScrollToTop, ErrorBoundary
│   │   │   ├── pages/       <- 14 halaman utama
│   │   │   ├── dashboard/   <- 8 komponen dashboard koperasi
│   │   │   ├── gro-ai/      <- GroAIPage, ModeA, ModeB + shared/
│   │   │   └── ui/          <- 5 komponen UI reusable
│   │   ├── hooks/           <- 5 custom hooks
│   │   ├── lib/
│   │   │   ├── supabase.ts  <- Supabase client
│   │   │   ├── database.types.ts <- Auto-typed DB schema
│   │   │   ├── groai-client.ts   <- fetch wrapper ke Worker
│   │   │   ├── groai-prompts.ts  <- System prompts pure functions
│   │   │   └── queries/     <- 6 TanStack Query hooks per domain
│   │   ├── constants/       <- 4 file konstanta Gro AI
│   │   └── types/           <- Type definitions tambahan
│   ├── supabase/
│   │   ├── 01_schema.sql    <- Full DB schema (source of truth)
│   │   ├── 02_seed.sql      <- Seed data SQL
│   │   ├── push.cjs         <- Push schema via REST API
│   │   └── seed_full.cjs    <- Seed data via REST API
│   ├── public/_redirects    <- Cloudflare Pages SPA routing fix
│   ├── assets/              <- Static assets (backgorund-hero.jpg, gro-ai-bg.jpg)
│   └── vite.config.ts       <- Vite config dengan alias @ dan @assets
├── agrou-worker/            <- CLOUDFLARE WORKER (AI Proxy)
│   ├── src/index.ts         <- Worker handler: /api/chat + /api/diagnose
│   ├── wrangler.toml        <- Worker config + ALLOWED_ORIGINS
│   └── package.json         <- wrangler + @cloudflare/workers-types
├── package.json             <- Root scripts (dev/build/preview)
└── vercel.json              <- Vercel deploy config (alternatif)
```

---

## 7. ROUTING

Semua route didefinisikan di **App.tsx**. Homepage di-render langsung (static import), semua halaman lain di-lazy load.

| Path | Komponen | Keterangan |
|---|---|---|
| `/` | HomePage | Static import, render langsung |
| `/tani` | TaniPage | Lazy |
| `/brand` | BrandPage | Lazy |
| `/katalog` | KatalogPage | Lazy |
| `/koperasi` | KoperasiPage | Lazy |
| `/koperasi/:id` | KoperasiProfilePage | Lazy |
| `/gro-ai` | GroAIPage | Lazy |
| `/connect` | ConnectPage | Lazy |
| `/connect/importir/:id` | ImportirProfilePage | Lazy |
| `/tentang` | AboutPage | Lazy |
| `/dashboard` | DashboardPage | Lazy + **ProtectedRoute** (harus login) |
| `/masuk` | LoginPage | Lazy + **AuthRoute** (redirect ke / jika sudah login) |
| `/daftar` | RegisterPage | Lazy + **AuthRoute** (redirect ke / jika sudah login) |
| `*` | — | Redirect ke `/` |

---

## 8. KOMPONEN LENGKAP

### HOME (9 komponen)

| File | Deskripsi |
|---|---|
| Hero.tsx | Hero section + background image + CTA |
| MarqueeStrip.tsx | Animasi marquee komoditas/tagline |
| ValuePropStrip.tsx | 3 value propositions |
| ModuleIntro.tsx | Intro 4 modul platform |
| PromoBanner.tsx | Banner dari DB, fallback 3 static banners |
| BestSellers.tsx | Produk terlaris dari DB, fallback 6 static |
| EkosistemBridge.tsx | Visualisasi Data Bridge / siklus ekosistem |
| KoperasiTerpercaya.tsx | Daftar koperasi dari DB, fallback 5 static |
| HomeBottom.tsx | CTA section bawah |

### LAYOUT (4 komponen)

| File | Deskripsi |
|---|---|
| Header.tsx | Navbar: logo, nav links, auth state, unread badge |
| Footer.tsx | Footer global (semua halaman kecuali dashboard/auth) |
| ScrollToTop.tsx | Auto-scroll ke top saat navigasi |
| ErrorBoundary.tsx | Error boundary React |

### PAGES (14 file)

| File | Deskripsi |
|---|---|
| TaniPage.tsx | Halaman Agrou Farm / produk pertanian |
| BrandPage.tsx | Halaman brand/toko |
| BrandModule.tsx | Sub-komponen brand |
| KatalogPage.tsx | Marketplace katalog produk, filter + search |
| KoperasiPage.tsx | Direktori koperasi |
| KoperasiProfilePage.tsx | Profil detail koperasi |
| ConnectPage.tsx | Export Hub / direktori importir |
| ImportirProfilePage.tsx | Profil detail importir |
| AboutPage.tsx | Halaman tentang platform |
| DiagnosisChatbot.tsx | Chatbot diagnosis penyakit tanaman |
| ShieldModule.tsx | Card/list produk proteksi shield |
| LoginPage.tsx | Halaman masuk |
| RegisterPage.tsx | Halaman daftar |
| DesignSystem.tsx | Dev-only: preview design system |

### DASHBOARD (8 komponen — semua protected, hanya koperasi)

| File | Deskripsi |
|---|---|
| DashboardPage.tsx | Shell dashboard utama dengan sidebar/nav |
| DashboardBrandOrders.tsx | Manajemen pesanan masuk |
| DashboardBrandRevenue.tsx | Analitik pendapatan/revenue |
| DashboardBrandStock.tsx | Manajemen stok produk |
| DashboardKoperasiProfile.tsx | Edit profil koperasi |
| DashboardMemberNeeds.tsx | Manajemen kebutuhan anggota |
| DashboardShieldOrders.tsx | Pesanan produk shield |
| DashboardShieldStore.tsx | Manajemen toko shield |

### GRO AI (3 file + shared/)

| File | Deskripsi |
|---|---|
| GroAIPage.tsx | Mode selector (petani vs koperasi), background gro-ai-bg.jpg |
| GroAIModeA.tsx | Mode Petani/Nelayan: chat + diagnosis tanaman |
| GroAIModeB.tsx | Mode Koperasi: konsultasi ekspor, kalkulasi, dokumen, vision |
| shared/ | Komponen shared antar mode |

### UI COMPONENTS (5 komponen reusable)

| File | Deskripsi |
|---|---|
| AvatarUpload.tsx | Upload foto profil ke bucket avatars |
| ProductImageUpload.tsx | Upload gambar produk ke bucket products |
| EmptyState.tsx | State kosong reusable |
| ErrorState.tsx | State error reusable |
| LoadingSkeleton.tsx | Loading skeleton reusable |

---

## 9. CUSTOM HOOKS

| Hook | Deskripsi |
|---|---|
| useAuth.tsx | Context auth: user, session, profile, signIn, signUp, signOut. Hydrate dari getSession + onAuthStateChange |
| useConversations.ts | Manajemen history percakapan Gro AI |
| useGroAIChat.ts | Send/retry message ke Worker, loading/error state, simpan last request untuk retry, slice history 8 pesan terakhir |
| useRealtimeOrders.tsx | Subscribe Supabase Realtime untuk orders, toast notifikasi |
| useRealtimePosts.tsx | Subscribe Realtime posts/comments, invalidate TanStack Query cache |

---

## 10. LIB DAN QUERIES

### Query Files (6 domain)

| File | Deskripsi |
|---|---|
| queries/koperasi.ts | Query data koperasi |
| queries/memberNeeds.ts | Query kebutuhan anggota |
| queries/orders.ts | Query + mutasi orders |
| queries/products.ts | Query + mutasi produk |
| queries/promos.ts | Query promo banner |
| queries/shield.ts | Query produk shield + shield orders |

### Core Lib Files

| File | Deskripsi |
|---|---|
| supabase.ts | createClient dengan Database generic type |
| groai-client.ts | callGroAI() fetch ke VITE_WORKER_URL, default https://agrou-worker.agrou.workers.dev |
| groai-prompts.ts | Pure functions system prompt: getModeASystemPrompt, getModeBChatSystemPrompt, getModeBCalcSystemPrompt, getModeBVisionSystemPrompt, dll |

---

## 11. DATABASE SCHEMA

### Enums

| Enum | Nilai |
|---|---|
| user_role | petani, koperasi, pembeli, admin |
| order_status | pending, confirmed, processing, shipped, delivered, cancelled |
| shield_status | draft, active, claimed, expired, rejected |
| product_category | padi, jagung, kedelai, sayuran, buah, perkebunan, peternakan, perikanan, lainnya |

### Tabel (11 tabel aktif)

#### 1. profiles
Auto-created via trigger handle_new_user.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid PK/FK auth.users | — |
| full_name | text | — |
| avatar_url | text | — |
| bio | text | — |
| phone | text | — |
| role | user_role | default: pembeli |
| is_verified | boolean | default: false |
| created_at | timestamptz | — |
| updated_at | timestamptz | — |

#### 2. koperasi
Profil koperasi.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid PK | — |
| owner_id | FK profiles | — |
| name | text | — |
| description | text | — |
| location | text | — |
| province | text | — |
| logo_url | text | — |
| banner_url | text | — |
| phone | text | — |
| email | text | — |
| member_count | int | default: 0 |
| rating | numeric(3,2) | — |
| is_verified | boolean | — |
| verified_farm_badge | boolean | Data Bridge badge |
| commodity_focus | text[] | — |
| created_at | timestamptz | — |
| updated_at | timestamptz | — |

#### 3. products
Produk di katalog/market.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid PK | — |
| seller_id | FK profiles | — |
| koperasi_id | FK koperasi | — |
| name | text | — |
| description | text | — |
| price | numeric | — |
| stock | int | — |
| unit | text | — |
| category | product_category | — |
| images | text[] | — |
| is_available | boolean | default: true |
| created_at | timestamptz | — |
| updated_at | timestamptz | — |

#### 4. orders
Transaksi pembelian.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid PK | — |
| buyer_id | FK profiles | — |
| seller_id | FK profiles | — |
| status | order_status | default: pending |
| total_amount | numeric | — |
| notes | text | — |
| created_at | timestamptz | — |
| updated_at | timestamptz | — |

#### 5. order_items
Item dalam order.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid PK | — |
| order_id | FK orders | — |
| product_id | FK products | — |
| qty/quantity | int | — |
| unit_price/price | numeric | — |
| subtotal | numeric | — |

#### 6. shield_products
Produk proteksi lahan. **Catatan: ada schema drift.**

| Kolom | Keterangan |
|---|---|
| id, seller_id, name, description, price, stock, images | Kolom utama |
| status | shield_status |
| commodity, premium, coverage_area | Ada di database.types.ts tapi TIDAK di 01_schema.sql — perlu rekonsiliasi |

#### 7. shield_orders
Pembelian produk shield.

| Kolom | Keterangan |
|---|---|
| id, buyer_id, koperasi_id, shield_product_id | FK utama |
| quantity, total_price, status, created_at | Data transaksi |

#### 8. promos
Banner promo.

| Kolom | Keterangan |
|---|---|
| id, title, description, image_url, link | Konten banner |
| is_active, created_at | Status |

#### 9. posts
Konten komunitas/forum.

| Kolom | Keterangan |
|---|---|
| id, author_id (FK profiles), title, content, images | Konten post |
| created_at, updated_at | Timestamps |

#### 10. comments
Komentar pada post.

| Kolom | Keterangan |
|---|---|
| id, post_id (FK posts), author_id (FK profiles), content, created_at | — |

#### 11. member_needs
Kebutuhan anggota koperasi.

| Kolom | Keterangan |
|---|---|
| id, requester_id (FK profiles), koperasi_id (FK koperasi) | FK utama |
| title, description, quantity, unit, status, created_at | Data kebutuhan |

### Storage Buckets

| Bucket | Kegunaan |
|---|---|
| avatars | Foto profil user |
| products | Gambar produk |
| koperasi | Aset koperasi (logo, banner) |
| promos | Gambar banner promo |

### Konfigurasi Database

| Fitur | Detail |
|---|---|
| **RLS** | Aktif di semua tabel — user hanya bisa akses data sesuai role dan kepemilikan |
| **Realtime** | Aktif pada tabel orders, posts, comments |
| **Trigger** | handle_new_user — auto-create profile saat user baru di auth.users |

---

## 12. CLOUDFLARE WORKER

| Atribut | Detail |
|---|---|
| File | agrou-worker/src/index.ts |
| Worker name | agrou-ai-worker |
| Model | claude-sonnet-4-6 (Anthropic) |
| API URL | https://api.anthropic.com/v1/messages |

### Routes

| Method | Path | Fungsi |
|---|---|---|
| POST | /api/chat | GroAI general farming assistant (Mode A petani) |
| POST | /api/diagnose | DiagnosisChatbot plant disease expert |
| OPTIONS | * | CORS preflight |

### Environment Variables Worker

| Var | Tipe | Keterangan |
|---|---|---|
| ANTHROPIC_API_KEY | secret | Set via `wrangler secret put ANTHROPIC_API_KEY`, tidak pernah di-commit |
| ALLOWED_ORIGINS | public var | Di wrangler.toml, basis CORS (default: localhost:3000 + agrou.pages.dev) |
| RATE_LIMIT_KV | KV namespace | Optional, belum dikonfigurasi (rate limiting commented out) |

---

## 13. GRO AI SYSTEM

### Mode A (Petani/Nelayan)

| Atribut | Detail |
|---|---|
| Input | Pesan teks + modul aktif (komoditas context) |
| System prompt | getModeASystemPrompt(module) |
| Struktur response | Diagnosis, Tingkat Urgensi, Langkah Penanganan, Produk Rekomendasi, Tips Pencegahan |
| History | 8 pesan terakhir dikirim ke Worker |
| Endpoint | POST /api/chat |

### Mode B (Koperasi/Ekspor)

| Atribut | Detail |
|---|---|
| Input | Profil koperasi (nama, komoditas, lokasi, volume, targets, cert, price, anggota) + sub-mode |
| Sub-modes | Chat konsultasi, Kalkulator, Dokumen generator, Vision/analisis gambar |
| Akses | Hanya untuk user login dengan role koperasi |
| Context | System prompt inject profil koperasi lengkap |

### System Prompt Functions (groai-prompts.ts)

| Fungsi | Kegunaan |
|---|---|
| getModeASystemPrompt(module) | Mode A petani/nelayan per komoditas |
| getModeBChatSystemPrompt | Mode B konsultasi umum ekspor |
| getModeBCalcSystemPrompt | Mode B kalkulator biaya ekspor |
| getModeBWriterSystemPrompt | Mode B generator dokumen ekspor |
| getModeBVisionSystemPrompt | Mode B analisis gambar produk |

### Constants (4 file)

| File | Isi |
|---|---|
| gro-ai-modules.ts | Definisi modul/komoditas untuk Mode A |
| gro-ai-products.ts | Produk referensi untuk rekomendasi |
| gro-ai-topics.ts | Topik konsultasi Mode B |
| gro-ai-koperasi.ts | Data koperasi dummy/mock untuk Mode B |

---

## 14. AUTH SYSTEM

| Atribut | Detail |
|---|---|
| Provider | Supabase Auth (email/password) |
| Implementation | AuthContext (React Context) di useAuth.tsx |
| State | user (Supabase User), profile (Profile dari tabel profiles), loading |

### Flow Auth

1. App mount -> getSession() -> hydrate user + profile
2. onAuthStateChange listener -> update state realtime
3. signIn -> supabase.auth.signInWithPassword
4. signUp -> supabase.auth.signUp + insert ke profiles dengan role
5. signOut -> supabase.auth.signOut + clear state

### Route Guards

| Guard | Perilaku |
|---|---|
| ProtectedRoute | Redirect ke /masuk jika tidak login |
| AuthRoute | Redirect ke / jika sudah login |

### Roles

petani, koperasi, pembeli, admin

Dashboard hanya accessible setelah login. Konten berbeda per role.

---

## 15. DESIGN SYSTEM

### Tema: Dark Agro Theme

| Elemen | Nilai |
|---|---|
| Background utama | #0d1f15 |
| Hijau primer | #2d7a4f (CTA, badge, border aktif) |
| Hijau terang | #4ade80 (highlight, icon aktif) |
| Teks utama | white / #f0fdf4 |
| Teks sekunder | #86efac |
| Card surface | rgba(255,255,255,0.05) |
| Gro AI accent | #b3cc04 (kuning-hijau) |
| Connect accent | #f77f00 (oranye) |
| Toast bg | #0d2918 |
| Toast border | #2d5a3d |

### Library

| Komponen | Library |
|---|---|
| Font | System default + TailwindCSS utilities |
| Animation | Motion (Framer Motion) — page transitions & micro-interactions |
| Icons | Lucide React |

---

## 16. ENVIRONMENT VARIABLES

### Frontend (agrou/.env.local — tidak di-commit)

| Variable | Nilai | Keterangan |
|---|---|---|
| VITE_SUPABASE_URL | https://[project-id].supabase.co | URL Supabase project |
| VITE_SUPABASE_ANON_KEY | [anon-key] | Anon key Supabase |
| VITE_WORKER_URL | https://agrou-worker.agrou.workers.dev | Optional, ada default di groai-client.ts |

### Worker (via wrangler secret — tidak di-commit)

| Variable | Keterangan |
|---|---|
| ANTHROPIC_API_KEY | API key Anthropic, set via wrangler secret put |

### Production (Cloudflare Pages dashboard)

| Variable | Keterangan |
|---|---|
| VITE_SUPABASE_URL | Wajib diset di dashboard CF Pages |
| VITE_SUPABASE_ANON_KEY | Wajib diset di dashboard CF Pages |
| VITE_WORKER_URL | Opsional jika pakai custom domain Worker |

---

## 17. DEPLOYMENT

### Frontend (Cloudflare Pages)

| Atribut | Detail |
|---|---|
| Platform | Cloudflare Pages |
| Build command | cd agrou && npm install && npm run build |
| Output dir | agrou/dist |
| SPA routing | public/_redirects + vercel.json rewrites |
| Dev lokal | npm run dev (port 3000, host 0.0.0.0) |

### Worker (Cloudflare Workers)

| Atribut | Detail |
|---|---|
| Platform | Cloudflare Workers |
| Deploy | cd agrou-worker && wrangler deploy |
| Dev lokal | cd agrou-worker && wrangler dev |
| Secret setup | wrangler secret put ANTHROPIC_API_KEY |

### Database (Supabase)

| Atribut | Detail |
|---|---|
| Platform | Supabase (PostgreSQL hosted) |
| Schema | agrou/supabase/01_schema.sql (run ONCE on fresh project) |
| Seed | node agrou/supabase/seed_full.cjs (5 koperasi, 6 produk, 3 promo) |

### Demo Credentials

| Field | Nilai |
|---|---|
| Email | demo@agrou.id |
| Password | Demo1234! |
| Role | koperasi (akses penuh dashboard + Gro AI Mode B) |

---

## 18. KNOWN ISSUES DAN TECHNICAL DEBT

### CRITICAL (harus fix sebelum kompetisi)

| # | Issue | Detail | Status |
|---|---|---|---|
| 1 | Asset typo | File backgorund-hero.jpg (typo di 'background') di agrou/assets/ dan import di App.tsx — jangan rename tanpa update import sekaligus | Belum fix |
| 2 | Schema Drift shield_products | database.types.ts punya kolom commodity, premium, coverage_area tapi 01_schema.sql tidak. File terdampak: database.types.ts, queries/shield.ts, DashboardShieldStore.tsx, ShieldPage.tsx | Belum fix |
| 3 | Schema Drift order_items | database.types.ts pakai quantity/price, SQL mungkin pakai qty/unit_price/subtotal | Belum fix |

### MEDIUM

| # | Issue | Detail | Status |
|---|---|---|---|
| 4 | Hardcoded DB credential | seed_full.cjs — risk exposed jika push ke public repo | Belum fix |
| 5 | DiagnosisChatbot hardcoded | Masih pakai DIAGNOSIS_MAP hardcoded, belum diwire ke Worker /api/diagnose | Belum fix |
| 6 | Auth redirect URLs | Supabase Auth redirect URLs belum dikonfigurasi untuk domain production | Belum fix |

### LOW

| # | Issue | Detail | Status |
|---|---|---|---|
| 7 | DesignSystem.tsx | Halaman dev-only di /design-system — keputusan perlu diambil apakah dihapus sebelum submit | Pending keputusan |

---

### Production Checklist

- [ ] Rekonsiliasi schema: Supabase Dashboard -> database.types.ts -> 01_schema.sql
- [ ] Fix asset typo atau rename file + update import
- [ ] Tambahkan domain Cloudflare Pages ke Supabase Auth redirect URLs
- [ ] Set ANTHROPIC_API_KEY via wrangler secret
- [ ] Set VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di Cloudflare Pages dashboard
- [ ] Aktifkan RATE_LIMIT_KV di wrangler.toml (buat KV namespace dulu)
- [ ] Pindahkan DB credential seed_full.cjs ke env var / tambah ke .gitignore
- [ ] Keputusan: hapus DesignSystem.tsx dari routes sebelum submit
- [ ] Wire DiagnosisChatbot ke Worker /api/diagnose (endpoint sudah tersedia di Worker)
- [ ] Test end-to-end: register -> login -> buat produk -> order -> realtime toast -> Gro AI Mode A & B

---

## 19. WHAT'S WORKING VS WHAT'S NEEDS WORK

### Fitur Fully Implemented

| Fitur | Status |
|---|---|
| Auth lengkap (register/login/logout dengan role selection) | Selesai |
| Homepage penuh dengan semua section + fallback static data | Selesai |
| Katalog produk dengan filter + search | Selesai |
| Dashboard koperasi: orders, revenue, stock, profil, member needs, shield | Selesai |
| Realtime orders (toast notifikasi browser penjual) | Selesai |
| Realtime posts/comments (invalidate cache otomatis) | Selesai |
| Gro AI Mode A: chat petani dengan Claude via Worker | Selesai |
| Gro AI Mode B: konsultasi ekspor koperasi dengan multi-mode (chat/calc/dokumen/vision) | Selesai |
| Upload gambar: avatar + product image ke Supabase Storage | Selesai |
| Koperasi directory + profil page | Selesai |
| Connect/Export Hub page + importir profile | Selesai |
| Code splitting: semua halaman lazy-loaded kecuali homepage | Selesai |

### Stub / Incomplete — Perlu Dikerjakan

| Fitur | Keterangan |
|---|---|
| DiagnosisChatbot | Masih DIAGNOSIS_MAP hardcoded, belum ke Worker /api/diagnose |
| Rate limiting Worker | Kode ada tapi KV namespace belum dikonfigurasi |
| Schema drift shield_products dan order_items | Perlu direkonsiliasi antara DB dan TypeScript types |
| Supabase Auth redirect URLs | Belum dikonfigurasi untuk domain production |

---

## 20. COMPETITIVE ANALYSIS

Sumber: docs/00_CONTEXT.md

### Fitur Unik Agrou vs Kompetitor

| Fitur | Agrou | TaniHub | Sayurbox | inaExport | RabunaEkspor | Tokopedia |
|---|---|---|---|---|---|---|
| Diagnosis masalah lahan berbasis AI | Ya | Tidak | Tidak | Tidak | Tidak | Tidak |
| Marketplace produk proteksi terintegrasi | Ya | Tidak | Tidak | Tidak | Tidak | Tidak |
| AI konsultan ekspor regulasi | Ya | Tidak | Tidak | Tidak | Tidak | Tidak |
| Monetisasi limbah & ekonomi sirkular | Ya | Tidak | Tidak | Tidak | Tidak | Tidak |
| Koperasi sebagai jembatan digital | Ya | Tidak | Tidak | Tidak | Tidak | Tidak |

---

## 21. COMMANDS BERGUNA

```bash
# Dev server (dari root)
npm run dev

# Build production
npm run build

# Type check / lint
cd agrou && npm run lint

# Preview build lokal
npm run preview

# Push schema ke Supabase
cd agrou && node supabase/push.cjs

# Seed data
cd agrou && node supabase/seed_full.cjs

# Deploy Worker
cd agrou-worker && wrangler deploy

# Set API key Worker
cd agrou-worker && wrangler secret put ANTHROPIC_API_KEY

# Dev Worker lokal
cd agrou-worker && wrangler dev
```

---

*Dokumen ini di-generate otomatis sebagai master summary project Agrou untuk keperluan kompetisi 12th UTU Awards 2026.*
*Terakhir diperbarui: 2 Juli 2026*
