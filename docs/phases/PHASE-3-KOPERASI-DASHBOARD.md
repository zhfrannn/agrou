# PHASE 3 — Dashboard Koperasi (Full Integration)

> **Tujuan:** Dashboard koperasi fully-integrated dengan Supabase — stats real, produk, orders, profil, member needs semua live data.
> **Estimasi:** 60–90 menit
> **Prasyarat:** Phase 1 + Phase 2 selesai
> **PENTING:** Tidak mengubah visual/layout yang ada — hanya menghubungkan data real ke komponen yang sudah ada.

---

## 3.1 — Update `agrou/agrou/src/lib/queries/koperasi.ts`

Replace file seluruhnya:

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "../supabase";
import type { KoperasiRow } from "../database.types";

// ── List semua koperasi terverifikasi ──────────────────────────────────────
export function useKoperasiList(limit?: number) {
  return useQuery({
    queryKey: ["koperasi", limit],
    queryFn: async () => {
      let query = supabase
        .from("koperasi")
        .select("*")
        .eq("is_verified", true)
        .order("rating", { ascending: false });
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (error) throw error;
      return data as KoperasiRow[];
    },
  });
}

// ── Koperasi milik user (by owner_id) ─────────────────────────────────────
export function useMyKoperasi(ownerId: string) {
  return useQuery({
    queryKey: ["my-koperasi", ownerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("koperasi")
        .select("*")
        .eq("owner_id", ownerId)
        .maybeSingle();
      if (error) throw error;
      return data as KoperasiRow | null;
    },
    enabled: !!ownerId,
  });
}

// ── Koperasi by slug (public profile) ─────────────────────────────────────
export function useKoperasiBySlug(slug: string) {
  return useQuery({
    queryKey: ["koperasi-slug", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("koperasi")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data as KoperasiRow | null;
    },
    enabled: !!slug,
  });
}

// ── Buat koperasi baru ─────────────────────────────────────────────────────
export function useCreateKoperasi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      owner_id: string;
      name: string;
      slug: string;
      description?: string;
      location?: string;
      province?: string;
      phone?: string;
      email?: string;
      website?: string;
      established_year?: number;
      komoditas?: string[];
    }) => {
      const { data, error } = await supabase
        .from("koperasi")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data as KoperasiRow;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["my-koperasi", variables.owner_id] });
      queryClient.invalidateQueries({ queryKey: ["koperasi"] });
    },
  });
}

// ── Update koperasi ────────────────────────────────────────────────────────
export function useUpdateKoperasi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<KoperasiRow>;
    }) => {
      const { data, error } = await supabase
        .from("koperasi")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as KoperasiRow;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-koperasi"] });
      queryClient.invalidateQueries({ queryKey: ["koperasi"] });
    },
  });
}

