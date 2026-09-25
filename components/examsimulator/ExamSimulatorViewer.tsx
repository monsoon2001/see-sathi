"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  CircleStop,
  ClipboardList,
  Flag,
  Hourglass,
  Landmark,
  ListChecks,
  Lock,
  MapPin,
  Pencil,
  RotateCcw,
  School,
  ShieldCheck,
  Sparkles,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockSubjects } from "@/lib/mock/mockSubjects";
import type { PastPaper } from "@/lib/pastPapers";
import { PastPaperViewer } from "@/components/pastpapers/PastPaperViewer";
import { langFont, pickText } from "@/components/firestore/fsBlocks";
import { ReaderShell } from "@/components/reader/ReaderShell";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Lang } from "@/lib/firebase/chapterDoc";

type Phase = "instructions" | "exam" | "finished";
type FinishReason = "time-up" | "finished" | "cancelled";

const STORAGE_PREFIX = "see-sathi:examsim";

interface StoredSession {
  phase: "exam";
  deadline: number;
}

/** Instantly snaps the window to the top, ignoring the global smooth-scroll. */
function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
}

/** Parses "3 hours", "2 hrs", "1 Hour"… into minutes. Defaults to 180 (3 hours). */
function parseTimeAllowedMinutes(raw?: string): number {
  if (!raw) return 180;
  const h = raw.match(/(\d+)\s*(?:h(?:ou)?rs?|hour)\b/i);
  if (h) return Number(h[1]) * 60;
  const m = raw.match(/(\d+)\s*min(?:utes?)?\b/i);
  if (m) return Number(m[1]);
  return 180;
}

