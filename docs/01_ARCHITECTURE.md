# Agrou — Arsitektur Teknis

> Baca `00_CONTEXT.md` terlebih dahulu untuk memahami konteks bisnis sebelum membaca dokumen ini.

---

## 1. Stack Teknologi

| Layer | Teknologi | Versi |
|---|---|---|
| **Framework UI** | React | 19.0.1 |
| **Build Tool** | Vite | 6.2.3 |
| **Routing** | React Router DOM | 6.30.0 |
| **Styling** | TailwindCSS | 4.1.14 (via `@tailwindcss/vite`) |
| **State / Data Fetching** | TanStack Query (React Query) | v5.101.1 |
| **Backend as a Service** | Supabase | 2.108.2 |
| **Auth** | Supabase Auth (email/password) | — |
| **Database** | PostgreSQL (Supabase hosted) | — |
| **Storage** | Supabase Storage (S3-compatible) | — |
| **Realtime** | Supabase Realtime (WebSocket) | — |
| **AI / Chatbot** | Cloudflare Worker (agrou-worker) + LLM API | — |
| **Animation** | Motion (Framer Motion) | 12.23.24 |
| **Icons** | Lucide React | 0.546.0 |
| **Toast** | React Hot Toast | 2.6.0 |
| **Validasi** | Zod | 3.25.76 |
| **Language** | TypeScript | 5.8.2 |
| **Deploy Target** | Cloudflare Pages | — |

---

## 2. Struktur Repo

```
Agrou/                          ← repo root
├── docs/                       ← Dokumentasi (folder ini)
├── agrou/                      ← APP UTAMA (Vite + React SPA)
│   ├── src/
│   │   ├── App.tsx             ← Router utama + ProtectedRoute + AuthRoute
│   │   ├── main.tsx            ← Entry point, AuthProvider + QueryClientProvider
│   │   ├── index.css           ← Global styles + TailwindCSS
│   │   ├── types.ts            ← Shared types tambahan
│   │   ├── assets/
│   │   │   └── gro-ai-bg.jpg
│   │   ├── components/         ← Semua komponen halaman (lihat 03_COMPONENTS.md)
│   │   │   └── ui/             ← Komponen UI reusable
│   │   ├── hooks/              ← Custom hooks
│   │   └── lib/
│   │       ├── supabase.ts     ← Supabase client + db helper wrappers
│   │       ├── database.types.ts ← Auto-typed DB schema
│   │       ├── storage.ts      ← Upload helpers per bucket
│   │       └── queries/        ← TanStack Query hooks per domain
│   ├── supabase/
│   │   ├── 01_schema.sql       ← Full DB schema — run ONCE on fresh project
│   │   ├── 02_seed.sql         ← SQL seed data
│   │   ├── push.cjs            ← Script push schema via REST API
│   │   └── seed_full.cjs       ← Script seed data via REST API
│   ├── public/
│   │   └── _redirects          ← Cloudflare Pages SPA routing fix
│   ├── .env.local              ← TIDAK di-commit — berisi Supabase keys
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
├── agrou-worker/               ← Cloudflare Worker untuk Gro AI
│   └── src/                    ← Worker source
├── src/                        ← SCAFFOLD LAMA — ABAIKAN, bisa dihapus
└── supabase/                   ← SCAFFOLD LAMA — ABAIKAN, bisa dihapus
```

> ⚠️ **Penting**: `Agrou/src/` dan `Agrou/supabase/` di root adalah scaffold Next.js lama yang kosong dan tidak digunakan. App yang aktif ada di `Agrou/agrou/`.

---

## 3. Routing

Semua routing dikelola di `agrou/src/App.tsx` menggunakan React Router v6 `<Routes>`.

| Path | Komponen | Guard |
|---|---|---|
| `/` | `HomePage` (inline di App.tsx) | — |
| `/tani` | `AgrouTaniPage` | — |
| `/shield` | `ShieldPage` | — |
| `/brand` | `BrandPage` | — |
| `/katalog` | `KatalogPage` | — |
| `/katalog?kategori=X` | `KatalogPage` dengan filter | — |
| `/koperasi` | `KoperasiPage` | — |
| `/koperasi/:id` | `KoperasiProfilePage` | — |
| `/komunitas` | `KomunitasPage` | — |
| `/gro-ai` | `GroAIPage` | — |
| `/tentang` | `AboutPage` | — |
| `/dashboard` | `DashboardPage` | `ProtectedRoute` (redirect ke `/masuk`) |
| `/masuk` | `LoginPage` (wrapper) | `AuthRoute` (redirect ke `/dashboard` jika sudah login) |
| `/daftar` | `RegisterPage` (wrapper) | `AuthRoute` |
| `*` | Redirect ke `/` | — |

