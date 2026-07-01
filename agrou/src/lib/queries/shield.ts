import { useQuery } from "@tanstack/react-query";
import supabase from "../supabase";
import type { ShieldStatus, ShieldProduct, ShieldOrder } from "../database.types";

export type { ShieldStatus };

export const SHIELD_STATUS_LABEL: Record<ShieldStatus, string> = {
  draft: "Draft",
  active: "Aktif",
  claimed: "Klaim",
  expired: "Kedaluwarsa",
  rejected: "Ditolak",
};

export const SHIELD_STATUS_COLOR: Record<ShieldStatus, string> = {
  draft: "text-gray-500",
  active: "text-green-600",
  claimed: "text-blue-600",
  expired: "text-red-500",
  rejected: "text-red-700",
};

export function useShieldProducts() {
  return useQuery({
    queryKey: ["shield-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shield_products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ShieldProduct[];
    },
  });
}

export function useMyShieldOrders(userId: string) {
  return useQuery({
    queryKey: ["shield-orders", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shield_orders")
        .select("*, shield_products(*)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as (ShieldOrder & { shield_products: ShieldProduct | null })[];
    },
    enabled: !!userId,
  });
}
