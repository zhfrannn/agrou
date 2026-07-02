import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "../supabase";
import type { Order, OrderStatus } from "../database.types";

export type OrderWithRelations = Order & {
  buyer?: { full_name?: string; avatar_url?: string | null } | null;
  items?: Array<{
    id: string;
    product_id: string;
    qty: number;
    quantity: number;
    unit_price: number;
    price: number;
    subtotal: number;
    product?: { name?: string; images?: string[] } | null;
  }> | null;
};

export type { OrderStatus };

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Menunggu",
  confirmed: "Dikonfirmasi",
  processing: "Diproses",
  shipped: "Dikirim",
  delivered: "Selesai",
  cancelled: "Dibatalkan",
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatOrderId(id: string): string {
  return "#" + id.slice(0, 8).toUpperCase();
}

export function useMyOrders(sellerId: string, _role?: string) {
  return useQuery<OrderWithRelations[]>({
    queryKey: ["orders", sellerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as OrderWithRelations[];
    },
    enabled: !!sellerId,
  });
}

export function useMyPurchases(buyerId: string) {
  return useQuery<OrderWithRelations[]>({
    queryKey: ["my-purchases", buyerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          "*, items:order_items(id, product_id, qty, unit_price, subtotal, product:products(name, images))",
        )
        .eq("buyer_id", buyerId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as OrderWithRelations[];
    },
    enabled: !!buyerId,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const { data, error } = await supabase
        .from("orders")
        .update({ status } as never)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["my-purchases"] });
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      buyer_id: string;
      seller_id: string;
      koperasi_id?: string | null;
      total_amount: number;
      notes?: string;
      items: Array<{
        product_id: string;
        qty: number;
        unit_price: number;
        subtotal: number;
      }>;
    }) => {
      const { items, ...orderData } = payload;
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({ ...orderData, status: "pending" } as never)
        .select()
        .single();
      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        ...item,
        order_id: (order as Order).id,
      }));
      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems as never);
      if (itemsError) throw itemsError;

      return order as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["my-purchases"] });
    },
  });
}

export function useDashboardStats(sellerId: string) {
  return useQuery({
    queryKey: ["dashboard-stats", sellerId],
    queryFn: async () => {
      const [ordersResult, productsResult] = await Promise.all([
        supabase
          .from("orders")
          .select("status, total_amount")
          .eq("seller_id", sellerId),
        supabase
          .from("products")
          .select("id", { count: "exact", head: true })
          .eq("seller_id", sellerId),
      ]);
      if (ordersResult.error) throw ordersResult.error;
      const orders = (ordersResult.data ?? []) as Array<{
        status: OrderStatus;
        total_amount: number;
      }>;
      const totalRevenue = orders
        .filter((o) => o.status === "delivered")
        .reduce((sum, o) => sum + (o.total_amount ?? 0), 0);
      return {
        totalRevenue,
        totalOrders: orders.length,
        pendingOrders: orders.filter((o) => o.status === "pending").length,
        completedOrders: orders.filter((o) => o.status === "delivered").length,
        totalProducts: productsResult.count ?? 0,
      };
    },
    enabled: !!sellerId,
  });
}

export function useBuyerStats(buyerId: string) {
  return useQuery({
    queryKey: ["buyer-stats", buyerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("status, total_amount")
        .eq("buyer_id", buyerId);
      if (error) throw error;
      const orders = (data ?? []) as Array<{
        status: OrderStatus;
        total_amount: number;
      }>;
      const totalSpent = orders
        .filter((o) => o.status === "delivered")
        .reduce((sum, o) => sum + (o.total_amount ?? 0), 0);
      return {
        totalOrders: orders.length,
        pendingOrders: orders.filter((o) => o.status === "pending").length,
        completedOrders: orders.filter((o) => o.status === "delivered").length,
        totalSpent,
      };
    },
    enabled: !!buyerId,
  });
}
