// ─── Cloudflare Worker: Agrou AI Proxy ───────────────────────────────────────
// Proxies all AI requests to Anthropic Claude so the API key never reaches the browser.
// Routes:
//   POST /api/chat     — GroAI general farming assistant
//   POST /api/diagnose — DiagnosisChatbot plant disease expert

export interface Env {
  ANTHROPIC_API_KEY: string;
  ALLOWED_ORIGINS: string;
  // Optional KV for rate limiting — uncomment in wrangler.toml to enable
  // RATE_LIMIT_KV: KVNamespace
}

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_MODEL = "claude-sonnet-4-6";

// ─── CORS ─────────────────────────────────────────────────────────────────────

function getAllowedOrigins(env: Env): string[] {
  if (env.ALLOWED_ORIGINS) {
    return env.ALLOWED_ORIGINS.split(",")
      .map((o) => o.trim())
      .filter(Boolean);
  }
  return ["http://localhost:3000", "https://agrou.pages.dev"];
}

function corsHeaders(
  origin: string,
  allowedOrigins: string[],
): Record<string, string> {
  const allowed = allowedOrigins.includes(origin)
    ? origin
    : (allowedOrigins[0] ?? "");
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function json(
  body: unknown,
  status: number,
  headers: Record<string, string>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}

// ─── Rate Limiting (optional KV-backed) ──────────────────────────────────────
// Uncomment when RATE_LIMIT_KV is configured in wrangler.toml

// async function checkRateLimit(
//   kv: KVNamespace,
//   ip: string,
//   limit = 20,
// ): Promise<boolean> {
//   const key = `rl:${ip}`
//   const current = parseInt((await kv.get(key)) ?? '0', 10)
//   if (current >= limit) return false
//   await kv.put(key, String(current + 1), { expirationTtl: 60 })
//   return true
// }

// ─── Input Validation ─────────────────────────────────────────────────────────

function sanitize(str: unknown, maxLen = 2000): string {
  if (typeof str !== "string") return "";
  return str.slice(0, maxLen).trim();
}

interface ChatHistory {
  role: "user" | "assistant";
  content: string;
}

// ─── Anthropic Message Content Types ─────────────────────────────────────────

type TextBlock = { type: "text"; text: string };
type ImageBlock = {
  type: "image";
  source: { type: "base64"; media_type: string; data: string };
};
type ContentBlock = TextBlock | ImageBlock;

interface AnthropicMessage {
  role: "user" | "assistant";
  content: string | ContentBlock[];
}

// ─── Anthropic Helper ─────────────────────────────────────────────────────────

async function callAnthropic(
  apiKey: string,
  systemPrompt: string,
  messages: AnthropicMessage[],
  maxTokens = 1024,
): Promise<string> {
  const body = {
    model: ANTHROPIC_MODEL,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages,
  };

  const res = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "unknown");
    throw new Error(`Anthropic API error ${res.status}: ${errText}`);
  }

  const data = (await res.json()) as {
    content?: { type: string; text?: string }[];
  };

  return (
    data.content?.find((b) => b.type === "text")?.text ??
    "Maaf, tidak bisa memproses permintaan saat ini."
  );
}

// ─── Route Handlers ───────────────────────────────────────────────────────────

