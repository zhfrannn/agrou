import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "../supabase";
import type { KoperasiRow } from "../database.types";

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

export function useUpdateKoperasi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Record<string, unknown>;
    }) => {
      const { data, error } = await supabase
        .from("koperasi")
        .update(updates as unknown as never)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-koperasi"] });
      queryClient.invalidateQueries({ queryKey: ["koperasi"] });
    },
  });
}
