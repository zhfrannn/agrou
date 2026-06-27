# Phase 4 — Cloudflare Integration & AI Security

> **Estimasi waktu:** 3–4 jam
> **Depends on:** Phase 0 selesai
> **Goal:** Pindahkan semua AI API calls ke Cloudflare Worker, setup CDN, amankan API keys

---

## 4.1 Kenapa Cloudflare Worker untuk AI?

Saat ini `GroAIPage.tsx` dan `DiagnosisChatbot.tsx` memanggil Gemini API **langsung dari browser**.
Ini artinya API key visible di:
- Network tab browser DevTools
- JavaScript bundle yang bisa di-inspect siapapun
- `VITE_*` env vars yang di-bundle ke client

Solusi: semua request ke Gemini/AI harus melalui **Cloudflare Worker** sebagai proxy.
Worker menyimpan API key di `wrangler secret`, tidak pernah expose ke client.

---

## 4.2 Setup Cloudflare Account & Wrangler

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login ke Cloudflare
wrangler login

# Verifikasi
wrangler whoami
```

---

## 4.3 Buat Cloudflare Worker Project

```bash
# Buat folder worker di root project
mkdir agrou-worker
cd agrou-worker

# Init worker project
wrangler init agrou-ai-worker --no-delegate-c3
```

**Struktur folder:**
```
agrou-worker/
├── src/
│   └── index.ts       # Worker entry point
├── wrangler.toml
└── package.json
```

---

## 4.4 `wrangler.toml` Config

```toml
name = "agrou-ai-worker"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[vars]
ALLOWED_ORIGIN = "https://agrou.pages.dev"

# Secrets (jangan taruh di sini, gunakan: wrangler secret put GEMINI_API_KEY)
# GEMINI_API_KEY = "..."
```

---

## 4.5 Worker: AI Proxy (`src/index.ts`)

```typescript
export interface Env {
  GEMINI_API_KEY: string
  ALLOWED_ORIGIN: string
}

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://agrou.pages.dev',
]

function corsHeaders(origin: string) {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') ?? ''
    const headers = corsHeaders(origin)

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers })
    }

    const url = new URL(request.url)

    // Route: POST /api/chat — GroAI general chat
    if (url.pathname === '/api/chat' && request.method === 'POST') {
      return handleChat(request, env, headers)
    }

    // Route: POST /api/diagnose — DiagnosisChatbot (Agrou Shield)
    if (url.pathname === '/api/diagnose' && request.method === 'POST') {
      return handleDiagnose(request, env, headers)
    }

    return new Response('Not Found', { status: 404 })
  },
}

async function handleChat(request: Request, env: Env, headers: Record<string, string>): Promise<Response> {
  try {
    const { message, history } = await request.json() as {
      message: string
      history: Array<{ role: string; content: string }>
    }

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Message required' }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
      })
    }

    // Sanitize: max message length
    const sanitizedMessage = message.slice(0, 2000)

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{
              text: `Kamu adalah Gro, asisten AI pertanian dari platform Agrou Indonesia.
                     Kamu membantu petani, koperasi, dan pembeli produk pertanian.
                     Jawab dalam Bahasa Indonesia yang ramah dan mudah dipahami.
                     Fokus pada topik pertanian, perkebunan, perikanan, dan agribisnis.`
            }]
          },
          contents: [
            ...history.slice(-10).map((h: any) => ({
              role: h.role === 'user' ? 'user' : 'model',
              parts: [{ text: h.content }],
            })),
            { role: 'user', parts: [{ text: sanitizedMessage }] },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      }
    )

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.status}`)
    }

    const geminiData = await geminiResponse.json() as any
    const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Maaf, tidak bisa memproses permintaan.'

    return new Response(JSON.stringify({ reply }), {
      headers: { ...headers, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
    })
  }
}

async function handleDiagnose(request: Request, env: Env, headers: Record<string, string>): Promise<Response> {
  try {
    const { message, cropType } = await request.json() as {
      message: string
      cropType?: string
    }

    const sanitizedMessage = message.slice(0, 2000)

    const prompt = `Kamu adalah pakar diagnosis tanaman pertanian Indonesia.
      ${cropType ? `Jenis tanaman yang sedang dibahas: ${cropType}.` : ''}
      Bantu petani mengidentifikasi penyakit, hama, dan solusinya.
      Berikan jawaban praktis dan actionable dalam Bahasa Indonesia.`

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: prompt }] },
          contents: [{ role: 'user', parts: [{ text: sanitizedMessage }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 800 },
        }),
      }
    )

    const geminiData = await geminiResponse.json() as any
    const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Tidak bisa memproses diagnosis.'

    return new Response(JSON.stringify({ reply }), {
      headers: { ...headers, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
    })
  }
}
```

---

## 4.6 Deploy & Set Secret

