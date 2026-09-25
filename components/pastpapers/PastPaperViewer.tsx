"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  BookCheck,
  CalendarDays,
  CheckCircle2,
  CircleCheck,
  CircleStop,
  Flag,
  Hourglass,
  Landmark,
  ListChecks,
  Lock,
  MapPin,
  MessageSquareQuote,
  NotebookPen,
  School,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Bilingual, FsTable, Lang } from "@/lib/firebase/chapterDoc";
import type { PastPaper, PastPaperItem, PastPaperSection } from "@/lib/pastPapers";
import { BlockView, BilingualTable, ImageBox, LangToggle, langFont, pickText, splitEnumeratedPoints } from "@/components/firestore/fsBlocks";
import { RichText } from "@/components/math/RichText";
import { ScrollProgressBar } from "@/components/layout/ScrollProgressBar";
import { FontSizeControl, useFontSize } from "@/components/ui/FontSizeControl";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ReaderShell } from "@/components/reader/ReaderShell";
import { ReaderThemeToggle } from "@/components/theme/ReaderThemeToggle";

type Mode = "questions" | "answers";

const ROMAN_IDX: Record<string, number> = { i: 0, ii: 1, iii: 2, iv: 3, v: 4, vi: 5, vii: 6, viii: 7 };

const SECTION_COLORS = [
  "bg-primary-container text-on-primary",
  "bg-tertiary-fixed text-[#005B34]",
  "bg-secondary-fixed text-on-secondary-fixed",
  "bg-surface-container-high text-on-surface",
  "bg-primary-fixed text-on-primary-fixed",
  "bg-secondary-container/40 text-on-surface",
];

function fmtMarks(marks?: number) {
  if (marks == null) return "";
  return Number.isInteger(marks) ? String(marks) : "½";
}

