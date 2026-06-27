// Agrou — Full Relational Seed
// Creates: 1 auth user, 1 profile, 1 koperasi, 1 product,
//          1 post, 1 comment, 1 shield_order, 1 member_need
// Run: node supabase/seed_full.cjs

const { Client } = require('pg')

const DB = {
  host: 'db.hodtuvbkrshvtjesacab.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'hazhranz293',
  ssl: { rejectUnauthorized: false },
}

async function main() {
  const client = new Client(DB)
  await client.connect()
  console.log('Connected to Supabase Postgres\n')

  try {
    // ── 1. Check / create auth user ──────────────────────────────
    let userId
    const { rows: existing } = await client.query(
      "SELECT id FROM auth.users WHERE email = 'demo@agrou.id'"
    )
    if (existing.length) {
      userId = existing[0].id
      console.log('ℹ️  Demo user already exists:', userId)
    } else {
      // Insert directly into auth.users — trigger will create profile
      const { rows } = await client.query(`
        INSERT INTO auth.users (
          id, instance_id, email, encrypted_password,
          email_confirmed_at, raw_user_meta_data,
          aud, role, created_at, updated_at,
          confirmation_token, recovery_token,
          email_change_token_new, email_change
        ) VALUES (
          gen_random_uuid(),
          '00000000-0000-0000-0000-000000000000',
          'demo@agrou.id',
          crypt('Demo1234!', gen_salt('bf')),
          NOW(),
          '{"full_name":"Budi Santoso","role":"petani"}'::jsonb,
          'authenticated', 'authenticated',
          NOW(), NOW(),
          '', '', '', ''
        )
        RETURNING id
      `)
      userId = rows[0].id
      console.log('✅ Auth user created:', userId)
    }

    // ── 2. Ensure profile exists & update role ────────────────────
    await client.query(`
      INSERT INTO public.profiles (id, full_name, role, is_verified)
      VALUES ($1, 'Budi Santoso', 'petani', true)
      ON CONFLICT (id) DO UPDATE
        SET full_name = 'Budi Santoso', role = 'petani', is_verified = true
    `, [userId])
    console.log('✅ Profile upserted')

    // ── 3. Koperasi ───────────────────────────────────────────────
    let koperasiId
    const { rows: kops } = await client.query(
      "SELECT id FROM public.koperasi WHERE slug = 'kud-makmur-jaya'"
    )
    if (kops.length) {
      koperasiId = kops[0].id
      console.log('ℹ️  Koperasi already exists:', koperasiId)
    } else {
      const { rows } = await client.query(`
        INSERT INTO public.koperasi
          (owner_id, name, slug, description, location, province, rating, member_count, is_verified)
        VALUES
          ($1, 'KUD Makmur Jaya', 'kud-makmur-jaya',
           'Koperasi Unit Desa Makmur Jaya melayani petani padi dan palawija di Jawa Tengah.',
           'Semarang, Jawa Tengah', 'Jawa Tengah', 4.8, 120, true)
        RETURNING id
      `, [userId])
      koperasiId = rows[0].id
      console.log('✅ Koperasi created:', koperasiId)
    }

    // ── 4. Product ────────────────────────────────────────────────
    let productId
    const { rows: prods } = await client.query(
      "SELECT id FROM public.products WHERE seller_id = $1 LIMIT 1", [userId]
    )
    if (prods.length) {
      productId = prods[0].id
      console.log('ℹ️  Product already exists:', productId)
    } else {
      const { rows } = await client.query(`
        INSERT INTO public.products
          (koperasi_id, seller_id, name, description, price, original_price,
           unit, stock, min_order, category, tags, rating, sold_count, is_active)
        VALUES
          ($1, $2,
           'Benih Padi Ciherang 5kg',
           'Benih padi varietas Ciherang bersertifikat, produktivitas tinggi 6-8 ton/ha. Cocok untuk lahan irigasi teknis.',
           85000, 95000, 'pack', 250, 1, 'padi',
           ARRAY['benih','padi','ciherang','bersertifikat'],
           4.9, 312, true)
        RETURNING id
      `, [koperasiId, userId])
      productId = rows[0].id
      console.log('✅ Product created:', productId)
    }

    // ── 5. Post (komunitas) ───────────────────────────────────────
    let postId
    const { rows: posts } = await client.query(
      "SELECT id FROM public.posts WHERE author_id = $1 LIMIT 1", [userId]
    )
    if (posts.length) {
      postId = posts[0].id
      console.log('ℹ️  Post already exists:', postId)
    } else {
      const { rows } = await client.query(`
        INSERT INTO public.posts
          (author_id, koperasi_id, title, content, type, tags)
        VALUES
          ($1, $2,
           'Tersedia: Benih Padi Ciherang Musim Rendeng 2025',
           'Kami menyediakan benih padi Ciherang bersertifikat untuk musim rendeng 2025. Stok terbatas, hubungi koperasi untuk pemesanan kolektif.',
           'offer',
           ARRAY['padi','benih','ciherang','musim-rendeng'])
        RETURNING id
      `, [userId, koperasiId])
      postId = rows[0].id
      console.log('✅ Post created:', postId)
    }

    // ── 6. Comment ────────────────────────────────────────────────
    const { rows: cmts } = await client.query(
      "SELECT id FROM public.comments WHERE post_id = $1 LIMIT 1", [postId]
    )
    if (cmts.length) {
      console.log('ℹ️  Comment already exists')
    } else {
      await client.query(`
        INSERT INTO public.comments (post_id, author_id, content)
        VALUES ($1, $2, 'Apakah tersedia untuk wilayah Demak? Kami butuh sekitar 200 kg.')
      `, [postId, userId])
      console.log('✅ Comment created')
    }

    // ── 7. Shield order ───────────────────────────────────────────
    const { rows: sp } = await client.query(
      "SELECT id FROM public.shield_products LIMIT 1"
    )
    if (sp.length) {
      const { rows: so } = await client.query(
        "SELECT id FROM public.shield_orders WHERE user_id = $1 LIMIT 1", [userId]
      )
      if (so.length) {
        console.log('ℹ️  Shield order already exists')
      } else {
        await client.query(`
          INSERT INTO public.shield_orders
            (user_id, shield_product_id, status, land_area, location,
             start_date, end_date, amount_paid)
          VALUES
            ($1, $2, 'active', 1.5, 'Semarang, Jawa Tengah',
             CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', 150000)
        `, [userId, sp[0].id])
        console.log('✅ Shield order created')
      }
    }

    // ── 8. Member need ────────────────────────────────────────────
    const { rows: mn } = await client.query(
      "SELECT id FROM public.member_needs WHERE member_id = $1 LIMIT 1", [userId]
    )
    if (mn.length) {
      console.log('ℹ️  Member need already exists')
    } else {
      await client.query(`
        INSERT INTO public.member_needs
          (koperasi_id, member_id, title, description, category, quantity, unit)
        VALUES
          ($1, $2,
           'Pupuk Urea Subsidi',
           'Anggota membutuhkan pupuk urea bersubsidi untuk persiapan musim tanam rendeng.',
           'pupuk', 500, 'kg')
      `, [koperasiId, userId])
      console.log('✅ Member need created')
    }

    // ── Summary ───────────────────────────────────────────────────
    console.log('\n🎉 Seed complete!')
    console.log('─────────────────────────────────')
    console.log('Demo login:')
    console.log('  email   : demo@agrou.id')
    console.log('  password: Demo1234!')
    console.log('  user_id :', userId)
    console.log('─────────────────────────────────')

  } catch (err) {
    console.error('❌ Seed failed:', err.message)
    throw err
  } finally {
    await client.end()
  }
}

main().catch(() => process.exit(1))
