import Link from "next/link";
import { ArrowRight, BadgeCheck, Check, CircleAlert, TrendingUp } from "lucide-react";
import type { Question } from "@/lib/types";

const MARKS_PILL: Record<Question["group"], string> = {
  A: "bg-surface-container-highest text-on-surface",
  B: "bg-primary-fixed text-on-primary-fixed",
  C: "bg-primary-fixed text-on-primary-fixed",
  D: "bg-secondary-container text-on-primary",
};

const INTENT: Record<Question["difficulty"], { label: string; icon: React.ReactNode; className: string }> = {
  easy: {
    label: "Fundamental Concept",
    icon: <Check className="h-[15px] w-[15px]" aria-hidden="true" />,
    className: "bg-surface-container-low text-tertiary",
  },
  moderate: {
    label: "Frequent Pattern",
    icon: <TrendingUp className="h-[15px] w-[15px]" aria-hidden="true" />,
    className: "bg-surface-container-low text-tertiary",
  },
  hard: {
    label: "High Difficulty",
    icon: <CircleAlert className="h-[15px] w-[15px]" aria-hidden="true" />,
    className: "bg-secondary-fixed/50 text-secondary",
  },
};

export function QuestionRow({
  subjectSlug,
  chapterSlug,
  question,
}: {
  subjectSlug: string;
  chapterSlug: string;
  question: Question;
}) {
  const intent = INTENT[question.difficulty];

  return (
    <article className="rounded-lg bg-surface-container-lowest p-6 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-headline-sm text-on-primary shadow-sm">
            Q{question.order}
          </span>
          <span className="rounded-full bg-surface-container px-2.5 py-0.5 text-label-caps uppercase text-on-surface-variant">
            {question.source}
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-label-caps uppercase ${MARKS_PILL[question.group]}`}
          >
            {question.marks} Marks (Group {question.group})
          </span>
          {question.tags.slice(0, 1).map((tag) => (
            <span key={tag} className="rounded-full bg-surface-container-high px-2.5 py-0.5 text-label-caps uppercase text-on-surface">
              {tag}
            </span>
          ))}
        </div>
        <span className={`inline-flex items-center gap-1 self-start rounded-full px-2 py-0.5 text-label-md ${intent.className}`}>
          {intent.icon} {intent.label}
        </span>
      </div>

      <div className="py-1">
        <p className="text-[1.18em] font-semibold leading-snug text-on-surface">{question.questionText}</p>
      </div>

      {question.given && (
        <div className="my-2 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-[1rem] bg-surface-container-low p-2 text-[0.76em] text-on-surface-variant">
          {question.given.map((g, i) => {
            const emphasized = i === 0 || i === question.given!.length - 1;
            return (
              <span key={g} className={`font-mono ${emphasized ? "font-bold text-primary" : ""} ${i === question.given!.length - 1 ? "text-secondary" : ""}`}>
                {g}
              </span>
            );
          })}
        </div>
      )}

      <div className="flex flex-col justify-between gap-2 pt-1 sm:flex-row sm:items-center">
        <div className="inline-flex items-center gap-2 text-[0.76em] text-on-surface-variant">
          <BadgeCheck className="h-[18px] w-[18px] shrink-0 text-secondary" aria-hidden="true" />
          <span>{question.note}</span>
        </div>
        <Link
          href={`/subjects/${subjectSlug}/${chapterSlug}/questions/${question.id}`}
          className="group inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-primary-fixed px-4 py-2 text-title text-on-primary-fixed transition-all hover:bg-primary-container hover:text-on-primary"
        >
          View Solution
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}