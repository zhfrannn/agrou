# Phase 3 — Data Integration: Dummy ke Real

> **Estimasi waktu:** 6–8 jam
> **Depends on:** Phase 1 (auth) + Phase 2 (database) selesai
> **Goal:** Ganti semua hardcoded data di 32 komponen dengan data real dari Supabase

---

## 3.1 Pattern Standar: Data Fetching

Semua data fetching pakai pola yang sama: **React Query + Supabase client**.

### Buat `agrou/src/lib/queries/` folder

Pisahkan query logic dari komponen:

```
agrou/src/lib/queries/
├── products.ts
├── koperasi.ts
├── orders.ts
├── shield.ts
├── posts.ts
└── promos.ts
```

### Contoh pattern: `products.ts`

```typescript
import { supabase } from '../supabase'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// --- Query Keys ---
export const productKeys = {
  all: ['products'] as const,
  list: (filters?: ProductFilters) => [...productKeys.all, 'list', filters] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
}

export interface ProductFilters {
  category?: string
  koperasi_id?: string
  seller_id?: string
  search?: string
  limit?: number
}

// --- Fetch functions ---
export async function fetchProducts(filters?: ProductFilters) {
  let query = supabase
    .from('products')
    .select(`
      *,
      seller:profiles(id, full_name, avatar_url),
      koperasi:koperasi(id, name, location)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (filters?.category && filters.category !== 'Semua Produk') {
    query = query.eq('category', filters.category)
  }
  if (filters?.koperasi_id) {
    query = query.eq('koperasi_id', filters.koperasi_id)
  }
  if (filters?.seller_id) {
    query = query.eq('seller_id', filters.seller_id)
  }
  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`)
  }
  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

// --- Hooks ---
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => fetchProducts(filters),
    staleTime: 1000 * 60 * 5,
  })
}

export function useAddProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase.from('products').insert(product).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
    },
  })
}
```

---

## 3.2 Komponen yang Perlu Diupdate — Prioritas Tinggi

### `KatalogPage.tsx`

**Sebelum:** Array `PRODUCTS` hardcoded ~30 item
**Sesudah:**

```typescript
import { useProducts } from '../lib/queries/products'

export default function KatalogPage({ initialCategory = 'Semua Produk', onBack }: Props) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [search, setSearch] = useState('')

  const { data: products, isLoading } = useProducts({
    category: selectedCategory !== 'Semua Produk' ? selectedCategory : undefined,
    search: search || undefined,
  })

  if (isLoading) return <LoadingSkeleton />

  return (
    // ... render products array
  )
}
```

### `BestSellers.tsx`

**Sebelum:** Array statis
**Sesudah:** Fetch 6 produk terlaris berdasarkan jumlah order

```typescript
export function useBestSellers() {
  return useQuery({
    queryKey: ['best-sellers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, order_items(count)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(6)
      if (error) throw error
      return data
    },
    staleTime: 1000 * 60 * 10,
  })
}
```

### `PromoBanner.tsx`

**Sebelum:** 3 promo hardcoded
**Sesudah:**

```typescript
export function usePromos() {
  return useQuery({
    queryKey: ['promos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promos')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    staleTime: 1000 * 60 * 15,
  })
}
```

### `KoperasiTerpercaya.tsx` dan `KoperasiPage.tsx`

**Sebelum:** List koperasi dummy
**Sesudah:**

```typescript
export function useKoperasiList(limit?: number) {
  return useQuery({
    queryKey: ['koperasi', 'list', limit],
    queryFn: async () => {
      let query = supabase
        .from('koperasi')
        .select('*, owner:profiles(full_name, avatar_url)')
        .eq('is_verified', true)
        .order('rating', { ascending: false })
      if (limit) query = query.limit(limit)
      const { data, error } = await query
      if (error) throw error
      return data
    },
  })
}
```

---

## 3.3 Dashboard Components

### `DashboardPage.tsx` — Stats Overview

```typescript
export function useDashboardStats(userId: string, role: UserRole) {
  return useQuery({
    queryKey: ['dashboard-stats', userId, role],
    queryFn: async () => {
      if (role === 'petani' || role === 'koperasi') {
        const [orders, products, revenue] = await Promise.all([
          supabase.from('orders').select('id', { count: 'exact' }).eq('seller_id', userId),
          supabase.from('products').select('id', { count: 'exact' }).eq('seller_id', userId),
          supabase.from('orders')
            .select('total_amount')
            .eq('seller_id', userId)
            .eq('status', 'delivered'),
        ])
        const totalRevenue = revenue.data?.reduce((sum, o) => sum + o.total_amount, 0) ?? 0
        return {
          totalOrders: orders.count ?? 0,
          totalProducts: products.count ?? 0,
          totalRevenue,
        }
      }
      return null
    },
    enabled: !!userId,
  })
}
```

### `DashboardBrandOrders.tsx`

