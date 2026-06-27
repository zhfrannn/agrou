-- ============================================================
-- AGROU — Full Database Schema
-- Phase 0–8 complete migration
-- Run this ONCE on a fresh Supabase project
-- ============================================================

-- ============================================================
-- 1. ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('petani', 'koperasi', 'pembeli', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE shield_status AS ENUM ('draft', 'active', 'claimed', 'expired', 'rejected');
CREATE TYPE product_category AS ENUM ('padi', 'jagung', 'kedelai', 'sayuran', 'buah', 'perkebunan', 'peternakan', 'perikanan', 'lainnya');

-- ============================================================
-- 2. TABLES
-- ============================================================

-- profiles (auto-created on auth.users insert via trigger)
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

-- koperasi
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

-- products
CREATE TABLE public.products (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  koperasi_id  UUID REFERENCES public.koperasi(id) ON DELETE SET NULL,
  seller_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  price        NUMERIC(15,2) NOT NULL,
  original_price NUMERIC(15,2),
  unit         TEXT NOT NULL DEFAULT 'kg',
  stock        INTEGER NOT NULL DEFAULT 0,
  min_order    INTEGER NOT NULL DEFAULT 1,
  category     product_category NOT NULL DEFAULT 'lainnya',
  images       TEXT[] DEFAULT '{}',
  tags         TEXT[] DEFAULT '{}',
  rating       NUMERIC(3,2) DEFAULT 0,
  sold_count   INTEGER DEFAULT 0,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- orders
CREATE TABLE public.orders (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  koperasi_id  UUID REFERENCES public.koperasi(id) ON DELETE SET NULL,
  status       order_status NOT NULL DEFAULT 'pending',
  total_amount NUMERIC(15,2) NOT NULL,
  shipping_address TEXT,
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- order_items
CREATE TABLE public.order_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  qty        INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(15,2) NOT NULL,
  subtotal   NUMERIC(15,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- shield_products (asuransi)
CREATE TABLE public.shield_products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  price       NUMERIC(15,2) NOT NULL,
  coverage    NUMERIC(15,2) NOT NULL,
  duration_days INTEGER NOT NULL DEFAULT 90,
  crop_type   TEXT,
  image_url   TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- shield_orders (pembelian asuransi)
CREATE TABLE public.shield_orders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  shield_product_id UUID NOT NULL REFERENCES public.shield_products(id) ON DELETE RESTRICT,
  status            shield_status NOT NULL DEFAULT 'active',
  land_area         NUMERIC(10,2),
  location          TEXT,
  start_date        DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date          DATE,
  claim_reason      TEXT,
  claim_amount      NUMERIC(15,2),
  tracking_number   TEXT,
  amount_paid       NUMERIC(15,2) NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- promos
CREATE TABLE public.promos (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  description TEXT,
  image_url  TEXT,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  starts_at  TIMESTAMPTZ DEFAULT NOW(),
  ends_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- posts (komunitas)
CREATE TABLE public.posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  koperasi_id UUID REFERENCES public.koperasi(id) ON DELETE SET NULL,
  title       TEXT,
  content     TEXT NOT NULL,
  type        TEXT NOT NULL DEFAULT 'post', -- 'post', 'offer', 'request', 'education', 'circular'
  tags        TEXT[] DEFAULT '{}',
  images      TEXT[] DEFAULT '{}',
  view_count  INTEGER DEFAULT 0,
  like_count  INTEGER DEFAULT 0,
  is_pinned   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- comments
CREATE TABLE public.comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- member_needs (kebutuhan anggota koperasi)
CREATE TABLE public.member_needs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  koperasi_id UUID NOT NULL REFERENCES public.koperasi(id) ON DELETE CASCADE,
  member_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  category    TEXT,
  quantity    NUMERIC(15,2),
  unit        TEXT DEFAULT 'kg',
  is_fulfilled BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. INDEXES
-- ============================================================

-- Products
CREATE INDEX idx_products_seller    ON public.products(seller_id);
CREATE INDEX idx_products_koperasi  ON public.products(koperasi_id);
CREATE INDEX idx_products_category  ON public.products(category);
CREATE INDEX idx_products_active    ON public.products(is_active);

-- Orders
CREATE INDEX idx_orders_buyer       ON public.orders(buyer_id);
CREATE INDEX idx_orders_seller      ON public.orders(seller_id);
CREATE INDEX idx_orders_status      ON public.orders(status);
CREATE INDEX idx_orders_created     ON public.orders(created_at DESC);

-- Posts
CREATE INDEX idx_posts_author       ON public.posts(author_id);
CREATE INDEX idx_posts_created      ON public.posts(created_at DESC);
CREATE INDEX idx_posts_type         ON public.posts(type);

-- Comments
CREATE INDEX idx_comments_post      ON public.comments(post_id);

-- Koperasi
CREATE INDEX idx_koperasi_owner     ON public.koperasi(owner_id);
CREATE INDEX idx_koperasi_province  ON public.koperasi(province);
CREATE INDEX idx_koperasi_slug      ON public.koperasi(slug);

-- Shield
CREATE INDEX idx_shield_orders_user ON public.shield_orders(user_id);

-- ============================================================
-- 4. TRIGGER: auto-update updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

CREATE TRIGGER trg_shield_products_updated_at
  BEFORE UPDATE ON public.shield_products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_member_needs_updated_at
  BEFORE UPDATE ON public.member_needs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 5. TRIGGER: auto-create profile on auth.users insert
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'pembeli')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 6. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.koperasi        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shield_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shield_orders   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promos          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_needs    ENABLE ROW LEVEL SECURITY;

-- ---- profiles ----
CREATE POLICY "profiles: public read"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "profiles: owner update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "profiles: owner insert"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ---- koperasi ----
CREATE POLICY "koperasi: public read"
  ON public.koperasi FOR SELECT USING (true);

CREATE POLICY "koperasi: owner insert"
  ON public.koperasi FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "koperasi: owner update"
  ON public.koperasi FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "koperasi: owner delete"
  ON public.koperasi FOR DELETE
  USING (auth.uid() = owner_id);

-- ---- products ----
CREATE POLICY "products: public read active"
  ON public.products FOR SELECT
  USING (is_active = true);

CREATE POLICY "products: seller read own"
  ON public.products FOR SELECT
  USING (auth.uid() = seller_id);

CREATE POLICY "products: seller insert"
  ON public.products FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "products: seller update"
  ON public.products FOR UPDATE
  USING (auth.uid() = seller_id);

CREATE POLICY "products: seller delete"
  ON public.products FOR DELETE
  USING (auth.uid() = seller_id);

-- ---- orders ----
CREATE POLICY "orders: buyer read own"
  ON public.orders FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "orders: buyer insert"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "orders: seller update status"
  ON public.orders FOR UPDATE
  USING (auth.uid() = seller_id OR auth.uid() = buyer_id);

-- ---- order_items ----
CREATE POLICY "order_items: participant read"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id
        AND (o.buyer_id = auth.uid() OR o.seller_id = auth.uid())
    )
  );

CREATE POLICY "order_items: buyer insert"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.buyer_id = auth.uid()
    )
  );

