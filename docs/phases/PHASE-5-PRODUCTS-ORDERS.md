# PHASE 5 — Products & Orders Full Integration

> Tujuan: CRUD produk, manajemen stok, order flow end-to-end, realtime order updates.
> Estimasi: 90-120 menit | Prasyarat: Phase 1-4 selesai

---

## 5.1 — Update DashboardBrandStock.tsx (Manajemen Produk)

File: `agrou/agrou/src/components/dashboard/DashboardBrandStock.tsx`

Komponen ini sudah ada. Yang perlu diupdate adalah menghubungkan ke `useMyProducts` / `useKoperasiProducts` yang real, bukan mock data.

### Ubah data source:
```typescript
// Tambah imports:
import { useMyProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "../../lib/queries/products";
import { useMyKoperasi } from "../../lib/queries/koperasi";
import { useAuth } from "../../hooks/useAuth";

// Di dalam komponen, ganti hardcode data dengan:
const { profile } = useAuth();
const { data: koperasi } = useMyKoperasi(profile?.id ?? "");
const { data: products, isLoading } = useMyProducts(profile?.id ?? "");
const createProduct = useCreateProduct();
const updateProduct = useUpdateProduct();
const deleteProduct = useDeleteProduct();
```

### Form tambah produk (modal atau inline):
```typescript
const [showForm, setShowForm] = useState(false);
const [form, setForm] = useState({
  name: "", price: "", unit: "kg", stock: "", category: "lainnya", description: "",
});

const handleCreate = async () => {
  if (!profile) return;
  await createProduct.mutateAsync({
    seller_id: profile.id,
    koperasi_id: koperasi?.id,
    name: form.name,
    price: parseFloat(form.price),
    unit: form.unit,
    stock: parseInt(form.stock),
    category: form.category as any,
    description: form.description || undefined,
  });
  setShowForm(false);
  toast.success("Produk berhasil ditambahkan");
};

const handleDelete = async (productId: string) => {
  if (!confirm("Hapus produk ini?")) return;
  await deleteProduct.mutateAsync(productId);
  toast.success("Produk dihapus");
};
```

---

## 5.2 — Update DashboardBrandOrders.tsx (Manajemen Pesanan)

File: `agrou/agrou/src/components/dashboard/DashboardBrandOrders.tsx`

### Ubah data source:
```typescript
import { useMyOrders, useUpdateOrderStatus, formatCurrency, formatDate, formatOrderId, ORDER_STATUS_LABEL } from "../../lib/queries/orders";
import { useAuth } from "../../hooks/useAuth";

const { profile } = useAuth();
const { data: orders, isLoading } = useMyOrders(profile?.id ?? "");
const updateStatus = useUpdateOrderStatus();

const handleStatusChange = (orderId: string, status: OrderStatus) => {
  updateStatus.mutate(
    { orderId, status },
    {
      onSuccess: () => toast.success("Status pesanan diupdate"),
      onError: () => toast.error("Gagal update status"),
    }
  );
};
```

---

## 5.3 — Update DashboardBrandRevenue.tsx (Pendapatan)

File: `agrou/agrou/src/components/dashboard/DashboardBrandRevenue.tsx`

### Ubah data source:
```typescript
import { useDashboardStats, formatCurrency } from "../../lib/queries/orders";
import { useAuth } from "../../hooks/useAuth";

const { profile } = useAuth();
const { data: stats } = useDashboardStats(profile?.id ?? "");
```

Gunakan `stats.totalRevenue`, `stats.completedOrders`, `stats.totalOrders` untuk chart dan summary cards.

---

## 5.4 — Buat `src/hooks/useRealtimeOrders.ts` (sudah ada, verifikasi saja)

File ini sudah ada di project. Pastikan isinya:

```typescript
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import supabase from "../lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useAuth } from "./useAuth";

export function useRealtimeOrders() {
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!profile?.id) return;

    channelRef.current = supabase
      .channel("realtime-orders")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `seller_id=eq.${profile.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["orders", profile.id] });
          queryClient.invalidateQueries({ queryKey: ["dashboard-stats", profile.id] });
        }
      )
      .subscribe();

    return () => {
      channelRef.current?.unsubscribe();
    };
  }, [profile?.id, queryClient]);
}
```

---

## 5.5 — Buat `src/lib/queries/cart.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "../supabase";

export interface CartItemWithProduct {
  id: string;
  user_id: string;
  product_id: string;
  qty: number;
  created_at: string;
  product?: {
    id: string;
    name: string;
    price: number;
    unit: string;
    images: string[];
    stock: number;
    seller_id: string;
    koperasi_id: string | null;
  } | null;
}

