# Phase 2 — Database Schema & Row Level Security

> **Estimasi waktu:** 3–4 jam
> **Depends on:** Phase 0 selesai
> **Goal:** Semua tabel dibuat, RLS aktif, types di-generate, data dummy diganti data real

---

## 2.1 Full Database Schema

Jalankan SQL ini di Supabase Dashboard → SQL Editor secara berurutan.

### Enums

```sql
CREATE TYPE user_role AS ENUM ('petani', 'koperasi', 'pembeli', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE shield_status AS ENUM ('draft', 'active', 'claimed', 'expired', 'rejected');
CREATE TYPE product_category AS ENUM ('padi', 'jagung', 'kedelai', 'sayuran', 'buah', 'perkebunan', 'peternakan', 'perikanan', 'lainnya');
```

### Tabel: profiles

```sql
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  avatar_url  TEXT,
  bio         TEXT,
  phone       TEXT,
  role        user_role NOT NULL DEFAULT 'pembeli',
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Tabel: koperasi

```sql
CREATE TABLE public.koperasi (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  description  TEXT,
  logo_url     TEXT,
  banner_url   TEXT,
  location     TEXT,
  province     TEXT,
  rating       NUMERIC(3,2) DEFAULT 0,
  member_count INTEGER DEFAULT 0,
  is_verified  BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Tabel: products

```sql
CREATE TABLE public.products (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  koperasi_id  UUID REFERENCES public.koperasi(id) ON DELETE SET NULL,
  seller_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  price        NUMERIC(15,2) NOT NULL,
  unit         TEXT NOT NULL DEFAULT 'kg',
  stock        INTEGER NOT NULL DEFAULT 0,
  min_order    INTEGER NOT NULL DEFAULT 1,
  category     product_category NOT NULL DEFAULT 'lainnya',
  images       TEXT[] DEFAULT '{}',
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Tabel: orders

```sql
CREATE TABLE public.orders (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id     UUID NOT NULL REFERENCES public.profiles(id),
  seller_id    UUID NOT NULL REFERENCES public.profiles(id),
  status       order_status NOT NULL DEFAULT 'pending',
  total_amount NUMERIC(15,2) NOT NULL,
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Tabel: order_items

```sql
CREATE TABLE public.order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES public.products(id),
  quantity    INTEGER NOT NULL,
  price       NUMERIC(15,2) NOT NULL,
  subtotal    NUMERIC(15,2) GENERATED ALWAYS AS (quantity * price) STORED,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Tabel: shield_products (Agrou Shield — produk asuransi)

```sql
CREATE TABLE public.shield_products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  description   TEXT,
  commodity     TEXT NOT NULL,
  coverage_area TEXT,
  premium       NUMERIC(15,2) NOT NULL,
  coverage      NUMERIC(15,2) NOT NULL,
  duration_days INTEGER NOT NULL DEFAULT 90,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Tabel: shield_orders (pembelian asuransi)

```sql
CREATE TABLE public.shield_orders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id),
  shield_product_id UUID NOT NULL REFERENCES public.shield_products(id),
  status            shield_status NOT NULL DEFAULT 'active',
  lahan_ha          NUMERIC(10,2) NOT NULL,
  total_premium     NUMERIC(15,2) NOT NULL,
  start_date        DATE NOT NULL,
  end_date          DATE NOT NULL,
  claim_notes       TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Tabel: promos

```sql
CREATE TABLE public.promos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  image_url   TEXT,
  link_view   TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  starts_at   TIMESTAMPTZ,
  ends_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Tabel: posts (Komunitas)

```sql
CREATE TABLE public.posts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id  UUID NOT NULL REFERENCES public.profiles(id),
  title      TEXT NOT NULL,
  content    TEXT NOT NULL,
  tags       TEXT[] DEFAULT '{}',
  likes      INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Tabel: comments

```sql
CREATE TABLE public.comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id  UUID NOT NULL REFERENCES public.profiles(id),
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Tabel: member_needs (kebutuhan anggota koperasi)

```sql
CREATE TABLE public.member_needs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  koperasi_id UUID NOT NULL REFERENCES public.koperasi(id) ON DELETE CASCADE,
  member_id   UUID NOT NULL REFERENCES public.profiles(id),
  title       TEXT NOT NULL,
  description TEXT,
  quantity    INTEGER,
  unit        TEXT,
  status      TEXT NOT NULL DEFAULT 'open',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 2.2 Indexes untuk Performance

```sql
-- Products
CREATE INDEX idx_products_seller ON public.products(seller_id);
CREATE INDEX idx_products_koperasi ON public.products(koperasi_id);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_active ON public.products(is_active) WHERE is_active = true;

-- Orders
CREATE INDEX idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX idx_orders_seller ON public.orders(seller_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created ON public.orders(created_at DESC);

-- Posts
CREATE INDEX idx_posts_author ON public.posts(author_id);
CREATE INDEX idx_posts_created ON public.posts(created_at DESC);

-- Comments
CREATE INDEX idx_comments_post ON public.comments(post_id);

-- Koperasi
CREATE INDEX idx_koperasi_owner ON public.koperasi(owner_id);
CREATE INDEX idx_koperasi_province ON public.koperasi(province);
```

---

## 2.3 Trigger: Auto-Update `updated_at`

```sql
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply ke semua tabel yang punya updated_at
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_koperasi_updated_at
  BEFORE UPDATE ON public.koperasi
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_shield_orders_updated_at
  BEFORE UPDATE ON public.shield_orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
```

---

## 2.4 Trigger: Auto-Create Profile saat Register

```sql
-- (Dari Phase 1 — pastikan sudah dijalankan setelah tabel profiles dibuat)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User Baru'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'pembeli')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 2.5 Row Level Security (RLS)

Aktifkan RLS di semua tabel, lalu buat policies.

```sql
-- Aktifkan RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.koperasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shield_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shield_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_needs ENABLE ROW LEVEL SECURITY;
```

### Policies: profiles

```sql
-- Semua orang bisa lihat profil
CREATE POLICY "profiles: public read"
  ON public.profiles FOR SELECT USING (true);

-- User hanya bisa update profil sendiri
CREATE POLICY "profiles: owner update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
```

### Policies: products

```sql
-- Semua orang bisa lihat produk aktif
CREATE POLICY "products: public read active"
  ON public.products FOR SELECT
  USING (is_active = true);

-- Seller bisa lihat semua produknya sendiri (termasuk yang tidak aktif)
CREATE POLICY "products: seller read own"
  ON public.products FOR SELECT
  USING (auth.uid() = seller_id);

-- Seller bisa insert produk sendiri
CREATE POLICY "products: seller insert"
  ON public.products FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

-- Seller bisa update produk sendiri
CREATE POLICY "products: seller update"
  ON public.products FOR UPDATE
  USING (auth.uid() = seller_id);

-- Seller bisa delete produk sendiri
CREATE POLICY "products: seller delete"
  ON public.products FOR DELETE
  USING (auth.uid() = seller_id);
```

### Policies: orders

```sql
-- Buyer dan seller bisa lihat order mereka
CREATE POLICY "orders: participant read"
  ON public.orders FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Buyer bisa buat order
CREATE POLICY "orders: buyer insert"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

-- Buyer dan seller bisa update status order mereka
CREATE POLICY "orders: participant update"
  ON public.orders FOR UPDATE
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
```

### Policies: order_items

```sql
-- Bisa lihat order items jika bisa lihat ordernya
CREATE POLICY "order_items: participant read"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND (orders.buyer_id = auth.uid() OR orders.seller_id = auth.uid())
    )
  );

CREATE POLICY "order_items: buyer insert"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.buyer_id = auth.uid()
    )
  );
```

### Policies: shield

```sql
-- Shield products: semua bisa lihat yang aktif
CREATE POLICY "shield_products: public read"
  ON public.shield_products FOR SELECT
  USING (is_active = true);

-- Shield orders: user hanya lihat miliknya
CREATE POLICY "shield_orders: owner read"
  ON public.shield_orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "shield_orders: owner insert"
  ON public.shield_orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Policies: komunitas

```sql
-- Posts: semua bisa baca
CREATE POLICY "posts: public read" ON public.posts FOR SELECT USING (true);
CREATE POLICY "posts: auth insert" ON public.posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "posts: owner update" ON public.posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "posts: owner delete" ON public.posts FOR DELETE USING (auth.uid() = author_id);

-- Comments: semua bisa baca
CREATE POLICY "comments: public read" ON public.comments FOR SELECT USING (true);
CREATE POLICY "comments: auth insert" ON public.comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "comments: owner delete" ON public.comments FOR DELETE USING (auth.uid() = author_id);
```

### Policies: koperasi & promos

```sql
-- Koperasi: semua bisa lihat
CREATE POLICY "koperasi: public read" ON public.koperasi FOR SELECT USING (true);
CREATE POLICY "koperasi: owner manage"
  ON public.koperasi FOR ALL USING (auth.uid() = owner_id);

-- Promos: semua bisa lihat yang aktif
CREATE POLICY "promos: public read"
  ON public.promos FOR SELECT USING (is_active = true);
```

---

## 2.6 Generate TypeScript Types

Setelah semua tabel dan RLS dibuat, generate types otomatis dari Supabase CLI:

```bash
# Install Supabase CLI jika belum ada
npm install -g supabase

# Login
supabase login

# Generate types
supabase gen types typescript --project-id YOUR_PROJECT_ID > agrou/src/lib/database.types.ts
```

Atau via Supabase Dashboard → API → TypeScript Types → copy dan paste ke `agrou/src/lib/database.types.ts`.

---

## 2.7 Seed Data Awal

Jalankan SQL ini untuk data awal agar app tidak kosong:

```sql
-- Seed shield products
INSERT INTO public.shield_products (name, description, commodity, premium, coverage, duration_days)
VALUES
  ('Proteksi Padi Dasar', 'Perlindungan untuk sawah padi dari bencana alam', 'Padi', 150000, 5000000, 90),
  ('Proteksi Padi Premium', 'Perlindungan lengkap termasuk serangan hama', 'Padi', 300000, 12000000, 120),
  ('Proteksi Jagung', 'Perlindungan untuk ladang jagung', 'Jagung', 120000, 4000000, 90),
  ('Proteksi Kedelai', 'Perlindungan untuk kebun kedelai', 'Kedelai', 100000, 3500000, 90),
  ('Proteksi Nelayan', 'Perlindungan hasil tangkap nelayan', 'Perikanan', 200000, 8000000, 30);

-- Seed promos
INSERT INTO public.promos (title, description, image_url, is_active)
VALUES
  ('Koperasi Aceh Segar', 'Produk segar langsung dari petani Aceh', '/assets/promo-koperasi-aceh.jpg', true),
  ('Nelayan Segar', 'Ikan segar hasil tangkapan hari ini', '/assets/promo-nelayan-segar.jpg', true),
  ('Proteksi Padi', 'Lindungi sawahmu dengan harga terjangkau', '/assets/promo-proteksi-padi.jpg', true);
```

---

## Checklist Phase 2

- [ ] Jalankan SQL: enums
- [ ] Jalankan SQL: semua tabel (profiles, koperasi, products, orders, order_items, shield_products, shield_orders, promos, posts, comments, member_needs)
- [ ] Jalankan SQL: indexes
- [ ] Jalankan SQL: trigger `set_updated_at`
- [ ] Jalankan SQL: trigger `handle_new_user`
- [ ] Aktifkan RLS di semua tabel
- [ ] Jalankan SQL: semua policies
- [ ] Generate TypeScript types ke `agrou/src/lib/database.types.ts`
- [ ] Jalankan seed data
- [ ] Test: register user baru → profil otomatis terbuat di tabel `profiles`
- [ ] Test: query produk sebagai anonymous → hanya dapat produk yang `is_active = true`
- [ ] Test: insert produk sebagai user lain → harus ditolak oleh RLS

## Deliverable Phase 2

Database schema lengkap, RLS aktif dan aman, TypeScript types tersedia, seed data awal ada.
