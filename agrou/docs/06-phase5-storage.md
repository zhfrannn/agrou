# Phase 5 — Storage & Media

> **Estimasi waktu:** 2–3 jam
> **Depends on:** Phase 0 + Phase 1 (auth) selesai
> **Goal:** Upload gambar produk, avatar user, dan banner koperasi ke Supabase Storage

---

## 5.1 Setup Supabase Storage Buckets

Di Supabase Dashboard → Storage → New Bucket:

| Bucket | Public? | Keterangan |
|---|---|---|
| `avatars` | Yes | Foto profil user |
| `products` | Yes | Foto produk (bisa multiple per produk) |
| `koperasi` | Yes | Logo dan banner koperasi |
| `promos` | Yes | Gambar promo banner |

Semua bucket **public** karena gambar ini memang ditampilkan ke semua user tanpa auth.

---

## 5.2 Storage Policies

```sql
-- Bucket: avatars
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

-- Bucket: products
CREATE POLICY "products: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

CREATE POLICY "products: auth upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'products'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "products: owner delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'products'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Bucket: koperasi
CREATE POLICY "koperasi: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'koperasi');

CREATE POLICY "koperasi: auth upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'koperasi'
    AND auth.role() = 'authenticated'
  );
```

---

## 5.3 Upload Helper Functions

Buat `agrou/src/lib/storage.ts`:

```typescript
import { supabase } from './supabase'

export type StorageBucket = 'avatars' | 'products' | 'koperasi' | 'promos'

/**
 * Upload file ke Supabase Storage
 * Returns public URL jika berhasil
 */
export async function uploadFile(
  bucket: StorageBucket,
  file: File,
  path: string
): Promise<{ url: string | null; error: string | null }> {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    return { url: null, error: 'Format file tidak didukung. Gunakan JPG, PNG, atau WebP.' }
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    return { url: null, error: 'Ukuran file maksimal 5MB.' }
  }

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true })

  if (uploadError) {
    return { url: null, error: uploadError.message }
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return { url: data.publicUrl, error: null }
}

/**
 * Upload avatar user
 * Path: avatars/{userId}/avatar.{ext}
 */
export async function uploadAvatar(userId: string, file: File) {
  const ext = file.name.split('.').pop()
  const path = `${userId}/avatar.${ext}`
  return uploadFile('avatars', file, path)
}

/**
 * Upload foto produk
 * Path: products/{userId}/{productId}/{filename}
 */
export async function uploadProductImage(
  userId: string,
  productId: string,
  file: File,
  index: number
) {
  const ext = file.name.split('.').pop()
  const path = `${userId}/${productId}/photo-${index}.${ext}`
  return uploadFile('products', file, path)
}

/**
 * Upload logo/banner koperasi
 * Path: koperasi/{koperasiId}/{type}.{ext}
 */
export async function uploadKoperasiImage(
  koperasiId: string,
  file: File,
  type: 'logo' | 'banner'
) {
  const ext = file.name.split('.').pop()
  const path = `${koperasiId}/${type}.${ext}`
  return uploadFile('koperasi', file, path)
}

/**
 * Delete file dari Storage
 */
export async function deleteFile(bucket: StorageBucket, path: string) {
  const { error } = await supabase.storage.from(bucket).remove([path])
  return { error: error?.message ?? null }
}

/**
 * Get public URL tanpa fetch
 */
export function getPublicUrl(bucket: StorageBucket, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
```

---

## 5.4 Komponen Upload Avatar

Buat `agrou/src/components/ui/AvatarUpload.tsx`:

