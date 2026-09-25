"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Award, BadgeCheck, BookOpen, Check, Flame, School, ScrollText, Sigma } from "lucide-react";
import { QuestionRow } from "@/components/cards/QuestionRow";
import { ScrollProgressBar } from "@/components/layout/ScrollProgressBar";
import { FontSizeControl, useFontSize } from "@/components/ui/FontSizeControl";
import { ReaderShell } from "@/components/reader/ReaderShell";
import { ReaderThemeToggle } from "@/components/theme/ReaderThemeToggle";
import { cn } from "@/lib/utils";
import type { Chapter, Question, Subject } from "@/lib/types";

type GroupFilter = "all" | "A" | "B" | "C" | "D";
type SourceFilter = "all" | "board" | "model";

const GROUP_LABEL: Record<Exclude<GroupFilter, "all">, string> = {
  A: "1 Mark",
  B: "2 Marks",
  C: "4 Marks",
  D: "5 Marks",
};

const FORMULA_DECK = [
  { label: "Two Sets Cardinality", value: "n(A ∪ B) = n(A) + n(B) − n(A ∩ B)" },
  { label: "Only Elements (n₀)", value: "n₀(A) = n(A) − n(A ∩ B)" },
  { label: "Total with Complement", value: "n(U) = n(A ∪ B) + n(A ∪ B)′" },
];

