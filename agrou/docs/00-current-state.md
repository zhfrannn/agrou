# Agrou — Current State Analysis

> Generated: 2026-06-26
> Status: **Full dummy app — zero backend connection**

---

## Stack Aktual

| Layer | Yang Ada Sekarang |
|---|---|
| Frontend | Vite + React 19 + TypeScript + TailwindCSS 4 + Framer Motion |
| Routing | Custom `useState` view switcher di `App.tsx` (bukan react-router) |
| AI | `@google/genai` dipanggil **langsung dari frontend** — API key exposed |
| Backend | Tidak ada |
| Database | Tidak ada — semua data hardcoded di komponen |
| Auth | Tidak ada — login/register hanya UI |
| Storage | Tidak ada — gambar dari `/assets/` lokal |
| Deployment | Tidak ada konfigurasi |

---

## Struktur Folder

```
Agrou/
├── src/                          # SKELETON — tidak dipakai frontend sama sekali
│   ├── hooks/useAuth.tsx         # AuthProvider + useAuth sudah ditulis, belum dipakai
│   ├── lib/supabase/             # KOSONG — client.ts & server.ts belum dibuat
│   └── types/                   # KOSONG — database.types.ts belum dibuat
├── supabase/                     # KOSONG — schema.sql belum dibuat
├── package.json                  # Root deps: supabase-js, @supabase/ssr, react-query, zod, date-fns
│
└── agrou/                        # FRONTEND AKTUAL (Vite SPA)
    ├── src/
    │   ├── App.tsx               # Router utama via useState
    │   ├── types.ts              # Hanya 2 interface: Product, KUDBrand
    │   └── components/          # 32 komponen, semua hardcoded
    └── package.json             # @google/genai, lucide, motion, express, dotenv
```

**Masalah arsitektur:** Ada dua project terpisah (`src/` root dan `agrou/`). Saat ini yang aktif hanya `agrou/`. Folder `src/` root adalah skeleton yang belum terhubung ke apapun.

---

## View System (Navigasi)

App pakai custom view state, bukan URL routing:

```typescript
type View =
  | 'app'        // Home page
  | 'shield'     // Agrou Shield (asuransi pertanian)
  | 'brand'      // Agrou Brand (KUD/marketplace)
  | 'dashboard'  // Dashboard (multi-role)
  | 'koperasi'   // Halaman koperasi list
  | 'profile'    // Profil koperasi
  | 'about'      // Tentang Agrou
  | 'katalog'    // Katalog produk
  | 'ladangai'   // GroAI (diganti nama)
  | 'komunitas'  // Forum komunitas
```

Konsekuensi: tidak ada URL history, tidak bisa deep link, tidak bisa share URL ke halaman spesifik.

---

## Inventaris 32 Komponen & Status Data

### Halaman Utama (Landing)
| Komponen | Data | Status |
|---|---|---|
| `Hero.tsx` | Teks statis | Tetap statis |
| `MarqueeStrip.tsx` | Ticker teks statis | Tetap statis |
| `ValuePropStrip.tsx` | Value props statis | Tetap statis |
| `ModuleIntro.tsx` | Deskripsi modul statis | Tetap statis |
| `PromoBanner.tsx` | 3 promo hardcoded | Perlu `promos` table |
| `BestSellers.tsx` | Array produk hardcoded | Perlu `products` + metrics |
| `EkosistemBridge.tsx` | Konten statis | Tetap statis |
| `KoperasiTerpercaya.tsx` | List koperasi dummy | Perlu `koperasi` table |
| `HomeBottom.tsx` | CTA statis | Tetap statis |
| `Footer.tsx` | Links statis | Tetap statis |
| `Header.tsx` | Nav links, no auth state | Perlu auth state |
| `AboutPage.tsx` | Stats/founders statis | Bisa tetap statis |

