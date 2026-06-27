# Phase 0 — Foundation & Security Fixes

> **Estimasi waktu:** 2–3 jam
> **Prioritas:** WAJIB — jangan mulai phase lain sebelum ini selesai
> **Goal:** Bersihkan security holes, setup Supabase project, sambungkan Vite frontend ke Supabase

---

## 0.1 Security Hotfixes (30 menit)

### Fix 1: Hapus API Key dari Console

File: `agrou/src/App.tsx` baris 119

```typescript
// HAPUS baris ini:
console.log(import.meta.env.VITE_ANTHROPIC_API_KEY)
```

Ini expose Gemini/Anthropic API key ke siapapun yang buka DevTools browser.

### Fix 2: Audit semua `VITE_` env vars

Semua variabel `VITE_*` di Vite **otomatis ter-bundle ke client-side JavaScript** dan bisa dibaca siapapun. Audit `agrou/.env*` files dan pastikan:
- `VITE_SUPABASE_URL` — OK, boleh public
- `VITE_SUPABASE_ANON_KEY` — OK, boleh public (Supabase anon key memang untuk client)
- `VITE_GEMINI_API_KEY` / `VITE_ANTHROPIC_API_KEY` — **TIDAK BOLEH** ada di sini, pindahkan ke Cloudflare Worker

### Fix 3: Hapus dead file

```bash
# Hapus file stub yang tidak dipakai
agrou/src/components/LadangAIPage.tsx  # isinya hanya 1 baris komentar
```

---

## 0.2 Setup Supabase Project (30 menit)

### Buat Project Supabase

1. Buka [supabase.com](https://supabase.com) → New Project
2. Nama project: `agrou-prod`
3. Pilih region terdekat: `Southeast Asia (Singapore)`
4. Generate strong database password, simpan di password manager

### Ambil Credentials

Dari Supabase Dashboard → Project Settings → API:

```
Project URL: https://xxxxxxxxxxxx.supabase.co
anon/public key: eyJ...
service_role key: eyJ... (RAHASIA — jangan taruh di frontend)
```

### Buat `.env` Files

**`agrou/.env.local`** (untuk development Vite):
```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...anon_key...
```

**`agrou/.env.example`** (commit ke git, tanpa nilai asli):
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Pastikan `.env.local` ada di `.gitignore`.

---

## 0.3 Install Dependencies ke Agrou Frontend (20 menit)

Saat ini `agrou/package.json` belum punya Supabase. Dependencies Supabase ada di root `package.json` yang terpisah. Kita perlu install ke `agrou/`:

```bash
cd agrou
npm install @supabase/supabase-js@^2.108.2
npm install @tanstack/react-query@^5.101.1
npm install react-hot-toast@^2.6.0
npm install zod@^3.24.0
```

> **Catatan:** Jangan pakai `@supabase/ssr` di Vite — itu untuk Next.js/server-side. Cukup `@supabase/supabase-js`.

---

## 0.4 Buat Supabase Client untuk Frontend (30 menit)

Buat file `agrou/src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})
```

Buat placeholder `agrou/src/lib/database.types.ts` (akan di-generate ulang setelah schema dibuat):

```typescript
export type Database = {
  public: {
    Tables: {}
    Views: {}
    Functions: {}
    Enums: {}
  }
}
```

---

## 0.5 Setup React Query Provider (20 menit)

Edit `agrou/src/main.tsx`:

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 menit
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster position="top-right" />
    </QueryClientProvider>
  </StrictMode>,
)
```

---

## 0.6 Keputusan Arsitektur: Folder `src/` Root

Ada dua opsi:

**Opsi A: Hapus `src/` root** (Recommended)
- App ini adalah Vite SPA, bukan Next.js
- Folder `src/` root adalah skeleton yang menyesatkan
- `useAuth.tsx` di sana akan direkonstruksi ulang di dalam `agrou/src/`
- Lebih clean, tidak ada confusion dua project

**Opsi B: Pertahankan `src/` root sebagai referensi**
- Bisa dijadikan referensi untuk logic yang sudah ditulis
- Tapi berisiko confusion jangka panjang

> **Rekomendasi: Opsi A.** Hapus folder `src/` root setelah mengcopy logic `useAuth.tsx` ke `agrou/src/hooks/useAuth.tsx`.

---

## Checklist Phase 0

- [ ] Hapus `console.log(import.meta.env.VITE_ANTHROPIC_API_KEY)` dari `App.tsx`
- [ ] Hapus `agrou/src/components/LadangAIPage.tsx`
- [ ] Buat Supabase project di dashboard
- [ ] Buat `agrou/.env.local` dengan Supabase credentials
- [ ] Buat `agrou/.env.example` untuk di-commit
- [ ] Install `@supabase/supabase-js` dan `@tanstack/react-query` ke `agrou/`
- [ ] Buat `agrou/src/lib/supabase.ts`
- [ ] Buat `agrou/src/lib/database.types.ts` (placeholder)
- [ ] Setup `QueryClientProvider` di `main.tsx`
- [ ] Verifikasi app masih berjalan normal setelah semua perubahan

## Deliverable Phase 0

App berjalan normal, Supabase client terinisialisasi, tidak ada API key yang exposed, dependency tree bersih.
