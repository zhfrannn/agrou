-- ============================================================
-- AGROU — Complete Production Schema
-- Paste seluruh file ini ke Supabase SQL Editor lalu klik Run
-- https://supabase.com/dashboard/project/hodtuvbkrshvtjesacab/sql/new
-- ============================================================

-- ============================================================
-- 0. CLEANUP (aman di-run ulang)
-- ============================================================
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.cart_items CASCADE;
DROP TABLE IF EXISTS public.wishlists CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.komunitas_posts CASCADE;
DROP TABLE IF EXISTS public.member_needs CASCADE;
DROP TABLE IF EXISTS public.shield_orders CASCADE;
DROP TABLE IF EXISTS public.shield_products CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.koperasi CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS shield_status CASCADE;
DROP TYPE IF EXISTS product_category CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;

-- ============================================================
-- 1. ENUMS
-- ============================================================
CREATE TYPE user_role AS ENUM ('petani', 'koperasi', 'pembeli', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE shield_status AS ENUM ('draft', 'active', 'claimed', 'expired', 'rejected');
CREATE TYPE product_category AS ENUM ('padi', 'jagung', 'kedelai', 'sayuran', 'buah', 'perkebunan', 'peternakan', 'perikanan', 'lainnya');
CREATE TYPE notification_type AS ENUM ('order', 'shield', 'system', 'promo', 'member');

-- ============================================================
-- 2. TABLES
-- ============================================================

CREATE TABLE public.profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name    TEXT NOT NULL,
  avatar_url   TEXT,
  bio          TEXT,
  phone        TEXT,
  address      TEXT,
  province     TEXT,
  role         user_role NOT NULL DEFAULT 'pembeli',
  is_verified  BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.koperasi (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  description      TEXT,
  logo_url         TEXT,
  banner_url       TEXT,
  location         TEXT,
  province         TEXT,
  website          TEXT,
  email            TEXT,
  phone            TEXT,
  established_year INTEGER,
  komoditas        TEXT[] DEFAULT '{}',
  rating           NUMERIC(3,2) DEFAULT 0,
  member_count     INTEGER DEFAULT 0,
  total_products   INTEGER DEFAULT 0,
  total_orders     INTEGER DEFAULT 0,
  total_revenue    NUMERIC(15,2) DEFAULT 0,
  is_verified      BOOLEAN NOT NULL DEFAULT false,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.products (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  koperasi_id    UUID REFERENCES public.koperasi(id) ON DELETE SET NULL,
  seller_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  description    TEXT,
  price          NUMERIC(15,2) NOT NULL,
  original_price NUMERIC(15,2),
  unit           TEXT NOT NULL DEFAULT 'kg',
  stock          INTEGER NOT NULL DEFAULT 0,
  min_order      INTEGER NOT NULL DEFAULT 1,
  category       product_category NOT NULL DEFAULT 'lainnya',
  images         TEXT[] DEFAULT '{}',
  tags           TEXT[] DEFAULT '{}',
  rating         NUMERIC(3,2) DEFAULT 0,
  sold_count     INTEGER DEFAULT 0,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  koperasi_id      UUID REFERENCES public.koperasi(id) ON DELETE SET NULL,
  status           order_status NOT NULL DEFAULT 'pending',
  total_amount     NUMERIC(15,2) NOT NULL,
  shipping_address TEXT,
  shipping_cost    NUMERIC(15,2) DEFAULT 0,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.order_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  qty        INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(15,2) NOT NULL,
  subtotal   NUMERIC(15,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.shield_products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  description   TEXT,
  price         NUMERIC(15,2) NOT NULL,
  coverage      NUMERIC(15,2) NOT NULL,
  duration_days INTEGER NOT NULL DEFAULT 90,
  crop_type     TEXT,
  commodity     TEXT,
  premium       NUMERIC(15,2),
  image_url     TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.shield_orders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  shield_product_id UUID NOT NULL REFERENCES public.shield_products(id) ON DELETE RESTRICT,
  status            shield_status NOT NULL DEFAULT 'active',
  land_area         NUMERIC(10,2),
  location          TEXT,
  start_date        DATE,
  end_date          DATE,
  claim_reason      TEXT,
  total_premium     NUMERIC(15,2),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.member_needs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  koperasi_id  UUID NOT NULL REFERENCES public.koperasi(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  category     product_category NOT NULL DEFAULT 'lainnya',
  quantity     NUMERIC(10,2) NOT NULL,
  unit         TEXT NOT NULL DEFAULT 'kg',
  target_price NUMERIC(15,2),
  deadline     DATE,
  is_fulfilled BOOLEAN NOT NULL DEFAULT false,
  status       TEXT NOT NULL DEFAULT 'open',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.cart_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  qty        INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE TABLE public.wishlists (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE TABLE public.reviews (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  order_id   UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment    TEXT,
  images     TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE TABLE public.notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type       notification_type NOT NULL DEFAULT 'system',
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  data       JSONB DEFAULT '{}',
  is_read    BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.komunitas_posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  image_url   TEXT,
  likes_count INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. INDEXES
-- ============================================================
CREATE INDEX idx_koperasi_owner    ON public.koperasi(owner_id);
CREATE INDEX idx_koperasi_slug     ON public.koperasi(slug);
CREATE INDEX idx_products_seller   ON public.products(seller_id);
CREATE INDEX idx_products_koperasi ON public.products(koperasi_id);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_active   ON public.products(is_active);
CREATE INDEX idx_orders_buyer      ON public.orders(buyer_id);
CREATE INDEX idx_orders_seller     ON public.orders(seller_id);
CREATE INDEX idx_orders_koperasi   ON public.orders(koperasi_id);
CREATE INDEX idx_orders_status     ON public.orders(status);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);
CREATE INDEX idx_shield_orders_user ON public.shield_orders(user_id);
CREATE INDEX idx_member_needs_kop  ON public.member_needs(koperasi_id);
CREATE INDEX idx_cart_user         ON public.cart_items(user_id);
CREATE INDEX idx_wishlists_user    ON public.wishlists(user_id);
CREATE INDEX idx_notif_user        ON public.notifications(user_id);
CREATE INDEX idx_notif_unread      ON public.notifications(user_id, is_read);

-- ============================================================
-- 4. UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated_at    BEFORE UPDATE ON public.profiles    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_koperasi_updated_at    BEFORE UPDATE ON public.koperasi    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_products_updated_at    BEFORE UPDATE ON public.products    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_orders_updated_at      BEFORE UPDATE ON public.orders      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_sp_updated_at          BEFORE UPDATE ON public.shield_products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_so_updated_at          BEFORE UPDATE ON public.shield_orders   FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_mn_updated_at          BEFORE UPDATE ON public.member_needs    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_reviews_updated_at     BEFORE UPDATE ON public.reviews         FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 5. AUTO-CREATE PROFILE TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'pembeli')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 6. ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.koperasi        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shield_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shield_orders   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_needs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.komunitas_posts ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "profiles: public read"  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles: own insert"   ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles: own update"   ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- koperasi
CREATE POLICY "koperasi: public read"   ON public.koperasi FOR SELECT USING (true);
CREATE POLICY "koperasi: owner insert"  ON public.koperasi FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "koperasi: owner update"  ON public.koperasi FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "koperasi: owner delete"  ON public.koperasi FOR DELETE USING (auth.uid() = owner_id);

-- products
CREATE POLICY "products: public read"   ON public.products FOR SELECT USING (is_active = true OR auth.uid() = seller_id);
CREATE POLICY "products: seller insert" ON public.products FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "products: seller update" ON public.products FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "products: seller delete" ON public.products FOR DELETE USING (auth.uid() = seller_id);

-- orders
CREATE POLICY "orders: involved read"  ON public.orders FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "orders: buyer insert"   ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "orders: involved update" ON public.orders FOR UPDATE USING (auth.uid() = seller_id OR auth.uid() = buyer_id);

-- order_items
CREATE POLICY "order_items: related read" ON public.order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.buyer_id = auth.uid() OR o.seller_id = auth.uid())));
CREATE POLICY "order_items: insert" ON public.order_items FOR INSERT WITH CHECK (true);

-- shield_products
CREATE POLICY "shield_products: public read" ON public.shield_products FOR SELECT USING (is_active = true);

-- shield_orders
CREATE POLICY "shield_orders: own read"   ON public.shield_orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "shield_orders: own insert" ON public.shield_orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "shield_orders: own update" ON public.shield_orders FOR UPDATE USING (auth.uid() = user_id);

-- member_needs
CREATE POLICY "member_needs: public read" ON public.member_needs FOR SELECT USING (true);
CREATE POLICY "member_needs: kop insert"  ON public.member_needs FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.koperasi k WHERE k.id = koperasi_id AND k.owner_id = auth.uid()));
CREATE POLICY "member_needs: kop update"  ON public.member_needs FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.koperasi k WHERE k.id = koperasi_id AND k.owner_id = auth.uid()));
CREATE POLICY "member_needs: kop delete"  ON public.member_needs FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.koperasi k WHERE k.id = koperasi_id AND k.owner_id = auth.uid()));

