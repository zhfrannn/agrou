import { useQuery } from '@tanstack/react-query';
import supabase from '../supabase';

export interface Promo {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  cta_label: string | null;
  is_active: boolean;
  created_at: string;
}

export function usePromos() {
  return useQuery({
    queryKey: ['promos'],
    queryFn: async () => {
      // Try to fetch from DB; fall back to empty array if table doesn't exist yet
      try {
        const { data, error } = await supabase
          .from('promos' as never)
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        if (error) return [] as Promo[];
        return (data ?? []) as Promo[];
      } catch {
        return [] as Promo[];
      }
    },
  });
}