```bash
cd agrou-worker

# Set API key sebagai secret (tidak masuk ke code/git)
wrangler secret put GEMINI_API_KEY
# > Enter value: [paste key here]

# Deploy ke Cloudflare
wrangler deploy

# Output: https://agrou-ai-worker.YOUR_SUBDOMAIN.workers.dev
```

---

## 4.7 Update Frontend: GroAIPage.tsx

Ganti direct Gemini call dengan call ke Worker:

```typescript
// SEBELUM (BAHAYA):
import { GoogleGenerativeAI } from '@google/genai'
const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

// SESUDAH (AMAN):
const WORKER_URL = import.meta.env.VITE_WORKER_URL // https://agrou-ai-worker.xxx.workers.dev

async function sendMessage(message: string, history: ChatMessage[]) {
  const response = await fetch(`${WORKER_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  })

  if (!response.ok) throw new Error('AI service unavailable')

  const { reply } = await response.json()
  return reply
}
```

---

## 4.8 Update Frontend: DiagnosisChatbot.tsx

```typescript
async function diagnose(message: string, cropType?: string) {
  const response = await fetch(`${WORKER_URL}/api/diagnose`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, cropType }),
  })

  if (!response.ok) throw new Error('Diagnosis service unavailable')

  const { reply } = await response.json()
  return reply
}
```

---

## 4.9 Tambahkan ke `agrou/.env.local`

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_WORKER_URL=https://agrou-ai-worker.YOUR_SUBDOMAIN.workers.dev
```

> **Catatan:** `VITE_WORKER_URL` boleh public — itu hanya URL endpoint, bukan secret.
> Secret (GEMINI_API_KEY) ada di Cloudflare Worker environment, tidak pernah ke client.

---

## 4.10 Rate Limiting di Worker (Opsional tapi Direkomendasikan)

Tambahkan basic rate limiting menggunakan Cloudflare KV:

```toml
# wrangler.toml — tambahkan:
[[kv_namespaces]]
binding = "RATE_LIMIT_KV"
id = "YOUR_KV_NAMESPACE_ID"
```

```typescript
// Di worker, sebelum handle request:
async function checkRateLimit(env: Env & { RATE_LIMIT_KV: KVNamespace }, ip: string): Promise<boolean> {
  const key = `rate:${ip}`
  const current = parseInt(await env.RATE_LIMIT_KV.get(key) ?? '0')
  if (current >= 20) return false // max 20 request per menit
  await env.RATE_LIMIT_KV.put(key, String(current + 1), { expirationTtl: 60 })
  return true
}
```

---

## 4.11 Cloudflare Pages (Deployment Frontend)

Deploy Vite app ke Cloudflare Pages:

```bash
cd agrou

# Build
npm run build

# Deploy via Wrangler
wrangler pages deploy dist --project-name agrou
```

Atau setup via Cloudflare Dashboard → Pages → Connect Git Repo:
- Build command: `npm run build`
- Build output: `dist`
- Root directory: `agrou`

**Environment variables di Cloudflare Pages:**
```
VITE_SUPABASE_URL = https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY = eyJ...
VITE_WORKER_URL = https://agrou-ai-worker.xxx.workers.dev
```

---

## 4.12 Hapus `@google/genai` dari Frontend

Setelah Worker sudah berjalan dan frontend sudah tidak langsung call Gemini:

```bash
cd agrou
npm uninstall @google/genai
```

Juga hapus `dotenv` dan `express` dari `agrou/package.json` — itu untuk server-side yang tidak dipakai di Vite SPA:

```bash
npm uninstall dotenv express
```

---

## Checklist Phase 4

- [ ] Install Wrangler CLI
- [ ] Login ke Cloudflare
- [ ] Buat folder `agrou-worker/` dengan struktur yang benar
- [ ] Tulis `wrangler.toml`
- [ ] Tulis Worker `src/index.ts` dengan route `/api/chat` dan `/api/diagnose`
- [ ] `wrangler secret put GEMINI_API_KEY`
- [ ] `wrangler deploy` — Worker live
- [ ] Tambahkan `VITE_WORKER_URL` ke `agrou/.env.local`
- [ ] Update `GroAIPage.tsx` — hapus direct Gemini call, pakai Worker URL
- [ ] Update `DiagnosisChatbot.tsx` — hapus direct Gemini call, pakai Worker URL
- [ ] Test: chat di GroAI berfungsi via Worker
- [ ] Test: DiagnosisChatbot berfungsi via Worker
- [ ] Hapus `console.log(import.meta.env.VITE_ANTHROPIC_API_KEY)` dari `App.tsx`
- [ ] Uninstall `@google/genai`, `dotenv`, `express` dari `agrou/`
- [ ] Deploy frontend ke Cloudflare Pages
- [ ] Set environment variables di Cloudflare Pages dashboard

## Deliverable Phase 4

Tidak ada API key yang exposed di frontend. Semua AI calls berjalan melalui Cloudflare Worker. App ter-deploy di Cloudflare Pages.
