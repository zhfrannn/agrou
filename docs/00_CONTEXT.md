# Agrou — Master Context Document

> **Baca ini PERTAMA sebelum menyentuh kode apapun.**
> File ini adalah sumber kebenaran tunggal tentang apa Agrou itu, kenapa dibangun, dan bagaimana seluruh sistemnya bekerja.

---

## 1. Identitas Inovasi

| Field | Detail |
|---|---|
| **Nama Platform** | Agrou |
| **Tagline** | "Grow Local. Reach Global." |
| **Kompetisi** | 12th UTU Awards 2026 |
| **Kategori** | Online Store Design |
| **Tema** | Agro & Marine Industry |
| **Skala Target** | Nasional & Global (Indonesia sebagai basis ekspansi ekspor) |
| **Jenis Platform** | Web-based Marketplace Ekosistem + Export Hub Terintegrasi |

---

## 2. Tiga Krisis yang Dipecahkan

### Krisis 1 — Proteksi Lahan yang Buruk
Petani dan nelayan tidak tahu produk proteksi apa yang tepat untuk masalah lahan spesifik mereka. Tidak ada platform yang menjual proteksi agro berdasarkan **diagnosis masalah lahan**. Kerusakan hortikultura Indonesia: 20–30% (FAO & IPB 2024). Kehilangan sayuran dari suplai domestik: 62,8% (Bappenas 2024).

### Krisis 2 — Akses Pasar yang Tidak Adil
Koperasi desa tidak punya identitas kolektif, tidak punya brand, tidak bisa masuk pasar premium. Produk dijual murah ke tengkulak. Platform yang ada (TaniHub, Sayurbox) tidak membangun koperasi sebagai unit bisnis yang kredibel.

### Krisis 3 — Tertutupnya Pintu Ekspor untuk Koperasi Kecil
Koperasi punya produk berkualitas ekspor, tapi tidak bisa menembus pasar global karena hambatan regulasi, compliance, dokumen, dan akses ke importir. Tidak ada platform jembatan ekspor khusus koperasi kolektif dengan dukungan AI regulasi.

---

## 3. Filosofi Platform

> *"Agrou tidak memaksa petani dan nelayan untuk berubah menjadi melek digital. Agrou mengangkat koperasi sebagai unit digital dan unit ekspor yang bekerja untuk mereka — sehingga manfaat teknologi dan akses pasar global bisa dirasakan tanpa harus menguasai teknologinya sendiri."*

Model ini terinspirasi dari BRILink dan Agen Pos: koperasi sebagai operator digital, bukan petani individual.

---

## 4. Empat Modul Platform

```
┌─────────────────────────────────────────────────────────────┐
│                        AGROU ECOSYSTEM                      │
├──────────────┬──────────────┬──────────────┬────────────────┤
│ 🌾 FARM      │ 🏪 MARKET    │ 🤖 GRO AI    │ 🌐 CONNECT     │
│              │              │              │                │
│ Marketplace  │ Marketplace  │ Regulation   │ Export Hub     │
│ proteksi     │ produk       │ Booster &    │ Lokal → Global │
│ lahan +      │ koperasi +   │ Export       │                │
│ diagnosis AI │ limbah       │ Consultant   │ Importir global│
│              │ sirkular     │              │ ↔ Koperasi     │
│              │              │              │ terverifikasi  │
└──────────────┴──────────────┴──────────────┴────────────────┘
```

### Agrou Farm (→ `/tani` + `/shield`)
- Dua pintu masuk: **Catalog terstruktur** + **Chatbot diagnosis AI**
- Kategori: Pestisida/Fungisida, Pupuk/Nutrisi, Hormon/ZPT, Probiotik, Perangkap Hayati, Bundle
- Dashboard koperasi: kelola pesanan seluruh anggota, histori penggunaan per anggota
- **Data histori di Farm = fondasi badge "Verified Protected Farm"**

### Agrou Market (→ `/katalog` + `/brand`)
- Menjual hasil panen ke konsumen urban, restoran, hotel, industri pengolahan, importir
- Kategori: Ikan & Laut, Padi, Kopi/Rempah, Sayuran, Udang/Budidaya, Perkebunan, Rumput Laut, Olahan, **Limbah Sirkular**
- Branding kolektif koperasi — inovasi utama
- Revenue split otomatis ke anggota koperasi

### Gro AI (→ `/gro-ai`)
- **Mode A (tanpa login)**: Petani/Pembeli — Diagnosis lahan, simulasi PPL virtual, rekomendasi produk, cari koperasi
- **Mode B (wajib login)**: Koperasi — Cek kelayakan ekspor, panduan regulasi per negara, checklist dokumen, draft otomatis, pricing internasional, strategi masuk pasar

