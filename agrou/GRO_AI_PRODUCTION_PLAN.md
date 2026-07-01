# Gro AI — Production Readiness Plan

> Implementasi phase-by-phase. Jangan eksekusi semua sekaligus.  
> Setiap phase bisa di-review dulu sebelum lanjut ke phase berikutnya.

---

## Kondisi Saat Ini (Audit)

### Yang sudah bagus ✅
- Arsitektur sudah dipisah: constants, lib, hooks, types, shared components
- `callGroAI` sudah ada di `lib/groai-client.ts`
- `useConversations` hook sudah ada
- `MarkdownRenderer`, `MessageSkeleton`, `ChatInput`, `ChatMessage` sudah terpisah
- System prompts sudah di `lib/groai-prompts.ts`

### Masalah yang harus diselesaikan ❌

| # | File | Masalah |
|---|------|---------|
| 1 | `GroAIModeB.tsx` | Masih ~700+ baris, semua module (kalkulator, dokumen, writer, vision) render inline dalam 1 file |
| 2 | `GroAIModeB.tsx` | `CALC_FIELDS`, `DOK_FIELDS`, `WRITER_FIELDS` hardcoded di atas komponen, seharusnya di constants |
| 3 | `GroAIModeB.tsx` | State management untuk 5 module berbeda (20+ state) semua di 1 komponen |
| 4 | `GroAIModeB.tsx` | `sidebarKiriImg` masih pakai asset Mode A (`sidebar-kiri-a.png`) — salah asset |
| 5 | `GroAIModeA.tsx` | JSX render masih terlalu panjang, sidebar logic masih inline |
| 6 | `GroAIModeA.tsx` | `handleModuleClick` tidak reset conversation history per module dengan benar |
| 7 | Keduanya | Tidak ada error boundary spesifik untuk AI call failure |
| 8 | Keduanya | Tidak ada `useCallback` / `useMemo` pada handler heavy — re-render berlebihan |
| 9 | `MarkdownRenderer` | Tidak support `### h3`, `---` divider, table markdown — output AI sering pakai ini |
| 10 | `groai-prompts.ts` | System prompt Mode A tidak mention konteks user (nama, lokasi) yang sudah ada dari `useAuth` |
| 11 | `groai-client.ts` | Tidak ada retry logic, timeout handling, atau abort controller |
| 12 | `useConversations` | Tidak ada persistence (localStorage) — refresh halaman = semua chat hilang |
| 13 | `GroAIPage.tsx` | Background asset hardcoded string path (`/src/assets/...`) — akan 404 di production build |

---

## File Structure Target

```
src/
├── components/
│   ├── gro-ai/
│   │   ├── shared/
│   │   │   ├── ChatInput.tsx          ✅ sudah ada
│   │   │   ├── ChatMessage.tsx        ✅ sudah ada
│   │   │   ├── MarkdownRenderer.tsx   🔧 perlu upgrade
│   │   │   ├── MessageSkeleton.tsx    ✅ sudah ada
│   │   │   ├── ConversationSidebar.tsx  🆕 ekstrak dari ModeA/B
│   │   │   └── EmptyState.tsx           🆕 ekstrak welcome screen
│   │   ├── mode-a/
│   │   │   ├── ModuleSelector.tsx       🆕 ekstrak dari ModeA sidebar
│   │   │   ├── ProductPanel.tsx         🆕 ekstrak dari ModeA right panel
│   │   │   └── ChatArea.tsx             🆕 ekstrak dari ModeA main
│   │   └── mode-b/
│   │       ├── KoperasiSelector.tsx     🆕 ekstrak dari ModeB sidebar
│   │       ├── KalkulatorModule.tsx     🆕 ekstrak dari ModeB
│   │       ├── DokumenModule.tsx        🆕 ekstrak dari ModeB
│   │       ├── WriterModule.tsx         🆕 ekstrak dari ModeB
│   │       └── VisionModule.tsx         🆕 ekstrak dari ModeB
│   ├── GroAIModeA.tsx                   🔧 slim down jadi orchestrator
│   ├── GroAIModeB.tsx                   🔧 slim down jadi orchestrator
│   └── GroAIPage.tsx                    🔧 fix asset path
├── constants/
│   ├── gro-ai-modules.ts              ✅ sudah ada
│   ├── gro-ai-products.ts             ✅ sudah ada
│   ├── gro-ai-koperasi.ts             ✅ sudah ada
│   ├── gro-ai-topics.ts               ✅ sudah ada
│   ├── gro-ai-calc-fields.ts          🆕 pindah dari ModeB inline
│   ├── gro-ai-dok-fields.ts           🆕 pindah dari ModeB inline
│   └── gro-ai-writer-fields.ts        🆕 pindah dari ModeB inline
├── hooks/
│   ├── useConversations.ts            🔧 tambah localStorage persistence
│   └── useGroAICall.ts                🆕 wrapper callGroAI + loading/error state
├── lib/
│   ├── groai-client.ts                🔧 retry + abort controller + timeout
│   └── groai-prompts.ts               🔧 inject user context ke Mode A system prompt
└── types/
    └── gro-ai.ts                      🔧 tambah tipe untuk field definitions
```

