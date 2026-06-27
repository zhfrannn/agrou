# Phase 6 — Realtime Features

> **Estimasi waktu:** 2–3 jam
> **Depends on:** Phase 2 (database) + Phase 3 (data integration) selesai
> **Goal:** Dashboard stats dan order status update real-time tanpa refresh halaman

---

## 6.1 Fitur yang Butuh Realtime

Tidak semua fitur perlu realtime. Prioritaskan yang paling terasa manfaatnya:

| Fitur | Tabel | Priority |
|---|---|---|
| Notifikasi order baru (seller) | `orders` | HIGH |
| Update status order (buyer) | `orders` | HIGH |
| Counter stats dashboard | `orders`, `products` | MEDIUM |
| Post/komentar baru di komunitas | `posts`, `comments` | MEDIUM |
| Status klaim asuransi | `shield_orders` | LOW |

---

## 6.2 Enable Realtime di Supabase

Di Supabase Dashboard → Database → Replication:
- Aktifkan tabel `orders` untuk realtime
- Aktifkan tabel `posts` dan `comments` untuk realtime

Atau via SQL:

```sql
-- Enable realtime untuk tabel orders
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
```

---

## 6.3 Hook: useRealtimeOrders

Buat `agrou/src/hooks/useRealtimeOrders.ts`:

```typescript
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import toast from 'react-hot-toast'

export function useRealtimeOrders() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel(`orders:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: `seller_id=eq.${user.id}`,
        },
        (payload) => {
          // Order baru masuk sebagai seller
          toast.success('Order baru masuk!', { icon: '🛒' })
          queryClient.invalidateQueries({ queryKey: ['orders', user.id, 'seller'] })
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats', user.id] })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `buyer_id=eq.${user.id}`,
        },
        (payload) => {
          // Status order berubah sebagai buyer
          const newStatus = payload.new.status
          const statusLabel: Record<string, string> = {
            confirmed: 'dikonfirmasi',
            processing: 'sedang diproses',
            shipped: 'dikirim',
            delivered: 'sudah diterima',
            cancelled: 'dibatalkan',
          }
          if (statusLabel[newStatus]) {
            toast(`Pesananmu ${statusLabel[newStatus]}`, { icon: '📦' })
          }
          queryClient.invalidateQueries({ queryKey: ['orders', user.id, 'buyer'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id, queryClient])
}
```

---

## 6.4 Hook: useRealtimePosts

```typescript
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useRealtimePosts() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel('posts:public')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['posts'] })
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['posts'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])
}
```

---

## 6.5 Integrasi di Komponen

### Di `DashboardPage.tsx`

```typescript
import { useRealtimeOrders } from '../hooks/useRealtimeOrders'

export default function DashboardPage({ onBack }: Props) {
  // Aktifkan realtime subscription
  useRealtimeOrders()

  // ... rest of component
}
```

### Di `KomunitasPage.tsx`

```typescript
import { useRealtimePosts } from '../hooks/useRealtimePosts'

export default function KomunitasPage({ onBack }: Props) {
  useRealtimePosts()

  // ... rest of component
}
```

---

## 6.6 Notifikasi Badge di Header

Tambahkan badge notifikasi di Header untuk order baru yang belum dibaca:

```typescript
// agrou/src/hooks/useUnreadOrders.ts
export function useUnreadOrders() {
  const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel(`unread:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: `seller_id=eq.${user.id}`,
        },
        () => setUnreadCount(c => c + 1)
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [user?.id])

  const clearUnread = () => setUnreadCount(0)

  return { unreadCount, clearUnread }
}
```

Di `Header.tsx`:
```typescript
const { unreadCount, clearUnread } = useUnreadOrders()

// Di tombol Dashboard:
<button onClick={() => { clearUnread(); handleViewChange('dashboard') }}>
  Dashboard
  {unreadCount > 0 && (
    <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
      {unreadCount}
    </span>
  )}
</button>
```

---

## 6.7 Cleanup: Hindari Memory Leak

Semua channel Supabase harus di-cleanup di `useEffect` return function — sudah dilakukan di contoh di atas. Pastikan pattern ini konsisten di semua realtime hooks.

Untuk verifikasi tidak ada channel yang leak:
```typescript
// Di browser console:
// supabase.getChannels() -- harus return array kosong setelah unmount
```

---

## Checklist Phase 6

- [ ] Enable realtime di Supabase untuk tabel `orders`, `posts`, `comments`
- [ ] Buat `agrou/src/hooks/useRealtimeOrders.ts`
- [ ] Buat `agrou/src/hooks/useRealtimePosts.ts`
- [ ] Buat `agrou/src/hooks/useUnreadOrders.ts`
- [ ] Integrasi `useRealtimeOrders` di `DashboardPage.tsx`
- [ ] Integrasi `useRealtimePosts` di `KomunitasPage.tsx`
- [ ] Tambahkan badge notifikasi di `Header.tsx`
- [ ] Test: buka dua tab browser, buat order di tab 1 → dashboard di tab 2 update otomatis
- [ ] Test: tidak ada channel leak setelah navigasi antar halaman

## Deliverable Phase 6

Order baru muncul real-time di dashboard seller. Status order update real-time di sisi buyer. Post komunitas baru langsung muncul tanpa refresh.
