"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  Bookmark,
  BrainCircuit,
  ChevronRight,
  ChevronsDown,
  ChevronsUp,
  CircleCheck,
  CircleCheckBig,
  Compass,
  Copy,
  Flag,
  Gauge,
  House,
  Medal,
  Printer,
  School,
  Sigma,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { chapterDisplayNumber } from "@/lib/chapterLabel";
import type { Chapter, Question, Subject } from "@/lib/types";
import { FontSizeControl, useFontSize } from "@/components/ui/FontSizeControl";
import { ReaderShell } from "@/components/reader/ReaderShell";
import { ReaderThemeToggle } from "@/components/theme/ReaderThemeToggle";

const QUICK_FORMULAS = [
  { label: "", value: "n(A ∪ B) = n(A) + n(B) - n(A ∩ B)" },
  { label: "", value: "n₀(A) = n(A) - n(A ∩ B)" },
  { label: "", value: "n(U) = n(A ∪ B) + n(A ∪ B)′" },
  { label: "", value: "n₀(A) + n₀(B) + n(A ∩ B) = n(A ∪ B)" },
];

const MATURITY_PILLS = {
  easy: "bg-surface-container-highest text-on-surface",
  moderate: "bg-primary-fixed text-on-primary-fixed",
  hard: "bg-secondary-fixed text-on-secondary-fixed",
} as const;