---

## Phase 1 — Foundation Fixes (Prioritas Tertinggi)

> **Goal:** AI call beneran work, tidak ada 404 asset, output terbaca dengan baik.  
> **Estimasi:** 2–3 jam  
> **Tidak ada breaking change visual.**

### 1.1 Fix `GroAIPage.tsx` — asset path

**Masalah:** `backgroundImage: "url('/src/assets/gro-ai-bg.jpg')"` akan 404 di production Vite build.

**Fix:**
```tsx
// Sebelum
style={{ backgroundImage: "url('/src/assets/gro-ai-bg.jpg')" }}

// Sesudah — import sebagai modul
import groAiBg from "../assets/gro-ai-bg.jpg";
// ...
style={{ backgroundImage: `url(${groAiBg})` }}
```

### 1.2 Upgrade `MarkdownRenderer.tsx`

Tambahkan support untuk output AI yang lebih kaya:

- `### heading3` → `<h3>` dengan styling lebih kecil dari h2
- `---` / `___` → `<hr>` subtle divider
- `> blockquote` → styled quote block (untuk tips/warning dari AI)
- Tabel markdown sederhana `| col | col |` → responsive table
- Nested list (` - item` dengan 2 spasi indent)
- Link `[text](url)` → `<a>` dengan target blank (untuk referensi regulasi)

### 1.3 Upgrade `lib/groai-client.ts` — robustness

```ts
// Tambahkan:
// 1. AbortController dengan timeout 30 detik
// 2. Retry logic: 1x retry jika network error (bukan 4xx)
// 3. Typed error: GroAINetworkError | GroAIAPIError
// 4. Response validation: pastikan reply field ada sebelum return
```

**Interface target:**
```ts
interface GroAICallOptions {
  message: string;
  systemPrompt: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
  image?: string;
  signal?: AbortSignal; // untuk cancel dari komponen
  onRetry?: () => void; // callback saat retry
}

class GroAINetworkError extends Error { ... }
class GroAIAPIError extends Error { statusCode: number; ... }
```

### 1.4 Fix `groai-prompts.ts` — inject user context

Mode A system prompt harus tahu siapa usernya:

```ts
export function getModeASystemPrompt(
  module: GroAIModule,
  userContext?: { name?: string; location?: string }
): string {
  const userLine = userContext?.name
    ? `Kamu berbicara dengan ${userContext.name}${userContext.location ? ` dari ${userContext.location}` : ''}.`
    : '';
  // ...inject ke system prompt
}
```

Panggil dari `GroAIModeA.tsx`:
```tsx
getModeASystemPrompt(activeModule, {
  name: profile?.full_name,
  location: profile?.location,
})
```

### 1.5 Tambah `useGroAICall.ts` hook

Centralize loading/error state yang sekarang duplikat di ModeA dan ModeB:

```ts
export function useGroAICall() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const call = useCallback(async (options: GroAICallOptions) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    try {
      return await callGroAI({ ...options, signal: controller.signal });
    } catch (err) {
      if (err instanceof GroAINetworkError) {
        setError('Koneksi bermasalah. Periksa internet dan coba lagi.');
      } else {
        setError('Gro AI tidak dapat merespons saat ini.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancel = useCallback(() => abortRef.current?.abort(), []);

  return { call, loading, error, cancel };
}
```

---

## Phase 2 — localStorage Persistence

> **Goal:** Chat history tidak hilang saat refresh halaman.  
> **Estimasi:** 1–2 jam  
> **Tidak ada breaking change visual.**

### 2.1 Upgrade `useConversations.ts`

