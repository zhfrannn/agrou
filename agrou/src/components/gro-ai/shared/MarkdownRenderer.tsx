import React from "react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Render markdown sederhana dari output AI.
 * Mendukung: **bold**, *italic*, ## heading, - list, `code`
 * Tidak menggunakan library tambahan.
 */
export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const lines = content.split("\n");

  const renderInline = (text: string, key: string | number): React.ReactNode => {
    // Split by bold, italic, code patterns
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
    return (
      <span key={key}>
        {parts.map((part, i) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
            return <em key={i} className="italic">{part.slice(1, -1)}</em>;
          }
          if (part.startsWith("`") && part.endsWith("`")) {
            return (
              <code key={i} className="bg-white/10 text-[#b3cc04] px-1 py-0.5 rounded text-[0.85em] font-mono">
                {part.slice(1, -1)}
              </code>
            );
          }
          return part;
        })}
      </span>
    );
  };

  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines but add spacing
    if (line.trim() === "") {
      elements.push(<div key={`gap-${i}`} className="h-1.5" />);
      i++;
      continue;
    }

    // Numbered list: 1. 2. 3.
    if (/^\d+\.\s/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="space-y-1 my-1.5 pl-1">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex gap-2 text-white/80 text-sm leading-relaxed">
              <span className="text-[#b3cc04] font-bold shrink-0 w-4">{idx + 1}.</span>
              <span>{renderInline(item, idx)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Bullet list: - or •
    if (/^[-•]\s/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^[-•]\s/.test(lines[i])) {
        listItems.push(lines[i].replace(/^[-•]\s/, ""));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-1 my-1.5 pl-1">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex gap-2 text-white/80 text-sm leading-relaxed">
              <span className="text-[#b3cc04] shrink-0 mt-1.5">•</span>
              <span>{renderInline(item, idx)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Bold line as heading (e.g. **Diagnosis:**)
    if (/^\*\*[^*]+\*\*[:：]?\s*$/.test(line.trim()) || /^##\s/.test(line)) {
      const text = line.replace(/^#+\s/, "").replace(/\*\*/g, "");
      elements.push(
        <div key={`h-${i}`} className="font-bold text-white text-sm mt-3 mb-1 first:mt-0">
          {text}
        </div>
      );
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${i}`} className="text-white/80 text-sm leading-relaxed">
        {renderInline(line, i)}
      </p>
    );
    i++;
  }

  return <div className={`space-y-0.5 ${className}`}>{elements}</div>;
}
