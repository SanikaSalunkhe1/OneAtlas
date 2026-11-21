"use client";

import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";

interface CompareTrayProps {
  selectedModels: { id: string; name: string; slug: string }[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function CompareTray({ selectedModels, onRemove, onClear }: CompareTrayProps) {
  if (selectedModels.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#171717] text-white p-3.5 shadow-xl border border-neutral-800">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-neutral-400 pl-1">
            Compare ({selectedModels.length}/3):
          </span>
          {selectedModels.map((m) => (
            <span
              key={m.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-neutral-800 px-2.5 py-1 text-xs font-medium text-white"
            >
              {m.name}
              <button
                onClick={() => onRemove(m.id)}
                className="text-neutral-400 hover:text-white"
                title="Remove"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onClear}
            className="text-xs text-neutral-400 hover:text-white px-2 py-1"
          >
            Clear
          </button>
          <Link
            href={`/compare?models=${selectedModels.map((m) => m.slug).join(",")}`}
            className="flex items-center gap-1 rounded-lg bg-white px-3.5 py-1.5 text-xs font-semibold text-[#171717] hover:bg-neutral-100 transition-colors"
          >
            Compare now <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
