"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, School } from "lucide-react";
import { cn } from "@/lib/utils";
import { chapterDisplayNumber } from "@/lib/chapterLabel";
import type { Chapter, Subject } from "@/lib/types";
import type { FsChapterDoc, Lang } from "@/lib/firebase/chapterDoc";
import { BlockView, LangToggle, langFont } from "@/components/firestore/fsBlocks";
import { SaveNoteButton } from "@/components/chapters/SaveNoteButton";
import { FontSizeControl, useFontSize } from "@/components/ui/FontSizeControl";
import { ReaderShell } from "@/components/reader/ReaderShell";
import { ReaderThemeToggle } from "@/components/theme/ReaderThemeToggle";

function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    function update() {
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      setProgress(max > 0 ? (root.scrollTop / max) * 100 : 0);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return (
    <div className="h-1 w-full bg-surface-container-high">
      <div className="h-full bg-tertiary transition-[width] duration-150" style={{ width: `${progress}%` }} />
    </div>
  );
}

export function FirestoreChapterNotes({
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
  const [fontSize, setFontSize] = useFontSize(17);
  const doc = lang === "ne" ? ne ?? en : en ?? ne;

  // Subjects that are single-language — no bilingual toggle needed
  const NO_TOGGLE_SUBJECTS = ["english", "nepali", "computer-science", "social-studies"];
  const showLangToggle = !NO_TOGGLE_SUBJECTS.includes(subject.slug);

  if (!doc) {
    return (
      <ReaderShell>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary-fixed px-4 py-1.5 text-on-secondary-fixed shadow-sm">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            <span className="font-label-caps text-label-caps uppercase tracking-wider">Live library unavailable</span>
          </div>
          <h1 className="mt-6 font-display-hero text-display-hero tracking-tight text-on-surface">Couldn’t reach the chapter data.</h1>
          <p className="mx-auto mt-3 max-w-md font-body-lg text-body-lg text-on-surface-variant">
            We couldn’t load the notes for this chapter. Check your connection and try again in a moment.
          </p>
          <Link
            href={`/subjects/${subject.slug}/${chapter.slug}`}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-container px-6 py-2 font-title text-title text-on-primary shadow-[0_4px_14px_rgba(75,79,242,0.28)]"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" /> Back to Chapter
          </Link>
        </div>
      </ReaderShell>
    );
  }

  const title = lang === "ne" ? doc.titleNe : doc.titleEn;
  const blockCount = doc.blocks.length;

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
                {lang === "ne" ? `${subject.name} · एकाइ ${doc.number}` : `${subject.name} · Unit ${doc.number}`}
              </span>
            </nav>
            <div className="flex items-center gap-2">
              <SaveNoteButton subject={subject} chapter={chapter} />
              <ReaderThemeToggle />
              <FontSizeControl value={fontSize} onChange={setFontSize} />
              {showLangToggle && <LangToggle lang={lang} onChange={setLang} />}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 lg:px-0">
        <div className="mb-2 inline-flex flex-wrap items-center gap-2 pt-8">
          <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-4 py-1 text-primary">
            <School className="h-[14px] w-[14px]" aria-hidden="true" />
            <span className="font-bold text-label-caps uppercase tracking-wider">
              Chapter {chapterDisplayNumber(chapter)} · {subject.name}
            </span>
          </div>
          <span className="inline-flex items-center rounded-full bg-surface-container px-3 py-1 font-label-caps text-label-caps text-on-surface-variant">
            {blockCount} blocks · bilingual
          </span>
        </div>

        <h1 className="mb-3 font-display-hero text-display-hero tracking-tight text-on-surface">{title}</h1>
        <div className="mb-1 flex flex-wrap items-center gap-2 font-body-md text-body-md text-on-surface-variant">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-tertiary-fixed/40 px-2.5 py-1 text-tertiary">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-tertiary" aria-hidden="true" />
            <span className="font-label-caps text-label-caps uppercase tracking-wider">Live</span>
          </span>
          {lang === "en"
            ? "Bilingual master notes · switch to नेपाली for the full glossary"
            : "द्विभाषिक नोटहरू · अंग्रेजीका लागि स्विच गर्नुहोस्"}
        </div>
        <p className={cn("mb-10 max-w-2xl font-body-lg text-[17.5px] leading-[30px] text-on-surface-variant", langFont(lang))}>
          {lang === "en"
            ? `Complete bilingual study notes for ${title} — every concept explained step by step, with definitions, formulas, and worked examples.`
            : `${title} का सम्पूर्ण द्विभाषिक अध्ययन नोटहरू — अवधारणा, परिभाषा, सूत्र र उदाहरण सहित प्रत्येक विषयलाई चरणबद्ध रूपमा सिकाउने।`}
        </p>

        <article className="space-y-7" style={{ fontSize: `${fontSize}px` }}>
          {doc.blocks.map((block, i) => (
            <BlockView key={i} block={block} lang={lang} math={subject.slug === "mathematics"} />
          ))}
        </article>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-surface-container pt-6 sm:flex-row">
          <Link
            href={`/subjects/${subject.slug}/${chapter.slug}`}
            className="inline-flex w-full items-center justify-center gap-1 rounded-full bg-surface-container px-6 py-2 font-title text-title text-on-surface transition-colors hover:bg-surface-container-high sm:w-auto"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" /> Back to Chapter
          </Link>
          {(doc.questionCount > 0 || (chapter.questionsCount ?? 0) > 0) && (
            <Link
              href={`/subjects/${subject.slug}/${chapter.slug}/questions`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-container px-6 py-2 font-title text-title text-on-primary shadow-[0_4px_14px_rgba(75,79,242,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(75,79,242,0.38)] sm:w-auto"
            >
              Next: Solved Questions <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
      </div>
    </ReaderShell>
  );
}