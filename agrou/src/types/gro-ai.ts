// ── Gro AI Shared Types ───────────────────────────────────────────────────────

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

export interface MockProduct {
  id: number;
  name: string;
  category: string;
  price: string;
  unit: string;
  rating: number;
  sold: string;
  badge: string | null;
}

export type ModuleId =
  "dasbor" | "chat" | "kalkulator" | "dokumen" | "writer" | "vision";
export type CalcType = "logistik" | "proyeksi" | "bea" | "breakeven";
export type DokType = "phyto" | "coo" | "invoice" | "packing";
export type WriterType = "proposal" | "email" | "katalog" | "press";