/** Pretty clock: "59:03" under an hour, "2:59:03" at an hour or more. */
function fmtClock(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function hasText(b?: Bilingual): boolean {
  return Boolean(b && (b.en?.trim() || b.ne?.trim()));
}

function bKey(b?: Bilingual): string {
  if (!b) return "";
  return `${(b.en ?? "").trim()}\u0000${(b.ne ?? "").trim()}`;
}

function sameTable(a?: FsTable, b?: FsTable): boolean {
  if (!a || !b) return false;
  return JSON.stringify(a) === JSON.stringify(b);
}

function mergeAnswerItems(sections: PastPaperSection[], answer?: PastPaper | null): PastPaperSection[] {
  const items = new Map<string, PastPaperItem>();
  answer?.answer?.questionSections.forEach((s) => s.items.forEach((it) => items.set(it.id, it)));
  return sections.map((sec) => ({
    ...sec,
    items: sec.items.map((it) => {
      const ans = items.get(it.id);
      if (!ans) return it;
      return {
        ...it,
        ...ans,
        code: it.code, // keep the program printed in the question stem (if any)
        answerCode: ans.code, // solution program lives on the answer side
        question: hasText(ans.question) ? ans.question : it.question,
        passage: hasText(ans.passage) ? ans.passage : it.passage,
      };
    }),
  }));
}

function PassagePanel({ passage, lang, className }: { passage: Bilingual; lang: Lang; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-DEFAULT border border-primary/15 bg-surface-container-low/70", className)}>
      <div className="flex items-center gap-2 border-b border-primary/15 bg-primary/5 px-4 py-2">
        <MessageSquareQuote className="h-4 w-4 text-primary" aria-hidden="true" />
        <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary">Read the passage</span>
      </div>
      <p
        className={cn(
          "whitespace-pre-line px-5 py-4 font-body text-[0.91em] leading-[1.65em] text-on-surface-variant",
          langFont(lang),
        )}
      >
        {pickText(passage, lang)}
      </p>
    </div>
  );
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  return (
    <div className="mt-3 overflow-hidden rounded-DEFAULT border border-surface-container bg-surface-container-low">
      {language && (
        <div className="flex items-center gap-2 border-b border-surface-container bg-surface-container-lowest/70 px-4 py-1.5">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-tertiary dark:text-tertiary-fixed">{language}</span>
        </div>
      )}
      <pre className="overflow-x-auto whitespace-pre px-4 py-3 font-mono text-[0.82em] leading-[1.6em] text-on-surface">{code}</pre>
    </div>
  );
}

function PaperQuestionCard({
  item,
  index,
  lang,
  showAnswer,
  subjectId,
  showPassage,
  showImage,
  showTable,
}: {
  item: PastPaperItem;
  index: number;
  lang: Lang;
  showAnswer: boolean;
  subjectId: string;
  showPassage?: boolean;
  showImage?: boolean;
  showTable?: boolean;
}) {
  const answerText = pickText(item.answer, lang);
  const answerPoints = splitEnumeratedPoints(answerText);
  const hasAnswer = Boolean(item.answer || item.solution || item.modelAnswer || item.solutionTable || item.answerCode);
  const correctIdx =
    item.correctOption != null ? ROMAN_IDX[item.correctOption.toLowerCase()] : undefined;
  const plain = subjectId === "computer-science"; // QBASIC/C prose is full of $, not LaTeX

  return (
    <article className="rounded-DEFAULT border border-surface-container bg-surface-container-lowest p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container font-title text-body-sm text-on-primary">
          {item.questionNumber ?? String(index + 1)}
        </span>
        {item.section && (
          <span className="rounded-full bg-secondary-fixed px-3 py-0.5 font-label-caps text-label-caps uppercase tracking-wider text-on-secondary-fixed">
            Section {item.section}
          </span>
        )}
        {item.marks != null && (
          <span className="rounded-full bg-surface-container px-3 py-0.5 font-title text-body-sm text-on-surface-variant">
            {fmtMarks(item.marks)} marks
          </span>
        )}
        {item.altLabel && (
          <span className="rounded-full bg-surface-container-high px-3 py-0.5 font-title text-body-sm text-on-surface-variant">
            {item.altLabel}
          </span>
        )}
      </div>

      <p className={cn("whitespace-pre-line font-title text-[1.06em] leading-[1.76em] text-on-surface", langFont(lang))}>
        {plain ? pickText(item.question, lang) : <RichText text={pickText(item.question, lang)} lang={lang} />}
      </p>

      {item.passage && showPassage && <PassagePanel passage={item.passage} lang={lang} className="mt-4" />}

      {item.code && <CodeBlock code={item.code} language={item.codeLanguage} />}

      {item.ocrFlag && (
        <p className="mt-3 rounded-DEFAULT bg-tertiary-fixed/10 px-4 py-2.5 font-body-sm text-[0.82em] italic leading-[1.5em] text-on-surface-variant">
          {item.ocrFlag}
        </p>
      )}

      {item.image?.url && showImage && (
        <div className="my-4">
          <ImageBox src={item.image.url} alt={pickText(item.image.caption, lang)} />
          {item.image.caption && (
            <p className={cn("-mt-1 mb-2 text-center font-body-sm text-[0.79em] leading-[1.18em] text-on-surface-variant", langFont(lang))}>
              {pickText(item.image.caption, lang)}
            </p>
          )}
        </div>
      )}

      {item.table && showTable && (
        <div className="my-4">
          <BilingualTable table={item.table} lang={lang} />
        </div>
      )}

      {item.options && item.options.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {item.options.map((opt, i) => {
            const text = pickText(opt, lang);
            const highlighted = showAnswer && hasAnswer && (correctIdx === i || (correctIdx == null && answerText !== "" && text === answerText));
            return (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 font-body-sm text-[0.88em]",
                  highlighted
                    ? "bg-tertiary-fixed/50 font-semibold text-tertiary ring-1 ring-inset ring-tertiary-container/40"
                    : "bg-surface-container-low text-on-surface-variant",
                )}
              >
                <span className="font-title text-label-md">{String.fromCharCode(65 + i)}.</span>
                <span className={cn(langFont(lang))}>{text}</span>
                {highlighted && <CircleCheck className="ml-auto h-4 w-4 shrink-0" aria-hidden="true" />}
              </div>
            );
          })}
        </div>
      )}

      {showAnswer && hasAnswer && (
        <div className="mt-4 rounded-DEFAULT bg-surface-container-low p-4">
          {item.answer && (
            <div className="mb-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-fixed px-2.5 py-0.5 font-label-caps text-label-caps uppercase text-primary">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Ans.
              </span>
              {answerPoints ? (
                <ol className="mt-1.5 space-y-1.5">
                  {answerPoints.map((p, i) => (
                    <li
                      key={i}
                      className={cn("whitespace-pre-line font-title text-[0.94em] font-semibold text-on-surface", langFont(lang))}
                    >
                      {plain ? p : <RichText text={p} lang={lang} />}
                    </li>
                  ))}
                </ol>
              ) : (
                <span className={cn("whitespace-pre-line font-title text-[0.94em] font-semibold text-on-surface", langFont(lang))}>
                  {plain ? answerText : <RichText text={answerText} lang={lang} />}
                </span>
              )}
            </div>
          )}
          {item.answerCode && item.answerCode !== item.code && <CodeBlock code={item.answerCode} language={item.codeLanguage} />}
          {item.solution && (
            <p className={cn("whitespace-pre-line font-body-md text-[0.91em] leading-[1.53em] text-on-surface-variant", langFont(lang))}>
              {plain ? pickText(item.solution, lang) : <RichText text={pickText(item.solution, lang)} lang={lang} />}
            </p>
          )}
          {item.modelAnswer && (
            <div className="mt-3 overflow-hidden rounded-DEFAULT border border-primary/15 bg-surface-container-lowest">
              <div className="flex items-center gap-2 border-b border-primary/15 bg-primary/5 px-4 py-2">
                <NotebookPen className="h-4 w-4 text-primary" aria-hidden="true" />
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary">Model Answer</span>
              </div>
              <p
                className={cn(
                  "whitespace-pre-line px-5 py-4 font-body-md text-[0.91em] leading-[1.65em] text-on-surface",
                  langFont(lang),
                )}
              >
                <RichText text={pickText(item.modelAnswer, lang)} lang={lang} />
              </p>
            </div>
          )}
          {item.solutionTable && (
            <div className="mt-3">
              <BilingualTable table={item.solutionTable} lang={lang} />
            </div>
          )}
        </div>
      )}

      {showAnswer && !hasAnswer && (
        <p className="mt-4 rounded-DEFAULT bg-surface-container-low px-4 py-3 font-body-sm text-on-surface-variant">
          Answer not published for this question yet.
        </p>
      )}
    </article>
  );
}

