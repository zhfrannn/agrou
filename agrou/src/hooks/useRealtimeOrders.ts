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
          queryClient.invalidateQueries({
            queryKey: ["dashboard-stats", profile.id],
          });
        },
      )
      .subscribe();

    return () => {
      channelRef.current?.unsubscribe();
    };
  }, [profile?.id, queryClient]);
}
