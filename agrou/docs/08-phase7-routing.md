# Phase 7 — Routing & URL Navigation

> **Estimasi waktu:** 2–3 jam
> **Depends on:** Phase 1 (auth) selesai
> **Goal:** Ganti custom useState router dengan React Router v6, aktifkan URL-based navigation

---

## 7.1 Masalah dengan System Saat Ini

App saat ini pakai `useState` sebagai router:
```typescript
const [view, setView] = useState('app')
```

Konsekuensi:
- Tombol Back/Forward browser tidak berfungsi
- Tidak bisa bookmark halaman spesifik
- Tidak bisa share URL ke halaman tertentu
- Tidak ada URL history
- Deep linking ke halaman tidak mungkin

---

## 7.2 Install React Router

```bash
cd agrou
npm install react-router-dom@^6.30.0
```

---

## 7.3 Route Map

| View lama | Path baru | Protected? |
|---|---|---|
| `'app'` | `/` | No |
| `'katalog'` | `/katalog` | No |
| `'katalog'` + category | `/katalog?kategori=padi` | No |
| `'brand'` | `/brand` | No |
| `'shield'` | `/shield` | No |
| `'koperasi'` | `/koperasi` | No |
| `'profile'` | `/koperasi/:slug` | No |
| `'komunitas'` | `/komunitas` | No |
| `'ladangai'` | `/gro-ai` | No |
| `'about'` | `/tentang` | No |
| `'dashboard'` | `/dashboard` | Yes |
| `'login'` | `/masuk` | No (redirect jika sudah login) |
| `'register'` | `/daftar` | No (redirect jika sudah login) |

---

## 7.4 Implementasi Router

### Update `agrou/src/main.tsx`

```typescript
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
          <Toaster position="top-right" />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
```

### Update `agrou/src/App.tsx`

```typescript
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/masuk" replace />
  return <>{children}</>
}

// Auth Route: redirect ke dashboard jika sudah login
function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (user) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#0d1f15] font-sans">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/katalog" element={<KatalogPage />} />
        <Route path="/brand" element={<BrandPage />} />
        <Route path="/shield" element={<ShieldPage />} />
        <Route path="/koperasi" element={<KoperasiPage />} />
        <Route path="/koperasi/:slug" element={<KoperasiProfilePage />} />
        <Route path="/komunitas" element={<KomunitasPage />} />
        <Route path="/gro-ai" element={<GroAIPage />} />
        <Route path="/tentang" element={<AboutPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/masuk"
          element={
            <AuthRoute>
              <LoginPage />
            </AuthRoute>
          }
        />
        <Route
          path="/daftar"
          element={
            <AuthRoute>
              <RegisterPage />
            </AuthRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  )
}
```

---

## 7.5 Update Header Navigation

Ganti semua `onClick={() => handleViewChange('...')}` dengan React Router `<Link>`:

```typescript
import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const { user, signOut } = useAuth()
  const location = useLocation()

  const navLinks = [
    { label: 'Beranda', path: '/' },
    { label: 'Katalog', path: '/katalog' },
    { label: 'Agrou Brand', path: '/brand' },
    { label: 'Agrou Shield', path: '/shield' },
    { label: 'Koperasi', path: '/koperasi' },
    { label: 'Komunitas', path: '/komunitas' },
    { label: 'Gro AI', path: '/gro-ai' },
  ]

  return (
    <header>
      <nav>
        {navLinks.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={location.pathname === link.path ? 'active' : ''}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      {user ? (
        <div>
          <Link to="/dashboard">Dashboard</Link>
          <button onClick={signOut}>Keluar</button>
        </div>
      ) : (
        <Link to="/masuk">Masuk</Link>
      )}
    </header>
  )
}
```

---

## 7.6 Kategori Katalog via URL Query Params

Ganti `katalogCategory` state dengan URL search param:

```typescript
// Di KatalogPage.tsx
import { useSearchParams } from 'react-router-dom'

export default function KatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedCategory = searchParams.get('kategori') ?? 'Semua Produk'

  const handleCategoryChange = (category: string) => {
    if (category === 'Semua Produk') {
      setSearchParams({})
    } else {
      setSearchParams({ kategori: category })
    }
  }

  // ...
}
```

Ini memungkinkan user share link seperti: `/katalog?kategori=padi`

---

## 7.7 Programmatic Navigation

Ganti `handleViewChange('...')` dengan `useNavigate`:

```typescript
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()

// Contoh:
navigate('/dashboard')
navigate('/katalog?kategori=padi')
navigate(-1) // back
```

---

## 7.8 Scroll to Top on Route Change

```typescript
// agrou/src/components/ScrollToTop.tsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
```

Taruh di `App.tsx`:
```typescript
<BrowserRouter>
  <ScrollToTop />
  <App />
</BrowserRouter>
```

Ini menggantikan semua `useEffect` scroll-to-top yang ada di `App.tsx` saat ini.

---

## 7.9 Cloudflare Pages: Handle SPA Routing

Vite SPA di Cloudflare Pages perlu config agar semua path di-serve ke `index.html`:

Buat file `agrou/public/_redirects`:
```
/* /index.html 200
```

Atau buat `agrou/public/_headers` untuk tambahan security headers:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

## Checklist Phase 7

- [ ] Install `react-router-dom@^6`
- [ ] Wrap app dengan `BrowserRouter` di `main.tsx`
- [ ] Refactor `App.tsx` — ganti useState view dengan `<Routes>` + `<Route>`
- [ ] Buat `ProtectedRoute` wrapper component
- [ ] Buat `AuthRoute` wrapper component
- [ ] Update `Header.tsx` — ganti `onClick` dengan `<Link>`
- [ ] Buat `ScrollToTop.tsx` component
- [ ] Update `KatalogPage.tsx` — gunakan `useSearchParams` untuk kategori
- [ ] Ganti semua `handleViewChange` calls dengan `useNavigate`
- [ ] Buat `agrou/public/_redirects` untuk Cloudflare Pages
- [ ] Test: navigasi antar halaman — URL berubah
- [ ] Test: tombol Back/Forward browser berfungsi
- [ ] Test: refresh halaman di `/dashboard` → tetap di dashboard (tidak balik ke home)
- [ ] Test: akses `/dashboard` tanpa login → redirect ke `/masuk`

## Deliverable Phase 7

URL-based navigation berfungsi penuh. Browser back/forward bekerja. Halaman bisa di-bookmark dan di-share. Route protection via URL.