export function useCart(userId: string) {
  return useQuery<CartItemWithProduct[]>({
    queryKey: ["cart", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cart_items")
        .select("*, product:products(id, name, price, unit, images, stock, seller_id, koperasi_id)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as CartItemWithProduct[];
    },
    enabled: !!userId,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, productId, qty = 1 }: { userId: string; productId: string; qty?: number }) => {
      // Upsert: tambah qty jika sudah ada
      const { data: existing } = await supabase
        .from("cart_items")
        .select("id, qty")
        .eq("user_id", userId)
        .eq("product_id", productId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("cart_items")
          .update({ qty: existing.qty + qty })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("cart_items")
          .insert({ user_id: userId, product_id: productId, qty });
        if (error) throw error;
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cart", variables.userId] });
    },
  });
}

export function useUpdateCartQty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ cartItemId, qty, userId }: { cartItemId: string; qty: number; userId: string }) => {
      if (qty <= 0) {
        const { error } = await supabase.from("cart_items").delete().eq("id", cartItemId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("cart_items").update({ qty }).eq("id", cartItemId);
        if (error) throw error;
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cart", variables.userId] });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.from("cart_items").delete().eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: (_data, userId) => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
  });
}

export function useCartCount(userId: string) {
  const { data: cart } = useCart(userId);
  return cart?.reduce((sum, item) => sum + item.qty, 0) ?? 0;
}
```

---

## 5.6 — Buat `src/lib/queries/reviews.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "../supabase";

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  order_id: string | null;
  rating: number;
  comment: string | null;
  images: string[];
  created_at: string;
  user?: { full_name: string; avatar_url: string | null } | null;
}

export function useProductReviews(productId: string) {
  return useQuery<Review[]>({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, user:profiles(full_name, avatar_url)")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Review[];
    },
    enabled: !!productId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      user_id: string;
      product_id: string;
      order_id?: string;
      rating: number;
      comment?: string;
    }) => {
      const { data, error } = await supabase.from("reviews").insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.product_id] });
    },
  });
}
```

---

## 5.7 — Checkout Flow: `src/lib/queries/checkout.ts`

```typescript
import supabase from "../supabase";
import type { CartItemWithProduct } from "./cart";

export async function createOrderFromCart(
  userId: string,
  cart: CartItemWithProduct[],
  shippingAddress: string,
  notes?: string
): Promise<string> {
  if (!cart.length) throw new Error("Cart is empty");

  // Group by seller
  const bySeller = cart.reduce((acc, item) => {
    const sellerId = item.product?.seller_id ?? "";
    if (!acc[sellerId]) acc[sellerId] = [];
    acc[sellerId].push(item);
    return acc;
  }, {} as Record<string, CartItemWithProduct[]>);

  const orderIds: string[] = [];

  for (const [sellerId, items] of Object.entries(bySeller)) {
    const totalAmount = items.reduce((s, i) => s + (i.product?.price ?? 0) * i.qty, 0);
    const koperasiId = items[0]?.product?.koperasi_id ?? null;

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        buyer_id: userId,
        seller_id: sellerId,
        koperasi_id: koperasiId,
        total_amount: totalAmount,
        shipping_address: shippingAddress,
        notes,
        status: "pending",
      })
      .select()
      .single();
    if (orderErr) throw orderErr;

    const orderItems = items.map((i) => ({
      order_id: order.id,
      product_id: i.product_id,
      qty: i.qty,
      unit_price: i.product?.price ?? 0,
      subtotal: (i.product?.price ?? 0) * i.qty,
    }));

    const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
    if (itemsErr) throw itemsErr;

    orderIds.push(order.id);
  }

  // Clear cart after successful order
  await supabase.from("cart_items").delete().eq("user_id", userId);

  return orderIds[0];
}
```

---

## Checklist Phase 5

- [ ] `DashboardBrandStock.tsx` — pakai `useMyProducts`, form tambah/hapus produk
- [ ] `DashboardBrandOrders.tsx` — pakai `useMyOrders`, update status real
- [ ] `DashboardBrandRevenue.tsx` — pakai `useDashboardStats` real
- [ ] `useRealtimeOrders.ts` — verifikasi ada dan berfungsi
- [ ] `cart.ts` queries dibuat
- [ ] `reviews.ts` queries dibuat
- [ ] `checkout.ts` dibuat
- [ ] `npm run build` tidak error
- [ ] Test: tambah produk dari dashboard koperasi -> muncul di katalog
- [ ] Test: update status order dari dashboard -> status berubah realtime

**Setelah selesai -> lanjut ke PHASE-6-FINAL-POLISH.md**