### Modul Agrou Brand
| Komponen | Data | Status |
|---|---|---|
| `BrandPage.tsx` | KUD list hardcoded | Perlu `brands` table |
| `BrandModule.tsx` | Produk brand dummy | Perlu `products` table |
| `KatalogPage.tsx` | PRODUCTS array statis | Perlu `products` table |

### Modul Agrou Shield
| Komponen | Data | Status |
|---|---|---|
| `ShieldPage.tsx` | Produk asuransi dummy | Perlu `shield_products` table |
| `ShieldModule.tsx` | Detail modul statis | Sebagian statis |
| `DiagnosisChatbot.tsx` | Gemini API via frontend | Wajib pindah ke CF Worker |

### Dashboard
| Komponen | Data | Status |
|---|---|---|
| `DashboardPage.tsx` | Stats angka statis | Perlu aggregasi real |
| `DashboardBrandOrders.tsx` | Orders list dummy | Perlu `orders` table |
| `DashboardBrandRevenue.tsx` | Revenue chart dummy | Perlu revenue aggregation |
| `DashboardBrandStock.tsx` | Stock list dummy | Perlu `products` table |
| `DashboardShieldOrders.tsx` | Asuransi orders dummy | Perlu `shield_orders` table |
| `DashboardShieldStore.tsx` | Produk asuransi dummy | Perlu `shield_products` table |
| `DashboardKoperasiProfile.tsx` | Profile dummy | Perlu `profiles` table |
| `DashboardMemberNeeds.tsx` | Kebutuhan anggota dummy | Perlu `member_needs` table |

### Halaman Lain
| Komponen | Data | Status |
|---|---|---|
| `KoperasiPage.tsx` | Koperasi list dummy | Perlu `koperasi` table |
| `KoperasiProfilePage.tsx` | Profile dummy | Perlu `profiles` table |
| `GroAIPage.tsx` | Gemini API via frontend | Wajib pindah ke CF Worker |
| `KomunitasPage.tsx` | Post/forum dummy | Perlu `posts` + `comments` |
| `DesignSystem.tsx` | Dokumentasi internal | Tetap statis |
| `LadangAIPage.tsx` | File stub (1 baris komentar) | Hapus |

---

## Critical Issues (Harus Fix Sebelum Launch)

### CRITICAL — Security
1. **API Key Exposed di Console**
   - File: `agrou/src/App.tsx` baris 119
   - `console.log(import.meta.env.VITE_ANTHROPIC_API_KEY)`
   - Key ter-log ke browser DevTools siapapun yang buka app
   - **Fix: Hapus baris ini. Fix di Phase 0.**

2. **AI API dipanggil langsung dari browser**
   - `GroAIPage.tsx` dan `DiagnosisChatbot.tsx` call Gemini API langsung dari frontend
   - Semua `VITE_` env vars bisa dilihat di source code browser
   - **Fix: Pindahkan semua AI calls ke Cloudflare Worker. Fix di Phase 4.**

### HIGH — Architecture
3. **Tidak ada auth guard**
   - Dashboard bisa diakses langsung tanpa login
   - Tidak ada middleware/route protection

4. **Dua project terpisah tidak terhubung**
   - `src/` (skeleton Next.js style) dan `agrou/` (Vite aktual) tidak terhubung
   - Dependencies duplikat di dua `package.json`
   - Perlu keputusan: apakah `src/` akan dipakai atau dihapus

5. **Tidak ada URL routing**
   - `useState` sebagai router = tidak ada browser history
   - Back button browser tidak berfungsi dengan benar
   - Tidak bisa bookmark atau share halaman spesifik

### MEDIUM — Code Quality
6. **Dead file:** `LadangAIPage.tsx` hanya berisi 1 baris komentar
7. **Types sangat minimal:** `types.ts` hanya punya 2 interface, tidak merepresentasikan semua data yang ada
8. **Price sebagai string:** `Product.price` bertipe `string` padahal seharusnya `number`
