"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReadProgress({ totalSections }: { totalSections: number }) {
  const [read, setRead] = useState<Set<number>>(new Set());

  const pct = totalSections === 0 ? 0 : Math.round((read.size / totalSections) * 100);

  function markVisible() {
    const next = new Set<number>();
    if (typeof document !== "undefined") {
      for (let i = 0; i < totalSections; i++) {
        const el = document.getElementById(`section-${i}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.8) next.add(i);
        }
      }
    }
    setRead((prev) => new Set([...prev, ...next]));
  }

  function reset() {
    setRead(new Set());
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <div
          className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
          style={{ background: `conic-gradient(#4B4FF2 ${pct * 3.6}deg, #E6E6FE 0deg)` }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-lowest">
            <span className="font-display text-[13px] font-extrabold text-on-surface">{pct}%</span>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
              {read.size} of {totalSections} sections read
            </span>
            <button type="button" onClick={reset} className="font-sans text-[11px] font-bold text-primary hover:text-primary-dark">
              Reset
            </button>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
            <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${pct}%` }} />
          </div>
          <button
            type="button"
            onClick={markVisible}
            className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 font-display text-[12px] font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
          >
            <Check className="h-3.5 w-3.5" />
            Mark visible sections read
          </button>
        </div>
      </div>
    </div>
  );
}

export function MarkReadButton({ className }: { className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setDone(true)}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 font-display text-sm font-semibold transition-colors",
        done
          ? "border-success/30 bg-success/10 text-success-dark"
          : "border-ink/10 text-on-surface-variant hover:text-on-surface",
        className,
      )}
    >
      <Check className="h-4 w-4" />
      {done ? "Section marked — nice work!" : "Mark Section as Read"}
    </button>
  );
}