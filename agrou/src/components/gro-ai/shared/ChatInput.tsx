import React, { useRef, useEffect, type KeyboardEvent } from "react";
import { Send, Camera, Upload, X, Loader2 } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: (text: string, image?: string) => void;
  loading?: boolean;
  imagePreview?: string | null;
  onImageChange?: (dataUrl: string | null) => void;
  placeholder?: string;
  accentColor?: string;
  showImageUpload?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  loading = false,
  imagePreview = null,
  onImageChange,
  placeholder = "Ketik pertanyaanmu...",
  accentColor = "#b3cc04",
  showImageUpload = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [value]);

  const handleSend = () => {
    if (loading || (!value.trim() && !imagePreview)) return;
    onSend(value.trim(), imagePreview ?? undefined);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImageChange) return;
    const reader = new FileReader();
    reader.onloadend = () => onImageChange(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const canSend = !loading && (value.trim().length > 0 || !!imagePreview);

  return (
    <div className="space-y-2">
      {/* Image preview */}
      {imagePreview && (
        <div className="relative inline-block ml-1">
          <img src={imagePreview} alt="Preview" className="h-16 w-auto rounded-lg border border-white/20" />
          <button
            onClick={() => onImageChange?.(null)}
            className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
          >
            <X size={8} className="text-white" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 py-2 focus-within:border-white/20 transition-colors">
        {/* Upload buttons */}
        {showImageUpload && onImageChange && (
          <div className="flex gap-1 pb-0.5 shrink-0">
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/8 transition-colors"
            >
              <Camera size={15} />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/8 transition-colors"
            >
              <Upload size={15} />
            </button>
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={loading}
          rows={1}
          className="flex-1 bg-transparent text-white text-sm placeholder:text-white/30 resize-none outline-none leading-relaxed disabled:opacity-50 py-0.5"
          style={{ scrollbarWidth: "none" }}
        />

        <button
          onClick={handleSend}
          disabled={!canSend}
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 mb-0.5 disabled:opacity-30"
          style={{
            background: canSend ? accentColor : "transparent",
            border: canSend ? "none" : "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {loading ? (
            <Loader2 size={14} className="text-black animate-spin" />
          ) : (
            <Send size={14} className={canSend ? "text-black" : "text-white/40"} />
          )}
        </button>
      </div>

      <p className="text-white/20 text-[10px] text-center">
        Enter kirim · Shift+Enter baris baru
      </p>
    </div>
  );
}