async function handleChat(
  request: Request,
  env: Env,
  headers: Record<string, string>,
): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Request body harus berupa JSON." }, 400, headers);
  }

  const {
    message,
    history,
    module: moduleId,
    image,
  } = body as {
    message?: unknown;
    history?: unknown;
    module?: unknown;
    image?: unknown;
  };

  const msg = sanitize(message);
  if (!msg && !image) {
    return json(
      { error: 'Field "message" atau "image" wajib diisi.' },
      400,
      headers,
    );
  }

  // Keep last 8 turns of history
  const rawHistory = Array.isArray(history) ? history : [];
  const safeHistory: ChatHistory[] = rawHistory
    .slice(-8)
    .filter(
      (h): h is ChatHistory =>
        h !== null &&
        typeof h === "object" &&
        (h.role === "user" || h.role === "assistant") &&
        typeof h.content === "string",
    );

  const mod = sanitize(moduleId, 100);

  const systemPrompt = `Kamu adalah Gro AI, asisten pertanian dan perikanan cerdas dari platform Agrou Indonesia.

Tugasmu:
1. Diagnosis masalah tanaman, lahan, hama, dan budidaya perikanan
2. Berikan rekomendasi solusi yang praktis dan spesifik
3. Rekomendasikan produk yang tersedia di Agrou Tani (pestisida, pupuk, benih, probiotik)
4. Gunakan bahasa Indonesia yang ramah dan mudah dipahami petani

Format responmu SELALU dalam struktur ini:
**🔍 Diagnosis:**
[Analisis masalah]

**⚠️ Tingkat Urgensi:** [Rendah/Sedang/Tinggi/Kritis]

**✅ Langkah Penanganan:**
1. [Langkah 1]
2. [Langkah 2]
3. [Langkah 3]

**🛒 Produk Rekomendasi di Agrou Tani:**
- [Nama produk 1] — [alasan]
- [Nama produk 2] — [alasan]

**💡 Tips Pencegahan:**
[Tips singkat]

Selalu berikan jawaban yang actionable dan spesifik.${mod ? `\nModul aktif saat ini: ${mod}` : ""}`;

  // Build Anthropic messages array from history + new user message
  const anthropicMessages: AnthropicMessage[] = safeHistory.map((h) => ({
    role: h.role,
    content: h.content,
  }));

  // Build user content — include image if provided
  const userContent: ContentBlock[] = [];

  if (typeof image === "string" && image.startsWith("data:")) {
    const match = image.match(/^data:(image\/[a-z+]+);base64,(.+)$/);
    if (match) {
      userContent.push({
        type: "image",
        source: {
          type: "base64",
          media_type: match[1],
          data: match[2],
        },
      });
    }
  }

  userContent.push({
    type: "text",
    text: msg || "Tolong analisis gambar ini dan berikan diagnosis.",
  });

  anthropicMessages.push({ role: "user", content: userContent });

  try {
    const reply = await callAnthropic(
      env.ANTHROPIC_API_KEY,
      systemPrompt,
      anthropicMessages,
    );
    return json({ reply }, 200, headers);
  } catch (err) {
    console.error("[handleChat]", err);
    return json(
      { error: "Layanan Gro AI tidak tersedia saat ini." },
      500,
      headers,
    );
  }
}

async function handleDiagnose(
  request: Request,
  env: Env,
  headers: Record<string, string>,
): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Request body harus berupa JSON." }, 400, headers);
  }

  const { message, cropType } = body as {
    message?: unknown;
    cropType?: unknown;
  };

  const msg = sanitize(message);
  if (!msg) {
    return json({ error: 'Field "message" wajib diisi.' }, 400, headers);
  }

  const crop = sanitize(cropType, 100);

  const systemPrompt = `Kamu adalah pakar diagnosis tanaman pertanian Indonesia dengan 20 tahun pengalaman.
${crop ? `Jenis tanaman yang sedang dibahas: ${crop}.` : ""}
Tugasmu adalah membantu petani mengidentifikasi penyakit, hama, dan masalah nutrisi tanaman.
Berikan diagnosa yang akurat, solusi praktis, dan rekomendasi produk yang actionable dalam Bahasa Indonesia.
Struktur jawaban: 1) Identifikasi masalah, 2) Penyebab, 3) Solusi dan penanganan, 4) Pencegahan.`;

  try {
    const reply = await callAnthropic(
      env.ANTHROPIC_API_KEY,
      systemPrompt,
      [{ role: "user", content: msg }],
      1024,
    );
    return json({ reply }, 200, headers);
  } catch (err) {
    console.error("[handleDiagnose]", err);
    return json(
      { error: "Layanan diagnosis tidak tersedia saat ini." },
      500,
      headers,
    );
  }
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin") ?? "";
    const allowedOrigins = getAllowedOrigins(env);
    const headers = corsHeaders(origin, allowedOrigins);

    // Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    // Only POST allowed on actual routes
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, headers);
    }

    const url = new URL(request.url);

    if (url.pathname === "/api/chat") {
      return handleChat(request, env, headers);
    }

    if (url.pathname === "/api/diagnose") {
      return handleDiagnose(request, env, headers);
    }

    return json({ error: "Not found" }, 404, headers);
  },
};