function InstructionsScreen({ paper, onStart }: { paper: PastPaper; onStart: () => void }) {
  const q = paper.question;
  const lang: Lang = q.subjectId === "nepali" ? "ne" : "en";
  const meta = mockSubjects.find((s) => s.slug === q.subjectId);
  const color = meta?.accentColor ?? "#4B4FF2";
  const subjectLabel = meta?.name.replace(" (Nepali)", "") ?? q.subjectId;
  const questionCount = q.questionSections.reduce((n, s) => n + s.items.length, 0);
  const isModel = (q.kind ?? "past") === "model";

  const rules = [
    {
      icon: Pencil,
      title: "Keep your materials ready",
      body: "Arrange a pen, pencil, eraser, sharpener, ruler, geometry box and clean rough sheets before you begin — exactly like a real SEE centre.",
    },
    {
      icon: Lock,
      title: "Answer key is locked",
      body: "While the timer is running you only see the printed question paper. The Answer Key is hidden until the mock test finishes.",
    },
    {
      icon: Hourglass,
      title: "The clock counts down",
      body: `The timer starts the instant you press “Start Mock Test” and runs for ${q.timeAllowed ?? "the full allowed time"}. When it reaches 00:00 the mock test closes automatically and the answers unlock.`,
    },
    {
      icon: ClipboardList,
      title: "Manage your time",
      body: "Skim the full paper once, then attempt section by section, spending marks-proportionate time on each question.",
    },
    {
      icon: CircleStop,
      title: "Finish or cancel anytime",
      body: "Press “Finish Mock Test” when you are ready to submit early, or end it with “Cancel Mock Test”. The paper and its answer key remain available for review afterwards.",
    },
    {
      icon: AlertTriangle,
      title: "Stay on this page",
      body: "While the mock test is running, navigation to other pages is paused. Do not refresh or close the tab either — the clock keeps ticking and the attempt is for self-practice only.",
    },
  ];

  return (
    <ReaderShell>
      <div className="mx-auto max-w-3xl px-4 pb-24 pt-10 lg:px-8">
        <Link
          href="/exam-simulator"
          className="inline-flex items-center gap-1 rounded-full bg-surface-container-lowest px-4 py-1.5 font-title text-body-sm text-on-surface shadow-sm transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Mock Test Simulator
        </Link>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-tertiary-fixed/40 px-4 py-1.5 text-tertiary dark:bg-tertiary-fixed/15 dark:text-tertiary-fixed">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          <span className="font-label-caps text-label-caps uppercase tracking-wider">Final instructions — read before you begin</span>
        </div>
        <h1 className="mt-4 font-display-hero text-display-hero tracking-tight text-on-surface">Mock Test Setup</h1>
        <p className="mt-3 max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
          You are about to sit a timed, exam-style attempt of this paper. It works exactly like the real SEE hall —
          question paper first, answers hidden, clock ticking.
        </p>

        <div className="mt-8 overflow-hidden rounded-DEFAULT border border-surface-container bg-surface-container-lowest p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 font-label-caps text-label-caps uppercase tracking-wider text-white" style={{ backgroundColor: color }}>
              <School className="h-3.5 w-3.5" aria-hidden="true" />
              {subjectLabel}
            </span>
            {isModel && (
              <span className="inline-flex items-center gap-1 rounded-full bg-tertiary-fixed px-3 py-1 font-label-caps text-label-caps uppercase tracking-wider text-on-tertiary-fixed">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                Model Paper
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-3 py-1 font-mono text-[11px] text-on-surface-variant">
              <CalendarDays className="h-3 w-3" aria-hidden="true" />
              {q.examYear}
            </span>
          </div>

          <h2 className="mt-4 font-headline-md text-headline-md leading-snug tracking-tight text-on-surface">{q.titleEn}</h2>
          <p className={cn("mt-1 font-body-md text-outline", langFont(lang))}>{q.titleNe}</p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {q.province && (
              <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-low px-3 py-1 font-body-sm text-on-surface-variant">
                <MapPin className="h-3.5 w-3.5 text-tertiary dark:text-tertiary-fixed" aria-hidden="true" />
                {q.province} Province
              </span>
            )}
            {q.paperCode && (
              <span className="rounded-full bg-surface-container-low px-3 py-1 font-mono text-[11px] text-on-surface-variant">
                {q.paperCode}
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-low px-3 py-1 font-body-sm text-on-surface-variant">
              <ListChecks className="h-3.5 w-3.5 text-tertiary dark:text-tertiary-fixed" aria-hidden="true" />
              {questionCount} questions
            </span>
            {q.fullMarks != null && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 font-body-sm font-semibold text-primary">
                <Landmark className="h-3.5 w-3.5" aria-hidden="true" />
                FM {q.fullMarks}
              </span>
            )}
            {q.timeAllowed && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 font-body-sm font-semibold text-primary">
                <Timer className="h-3.5 w-3.5" aria-hidden="true" />
                {q.timeAllowed}
              </span>
            )}
          </div>

          <p className={cn("mt-5 border-t border-surface-container pt-4 font-body-md text-[0.88em] leading-[1.53em] text-on-surface-variant", langFont(lang))}>
            {pickText(q.sourceNote, lang)}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {rules.map((r) => (
            <div key={r.title} className="flex gap-3 rounded-DEFAULT border border-surface-container bg-surface-container-lowest p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-primary">
                <r.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h3 className="font-title text-title text-on-surface">{r.title}</h3>
                <p className="mt-1 font-body-sm text-[0.88em] leading-[1.5em] text-on-surface-variant">{r.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-DEFAULT border border-surface-container bg-surface-container-lowest p-5 sm:flex-row">
          <Link
            href="/exam-simulator"
            className="inline-flex w-full items-center justify-center gap-1 rounded-full bg-surface-container px-6 py-2.5 font-title text-title text-on-surface transition-colors hover:bg-surface-container-high sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All Mock Tests
          </Link>
          <button
            type="button"
            onClick={onStart}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-container px-8 py-3 font-title text-title font-semibold text-on-primary shadow-[0_4px_14px_rgba(75,79,242,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(75,79,242,0.42)] sm:w-auto"
          >
            <Timer className="h-4 w-4" aria-hidden="true" />
            Start Mock Test
          </button>
        </div>

        <p className="mt-4 text-center font-body-sm text-outline">
          {q.timeAllowed ? `${q.timeAllowed} · ` : ""}FM {q.fullMarks ?? "—"} · Practice only — no result is recorded.
        </p>
      </div>
    </ReaderShell>
  );
}

function FinishedBanner({ reason, onRetake }: { reason: FinishReason; onRetake: () => void }) {
  const finished = reason === "time-up" || reason === "finished";
  return (
    <div className={cn("border-b", finished ? "border-success/30 bg-success-soft/40" : "border-surface-container bg-surface-container-low/50")}>
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-4 py-6 lg:px-0">
        <div className="flex items-start gap-3">
          {finished ? (
            <CheckCircle2 className="mt-0.5 h-8 w-8 shrink-0 text-success" aria-hidden="true" />
          ) : (
            <CircleStop className="mt-0.5 h-8 w-8 shrink-0 text-on-surface-variant" aria-hidden="true" />
          )}
          <div>
            <h2 className="font-headline-sm text-headline-sm tracking-tight text-on-surface">
              {reason === "time-up" ? "Mock test finished — time up" : reason === "finished" ? "Mock test finished" : "Mock test cancelled"}
            </h2>
            <p className="mt-1 max-w-xl font-body-md text-body-md text-on-surface-variant">
              {reason === "time-up"
                ? "The timer reached zero — your timed attempt is over. The Answer Key is now unlocked; scroll through and check your work."
                : reason === "finished"
                  ? "You submitted your attempt early. Well done — the Answer Key is unlocked so you can review and check your work."
                  : "You ended the mock test early. The Answer Key is unlocked if you would still like to review your answers."}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onRetake}
            className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-5 py-2 font-title text-title text-on-surface transition-colors hover:bg-surface-container-high"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Start again
          </button>
          <Link
            href="/exam-simulator"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary-container px-5 py-2 font-title text-title text-on-primary shadow-[0_4px_14px_rgba(75,79,242,0.28)] transition-all hover:-translate-y-0.5"
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            All Mock Tests
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ExamSimulatorViewer({ paper }: { paper: PastPaper }) {
  const router = useRouter();
  const q = paper.question;
  const minutes = parseTimeAllowedMinutes(q.timeAllowed);

  const [phase, setPhase] = useState<Phase>("instructions");
  const [deadline, setDeadline] = useState(0);
  const [reason, setReason] = useState<FinishReason>("time-up");
  const [navBlockOpen, setNavBlockOpen] = useState(false);

  const storageKey = `${STORAGE_PREFIX}:${paper.folderId}`;

  // Closest anchor that would navigate away from this page.
  const pendingHref = useRef<string | null>(null);

  // Ensure the page always opens at the top (the paper list preserves scroll).
  useEffect(() => {
    scrollToTop();
  }, [storageKey]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      const stored = JSON.parse(raw) as StoredSession;
      if (stored.phase !== "exam") return;
      if (stored.deadline > Date.now()) {
        setDeadline(stored.deadline);
        setReason("time-up");
        setPhase("exam");
      } else {
        setReason("time-up");
        setPhase("finished");
        window.localStorage.removeItem(storageKey);
      }
    } catch {
      /* corrupted or unavailable storage — start from instructions */
    }
  }, [storageKey]);

  useEffect(() => {
    if (phase !== "exam") return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [phase]);

  // ── Boot guard: block in-app navigation away from the running mock test ──
  useEffect(() => {
    if (phase !== "exam") return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      const anchor = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (href.startsWith("#")) return;

      const dest = new URL(anchor.href, window.location.href);
      const here = new URL(window.location.href);
      if (dest.origin !== here.origin) return; // external links open elsewhere
      if (dest.pathname === here.pathname && dest.search === here.search) return;

      // A real next-page link while the test is running — intercept it.
      e.preventDefault();
      e.stopPropagation();
      pendingHref.current = dest.pathname + dest.search + dest.hash;
      setNavBlockOpen(true);
    };

    // Trap browser Back/Forward so the attempt cannot be abandoned silently —
    // re-push the current entry to keep the user pinned to the running test.
    const onPopState = () => {
      if (typeof window !== "undefined") window.history.pushState(window.history.state, "");
    };

    window.history.pushState(window.history.state, "");
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, [phase, storageKey]);

  const startExam = () => {
    const d = Date.now() + minutes * 60 * 1000;
    setDeadline(d);
    setReason("time-up");
    setPhase("exam");
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ phase: "exam", deadline: d }));
    } catch {
      /* non-persistent storage is fine — the timer still runs in memory */
    }
    scrollToTop();
  };

  const finish = (r: FinishReason) => {
    setReason(r);
    setPhase("finished");
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
    scrollToTop();
  };

  const leaveAfterCancel = () => {
    const target = pendingHref.current;
    setNavBlockOpen(false);
    pendingHref.current = null;
    finish("cancelled");
    if (target) {
      // Let the finished frame paint, then complete the blocked navigation.
      window.setTimeout(() => router.push(target), 50);
    }
  };

  if (phase === "instructions") return <InstructionsScreen paper={paper} onStart={startExam} />;

  if (phase === "exam") {
    return (
      <ReaderShell>
        <PastPaperViewer
          paper={paper}
          exam={{ status: "running", deadline }}
          onTimeUp={() => finish("time-up")}
          onCancelExam={() => finish("cancelled")}
          onFinishExam={() => finish("finished")}
          backHref="/exam-simulator"
          backLabel="Mock Tests"
        />
        <ConfirmDialog
          open={navBlockOpen}
          title="Mock test in progress"
          description="You're mid-mock-test. The timer is still running, so leave only if you intend to end the attempt — otherwise finish or cancel the test from this page first."
          confirmLabel="Cancel test & leave"
          confirmIcon={<Flag className="h-6 w-6" aria-hidden="true" />}
          cancelLabel="Stay in the test"
          tone="danger"
          onConfirm={leaveAfterCancel}
          onCancel={() => setNavBlockOpen(false)}
          onClose={() => setNavBlockOpen(false)}
        />
      </ReaderShell>
    );
  }

  return (
    <ReaderShell>
      <FinishedBanner reason={reason} onRetake={() => setPhase("instructions")} />
      <PastPaperViewer paper={paper} backHref="/exam-simulator" backLabel="Mock Tests" />
    </ReaderShell>
  );
}