```ts
const STORAGE_KEY_A = 'groai_conversations_a';
const STORAGE_KEY_B = 'groai_conversations_b';

export function useConversations(storageKey: string) {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync ke localStorage setiap update
  useEffect(() => {
    try {
      // Batasi 20 conversation terakhir per mode agar tidak bloat
      const toSave = conversations.slice(-20);
      localStorage.setItem(storageKey, JSON.stringify(toSave));
    } catch {
      // localStorage penuh atau disabled — silent fail
    }
  }, [conversations, storageKey]);

  // Tambah deleteConversation & clearAll
  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setConversations([]);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  return { conversations, ..., deleteConversation, clearAll };
}
```

Panggil di ModeA: `useConversations('groai_conversations_a')`  
Panggil di ModeB: `useConversations('groai_conversations_b')`

### 2.2 Tambah delete conversation di sidebar UI

- Tombol `×` kecil muncul saat hover di conversation item
- Konfirmasi inline (bukan modal): `"Hapus?"` dengan `Ya` / `Batal`

---

## Phase 3 — Ekstrak Constants dari ModeB

> **Goal:** Hilangkan hardcoded field definitions dari dalam komponen.  
> **Estimasi:** 1 jam  
> **Zero breaking change — pure refactor.**

### 3.1 Buat `src/constants/gro-ai-calc-fields.ts`

```ts
import type { CalcType } from '../types/gro-ai';

export interface FieldDef {
  key: string;
  label: string;
  placeholder: string;
}

export const CALC_FIELDS: Record<NonNullable<CalcType>, FieldDef[]> = {
  logistik: [
    { key: 'berat', label: 'Berat Kargo (kg)', placeholder: '2400' },
    { key: 'tujuan', label: 'Pelabuhan Tujuan', placeholder: 'Tokyo, Japan' },
    { key: 'incoterm', label: 'Incoterm', placeholder: 'FOB' },
  ],
  proyeksi: [
    { key: 'periode', label: 'Periode (bulan)', placeholder: '6' },
    { key: 'target_volume', label: 'Target Volume', placeholder: '5 ton' },
  ],
  bea: [
    { key: 'hs_code', label: 'HS Code', placeholder: '0901.21.00' },
    { key: 'nilai_fob', label: 'Nilai FOB (USD)', placeholder: '10080' },
  ],
  breakeven: [
    { key: 'biaya_tetap', label: 'Biaya Tetap/bulan (Rp)', placeholder: '20000000' },
    { key: 'harga_jual', label: 'Harga Jual/kg (USD)', placeholder: '4.20' },
    { key: 'volume_target', label: 'Volume Target (kg/bulan)', placeholder: '2400' },
  ],
};
```

### 3.2 Buat `src/constants/gro-ai-dok-fields.ts`

Sama seperti di atas untuk `DOK_FIELDS` dengan tipe `DokType`.

### 3.3 Buat `src/constants/gro-ai-writer-fields.ts`

Sama untuk `WRITER_FIELDS` dengan tipe `WriterType`.

### 3.4 Update `src/types/gro-ai.ts`

Export `FieldDef` interface dari types agar bisa dipakai lintas file.

---

## Phase 4 — Ekstrak Sub-components ModeB

> **Goal:** Pecah ModeB dari ~700 baris jadi orchestrator ~200 baris.  
> **Estimasi:** 3–4 jam  
> **Visual identik — hanya split komponen.**

Setiap module ModeB jadi file terpisah di `src/components/gro-ai/mode-b/`:

### 4.1 `KalkulatorModule.tsx`

Props:
```tsx
interface KalkulatorModuleProps {
  kop: Koperasi;
  accentColor?: string; // default '#f77f00'
}
```

Internal state: `calcType`, `calcFields`, `calcLoading`, `calcResult`  
Menggunakan `useGroAICall` hook dari Phase 1.5.

### 4.2 `DokumenModule.tsx`

Props:
```tsx
interface DokumenModuleProps {
  kop: Koperasi;
}
```

Internal state: `dokType`, `dokFields`, `dokLoading`, `dokResult`, `copied`

### 4.3 `WriterModule.tsx`

Props:
```tsx
interface WriterModuleProps {
  kop: Koperasi;
}
```

Internal state: `writerType`, `writerFields`, `writerLoading`, `writerResult`, `copied`

### 4.4 `VisionModule.tsx`

Props:
```tsx
interface VisionModuleProps {
  kop: Koperasi;
}
```

