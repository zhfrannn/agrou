# Gro AI — Production Ready Refactor Plan

> **Status:** Implementation Plan (belum dieksekusi)  
> **Target:** `GroAIPage.tsx`, `GroAIModeA.tsx`, `GroAIModeB.tsx`  
> **Total LOC saat ini:** 943 (Mode A) + 2330 (Mode B) + ~130 (Page) = **~3400 baris**  
> **Target setelah refactor:** < 800 baris per mode, modular, zero hardcode

---

## Ringkasan Masalah Saat Ini

| Problem | Mode A | Mode B |
|---|---|---|
| File monolitik, semua dalam 1 file | ✅ 943 baris | ✅ 2330 baris |
| Data hardcoded di dalam komponen | MODULES, MOCK_PRODUCTS | KOPERASI, CHAT_TOPICS, semua calc result |
| State management flat & tidak terstruktur | 8+ state vars | 20+ state vars |
| System prompt inline di dalam `sendMessage` | ✅ | ✅ |
| `WORKER_URL` didefinisi ulang tiap render / tiap fungsi | ✅ | ✅ |
| Mock data & AI logic dicampur (getMockReply, runCalc, runDokumen hardcoded) | - | ✅ |
| `SidebarContent` & `RightPanelContent` sebagai inline component (re-render issue) | ✅ | ✅ |
| Role type inconsistency (`"ai"` vs `"assistant"`) | - | ✅ Mode B pakai `"ai"` |
| Tidak ada error boundary / retry mechanism | ✅ | ✅ |
| Tidak ada loading skeleton, hanya `Loader2` spinner | ✅ | ✅ |
| `useEffect` deps tidak lengkap | partial | partial |
| Asset path hardcoded `/src/assets/...` (tidak valid di production build) | ✅ | ✅ |

---

## Struktur File Target

```
src/
├── components/
│   ├── GroAIPage.tsx              # Mode selector (minimal, sudah oke)
│   ├── gro-ai/
│   │   ├── mode-a/
│   │   │   ├── GroAIModeA.tsx     # Komponen utama (shell only, ~150 baris)
│   │   │   ├── ModeASidebar.tsx   # Sidebar + conversation list
│   │   │   ├── ModeAChatArea.tsx  # Chat messages + input
│   │   │   └── ModeARightPanel.tsx# Product recommendations panel
│   │   ├── mode-b/
│   │   │   ├── GroAIModeB.tsx     # Komponen utama (shell only, ~150 baris)
│   │   │   ├── ModeBSidebar.tsx   # Sidebar + koperasi selector
│   │   │   ├── ModeBDashboard.tsx # Dasbor export readiness
│   │   │   ├── ModeBChat.tsx      # AI Chat module
│   │   │   ├── ModeBKalkulator.tsx# AI Kalkulator module
│   │   │   ├── ModeBDokumen.tsx   # AI Dokumen generator
│   │   │   ├── ModeBWriter.tsx    # AI Writer module
│   │   │   └── ModeBVision.tsx    # AI Vision module
│   │   └── shared/
│   │       ├── ChatMessage.tsx    # Shared message bubble component
│   │       ├── ChatInput.tsx      # Shared textarea + send button
│   │       ├── MessageSkeleton.tsx# Loading skeleton untuk AI response
│   │       └── MarkdownRenderer.tsx# Render bold/italic/list dari AI output
│
├── hooks/
│   ├── useGroAIChat.ts            # Shared AI chat hook (fetch + state)
│   └── useConversations.ts        # Conversation CRUD hook
│
├── lib/
│   ├── groai-client.ts            # Centralized API client (WORKER_URL, fetch)
│   └── groai-prompts.ts           # Semua system prompt sebagai pure functions
│
├── constants/
│   ├── gro-ai-modules.ts          # MODULES data untuk Mode A
│   ├── gro-ai-topics.ts           # CHAT_TOPICS data untuk Mode B
│   └── gro-ai-koperasi.ts         # KOPERASI sample data (dev only)
│
└── types/
    └── gro-ai.ts                  # Semua TypeScript interfaces & types
```

---

## Phase 1 — Types & Constants (Fondasi)

**File yang dibuat:** `src/types/gro-ai.ts`, `src/constants/gro-ai-modules.ts`, `src/constants/gro-ai-topics.ts`, `src/constants/gro-ai-koperasi.ts`

### 1.1 `src/types/gro-ai.ts`

Definisikan semua shared types:

