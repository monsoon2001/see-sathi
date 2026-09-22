"use client";

import { TrendingUp } from "lucide-react";
import { useChapterProgress } from "@/lib/chapterProgress";
import type { Chapter } from "@/lib/types";

export function SubjectReadinessCard({ chapters }: { chapters: Chapter[] }) {
  const { ready, statusFor } = useChapterProgress();

  if (!ready) {
    return (
      <div className="space-y-3 rounded-2xl border border-surface-container-high/60 bg-surface-container-low p-4 shadow-sm">
        <div className="h-4 w-28 animate-pulse rounded-full bg-surface-container-high" />
        <div className="h-2.5 w-full animate-pulse rounded-full bg-surface-container-high" />
        <div className="h-3.5 w-44 animate-pulse rounded-full bg-surface-container-high" />
      </div>
    );
  }

  const mastered = chapters.filter((c) => statusFor(c.id).status === "mastered").length;
  const pct = chapters.length ? Math.round((mastered / chapters.length) * 100) : 0;

  return (
    <div className="space-y-1 rounded-2xl border border-surface-container-high/60 bg-surface-container-low p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-label-caps uppercase text-on-surface-variant">Overall Exam Readiness</span>
        <span className="font-title text-title text-primary">{pct}% Prepared</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-container-high">
        <div
          className="h-full rounded-full bg-primary-container transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between pt-1 font-body-sm text-body-sm text-on-surface-variant">
        <span>
          {mastered} of {chapters.length} chapters mastered
        </span>
        <span className="flex items-center gap-0.5 font-title text-tertiary">
          <TrendingUp className="h-[14px] w-[14px]" aria-hidden="true" /> On Track for A+
        </span>
      </div>
    </div>
  );
}