-- cart
CREATE POLICY "cart: own crud"      ON public.cart_items FOR ALL USING (auth.uid() = user_id);

-- wishlists
CREATE POLICY "wishlists: own crud" ON public.wishlists FOR ALL USING (auth.uid() = user_id);

-- reviews
CREATE POLICY "reviews: public read" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews: own insert"  ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews: own update"  ON public.reviews FOR UPDATE USING (auth.uid() = user_id);

-- notifications
CREATE POLICY "notif: own read"   ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notif: own update" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- komunitas_posts
CREATE POLICY "komunitas: public read" ON public.komunitas_posts FOR SELECT USING (true);
CREATE POLICY "komunitas: own insert"  ON public.komunitas_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "komunitas: own update"  ON public.komunitas_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "komunitas: own delete"  ON public.komunitas_posts FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 7. STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars',  'avatars',  true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('koperasi', 'koperasi', true) ON CONFLICT DO NOTHING;

DROP POLICY IF EXISTS "avatars: public read"    ON storage.objects;
DROP POLICY IF EXISTS "avatars: auth upload"    ON storage.objects;
DROP POLICY IF EXISTS "avatars: owner update"   ON storage.objects;
DROP POLICY IF EXISTS "avatars: owner delete"   ON storage.objects;
DROP POLICY IF EXISTS "products storage: public read"   ON storage.objects;
DROP POLICY IF EXISTS "products storage: auth upload"   ON storage.objects;
DROP POLICY IF EXISTS "products storage: owner delete"  ON storage.objects;
DROP POLICY IF EXISTS "koperasi storage: public read"   ON storage.objects;
DROP POLICY IF EXISTS "koperasi storage: auth upload"   ON storage.objects;
DROP POLICY IF EXISTS "koperasi storage: owner delete"  ON storage.objects;

