import { useState, useRef, DragEvent } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

interface ProductImageUploadProps {
  value?: string | null;
  onChange?: (url: string | null) => void;
  label?: string;
}

export default function ProductImageUpload({
  value,
  onChange,
  label = "Foto Produk",
}: ProductImageUploadProps) {
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

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  };

  const handleClear = () => {
    setPreview(null);
    onChange?.(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-bold text-gray-600">{label}</label>
      )}
      {preview ? (
        <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-40 object-cover"
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-red-50 transition-colors cursor-pointer"
          >
            <X size={14} className="text-gray-600" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="w-full h-40 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#1B4D3E]/50 hover:bg-gray-50 transition-all"
        >
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <ImageIcon size={18} className="text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold text-gray-600 flex items-center gap-1">
              <Upload size={12} /> Upload gambar
            </p>
            <p className="text-[11px] text-gray-400">
              atau drag & drop di sini
            </p>
          </div>
        </div>
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
