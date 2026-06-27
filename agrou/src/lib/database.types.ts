// ── Enums ──────────────────────────────────────────────────────────────────
export type UserRole = "petani" | "koperasi" | "pembeli" | "admin";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";
export type ShieldStatus =
  | "draft"
  | "active"
  | "claimed"
  | "expired"
  | "rejected";
export type ProductCategoryEnum =
  | "padi"
  | "jagung"
  | "kedelai"
  | "sayuran"
  | "buah"
  | "perkebunan"
  | "peternakan"
  | "perikanan"
  | "lainnya";
export type ProductCategory = ProductCategoryEnum;

// ── Row Types ───────────────────────────────────────────────────────────────
export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  role: UserRole;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface KoperasiRow {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  location: string | null;
  province: string | null;
  rating: number;
  member_count: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  koperasi_id: string | null;
  seller_id: string;
  koperasi?: { id?: string; name?: string; location?: string | null } | null;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  unit: string;
  stock: number;
  min_order: number;
  category: ProductCategory;
  images: string[];
  tags: string[];
  rating: number;
  sold_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  koperasi_id: string | null;
  status: OrderStatus;
  total_amount: number;
  shipping_address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  qty: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
}

export interface ShieldProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  coverage: number;
  duration_days: number;
  crop_type: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShieldOrder {
  id: string;
  user_id: string;
  shield_product_id: string;
  status: ShieldStatus;
  land_area: number | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  claim_reason: string | null;
  created_at: string;
  updated_at: string;
  shield_products?: ShieldProduct;
}

export interface MemberNeed {
  id: string;
  koperasi_id: string;
  title: string;
  description: string | null;
  category: ProductCategory;
  quantity: number;
  unit: string;
  target_price: number | null;
  deadline: string | null;
  is_fulfilled: boolean;
  created_at: string;
  updated_at: string;
}

export interface KomunitasPost {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

// ── Supabase Database type ──────────────────────────────────────────────────
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & Pick<Profile, "id" | "full_name">;
        Update: Partial<Profile>;
      };
      koperasi: {
        Row: KoperasiRow;
        Insert: Partial<KoperasiRow> &
          Pick<KoperasiRow, "owner_id" | "name" | "slug">;
        Update: Partial<KoperasiRow>;
      };
      products: {
        Row: Product;
        Insert: Partial<Product> &
          Pick<Product, "seller_id" | "name" | "price" | "unit" | "category">;
        Update: Partial<Product>;
      };
      orders: {
        Row: Order;
        Insert: Partial<Order> &
          Pick<Order, "buyer_id" | "seller_id" | "status" | "total_amount">;
        Update: Partial<Order>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Partial<OrderItem> &
          Pick<
            OrderItem,
            "order_id" | "product_id" | "qty" | "unit_price" | "subtotal"
          >;
        Update: Partial<OrderItem>;
      };
      shield_products: {
        Row: ShieldProduct;
        Insert: Partial<ShieldProduct> &
          Pick<ShieldProduct, "name" | "price" | "coverage" | "duration_days">;
        Update: Partial<ShieldProduct>;
      };
      shield_orders: {
        Row: ShieldOrder;
        Insert: Partial<ShieldOrder> &
          Pick<ShieldOrder, "user_id" | "shield_product_id" | "status">;
        Update: Partial<ShieldOrder>;
      };
      member_needs: {
        Row: MemberNeed;
        Insert: Partial<MemberNeed> &
          Pick<
            MemberNeed,
            "koperasi_id" | "title" | "category" | "quantity" | "unit"
          >;
        Update: Partial<MemberNeed>;
      };
      komunitas_posts: {
        Row: KomunitasPost;
        Insert: Partial<KomunitasPost> &
          Pick<KomunitasPost, "user_id" | "content">;
        Update: Partial<KomunitasPost>;
      };
    };
    Enums: {
      user_role: UserRole;
      order_status: OrderStatus;
      shield_status: ShieldStatus;
      product_category: ProductCategoryEnum;
    };
  };
};