### Agrou Connect (→ dalam ekosistem)
- Export Hub: importir global ↔ koperasi terverifikasi
- AI Matching: permintaan importir dicocokkan ke koperasi berkapasitas
- Profil koperasi menampilkan badge + histori transaksi + kapasitas produksi
- Post limbah sirkular untuk industri bahan baku sirkular

---

## 5. Data Bridge — Inti Ekosistem

Ini adalah **moat (parit kompetitif)** utama Agrou. Tanpa ini, ekosistem tidak bermakna.

```
Beli proteksi di Farm
        ↓
   Histori lahan tercatat
        ↓
Badge "Verified Protected Farm" (6 bulan konsisten)
        ↓
   ┌────────────────────────┐
   │ Harga lokal lebih tinggi│  ← Market benefit
   │ Syarat masuk jalur ekspor│  ← Connect benefit
   └────────────────────────┘
        ↓
  Revenue ekspor naik
        ↓
Koperasi beli lebih banyak proteksi di Farm
        ↓
      [SIKLUS BERLANJUT]
```

Badge bersumber dari **histori transaksi riil** — tidak bisa dipalsukan. Ini adalah global trust signal.

---

## 6. Empat Aktor Utama

| Aktor | Cara Akses | Peran |
|---|---|---|
| **Pengurus Koperasi** | Login → Dashboard | Kelola Farm, Market, Gro AI Mode B, Connect |
| **Petani / Nelayan** | Via koperasi (tidak perlu melek digital) | Setor panen, terima revenue share |
| **Pembeli Lokal / Importir Global** | Market langsung / Connect | Beli produk, submit permintaan via AI matching |
| **Petani Melek Digital** | Langsung ke Gro AI Mode A (tanpa login) | Self-service diagnosis, rekomendasi produk |

---

## 7. Model Bisnis — Lima Revenue Stream

| Stream | Mekanisme | Estimasi Margin |
|---|---|---|
| **1. Margin Bundle Proteksi** | Farm: margin dari penjualan bundle | 20–35% |
| **2. Komisi Penjualan** | Market: per transaksi lokal + limbah | 5–8% |
| **3. Subscription Dashboard** | Free / Pro Rp99K/bln / Enterprise Rp299K/bln | Recurring |
| **4. Subscription Gro AI Pro** | Modul regulasi ekspor lanjutan + draft dokumen | Recurring |
| **5. Komisi Transaksi Ekspor** | Connect: dari transaksi via AI matching | % per deal |

---

## 8. Keunggulan Kompetitif

| Fitur | TaniHub | Sayurbox | SentraTani | Koltiva | **Agrou** |
|---|---|---|---|---|---|
| Diagnosis masalah lahan berbasis AI | ✗ | ✗ | ✗ | ✗ | **✓** |
| Bundle proteksi terkurasi | ✗ | ✗ | Parsial | ✗ | **✓** |
| Branding kolektif koperasi | ✗ | ✗ | ✗ | ✗ | **✓** |
| Dashboard koperasi lengkap | ✗ | ✗ | ✗ | Parsial | **✓** |
| Revenue split otomatis | ✗ | ✗ | ✗ | ✗ | **✓** |
| Data bridge Farm → Market | ✗ | ✗ | ✗ | ✗ | **✓** |
| AI Regulation Booster ekspor | ✗ | ✗ | ✗ | ✗ | **✓** |
| Checklist & dokumen ekspor otomatis | ✗ | ✗ | ✗ | ✗ | **✓** |
| Export Hub — koneksi importir global | ✗ | ✗ | ✗ | ✗ | **✓** |
| Kategori limbah & ekonomi sirkular | ✗ | ✗ | ✗ | ✗ | **✓** |
| Koperasi sebagai jembatan digital | ✗ | ✗ | ✗ | ✗ | **✓** |

---

## 9. Relevansi Program Nasional & Global

- **Koperasi Merah Putih (2025)**: Agrou adalah infrastruktur digital untuk 70.000–80.000 koperasi desa
- **SDGs 12.3 & 12.5**: Farm mengurangi food loss, Market monetisasi limbah sirkular
- **Hilirisasi & Ekspor (KKP/Kementan)**: Gro AI + Connect membuka ekspor langsung tanpa perantara
- **Digitalisasi Pertanian**: Model realistis via koperasi — tidak memaksa petani berubah

---

## 10. File Dokumentasi Lainnya

| File | Isi |
|---|---|
| `01_ARCHITECTURE.md` | Arsitektur teknis, stack, struktur folder |
| `02_DATABASE.md` | Schema database, tabel, RLS, relasi |
| `03_COMPONENTS.md` | Peta komponen React per halaman/modul |
| `04_KNOWN_ISSUES.md` | Bug yang diketahui, drift schema, hal yang perlu diperbaiki |
| `05_DEPLOYMENT.md` | Setup env, Supabase, Cloudflare Pages, checklist deploy |