```ts
export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  role: MessageRole;
  content: string;
  image?: string;
}

export interface Conversation {
  id: string;
  title: string;
  moduleId: string;
  messages: ChatMessage[];
  timestamp: string;
}

export interface GroAIModule {
  id: string;
  icon: string;
  label: string;
  desc: string;
  prompts: string[];
}

export interface Koperasi {
  id: number;
  name: string;
  komoditas: string;
  loc: string;
  volume: string;
  targets: string;
  cert: string;
  price: string;
  anggota: number;
  bergabung: string;
  tags: string[];
  exportScore: number;
  scoreBreakdown: Record<string, number>;
}

export interface ChatTopic {
  id: string;
  category: string;
  icon: string;
  title: string;
  desc: string;
  prompts: string[];
}

export type ModuleId = "dasbor" | "chat" | "kalkulator" | "dokumen" | "writer" | "vision";
export type CalcType = "logistik" | "proyeksi" | "bea" | "breakeven";
export type DokType = "phyto" | "coo" | "invoice" | "packing";
export type WriterType = "proposal" | "email" | "katalog" | "press";
```

### 1.2 `src/constants/gro-ai-modules.ts`

Pindahkan `MODULES` array dari `GroAIModeA.tsx` ke sini. Hapus dari komponen.

### 1.3 `src/constants/gro-ai-topics.ts`

Pindahkan `CHAT_TOPICS` array dari `GroAIModeB.tsx` ke sini.

### 1.4 `src/constants/gro-ai-koperasi.ts`

Pindahkan `KOPERASI` array dari `GroAIModeB.tsx` ke sini.  
**Catatan:** Ini adalah sample/mock data untuk development. Tandai dengan komentar `// TODO: replace with API call`.

---

## Phase 2 — API Client & Prompts

**File yang dibuat:** `src/lib/groai-client.ts`, `src/lib/groai-prompts.ts`

### 2.1 `src/lib/groai-client.ts`

Centralize semua fetch logic. `WORKER_URL` hanya didefinisi **sekali**:

```ts
const WORKER_URL =
  (import.meta.env.VITE_WORKER_URL ?? "https://agrou-worker.agrou.workers.dev") +
  "/api/chat";

export interface GroAIChatRequest {
  message: string;
  systemPrompt: string;
  history: Array<{ role: "user" | "assistant"; content: string }>;
}

export interface GroAIChatResponse {
  reply: string;
}

export async function callGroAI(req: GroAIChatRequest): Promise<GroAIChatResponse> {
  const res = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(`GroAI worker error: ${res.status}`);
  const data = await res.json();
  return { reply: data.reply ?? data.content ?? "Maaf, terjadi kesalahan." };
}
```

**Keuntungan:** Satu titik untuk ganti endpoint, tambah auth header, atau retry logic.

### 2.2 `src/lib/groai-prompts.ts`

Pindahkan semua system prompt keluar dari komponen. System prompt sebagai **pure functions** agar mudah di-test dan di-maintain:

```ts
import type { GroAIModule } from "../types/gro-ai";
import type { Koperasi } from "../types/gro-ai";

export function getModeASystemPrompt(module: GroAIModule): string {
  return `Kamu adalah Gro AI, asisten pertanian dan perikanan cerdas dari platform Agrou Indonesia.
...
Modul aktif: ${module.label}`;
}

export function getModeBChatSystemPrompt(kop: Koperasi, konteks?: string): string {
  return `Kamu adalah Gro AI, konsultan ekspor koperasi Indonesia.
Koperasi: ${kop.name}, komoditas: ${kop.komoditas}, target: ${kop.targets}, sertifikasi: ${kop.cert}.
Jawab dalam Bahasa Indonesia profesional.${konteks ? ` Konteks: ${konteks}` : ""}`;
}

export function getModeBCalcSystemPrompt(kop: Koperasi, calcType: string): string {
  return `Kamu adalah Gro AI, spesialis kalkulasi ekspor. 
Hitung ${calcType} untuk ${kop.name} — ${kop.komoditas} (${kop.volume}, ${kop.price}).
Berikan angka yang realistis dan penjelasan singkat.`;
}

export function getModeBDokumenSystemPrompt(kop: Koperasi, dokType: string, fields: Record<string, string>): string {
  return `Generate dokumen ekspor ${dokType} untuk ${kop.name}.
Data: ${JSON.stringify({ ...fields, komoditas: kop.komoditas, loc: kop.loc })}.
Format sebagai dokumen resmi yang valid.`;
}

export function getModeBWriterSystemPrompt(kop: Koperasi, writerType: string, fields: Record<string, string>): string {
  return `Tulis ${writerType} ekspor profesional untuk ${kop.name} — ${kop.komoditas}.
Data tambahan: ${JSON.stringify(fields)}.
Gunakan bahasa formal dan struktur yang tepat.`;
}
```

