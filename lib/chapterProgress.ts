"use client";

import { useCallback, useEffect, useState } from "react";
import type { ChapterProgress } from "@/lib/types";

export interface ChapterProgressEntry {
  status: ChapterProgress;
  percent: number;
  updatedAt: number;
}

const STORAGE_KEY = "see-sathi:chapter-progress";

export const DEFAULT_PROGRESS: ChapterProgressEntry = { status: "not-started", percent: 0, updatedAt: 0 };

function readAll(): Record<string, ChapterProgressEntry> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, ChapterProgressEntry>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(record: Record<string, ChapterProgressEntry>): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // storage unavailable — keep in-memory only
  }
}

/**
 * Per-user chapter study progress stored on this device (same pattern as
 * saved notes / profile). Chapters keyed by the stable Chapter.id.
 */
export function useChapterProgress() {
  const [record, setRecord] = useState<Record<string, ChapterProgressEntry> | null>(null);

  useEffect(() => {
    setRecord(readAll());
    const handler = () => setRecord(readAll());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const persist = useCallback((next: Record<string, ChapterProgressEntry>) => {
    setRecord(next);
    writeAll(next);
  }, []);

  const setStatus = useCallback((chapterId: string, status: ChapterProgress) => {
    setRecord((prev) => {
      const cur = prev ?? readAll();
      const next = {
        ...cur,
        [chapterId]: { status, percent: status === "mastered" ? 100 : (cur[chapterId]?.percent ?? 0), updatedAt: Date.now() },
      };
      persist(next);
      return next;
    });
  }, [persist]);

  const resetChapter = useCallback((chapterId: string) => {
    setRecord((prev) => {
      const cur = prev ?? readAll();
      if (!(chapterId in cur)) return cur;
      const next = { ...cur };
      delete next[chapterId];
      persist(next);
      return next;
    });
  }, [persist]);

  const statusFor = useCallback(
    (chapterId: string): ChapterProgressEntry => (record && record[chapterId]) || DEFAULT_PROGRESS,
    [record],
  );

  return { ready: record !== null, statusFor, setStatus, resetChapter };
}