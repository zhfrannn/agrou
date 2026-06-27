export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  badge?: string;
  badgeColor?: string;
}

export interface KUDBrand {
  id: string;
  storeName: string;
  productName: string;
  price: string;
  image: string;
  location: string;
  rating: number;
}