Internal state: `visionImage`, `visionLoading`, `visionResult`  
Gunakan `useGroAICall` hook.  
**Penting:** `getModeBVisionSystemPrompt` harus di-pass dengan konteks koperasi yang aktif.

### 4.5 Update `GroAIModeB.tsx` — jadi orchestrator

Setelah ekstrak, ModeB cukup:
```tsx
// State yang tersisa di ModeB:
// - activeKopId, activeModule, leftOpen, rightOpen
// - conversations (via useConversations hook)
// - chatInput, chatLoading (untuk module 'chat')

// Render module berdasarkan activeModule:
{activeModule === 'kalkulator' && <KalkulatorModule kop={kop} />}
{activeModule === 'dokumen' && <DokumenModule kop={kop} />}
{activeModule === 'writer' && <WriterModule kop={kop} />}
{activeModule === 'vision' && <VisionModule kop={kop} />}
{activeModule === 'chat' && <ChatArea ... />}
{activeModule === 'dasbor' && <DasborModule kop={kop} />}
```

---

## Phase 5 — Shared Components Upgrade

> **Goal:** Komponen shared yang lebih reusable antara ModeA dan ModeB.  
> **Estimasi:** 2 jam

### 5.1 Buat `ConversationSidebar.tsx`

Props yang di-accept:
```tsx
interface ConversationSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  accentColor: string; // '#b5f23d' untuk ModeA, '#f77f00' untuk ModeB
  title?: string;
}
```

Dipakai oleh **kedua** ModeA dan ModeB — tidak duplikat lagi.

### 5.2 Buat `EmptyState.tsx`

Welcome screen saat belum ada conversation:
```tsx
interface EmptyStateProps {
  moduleLabel: string;
  prompts: string[];
  onPromptClick: (prompt: string) => void;
  accentColor: string;
  mascotEmoji?: string;
}
```

### 5.3 Upgrade `MessageSkeleton.tsx`

Tambah prop `variant`:
- `'thinking'` → animasi dots (sudah ada)
- `'analyzing'` → label "Menganalisis gambar..." untuk vision module
- `'generating'` → label "Membuat dokumen..." untuk writer/dokumen module

```tsx
interface MessageSkeletonProps {
  variant?: 'thinking' | 'analyzing' | 'generating';
  accentColor?: string; // support orange untuk ModeB
}
```

---

## Phase 6 — ModeA Slim Down

> **Goal:** Pecah ModeA sidebar dan right panel ke sub-components.  
> **Estimasi:** 2–3 jam

### 6.1 Buat `ModuleSelector.tsx`

Sidebar module list untuk ModeA.

Props:
```tsx
interface ModuleSelectorProps {
  modules: GroAIModule[];
  activeModule: GroAIModule;
  onSelect: (mod: GroAIModule) => void;
}
```

### 6.2 Buat `ProductPanel.tsx`

Right panel rekomendasi produk ModeA.

Props:
```tsx
interface ProductPanelProps {
  products: MockProduct[];
  moduleId: string;
  visible: boolean;
}
```

Logic filter produk by module tetap di constant/util, bukan inline.

### 6.3 Update `GroAIModeA.tsx`

Setelah ekstrak, ModeA cukup orchestrate:
- Sidebar kiri: `<ModuleSelector>` + `<ConversationSidebar>`
- Main: `<ChatArea>` dengan `<ChatInput>` dan messages
- Sidebar kanan: `<ProductPanel>`

---

## Phase 7 — Polish & Final QA

> **Goal:** Production-ready secara keseluruhan.  
> **Estimasi:** 2 jam

### 7.1 Performance

- Tambah `useCallback` di semua handler yang di-pass sebagai props
- Tambah `useMemo` untuk `filteredConversations` dan `filteredTopics`
- Pastikan tidak ada re-render berlebihan saat typing di chat input

```tsx
// Contoh di ModeA
const sendMessage = useCallback(async (text: string, image?: string) => {
  // ...
}, [activeModule, activeConversationId, activeConversation, createConversation, appendMessage, groAICall]);
```

### 7.2 Accessibility

- Semua button punya `aria-label` yang deskriptif
- Chat input punya `aria-label="Ketik pesan ke Gro AI"`
- Loading state ada `aria-live="polite"` region
- Keyboard navigation: `Tab` bisa masuk ke semua interaksi
- Escape menutup sidebar di mobile

