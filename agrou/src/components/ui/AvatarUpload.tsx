import { useState, useRef, MouseEvent } from "react";
import { Camera, X } from "lucide-react";

interface AvatarUploadProps {
  value?: string | null;
  onChange?: (url: string | null) => void;
  size?: number;
  name?: string;
}

export default function AvatarUpload({
  value,
  onChange,
  size = 80,
  name,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(value ?? null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setPreview(url);
      onChange?.(url);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setPreview(null);
    onChange?.(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div
      className="relative cursor-pointer group"
      style={{ width: size, height: size }}
      onClick={() => inputRef.current?.click()}
    >
      {preview ? (
        <img
          src={preview}
          alt="Avatar"
          className="w-full h-full rounded-full object-cover border-2 border-white shadow-md"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-[#1B4D3E]/10 border-2 border-dashed border-[#1B4D3E]/30 flex items-center justify-center">
          <span className="text-[#1B4D3E] font-black text-lg">{initials}</span>
        </div>
      )}

      {/* Overlay on hover */}
      <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <Camera size={16} className="text-white" />
      </div>

      {/* Clear button */}
      {preview && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white shadow flex items-center justify-center hover:bg-red-50 transition-colors z-10"
        >
          <X size={10} className="text-gray-600" />
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
