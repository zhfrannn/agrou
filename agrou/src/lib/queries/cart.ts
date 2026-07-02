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
        .select(
          "*, product:products(id, name, price, unit, images, stock, seller_id, koperasi_id)",
        )
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
    mutationFn: async ({
      userId,
      productId,
      qty = 1,
    }: {
      userId: string;
      productId: string;
      qty?: number;
    }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: existing } = await (supabase as any)
        .from("cart_items")
        .select("id, qty")
        .eq("user_id", userId)
        .eq("product_id", productId)
        .maybeSingle();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any;
      if (existing) {
        const { error } = await db
          .from("cart_items")
          .update({ qty: existing.qty + qty })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await db
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
    mutationFn: async ({
      cartItemId,
      qty,
      userId,
    }: {
      cartItemId: string;
      qty: number;
      userId: string;
    }) => {
      if (qty <= 0) {
        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("id", cartItemId);
        if (error) throw error;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
          .from("cart_items")
          .update({ qty })
          .eq("id", cartItemId);
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
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", userId);
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