### Route Guards
- **`ProtectedRoute`**: Cek `useAuth().user`. Jika tidak ada, redirect ke `/masuk`.
- **`AuthRoute`**: Cek `useAuth().user`. Jika sudah ada, redirect ke `/dashboard`.
- Keduanya tampilkan spinner loading saat `useAuth().loading === true`.

---

## 4. Auth Architecture

```
AuthProvider (agrou/src/hooks/useAuth.tsx)
  ├── State: user, session, profile, loading
  ├── Supabase onAuthStateChange listener
  ├── Auto-fetch profile dari tabel `profiles` saat login
  └── Exposed methods: signIn, signUp, signOut, resetPassword, updateProfile
```

- `signUp` membuat user via `supabase.auth.signUp()` + set metadata `full_name` & `role`
- Trigger database `handle_new_user` otomatis buat row di `profiles` saat user baru dibuat
- Profile disimpan di state lokal + di-refetch jika stale

---

## 5. Data Fetching Pattern

Semua data fetching menggunakan **TanStack Query v5**:

```
agrou/src/lib/queries/
├── products.ts   → useProducts, useProduct, useBestSellers, useMyProducts, useAddProduct, useUpdateProduct, useDeleteProduct
├── orders.ts     → useOrdersAsBuyer, useOrdersAsSeller, useUpdateOrderStatus, useDashboardStats
├── koperasi.ts   → useKoperasiList, useKoperasiById, useMyKoperasi, useCreateKoperasi, useUpdateKoperasi
├── posts.ts      → usePosts, useAddPost, useAddComment, useLikePost
├── promos.ts     → usePromos
├── shield.ts     → useShieldProducts, useShieldOrders, useCreateShieldOrder
└── memberNeeds.ts→ useMemberNeeds, useAddMemberNeed, useUpdateMemberNeed
```

**Konvensi:**
- Query keys di-define sebagai objek `{domain}Keys` di tiap file
- `staleTime` default 5 menit untuk list, 10 menit untuk best sellers
- Soft delete: `is_active = false`, bukan DELETE
- `invalidateQueries` digunakan setelah mutasi untuk trigger refetch

---

## 6. Realtime

Tiga realtime subscription aktif:

| Hook | File | Subscribe Ke | Trigger |
|---|---|---|---|
| `useRealtimeOrders` | `hooks/useRealtimeOrders.ts` | `orders` table | Toast notif order baru (seller) + status update (buyer) |
| `useRealtimePosts` | `hooks/useRealtimePosts.ts` | `posts` & `comments` table | Invalidate posts cache |
| `useUnreadOrders` | `hooks/useUnreadOrders.ts` | `orders` table | Badge counter di header |

Semua realtime diinisialisasi di `DashboardPage` dan `KomunitasPage`.

---

## 7. Storage

Empat bucket Supabase Storage (semua public):

| Bucket | Fungsi | Helper Function |
|---|---|---|
| `avatars` | Foto profil user | `uploadAvatar(userId, file)` |
| `products` | Foto produk | `uploadProductImage(userId, productId, file, index)` |
| `koperasi` | Logo + banner koperasi | `uploadKoperasiImage(koperasiId, file, 'logo'/'banner')` |
| `promos` | Gambar banner promo | `uploadFile('promos', file, path)` |

Validasi: max 5MB, format JPG/PNG/WebP/GIF. Path: `{id}/{type}.{ext}`.

---

## 8. Cloudflare Worker (Gro AI)

```
agrou-worker/
└── src/   ← Worker source yang handle request AI dari GroAIPage
```

- `DiagnosisChatbot.tsx` dan `GroAIPage.tsx` mengirim request ke worker endpoint
- Worker bertindak sebagai proxy ke LLM API (OpenAI atau compatible)
- **Status**: Stub tersedia, wiring ke LLM API perlu dikonfigurasi

---

## 9. Design System

Warna utama platform (dark agro theme):

| Token | Value | Penggunaan |
|---|---|---|
| Background utama | `#0d1f15` | bg halaman |
| Hijau primer | `#2d7a4f` | CTA, badge, border aktif |
| Hijau terang | `#4ade80` | Highlight, icon aktif |
| Teks utama | `white` / `#f0fdf4` | Body text |
| Teks sekunder | `#86efac` | Subtext, placeholder |
| Card surface | `rgba(255,255,255,0.05)` | Card background |

Font: system default + TailwindCSS utility classes.

---

## 10. Environment Variables

File `.env.local` di dalam `agrou/` (tidak di-commit):

```env
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[anon-key]
```

Untuk production di Cloudflare Pages: set sebagai environment variables di dashboard Cloudflare Pages.
