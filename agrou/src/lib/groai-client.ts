// ── Gro AI API Client ─────────────────────────────────────────────────────────
// Single source of truth untuk semua komunikasi dengan Cloudflare Worker

const WORKER_BASE =
  import.meta.env.VITE_WORKER_URL ?? "https://agrou-worker.agrou.workers.dev";

const WORKER_URL = `${WORKER_BASE}/api/chat`;

export interface GroAIChatRequest {
  message: string;
  systemPrompt: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
}

export interface GroAIChatResponse {
  reply: string;
}

/**
 * Kirim pesan ke Gro AI Cloudflare Worker dan kembalikan reply-nya.
 * Throws Error jika network gagal atau status bukan 2xx.
 */
export async function callGroAI(req: GroAIChatRequest): Promise<GroAIChatResponse> {
  const res = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: req.message,
      systemPrompt: req.systemPrompt,
      history: req.history ?? [],
    }),
  });

  if (!res.ok) {
    throw new Error(`Gro AI worker responded with status ${res.status}`);
  }

  const data = await res.json();
  const reply = data.reply ?? data.content;

  if (!reply) {
    throw new Error("Gro AI returned an empty response");
  }

  return { reply };
}
