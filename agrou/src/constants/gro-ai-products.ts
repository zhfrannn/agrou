import type { MockProduct } from "../types/gro-ai";

// TODO: Replace with product API call when endpoint is ready
export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: 1,
    name: "Fungisida Tricyclazole 75WP",
    category: "Pestisida",
    price: "Rp 75.000",
    unit: "/250gr",
    rating: 4.8,
    sold: "1.2rb",
    badge: "Rekomendasi AI",
  },
  {
    id: 2,
    name: "Pupuk NPK Mutiara 16-16-16",
    category: "Pupuk",
    price: "Rp 55.000",
    unit: "/kg",
    rating: 4.6,
    sold: "3.4rb",
    badge: "Terlaris",
  },
  {
    id: 3,
    name: "Probiotik EM4 Pertanian 1L",
    category: "Probiotik",
    price: "Rp 28.000",
    unit: "/botol",
    rating: 4.7,
    sold: "5.1rb",
    badge: null,
  },
];
