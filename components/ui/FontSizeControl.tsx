"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type FontSize = 15 | 17 | 19;

const SIZES: { value: FontSize; label: string; short: string }[] = [
  { value: 15, label: "Small", short: "A−" },
  { value: 17, label: "Default", short: "A" },
  { value: 19, label: "Large", short: "A+" },
];

interface FontSizeControlProps {
  /** Called with the selected font size in px. */
  onChange: (size: FontSize) => void;
  value: FontSize;
}

export function useFontSize(initial: FontSize = 17): [FontSize, (s: FontSize) => void] {
  const [size, setSize] = useState<FontSize>(initial);
  return [size, setSize];
}

export function FontSizeControl({ value, onChange }: FontSizeControlProps) {
  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-full bg-surface-container p-1"
      role="group"
      aria-label="Content font size"
    >
      {SIZES.map((s) => (
        <button
          key={s.value}
          type="button"
          aria-pressed={value === s.value}
          aria-label={`Font size: ${s.label}`}
          title={s.label}
          onClick={() => onChange(s.value)}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold transition-all",
            value === s.value
              ? "bg-surface-container-lowest text-primary shadow-sm"
              : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
          )}
        >
          {s.short}
        </button>
      ))}
    </div>
  );
}
