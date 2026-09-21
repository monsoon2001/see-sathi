"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, BadgeCheck, FileQuestion, School } from "lucide-react";
import { cn } from "@/lib/utils";
import { chapterDisplayNumber } from "@/lib/chapterLabel";
import type { Chapter, Subject } from "@/lib/types";
import type { FsChapterDoc, FsQuestionSection, Lang } from "@/lib/firebase/chapterDoc";
import { LangToggle, QuestionCard, langFont, pickText } from "@/components/firestore/fsBlocks";
import { ScrollProgressBar } from "@/components/layout/ScrollProgressBar";
import { ReaderShell } from "@/components/reader/ReaderShell";

const SECTION_COLORS = [
  "bg-primary-container text-white",
  "bg-tertiary-fixed text-[#005B34]",
  "bg-secondary-fixed text-on-secondary-fixed",
  "bg-surface-container-high text-on-surface",
  "bg-primary-fixed text-on-primary-fixed",
  "bg-secondary-container/30 text-on-surface",
];

export function FirestoreChapterQuestions({
  en,
  ne,
  subject,
  chapter,
  defaultLang,
}: {
  en: FsChapterDoc | null;
  ne: FsChapterDoc | null;
  subject: Subject;
  chapter: Chapter;
  defaultLang?: Lang;
}) {
  const [lang, setLang] = useState<Lang>(defaultLang ?? "en");
  const doc = lang === "ne" ? ne ?? en : en ?? ne;

  // Subjects that are single-language — no bilingual toggle needed
  const NO_TOGGLE_SUBJECTS = ["english", "nepali", "computer-science", "social-studies"];
  const showLangToggle = !NO_TOGGLE_SUBJECTS.includes(subject.slug);

  if (!doc) {
    return (
      <ReaderShell>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary-fixed px-4 py-1.5 text-on-secondary-fixed shadow-sm">
            <FileQuestion className="h-4 w-4" aria-hidden="true" />
            <span className="font-label-caps text-label-caps uppercase tracking-wider">Live library unavailable</span>
          </div>
          <h1 className="mt-6 font-display-hero text-display-hero tracking-tight text-on-surface">Couldn’t reach the question bank.</h1>
          <p className="mx-auto mt-3 max-w-md font-body-lg text-body-lg text-on-surface-variant">
            The solved questions for this chapter couldn&apos;t load. Check your connection and try again in a moment.
          </p>
          <Link
            href={`/subjects/${subject.slug}/${chapter.slug}/notes`}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-container px-6 py-2 font-title text-title text-on-primary shadow-[0_4px_14px_rgba(75,79,242,0.28)]"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" /> Review the Notes
          </Link>
        </div>
      </ReaderShell>
    );
  }

  const title = lang === "ne" ? doc.titleNe : doc.titleEn;
  const sections = doc.questionSections.filter((s: FsQuestionSection) => s.items.length > 0);

  return (
    <ReaderShell>
      <div className="pb-24">
      <div className="sticky top-20 z-40">
        <ScrollProgressBar />
        <div className="border-b border-surface-container bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-on-surface-variant">
            <Link
              href={`/subjects/${subject.slug}/${chapter.slug}`}
              className="flex items-center gap-1 rounded-full bg-surface-container-lowest px-4 py-1.5 font-title text-body-sm text-on-surface shadow-sm transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {chapter.title}
            </Link>
            <span className="rounded-full bg-primary-fixed px-3 py-1.5 font-label-caps text-label-caps text-primary">
              Solved Questions
            </span>
            <span className="hidden font-label-caps text-label-caps uppercase tracking-wider text-tertiary sm:inline">
              {`· Unit ${doc.number}`}
            </span>
          </nav>
          {showLangToggle && <LangToggle lang={lang} onChange={setLang} />}
        </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 lg:px-0">
        <div className="mb-2 inline-flex flex-wrap items-center gap-2 pt-8">
          <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-4 py-1 text-primary">
            <School className="h-[14px] w-[14px]" aria-hidden="true" />
            <span className="font-bold text-label-caps uppercase tracking-wider">
              {subject.name} · Chapter {chapterDisplayNumber(chapter)}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-tertiary-fixed/50 px-3 py-1 font-label-caps text-label-caps text-tertiary">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
            {doc.questionCount} solved questions
          </span>
        </div>

        <h1 className="mb-3 font-display-hero text-display-hero tracking-tight text-on-surface">{title}</h1>
        <p className={cn("mb-8 max-w-2xl font-body-lg text-body-lg text-on-surface-variant", langFont(lang))}>
          {lang === "en"
            ? `Every question in this chapter, answered and explained — step-by-step solutions drawn live from the chapter library across ${sections.length} question ${sections.length === 1 ? "section" : "sections"}.`
            : `यस एकाइका सम्पूर्ण प्रश्नहरूको उत्तर व्याख्या सहित — ${sections.length} खण्डमा चरण-दर-चरण समाधानहरू।`}
        </p>

        {sections.length === 0 ? (
          <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-surface-container bg-surface-container-lowest/60 px-6 py-14 text-center">
            <FileQuestion className="h-10 w-10 text-outline-variant" aria-hidden="true" />
            <h2 className="font-headline-sm text-headline-sm tracking-tight text-on-surface">
              {lang === "ne" ? "यस एकाइका हल प्रश्नहरू प्रकाशित भइसकेका छैनन्।" : "Solved questions aren't published for this chapter yet."}
            </h2>
            <p className="max-w-md font-body-md text-body-md text-on-surface-variant">
              {lang === "ne"
                ? "सबैभन्दा पहिले नोटहरू पढ्नुहोस् — नयाँ प्रश्न बैंक चाँडै आउँदैछ।"
                : "Start with the full chapter notes — the question bank for this unit is coming soon."}
            </p>
            <Link
              href={`/subjects/${subject.slug}/${chapter.slug}/notes`}
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary-container px-6 py-2 font-title text-title text-on-primary shadow-[0_4px_14px_rgba(75,79,242,0.28)] transition-all hover:-translate-y-0.5"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              {lang === "ne" ? "नोटहरू पढ्नुहोस्" : "Read the Notes"}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2">
          {sections.map((s, i) => (
            <a
              key={i}
              href={`#fs-section-${i}`}
              className={cn(
                "rounded-full px-4 py-2 font-title text-body-sm transition-transform hover:-translate-y-0.5",
                SECTION_COLORS[i % SECTION_COLORS.length],
              )}
            >
              {pickText(s.title, lang)}
              <span className="ml-2 rounded-full bg-background/70 px-2 py-0.5 font-mono text-xs text-on-surface">{s.items.length}</span>
            </a>
          ))}
        </div>

        <div className="mt-8 space-y-12">
          {sections.map((s, i) => (
            <section key={i} id={`fs-section-${i}`} className="scroll-mt-40">
              <div className="mb-4 flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full font-title text-body-sm",
                    SECTION_COLORS[i % SECTION_COLORS.length],
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className={cn("font-headline-md text-headline-md tracking-tight text-on-surface", langFont(lang))}>
                  {pickText(s.title, lang)}
                </h2>
                <span className="ml-auto rounded-full bg-surface-container px-3 py-1 font-mono text-xs text-on-surface-variant">
                  {s.items.length}
                </span>
              </div>
              <div className="space-y-4">
                {s.items.map((q, qi) => (
                  <QuestionCard key={q.id || qi} q={q} index={qi + 1} lang={lang} />
                ))}
              </div>
            </section>
          ))}
        </div>
          </>
        )}

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-surface-container pt-6 sm:flex-row">
          <Link
            href={`/subjects/${subject.slug}/${chapter.slug}/notes`}
            className="inline-flex w-full items-center justify-center gap-1 rounded-full bg-surface-container px-6 py-2 font-title text-title text-on-surface transition-colors hover:bg-surface-container-high sm:w-auto"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" /> Review the Notes
          </Link>
          <Link
            href={`/subjects/${subject.slug}/${chapter.slug}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-container px-6 py-2 font-title text-title text-on-primary shadow-[0_4px_14px_rgba(75,79,242,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(75,79,242,0.38)] sm:w-auto"
          >
            Back to Chapter <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
      </div>
    </ReaderShell>
  );
}