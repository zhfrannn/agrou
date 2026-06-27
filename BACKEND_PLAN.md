# Agrou — Backend Integration Master Plan
## Supabase + Cloudflare, Phase by Phase

> **Tanggal dibuat:** 2026-06-26
> **Status app saat ini:** Full dummy — semua data hardcoded, zero backend connection
> **Stack frontend:** Vite + React 19 + TypeScript + TailwindCSS 4 + Framer Motion
> **Stack backend target:** Supabase (Auth + PostgreSQL + Storage + Realtime) + Cloudflare (Pages + R2)

---

## 1. Kondisi Real Codebase Sekarang

### 1.1 Arsitektur yang Ada

App ini adalah **Vite SPA murni** (), bukan Next.js.
Ada folder  di root yang berisi skeleton Next.js/Supabase yang **belum terkoneksi sama sekali** ke frontend.



### 1.2 Navigasi & View System

App pakai **custom view state** di , bukan routing library:



Ini perlu **dipertahankan dulu** saat integrasi awal, lalu bisa di-migrate ke react-router v7 di fase akhir.

### 1.3 Inventaris Komponen & Data yang Perlu Diganti

| Komponen | Data Dummy | Perlu Backend |
|---|---|---|
|  | PRODUCTS array hardcoded | products table |
|  | Array produk statis | products + order metrics |
|  +  | KUD/brand list hardcoded | brands/koperasi table |
|  | Stats angka statis | aggregasi real-time |
|  | Orders list dummy | orders table |
|  | Revenue chart dummy | revenue aggregation |
|  | Stock list dummy | products/stock table |
|  | Asuransi orders dummy | shield_orders table |
|  | Produk asuransi dummy | shield_products table |
|  | Profile data dummy | profiles/koperasi table |
|  | Kebutuhan anggota dummy | member_needs table |
|  +  | Chat dummy + Gemini API | Gemini via Cloudflare Worker |
|  | Gemini API langsung (VITE_ANTHROPIC_API_KEY exposed) | Wajib pindah ke CF Worker |
|  | Post/forum dummy | posts/comments table |
|  | Koperasi list dummy | koperasi table |
|  | Profile dummy | profiles table |
|  | Promo hardcoded | promos table |
|  | Stats/founders statis | bisa tetap statis |

### 1.4 Critical Issues yang Harus Difix Duluan

1. **API Key Exposed** —  baris 119:  — key ter-log ke browser console. **Fix di Phase 0.**
2. **Gemini/AI dipanggil langsung dari frontend** —  dan  call Gemini API langsung. Ini expose API key ke client. **Wajib pindah ke Cloudflare Worker.**
3. **Tidak ada routing** — navigasi antar halaman via , tidak ada URL history, tidak bisa deep link.
4. **Folder  dan  terpisah** — ada dua , dua dependency tree. Perlu keputusan: merge atau tetap terpisah.