### 7.3 Error Handling yang Lengkap

Setiap AI call punya 3 error state:
1. **Network error** → "Koneksi bermasalah. [Coba lagi]"
2. **Timeout (>30 detik)** → "Gro AI lambat merespons. [Coba lagi]"
3. **API error (4xx/5xx)** → "Gro AI sedang sibuk. Coba beberapa saat lagi."

Tombol "Coba lagi" langsung trigger ulang request yang sama.

### 7.4 Mobile Responsiveness Check

- Sidebar gesture swipe to close (left/right)
- Chat input tidak tertutup keyboard virtual
- Product card scroll horizontal di mobile
- Module nav scroll horizontal di mobile ModeB

### 7.5 Cleanup

Hapus file-file ini setelah semua phase selesai:
- `src/components/GroAIModeA_new.tsx`
- `src/components/GroAIModeB_new.tsx`
- `src/components/_cleanup_and_check.ps1`

---

## Urutan Eksekusi yang Disarankan

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7
```

Phase 1–3 bisa dikerjakan tanpa risiko breaking change visual.  
Phase 4–6 adalah refactor komponen — lakukan satu phase selesai dulu, test, baru lanjut.  
Phase 7 adalah finishing.

---

## Checklist Per Phase

### Phase 1
- [ ] Fix asset path di `GroAIPage.tsx`
- [ ] `MarkdownRenderer` support h3, blockquote, table, nested list, link
- [ ] `groai-client.ts` — retry + abort + timeout + typed errors
- [ ] `groai-prompts.ts` — inject user name/location ke Mode A
- [ ] `useGroAICall.ts` hook baru

### Phase 2
- [ ] `useConversations` dengan localStorage + limit 20
- [ ] `deleteConversation` + `clearAll` tersedia
- [ ] Delete button di sidebar UI (hover state)

### Phase 3
- [ ] `gro-ai-calc-fields.ts` terpisah
- [ ] `gro-ai-dok-fields.ts` terpisah
- [ ] `gro-ai-writer-fields.ts` terpisah
- [ ] `types/gro-ai.ts` export `FieldDef`
- [ ] Import di `GroAIModeB.tsx` diupdate

### Phase 4
- [ ] `KalkulatorModule.tsx` ekstrak + pakai `useGroAICall`
- [ ] `DokumenModule.tsx` ekstrak
- [ ] `WriterModule.tsx` ekstrak
- [ ] `VisionModule.tsx` ekstrak
- [ ] `GroAIModeB.tsx` slim down ke ~200 baris
- [ ] Fix asset: pakai `sidebar-kiri-b.png` bukan `sidebar-kiri-a.png`

### Phase 5
- [ ] `ConversationSidebar.tsx` shared
- [ ] `EmptyState.tsx` shared
- [ ] `MessageSkeleton` variant + accentColor prop

### Phase 6
- [ ] `ModuleSelector.tsx` ekstrak dari ModeA
- [ ] `ProductPanel.tsx` ekstrak dari ModeA
- [ ] `GroAIModeA.tsx` slim down ke ~200 baris

### Phase 7
- [ ] `useCallback`/`useMemo` di semua handler
- [ ] Semua button punya `aria-label`
- [ ] 3 error state di semua AI call
- [ ] Mobile swipe gesture sidebar
- [ ] Hapus file `_new` dan `.ps1`
- [ ] Build production `npm run build` — zero errors/warnings

---

## Catatan Penting

**Kenapa ModeB pakai `sidebar-kiri-a.png`?**  
Di `GroAIModeB.tsx` baris 13: `import sidebarKiriImg from '../assets/sidebar-kiri-a.png'`  
Ini harus diganti ke `sidebar-kiri-b.png` (kalau belum ada, perlu dibuat/ditambahkan assetnya).

**AI sudah work sekarang** — `callGroAI` di `groai-client.ts` sudah real API call.  
Phase 1–7 ini bukan untuk bikin AI work dari nol, tapi untuk memastikannya **reliable, maintainable, dan tidak crash** di edge cases.

**Mock data (SAMPLE_KOPERASI, MOCK_PRODUCTS)** tetap dipakai karena konfirmasi sebelumnya.  
Logic di dalamnya sudah diasumsikan benar. Yang perlu dijaga adalah agar mock data tidak bocor ke system prompt AI sebagai "fakta nyata" — system prompt harus frame sebagai "contoh koperasi" bukan data real.