export function PastPaperViewer({
  paper,
  exam,
  onTimeUp,
  onCancelExam,
  onFinishExam,
  backHref = "/past-papers",
  backLabel = "Past Papers",
}: {
  paper: PastPaper;
  /** When "running", the answer key is locked and a countdown timer is shown.
   *  "finished" (or no prop) unlocks the paper exactly like a normal read. */
  exam?: { status: "running"; deadline: number } | { status: "finished" };
  /** Fired once the countdown reaches zero while running. */
  onTimeUp?: () => void;
  /** Fired when the student confirms cancelling the mock test. */
  onCancelExam?: () => void;
  /** Fired when the student confirms finishing the mock test early. */
  onFinishExam?: () => void;
  /** Where the "back to the list" links point. */
  backHref?: string;
  backLabel?: string;
}) {
  const q = paper.question;
  const [lang, setLang] = useState<Lang>(() => (q.subjectId === "nepali" ? "ne" : "en"));
  const [mode, setMode] = useState<Mode>("questions");
  const [fontSize, setFontSize] = useFontSize(17);
  const [confirmAction, setConfirmAction] = useState<"cancel" | "finish" | null>(null);

  const running = exam?.status === "running";
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [running]);
  const remainingSecs = running ? Math.max(0, Math.ceil((exam.deadline - now) / 1000)) : 0;
  const timeUp = running && remainingSecs <= 0;
  useEffect(() => {
    if (timeUp) onTimeUp?.();
  }, [timeUp, onTimeUp]);
  const answersLocked = running && !timeUp;

  const NO_TOGGLE_SUBJECTS = ["english", "nepali", "computer-science", "social-studies"];
  const showLangToggle = !NO_TOGGLE_SUBJECTS.includes(q.subjectId);

  const hasAnswers = paper.answer != null;
  const sections = useMemo(() => mergeAnswerItems(q.questionSections, paper), [q, paper]);
  const activeSections = hasAnswers && mode === "answers" ? sections : q.questionSections;
  const title = lang === "ne" ? q.titleNe : q.titleEn;

  return (
    <ReaderShell>
      <div className="pb-24">
      <div className="sticky top-20 z-40">
        <ScrollProgressBar />
        <div className="border-b border-surface-container bg-background/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-on-surface-variant">
              <Link
                href={backHref}
                className="flex items-center gap-1 rounded-full bg-surface-container-lowest px-4 py-1.5 font-title text-body-sm text-on-surface shadow-sm transition-colors hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {backLabel}
              </Link>
              <span className="rounded-full bg-primary-fixed px-3 py-1.5 font-label-caps text-label-caps text-on-primary-fixed">
                {running
                  ? lang === "ne"
                    ? "मोक टेस्ट चलिरहेको छ"
                    : "Mock test in progress"
                  : lang === "ne"
                    ? `${q.examYear} वैकल्पिक`
                    : `SEE ${q.examYear}`}
              </span>
              <span className="hidden font-label-caps text-label-caps uppercase tracking-wider text-tertiary dark:text-tertiary-fixed sm:inline">
                {"·"} {q.paperCode}
              </span>
            </nav>

            <div className="flex flex-wrap items-center gap-2">
              {running && (
                <span
                  title="Time remaining"
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-mono text-title font-bold tabular-nums",
                    remainingSecs < 600
                      ? "animate-pulse bg-error-container/70 text-on-error-container"
                      : "bg-primary-fixed/40 text-primary dark:bg-primary-fixed/25 dark:text-primary-fixed",
                  )}
                >
                  <Hourglass className="h-4 w-4" aria-hidden="true" />
                  {fmtClock(remainingSecs)}
                </span>
              )}
              {running && (
                <button
                  type="button"
                  onClick={() => setConfirmAction("finish")}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary-container px-4 py-2 font-title text-title font-semibold text-on-primary shadow-[0_4px_14px_rgba(75,79,242,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(75,79,242,0.4)]"
                >
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  Finish Mock Test
                </button>
              )}
              {running && (
                <button
                  type="button"
                  onClick={() => setConfirmAction("cancel")}
                  className="inline-flex items-center gap-1.5 rounded-full bg-error-container px-4 py-2 font-title text-title font-semibold text-on-error-container transition-colors hover:opacity-90"
                >
                  <CircleStop className="h-4 w-4" aria-hidden="true" />
                  Cancel Mock Test
                </button>
              )}
              <ReaderThemeToggle />
              <div className="inline-flex items-center gap-1 rounded-full bg-surface-container p-1">
                {(["questions", "answers"] as const).map((m) => {
                  const disabled = m === "answers" && (!hasAnswers || answersLocked);
                  return (
                    <button
                      key={m}
                      type="button"
                      disabled={disabled}
                      onClick={() => setMode(m)}
                      title={
                        m === "answers" && answersLocked
                          ? "Answers are locked while the mock test is running. They unlock when the timer ends, you finish, or you cancel the test."
                          : m === "answers" && !hasAnswers
                            ? "No answer key published yet"
                            : undefined
                      }
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 font-title text-body-sm transition-all",
                        mode === m
                          ? "bg-surface-container-lowest text-on-surface shadow-sm"
                          : disabled
                            ? "cursor-not-allowed font-medium text-outline-variant"
                            : "font-medium text-on-surface-variant hover:text-on-surface",
                      )}
                    >
                      {m === "answers" && answersLocked && <Lock className="h-3.5 w-3.5" aria-hidden="true" />}
                      {m === "questions" ? "Question Paper" : "Answer Key"}
                    </button>
                  );
                })}
              </div>
              <FontSizeControl value={fontSize} onChange={setFontSize} />
              {showLangToggle && <LangToggle lang={lang} onChange={setLang} />}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 lg:px-0" style={{ fontSize: `${fontSize}px` }}>
        <div className="mb-2 inline-flex flex-wrap items-center gap-2 pt-8">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-4 py-1 font-bold text-label-caps uppercase tracking-wider text-primary dark:bg-primary-fixed/15 dark:text-primary-fixed">
            <School className="h-[14px] w-[14px]" aria-hidden="true" />
            {q.subjectId}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-tertiary-fixed/50 px-3 py-1 font-label-caps text-label-caps text-tertiary dark:bg-tertiary-fixed/15 dark:text-tertiary-fixed">
            <ListChecks className="h-3.5 w-3.5" aria-hidden="true" />
            {q.questionSections.reduce((n, s) => n + s.items.length, 0)} questions
          </span>
        </div>

        <h1 className="mb-2 font-display-hero text-display-hero tracking-tight text-on-surface">{title}</h1>
        <p className={cn("mb-1 font-headline-sm text-headline-sm text-outline", langFont(lang))}>
          {lang === "ne" ? q.titleNe : q.titleEn}
        </p>

        <div className="mb-6 flex flex-wrap items-center gap-2">
          {q.examYear && (
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-3 py-1 font-body-sm text-on-surface-variant">
              <CalendarDays className="h-3.5 w-3.5 text-tertiary dark:text-tertiary-fixed" aria-hidden="true" />
              {q.examYear}
            </span>
          )}
          {q.province && (
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-3 py-1 font-body-sm text-on-surface-variant">
              <MapPin className="h-3.5 w-3.5 text-tertiary dark:text-tertiary-fixed" aria-hidden="true" />
              {q.province} Province
            </span>
          )}
          {q.paperCode && (
            <span className="rounded-full bg-surface-container px-3 py-1 font-mono text-[11px] text-on-surface-variant">{q.paperCode}</span>
          )}
          {q.fullMarks != null && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 font-body-sm font-semibold text-primary dark:bg-primary-fixed/15 dark:text-primary-fixed">
              <Landmark className="h-3.5 w-3.5" aria-hidden="true" />
              FM {q.fullMarks}
            </span>
          )}
          {q.timeAllowed && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 font-body-sm font-semibold text-primary dark:bg-primary-fixed/15 dark:text-primary-fixed">
              <Timer className="h-3.5 w-3.5" aria-hidden="true" />
              {q.timeAllowed}
            </span>
          )}
        </div>

        {mode === "answers" && paper.answer?.answerLanguageLevelNote && (
          <div className="mb-6 rounded-DEFAULT border border-tertiary-container/40 bg-tertiary-fixed/10 p-4">
            <p className={cn("font-body-md text-[0.88em] leading-[1.41em] text-on-surface-variant", langFont(lang))}>
              {pickText(paper.answer.answerLanguageLevelNote, lang)}
            </p>
          </div>
        )}

        {q.sourceNote && (
          <div className="mb-6 rounded-DEFAULT bg-surface-container-lowest p-4 text-on-surface-variant shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <p className="mb-2 inline-flex items-center gap-1.5 font-label-caps text-label-caps uppercase tracking-wider text-outline">
              <MessageSquareQuote className="h-3.5 w-3.5" aria-hidden="true" />
              {lang === "ne" ? "स्रोत नोट" : "Source note"}
            </p>
            <p className={cn("font-body-md text-[0.88em] leading-[1.53em]", langFont(lang))}>{pickText(q.sourceNote, lang)}</p>
          </div>
        )}

        {q.blocks.length > 0 && (
          <div className="mb-6">
            {q.blocks.map((block, i) => (
              <BlockView key={i} block={block} lang={lang} />
            ))}
          </div>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {activeSections.map((s, i) => (
            <a
              key={i}
              href={`#pp-section-${i}`}
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
          {activeSections.map((s, i) => {
            const passageItems = s.items.filter((it) => it.passage && hasText(it.passage));
            const sharedKey =
              passageItems.length > 0 && passageItems.every((it) => bKey(it.passage) === bKey(passageItems[0].passage))
                ? bKey(passageItems[0].passage)
                : null;
            const sharedPassage = sharedKey ? passageItems[0].passage : undefined;
            return (
              <section key={i} id={`pp-section-${i}`} className="scroll-mt-40">
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
                {s.instructions && (
                  <p className={cn("-mt-2 mb-4 font-body-sm text-[0.82em] italic text-on-surface-variant", langFont(lang))}>
                    <RichText text={pickText(s.instructions, lang)} lang={lang} />
                  </p>
                )}
                {sharedPassage && <PassagePanel passage={sharedPassage} lang={lang} className="mb-4" />}
                <div className="space-y-4">
                  {s.items.map((item, qi) => {
                    const prev = s.items[qi - 1];
                    const samePassage = prev != null && bKey(prev.passage) === bKey(item.passage);
                    const sameImage = prev?.image?.url != null && prev.image.url === item.image?.url;
                    const sameTableGrid = sameTable(prev?.table, item.table);
                    return (
                      <PaperQuestionCard
                        key={item.id || qi}
                        item={item}
                        index={qi + 1}
                        lang={lang}
                        showAnswer={mode === "answers"}
                        subjectId={q.subjectId}
                        showPassage={sharedKey ? false : !samePassage}
                        showImage={!sameImage}
                        showTable={!sameTableGrid}
                      />
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {!hasAnswers && (
          <div className="mt-12 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-surface-container bg-surface-container-lowest/60 px-6 py-10 text-center">
            <NotebookPen className="h-8 w-8 text-outline-variant" aria-hidden="true" />
            <h2 className="font-headline-sm text-headline-sm tracking-tight text-on-surface">
              {lang === "ne" ? "उत्तर कुञ्जी चाँडै आउँदैछ।" : "The answer key for this paper is coming soon."}
            </h2>
          </div>
        )}

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-surface-container pt-6 sm:flex-row">
          <Link
            href={backHref}
            className="inline-flex w-full items-center justify-center gap-1 rounded-full bg-surface-container px-6 py-2 font-title text-title text-on-surface transition-colors hover:bg-surface-container-high sm:w-auto"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            {backLabel === "Past Papers" ? "All Past Papers" : `All ${backLabel}`}
          </Link>
          {hasAnswers && !running && (
            <button
              type="button"
              onClick={() => setMode(mode === "answers" ? "questions" : "answers")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-container px-6 py-2 font-title text-title text-on-primary shadow-[0_4px_14px_rgba(75,79,242,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(75,79,242,0.38)] sm:w-auto"
            >
              <BookCheck className="h-4 w-4" aria-hidden="true" />
              {mode === "answers" ? "Question Paper" : "Check Answers"}
            </button>
          )}
        </div>
      </div>
      </div>
      <ConfirmDialog
        open={confirmAction != null}
        tone={confirmAction === "cancel" ? "danger" : "primary"}
        title={confirmAction === "cancel" ? "Cancel this mock test?" : "Finish this mock test?"}
        description={
          confirmAction === "cancel"
            ? "Your attempt closes early and nothing is recorded. You can still read the paper and check the answer key afterwards."
            : "Your timer stops here and the Answer Key unlocks immediately — just like submitting your paper in the SEE hall. You can review everything afterwards."
        }
        confirmLabel={confirmAction === "cancel" ? "Cancel Mock Test" : "Finish Mock Test"}
        confirmIcon={
          confirmAction === "cancel" ? (
            <CircleStop className="h-6 w-6" aria-hidden="true" />
          ) : (
            <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
          )
        }
        cancelLabel="Keep going"
        onConfirm={() => {
          setConfirmAction(null);
          if (confirmAction === "cancel") onCancelExam?.();
          else onFinishExam?.();
        }}
        onCancel={() => setConfirmAction(null)}
        onClose={() => setConfirmAction(null)}
      />
    </ReaderShell>
  );
}