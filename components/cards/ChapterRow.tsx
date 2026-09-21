import Link from "next/link";
import { CheckCircle2, Circle, Clock, PencilLine, Timer, BookOpen, ListChecks } from "lucide-react";
import { withAlpha } from "@/lib/subjectColors";
import type { Chapter } from "@/lib/types";
import { chapterDisplayNumber } from "@/lib/chapterLabel";
import { cn } from "@/lib/utils";

const progressState = {
  mastered: { icon: CheckCircle2, label: "Mastered (100%)", color: "#2FB673" },
  "in-progress": { icon: Timer, label: "In Progress", color: "#4B4FF2" },
  "not-started": { icon: Circle, label: "Not Started", color: "#767587" },
};

export function ChapterRow({
  subjectSlug,
  chapter,
  color,
}: {
  subjectSlug: string;
  chapter: Chapter;
  color: string;
}) {
  const state = progressState[chapter.progress ?? "not-started"];
  const StateIcon = state.icon;

  return (
    <div className="group relative rounded-2xl bg-surface-container-lowest p-5 shadow-[0_2px_8px_rgba(24,26,43,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(75,79,242,0.08)] lg:p-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex min-w-0 items-start gap-4">
          <span
            className="w-10 select-none pt-0.5 font-display text-2xl font-extrabold transition-colors group-hover:text-[var(--num-color)] lg:w-12 lg:text-3xl"
            style={{
              color: "var(--outline-variant)",
              ["--num-color" as string]: color,
              ["--outline-variant" as string]: "#C6C4D8",
            }}
          >
            {chapterDisplayNumber(chapter)}
          </span>

          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className={cn(
                  "font-display text-[19px] font-semibold tracking-tight text-on-surface transition-colors group-hover:text-[var(--title-color)]",
                )}
                style={{ ["--title-color" as string]: color }}
              >
                {chapter.title}
              </h3>
              {chapter.weightage && (
                <span className="rounded-full bg-surface-container px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.06em] text-on-surface-variant">
                  {chapter.weightage}
                </span>
              )}
              {chapter.highYield && (
                <span
                  className="rounded-full px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.06em]"
                  style={{ backgroundColor: "#FFD3CA", color: "#B5250C" }}
                >
                  CDC High Yield
                </span>
              )}
            </div>

            <p className="line-clamp-1 font-body text-sm text-on-surface-variant">{chapter.description}</p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5 font-body text-[13px] text-on-surface-variant">
              <span className="inline-flex items-center gap-1" style={{ color: chapter.progress === "mastered" ? "#2FB673" : "inherit" }}>
                <StateIcon className="h-[15px] w-[15px]" style={{ color: state.color }} />
                <span className="font-medium">{chapter.progress === "in-progress" ? `In Progress (${chapter.progressPercent}%)` : state.label}</span>
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-[15px] w-[15px]" /> {chapter.readMinutes} min notes
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <ListChecks className="h-[15px] w-[15px]" /> {chapter.questionsCount} questions
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 self-end lg:self-center">
          {chapter.hasNotes && (
            <Link
              href={`/subjects/${subjectSlug}/${chapter.slug}/notes`}
              className="inline-flex items-center gap-2 rounded-full bg-surface-container-high px-4 py-2.5 font-display text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-highest"
            >
              <BookOpen className="h-[18px] w-[18px]" />
              Notes
            </Link>
          )}
          {chapter.hasQuestions && (
            <Link
              href={`/subjects/${subjectSlug}/${chapter.slug}/questions`}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-display text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: color, boxShadow: withAlpha(color, 0.25) ? `0 4px 12px ${withAlpha(color, 0.28)}` : undefined }}
            >
              <PencilLine className="h-[18px] w-[18px]" />
              {chapter.questionsCount} Solved Qs →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}