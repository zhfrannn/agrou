import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Bot,
  CheckCircle2,
  Package,
  Plus,
  Search,
  HelpCircle,
  ShoppingCart,
  MessageCircle,
  Send,
  Star,
  ArrowRight,
} from "lucide-react";

// ����������������������������������������������������������������������������������������������������������������������������������������������������������
// DIAGNOSIS DATA TYPES
// ����������������������������������������������������������������������������������������������������������������������������������������������������������

interface DiagnosisResult {
  emoji: string;
  disease: string;
  severity: string; // "Ringan" | "Sedang" | "Berat"
  severityColor: string; // tailwind classes for the badge
  description: string;
  bundle: {
    name: string;
    items: string[];
    price: string;
    saving: string;
  };
  satuan: { name: string; price: string }[];
}

// ����������������������������������������������������������������������������������������������������������������������������������������������������������
// DIAGNOSIS MAP
// Key format: "<komoditas>__<primary-gejala-signal>"
// We match by finding which key's signal words appear most in selectedGejala.
// ����������������������������������������������������������������������������������������������������������������������������������������������������������

const DIAGNOSIS_MAP: Record<string, DiagnosisResult> = {
  // ���� PADI ������������������������������������������������������������������������������������������������������������������������������������
  Padi__bercak: {
    emoji: "🦠",
    disease: "Blast Fungal (Pyricularia oryzae)",
    severity: "Sedang",
    severityColor: "bg-orange-100 text-[#B8860B] border-orange-200",
    description:
      "Penyakit jamur yang menyebar cepat melalui spora di udara basah. Bercak belah ketupat abu-kelabu pada daun dapat mematikan titik tumbuh dan menghambat pengisian bulir.",
    bundle: {
      name: "Paket Solusi Blast Padi",
      items: [
        "1x Fungisida Sistemik Tricyclazole 100ml",
        "1x Nutrisi Anti-Stres Daun 500ml",
        "Gratis Sarung Tangan Semprot",
      ],
      price: "Rp 185.000",
      saving: "Hemat Rp 45.000",
    },
    satuan: [
      { name: "Fungisida Tricyclazole 100ml", price: "Rp 85.000" },
      { name: "Nutrisi Anti-Stres Daun 500ml", price: "Rp 65.000" },
      { name: "ZPT Pemulihan Akar", price: "Rp 80.000" },
    ],
  },

  Padi__wereng: {
    emoji: "🐛",
    disease: "Wereng Batang Coklat (Nilaparvata lugens)",
    severity: "Berat",
    severityColor: "bg-red-100 text-red-700 border-red-200",
    description:
      "Hama pengisap cairan batang padi yang dapat menyebabkan hopperburn (daun menguning dan mongering dari bawah). Populasi meledak cepat di musim kemarau basah.",
    bundle: {
      name: "Paket Anti-Wereng Lengkap",
      items: [
        "1x Insektisida Imidakloprid 100ml",
        "1x Insektisida Buprofezin 200ml",
        "1x Pupuk Silika Penguat Batang",
      ],
      price: "Rp 210.000",
      saving: "Hemat Rp 52.000",
    },
    satuan: [
      { name: "Insektisida Imidakloprid 100ml", price: "Rp 78.000" },
      { name: "Insektisida Buprofezin 200ml", price: "Rp 95.000" },
      { name: "Pupuk Silika 1kg", price: "Rp 89.000" },
    ],
  },

  Padi__rebah: {
    emoji: "🌧️",
    disease: "Rebah Kecambah / Lodging (Helminthosporium)",
    severity: "Sedang",
    severityColor: "bg-orange-100 text-[#B8860B] border-orange-200",
    description:
      "Batang padi rebah akibat kombinasi serangan jamur akar, angin kencang, dan nitrogen berlebih. Mempengaruhi pengisian dan kualitas gabah secara signifikan.",
    bundle: {
      name: "Paket Penguatan Batang Padi",
      items: [
        "1x Fungisida Mankozeb 200g",
        "1x Pupuk Kalium Klorida 1kg",
        "1x Zat Pengatur Tumbuh Paklobutrazol",
      ],
      price: "Rp 165.000",
      saving: "Hemat Rp 38.000",
    },
    satuan: [
      { name: "Fungisida Mankozeb 200g", price: "Rp 55.000" },
      { name: "Pupuk KCl 1kg", price: "Rp 72.000" },
      { name: "ZPT Paklobutrazol 100ml", price: "Rp 76.000" },
    ],
  },

  // ���� JAGUNG ��������������������������������������������������������������������������������������������������������������������������������
  Jagung__kuning: {
    emoji: "🍂",
    disease: "Klorosis Nitrogen (Defisiensi N)",
    severity: "Ringan",
    severityColor: "bg-green-100 text-green-700 border-green-200",
    description:
      "Daun jagung menguning dari ujung ke pangkal karena kekurangan nitrogen. Sering terjadi pada lahan dengan drainase buruk atau pH terlalu tinggi yang menghambat serapan hara.",
    bundle: {
      name: "Paket Nutrisi Jagung Hijau",
      items: [
        "1x Pupuk Urea 2kg",
        "1x Pupuk NPK 16-16-16 1kg",
        "1x Pembenah Tanah Humik Asid 500ml",
      ],
      price: "Rp 135.000",
      saving: "Hemat Rp 28.000",
    },
    satuan: [
      { name: "Pupuk Urea 2kg", price: "Rp 48.000" },
      { name: "Pupuk NPK 16-16-16 1kg", price: "Rp 52.000" },
      { name: "Pembenah Humik Asid 500ml", price: "Rp 63.000" },
    ],
  },

  Jagung__bercak: {
    emoji: "🔴",
    disease: "Bercak Daun Jagung (Turcicum Leaf Blight)",
    severity: "Sedang",
    severityColor: "bg-orange-100 text-[#B8860B] border-orange-200",
    description:
      "Hawar daun abu-kecoklatan berbentuk elips memanjang di daun jagung, disebabkan cendawan Exserohilum turcicum. Menyebar via percikan air hujan dan angin.",
    bundle: {
      name: "Paket Hawar Jagung",
      items: [
        "1x Fungisida Propineb 200g",
        "1x Fungisida Klorotalonil 100ml",
        "1x Booster Pertumbuhan Daun",
      ],
      price: "Rp 158.000",
      saving: "Hemat Rp 34.000",
    },
    satuan: [
      { name: "Fungisida Propineb 200g", price: "Rp 60.000" },
      { name: "Fungisida Klorotalonil 100ml", price: "Rp 58.000" },
      { name: "Booster Pertumbuhan 200ml", price: "Rp 74.000" },
    ],
  },

  Jagung__busuk: {
    emoji: "🫘",
    disease: "Busuk Tongkol Jagung (Fusarium ear rot)",
    severity: "Berat",
    severityColor: "bg-red-100 text-red-700 border-red-200",
    description:
      "Infeksi jamur Fusarium pada tongkol jagung menimbulkan warna merah muda pada biji dan menghasilkan mikotoksin berbahaya. Serangan berat menyebabkan gagal panen total.",
    bundle: {
      name: "Paket Busuk Tongkol Jagung",
      items: [
        "1x Fungisida Tebukonazol 100ml",
        "1x Pupuk Boron Cair 500ml",
        "1x Stimulan Pengisian Biji",
      ],
      price: "Rp 195.000",
      saving: "Hemat Rp 47.000",
    },
    satuan: [
      { name: "Fungisida Tebukonazol 100ml", price: "Rp 88.000" },
      { name: "Pupuk Boron Cair 500ml", price: "Rp 65.000" },
      { name: "Stimulan Biji 200ml", price: "Rp 89.000" },
    ],
  },

  // ���� CABAI ����������������������������������������������������������������������������������������������������������������������������������
  Cabai__bercak: {
    emoji: "🍄",
    disease: "Antraknosa Cabai / Patek (Colletotrichum gloeosporioides)",
    severity: "Berat",
    severityColor: "bg-red-100 text-red-700 border-red-200",
    description:
      "Penyakit paling merusak pada cabai. Buah busuk dengan bercak coklat melekuk berpola cincin konsentris. Menyebar sangat cepat saat kelembaban tinggi.",
    bundle: {
      name: "Paket Solusi Antraknosa Cabai",
      items: [
        "1x Fungisida Kontak Mankozeb 200g",
        "1x Fungisida Sistemik Azoksistrobin 100ml",
        "1x Pupuk Kalsium Ekstra 500ml",
      ],
      price: "Rp 175.000",
      saving: "Hemat Rp 35.000",
    },
    satuan: [
      { name: "Fungisida Mankozeb 200g", price: "Rp 55.000" },
      { name: "Fungisida Azoksistrobin 100ml", price: "Rp 82.000" },
      { name: "Pupuk Kalsium Ekstra 500ml", price: "Rp 73.000" },
    ],
  },

  Cabai__kuning: {
    emoji: "🟡",
    disease: "Virus Kuning Cabai (Begomovirus / Geminiviridae)",
    severity: "Berat",
    severityColor: "bg-red-100 text-red-700 border-red-200",
    description:
      "Daun cabai menggulung, menguning, dan keriput akibat infeksi virus yang ditularkan kutu kebul (Bemisia tabaci). Tanaman yang terinfeksi tidak dapat disembuhkan, harus dicabut.",
    bundle: {
      name: "Paket Pengendalian Virus Cabai",
      items: [
        "1x Insektisida Sistemik Imidakloprid 50ml",
        "1x Perangkap Kuning Sticky Trap 10 lbr",
        "1x Pestisida Nabati Azadiraktin 500ml",
      ],
      price: "Rp 148.000",
      saving: "Hemat Rp 30.000",
    },
    satuan: [
      { name: "Insektisida Imidakloprid 50ml", price: "Rp 56.000" },
      { name: "Sticky Trap Kuning 10 lbr", price: "Rp 38.000" },
      { name: "Azadiraktin Nabati 500ml", price: "Rp 84.000" },
    ],
  },

  Cabai__busuk: {
    emoji: "💧",
    disease: "Busuk Phytophthora (Phytophthora capsici)",
    severity: "Berat",
    severityColor: "bg-red-100 text-red-700 border-red-200",
    description:
      "Oomisete yang menyerang batang, akar, dan buah cabai di kondisi tanah jenuh air. Batang membusuk kehitaman dari pangkal. Menyebar sangat cepat di musim hujan.",
    bundle: {
      name: "Paket Busuk Phytophthora Cabai",
      items: [
        "1x Fungisida Metalaksil 200g",
        "1x Pembenah Drainase Biochar 1kg",
        "1x Fungisida Fosfon Asid 100ml",
      ],
      price: "Rp 188.000",
      saving: "Hemat Rp 40.000",
    },
    satuan: [
      { name: "Fungisida Metalaksil 200g", price: "Rp 70.000" },
      { name: "Biochar Pembenah 1kg", price: "Rp 65.000" },
      { name: "Fosfon Asid 100ml", price: "Rp 93.000" },
    ],
  },

  // ���� UDANG ����������������������������������������������������������������������������������������������������������������������������������
  Udang__busuk: {
    emoji: "🦠",
    disease: "White Spot Syndrome Virus (WSSV)",
    severity: "Berat",
    severityColor: "bg-red-100 text-red-700 border-red-200",
    description:
      "Penyakit viral paling mematikan pada budidaya udang. Bercak putih pada karapas dan tubuh udang, diikuti penurunan nafsu makan, gerakan tidak normal, dan kematian massal.",
    bundle: {
      name: "Paket Darurat WSSV Udang",
      items: [
        "1x Probiotik Bacillus 1L",
        "1x Imunostimulan Beta Glukan 500ml",
        "1x Vitamin C Aquaculture 500g",
      ],
      price: "Rp 265.000",
      saving: "Hemat Rp 55.000",
    },
    satuan: [
      { name: "Probiotik Bacillus 1L", price: "Rp 95.000" },
      { name: "Imunostimulan Beta Glukan 500ml", price: "Rp 110.000" },
      { name: "Vitamin C Aquaculture 500g", price: "Rp 115.000" },
    ],
  },

  Udang__kuning: {
    emoji: "🌊",
    disease: "Kualitas Air Buruk (Amonia & Nitrit Tinggi)",
    severity: "Sedang",
    severityColor: "bg-orange-100 text-[#B8860B] border-orange-200",
    description:
      "Udang tampak lesu, berenang di permukaan, tubuh kekuningan akibat kadar amonia atau nitrit yang melebihi ambang batas. Sering terjadi saat kepadatan tebar terlalu tinggi.",
    bundle: {
      name: "Paket Pemulihan Kualitas Air",
      items: [
        "1x Probiotik Nitrifikasi 1L",
        "1x Zeolit Penyerap Amonia 2kg",
        "1x Kapur Dolomit Penstabil pH 2kg",
      ],
      price: "Rp 178.000",
      saving: "Hemat Rp 38.000",
    },
    satuan: [
      { name: "Probiotik Nitrifikasi 1L", price: "Rp 88.000" },
      { name: "Zeolit 2kg", price: "Rp 45.000" },
      { name: "Kapur Dolomit 2kg", price: "Rp 67.000" },
    ],
  },

  Udang__rebah: {
    emoji: "🩺",
    disease: "Vibriosis (Vibrio harveyi / parahaemolyticus)",
    severity: "Berat",
    severityColor: "bg-red-100 text-red-700 border-red-200",
    description:
      "Infeksi bakteri Vibrio menyebabkan udang berpendar (bioluminescence), berenang miring, hingga kematian mendadak. Dapat menyerang semua stadia dari benur hingga udang dewasa.",
    bundle: {
      name: "Paket Anti-Vibrio Udang",
      items: [
        "1x Probiotik Anti-Vibrio Lacto 1L",
        "1x Disinfektan Iodine Tambak 1L",
        "1x Feed Additive Asam Organik 500g",
      ],
      price: "Rp 295.000",
      saving: "Hemat Rp 65.000",
    },
    satuan: [
      { name: "Probiotik Lacto Anti-Vibrio 1L", price: "Rp 115.000" },
      { name: "Iodine Disinfektan 1L", price: "Rp 98.000" },
      { name: "Asam Organik Feed Additive 500g", price: "Rp 147.000" },
    ],
  },

  // ���� RUMPUT LAUT ����������������������������������������������������������������������������������������������������������������������
  "Rumput Laut__bercak": {
    emoji: "🧫",
    disease: "Ice-Ice Disease (Bacterial & Stress-Induced)",
    severity: "Berat",
    severityColor: "bg-red-100 text-red-700 border-red-200",
    description:
      "Thallus rumput laut memutih seperti es, rapuh, dan akhirnya membusuk. Dipicu kombinasi fluktuasi salinitas, suhu ekstrem, dan infeksi bakteri oportunistik.",
    bundle: {
      name: "Paket Pemulihan Ice-Ice",
      items: [
        "1x Probiotik Laut Marine Pro 1L",
        "1x Pupuk Mikro Seaweed Special 500ml",
        "1x Kapur Pertanian Pengatur pH 2kg",
      ],
      price: "Rp 198.000",
      saving: "Hemat Rp 42.000",
    },
    satuan: [
      { name: "Probiotik Marine Pro 1L", price: "Rp 88.000" },
      { name: "Pupuk Mikro Seaweed 500ml", price: "Rp 72.000" },
      { name: "Kapur Pertanian 2kg", price: "Rp 96.000" },
    ],
  },

  "Rumput Laut__kuning": {
    emoji: "🌿",
    disease: "Defisiensi Nutrien (N-P-K Laut Rendah)",
    severity: "Ringan",
    severityColor: "bg-green-100 text-green-700 border-green-200",
    description:
      "Thallus pucat kekuningan dan pertumbuhan lambat akibat kandungan nutrien laut yang rendah, biasa terjadi di musim peralihan. Penanganan dini mencegah kerentanan infeksi.",
    bundle: {
      name: "Paket Nutrisi Rumput Laut",
      items: [
        "1x Pupuk Cair NPK Marine 1L",
        "1x Trace Element Seaweed 500ml",
        "1x Stimulan Pertumbuhan Thallus",
      ],
      price: "Rp 155.000",
      saving: "Hemat Rp 32.000",
    },
    satuan: [
      { name: "Pupuk NPK Marine 1L", price: "Rp 65.000" },
      { name: "Trace Element 500ml", price: "Rp 58.000" },
      { name: "Stimulan Thallus 200ml", price: "Rp 64.000" },
    ],
  },

  "Rumput Laut__busuk": {
    emoji: "🌊",
    disease: "Epiphyte & Fouling Organisme",
    severity: "Sedang",
    severityColor: "bg-orange-100 text-[#B8860B] border-orange-200",
    description:
      "Pertumbuhan berlebih alga epifit, hydroid, dan bryozoa pada thallus menghambat fotosintesis, menyebabkan membusuk dan menurunkan kualitas karaginan secara signifikan.",
    bundle: {
      name: "Paket Anti-Epifit Rumput Laut",
      items: [
        "1x Cleaning Agent Organik 1L",
        "1x Probiotik Kompetitor Epifit 500ml",
        "1x Pupuk Boron untuk Alga",
      ],
      price: "Rp 172.000",
      saving: "Hemat Rp 35.000",
    },
    satuan: [
      { name: "Cleaning Agent Organik 1L", price: "Rp 75.000" },
      { name: "Probiotik Kompetitor 500ml", price: "Rp 62.000" },
      { name: "Pupuk Boron Alga 200ml", price: "Rp 70.000" },
    ],
  },

  // ���� IKAN LELE ��������������������������������������������������������������������������������������������������������������������������
  "Ikan Lele__busuk": {
    emoji: "🐠",
    disease: "Aeromonasis / Bercak Merah (Aeromonas hydrophila)",
    severity: "Berat",
    severityColor: "bg-red-100 text-red-700 border-red-200",
    description:
      "Bakteri oportunistik penyebab luka merah, sisik lepas, perut kembung, dan kematian massal pada lele. Sering menyerang saat kepadatan tinggi dan kualitas air menurun.",
    bundle: {
      name: "Paket Aeromonasis Lele",
      items: [
        "1x Antibakteri Oxytetracycline 100g",
        "1x Probiotik EM-4 Perikanan 1L",
        "1x Vitamin Imunostimulan Lele 500g",
      ],
      price: "Rp 225.000",
      saving: "Hemat Rp 48.000",
    },
    satuan: [
      { name: "Oxytetracycline 100g", price: "Rp 85.000" },
      { name: "EM-4 Perikanan 1L", price: "Rp 68.000" },
      { name: "Vitamin Lele 500g", price: "Rp 120.000" },
    ],
  },

  "Ikan Lele__kuning": {
    emoji: "🔵",
    disease: "Kualitas Air Buruk (Amonia Tinggi / Oksigen Rendah)",
    severity: "Sedang",
    severityColor: "bg-orange-100 text-[#B8860B] border-orange-200",
    description:
      "Lele naik ke permukaan, megap-megap, dan tampak lesu menandakan oksigen terlarut rendah atau amonia berlebih. Kondisi ini melemahkan imun dan membuka peluang infeksi bakteri.",
    bundle: {
      name: "Paket Pemulihan Kolam Lele",
      items: [
        "1x Probiotik Decomposer Kolam 1L",
        "1x Zeolit Penyerap Amonia 2kg",
        "1x Suplemen Elektrolit Ikan 500g",
      ],
      price: "Rp 165.000",
      saving: "Hemat Rp 35.000",
    },
    satuan: [
      { name: "Probiotik Decomposer 1L", price: "Rp 75.000" },
      { name: "Zeolit Amonia 2kg", price: "Rp 45.000" },
      { name: "Suplemen Elektrolit 500g", price: "Rp 80.000" },
    ],
  },

  "Ikan Lele__bercak": {
    emoji: "🔬",
    disease: "Saprolegniasis (Jamur Air / Saprolegnia sp.)",
    severity: "Sedang",
    severityColor: "bg-orange-100 text-[#B8860B] border-orange-200",
    description:
      "Infeksi jamur air tampak sebagai lapisan benang putih kapas pada tubuh lele. Sering menyerang lele yang terluka akibat penanganan kasar atau serangan ikan lain.",
    bundle: {
      name: "Paket Anti-Jamur Air Lele",
      items: [
        "1x Antifungi Malachite Green Free 100ml",
        "1x Garam Ikan NaCl 2kg",
        "1x Vitamin C Booster Luka 500g",
      ],
      price: "Rp 148.000",
      saving: "Hemat Rp 28.000",
    },
    satuan: [
      { name: "Antifungi Aman 100ml", price: "Rp 68.000" },
      { name: "Garam NaCl Ikan 2kg", price: "Rp 28.000" },
      { name: "Vitamin C Booster 500g", price: "Rp 80.000" },
    ],
  },
};

