-- ============================================================
-- AGROU — Seed Data
-- 1 record per entity, minimal, for development/demo
-- Run AFTER 01_schema.sql
-- ============================================================

-- ============================================================
-- IMPORTANT: profiles cannot be seeded directly here because
-- they require a real auth.users entry (FK constraint).
-- Instead we seed everything that doesn't depend on profiles:
--   promos, shield_products
-- And provide a helper block you can run AFTER creating your
-- first test user via the app or Supabase Dashboard Auth UI.
-- ============================================================

-- ---- promos ----
INSERT INTO public.promos (title, description, image_url, is_active)
VALUES (
  'Musim Tanam Tiba',
  'Dapatkan diskon 15% untuk semua produk benih pilihan koperasi terpercaya.',
  'https://placehold.co/800x300/1B4332/e8f5e9?text=Musim+Tanam+Tiba',
  true
);

-- ---- shield_products ----
INSERT INTO public.shield_products (name, description, price, coverage, duration_days, crop_type, image_url, is_active)
VALUES (
  'Proteksi Padi Basic',
  'Perlindungan asuransi pertanian untuk tanaman padi selama satu musim tanam. Menanggung risiko banjir, kekeringan, dan hama.',
  150000,
  5000000,
  90,
  'padi',
  'https://placehold.co/400x300/1B4332/e8f5e9?text=Proteksi+Padi',
  true
);

-- ============================================================
-- OPTIONAL: run this block AFTER you have created a test user
-- via Register page. Replace the email below with your test
-- user's email, then run in Supabase SQL Editor.
-- ============================================================

/*

-- Step 1: get the user's UUID from auth
-- SELECT id FROM auth.users WHERE email = 'test@agrou.id';

-- Step 2: paste the UUID here
DO $$
DECLARE
  v_user_id   UUID := 'PASTE-YOUR-USER-UUID-HERE';
  v_kop_id    UUID := gen_random_uuid();
  v_prod_id   UUID := gen_random_uuid();
  v_post_id   UUID := gen_random_uuid();
  v_order_id  UUID := gen_random_uuid();
  v_shield_product_id UUID;
BEGIN

  -- Update profile role to 'petani' (or 'koperasi')
  UPDATE public.profiles
  SET role = 'petani', full_name = 'Budi Santoso', is_verified = true
  WHERE id = v_user_id;

  -- 1 koperasi
  INSERT INTO public.koperasi (id, owner_id, name, slug, description, location, province, rating, member_count, is_verified)
  VALUES (
    v_kop_id,
    v_user_id,
    'KUD Makmur Jaya',
    'kud-makmur-jaya',
    'Koperasi Unit Desa Makmur Jaya melayani petani padi dan palawija di wilayah Jawa Tengah.',
    'Semarang, Jawa Tengah',
    'Jawa Tengah',
    4.8,
    120,
    true
  );

  -- 1 product
  INSERT INTO public.products (id, koperasi_id, seller_id, name, description, price, original_price, unit, stock, min_order, category, tags, rating, sold_count, is_active)
  VALUES (
    v_prod_id,
    v_kop_id,
    v_user_id,
    'Benih Padi Ciherang 5kg',
    'Benih padi varietas Ciherang bersertifikat, produktivitas tinggi 6–8 ton/ha. Cocok untuk lahan irigasi teknis.',
    85000,
    95000,
    'pack',
    250,
    1,
    'padi',
    ARRAY['benih', 'padi', 'ciherang', 'bersertifikat'],
    4.9,
    312,
    true
  );

  -- 1 post (komunitas)
  INSERT INTO public.posts (id, author_id, koperasi_id, title, content, type, tags)
  VALUES (
    v_post_id,
    v_user_id,
    v_kop_id,
    'Tersedia: Benih Padi Ciherang Musim Rendeng 2025',
    'Kami menyediakan benih padi Ciherang bersertifikat untuk musim rendeng 2025. Stok terbatas, hubungi koperasi untuk pemesanan kolektif.',
    'offer',
    ARRAY['padi', 'benih', 'ciherang', 'musim-rendeng']
  );

  -- 1 comment on that post
  INSERT INTO public.comments (post_id, author_id, content)
  VALUES (
    v_post_id,
    v_user_id,
    'Apakah tersedia untuk wilayah Demak? Kami butuh sekitar 200 kg.'
  );

  -- 1 shield order
  SELECT id INTO v_shield_product_id FROM public.shield_products LIMIT 1;

  INSERT INTO public.shield_orders (user_id, shield_product_id, status, land_area, location, start_date, end_date, amount_paid)
  VALUES (
    v_user_id,
    v_shield_product_id,
    'active',
    1.5,
    'Semarang, Jawa Tengah',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '90 days',
    150000
  );

  -- 1 member_need
  INSERT INTO public.member_needs (koperasi_id, member_id, title, description, category, quantity, unit)
  VALUES (
    v_kop_id,
    v_user_id,
    'Pupuk Urea Subsidi',
    'Anggota membutuhkan pupuk urea bersubsidi untuk persiapan musim tanam rendeng.',
    'pupuk',
    500,
    'kg'
  );

  RAISE NOTICE 'Seed selesai untuk user %', v_user_id;
END $$;

*/
