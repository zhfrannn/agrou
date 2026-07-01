import { useState, useCallback, useEffect } from "react";
import type { Conversation, ChatMessage } from "../types/gro-ai";

const STORAGE_KEY = "groai_conversations";

function loadFromStorage(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Conversation[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(conversations: Conversation[]): void {
  try {
    // Simpan max 50 conversation, tiap conversation max 50 pesan
    const trimmed = conversations.slice(0, 50).map((c) => ({
      ...c,
      messages: c.messages.slice(-50),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage penuh atau tidak tersedia, abaikan
  }
}

interface UseConversationsOptions {
  /** Jika diisi, hanya load conversation dengan moduleId ini */
  filterByModuleId?: string;
}

interface UseConversationsReturn {
  conversations: Conversation[];
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  activeConversation: Conversation | null;
  createConversation: (title: string, moduleId: string, firstMessage: ChatMessage) => string;
  appendMessage: (convId: string, message: ChatMessage) => void;
  updateLastMessage: (convId: string, content: string) => void;
  deleteConversation: (convId: string) => void;
  clearAll: () => void;
}

/**
 * Hook untuk mengelola daftar conversation dengan persistence ke localStorage.
 */
export function useConversations(options: UseConversationsOptions = {}): UseConversationsReturn {
  const { filterByModuleId } = options;

  const [allConversations, setAllConversations] = useState<Conversation[]>(loadFromStorage);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Persist ke localStorage setiap kali conversations berubah
  useEffect(() => {
    saveToStorage(allConversations);
  }, [allConversations]);

  // Filter berdasarkan moduleId jika ada
  const conversations = filterByModuleId
    ? allConversations.filter((c) => c.moduleId === filterByModuleId || c.moduleId.startsWith(filterByModuleId))
    : allConversations;

  const activeConversation = allConversations.find((c) => c.id === activeId) ?? null;

  const createConversation = useCallback(
    (title: string, moduleId: string, firstMessage: ChatMessage): string => {
      const id = `conv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const conv: Conversation = {
        id,
        title,
        moduleId,
        messages: [firstMessage],
        timestamp: "Baru saja",
      };
      setAllConversations((prev) => [conv, ...prev]);
      setActiveId(id);
      return id;
    },
    []
  );

  const appendMessage = useCallback((convId: string, message: ChatMessage): void => {
    setAllConversations((prev) =>
      prev.map((c) =>
        c.id === convId ? { ...c, messages: [...c.messages, message] } : c
      )
    );
  }, []);

  /** Update konten pesan terakhir (untuk streaming atau koreksi) */
  const updateLastMessage = useCallback((convId: string, content: string): void => {
    setAllConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;
        const messages = [...c.messages];
        if (messages.length === 0) return c;
        messages[messages.length - 1] = { ...messages[messages.length - 1], content };
        return { ...c, messages };
      })
    );
  }, []);

  const deleteConversation = useCallback((convId: string): void => {
    setAllConversations((prev) => prev.filter((c) => c.id !== convId));
    setActiveId((prev) => (prev === convId ? null : prev));
  }, []);

  const clearAll = useCallback((): void => {
    setAllConversations([]);
    setActiveId(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    conversations,
    activeId,
    setActiveId,
    activeConversation,
    createConversation,
    appendMessage,
    updateLastMessage,
    deleteConversation,
    clearAll,
  };
}
