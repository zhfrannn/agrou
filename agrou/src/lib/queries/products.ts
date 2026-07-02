import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "../supabase";
import type { ProductCategory, Product } from "../database.types";

export type { ProductCategory };

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

export function useProducts(filters?: {
  category?: string;
  search?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (filters?.category) query = query.eq("category", filters.category);
      if (filters?.search) query = query.ilike("name", `%${filters.search}%`);
      if (filters?.limit) query = query.limit(filters.limit);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });
}

export function useBestSellers(limit = 8) {
  return useQuery({
    queryKey: ["best-sellers", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("sold_count", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });
}

export function useMyProducts(sellerId: string) {
  return useQuery({
    queryKey: ["my-products", sellerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Product[];
    },
    enabled: !!sellerId,
  });
}

export function useKoperasiProducts(koperasiId: string) {
  return useQuery({
    queryKey: ["koperasi-products", koperasiId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("koperasi_id", koperasiId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Product[];
    },
    enabled: !!koperasiId,
  });
}

export function useProductList(filters?: {
  category?: string;
  search?: string;
  koperasiId?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["product-list", filters],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (filters?.category) query = query.eq("category", filters.category);
      if (filters?.search) query = query.ilike("name", `%${filters.search}%`);
      if (filters?.koperasiId)
        query = query.eq("koperasi_id", filters.koperasiId);
      if (filters?.limit) query = query.limit(filters.limit);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: {
      seller_id: string;
      koperasi_id?: string | null;
      name: string;
      description?: string;
      price: number;
      original_price?: number;
      unit: string;
      stock: number;
      min_order?: number;
      category: ProductCategory;
      images?: string[];
      tags?: string[];
    }) => {
      const { data, error } = await supabase
        .from("products")
        .insert(product as never)
        .select()
        .single();
      if (error) throw error;
      return data as Product;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["my-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      if (variables.koperasi_id) {
        queryClient.invalidateQueries({
          queryKey: ["koperasi-products", variables.koperasi_id],
        });
      }
    },
  });
}

export function useUpdateProduct() {
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
        .from("products")
        .update(updates as never)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["koperasi-products"] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["koperasi-products"] });
    },
  });
}

export function useAddProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("products")
        .insert(product as never)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUploadProductImage() {
  return useMutation({
    mutationFn: async ({
      productId,
      file,
    }: {
      productId: string;
      file: File;
    }) => {
      const ext = file.name.split(".").pop();
      const path = `products/${productId}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("images")
        .upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("images").getPublicUrl(path);
      return data.publicUrl;
    },
  });
}