-- ---- shield_products ----
CREATE POLICY "shield_products: public read"
  ON public.shield_products FOR SELECT USING (is_active = true);

-- ---- shield_orders ----
CREATE POLICY "shield_orders: owner read"
  ON public.shield_orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "shield_orders: auth insert"
  ON public.shield_orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "shield_orders: owner update"
  ON public.shield_orders FOR UPDATE
  USING (auth.uid() = user_id);

-- ---- promos ----
CREATE POLICY "promos: public read active"
  ON public.promos FOR SELECT
  USING (is_active = true);

-- ---- posts ----
CREATE POLICY "posts: public read"
  ON public.posts FOR SELECT USING (true);

CREATE POLICY "posts: auth insert"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "posts: author update"
  ON public.posts FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "posts: author delete"
  ON public.posts FOR DELETE
  USING (auth.uid() = author_id);

-- ---- comments ----
CREATE POLICY "comments: public read"
  ON public.comments FOR SELECT USING (true);

CREATE POLICY "comments: auth insert"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "comments: author update"
  ON public.comments FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "comments: author delete"
  ON public.comments FOR DELETE
  USING (auth.uid() = author_id);

-- ---- member_needs ----
CREATE POLICY "member_needs: koperasi read"
  ON public.member_needs FOR SELECT
  USING (
    auth.uid() = member_id
    OR EXISTS (
      SELECT 1 FROM public.koperasi k
      WHERE k.id = koperasi_id AND k.owner_id = auth.uid()
    )
  );

CREATE POLICY "member_needs: member insert"
  ON public.member_needs FOR INSERT
  WITH CHECK (auth.uid() = member_id);

CREATE POLICY "member_needs: member update"
  ON public.member_needs FOR UPDATE
  USING (auth.uid() = member_id);

-- ============================================================
-- 7. STORAGE BUCKETS (policies — buckets created via dashboard)
-- ============================================================

-- avatars
CREATE POLICY "avatars: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars: auth upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars: owner update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- products
CREATE POLICY "products storage: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

CREATE POLICY "products storage: auth upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'products'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "products storage: owner delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'products'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- koperasi
CREATE POLICY "koperasi storage: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'koperasi');

CREATE POLICY "koperasi storage: auth upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'koperasi'
    AND auth.role() = 'authenticated'
  );

-- promos
CREATE POLICY "promos storage: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'promos');

-- ============================================================
-- 8. REALTIME PUBLICATIONS
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