// ����������������������������������������������������������������������������������������������������������������������������������������������������������
// FALLBACK RESULT (when no match found)
// ����������������������������������������������������������������������������������������������������������������������������������������������������������

const FALLBACK_RESULT: DiagnosisResult = {
  emoji: "🔬",
  disease: "Perlu Analisis Lebih Lanjut",
  severity: "Belum Diketahui",
  severityColor: "bg-gray-100 text-gray-600 border-gray-200",
  description:
    "Kombinasi gejala yang kamu laporkan memerlukan pemeriksaan sampel langsung di lapangan. Tim agronomi Agrou siap membantu via konsultasi WhatsApp secara gratis.",
  bundle: {
    name: "Paket Konsultasi Ahli Agrou",
    items: [
      "Konsultasi 1-on-1 dengan Agronomi Bersertifikat",
      "Analisis Foto Lahan / Budidaya",
      "Rekomendasi Produk Personal",
    ],
    price: "Gratis",
    saving: "Nilai konsultasi Rp 150.000",
  },
  satuan: [
    { name: "Kit Uji Cepat pH Tanah", price: "Rp 45.000" },
    { name: "Kit Uji Air Kolam Lengkap", price: "Rp 68.000" },
    { name: "Pupuk Dasar Serbaguna 1kg", price: "Rp 55.000" },
  ],
};