**Catatan penting:** Dengan ini, `runCalc`, `runDokumen`, dan `runWriter` di Mode B **tidak lagi hardcoded mock string** — mereka call AI yang sesungguhnya via `callGroAI`. Ini yang membuat page jadi "AI works, output jelas".

---

## Phase 3 — Shared Hooks

**File yang dibuat:** `src/hooks/useGroAIChat.ts`, `src/hooks/useConversations.ts`

### 3.1 `src/hooks/useGroAIChat.ts`

Abstraksi fetch + loading + error state yang dipakai di Mode A dan Mode B:

```ts
import { useState, useCallback } from "react";
import { callGroAI } from "../lib/groai-client";
import type { ChatMessage } from "../types/gro-ai";

interface UseGroAIChatOptions {
  systemPrompt: string;
  onSuccess?: (reply: string) => void;
  onError?: (error: Error) => void;
}

export function useGroAIChat({ systemPrompt, onSuccess, onError }: UseGroAIChatOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (text: string, history: ChatMessage[]) => {
      if (!text.trim()) return;
      setLoading(true);
      setError(null);
      try {
        const result = await callGroAI({
          message: text,
          systemPrompt,
          history: history.slice(-8).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        });
        onSuccess?.(result.reply);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Koneksi ke Gro AI bermasalah.";
        setError(msg);
        onError?.(err instanceof Error ? err : new Error(msg));
      } finally {
        setLoading(false);
      }
    },
    [systemPrompt, onSuccess, onError]
  );

  return { sendMessage, loading, error };
}
```

### 3.2 `src/hooks/useConversations.ts`

Isolasi conversation CRUD yang ada di Mode A (dan versi lain di Mode B):

```ts
import { useState, useCallback } from "react";
import type { Conversation, ChatMessage } from "../types/gro-ai";

export function useConversations(initialModuleId: string) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;

  const createConversation = useCallback((title: string, moduleId: string, firstMessage: ChatMessage) => {
    const id = `chat-${Date.now()}`;
    const conv: Conversation = {
      id,
      title,
      moduleId,
      messages: [firstMessage],
      timestamp: "Baru saja",
    };
    setConversations((prev) => [conv, ...prev]);
    setActiveId(id);
    return id;
  }, []);

  const appendMessage = useCallback((convId: string, message: ChatMessage) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, messages: [...c.messages, message] } : c))
    );
  }, []);

  const deleteConversation = useCallback((convId: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== convId));
    setActiveId((prev) => (prev === convId ? null : prev));
  }, []);

  return {
    conversations,
    activeId,
    setActiveId,
    activeConversation,
    createConversation,
    appendMessage,
    deleteConversation,
  };
}
```

---

## Phase 4 — Shared UI Components

**File yang dibuat:** `src/components/gro-ai/shared/`

### 4.1 `ChatMessage.tsx`

Komponen reusable untuk satu bubble pesan — dipakai di Mode A dan Mode B:

```tsx
interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  image?: string;
  userName?: string;
  userAvatar?: string;
}
```

Fitur:
- Parse markdown sederhana (bold `**`, italic `*`, list `- `, heading `##`)
- Render image preview jika ada
- Copy button untuk pesan AI
- Timestamp relatif

### 4.2 `ChatInput.tsx`

Shared textarea + action bar:
- Auto-resize textarea
- Upload gambar (foto & kamera)
- Preview gambar sebelum kirim
- Disable state saat loading
- Keyboard shortcut: `Enter` kirim, `Shift+Enter` newline

### 4.3 `MessageSkeleton.tsx`

Skeleton loading untuk saat AI sedang berpikir — bukan hanya spinner:

```tsx
// 3 baris animated skeleton dengan lebar yang bervariasi
// Jauh lebih baik UX daripada Loader2 spinner
```

### 4.4 `MarkdownRenderer.tsx`

Simple parser untuk output AI (tidak perlu install `react-markdown`):
- Bold: `**text**` → `<strong>`
- Italic: `*text*` → `<em>`
- List: `- item` → `<li>`
- Header: `**Diagnosis:**` → styled header block
- Kode inline: `` `text` `` → `<code>`

---

## Phase 5 — Refactor Mode A

**File yang diubah/dibuat:**
- `src/components/gro-ai/mode-a/GroAIModeA.tsx` (replace, ~150 baris)
- `src/components/gro-ai/mode-a/ModeASidebar.tsx` (baru, ~120 baris)
- `src/components/gro-ai/mode-a/ModeAChatArea.tsx` (baru, ~180 baris)
- `src/components/gro-ai/mode-a/ModeARightPanel.tsx` (baru, ~100 baris)