```typescript
export function useMyOrders(userId: string, as: 'buyer' | 'seller') {
  return useQuery({
    queryKey: ['orders', userId, as],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*, product:products(name, images)),
          buyer:profiles!buyer_id(full_name),
          seller:profiles!seller_id(full_name)
        `)
        .eq(as === 'buyer' ? 'buyer_id' : 'seller_id', userId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!userId,
  })
}
```

### `DashboardBrandStock.tsx`

```typescript
export function useMyProducts(sellerId: string) {
  return useQuery({
    queryKey: ['products', 'mine', sellerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!sellerId,
  })
}
```

### `DashboardKoperasiProfile.tsx`

```typescript
export function useMyKoperasi(ownerId: string) {
  return useQuery({
    queryKey: ['koperasi', 'mine', ownerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('koperasi')
        .select('*')
        .eq('owner_id', ownerId)
        .single()
      if (error && error.code !== 'PGRST116') throw error
      return data
    },
    enabled: !!ownerId,
  })
}
```

---

## 3.4 Komunitas (Posts & Comments)

### `KomunitasPage.tsx`

```typescript
export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:profiles(id, full_name, avatar_url, role),
          comments(count)
        `)
        .order('created_at', { ascending: false })
        .limit(20)
      if (error) throw error
      return data
    },
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({ title, content, tags }: { title: string; content: string; tags: string[] }) => {
      const { data, error } = await supabase
        .from('posts')
        .insert({ title, content, tags, author_id: user!.id })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  })
}
```

---

## 3.5 Shield Orders

### `DashboardShieldOrders.tsx`

```typescript
export function useMyShieldOrders(userId: string) {
  return useQuery({
    queryKey: ['shield-orders', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shield_orders')
        .select('*, product:shield_products(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!userId,
  })
}
```

---

## 3.6 Loading & Error States

Buat komponen reusable untuk konsistensi:

```
agrou/src/components/ui/
├── LoadingSkeleton.tsx
├── ErrorState.tsx
└── EmptyState.tsx
```

**`LoadingSkeleton.tsx`:**
```typescript
export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-48" />
      ))}
    </div>
  )
}
```

**`ErrorState.tsx`:**
```typescript
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="text-center py-8">
      <p className="text-red-500">{message}</p>
      {onRetry && <button onClick={onRetry}>Coba Lagi</button>}
    </div>
  )
}
```

---

## 3.7 Optimistic Updates

Untuk aksi yang sering dilakukan (like post, update stok), pakai optimistic update:

```typescript
export function useLikePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase.rpc('increment_post_likes', { post_id: postId })
      if (error) throw error
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] })
      const prev = queryClient.getQueryData(['posts'])
      queryClient.setQueryData(['posts'], (old: any[]) =>
        old?.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p)
      )
      return { prev }
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(['posts'], context?.prev)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  })
}
```

---

## Urutan Pengerjaan Phase 3

1. Buat folder `agrou/src/lib/queries/` dan semua query files
2. Buat komponen UI reusable (`LoadingSkeleton`, `ErrorState`, `EmptyState`)
3. Update komponen halaman utama: `KatalogPage`, `BestSellers`, `PromoBanner`, `KoperasiTerpercaya`
4. Update komponen koperasi: `KoperasiPage`, `KoperasiProfilePage`, `BrandPage`
5. Update dashboard components satu per satu
6. Update `KomunitasPage`
7. Update `ShieldPage` (produk asuransi)

---

## Checklist Phase 3

- [ ] Buat `agrou/src/lib/queries/products.ts`
- [ ] Buat `agrou/src/lib/queries/koperasi.ts`
- [ ] Buat `agrou/src/lib/queries/orders.ts`
- [ ] Buat `agrou/src/lib/queries/shield.ts`
- [ ] Buat `agrou/src/lib/queries/posts.ts`
- [ ] Buat `agrou/src/lib/queries/promos.ts`
- [ ] Buat `LoadingSkeleton`, `ErrorState`, `EmptyState` components
- [ ] Update `KatalogPage.tsx` — data real
- [ ] Update `BestSellers.tsx` — data real
- [ ] Update `PromoBanner.tsx` — data real
- [ ] Update `KoperasiTerpercaya.tsx` — data real
- [ ] Update `KoperasiPage.tsx` — data real
- [ ] Update `BrandPage.tsx` + `BrandModule.tsx` — data real
- [ ] Update `DashboardPage.tsx` — stats real
- [ ] Update `DashboardBrandOrders.tsx` — data real
- [ ] Update `DashboardBrandRevenue.tsx` — data real
- [ ] Update `DashboardBrandStock.tsx` — data real
- [ ] Update `DashboardShieldOrders.tsx` — data real
- [ ] Update `DashboardShieldStore.tsx` — data real
- [ ] Update `DashboardKoperasiProfile.tsx` — data real
- [ ] Update `DashboardMemberNeeds.tsx` — data real
- [ ] Update `KomunitasPage.tsx` — data real
- [ ] Update `ShieldPage.tsx` — produk asuransi real

## Deliverable Phase 3

Semua halaman menampilkan data real dari Supabase. Tidak ada lagi array hardcoded di komponen.
