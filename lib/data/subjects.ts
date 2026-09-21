// Phase 1: reads from mock arrays.
// Phase 2: swap internals to read from Firestore without touching components.
import { mockSubjects } from "@/lib/mock/mockSubjects";
import { mockChapters } from "@/lib/mock/mockChapters";
import { subjectColors } from "@/lib/subjectColors";
import type { Subject, Chapter } from "@/lib/types";

export async function getSubjects(): Promise<Subject[]> {
  return mockSubjects;
}

export async function getSubject(subjectSlug: string): Promise<Subject | undefined> {
  return mockSubjects.find((s) => s.slug === subjectSlug);
}

export async function getChapters(subjectSlug: string): Promise<Chapter[]> {
  return mockChapters[subjectSlug] ?? [];
}

export async function getChapter(subjectSlug: string, chapterSlug: string): Promise<Chapter | undefined> {
  return mockChapters[subjectSlug]?.find((c) => c.slug === chapterSlug);
}

export function getSubjectColor(subjectSlug: string): string {
  return subjectColors[subjectSlug] ?? "#4B4FF2";
}