### Perubahan kunci Mode A:

1. **`SidebarContent` tidak lagi inline component** — pindah ke `ModeASidebar.tsx` sebagai proper component dengan props
2. **`RightPanelContent` tidak lagi inline** — pindah ke `ModeARightPanel.tsx`
3. **`MOCK_PRODUCTS`** — tetap ada tapi dipindah ke constants, ditandai `// TODO: replace with product API`
4. **`sendMessage`** direfactor menggunakan `useGroAIChat` + `useConversations` hook
5. **Image handling** — dipisahkan ke `ChatInput.tsx` shared component
6. **Asset path diperbaiki** — dari `/src/assets/` ke `import bgImage from "../../../assets/..."` (Vite asset handling)

### Struktur state Mode A setelah refactor:

```ts
// Sebelum: 8+ useState di level komponen
// Sesudah: state dikelompokkan logis

const { conversations, activeId, ... } = useConversations("tanaman");
const { sendMessage, loading } = useGroAIChat({ systemPrompt: getModeASystemPrompt(activeModule) });

const [activeModule, setActiveModule] = useState<GroAIModule>(MODULES[0]);
const [leftOpen, setLeftOpen] = useState(false);
const [rightOpen, setRightOpen] = useState(false);
const [input, setInput] = useState("");
const [imagePreview, setImagePreview] = useState<string | null>(null);
const [showProducts, setShowProducts] = useState(false);
```

---

## Phase 6 — Refactor Mode B (paling besar)

**File yang diubah/dibuat:**
- `src/components/gro-ai/mode-b/GroAIModeB.tsx` (replace, ~180 baris)
- `src/components/gro-ai/mode-b/ModeBSidebar.tsx` (~150 baris)
- `src/components/gro-ai/mode-b/ModeBDashboard.tsx` (~120 baris)
- `src/components/gro-ai/mode-b/ModeBChat.tsx` (~200 baris)
- `src/components/gro-ai/mode-b/ModeBKalkulator.tsx` (~160 baris)
- `src/components/gro-ai/mode-b/ModeBDokumen.tsx` (~160 baris)
- `src/components/gro-ai/mode-b/ModeBWriter.tsx` (~160 baris)
- `src/components/gro-ai/mode-b/ModeBVision.tsx` (~120 baris)

### Perubahan kunci Mode B:

#### 1. Fix role type inconsistency
```ts
// SEBELUM (buggy):
{ role: "ai", content: "..." }       // dalam setMessages
m.role === "ai" ? "assistant" : "user"  // workaround conversion

// SESUDAH (benar):
type MessageRole = "user" | "assistant"; // konsisten di semua tempat
```

#### 2. `getMockReply` dihapus
Mode B saat ini fallback ke `getMockReply` kalau API gagal. Ini harus diganti:
```ts
// SEBELUM:
catch {
  setMessages(prev => [...prev, { role: "ai", content: getMockReply(text, ...) }])
}

// SESUDAH:
catch (err) {
  setMessages(prev => [...prev, { 
    role: "assistant", 
    content: "⚠️ Koneksi ke Gro AI terputus. Periksa koneksi internet dan coba lagi." 
  }])
}
```

#### 3. `runCalc`, `runDokumen`, `runWriter` → Real AI calls
Ini perubahan terbesar. Saat ini ketiga fungsi ini hardcoded template string.
Dengan `groai-prompts.ts` + `callGroAI`, mereka jadi:

```ts
// ModeBKalkulator.tsx
const handleRunCalc = async () => {
  if (!calcType) return;
  setCalcLoading(true);
  try {
    const result = await callGroAI({
      message: `Hitung ${calcType} untuk ekspor ${kop.komoditas}`,
      systemPrompt: getModeBCalcSystemPrompt(kop, calcType),
      history: Object.entries(calcFields).map(([k, v]) => ({
        role: "user" as const,
        content: `${k}: ${v}`,
      })),
    });
    setCalcResult(result.reply);
  } catch {
    setCalcResult("Gagal menghitung. Coba lagi.");
  } finally {
    setCalcLoading(false);
  }
};
```

Sama berlaku untuk `runDokumen` dan `runWriter`.

#### 4. State Mode B dikelompokkan per module
```ts
// SEBELUM: 20+ useState flat di level komponen
// SESUDAH: state per module, hanya aktif saat module-nya aktif

// Di GroAIModeB.tsx (shell):
const [activeModule, setActiveModule] = useState<ModuleId>("dasbor");
const [activeKopId, setActiveKopId] = useState<number>(1);
const [leftOpen, setLeftOpen] = useState(false);
const [rightOpen, setRightOpen] = useState(false);

// State per-module dikelola di dalam komponen module masing-masing
// ModeBKalkulator punya state-nya sendiri
// ModeBDokumen punya state-nya sendiri
// Tidak ada state pollution antar module
```