CREATE POLICY "avatars: public read"   ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "avatars: auth upload"   ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "avatars: owner update"  ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "avatars: owner delete"  ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "products storage: public read"  ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "products storage: auth upload"  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');
CREATE POLICY "products storage: owner delete" ON storage.objects FOR DELETE USING (bucket_id = 'products' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "koperasi storage: public read"  ON storage.objects FOR SELECT USING (bucket_id = 'koperasi');
CREATE POLICY "koperasi storage: auth upload"  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'koperasi' AND auth.role() = 'authenticated');
CREATE POLICY "koperasi storage: owner delete" ON storage.objects FOR DELETE USING (bucket_id = 'koperasi' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- 8. SEED DATA — Shield Products
-- ============================================================
INSERT INTO public.shield_products (name, description, price, coverage, duration_days, crop_type, commodity, premium, is_active) VALUES
  ('Perlindungan Padi Dasar',    'Proteksi dasar padi dari banjir dan kekeringan',          150000, 5000000,  90,  'padi',       'padi',       150000, true),
  ('Perlindungan Padi Premium',  'Proteksi lengkap padi termasuk hama dan cuaca ekstrem',   350000, 15000000, 180, 'padi',       'padi',       350000, true),
  ('Perlindungan Jagung Standar','Proteksi jagung dari serangan hama dan penyakit',          200000, 7500000,  90,  'jagung',     'jagung',     200000, true),
  ('Perlindungan Sayuran',       'Proteksi tanaman sayuran dari gagal panen',                175000, 4000000,  60,  'sayuran',    'sayuran',    175000, true),
  ('Perlindungan Perkebunan',    'Proteksi tanaman perkebunan jangka panjang',               500000, 25000000, 365, 'perkebunan', 'perkebunan', 500000, true),
  ('Perlindungan Perikanan',     'Proteksi budidaya ikan dan udang',                         300000, 12000000, 120, 'perikanan',  'perikanan',  300000, true);

-- ============================================================
-- VERIFIKASI — jalankan setelah Run berhasil
-- ============================================================
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
