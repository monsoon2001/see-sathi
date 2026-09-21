import type { Chapter } from "@/lib/types";

export function chapterDisplayNumber(chapter: { number: number; subLabel?: string }): string {
  return `${String(chapter.number).padStart(2, "0")}${chapter.subLabel ?? ""}`;
}