#### 5. `getMascotSvg` dan `getMascotCircleBg` 
Pindahkan ke `src/components/gro-ai/shared/GroAIMascot.tsx`.

---

## Phase 7 — Fix Asset Paths & Environment

### 7.1 Asset imports
```ts
// SALAH (tidak bekerja di production build):
style={{ backgroundImage: "url('/src/assets/gro-ai-bg.jpg')" }}

// BENAR (Vite asset handling):
import bgImage from "../../assets/gro-ai-bg.jpg";
// ...
style={{ backgroundImage: `url(${bgImage})` }}
```

Berlaku untuk semua background image di Mode A, Mode B, dan Page.

### 7.2 Environment variable
```ts
// .env.local (sudah ada, tidak perlu diubah)
VITE_WORKER_URL=https://agrou-worker.agrou.workers.dev

// groai-client.ts - fallback hanya untuk development
const WORKER_URL = import.meta.env.VITE_WORKER_URL + "/api/chat";
// Jika VITE_WORKER_URL undefined di production → throw error yang jelas
if (!import.meta.env.VITE_WORKER_URL && import.meta.env.PROD) {
  console.error("VITE_WORKER_URL is not set!");
}
```

---

## Phase 8 — Polish & UX

### 8.1 `MarkdownRenderer` untuk output AI
AI output saat ini dirender sebagai plain text. Bold `**Diagnosis:**` tidak di-render.
Implementasi `formatMessage` yang proper akan membuat output AI **jauh lebih terbaca**.

### 8.2 Scroll-to-bottom yang benar
```ts
// SEBELUM: scroll ke bawah setiap kali state apapun berubah
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages, conversations, activeConversationId]); // terlalu broad

// SESUDAH: hanya scroll saat message baru ditambahkan
const messageCount = currentMessages.length;
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messageCount]);
```

### 8.3 `MessageSkeleton` saat AI loading
Ganti `Loader2` spinner dengan skeleton yang lebih informatif:
- 3 baris animated placeholder
- Label "Gro AI sedang menganalisis..."
- Sesuai dengan visual style yang sudah ada

### 8.4 Retry button saat error
```tsx
{error && (
  <div className="flex items-center gap-2 text-red-400 text-xs p-3 bg-red-500/10 rounded-xl">
    <AlertTriangle size={14} />
    <span>{error}</span>
    <button onClick={() => retryLastMessage()} className="ml-auto underline">
      Coba lagi
    </button>
  </div>
)}
```

---

## Urutan Eksekusi Phase

```
Phase 1 (Types & Constants)  ← fondasi, tidak ada visual change
    ↓
Phase 2 (API Client & Prompts) ← AI benar-benar bekerja dari sini
    ↓
Phase 3 (Hooks)              ← logic terisolasi
    ↓
Phase 4 (Shared Components)  ← UI building blocks
    ↓
Phase 5 (Mode A Refactor)    ← Mode A bersih
    ↓
Phase 6 (Mode B Refactor)    ← Mode B bersih (terbesar)
    ↓
Phase 7 (Asset & Env)        ← production build fix
    ↓
Phase 8 (Polish)             ← UX final
```

Setiap phase bisa di-commit terpisah dan tidak merusak phase lainnya.

---

## Yang TIDAK Berubah

- Visual design, warna, animasi — **dipertahankan 100%**
- Flow `GroAIPage.tsx` (mode selector) — **minimal change, hanya fix asset path**
- `useAuth` hook — tidak disentuh
- Semua Tailwind classes — dipertahankan persis
- Framer Motion animations — dipertahankan persis
- `onBack` prop interface — tetap sama

---

## Checklist Sebelum Mulai Eksekusi

- [ ] Pastikan `VITE_WORKER_URL` ada di `.env.local`
- [ ] Confirm: apakah `KOPERASI` data akan tetap hardcoded atau sudah ada API-nya?
- [ ] Confirm: `MOCK_PRODUCTS` di Mode A — tetap mock atau sudah ada endpoint produk?
- [ ] Confirm: apakah ingin tambah `localStorage` persistence untuk conversations?
- [ ] Confirm: mau pakai `react-markdown` / `remark` untuk render AI output, atau custom simple parser?

---

*Dokumen ini adalah rencana implementasi. Eksekusi dilakukan phase by phase setelah konfirmasi.*
