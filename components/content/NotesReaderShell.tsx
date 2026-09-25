"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BarChart3, Bolt, BookOpen, Focus, ShieldCheck, School } from "lucide-react";
import Link from "next/link";
import { NotesRenderer } from "@/components/content/NotesRenderer";
import { SaveNoteButton } from "@/components/chapters/SaveNoteButton";
import { ReaderShell } from "@/components/reader/ReaderShell";
import { ReaderThemeToggle } from "@/components/theme/ReaderThemeToggle";
import { cn } from "@/lib/utils";
import { chapterDisplayNumber } from "@/lib/chapterLabel";
import type { Chapter, NoteBlock, Subject } from "@/lib/types";

export function NotesReaderShell({
  subject,
  chapter,
  blocks,
}: {
  subject: Subject;
  chapter: Chapter;
  blocks: NoteBlock[];
}) {
  const [progress, setProgress] = useState(0);
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setProgress(height > 0 ? (winScroll / height) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <ReaderShell>
      <div className="sticky top-16 z-40 h-1 w-full bg-surface-container-high sm:top-20">
        <div className="h-full bg-tertiary transition-all duration-150" style={{ width: `${progress}%` }} />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
        <div className="mx-auto mb-4 flex max-w-3xl flex-wrap items-center justify-between gap-2">
          <nav className="flex min-w-0 items-center gap-1 text-label-md font-label-md text-on-surface-variant">
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[1rem] bg-tertiary-fixed text-on-tertiary-fixed shadow-sm">
              <Bolt className="h-4 w-4" aria-hidden="true" />
            </span>
            <Link href="/subjects" className="shrink-0 transition-colors hover:text-primary">
              Subjects
            </Link>
            <span className="shrink-0 text-outline-variant">/</span>
            <Link href={`/subjects/${subject.slug}`} className="shrink-0 transition-colors hover:text-primary">
              {subject.name.split(" ")[0]} &amp; Tech
            </Link>
            <span className="shrink-0 text-outline-variant">/</span>
            <span className="truncate font-title text-on-surface">{chapter.title.split(" (")[0]}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-1.5">
            <SaveNoteButton subject={subject} chapter={chapter} />
            <ReaderThemeToggle />
            <button
              type="button"
              onClick={() => setFocus((v) => !v)}
              className={cn(
                "inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-surface-container-lowest px-4 py-2 text-on-surface shadow-sm transition-all hover:bg-surface-container",
                focus && "bg-primary-fixed text-on-primary-fixed",
              )}
            >
              <BookOpen className="h-[18px] w-[18px]" aria-hidden="true" />
              <span className="text-label-caps uppercase">Focus Mode</span>
            </button>
          </div>
        </div>

        <div className="flex w-full justify-center">
          <article
            className={cn(
              "mx-auto w-full max-w-3xl space-y-10",
              focus ? "max-w-5xl" : "max-w-3xl",
            )}
          >
            <header className="scroll-mt-28 space-y-2 pb-4">
              <div className="inline-flex w-fit max-w-full items-center gap-1 rounded-2xl bg-tertiary/10 px-3 py-2 leading-4 text-tertiary sm:px-4">
                <School className="h-[14px] w-[14px] shrink-0" aria-hidden="true" />
                <span className="text-label-caps uppercase tracking-wider">
                  Chapter {chapterDisplayNumber(chapter)} · {subject.name} · CDC Syllabus 2081/2082
                </span>
              </div>
              <h1 className="text-[26px] leading-tight tracking-tight text-on-surface sm:text-headline-lg">{chapter.title}</h1>
              <p className="font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
                {chapter.description} This module directly addresses questions frequently assessed in{" "}
                <strong>Group B (Short Answer - 2 Marks)</strong> and{" "}
                <strong>Group C (Numerical &amp; Diagrammatic Deduction - 3 Marks)</strong> of the National Examination Board (NEB/CDC) secondary assessment.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-1 text-label-md text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-tertiary" aria-hidden="true" /> Reviewed by Central CDC Board Team
                </span>
                <span className="flex items-center gap-1">
                  <BarChart3 className="h-4 w-4 text-primary" aria-hidden="true" /> High SEE Weightage ({chapter.weightage?.replace("Weightage: ", "") ?? "Exam"})
                </span>
              </div>
            </header>

            <NotesRenderer blocks={blocks} />

            <footer className="flex flex-col items-center justify-between gap-3 border-t border-surface-container pt-6 sm:flex-row">
              <Link
                href={`/subjects/${subject.slug}/${chapter.slug}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-surface-container px-5 py-2.5 font-title text-title text-on-surface transition-colors hover:bg-surface-container-high sm:w-auto"
              >
                <ArrowLeft className="h-[18px] w-[18px]" aria-hidden="true" /> Back to Chapter
              </Link>
              <Link
                href={`/subjects/${subject.slug}/${chapter.slug}/questions`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-container px-5 py-2.5 font-title text-title text-on-primary shadow-[0_4px_14px_rgba(75,79,242,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(75,79,242,0.38)] sm:w-auto"
              >
                Next: Solve Questions <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
              </Link>
            </footer>
          </article>
        </div>
      </div>
    </ReaderShell>
  );
}