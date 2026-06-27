import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import supabase from "../lib/supabase";

export function useRealtimePosts() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("komunitas-posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "komunitas_posts" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["komunitas_posts"] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