// ── Upload logo/banner koperasi ────────────────────────────────────────────
export function useUploadKoperasiImage() {
  return useMutation({
    mutationFn: async ({
      koperasiId,
      file,
      type,
    }: {
      koperasiId: string;
      file: File;
      type: "logo" | "banner";
    }) => {
      const ext = file.name.split(".").pop();
      const path = `${koperasiId}/${type}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("koperasi")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("koperasi").getPublicUrl(path);
      return data.publicUrl;
    },
  });
}

// ── Stats koperasi (revenue, orders, products, members) ───────────────────
export function useKoperasiStats(koperasiId: string) {
  return useQuery({
    queryKey: ["koperasi-stats", koperasiId],
    queryFn: async () => {
      const [ordersRes, productsRes, koperasiRes] = await Promise.all([
        supabase
          .from("orders")
          .select("status, total_amount")
          .eq("koperasi_id", koperasiId),
        supabase
          .from("products")
          .select("id", { count: "exact", head: true })
          .eq("koperasi_id", koperasiId)
          .eq("is_active", true),
        supabase
          .from("koperasi")
          .select("member_count, rating")
          .eq("id", koperasiId)
          .maybeSingle(),
      ]);

      if (ordersRes.error) throw ordersRes.error;
      const orders = ordersRes.data ?? [];
      const totalRevenue = orders
        .filter((o) => o.status === "delivered")
        .reduce((sum, o) => sum + (o.total_amount ?? 0), 0);

      return {
        totalRevenue,
        totalOrders: orders.length,
        pendingOrders: orders.filter((o) => o.status === "pending").length,
        completedOrders: orders.filter((o) => o.status === "delivered").length,
        totalProducts: productsRes.count ?? 0,
        memberCount: koperasiRes.data?.member_count ?? 0,
        rating: koperasiRes.data?.rating ?? 0,
      };
    },
    enabled: !!koperasiId,
  });
}
```

---

## 3.2 — Update `agrou/agrou/src/lib/queries/products.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "../supabase";
import type { Product, ProductCategory } from "../database.types";

// ── Produk milik seller ────────────────────────────────────────────────────
export function useMyProducts(sellerId: string) {
  return useQuery<Product[]>({
    queryKey: ["my-products", sellerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, koperasi(id, name, location)")
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Product[];
    },
    enabled: !!sellerId,
  });
}

// ── Produk milik koperasi ─────────────────────────────────────────────────
export function useKoperasiProducts(koperasiId: string) {
  return useQuery<Product[]>({
    queryKey: ["koperasi-products", koperasiId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("koperasi_id", koperasiId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Product[];
    },
    enabled: !!koperasiId,
  });
}

// ── Katalog publik ─────────────────────────────────────────────────────────
export function useProductList(options?: {
  category?: ProductCategory;
  search?: string;
  limit?: number;
  koperasiId?: string;
}) {
  return useQuery<Product[]>({
    queryKey: ["products", options],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*, koperasi(id, name, location)")
        .eq("is_active", true)
        .order("sold_count", { ascending: false });

      if (options?.category) query = query.eq("category", options.category);
      if (options?.koperasiId) query = query.eq("koperasi_id", options.koperasiId);
      if (options?.search) query = query.ilike("name", `%${options.search}%`);
      if (options?.limit) query = query.limit(options.limit);

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });
}

// ── Tambah produk ─────────────────────────────────────────────────────────
export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      seller_id: string;
      koperasi_id?: string;
      name: string;
      description?: string;
      price: number;
      original_price?: number;
      unit: string;
      stock: number;
      min_order?: number;
      category: ProductCategory;
      images?: string[];
      tags?: string[];
    }) => {
      const { data, error } = await supabase
        .from("products")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data as Product;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["my-products", variables.seller_id] });
      queryClient.invalidateQueries({ queryKey: ["koperasi-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// ── Update produk ─────────────────────────────────────────────────────────
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
      const { data, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-products"] });
      queryClient.invalidateQueries({ queryKey: ["koperasi-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// ── Delete produk ─────────────────────────────────────────────────────────
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase.from("products").delete().eq("id", productId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-products"] });
      queryClient.invalidateQueries({ queryKey: ["koperasi-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// ── Upload gambar produk ─────────────────────────────────────────────────
export function useUploadProductImage() {
  return useMutation({
    mutationFn: async ({ sellerId, file }: { sellerId: string; file: File }) => {
      const ext = file.name.split(".").pop();
      const path = `${sellerId}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("products")
        .upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("products").getPublicUrl(path);
      return data.publicUrl;
    },
  });
}
```

---

## 3.3 — Update `agrou/agrou/src/lib/queries/orders.ts`

Tambahkan fungsi baru (append ke file yang ada):

```typescript
// Tambahkan di bawah fungsi useUpdateOrderStatus yang sudah ada:

// ── Orders untuk pembeli ───────────────────────────────────────────────────
export function useMyPurchases(buyerId: string) {
  return useQuery<OrderWithRelations[]>({
    queryKey: ["purchases", buyerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          items:order_items(
            id, qty, unit_price, subtotal,
            product:products(id, name, images)
          )
        `)
        .eq("buyer_id", buyerId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as OrderWithRelations[];
    },
    enabled: !!buyerId,
  });
}

// ── Buat order baru ────────────────────────────────────────────────────────
export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      buyer_id: string;
      seller_id: string;
      koperasi_id?: string;
      total_amount: number;
      shipping_address?: string;
      notes?: string;
      items: Array<{
        product_id: string;
        qty: number;
        unit_price: number;
        subtotal: number;
      }>;
    }) => {
      const { items, ...orderData } = payload;

      // Insert order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert(orderData)
        .select()
        .single();
      if (orderError) throw orderError;

      // Insert order_items
      const orderItems = items.map((item) => ({
        ...item,
        order_id: order.id,
      }));
      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);
      if (itemsError) throw itemsError;

      return order;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders", variables.seller_id] });
      queryClient.invalidateQueries({ queryKey: ["purchases", variables.buyer_id] });
    },
  });
}

// ── Stats untuk dashboard pembeli ─────────────────────────────────────────
export function useBuyerStats(buyerId: string) {
  return useQuery({
    queryKey: ["buyer-stats", buyerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("status, total_amount")
        .eq("buyer_id", buyerId);
      if (error) throw error;
      const orders = data ?? [];
      return {
        totalOrders: orders.length,
        pendingOrders: orders.filter((o) => o.status === "pending").length,
        completedOrders: orders.filter((o) => o.status === "delivered").length,
        totalSpent: orders
          .filter((o) => o.status === "delivered")
          .reduce((sum, o) => sum + (o.total_amount ?? 0), 0),
      };
    },
    enabled: !!buyerId,
  });
}
```

---

## 3.4 — Tambah `agrou/agrou/src/lib/queries/member-needs.ts` (file baru)

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "../supabase";
import type { MemberNeed } from "../database.types";

export function useKoperasiMemberNeeds(koperasiId: string) {
  return useQuery<MemberNeed[]>({
    queryKey: ["member-needs", koperasiId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("member_needs")
        .select("*")
        .eq("koperasi_id", koperasiId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as MemberNeed[];
    },
    enabled: !!koperasiId,
  });
}

export function useCreateMemberNeed() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      koperasi_id: string;
      title: string;
      description?: string;
      category: string;
      quantity: number;
      unit: string;
      target_price?: number;
      deadline?: string;
    }) => {
      const { data, error } = await supabase
        .from("member_needs")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data as MemberNeed;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["member-needs", variables.koperasi_id] });
    },
  });
}

export function useUpdateMemberNeed() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      koperasiId,
      updates,
    }: {
      id: string;
      koperasiId: string;
      updates: Partial<MemberNeed>;
    }) => {
      const { data, error } = await supabase
        .from("member_needs")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["member-needs", variables.koperasiId] });
    },
  });
}

export function useDeleteMemberNeed() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, koperasiId }: { id: string; koperasiId: string }) => {
      const { error } = await supabase.from("member_needs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["member-needs", variables.koperasiId] });
    },
  });
}
```

---

## 3.5 — Update `agrou/agrou/src/components/dashboard/DashboardKoperasiProfile.tsx`

Tambahkan field baru (phone, email, website, established_year, komoditas) yang sekarang ada di schema baru. Ganti `formData` state:

```typescript
// Ganti state formData dari:
const [formData, setFormData] = useState({
  name: "",
  description: "",
  location: "",
  province: "",
});

// Menjadi:
const [formData, setFormData] = useState({
  name: "",
  description: "",
  location: "",
  province: "",
  phone: "",
  email: "",
  website: "",
  established_year: "",
});

// Ganti sync block dari:
if (koperasi && !synced) {
  setFormData({
    name: koperasi.name ?? "",
    description: koperasi.description ?? "",
    location: koperasi.location ?? "",
    province: koperasi.province ?? "",
  });
  setSynced(true);
}

// Menjadi:
if (koperasi && !synced) {
  setFormData({
    name: koperasi.name ?? "",
    description: koperasi.description ?? "",
    location: koperasi.location ?? "",
    province: koperasi.province ?? "",
    phone: (koperasi as any).phone ?? "",
    email: (koperasi as any).email ?? "",
    website: (koperasi as any).website ?? "",
    established_year: (koperasi as any).established_year?.toString() ?? "",
  });
  // Sync komoditas juga
  if ((koperasi as any).komoditas?.length > 0) {
    setKomoditas((koperasi as any).komoditas);
  }
  setSynced(true);
}

// Ganti handleSave untuk include komoditas:
const handleSave = () => {
  if (!koperasi) return;
  updateKoperasi.mutate(
    {
      id: koperasi.id,
      updates: {
        ...formData,
        established_year: formData.established_year
          ? parseInt(formData.established_year)
          : null,
        komoditas,
      },
    },
    {
      onSuccess: () => toast.success("Profil koperasi berhasil disimpan"),
      onError: () => toast.error("Gagal menyimpan profil koperasi"),
    }
  );
};
```

---

## 3.6 — Update `agrou/agrou/src/components/dashboard/DashboardPage.tsx`

Update `useDashboardStats` usage — ganti import dari orders ke koperasi stats:

```typescript
// Tambahkan import:
import { useMyKoperasi, useKoperasiStats } from "../../lib/queries/koperasi";

// Di dalam DashboardPage(), tambahkan:
const { data: koperasi } = useMyKoperasi(profile?.id ?? "");
const { data: koperasiStats } = useKoperasiStats(koperasi?.id ?? "");

// Gunakan koperasiStats untuk menampilkan angka real di stat cards
// stats cards sudah ada di JSX — tinggal ganti nilai hardcode dengan:
// koperasiStats?.totalRevenue, koperasiStats?.totalOrders, dll
```

---

## 3.7 — Update `agrou/agrou/src/lib/database.types.ts`

Tambahkan field baru ke `KoperasiRow`:

```typescript
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
  website: string | null;       // BARU
  email: string | null;         // BARU
  phone: string | null;         // BARU
  established_year: number | null; // BARU
  komoditas: string[];          // BARU
  rating: number;
  member_count: number;
  total_products: number;       // BARU
  total_orders: number;         // BARU
  total_revenue: number;        // BARU
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}
```

Juga tambahkan `cart_items`, `wishlists`, `reviews`, `notifications` ke `Database` type:

```typescript
// Di dalam Database type, di dalam Tables:
cart_items: {
  Row: CartItem;
  Insert: Partial<CartItem> & Pick<CartItem, "user_id" | "product_id">;
  Update: Partial<CartItem>;
};
wishlists: {
  Row: Wishlist;
  Insert: Partial<Wishlist> & Pick<Wishlist, "user_id" | "product_id">;
  Update: Partial<Wishlist>;
};
reviews: {
  Row: Review;
  Insert: Partial<Review> & Pick<Review, "user_id" | "product_id" | "rating">;
  Update: Partial<Review>;
};
notifications: {
  Row: Notification;
  Insert: Partial<Notification> & Pick<Notification, "user_id" | "type" | "title" | "message">;
  Update: Partial<Notification>;
};
```

Dan tambahkan interface baru:

```typescript
export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  qty: number;
  created_at: string;
}

export interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  order_id: string | null;
  rating: number;
  comment: string | null;
  images: string[];
  created_at: string;
  updated_at: string;
}

export type NotificationType = "order" | "shield" | "system" | "promo" | "member";

export interface AppNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}
```

---

## Checklist Phase 3

- [ ] `koperasi.ts` queries diupdate (useKoperasiStats, useCreateKoperasi, useUploadKoperasiImage)
- [ ] `products.ts` queries diupdate (useCreateProduct, useUpdateProduct, useDeleteProduct)
- [ ] `orders.ts` queries ditambah (useMyPurchases, useCreateOrder, useBuyerStats)
- [ ] `member-needs.ts` dibuat
- [ ] `database.types.ts` diupdate (field baru + interface baru)
- [ ] `DashboardKoperasiProfile.tsx` — form field baru (phone, email, website)
- [ ] `DashboardPage.tsx` — pakai koperasiStats yang live
- [ ] Test: login sebagai koperasi, buka dashboard — stats tampil (0 jika belum ada data)
- [ ] Test: edit profil koperasi, save — data tersimpan di Supabase

**Setelah selesai → lanjut ke PHASE-4-ROLE-DASHBOARDS.md**