```typescript
import { useState, useRef } from 'react'
import { Camera } from 'lucide-react'
import { uploadAvatar } from '../../lib/storage'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

interface AvatarUploadProps {
  currentUrl?: string | null
  onUpload: (url: string) => void
}

export default function AvatarUpload({ currentUrl, onUpload }: AvatarUploadProps) {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    const { url, error } = await uploadAvatar(user.id, file)

    if (error) {
      toast.error(error)
    } else if (url) {
      // Update profil di database
      await supabase
        .from('profiles')
        .update({ avatar_url: url })
        .eq('id', user.id)
      onUpload(url)
      toast.success('Foto profil diperbarui!')
    }
    setUploading(false)
  }

  return (
    <div className="relative w-24 h-24">
      {currentUrl ? (
        <img
          src={currentUrl}
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-[#1a3d2b] flex items-center justify-center">
          <span className="text-white text-2xl font-bold">?</span>
        </div>
      )}
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="absolute bottom-0 right-0 bg-[#2d7a4f] p-1.5 rounded-full text-white hover:bg-[#1a3d2b] transition"
      >
        <Camera size={14} />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
```

---

## 5.5 Komponen Upload Foto Produk (Multi-image)

Buat `agrou/src/components/ui/ProductImageUpload.tsx`:

```typescript
import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { uploadProductImage } from '../../lib/storage'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

interface ProductImageUploadProps {
  productId: string
  existingImages: string[]
  onChange: (urls: string[]) => void
}

export default function ProductImageUpload({
  productId,
  existingImages,
  onChange,
}: ProductImageUploadProps) {
  const { user } = useAuth()
  const [images, setImages] = useState<string[]>(existingImages)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length || !user) return

    setUploading(true)
    const newUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const { url, error } = await uploadProductImage(user.id, productId, files[i], images.length + i)
      if (error) {
        toast.error(`Gagal upload: ${error}`)
      } else if (url) {
        newUrls.push(url)
      }
    }

    const updated = [...images, ...newUrls]
    setImages(updated)
    onChange(updated)
    setUploading(false)
  }

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index)
    setImages(updated)
    onChange(updated)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {images.map((url, i) => (
        <div key={i} className="relative w-24 h-24">
          <img src={url} alt={`Foto ${i + 1}`} className="w-24 h-24 object-cover rounded-lg" />
          <button
            onClick={() => removeImage(i)}
            className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 text-white"
          >
            <X size={10} />
          </button>
        </div>
      ))}
      {images.length < 5 && (
        <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#2d7a4f]">
          {uploading ? (
            <div className="animate-spin w-4 h-4 border-2 border-[#2d7a4f] rounded-full border-t-transparent" />
          ) : (
            <Plus size={20} className="text-gray-400" />
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  )
}
```

---

## 5.6 Cloudflare R2 (Opsional — Scale Up)

Jika kebutuhan storage meningkat atau butuh CDN global yang lebih cepat:

1. Buat R2 bucket di Cloudflare Dashboard → R2
2. Setup custom domain: `cdn.agrou.id` → R2 bucket
3. Update Worker untuk serve static assets dari R2
4. Gambar di-upload ke Supabase Storage → sync ke R2 via Worker trigger

> **Rekomendasi:** Mulai dengan Supabase Storage. Migrasi ke R2 hanya jika ada kebutuhan performa atau cost yang jelas. Supabase Storage sudah cukup untuk skala awal.

---

## Checklist Phase 5

- [ ] Buat 4 bucket di Supabase Storage: `avatars`, `products`, `koperasi`, `promos`
- [ ] Jalankan SQL policies untuk semua bucket
- [ ] Buat `agrou/src/lib/storage.ts` dengan semua helper functions
- [ ] Buat `AvatarUpload.tsx` component
- [ ] Buat `ProductImageUpload.tsx` component
- [ ] Integrasikan `AvatarUpload` ke `DashboardKoperasiProfile.tsx`
- [ ] Integrasikan `ProductImageUpload` ke form tambah/edit produk di `DashboardBrandStock.tsx`
- [ ] Test: upload avatar → URL tersimpan di `profiles.avatar_url`
- [ ] Test: upload foto produk → URL tersimpan di `products.images`
- [ ] Test: gambar ter-serve dari URL Supabase Storage public

## Deliverable Phase 5

User bisa upload dan mengganti foto profil dan foto produk. Semua media tersimpan di Supabase Storage dengan akses kontrol yang benar.
