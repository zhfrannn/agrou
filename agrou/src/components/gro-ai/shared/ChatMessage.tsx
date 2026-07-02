import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import type { ChatMessage as ChatMessageType } from "../../../types/gro-ai";

interface ChatMessageProps {
  message: ChatMessageType;
  accentColor?: string;
  userName?: string;
  userInitial?: string;
  isLast?: boolean;
}

export function ChatMessageBubble({
  message,
  accentColor = "#b3cc04",
  userName = "Kamu",
  userInitial = "K",
  isLast = false,
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div className="flex gap-3 px-4 py-3 justify-end">
        <div className="max-w-[80%] space-y-1">
          {message.image && (
            <img
              src={message.image}
              alt="Upload"
              className="w-full max-w-xs rounded-xl border border-white/10 mb-1"
            />
          )}
          <div
            className="px-3.5 py-2.5 rounded-2xl rounded-tr-sm text-white text-sm leading-relaxed"
            style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}30` }}
          >
            {message.content}
          </div>
        </div>
        <div
          className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[11px] font-black mt-0.5"
          style={{ background: `${accentColor}22`, color: accentColor, border: `1px solid ${accentColor}40` }}
        >
          {userInitial}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 px-4 py-3 group">
      <div
        className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[11px] mt-0.5"
        style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}30` }}
      >
        🌱
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-bold text-xs" style={{ color: accentColor }}>
            Gro AI
          </span>
        </div>
        <div className="bg-white/5 border border-white/8 rounded-2xl rounded-tl-sm px-3.5 py-2.5">
          <MarkdownRenderer content={message.content} />
        </div>
        {/* Copy button — hanya tampil saat hover */}
        <button
          onClick={handleCopy}
          className="mt-1.5 flex items-center gap-1 text-white/30 hover:text-white/60 text-[10px] transition-colors opacity-0 group-hover:opacity-100"
        >
          {copied ? <Check size={10} /> : <Copy size={10} />}
          {copied ? "Tersalin" : "Salin"}
        </button>
      </div>
    </div>
  );
}
