"use client";

import { useEffect } from "react";
import { CheckCheck, Circle, Hourglass } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChapterProgress } from "@/lib/chapterProgress";
import type { ChapterProgress } from "@/lib/types";

const OPTIONS: { status: ChapterProgress; label: string; icon: typeof Circle }[] = [
  { status: "not-started", label: "Not Started", icon: Circle },
  { status: "in-progress", label: "In Progress", icon: Hourglass },
  { status: "mastered", label: "Mastered", icon: CheckCheck },
];

const ACTIVE_CLASS: Record<ChapterProgress, string> = {
  "not-started": "bg-surface-container text-on-surface-variant",
  "in-progress": "bg-primary text-on-primary shadow-[0_2px_10px_rgba(75,79,242,0.35)]",
  mastered: "bg-tertiary text-on-tertiary shadow-[0_2px_10px_rgba(47,182,115,0.35)]",
};

export function ChapterProgressToggle({ chapterId, compact }: { chapterId: string; compact?: boolean }) {
  const { ready, statusFor, setStatus } = useChapterProgress();

  useEffect(() => {
    if (!ready || statusFor(chapterId).status !== "not-started") return;
    if (!statusFor(chapterId).updatedAt) setStatus(chapterId, "in-progress");
  }, [ready, chapterId, statusFor, setStatus]);

  if (!ready) {
    return (
      <div className="h-9 w-full max-w-sm animate-pulse rounded-full bg-surface-container" aria-hidden="true" />
    );
  }

  const current = statusFor(chapterId).status;

  return (
    <div
      className="flex w-full items-center gap-1 rounded-full bg-surface-container-lowest p-1 shadow-[0_2px_8px_rgba(24,26,43,0.04)]"
      role="group"
      aria-label="Chapter progress"
    >
      {OPTIONS.map((opt) => {
        const active = current === opt.status;
        const Icon = opt.icon;
        return (
          <button
            key={opt.status}
            type="button"
            aria-pressed={active}
            title={opt.label}
            onClick={() => setStatus(chapterId, opt.status)}
            className={cn(
              "inline-flex min-w-0 flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 font-title text-body-sm transition-all",
              active ? ACTIVE_CLASS[opt.status] : "text-on-surface-variant hover:text-on-surface",
            )}
          >
            <Icon className={cn("h-3.5 w-3.5", opt.status === "not-started" && "scale-95")} aria-hidden="true" />
            {!compact && <span>{opt.label}</span>}
          </button>
        );
      })}
    </div>
  );
}