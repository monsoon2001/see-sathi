"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  Braces,
  Check,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  FileQuestion,
  FolderOpen,
  Lightbulb,
  ScrollText,
  Search,
  Sparkles,
  ThumbsUp,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getSearchResults } from "@/lib/data/search";
import { mockQuestions } from "@/lib/mock/mockQuestions";
import type { SearchResult } from "@/lib/types";

const SUBJECT_META: Record<string, { label: string; pill: string; accent: string }> = {
  mathematics: { label: "Compulsory Math", pill: "bg-primary-fixed text-primary", accent: "#4B4FF2" },
  "optional-mathematics": { label: "Optional Math", pill: "bg-secondary-fixed text-secondary", accent: "#FD583A" },
  science: { label: "Science & Tech", pill: "bg-surface-container-high text-on-surface", accent: "#2FB673" },
  english: { label: "English", pill: "bg-surface-container-high text-on-surface", accent: "#5B6EE8" },
  nepali: { label: "Compulsory Nepali", pill: "bg-surface-container-high text-on-surface", accent: "#8A63D2" },
  "social-studies": { label: "Social Studies", pill: "bg-surface-container-high text-on-surface", accent: "#E49A3D" },
  "computer-science": { label: "Computer Science", pill: "bg-surface-container-high text-on-surface", accent: "#3D8B7A" },
};

const TYPE_FILTERS: { key: SearchResult["type"] | "all"; label: string }[] = [
  { key: "all", label: "All Results" },
  { key: "chapter", label: "Chapters" },
  { key: "question", label: "Solved Questions" },
  { key: "pastpaper", label: "Past Papers" },
  { key: "note", label: "Notes & Definitions" },
  { key: "formula", label: "Formula Cards" },
];

