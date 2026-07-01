import { useState, useCallback, useRef } from "react";
import { callGroAI } from "../lib/groai-client";
import type { ChatMessage } from "../types/gro-ai";

interface UseGroAIChatOptions {
  systemPrompt: string;
}

interface UseGroAIChatReturn {
  loading: boolean;
  error: string | null;
  sendMessage: (text: string, history: ChatMessage[]) => Promise<string | null>;
  retry: () => Promise<string | null>;
  clearError: () => void;
}

/**
 * Hook untuk mengirim pesan ke Gro AI dan mengelola loading/error state.
 * Mengembalikan reply sebagai string, atau null jika gagal.
 */
export function useGroAIChat({ systemPrompt }: UseGroAIChatOptions): UseGroAIChatReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simpan last request untuk retry
  const lastRequestRef = useRef<{ text: string; history: ChatMessage[] } | null>(null);

  const sendMessage = useCallback(
    async (text: string, history: ChatMessage[]): Promise<string | null> => {
      if (!text.trim()) return null;

      lastRequestRef.current = { text, history };
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
        return result.reply;
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "Koneksi ke Gro AI bermasalah. Coba lagi.";
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [systemPrompt]
  );

  const retry = useCallback(async (): Promise<string | null> => {
    if (!lastRequestRef.current) return null;
    const { text, history } = lastRequestRef.current;
    return sendMessage(text, history);
  }, [sendMessage]);

  const clearError = useCallback(() => setError(null), []);

  return { loading, error, sendMessage, retry, clearError };
}
