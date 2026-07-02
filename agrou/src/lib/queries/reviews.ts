import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "../supabase";

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  order_id: string | null;
  rating: number;
  comment: string | null;
  images: string[];
  created_at: string;
  user?: { full_name: string; avatar_url: string | null } | null;
}

export function useProductReviews(productId: string) {
  return useQuery<Review[]>({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, user:profiles(full_name, avatar_url)")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Review[];
    },
    enabled: !!productId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      user_id: string;
      product_id: string;
      order_id?: string;
      rating: number;
      comment?: string;
    }) => {
      const { data, error } = await supabase
        .from("reviews")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert(payload as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.product_id],
      });
    },
  });
}
