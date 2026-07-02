import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "../supabase";
import type { Profile } from "../database.types";

export function useProfile(userId: string) {
  return useQuery<Profile | null>({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Profile>;
    }) => {
      const { data, error } = await (supabase.from("profiles") as any)
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["profile", variables.id] });
    },
  });
}

export function useUploadAvatar() {
  return useMutation({
    mutationFn: async ({ userId, file }: { userId: string; file: File }) => {
      const ext = file.name.split(".").pop();
      const path = `${userId}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      return data.publicUrl;
    },
  });
}
