import { useQuery } from "@tanstack/react-query";
import supabase from "../supabase";
import type { MemberNeed } from "../database.types";

export function useMemberNeedsByKoperasi(koperasiId: string) {
  return useQuery({
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
