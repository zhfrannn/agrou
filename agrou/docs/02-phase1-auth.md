# Phase 1 — Authentication System

> **Estimasi waktu:** 3–4 jam
> **Depends on:** Phase 0 selesai
> **Goal:** Login, register, logout, session persistence, auth state di seluruh app, route protection

---

## 1.1 User Roles

Agrou punya 3 role utama berdasarkan komponen yang ada:

| Role | Deskripsi | Dashboard yang Diakses |
|---|---|---|
| `petani` | Petani/produsen yang jual produk | DashboardBrandStock, DashboardBrandOrders, DashboardBrandRevenue |
| `koperasi` | Admin koperasi/KUD | DashboardKoperasiProfile, DashboardMemberNeeds |
| `pembeli` | Buyer/konsumen | Katalog, order history |
| `admin` | Super admin platform | Semua akses |

Role ini disimpan di tabel `profiles`, bukan di `auth.users`.

---

## 1.2 Supabase Auth Config

Di Supabase Dashboard → Authentication → Settings:

```
Site URL: http://localhost:3000 (dev)
Redirect URLs:
  - http://localhost:3000
  - https://agrou.pages.dev (production Cloudflare Pages)

Email confirmations: Enabled
Password min length: 8
```

---

## 1.3 AuthContext & useAuth Hook

Buat `agrou/src/hooks/useAuth.tsx` (adaptasi dari `src/hooks/useAuth.tsx` yang sudah ada di root):

```typescript
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: string | null }>
}

export type UserRole = 'petani' | 'koperasi' | 'pembeli' | 'admin'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: UserRole
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    })
    return { error: error?.message ?? null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error: error?.message ?? null }
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

---

## 1.4 Wrap App dengan AuthProvider

Edit `agrou/src/main.tsx`:

```typescript
import { AuthProvider } from './hooks/useAuth'

// Wrap App:
<QueryClientProvider client={queryClient}>
  <AuthProvider>
    <App />
    <Toaster position="top-right" />
  </AuthProvider>
</QueryClientProvider>
```

---

## 1.5 Buat Hook useProfile

Buat `agrou/src/hooks/useProfile.ts` untuk fetch data profil user:

```typescript
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useProfile() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!user,
  })
}
```

---

## 1.6 Update Header untuk Auth State

`Header.tsx` saat ini tidak tahu apakah user sudah login. Update untuk:
- Tampilkan nama user + avatar jika sudah login
- Tampilkan tombol "Masuk" jika belum login
- Tombol logout
- Badge role user

```typescript
// Tambahkan di Header.tsx
import { useAuth } from '../hooks/useAuth'

const { user, signOut, loading } = useAuth()

// Conditional rendering:
{user ? (
  <div className="flex items-center gap-2">
    <span>{user.user_metadata.full_name}</span>
    <button onClick={signOut}>Keluar</button>
  </div>
) : (
  <button onClick={() => handleViewChange('login')}>Masuk</button>
)}
```

---

## 1.7 Halaman Login & Register

Buat `agrou/src/components/LoginPage.tsx`:

```typescript
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

interface LoginPageProps {
  onSuccess: () => void
  onGoToRegister: () => void
}

export default function LoginPage({ onSuccess, onGoToRegister }: LoginPageProps) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)

    if (error) {
      toast.error(error)
    } else {
      toast.success('Berhasil masuk!')
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* UI mengikuti design system yang ada */}
    </form>
  )
}
```

Buat `agrou/src/components/RegisterPage.tsx` dengan field tambahan:
- Nama lengkap
- Email
- Password + konfirmasi
- Role selector: Petani / Koperasi / Pembeli

---

## 1.8 Auth Guard untuk Dashboard

Update `App.tsx` untuk proteksi halaman dashboard:

```typescript
import { useAuth } from './hooks/useAuth'

// Di dalam App component:
const { user, loading } = useAuth()

// Guard sebelum render dashboard:
if (view === 'dashboard') {
  if (loading) return <LoadingScreen />
  if (!user) {
    // Redirect ke login
    handleViewChange('login')
    return null
  }
  return <DashboardPage onBack={() => handleViewChange('app')} />
}
```

---

## 1.9 Auto-Trigger Profile Creation (Database Trigger)

Di Supabase SQL Editor, buat trigger yang otomatis buat profil saat user register:

```sql
-- Function: auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'pembeli'),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

> Trigger ini dijalankan di Phase 2 setelah tabel `profiles` dibuat.

---

## 1.10 Tambahkan View ke App.tsx

Tambahkan 2 view baru: `'login'` dan `'register'`:

```typescript
type View = 'app' | 'shield' | 'brand' | 'dashboard' | 'koperasi' |
            'profile' | 'about' | 'katalog' | 'ladangai' | 'komunitas' |
            'login' | 'register'  // <-- tambahkan ini
```

---

## Checklist Phase 1

- [ ] Buat `agrou/src/hooks/useAuth.tsx`
- [ ] Tambahkan `AuthProvider` ke `main.tsx`
- [ ] Buat `agrou/src/hooks/useProfile.ts`
- [ ] Update `Header.tsx` untuk tampilkan auth state
- [ ] Buat `LoginPage.tsx` yang fungsional
- [ ] Buat `RegisterPage.tsx` dengan role selector
- [ ] Tambahkan view `'login'` dan `'register'` ke `App.tsx`
- [ ] Tambahkan auth guard untuk view `'dashboard'`
- [ ] Test: register user baru → cek di Supabase Dashboard → Authentication → Users
- [ ] Test: login → user state muncul di Header
- [ ] Test: logout → kembali ke state unauthenticated
- [ ] Test: akses dashboard tanpa login → redirect ke login

## Deliverable Phase 1

User bisa register, login, logout. Session persistent (reload halaman tetap login). Dashboard tidak bisa diakses tanpa login.
