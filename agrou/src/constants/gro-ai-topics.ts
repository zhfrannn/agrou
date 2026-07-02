import type { ChatTopic } from "../types/gro-ai";

// Chat topics untuk Mode B (Koperasi/Unit Usaha)
export const CHAT_TOPICS: ChatTopic[] = [
  {
    id: "regulasi",
    category: "Regulasi",
    icon: "",
    title: "Regulasi Ekspor",
    desc: "Persyaratan, izin, dan standar ekspor",
    prompts: [
      "Apa saja dokumen wajib untuk ekspor ke Jepang?",
      "Bagaimana proses mendapatkan sertifikat fitosanitari?",
      "Regulasi HACCP untuk ekspor produk perikanan",
      "Persyaratan labeling produk ekspor ke Eropa",
    ],
  },
  {
    id: "pasar",
    category: "Pasar",
    icon: "",
    title: "Analisis Pasar",
    desc: "Tren harga dan peluang pasar global",
    prompts: [
      "Tren harga kopi arabika di pasar Jepang 2024",
      "Peluang ekspor udang ke Amerika Serikat",
      "Kompetitor utama Indonesia di pasar sayuran organik",
      "Proyeksi permintaan produk organik global",
    ],
  },
  {
    id: "logistik",
    category: "Logistik",
    icon: "",
    title: "Logistik & Pengiriman",
    desc: "Rantai pasok dan pengiriman internasional",
    prompts: [
      "Cold chain management untuk ekspor produk segar",
      "Perbandingan biaya FCL vs LCL untuk ekspor",
      "Cara memilih freight forwarder yang terpercaya",
      "Incoterms yang tepat untuk eksportir pemula",
    ],
  },
  {
    id: "sertifikasi",
    category: "Sertifikasi",
    icon: "",
    title: "Sertifikasi & Standar",
    desc: "Sertifikasi internasional dan standar mutu",
    prompts: [
      "Cara mendapatkan sertifikasi GlobalGAP",
      "Perbedaan HACCP, ISO 22000, dan BRC",
      "Biaya dan proses sertifikasi organik SNI",
      "Sertifikasi Halal untuk ekspor ke Timur Tengah",
    ],
  },
  {
    id: "keuangan",
    category: "Keuangan",
    icon: "",
    title: "Keuangan Ekspor",
    desc: "Pembiayaan, asuransi, dan manajemen risiko",
    prompts: [
      "Cara mengajukan fasilitas pembiayaan ekspor LPEI",
      "Letter of Credit vs Open Account, mana yang lebih aman?",
      "Asuransi ekspor ASEI, bagaimana cara mendaftarnya?",
      "Manajemen risiko nilai tukar untuk eksportir",
    ],
  },
  {
    id: "branding",
    category: "Branding",
    icon: "",
    title: "Branding & Pemasaran",
    desc: "Strategi merek dan pemasaran internasional",
    prompts: [
      "Cara membangun brand kopi Indonesia di pasar Jepang",
      "Platform B2B terbaik untuk mencari buyer internasional",
      "Strategi digital marketing untuk eksportir koperasi",
      "Cara berpartisipasi di pameran dagang internasional",
    ],
  },
];
