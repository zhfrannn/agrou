import type { GroAIModule } from "../types/gro-ai";

// Module list untuk Mode A (Petani/Nelayan)
export const MODULES: GroAIModule[] = [
  {
    id: "foto",
    icon: "",
    label: "Foto Tanamanmu",
    desc: "Diagnosis AI lewat foto langsung",
    prompts: [
      "Tolong analisis foto tanaman saya ini",
      "Apakah tanaman di foto ini terkena penyakit?",
      "Bagaimana cara mengatasi hama di daun foto ini?",
    ],
  },
  {
    id: "tanaman",
    icon: "",
    label: "Masalah Tanaman",
    desc: "Gejala daun, batang, buah",
    prompts: [
      "Daun tanaman saya menguning dan rontok",
      "Batang tanaman membusuk di bagian bawah",
      "Buah tidak berkembang dan rontok sebelum matang",
      "Tanaman layu meski sudah disiram",
    ],
  },
  {
    id: "lahan",
    icon: "",
    label: "Masalah Lahan",
    desc: "pH, drainase, kesuburan",
    prompts: [
      "Tanah saya keras dan retak-retak",
      "Air tidak meresap ke tanah setelah hujan",
      "Hasil panen terus menurun tiap musim",
      "Tanah berbau tidak sedap",
    ],
  },
  {
    id: "hama",
    icon: "",
    label: "Hama & Penyakit",
    desc: "Identifikasi & penanganan",
    prompts: [
      "Ada bercak coklat di daun padi saya",
      "Tanaman terserang ulat dan berlubang",
      "Muncul jamur putih di permukaan tanah",
      "Buah banyak yang busuk sebelum panen",
    ],
  },
  {
    id: "air",
    icon: "",
    label: "Kebutuhan Air",
    desc: "Irigasi, kekeringan, banjir",
    prompts: [
      "Tanaman saya kekurangan air di musim kemarau",
      "Lahan saya tergenang air setelah hujan deras",
      "Berapa kebutuhan air untuk tanaman padi per hari?",
      "Cara membuat sistem irigasi tetes sederhana",
    ],
  },
  {
    id: "pupuk",
    icon: "",
    label: "Pemupukan",
    desc: "Dosis, jenis, jadwal pupuk",
    prompts: [
      "Pupuk apa yang cocok untuk tanaman cabai?",
      "Cara menghitung dosis pupuk per hektar",
      "Tanda-tanda tanaman kekurangan nitrogen",
      "Pupuk organik vs kimia, mana yang lebih baik?",
    ],
  },
  {
    id: "perikanan",
    icon: "",
    label: "Budidaya Perikanan",
    desc: "Tambak, kolam, laut",
    prompts: [
      "Udang saya mati mendadak di tambak",
      "Cara budidaya rumput laut yang benar",
      "Penyakit white spot pada udang vaname",
      "Kualitas air tambak yang ideal untuk udang",
    ],
  },
];