// ����������������������������������������������������������������������������������������������������������������������������������������������������������
// LOOKUP FUNCTION
// Finds the best-matching key by counting how many gejala signals appear
// in the selected gejala list, then falls back to generic if no match.
// ����������������������������������������������������������������������������������������������������������������������������������������������������������

// Mapping of gejala IDs to signal keywords used in DIAGNOSIS_MAP keys
const GEJALA_SIGNAL: Record<string, string> = {
  kuning: "kuning",
  bercak: "bercak",
  rebah: "rebah",
  wereng: "wereng",
  kosong: "busuk", // bulir kosong 🌾  nearest pattern is busuk/rot
  busuk: "busuk",
};

function getDiagnosis(komoditas: string, gejalaIds: string[]): DiagnosisResult {
  // Build a frequency map of signal words from selected gejala
  const freq: Record<string, number> = {};
  for (const id of gejalaIds) {
    const signal = GEJALA_SIGNAL[id];
    if (signal) freq[signal] = (freq[signal] ?? 0) + 1;
  }

  // Find dominant signal
  let dominantSignal = "";
  let maxCount = 0;
  for (const [signal, count] of Object.entries(freq)) {
    if (count > maxCount) {
      maxCount = count;
      dominantSignal = signal;
    }
  }

  const key = `${komoditas}__${dominantSignal}`;
  return DIAGNOSIS_MAP[key] ?? FALLBACK_RESULT;
}

