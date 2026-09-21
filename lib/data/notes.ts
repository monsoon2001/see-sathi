// Phase 1: reads from mock arrays.
// Phase 2: swap internals to read Firestore (subjects/{id}/chapters/{id}/notes/{sectionId}).
import { mockNotes } from "@/lib/mock/mockNotes";
import type { NoteBlock } from "@/lib/types";

export async function getNotes(subjectSlug: string, chapterSlug: string): Promise<NoteBlock[]> {
  const key = `${subjectSlug}/${chapterSlug}`;
  const blocks = mockNotes[key] ?? [];
  return [...blocks].sort((a, b) => a.order - b.order);
}

export async function getNotesCount(subjectSlug: string, chapterSlug: string): Promise<number> {
  const blocks = await getNotes(subjectSlug, chapterSlug);
  return blocks.filter((b) => b.type !== "heading").length;
}