function Marked({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"));
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-transparent text-primary">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function SearchPageContent({ pastPaperResults = [] }: { pastPaperResults?: SearchResult[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = searchParams.get("q") ?? "";
  const [input, setInput] = useState(initial);
  const [query, setQuery] = useState(initial);
  const [filter, setFilter] = useState<SearchResult["type"] | "all">("all");
  const [recent, setRecent] = useState(["Trigonometric Heights & Distances", "Mendel's Dihybrid Cross", "Pyramid Total Surface Area"]);

  // Debounced live search: typing updates results without pressing Enter.
  useEffect(() => {
    const t = setTimeout(() => {
      const trimmed = input.trim();
      if (trimmed !== query) setQuery(trimmed);
    }, 350);
    return () => clearTimeout(t);
  }, [input, query]);

  const results = useMemo(() => getSearchResults(query, pastPaperResults), [query, pastPaperResults]);
  const filtered = filter === "all" ? results : results.filter((r) => r.type === filter);
  const countFor = useCallback(
    (t: SearchResult["type"]) => results.filter((r) => r.type === t).length,
    [results],
  );

  function runSearch(q?: string) {
    const next = (q ?? input).trim();
    setQuery(next);
    if (next) router.replace(`/search?q=${encodeURIComponent(next)}`);
    else router.replace("/search");
  }

  const chapters = filtered.filter((r) => r.type === "chapter");
  const notes = filtered.filter((r) => r.type === "note");
  const questions = filtered.filter((r) => r.type === "question");
  const formulas = filtered.filter((r) => r.type === "formula");
  const pastpapers = filtered.filter((r) => r.type === "pastpaper");

  return (
    <div className="pb-24">
      <div className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <section className="mx-auto mb-12 flex w-full max-w-4xl flex-col items-center text-center">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary-fixed px-2 py-1 text-label-caps uppercase tracking-wider text-on-primary-fixed">
            <Sparkles className="h-[14px] w-[14px]" aria-hidden="true" /> Curriculum Search Engine v2.4
          </div>

          <div className="relative w-full group">
            <div className="relative flex items-center rounded-full bg-surface-container-lowest p-1 shadow-[0_8px_30px_rgba(75,79,242,0.12),0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_12px_36px_rgba(75,79,242,0.18)]">
              <div className="flex items-center justify-center pl-4 pr-1 text-primary-container">
                <Search className="h-[30px] w-[30px]" style={{ strokeWidth: 1.6 }} aria-hidden="true" />
              </div>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runSearch()}
                placeholder="Search formulae, past questions, units, or Nepali CDC chapters..."
                className="w-full bg-transparent py-1 text-headline-sm text-on-surface placeholder:text-outline focus:outline-none"
              />
              {input && (
                <button
                  type="button"
                  aria-label="Clear search input"
                  onClick={() => {
                    setInput("");
                    runSearch("");
                  }}
                  className="mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-on-surface"
                >
                  <X className="h-[18px] w-[18px]" aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                onClick={() => runSearch()}
                className="hidden shrink-0 items-center justify-center rounded-full bg-primary-container px-6 py-2 text-title text-on-primary shadow-[0_4px_14px_rgba(75,79,242,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(75,79,242,0.38)] sm:inline-flex"
              >
                Search
              </button>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-center gap-2 text-body-sm text-on-surface-variant">
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 animate-ping rounded-full bg-tertiary-container" />
              <span>
                Found <strong className="font-title text-on-surface">{results.length} results</strong> across{" "}
                <strong className="font-title text-on-surface">7 subjects</strong> in <span className="font-mono font-semibold text-primary">0.04s</span>
              </span>
            </span>
            <span className="text-outline-variant">•</span>
            <span className="hidden text-outline md:inline">Class 10 CDC Syllabi 2080/81</span>
          </div>

          <div className="no-scrollbar mt-8 flex w-full max-w-3xl items-center gap-1 overflow-x-auto pb-1 sm:justify-center">
            {TYPE_FILTERS.map((t) => {
              const count = t.key === "all" ? results.length : countFor(t.key);
              const active = filter === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setFilter(t.key)}
                  className={cn(
                    "flex shrink-0 items-center gap-1 rounded-full px-4 py-1 text-body-sm transition-all",
                    active
                      ? "bg-primary-container font-title text-on-primary shadow-[0_2px_8px_rgba(75,79,242,0.25)]"
                      : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
                  )}
                >
                  {t.label}
                  <span className={cn("rounded-full px-2 py-0.5 text-label-caps", active ? "bg-surface-container-lowest/20" : "bg-surface-container-high text-on-surface")}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <main className="space-y-12 lg:col-span-8">
            {chapters.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-6 w-6 text-primary" aria-hidden="true" />
                    <h2 className="text-headline-md text-on-surface" id="heading-chapters">
                      Curriculum Chapters
                    </h2>
                    <span className="rounded-full bg-surface-container px-1 py-0.5 text-label-caps text-on-surface-variant">
                      {chapters.length} Matches
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  {chapters.map((r) => (
                    <ChapterResult key={r.id} r={r} query={query} />
                  ))}
                </div>
              </section>
            )}

            {notes.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-6 w-6 text-primary" aria-hidden="true" />
                    <h2 className="text-headline-md text-on-surface" id="heading-notes">
                      Notes &amp; Formula Reference
                    </h2>
                    <span className="rounded-full bg-surface-container px-1 py-0.5 text-label-caps text-on-surface-variant">
                      {notes.length} Matches
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {notes.map((r, i) => (
                    <NoteResult key={r.id} r={r} query={query} showVenn={i === 0} />
                  ))}
                </div>
              </section>
            )}

            {questions.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileQuestion className="h-6 w-6 text-primary" aria-hidden="true" />
                    <h2 className="text-headline-md text-on-surface" id="heading-questions">
                      Solved Board Exam Questions
                    </h2>
                    <span className="rounded-full bg-surface-container px-1 py-0.5 text-label-caps text-on-surface-variant">
                      {questions.length} Matches
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  {questions.map((r) => (
                    <QuestionResult key={r.id} r={r} query={query} />
                  ))}
                </div>
              </section>
            )}

            {formulas.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Braces className="h-6 w-6 text-primary" aria-hidden="true" />
                    <h2 className="text-headline-md text-on-surface" id="heading-formulas">
                      Formula Cards
                    </h2>
                    <span className="rounded-full bg-surface-container px-1 py-0.5 text-label-caps text-on-surface-variant">
                      {formulas.length} Matches
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {formulas.map((r) => (
                    <Link
                      key={r.id}
                      href={`/subjects/${r.subjectSlug}/${r.chapterSlug}#formula-sheet`}
                      className="space-y-2 rounded-lg bg-surface-container-lowest p-6 shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                        <Braces className="h-[22px] w-[22px]" aria-hidden="true" />
                      </div>
                      <h3 className="text-headline-sm text-on-surface">
                        <Marked text={r.title} query={query} />
                      </h3>
                      <p className="font-mono text-body-sm text-primary">{r.snippet}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {pastpapers.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ScrollText className="h-6 w-6 text-primary" aria-hidden="true" />
                    <h2 className="text-headline-md text-on-surface" id="heading-pastpapers">
                      Past Papers &amp; Marking Schemes
                    </h2>
                    <span className="rounded-full bg-surface-container px-1 py-0.5 text-label-caps text-on-surface-variant">
                      {pastpapers.length} Matches
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {pastpapers.map((r) => (
                    <PastPaperResult key={r.id} r={r} query={query} />
                  ))}
                </div>
              </section>
            )}

            {filtered.length === 0 && (
              <div className="rounded-lg bg-surface-container-lowest p-10 text-center shadow-sm">
                <p className="text-headline-sm text-on-surface">No matches found</p>
                <p className="mt-1 text-body-sm text-on-surface-variant">Try searching a chapter title, formula, or question pattern.</p>
              </div>
            )}
          </main>

          <aside className="space-y-6 lg:col-span-4">
            <div className="space-y-2 rounded-lg bg-gradient-to-br from-primary-fixed to-surface-container p-6 shadow-sm">
              <div className="flex items-center gap-1 text-body-sm text-primary">
                <Lightbulb className="h-5 w-5" aria-hidden="true" /> SEE Examiner&apos;s Pro Tip
              </div>
              <p className="text-body-sm text-on-surface">
                In <strong>3-set Venn problems</strong>, ALWAYS begin filling data from the central intersection{" "}
                <code className="rounded bg-surface-container-lowest px-1 py-0.5 font-bold text-primary">n(A∩B∩C)</code> outwards. Missing the Venn
                diagram sketch in Group C forfeits 1 full mark even if your final numerical answer is correct!
              </p>
            </div>

            <div className="space-y-4 rounded-lg bg-surface-container-lowest p-6 shadow-sm">
              <div className="pt-1">
                <h4 className="mb-1 text-label-caps uppercase text-outline">Your Recent Searches</h4>
                <div className="flex flex-wrap gap-1.5">
                  {recent.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setInput(item);
                        runSearch(item);
                      }}
                      className="inline-flex items-center gap-1 rounded-full bg-surface-container px-2 py-1 text-xs text-on-surface-variant transition-colors hover:text-on-surface"
                    >
                      <Marked text={item} query={query} />
                      <X
                        className="h-[14px] w-[14px]"
                        aria-hidden="true"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRecent((r) => r.filter((x) => x !== item));
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}

function ChapterResult({ r, query }: { r: SearchResult; query: string }) {
  const meta = SUBJECT_META[r.subjectSlug ?? ""] ?? { label: "Chapter", pill: "bg-surface-container-high text-on-surface", accent: "#4B4FF2" };
  return (
    <article className="flex flex-col justify-between gap-4 rounded-lg bg-surface-container-lowest p-6 shadow-sm transition-all duration-200 hover:shadow-md md:flex-row md:items-center">
      <div className="flex min-w-0 items-start gap-4">
        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", meta.pill)}>
          <Braces className="h-[26px] w-[26px]" aria-hidden="true" />
        </div>
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-1">
            <span className={cn("rounded-full px-2 py-0.5 text-label-caps uppercase", meta.pill)}>{meta.label}</span>
            <span className="text-body-sm text-outline">•</span>
            <span className="text-body-sm text-on-surface-variant">Chapter {String(1).padStart(2, "0")}</span>
            <span className="rounded bg-secondary-fixed px-1 py-0.5 text-label-caps text-on-secondary-fixed">SEE: 4 Marks</span>
          </div>
          <h3 className="truncate text-headline-sm text-on-surface">
            <Marked text={r.title} query={query} />
          </h3>
          <p className="line-clamp-1 text-body-sm text-on-surface-variant">
            <Marked text={r.snippet} query={query} />
          </p>
          <div className="flex items-center gap-4 pt-1 text-body-sm text-outline">
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" aria-hidden="true" /> 12 Subtopics
            </span>
            <span className="flex items-center gap-1">
              <FileQuestion className="h-4 w-4" aria-hidden="true" /> 48 Solved Past Papers
            </span>
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-between gap-2 pt-1 md:flex-col md:items-end md:justify-center">
        <span className="rounded-full bg-surface-container px-2 py-1 text-label-caps uppercase text-tertiary">High Priority</span>
        <Link href={`/subjects/${r.subjectSlug}/${r.chapterSlug}`} className="inline-flex items-center gap-1 rounded-full bg-surface-container-high px-4 py-1 text-body-sm text-primary transition-colors hover:bg-primary hover:text-on-primary">
          Chapter Hub <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function NoteResult({ r, query, showVenn }: { r: SearchResult; query: string; showVenn?: boolean }) {
  const meta = SUBJECT_META[r.subjectSlug ?? ""] ?? { label: "Note", pill: "bg-surface-container-high text-on-surface", accent: "#4B4FF2" };
  if (showVenn) {
    return (
      <article className="flex flex-col gap-6 rounded-lg bg-surface-container-lowest p-6 shadow-sm transition-all duration-200 hover:shadow-md md:flex-row">
        <div className="relative flex h-36 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-surface-container p-2 md:w-44">
          <svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" className="h-full w-full" aria-hidden="true">
            <rect fill="#E6E6FE" height="110" rx="10" stroke="#767587" strokeDasharray="3 3" strokeWidth="1.5" width="150" x="5" y="5" />
            <text fill="#454556" fontSize="11" fontWeight="700" x="14" y="22">
              U
            </text>
            <circle cx="62" cy="62" fill="#4B4FF2" fillOpacity="0.18" r="38" stroke="#4B4FF2" strokeWidth="2" />
            <circle cx="98" cy="62" fill="#FD583A" fillOpacity="0.18" r="38" stroke="#FD583A" strokeWidth="2" />
            <path d="M80 34 C86 42 90 52 90 62 C90 72 86 82 80 90 C74 82 70 72 70 62 C70 52 74 42 80 34 Z" fill="#2F30DA" fillOpacity="0.5" />
            <text fill="#2F30DA" fontSize="12" fontWeight="800" x="50" y="65">
              A
            </text>
            <text fill="#B5250C" fontSize="12" fontWeight="800" x="103" y="65">
              B
            </text>
            <text fill="#181A2B" fontSize="9" fontWeight="600" textAnchor="middle" x="80" y="105">
              (A ∩ B)&apos; Shading
            </text>
          </svg>
          <span className="absolute bottom-2 right-2 rounded bg-surface-container-lowest/90 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-on-surface">
            SVG
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-between space-y-1">
          <div>
            <div className="flex items-center gap-1 text-label-caps uppercase text-primary">
              <span>{meta.label}</span> <span>•</span> <span>Theorems &amp; Proofs</span>
            </div>
            <h3 className="text-headline-sm text-on-surface">
              <Marked text={r.title} query={query} />
            </h3>
            <p className="mt-1 text-body-sm text-on-surface-variant">
              <Marked text={r.snippet} query={query} />
            </p>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="flex items-center gap-2 text-label-md text-outline">
              <Eye className="h-[14px] w-[14px]" aria-hidden="true" /> 1.4k students read
            </span>
            <Link href={`/subjects/${r.subjectSlug}/${r.chapterSlug}/notes`} className="inline-flex items-center gap-1 rounded-full bg-primary-fixed px-4 py-1 text-body-sm text-on-primary-fixed transition-all hover:bg-primary hover:text-on-primary">
              Open →
            </Link>
          </div>
        </div>
      </article>
    );
  }
  return (
    <article className="flex flex-col gap-4 rounded-lg bg-surface-container-lowest p-6 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", meta.pill)}>
            <Braces className="h-[22px] w-[22px]" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-1 text-label-caps uppercase text-primary">
              <span>{meta.label}</span> <span>•</span> <span>Topic 01.3</span>
            </div>
            <h3 className="text-headline-sm text-on-surface">
              <Marked text={r.title} query={query} />
            </h3>
          </div>
        </div>
        <button type="button" title="Bookmark note" className="p-1 text-on-surface-variant transition-colors hover:text-primary">
          <Bookmark className="h-[22px] w-[22px]" aria-hidden="true" />
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl bg-surface-container-low p-4">
        <div className="mb-1 text-label-caps uppercase text-outline">Standard Expansion Rule</div>
        <div className="inline-block w-full rounded-lg bg-surface-container-lowest px-4 py-2 font-mono text-body-md text-on-surface shadow-inner">
          <Marked text={r.snippet} query={query} />
        </div>
      </div>
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2 text-label-md text-outline">
          <span className="flex items-center gap-1">
            <Clock className="h-[14px] w-[14px]" aria-hidden="true" /> 6 min read
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <ThumbsUp className="h-[14px] w-[14px]" aria-hidden="true" /> 98% Found Helpful
          </span>
        </div>
        <Link href={`/subjects/${r.subjectSlug}/${r.chapterSlug}/notes`} className="inline-flex items-center gap-1 rounded-full bg-primary-fixed px-4 py-1 text-body-sm text-on-primary-fixed transition-all hover:bg-primary hover:text-on-primary">
          Open →
        </Link>
      </div>
    </article>
  );
}

function PastPaperResult({ r, query }: { r: SearchResult; query: string }) {
  const meta = SUBJECT_META[r.subjectSlug ?? ""] ?? { label: "Past Paper", pill: "bg-surface-container-high text-on-surface", accent: "#4B4FF2" };
  return (
    <article className="flex flex-col gap-4 rounded-lg bg-surface-container-lowest p-6 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl", meta.pill)}>
          <ScrollText className="h-[22px] w-[22px]" aria-hidden="true" />
        </div>
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-1">
            <span className={cn("rounded-full px-2 py-0.5 text-label-caps uppercase", meta.pill)}>{meta.label}</span>
            <span className="rounded-full bg-surface-container px-2 py-0.5 text-label-caps text-on-surface-variant">Board Paper</span>
          </div>
          <h3 className="text-headline-sm text-on-surface">
            <Marked text={r.title} query={query} />
          </h3>
          <p className="line-clamp-1 text-body-sm text-on-surface-variant">
            <Marked text={r.snippet} query={query} />
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-1">
        <span className="flex items-center gap-1 text-body-sm text-outline">
          <Eye className="h-4 w-4" aria-hidden="true" /> Full marking scheme inside
        </span>
        <Link
          href={r.href ?? `/past-papers/${r.id}`}
          className="inline-flex items-center gap-1 rounded-full bg-primary-fixed px-4 py-1.5 text-body-sm text-on-primary-fixed transition-all hover:bg-primary hover:text-on-primary"
        >
          Open Paper <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function QuestionResult({ r, query }: { r: SearchResult; query: string }) {
  const question = r.questionId
    ? mockQuestions[`${r.subjectSlug ?? "mathematics"}/${r.chapterSlug ?? "sets"}`]?.find((q) => q.id === r.questionId)
    : undefined;
  const marks = question?.marks ?? 4;
  const group = question?.group ?? "C";
  const pill =
    marks === 1
      ? "bg-surface-container-highest text-on-surface"
      : marks === 2
        ? "bg-primary-fixed text-primary"
        : marks === 5
          ? "bg-secondary-container text-on-primary"
          : "bg-error-container text-on-error-container";
  return (
    <article className="space-y-4 rounded-lg bg-surface-container-lowest p-6 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={cn("rounded-full px-2 py-1 text-label-caps", pill)}>Group {group} · {marks} Marks</span>
          <span className="rounded-full bg-surface-container px-2 py-1 text-label-caps text-on-surface">{question?.source ?? r.title}</span>
        </div>
        <span className="flex items-center gap-1 text-body-sm text-tertiary">
          <Check className="h-4 w-4" aria-hidden="true" /> 100% Correct CDC Marking
        </span>
      </div>
      <div>
        <h3 className="mb-1 text-headline-sm text-on-surface">
          <Marked text={question ? `Q${question.order}: ${question.questionText}` : r.title} query={query} />
        </h3>
        <div className="rounded-xl bg-surface-container-low p-4 text-body-md text-on-surface">
          <p className="mb-2 italic">
            &ldquo;<Marked text={question?.questionText ?? r.snippet} query={query} />&rdquo;
          </p>
          {question && (
            <div className="mt-2 flex flex-col gap-1 rounded-lg bg-surface-container-lowest p-2 font-mono text-body-sm text-on-surface-variant">
              {question.steps.slice(0, 3).map((s, i) => (
                <div key={s.number} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      i === question.steps.length - 1 || (i === 2 && question.steps.length === 3) ? "bg-tertiary-fixed text-tertiary" : "bg-primary-fixed text-primary",
                    )}
                  >
                    {i === 2 && question.steps.length === 3 ? "✓" : s.number}
                  </span>
                  <span>{s.content[s.content.length - 1]}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between pt-1">
        <span className="text-body-sm text-outline">Solved by Shambhu Bhattarai (M.Sc. Math)</span>
        <Link
          href={`/subjects/${r.subjectSlug}/${r.chapterSlug}/questions/${r.questionId}`}
          className="inline-flex items-center gap-1 rounded-full bg-primary-container px-4 py-1 text-body-sm text-on-primary transition-all hover:shadow-[0_4px_14px_rgba(75,79,242,0.3)]"
        >
          View Full Solution → <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}