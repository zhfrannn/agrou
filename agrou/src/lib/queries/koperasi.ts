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
      return (data ?? []) as KoperasiRow[];
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
    }) => {
      const { data, error } = await supabase
        .from("koperasi")
        .insert(payload as never)
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
        .update(updates as never)
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
      const path = `koperasi/${koperasiId}/${type}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("images").getPublicUrl(path);
      return data.publicUrl;
    },
  });
}

export interface KoperasiStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalProducts: number;
  memberCount: number;
  rating: number;
}

export function useKoperasiStats(koperasiId: string) {
  return useQuery<KoperasiStats>({
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
          .eq("koperasi_id", koperasiId),
        supabase
          .from("koperasi")
          .select("member_count, rating")
          .eq("id", koperasiId)
          .maybeSingle() as unknown as Promise<{
          data: { member_count: number; rating: number } | null;
          error: unknown;
        }>,
      ]);

      const orders = (ordersRes.data ?? []) as Array<{
        status: string;
        total_amount: number;
      }>;
      const totalRevenue = orders
        .filter((o) => o.status === "delivered")
        .reduce((s, o) => s + (o.total_amount ?? 0), 0);

      const koperasiData = koperasiRes.data;
      return {
        totalRevenue,
        totalOrders: orders.length,
        pendingOrders: orders.filter((o) => o.status === "pending").length,
        completedOrders: orders.filter((o) => o.status === "delivered").length,
        totalProducts: productsRes.count ?? 0,
        memberCount: koperasiData ? koperasiData.member_count : 0,
        rating: koperasiData ? koperasiData.rating : 0,
      };
    },
    enabled: !!koperasiId,
  });
}
