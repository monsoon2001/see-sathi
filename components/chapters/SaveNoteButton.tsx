"use client";

import { BookmarkCheck, BookmarkPlus } from "lucide-react";
import type { Chapter, Subject } from "@/lib/types";
import { useSavedNotes } from "@/lib/savedNotes";
import { cn } from "@/lib/utils";

export function SaveNoteButton({ subject, chapter }: { subject: Subject; chapter: Chapter }) {
  const { isNoteSaved, saveNote, unsaveNote } = useSavedNotes();
  const saved = isNoteSaved(subject.slug, chapter.slug);

  function toggle() {
    if (saved) {
      unsaveNote(subject.slug, chapter.slug);
    } else {
      saveNote({
        subjectSlug: subject.slug,
        subjectName: subject.name,
        chapterSlug: chapter.slug,
        chapterTitle: chapter.title.split(" (")[0],
      });
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-surface-container-lowest px-4 py-2 text-on-surface shadow-sm transition-all hover:bg-surface-container",
        saved && "bg-tertiary-fixed text-on-tertiary-fixed",
      )}
    >
      {saved ? (
        <BookmarkCheck className="h-[18px] w-[18px]" aria-hidden="true" />
      ) : (
        <BookmarkPlus className="h-[18px] w-[18px] text-tertiary" aria-hidden="true" />
      )}
      <span className="text-label-caps uppercase">{saved ? "Saved" : "Save Note"}</span>
    </button>
  );
}