export function QuestionBoard({
  subject,
  chapter,
  questions,
}: {
  subject: Subject;
  chapter: Chapter;
  questions: Question[];
}) {
  const isSets = subject.slug === "mathematics" && chapter.slug === "sets";
  const [group, setGroup] = useState<GroupFilter>("all");
  const [source, setSource] = useState<SourceFilter>("all");
  const [fontSize, setFontSize] = useFontSize(17);

  const count = (g: Exclude<GroupFilter, "all">) => questions.filter((q) => q.group === g).length;
  const counts = {
    total: questions.length,
    A: count("A"),
    B: count("B"),
    C: count("C"),
    D: count("D"),
  };
  const sourceCount = (s: SourceFilter) =>
    s === "all" ? questions.length : questions.filter((q) => (s === "model" ? q.source.includes("CDC Model") : !q.source.includes("CDC Model"))).length;

  const filtered = useMemo(
    () =>
      questions.filter(
        (q) =>
          (group === "all" || q.group === group) &&
          (source === "all" || (source === "model" ? q.source.includes("CDC Model") : !q.source.includes("CDC Model"))),
      ),
    [questions, group, source],
  );

  const solvedPct = Math.round(33.3);

  return (
    <ReaderShell>
      <ScrollProgressBar />
      <div className="relative mx-auto w-full max-w-7xl overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-1/3 top-12 -z-10 h-96 w-96 rounded-full bg-primary-fixed-dim/20 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-44 -z-10 h-80 w-80 rounded-full bg-secondary-fixed/20 blur-3xl" />

      <header className="space-y-2 pb-4 pt-8">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/subjects/${subject.slug}/${chapter.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary-fixed px-3 py-1 text-label-caps uppercase tracking-wider text-on-primary-fixed transition-colors hover:bg-primary-container hover:text-on-primary"
          >
            <School className="h-[14px] w-[14px]" aria-hidden="true" /> Solved Questions
          </Link>
          <span className="text-label-caps text-outline-variant">•</span>
          <span className="text-label-caps uppercase tracking-wider text-on-surface-variant">{subject.name}</span>
          <span className="text-label-caps text-outline-variant">•</span>
          <span className="text-label-caps font-bold uppercase tracking-wider text-primary">
            {isSets ? "Unit 1: Sets" : chapter.title.split(" (")[0]}
          </span>
        </div>

        <div className="flex flex-col justify-between gap-4 pt-1 lg:flex-row lg:items-end">
          <div className="max-w-3xl space-y-1">
            <h1 className="text-headline-lg tracking-tight text-on-surface lg:text-display-hero">
              Solved Questions: {chapter.title}
            </h1>
            <p className="text-body-lg text-on-surface-variant">
              {questions.length} verified model questions with step-by-step CDC marking schemes across board exams and model grids.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ReaderThemeToggle />
            <FontSizeControl value={fontSize} onChange={setFontSize} />
            <div className="flex items-center gap-1 rounded-full bg-surface-container px-4 py-2 shadow-sm">
              <Flame className="h-5 w-5 text-secondary" aria-hidden="true" />
              <span className="text-label-md text-on-surface">Avg. 9-10 Marks in Board Exam</span>
            </div>
            <div className="hidden items-center gap-1 rounded-full bg-surface-container-high px-4 py-2 shadow-sm sm:flex">
              <BadgeCheck className="h-[18px] w-[18px] text-primary" aria-hidden="true" />
              <span className="text-label-md text-on-surface">CDC 2081 Refreshed</span>
            </div>
          </div>
        </div>
      </header>

      <div className="mb-8 mt-5 space-y-2">
        <div className="scrollbar-none flex items-center gap-1 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setGroup("all")}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-title transition-all",
              group === "all" ? "bg-primary-container text-on-primary shadow-sm" : "bg-surface-container-lowest text-on-surface-variant shadow-sm hover:bg-surface-container hover:text-on-surface",
            )}
          >
            All ({counts.total})
          </button>
          {(["A", "B", "C", "D"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGroup(g)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-title transition-all",
                group === g ? "bg-primary-container text-on-primary shadow-sm" : "bg-surface-container-lowest text-on-surface-variant shadow-sm hover:bg-surface-container hover:text-on-surface",
              )}
            >
              Group {g} <span className="text-body-sm font-normal text-outline">({GROUP_LABEL[g]} · {counts[g]})</span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1 rounded-full bg-surface-container-low p-1 shadow-sm">
            {(
              [
                { key: "all", label: `All Sources (${sourceCount("all")})` },
                { key: "board", label: "Past Board Questions (2074–2080)" },
                { key: "model", label: "CDC Model 2081 Grid" },
              ] as const
            ).map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setSource(s.key)}
                className={cn(
                  "rounded-full px-3.5 py-1 text-label-md transition-colors",
                  source === s.key ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
          <span className="flex items-center gap-1 text-body-sm text-on-surface-variant">
            <Check className="h-4 w-4 text-tertiary" aria-hidden="true" /> Full step-by-step CDC solutions included
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8" style={{ fontSize: `${fontSize}px` }}>
          {filtered.map((q) => (
            <QuestionRow key={q.id} subjectSlug={subject.slug} chapterSlug={chapter.slug} question={q} />
          ))}
          {filtered.length === 0 && (
            <div className="rounded-lg bg-surface-container-lowest p-10 text-center text-body-md text-on-surface-variant shadow-sm">
              No questions match this filter combination.
            </div>
          )}
        </div>

        <aside className="space-y-4 lg:col-span-4">
          {isSets ? (
            <div className="relative space-y-2 overflow-hidden rounded-lg bg-surface-container-lowest p-6 shadow-md">
              <div className="absolute left-0 right-0 top-0 h-1.5 bg-secondary-container" />
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary-fixed text-on-secondary-fixed">
                  <Award className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-label-caps font-bold uppercase tracking-wider text-secondary">Crucial Examiner Note</span>
                  <h3 className="text-title text-on-surface">CDC Marking Scheme Secret</h3>
                </div>
              </div>
              <p className="text-body-md leading-relaxed text-on-surface-variant">
                &ldquo;1 mark is strictly reserved for drawing the universal rectangle <strong>&lsquo;U&rsquo;</strong> and properly labeled overlapping circles with clean proportions. Never leave out the outer box!&rdquo;
              </p>
              <div className="space-y-1 rounded-[1rem] bg-surface-container p-2 text-body-sm text-on-surface">
                <div className="flex items-center justify-between">
                  <span className="text-outline">Step 1: Formula definition</span>
                  <span className="font-mono font-bold text-primary">1 Mark</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-outline">Step 2: Arithmetic substitution</span>
                  <span className="font-mono font-bold text-primary">1 Mark</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-outline">Step 3: Venn diagram presentation</span>
                  <span className="font-mono font-bold text-primary">1 Mark</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-outline">Step 4: Formal conclusion sentence</span>
                  <span className="font-mono font-bold text-primary">1 Mark</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative space-y-2 overflow-hidden rounded-lg bg-surface-container-lowest p-6 shadow-md">
              <div className="absolute left-0 right-0 top-0 h-1.5 bg-primary-container" />
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-fixed text-on-primary-fixed">
                  <ScrollText className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-label-caps font-bold uppercase tracking-wider text-primary">Marking Blueprint</span>
                  <h3 className="text-title text-on-surface">CDC Exam Pattern</h3>
                </div>
              </div>
              <p className="text-body-md leading-relaxed text-on-surface-variant">
                Every solution is graded exactly as an SEE board examiner would — formula, substitution, presentation, and conclusion marks are isolated per rubric step.
              </p>
              <div className="space-y-1 rounded-[1rem] bg-surface-container p-2 text-body-sm text-on-surface">
                {(["A", "B", "C", "D"] as const).map((g) => (
                  <div key={g} className="flex items-center justify-between">
                    <span className="text-outline">Group {g} questions</span>
                    <span className="font-mono font-bold text-primary">{counts[g]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isSets && (
            <div className="space-y-2 rounded-lg bg-surface-container p-6 shadow-sm">
              <div className="flex items-center justify-between px-1">
                <h3 className="flex items-center gap-1.5 text-title text-on-surface">
                  <Sigma className="h-5 w-5 text-primary" aria-hidden="true" /> Unit 1 Formula Deck
                </h3>
                <span className="rounded-full bg-surface-container-highest px-2 py-0.5 text-label-caps uppercase text-on-surface-variant">Quick Reference</span>
              </div>
              <div className="space-y-1 px-1">
                {FORMULA_DECK.map((f) => (
                  <div key={f.label} className="flex flex-col gap-0.5 rounded bg-surface-container-lowest p-2.5 text-body-sm text-on-surface shadow-sm">
                    <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-outline">{f.label}</span>
                    <span className="font-mono">{f.value}</span>
                  </div>
                ))}
              </div>
              <Link
                href={`/subjects/${subject.slug}/${chapter.slug}#formula-sheet`}
                className="block w-full rounded-full bg-surface-container-lowest py-2 text-center text-body-md text-on-surface transition-colors hover:bg-primary-fixed hover:text-on-primary-fixed"
              >
                Open Full Math Formula Sheet →
              </Link>
            </div>
          )}

          <div className="space-y-2 rounded-lg bg-surface-container-lowest p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-title text-on-surface">Your {isSets ? "Set" : "Chapter"} Practice</span>
              <span className="text-label-md font-bold text-tertiary">{Math.round(counts.total / 3)} / {counts.total} Solved</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
              <div className="h-full rounded-full bg-primary-container" style={{ width: "33.3%" }} />
            </div>
            <p className="text-body-sm text-on-surface-variant">
              You are in top 15% of SEE aspirants for {isSets ? "Set Theory" : chapter.title.split(" (")[0]} preparation speed.
            </p>
          </div>
        </aside>
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-lg bg-surface-container-lowest p-4 shadow-sm sm:flex-row">
        <div className="text-body-md text-on-surface-variant">
          Showing <span className="font-bold text-on-surface">1 – {filtered.length}</span> of{" "}
          <span className="font-bold text-on-surface">{filtered.length}</span> questions
        </div>
        <div className="flex items-center gap-1">
          <button type="button" disabled className="rounded-full px-3 py-1.5 text-label-md text-outline opacity-40 transition-colors hover:bg-surface-container hover:text-on-surface disabled:opacity-40">
            ← Previous
          </button>
          <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-label-md text-on-primary">
            1
          </button>
          <button type="button" disabled className="rounded-full px-3 py-1.5 text-label-md text-outline opacity-40 transition-colors hover:bg-surface-container hover:text-on-surface disabled:opacity-40">
            Next →
          </button>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Link href={`/subjects/${subject.slug}/${chapter.slug}`} className="inline-flex items-center gap-2 text-title text-on-surface-variant transition-colors hover:text-on-surface">
          <ArrowLeft className="h-[18px] w-[18px]" aria-hidden="true" /> Back to Chapter
        </Link>
        <Link href={`/subjects/${subject.slug}/${chapter.slug}/notes`} className="inline-flex items-center gap-2 rounded-full bg-surface-container px-5 py-2.5 text-title text-on-surface transition-colors hover:bg-surface-container-high">
          <BookOpen className="h-[18px] w-[18px]" aria-hidden="true" /> Review Master Notes
          <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
        </Link>
      </div>
    </div>
    </ReaderShell>
  );
}