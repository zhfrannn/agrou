# Agrou — Known Issues & Technical Debt

> Daftar semua bug yang diketahui, schema drift, dan hal yang perlu diperbaiki sebelum production.
> Tandai item dengan ✅ setelah diselesaikan.

---

## 🔴 Critical (Harus diperbaiki sebelum kompetisi)

### 1. Asset typo — `backgorund-hero.jpg`
- **File**: `agrou/src/App.tsx` line 6
- **Problem**: `import heroBg from "../assets/backgorund-hero.jpg"` — typo `backgorund`
- **Risk**: Jika file asset pernah di-rename menjadi `background-hero.jpg`, import ini akan gagal dan hero section kosong
- **Fix**: Pastikan nama file di `agrou/assets/` benar-benar `backgorund-hero.jpg` (ikuti typo), atau rename file dan update import sekaligus
- **Status**: ⬜ Belum dicek

---

### 2. Schema Drift — `shield_products`
- **Problem**: `database.types.ts` mendefinisikan kolom `commodity`, `premium`, `coverage_area` pada tabel `shield_products`, tapi `01_schema.sql` tidak punya kolom tersebut
- **Efek**: Query apapun yang mencoba membaca kolom `commodity`/`premium`/`coverage_area` dari `shield_products` akan mengembalikan `null` atau error TypeScript
- **File terdampak**: `agrou/src/lib/database.types.ts`, `agrou/src/lib/queries/shield.ts`, `agrou/src/components/DashboardShieldStore.tsx`, `agrou/src/components/ShieldPage.tsx`
- **Fix**: Pilih salah satu:
  - **Opsi A** (Rekomendasi): Update `01_schema.sql` untuk tambah kolom yang hilang + re-run migration
  - **Opsi B**: Update `database.types.ts` untuk match schema SQL yang ada
- **Status**: ⬜ Belum direkonsiliasi

---

### 3. Schema Drift — `order_items`
- **Problem**: `database.types.ts` menggunakan `quantity` dan `price`, tapi `01_schema.sql` mungkin menggunakan `qty`, `unit_price`, dan `subtotal`
- **Efek**: Query order items bisa mengembalikan data yang salah atau null
- **File terdampak**: `agrou/src/lib/database.types.ts`, `agrou/src/lib/queries/orders.ts`
- **Fix**: Cek kolom aktual di Supabase dashboard → rekonsiliasi `database.types.ts` dengan schema riil
- **Status**: ⬜ Belum dicek

---

## 🟡 Medium (Penting untuk kualitas / UX)

### 4. Hardcoded credential di seed script
- **File**: `agrou/supabase/seed_full.cjs`
- **Problem**: DB password tersimpan dalam plaintext di file ini
- **Risk**: Jika repo pernah di-push ke public/shared repo, credential ini exposed
- **Fix**: Pindahkan ke environment variable. Tambahkan `seed_full.cjs` dan `debug_seed.cjs` ke `.gitignore`
- **Status**: ⬜ Belum diamankan

---

### 5. `DiagnosisChatbot` masih pakai data hardcoded
- **File**: `agrou/src/components/DiagnosisChatbot.tsx`
- **Problem**: Diagnosis map masih lokal (hardcoded `DIAGNOSIS_MAP`), belum diwire ke `agrou-worker` Cloudflare Worker untuk AI response sebenarnya
- **Efek**: Diagnosis tidak dinamis, tidak bisa berkembang tanpa code change
- **Fix**: Ganti fetch diagnosis ke endpoint `agrou-worker`, kirim komoditas + gejala, terima respons AI
- **Status**: ⬜ Worker stub ada, wiring belum selesai

---

### 6. `agrou-worker` belum dikonfigurasi dengan LLM API key
- **File**: `agrou-worker/src/`
- **Problem**: Worker stub ada tapi LLM API key belum diset di Cloudflare Worker environment variables
- **Fix**: Set `OPENAI_API_KEY` (atau provider yang dipakai) di Cloudflare Worker dashboard → Worker → Settings → Variables
- **Status**: ⬜ Belum dikonfigurasi

---

### 7. Scaffold lama masih ada di root
- **Folder**: `Agrou/src/` dan `Agrou/supabase/` (di root repo, bukan di dalam `agrou/`)
- **Problem**: Folder ini adalah sisa Next.js planning phase yang kosong dan unused. Menggunakan Next.js-style APIs yang tidak kompatibel dengan Vite app ini
- **Risk**: Confusing bagi developer baru — bisa mengira ini adalah source yang aktif
- **Fix**: Hapus kedua folder ini
- **Status**: ⬜ Belum dihapus

---

### 8. `package.json` name masih `react-example`
- **File**: `agrou/package.json` line 2
- **Problem**: `"name": "react-example"` — nama default dari template Vite
- **Fix**: Ubah ke `"name": "agrou"`
- **Status**: ⬜ Belum diupdate

---

### 9. Vite chunk size warning
- **File**: `agrou/vite.config.ts`
- **Problem**: Bundle besar akan menghasilkan warning chunk size saat build
- **Fix**: Tambahkan `manualChunks` di `vite.config.ts` untuk code splitting:
  ```ts
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          query: ['@tanstack/react-query'],
        }
      }
    }
  }
  ```
- **Status**: ⬜ Belum dioptimasi

---

## 🟢 Low (Nice-to-have / polish)

### 10. Temp debug files di supabase folder
- **Files**: `agrou/supabase/debug_seed.cjs`, `agrou/supabase/run_seed.cjs`
- **Problem**: File debug sementara dari proses development — tidak perlu ada di repo final
- **Fix**: Hapus sebelum final commit / submit kompetisi
- **Status**: ⬜ Belum dihapus

---

### 11. `DesignSystem.tsx` tidak ada di routing
- **File**: `agrou/src/components/DesignSystem.tsx`
- **Problem**: Komponen ini ada tapi tidak di-route di `App.tsx` — hanya bisa diakses manual
- **Fix**: Boleh dibiarkan (dev-only tool) atau hapus sebelum submit jika tidak diperlukan
- **Status**: ⬜ Keputusan perlu diambil

---

### 12. Supabase Auth redirect URLs belum dikonfigurasi untuk domain production
- **Location**: Supabase Dashboard → Authentication → URL Configuration
- **Problem**: `Site URL` dan `Redirect URLs` perlu ditambahkan domain Cloudflare Pages production
- **Fix**: Tambahkan `https://[project].pages.dev` ke allowed redirect URLs di Supabase
- **Status**: ⬜ Perlu dilakukan sebelum deploy production

---

## Checklist Rekonsiliasi Schema

Sebelum melakukan perubahan apapun pada DB atau types, lakukan ini:

1. Buka Supabase Dashboard → Table Editor → cek kolom aktual tiap tabel
2. Bandingkan dengan `database.types.ts`
3. Bandingkan dengan `01_schema.sql`
4. Update mana yang tidak sinkron — **`01_schema.sql` harus selalu jadi source of truth**
5. Run migration jika kolom perlu ditambah/diubah di DB
