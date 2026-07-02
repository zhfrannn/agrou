import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "../supabase";

export interface MemberNeed {
  id: string;
  koperasi_id: string;
  title: string;
  description: string | null;
  category: string | null;
  quantity: number | null;
  unit: string | null;
  deadline: string | null;
  status: "open" | "fulfilled" | "cancelled";
  created_at: string;
  updated_at: string;
}

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
      category?: string;
      quantity?: number;
      unit?: string;
      deadline?: string;
    }) => {
      const { data, error } = await supabase
        .from("member_needs")
        .insert({ ...payload, status: "open" } as never)
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
      updates: Partial<Omit<MemberNeed, "id" | "koperasi_id" | "created_at" | "updated_at">>;
    }) => {
      const { data, error } = await supabase
        .from("member_needs")
        .update(updates as never)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return { data: data as MemberNeed, koperasiId };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["member-needs", result.koperasiId] });
    },
  });
}

export function useDeleteMemberNeed() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, koperasiId }: { id: string; koperasiId: string }) => {
      const { error } = await supabase.from("member_needs").delete().eq("id", id);
      if (error) throw error;
      return koperasiId;
    },
    onSuccess: (koperasiId) => {
      queryClient.invalidateQueries({ queryKey: ["member-needs", koperasiId] });
    },
  });
}