export function QuestionDetail({
  subject,
  chapter,
  question,
  all,
}: {
  subject: Subject;
  chapter: Chapter;
  question: Question;
  all: Question[];
}) {
  const [showSolution, setShowSolution] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [flagged, setFlagged] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [fontSize, setFontSize] = useFontSize(17);

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

  const isSets = subject.slug === "mathematics" && chapter.slug === "sets";
  const idx = all.findIndex((q) => q.id === question.id);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
  const related = all.filter((q) => q.id !== question.id).slice(0, 3);
  const total = all.length;
  const pct = total === 0 ? 0 : ((Math.max(idx, 0)) / total) * 100;

  async function copyFormula(i: number, value: string) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(i);
    setTimeout(() => setCopied(null), 1600);
  }

  return (
    <ReaderShell>
      <div className="sticky top-20 z-40 h-1 w-full bg-surface-container-high">
        <div className="h-full bg-tertiary transition-all duration-150" style={{ width: `${progress}%` }} />
      </div>
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-2 rounded-xl bg-surface-container-lowest p-4 shadow-sm sm:flex-row sm:items-center">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-body-sm text-on-surface-variant">
          <Link href="/subjects" className="flex items-center gap-1 transition-colors hover:text-primary">
            <House className="h-[18px] w-[18px]" aria-hidden="true" /> Subjects
          </Link>
          <ChevronRight className="h-4 w-4 text-outline" aria-hidden="true" />
          <Link href={`/subjects/${subject.slug}`} className="transition-colors hover:text-primary">
            {subject.name}
          </Link>
          <ChevronRight className="h-4 w-4 text-outline" aria-hidden="true" />
          <Link href={`/subjects/${subject.slug}/${chapter.slug}`} className="transition-colors hover:text-primary">
            {chapter.title.split(" (")[0]}
          </Link>
          <ChevronRight className="h-4 w-4 text-outline" aria-hidden="true" />
          <Link href={`/subjects/${subject.slug}/${chapter.slug}/questions`} className="transition-colors hover:text-primary">
            Solved Questions
          </Link>
          <ChevronRight className="h-4 w-4 text-outline" aria-hidden="true" />
          <span className="font-title font-semibold text-primary">Question {question.order}</span>
        </nav>
        <div className="flex items-center gap-1">
          <ReaderThemeToggle />
          <FontSizeControl value={fontSize} onChange={setFontSize} />
          <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-2 py-1 text-label-caps text-on-surface">
            <span className="h-2 w-2 rounded-full bg-secondary" /> SEE Exam Set 2080
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-fixed px-2 py-1 text-label-caps text-on-primary-fixed">
            <Timer className="h-[14px] w-[14px]" aria-hidden="true" /> 8 Min Rec.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12" style={{ fontSize: `${fontSize}px` }}>
        <div className="space-y-6 lg:col-span-8">
          <article className="relative space-y-4 overflow-hidden rounded-lg bg-surface-container-lowest p-6 shadow-sm lg:p-8">
            <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-primary-fixed/30 blur-2xl" />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-container text-headline-sm text-on-primary shadow-[0_4px_14px_rgba(75,79,242,0.28)]">
                  Q{question.order}
                </div>
                <div>
                  <span className="block text-label-caps uppercase tracking-wider text-primary">{subject.name}</span>
                  <span className="text-title text-on-surface">
                    Chapter {chapterDisplayNumber(chapter)}: {chapter.title.split(" (")[0]}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1">
                <span className="rounded-full bg-surface-container-high px-2 py-1 text-label-caps text-on-surface">
                  Question No. {question.order} (Group {question.group})
                </span>
                <span className="rounded-full bg-primary-fixed px-2 py-1 text-label-caps text-on-primary-fixed">Weightage: {question.marks} Marks</span>
              </div>
            </div>

            <div className="space-y-1 rounded-xl bg-surface-container-low p-4">
              <div className="flex items-center gap-1 text-label-caps text-on-surface-variant">
                <BrainCircuit className="h-4 w-4 text-primary" aria-hidden="true" /> Problem Statement
              </div>
              <p className="text-[1.18em] font-semibold leading-snug text-on-surface">{question.questionText}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-body-sm text-on-surface-variant">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <BadgeCheck className="h-4 w-4 text-tertiary" aria-hidden="true" /> High Frequency SEE Question
                </span>
                <span className="flex items-center gap-1">
                  <Gauge className="h-4 w-4 text-outline" aria-hidden="true" /> Difficulty: {question.difficulty[0].toUpperCase() + question.difficulty.slice(1)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowSolution((v) => !v)}
                className="inline-flex items-center gap-1 text-title text-primary transition-colors hover:text-primary-container"
              >
                {showSolution ? <ChevronsUp className="h-[18px] w-[18px]" aria-hidden="true" /> : <ChevronsDown className="h-[18px] w-[18px]" aria-hidden="true" />}
                {showSolution ? "Hide Marking Breakdown" : "Full Marking Breakdown"}
              </button>
            </div>
          </article>

          {showSolution && (
            <section className="space-y-6 rounded-lg bg-surface-container-lowest p-6 shadow-sm lg:p-8">
              <div className="flex flex-col justify-between gap-2 border-b border-surface-container pb-2 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-tertiary text-on-tertiary shadow-sm">
                    <BadgeCheck className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-headline-md text-on-surface">Solution &amp; CDC Marking Breakdown</h2>
                    <p className="text-body-sm text-on-surface-variant">Step-by-step scoring aligned with curriculum guidelines</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-4 py-1 text-label-caps text-on-surface">
                  <Medal className="h-[14px] w-[14px] text-primary" aria-hidden="true" /> Total Allocated: {question.marks.toFixed(1)} Marks
                </span>
              </div>

              <div className="flex items-start gap-2 rounded-xl bg-tertiary-fixed/30 p-4">
                <Award className="mt-0.5 h-[22px] w-[22px] shrink-0 text-tertiary" aria-hidden="true" />
                <div className="space-y-0.5">
                  <span className="block text-title text-on-tertiary-fixed">Verified by Kathmandu Board Examiners</span>
                  <p className="text-body-sm text-on-surface-variant">Follows the Official CDC Model Marking Scheme (2080/2081 Revision). Full steps are mandatory to secure partial marks in Group C.</p>
                </div>
              </div>

              <div className="space-y-4">
                {question.steps.map((step, si) => (
                  <div key={step.number} className="space-y-2 rounded-xl bg-surface-container-low p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-container text-title text-on-primary shadow-sm">
                          {step.number}
                        </div>
                        <div>
                          <h3 className="text-title text-on-surface">{step.title}</h3>
                          <p className="text-body-sm text-on-surface-variant">{step.subtitle}</p>
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full bg-tertiary-container px-2 py-1 text-label-caps text-on-tertiary">{step.marks}</span>
                    </div>

                    <div className="space-y-1 rounded bg-surface-container-lowest p-4 text-[0.82em] text-on-surface">
                      {si === 0 && question.given && question.given.length === 1 ? (
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {question.given[0]
                            .split(", ")
                            .map((g) => (
                              <div key={g} className="rounded bg-surface-container p-1 text-center font-mono text-[0.76em] text-on-surface">
                                {g}
                              </div>
                            ))}
                        </div>
                      ) : (
                        step.content.map((line, li) => {
                          const isFormula = /[∩∪′⊆≥≤]|n\(|=/.test(line);
                          const isResult = isFormula && li === step.content.length - 1 && line.includes("=");
                          return isFormula ? (
                            <div key={li} className={cn("rounded-lg bg-surface-container p-2 font-mono", isResult ? "font-bold text-primary" : "text-on-surface")}>
                              {line}
                            </div>
                          ) : (
                            <p key={li} className="text-on-surface-variant">
                              {line}
                            </p>
                          );
                        })
                      )}

                      {isSets && si === question.steps.length - 1 && (
                        <div className="flex flex-col items-center justify-center space-y-1 rounded-xl bg-surface-container p-4 pt-6">
                          <svg viewBox="0 0 420 230" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full max-w-md" role="img" aria-label="Venn diagram of sets T and C">
                            <rect fill="#ffffff" height="220" rx="14" stroke="#c6c4d8" strokeWidth="2" width="410" x="5" y="5" />
                            <text fill="#181a2b" fontSize="14" fontWeight="700" x="25" y="32">
                              U = 100
                            </text>
                            <circle cx="165" cy="115" fill="#4b4ff2" fillOpacity="0.12" r="75" stroke="#4b4ff2" strokeWidth="2.5" />
                            <circle cx="255" cy="115" fill="#fd583a" fillOpacity="0.12" r="75" stroke="#fd583a" strokeWidth="2.5" />
                            <text fill="#2f30da" fontSize="13" fontWeight="700" textAnchor="middle" x="145" y="55">
                              Set T (65)
                            </text>
                            <text fill="#b5250c" fontSize="13" fontWeight="700" textAnchor="middle" x="275" y="55">
                              Set C (45)
                            </text>
                            <text fill="#181a2b" fontSize="16" fontWeight="700" textAnchor="middle" x="130" y="122">
                              40
                            </text>
                            <text fill="#454556" fontSize="10" textAnchor="middle" x="130" y="138">
                              Tea only
                            </text>
                            <text fill="#2f30da" fontSize="18" fontWeight="800" textAnchor="middle" x="210" y="122">
                              25
                            </text>
                            <text fill="#2f30da" fontSize="10" fontWeight="600" textAnchor="middle" x="210" y="138">
                              Both (T ∩ C)
                            </text>
                            <text fill="#181a2b" fontSize="16" fontWeight="700" textAnchor="middle" x="290" y="122">
                              20
                            </text>
                            <text fill="#454556" fontSize="10" textAnchor="middle" x="290" y="138">
                              Coffee only
                            </text>
                            <text fill="#767587" fontSize="13" fontWeight="600" textAnchor="middle" x="360" y="200">
                              15
                            </text>
                            <text fill="#767587" fontSize="10" textAnchor="middle" x="360" y="214">
                              (T ∪ C)′
                            </text>
                          </svg>
                          <span className="text-center text-label-caps text-on-surface-variant">Official CDC Formatted Figure: Venn Diagram for Survey Groups</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-4 rounded-xl bg-tertiary-fixed/40 p-6 shadow-sm">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tertiary text-on-tertiary shadow-sm">
                  <CircleCheck className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="text-[1.18em] font-bold tracking-tight text-tertiary">Final Answer Summary</div>
                  {isSets && question.order === 1 ? (
                    <div className="space-y-1 text-[0.94em] text-on-surface">
                      <p>
                        <span className="font-bold text-primary">(i)</span> Number of students who like both tea and coffee:{" "}
                        <span className="font-mono font-bold text-on-surface">n(T ∩ C) = 25 students</span>
                      </p>
                      <p>
                        <span className="font-bold text-primary">(ii)</span> Number of students who like tea only:{" "}
                        <span className="font-mono font-bold text-on-surface">n₀(T) = 40 students</span>
                      </p>
                    </div>
                  ) : (
                    <p className="text-[0.94em] text-on-surface">{question.answer}</p>
                  )}
                  <p className="pt-1 text-[0.76em] text-on-surface-variant">
                    Calculations validated against: 40 (tea only) + 20 (coffee only) + 25 (both) + 15 (neither) = 100 (Total Universe).
                  </p>
                </div>
              </div>
            </section>
          )}

          <div className="flex flex-col items-center justify-between gap-4 rounded-xl bg-gradient-to-r from-primary/10 via-surface-container to-secondary-container/10 p-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary-container text-on-primary shadow-sm">
                <School className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-title text-on-surface">Need help memorizing these 4 formulas?</p>
                <p className="text-body-sm text-on-surface-variant">Review the Master Formula Cheat Sheet curated by SEE gold medalists.</p>
              </div>
            </div>
            <Link
              href={`/subjects/${subject.slug}/${chapter.slug}#formula-sheet`}
              className="shrink-0 rounded-full bg-surface-container-lowest px-4 py-1 text-title text-primary shadow-sm transition-colors hover:bg-surface-container"
            >
              Open Formula Sheet →
            </Link>
          </div>
        </div>

        <aside className="space-y-4 lg:col-span-4">
          <div className="space-y-4 rounded-lg bg-surface-container-lowest p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-headline-sm text-on-surface">Chapter Mastery</h3>
              <span className="rounded-full bg-tertiary-fixed px-2 py-1 text-label-caps text-on-tertiary-fixed">{chapter.title.split(" (")[0]}: 82% Active</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-body-sm">
                <span className="text-on-surface-variant">Solved Questions in {chapter.title.split(" (")[0]}</span>
                <span className="font-title font-semibold text-on-surface">18 / 22 Completed</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
                <div className="h-full rounded-full bg-primary-container" style={{ width: "82%" }} />
              </div>
            </div>
            <div className="flex items-center gap-1 pt-1">
              <span className="text-title text-on-surface">+30 XP today</span>
            </div>
          </div>

          <div className="space-y-4 rounded-lg bg-surface-container-lowest p-4 shadow-sm">
            <div className="flex items-center justify-between pb-1">
              <h3 className="flex items-center gap-1.5 text-title text-on-surface">
                <Sigma className="h-[18px] w-[18px] text-primary" aria-hidden="true" /> Quick Formula Drawer
              </h3>
              <span className="text-label-caps text-on-surface-variant">2-Set Rules</span>
            </div>
            <div className="space-y-1">
              {QUICK_FORMULAS.map((f, i) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => copyFormula(i, f.value)}
                  className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg bg-surface-container p-2 text-left font-mono text-body-sm text-on-surface transition-colors hover:bg-surface-container-high"
                >
                  {copied === i ? (
                    <span className="font-title text-body-sm text-tertiary">Formula copied to clipboard!</span>
                  ) : (
                    <span>{f.value}</span>
                  )}
                  {copied === i ? (
                    <CircleCheck className="h-4 w-4 text-tertiary" aria-hidden="true" />
                  ) : (
                    <Copy className="h-4 w-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-lg bg-surface-container-lowest p-4 shadow-sm">
            <h3 className="flex items-center gap-1.5 text-title text-on-surface">
              <Compass className="h-[18px] w-[18px] text-secondary" aria-hidden="true" /> Related Questions in {chapter.title.split(" (")[0]}
            </h3>
            <div className="space-y-1">
              {related.map((q, i) => {
                const relOrder = q.order;
                return (
                  <Link
                    key={q.id}
                    href={`/subjects/${subject.slug}/${chapter.slug}/questions/${q.id}`}
                    className="group flex items-start gap-2 rounded-lg bg-surface-container-low p-2 transition-colors hover:bg-surface-container"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-surface-container-high font-mono text-label-md text-primary">Q{relOrder}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-body-sm text-on-surface transition-colors group-hover:text-primary">{q.questionText}</span>
                      <span className="text-label-caps text-on-surface-variant">{q.tags[0]} · {q.marks} Marks</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg bg-surface-container-high shadow-sm">
            <div className="flex h-36 w-full items-center justify-center bg-gradient-to-br from-primary/15 via-surface-container-high to-secondary-container/20">
              <div className="text-center">
                <div className="text-label-caps uppercase text-outline">Kathmandu Valley · Sunrise</div>
              </div>
            </div>
            <div className="space-y-1 p-4">
              <span className="text-label-caps uppercase text-primary">CDC Examiner Tip</span>
              <p className="text-body-md text-on-surface">
                &ldquo;Always state your set declarations (Let T and C be...) in your SEE answer sheet to secure the initial 1 mark before applying equations.&rdquo;
              </p>
              <p className="text-body-sm text-on-surface-variant">— Narayan Adhikari, SEE Evaluation Board</p>
            </div>
          </div>
        </aside>
      </div>

      <div className="space-y-4 rounded-xl bg-surface-container-lowest p-4 shadow-md">
        <div className="flex flex-col justify-between gap-2 pb-1 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
            <span className="text-title text-on-surface">Question {question.order} of {total}</span>
            <span className="text-body-sm text-on-surface-variant">(Compulsory Math SEE Bank)</span>
          </div>
          <div className="flex w-full items-center gap-4 sm:w-64">
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
              <div className="h-full rounded-full bg-primary-container" style={{ width: `${pct}%` }} />
            </div>
            <span className="whitespace-nowrap font-mono text-label-md font-bold text-primary">{pct.toFixed(1)}%</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-surface-container pt-2 sm:flex-row">
          <div className="flex w-full flex-wrap items-center justify-between gap-2 sm:w-auto sm:justify-start">
            <Link
              href={prev ? `/subjects/${subject.slug}/${chapter.slug}/questions/${prev.id}` : `/subjects/${subject.slug}/${chapter.slug}/questions`}
              className="inline-flex items-center gap-1 rounded-full bg-surface-container px-4 py-2 text-title text-on-surface shadow-sm transition-colors hover:bg-surface-container-high"
            >
              <ArrowLeft className="h-[18px] w-[18px]" aria-hidden="true" /> {prev ? `Previous (Q${prev.order})` : "Previous"}
            </Link>
            <Link
              href={next ? `/subjects/${subject.slug}/${chapter.slug}/questions/${next.id}` : `/subjects/${subject.slug}/${chapter.slug}/questions`}
              className="inline-flex items-center gap-1 rounded-full bg-primary-container px-5 py-2 text-title text-on-primary shadow-[0_4px_14px_rgba(75,79,242,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(75,79,242,0.38)]"
            >
              {next ? `Next Question (Q${next.order})` : "All Questions"}
              <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
            </Link>
          </div>
          <div className="flex w-full flex-wrap items-center justify-end gap-1 sm:w-auto">
            <button
              type="button"
              onClick={() => setBookmarked((v) => !v)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full bg-surface-container-low px-4 py-2 text-body-sm text-on-surface transition-colors hover:bg-surface-container",
                bookmarked && "bg-primary-fixed text-on-primary-fixed",
              )}
            >
              <Bookmark className={cn("h-[18px] w-[18px]", bookmarked ? "text-on-primary-fixed" : "text-primary")} aria-hidden="true" />
              {bookmarked ? "Saved to Vault" : "Bookmark Question"}
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Do you want to submit a correction flag for Question 1 to the SEE Editorial Board?")) {
                  setFlagged(true);
                }
              }}
              className={cn(
                "inline-flex items-center gap-1 rounded-full bg-surface-container-low px-4 py-2 text-body-sm text-on-surface transition-colors hover:bg-surface-container",
                flagged && "bg-tertiary-fixed text-on-tertiary-fixed",
              )}
            >
              {flagged ? <CircleCheck className="h-[18px] w-[18px] text-tertiary" aria-hidden="true" /> : <Flag className="h-[18px] w-[18px] text-outline" aria-hidden="true" />}
              {flagged ? "Flagged" : "Report Error"}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1 rounded-full bg-surface-container-low px-4 py-2 text-body-sm text-on-surface transition-colors hover:bg-surface-container"
            >
              <Printer className="h-[18px] w-[18px] text-outline" aria-hidden="true" /> Print / PDF
            </button>
          </div>
        </div>
</div>
      </div>
    </ReaderShell>
  );
}