// ����������������������������������������������������������������������������������������������������������������������������������������������������������
// COMPONENT
// ����������������������������������������������������������������������������������������������������������������������������������������������������������

export default function DiagnosisChatbot({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedKomoditas, setSelectedKomoditas] = useState<string | null>(
    null,
  );
  const [selectedGejala, setSelectedGejala] = useState<string[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [showOptions, setShowOptions] = useState(true);

  // Reset internal state whenever the chatbot is re-opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedKomoditas(null);
      setSelectedGejala([]);
      setChatInput("");
      setShowOptions(true);
    }
  }, [isOpen]);

  // Do NOT early-return before hooks � render null via JSX instead
  if (!isOpen) return null;

  const handleSelectKomoditas = (komoditas: string) => {
    setSelectedKomoditas(komoditas);
    setTimeout(() => setStep(2), 500);
  };

  const toggleGejala = (gejala: string) => {
    if (selectedGejala.includes(gejala)) {
      setSelectedGejala(selectedGejala.filter((g) => g !== gejala));
    } else {
      setSelectedGejala([...selectedGejala, gejala]);
    }
  };

  const handleLihatHasil = () => {
    setTimeout(() => setStep(3), 500);
  };

  // Compute diagnosis only when on step 3
  const diagnosis: DiagnosisResult =
    step === 3 && selectedKomoditas
      ? getDiagnosis(selectedKomoditas, selectedGejala)
      : FALLBACK_RESULT;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-white w-full max-w-275 rounded-3xl shadow-2xl overflow-hidden flex h-[85vh] max-h-170"
      >
        {/* = LEFT SIDEBAR - CHAT CONTEXT = */}
        <div className="w-60 bg-linear-to-b from-[#2D6A4F] to-[#1B4332] text-white p-5 flex-col hidden lg:flex">
          <div className="mb-5">
            <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl mb-2.5 flex items-center gap-2.5">
              <Bot size={24} className="shrink-0" />
              <div className="flex-1">
                <h3 className="font-display font-bold text-sm">
                  Asisten Agrou
                </h3>
                <div className="flex items-center gap-1 text-[10px] text-green-200">
                  <div className="w-1 h-1 bg-green-300 rounded-full animate-pulse"></div>
                  Online sekarang
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <h4 className="font-bold text-xs mb-2 flex items-center gap-1.5">
                <MessageCircle size={14} />
                Cara Kerja
              </h4>
              <ol className="text-[11px] space-y-1.5 text-white/80">
                <li className="flex gap-1.5">
                  <span className="font-bold">1.</span>
                  <span>Chat atau pilih komoditas</span>
                </li>
                <li className="flex gap-1.5">
                  <span className="font-bold">2.</span>
                  <span>Jelaskan gejala yang terlihat</span>
                </li>
                <li className="flex gap-1.5">
                  <span className="font-bold">3.</span>
                  <span>Dapatkan diagnosis & solusi</span>
                </li>
              </ol>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <h4 className="font-bold text-xs mb-2 flex items-center gap-1.5">
                <HelpCircle size={14} />
                Tips
              </h4>
              <p className="text-[11px] text-white/80 leading-relaxed">
                Jelaskan gejala dengan detail untuk diagnosis yang lebih akurat
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-white/20">
            <p className="text-[10px] text-white/60 text-center">
              Powered by Agrou AI
            </p>
          </div>
        </div>

        {/* = MAIN CHAT AREA = */}
        <div className="flex-1 flex flex-col bg-white">
          {/* HEADER */}
          <div className="bg-white border-b border-gray-100 px-5 py-3 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="lg:hidden bg-[#2D6A4F] p-1.5 rounded-lg">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-gray-900 text-sm">
                    Diagnosis Lahan
                  </h3>
                  <p className="text-[10px] text-gray-500">AI Assistant</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setStep(1);
                  setSelectedKomoditas(null);
                  setSelectedGejala([]);
                  onClose();
                }}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* PROGRESS INDICATOR */}
            <div className="flex items-center gap-1.5 mt-3">
              <div
                className={`flex-1 h-0.5 rounded-full transition-all ${step >= 1 ? "bg-[#2D6A4F]" : "bg-gray-200"}`}
              ></div>
              <div
                className={`flex-1 h-0.5 rounded-full transition-all ${step >= 2 ? "bg-[#2D6A4F]" : "bg-gray-200"}`}
              ></div>
              <div
                className={`flex-1 h-0.5 rounded-full transition-all ${step >= 3 ? "bg-[#2D6A4F]" : "bg-gray-200"}`}
              ></div>
            </div>
          </div>

          {/* CHAT MESSAGES AREA */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
            <AnimatePresence mode="popLayout">
              {/* STEP 1: KOMODITAS */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  {/* Bot Bubble */}
                  <div className="flex items-start gap-2.5">
                    <div className="bg-[#2D6A4F] w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="bg-white border border-gray-100 p-3 rounded-xl rounded-tl-sm shadow-sm max-w-md">
                        <p className="text-gray-800 text-sm leading-relaxed">
                          Halo! 👋 Saya asisten Agrou. Anda bisa chat dengan
                          saya atau pilih komoditas di bawah untuk diagnosis
                          cepat.
                        </p>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 ml-1">
                        Sekarang
                      </p>
                    </div>
                  </div>

                  {/* Show options toggle */}
                  {showOptions && (
                    <>
                      <div className="text-center py-2">
                        <button
                          onClick={() => setShowOptions(false)}
                          className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 mx-auto"
                        >
                          Sembunyikan opsi pilihan
                        </button>
                      </div>

                      {/* Options Grid - SMALLER SIZE */}
                      <div className="grid grid-cols-3 lg:grid-cols-4 gap-2">
                        {[
                          { id: "padi", name: "Padi", emoji: "🌾" },
                          { id: "jagung", name: "Jagung", emoji: "🌽" },
                          { id: "cabai", name: "Cabai", emoji: "🌶️" },
                          { id: "udang", name: "Udang", emoji: "🦐" },
                          {
                            id: "rumputlaut",
                            name: "Rumput Laut",
                            emoji: "🌿",
                          },
                          { id: "lele", name: "Ikan Lele", emoji: "🐟" },
                        ].map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleSelectKomoditas(item.name)}
                            className="bg-white border border-gray-200 hover:border-[#2D6A4F] hover:shadow-md p-2.5 rounded-lg transition-all flex flex-col items-center justify-center gap-1 group"
                          >
                            <span className="text-2xl group-hover:scale-110 transition-transform">
                              {item.emoji}
                            </span>
                            <span className="font-bold text-gray-700 text-[11px]">
                              {item.name}
                            </span>
                          </button>
                        ))}
                        <button className="bg-gray-50 border border-dashed border-gray-200 hover:border-gray-300 p-2.5 rounded-lg transition-all flex flex-col items-center justify-center gap-1">
                          <Search size={16} className="text-gray-400" />
                          <span className="font-bold text-gray-500 text-[11px]">
                            Lainnya
                          </span>
                        </button>
                      </div>
                    </>
                  )}

                  {!showOptions && (
                    <div className="text-center py-2">
                      <button
                        onClick={() => setShowOptions(true)}
                        className="text-xs text-[#2D6A4F] hover:text-[#1B4332] font-medium flex items-center gap-1 mx-auto"
                      >
                        Tampilkan opsi pilihan
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 2: GEJALA */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  {/* User Bubble (Previous Selection) */}
                  <div className="flex items-end justify-end gap-2.5">
                    <div>
                      <div className="bg-[#2D6A4F] text-white px-3 py-2 rounded-xl rounded-tr-sm shadow-sm">
                        <p className="font-semibold text-xs">
                          {selectedKomoditas}
                        </p>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 mr-1 text-right">
                        Sekarang
                      </p>
                    </div>
                  </div>

                  {/* Bot Bubble */}
                  <div className="flex items-start gap-2.5">
                    <div className="bg-[#2D6A4F] w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="bg-white border border-gray-100 p-3 rounded-xl rounded-tl-sm shadow-sm max-w-md">
                        <p className="text-gray-800 text-sm leading-relaxed">
                          Gejala apa yang terlihat?{" "}
                          <span className="text-gray-400 font-normal text-xs">
                            (bisa pilih lebih dari satu)
                          </span>
                        </p>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 ml-1">
                        Sekarang
                      </p>
                    </div>
                  </div>

                  {/* Gejala Options - SMALLER SIZE */}
                  <div className="grid grid-cols-3 lg:grid-cols-4 gap-2">
                    {[
                      {
                        id: "kuning",
                        label: "Daun menguning",
                        img: "https://images.unsplash.com/photo-1530836369250-ef72a3f5c122?auto=format&fit=crop&q=80&w=300",
                      },
                      {
                        id: "bercak",
                        label: "Bercak coklat",
                        img: "https://images.unsplash.com/photo-1588612197682-1dddcad05eb7?auto=format&fit=crop&q=80&w=300",
                      },
                      {
                        id: "rebah",
                        label: "Batang rebah",
                        img: "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=300",
                      },
                      {
                        id: "wereng",
                        label: "Ada hama",
                        img: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&q=80&w=300",
                      },
                      {
                        id: "kosong",
                        label: "Bulir kosong",
                        img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300",
                      },
                      {
                        id: "busuk",
                        label: "Akar busuk",
                        img: "https://images.unsplash.com/photo-1628186100298-b8058204b7b6?auto=format&fit=crop&q=80&w=300",
                      },
                    ].map((item) => {
                      const isSelected = selectedGejala.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleGejala(item.id)}
                          className={`relative rounded-lg overflow-hidden border transition-all shadow-sm group ${
                            isSelected
                              ? "border-[#2D6A4F] ring-1 ring-[#2D6A4F]/30 shadow-md"
                              : "border-gray-200 hover:border-[#2D6A4F]/50"
                          }`}
                        >
                          <div className="h-16 bg-gray-100 relative">
                            <img
                              src={item.img}
                              alt={item.label}
                              className="w-full h-full object-cover"
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-[#2D6A4F]/50 flex items-center justify-center">
                                <CheckCircle2
                                  size={20}
                                  className="text-white drop-shadow-lg"
                                />
                              </div>
                            )}
                          </div>
                          <div
                            className={`p-1.5 text-[10px] font-bold transition-colors ${isSelected ? "bg-[#2D6A4F] text-white" : "bg-white text-gray-700"}`}
                          >
                            {item.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {selectedGejala.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-end pt-1"
                    >
                      <button
                        onClick={handleLihatHasil}
                        className="bg-[#F77F00] hover:bg-[#E76F51] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-[#F77F00]/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
                      >
                        Lihat Hasil
                        <CheckCircle2 size={16} />
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* STEP 3: HASIL DIAGNOSIS */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  {/* User Bubble */}
                  <div className="flex items-end justify-end gap-2.5">
                    <div>
                      <div className="bg-[#2D6A4F] text-white px-3 py-2 rounded-xl rounded-tr-sm shadow-sm">
                        <p className="font-semibold text-xs">
                          {selectedGejala.length} Gejala Terpilih
                        </p>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 mr-1 text-right">
                        Sekarang
                      </p>
                    </div>
                  </div>

                  {/* Bot Bubble */}
                  <div className="flex items-start gap-2.5">
                    <div className="bg-[#2D6A4F] w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="bg-white border border-gray-100 p-3 rounded-xl rounded-tl-sm shadow-sm max-w-md">
                        <p className="text-gray-800 text-sm leading-relaxed">
                          Berdasarkan gejala yang Anda pilih, ini diagnosisnya:
                        </p>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 ml-1">
                        Sekarang
                      </p>
                    </div>
                  </div>

                  {/* Diagnosis Card - COMPACT */}
                  <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="p-3 bg-linear-to-br from-red-50 to-orange-50 border-b border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{diagnosis.emoji}</span>
                        <div className="flex-1">
                          <h4 className="font-display font-bold text-sm text-gray-900 leading-tight mb-1">
                            {diagnosis.disease}
                          </h4>
                          <div
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${diagnosis.severityColor}`}
                          >
                            <HelpCircle size={10} />
                            Tingkat {diagnosis.severity}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        {diagnosis.description}
                      </p>
                    </div>

                    {/* Bundle Recommendation - COMPACT */}
                    <div className="p-3">
                      <div className="relative bg-linear-to-br from-[#2D6A4F] to-[#1B4332] rounded-lg p-3 text-white overflow-hidden shadow-md mb-3">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>

                        <div className="absolute top-0 right-2 bg-[#F77F00] text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-b-md shadow-sm">
                          Rekomendasi
                        </div>

                        <div className="flex items-center gap-2 mb-2 mt-1">
                          <div className="bg-white/20 p-1.5 rounded-md backdrop-blur-sm">
                            <Package size={16} className="text-[#FFD166]" />
                          </div>
                          <h5 className="font-display font-bold text-xs">
                            {diagnosis.bundle.name}
                          </h5>
                        </div>

                        <ul className="space-y-1 mb-3">
                          {diagnosis.bundle.items.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-1.5 text-white/90"
                            >
                              <CheckCircle2
                                size={11}
                                className="text-[#74C69D] mt-0.5 shrink-0"
                              />
                              <span className="text-[10px]">{item}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="flex items-center justify-between bg-black/10 rounded-md p-2 backdrop-blur-sm border border-white/10">
                          <div>
                            <div className="font-display font-black text-[#FFD166] text-base">
                              {diagnosis.bundle.price}
                            </div>
                            <div className="text-[8px] font-bold text-[#74C69D] uppercase tracking-wider">
                              {diagnosis.bundle.saving}
                            </div>
                          </div>
                          <button className="bg-white text-[#2D6A4F] hover:bg-[#FFD166] font-bold px-3 py-1.5 rounded-md text-[10px] transition-colors shadow-md">
                            Beli Bundle
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Note - COMPACT */}
                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-medium text-[#2D6A4F] bg-[#E8F5E9] py-2 px-3 rounded-lg">
                    <MessageCircle size={12} />
                    <span>Panduan dikirim via WhatsApp setelah checkout</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Close chat messages area */}

          {/* CHAT INPUT BAR */}
          <div className="border-t border-gray-200 bg-white px-4 py-3 shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && chatInput.trim()) {
                    // Handle chat send
                    setChatInput("");
                  }
                }}
                placeholder="Ketik pertanyaan Anda..."
                className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2D6A4F] transition-all"
              />
              <button
                disabled={!chatInput.trim()}
                className={`p-2 rounded-full transition-all ${
                  chatInput.trim()
                    ? "bg-[#2D6A4F] hover:bg-[#1B4332] text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Send
                  size={16}
                  className={chatInput.trim() ? "" : "opacity-50"}
                />
              </button>
            </div>
          </div>
        </div>
        {/* Close main chat area */}

        {/* = RIGHT PANEL - PRODUCT RECOMMENDATIONS = */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-65 bg-gray-50 border-l border-gray-200 p-4 flex-col hidden lg:flex overflow-y-auto"
          >
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Star size={16} className="text-[#F77F00]" />
                <h3 className="font-display font-bold text-sm text-gray-900">
                  Rekomendasi Produk
                </h3>
              </div>
              <p className="text-[10px] text-gray-500">
                Produk pilihan untuk masalah Anda
              </p>
            </div>

            <div className="flex-1 space-y-3">
              {diagnosis.satuan.map((prod, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg p-2.5 border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-2 mb-2">
                    <div className="w-12 h-12 bg-gray-100 rounded-md shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[11px] font-bold text-gray-800 line-clamp-2 leading-tight mb-1">
                        {prod.name}
                      </h4>
                      <span className="inline-block bg-[#E8F5E9] text-[#2D6A4F] text-[9px] px-1.5 py-0.5 rounded-full font-medium">
                        Tersedia
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[#F77F00] font-bold text-xs">
                      {prod.price}
                    </p>
                    <button className="bg-[#F77F00] hover:bg-[#E76F51] text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 transition-colors">
                      <ShoppingCart size={10} />
                      Beli
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-3 border border-[#2D6A4F] text-[#2D6A4F] hover:bg-[#2D6A4F] hover:text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 transition-all">
              Lihat Semua
              <ArrowRight size={12} />
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
