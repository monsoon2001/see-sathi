"use client";

import { Bookmark, BookOpen, Clock, Heart, Link2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSavedNotes } from "@/lib/savedNotes";
import { cn } from "@/lib/utils";

const SUBJECT_PILL: Record<string, string> = {
  mathematics: "bg-primary-fixed text-primary",
  science: "bg-tertiary-fixed/40 text-tertiary",
  "optional-mathematics": "bg-secondary-fixed text-secondary",
  english: "bg-secondary-fixed text-secondary",
  nepali: "bg-secondary-fixed text-secondary",
  "social-studies": "bg-secondary-fixed text-secondary",
  "computer-science": "bg-secondary-fixed text-secondary",
};

function formatSavedAt(iso: string) {
  if (!iso) return "Recently";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Recently";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

export function SavedNotes() {
  const { savedNotes, ready, unsaveNote, clearNotes } = useSavedNotes();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const subjects = useMemo(() => new Set(savedNotes.map((n) => n.subjectSlug)).size, [savedNotes]);

  if (!ready || !mounted) {
    return <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">Loading saved notes…</div>;
  }

  return (
    <div className="relative mx-auto w-full max-w-7xl overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-1/4 top-10 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-48 -z-10 h-80 w-80 rounded-full bg-secondary-container/5 blur-3xl" />

      <div className="space-y-8 py-10">
        <div className="flex items-center gap-1 text-on-surface-variant">
          <span className="text-label-caps uppercase tracking-wider text-primary">Workspace</span>
          <span className="text-xs text-outline-variant">/</span>
          <span className="text-label-caps uppercase tracking-wider text-on-surface-variant">Class 10 SEE Revision Tray</span>
        </div>

        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl space-y-2">
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-hero-mobile tracking-tight text-on-surface sm:text-display-hero">Saved Notes</h1>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-container text-on-primary shadow-[0_4px_16px_rgba(75,79,242,0.32)]">
                <Bookmark className="h-[26px] w-[26px]" fill="currentColor" aria-hidden="true" />
              </div>
            </div>
            <p className="pt-1 text-body-lg leading-relaxed text-on-surface-variant">
              All the chapter notes you saved for the SEE final, gathered in one revision tray.
            </p>
          </div>
          {savedNotes.length > 0 && (
            <button
              type="button"
              onClick={clearNotes}
              className="inline-flex shrink-0 items-center gap-1 rounded-full bg-surface-container-low px-4 py-2 text-title text-on-surface-variant transition-colors hover:bg-surface-container hover:text-error"
            >
              <Trash2 className="h-[18px] w-[18px]" aria-hidden="true" /> Clear All
            </button>
          )}
        </div>

        {savedNotes.length > 0 ? (
          <>
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-4 rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-on-primary-fixed">
                  <Bookmark className="h-[22px] w-[22px]" fill="currentColor" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-headline-sm leading-tight text-on-surface">{savedNotes.length}</div>
                  <div className="text-label-caps uppercase text-on-surface-variant">Saved Notes</div>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-fixed">
                  <BookOpen className="h-[22px] w-[22px]" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-headline-sm leading-tight text-on-surface">{subjects} Subjects</div>
                  <div className="text-label-caps uppercase text-on-surface-variant">Represented</div>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-tertiary-fixed text-on-tertiary-fixed">
                  <Heart className="h-[22px] w-[22px] fill-current" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-headline-sm leading-tight text-on-surface">{savedNotes.length} chapters</div>
                  <div className="text-label-caps uppercase text-on-surface-variant">Prepared for finals</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {savedNotes.map((note) => (
                <article
                  key={note.id}
                  className="group flex flex-col justify-between rounded-lg bg-surface-container-lowest p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div>
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-1">
                        <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-label-caps", SUBJECT_PILL[note.subjectSlug] ?? "bg-surface-container text-on-surface-variant")}>
                          {note.subjectName}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-2 py-0.5 text-label-caps text-on-surface-variant">
                          <BookOpen className="h-[13px] w-[13px]" aria-hidden="true" /> Chapter Notes
                        </span>
                      </div>
                      <button
                        type="button"
                        aria-label="Unsave note"
                        onClick={() => unsaveNote(note.subjectSlug, note.chapterSlug)}
                        className="p-1 text-on-surface-variant transition-colors hover:text-error"
                      >
                        <Trash2 className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>

                    <h3 className="mb-1 text-headline-md text-on-surface transition-colors group-hover:text-primary">{note.chapterTitle}</h3>
                    <p className="mb-4 text-body-md leading-relaxed text-on-surface-variant">
                      Full chapter master notes saved for priority revision before the final exam.
                    </p>

                    <div className="mb-4 flex items-center gap-2 rounded-2xl bg-surface-container-low px-4 py-2 text-body-sm text-on-surface-variant">
                      <Link2 className="h-[18px] w-[18px] shrink-0 text-primary" aria-hidden="true" />
                      <span>Saved from {note.subjectName} · SEE 2082/2083</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-surface-container pt-3 text-on-surface-variant">
                    <span className="flex items-center gap-1 text-body-sm">
                      <Clock className="h-[15px] w-[15px]" aria-hidden="true" /> Saved {formatSavedAt(note.savedAt)}
                    </span>
                    <Link
                      href={`/subjects/${note.subjectSlug}/${note.chapterSlug}/notes`}
                      className="inline-flex items-center gap-1 rounded-full bg-primary-container px-4 py-1 text-title text-on-primary shadow-[0_2px_8px_rgba(75,79,242,0.2)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(75,79,242,0.36)]"
                    >
                      Study Now <BookOpen className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-lg bg-surface-container-lowest p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-fixed text-primary">
              <Bookmark className="h-7 w-7" aria-hidden="true" />
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface">No saved notes yet</h2>
            <p className="mx-auto mt-1 max-w-md font-body-md text-body-md text-on-surface-variant">
              Open any chapter&apos;s notes and hit “Save Note” to keep it here for final revision.
            </p>
            <Link
              href="/subjects"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2 font-title text-title text-on-primary shadow-[0_4px_14px_rgba(75,79,242,0.28)] transition-all hover:-translate-y-0.5"
            >
              Browse Subjects
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}