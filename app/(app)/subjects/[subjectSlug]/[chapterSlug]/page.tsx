import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  CircleCheck,
  Clock,
  FileQuestion,
  PenTool,
  PieChart,
  ScrollText,
  ShieldCheck,
  Sigma,
  Star,
} from "lucide-react";
import { CopyFormulasButton } from "@/components/content/CopyFormulasButton";
import { MathChapterViewer } from "@/components/math/MathChapterViewer";
import { getChapters, getSubject } from "@/lib/data/subjects";
import { getMathChapter } from "@/lib/mathChapter";
import { chapterDisplayNumber } from "@/lib/chapterLabel";
import { cn } from "@/lib/utils";

export async function generateStaticParams() {
  const { mockSubjects } = await import("@/lib/mock/mockSubjects");
  const { mockChapters } = await import("@/lib/mock/mockChapters");
  return Object.entries(mockChapters).flatMap(([subjectSlug, chapters]) =>
    chapters.map((c) => ({ subjectSlug, chapterSlug: c.slug })),
  );
}

export async function generateMetadata({ params }: { params: { subjectSlug: string; chapterSlug: string } }): Promise<Metadata> {
  const subject = await getSubject(params.subjectSlug);
  const chapter = (await getChapters(params.subjectSlug)).find((c) => c.slug === params.chapterSlug);
  const title = chapter ? `${chapter.title} — ${subject?.name ?? "SEE Sathi"}` : "Chapter not found — SEE Sathi";
  const description = chapter?.description || `Study guide for Class 10 ${subject?.name}, ${chapter?.title}.`;
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description, card: "summary_large_image" },
  };
}

export const revalidate = 3600;

function splitTitle(title: string): [string, string | null] {
  const idx = title.indexOf("(");
  if (idx > -1) {
    return [title.slice(0, idx).trim(), `(${title.slice(idx + 1).replace(")", "")})`];
  }
  return [title, null];
}

function marksFromWeightage(weightage?: string): string {
  const m = weightage?.match(/Weightage: ([\d.-]+(?: – [\d.-]+)?)\s*Marks?/i);
  return m ? `${m[1]} Marks` : "";
}

export default async function ChapterPage({ params }: { params: { subjectSlug: string; chapterSlug: string } }) {
  const { subjectSlug, chapterSlug } = params;
  const subject = await getSubject(subjectSlug);
  const chapters = await getChapters(subjectSlug);
  const chapter = chapters.find((c) => c.slug === chapterSlug);
  if (!subject || !chapter) notFound();

  const mathChapter = getMathChapter(chapterSlug);
  const subjectKey = subject.name.toLowerCase().split(" ")[0];
  if (mathChapter && mathChapter.notes.subject?.toLowerCase().includes(subjectKey)) {
    return (
      <div className="pb-24">
        <MathChapterViewer chapter={mathChapter} />
      </div>
    );
  }

  const [title, subtitle] = splitTitle(chapter.title);
  const isSets = subjectSlug === "mathematics" && chapterSlug === "sets";
  const nextChapter = chapters.find((c) => c.number === chapter.number + 1);
  const marks = marksFromWeightage(chapter.weightage);
  const qCount = chapter.questionsCount ?? 0;

  return (
    <div className="pb-24">
      <div className="relative mx-auto w-full max-w-7xl overflow-hidden px-4 pb-10 pt-4 lg:px-8">
        <div className="pointer-events-none absolute right-1/4 top-10 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute left-10 top-48 -z-10 h-72 w-72 rounded-full bg-secondary/5 blur-3xl" />

        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-on-surface-variant">
            <Link
              href={`/subjects/${subject.slug}`}
              className="flex items-center gap-1 rounded-full bg-surface-container-lowest px-4 py-1.5 font-title text-body-sm text-on-surface shadow-sm transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {subject.name.split(" ")[0]} Chapters
            </Link>
            <Link href="/subjects" className="font-body-sm text-body-sm text-on-surface-variant transition-colors hover:text-primary">
              Subjects
            </Link>
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-2 py-0.5 font-title text-body-sm text-primary-container">
              <PieChart className="h-[14px] w-[14px]" aria-hidden="true" />
              {title}
            </span>
          </nav>
          <div className="flex items-center gap-2 rounded-full bg-surface-container-lowest px-4 py-1.5 shadow-[0_2px_8px_rgba(24,26,43,0.04)]">
            <div className="h-2 w-2 animate-pulse rounded-full bg-tertiary" />
            <span className="text-label-caps uppercase tracking-wider text-on-surface-variant">CDC Syllabus 2081 Refreshed</span>
          </div>
        </div>

        <div className="mb-10 max-w-4xl">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-4 py-1 text-primary">
            <BookOpen className="h-[14px] w-[14px]" aria-hidden="true" />
            <span className="font-bold text-label-caps uppercase tracking-wider">
              Chapter {chapterDisplayNumber(chapter)} · {subject.name} · CDC Weightage: {marks || chapter.weightage}
            </span>
          </div>
          <h1 className="mb-2 text-headline-lg font-extrabold tracking-tight text-on-surface lg:text-display-hero">
            {title}{" "}
            {subtitle && (
              <span className="font-normal font-title text-on-surface-variant text-headline-md lg:text-headline-lg">
                {subtitle}
              </span>
            )}
          </h1>
          <p className="mb-6 max-w-3xl font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
            {chapter.description} Step-by-step proofs, CDC model question patterns, and high-yield revision tips guaranteed for the SEE board examination.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-surface-container-low px-4 py-2">
              <ShieldCheck className="h-[18px] w-[18px] text-primary" aria-hidden="true" />
              <span className="font-title text-body-sm text-on-surface">
                SEE Weightage: <strong>{marks}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-surface-container-low px-4 py-2">
              <Clock className="h-[18px] w-[18px] text-secondary-container" aria-hidden="true" />
              <span className="font-title text-body-sm text-on-surface">
                Estimated Read: <strong>{chapter.readMinutes} mins</strong>
              </span>
            </div>
            {qCount > 0 && (
              <div className="flex items-center gap-1 rounded-full bg-surface-container-low px-4 py-2">
                <CircleCheck className="h-[18px] w-[18px] text-tertiary" aria-hidden="true" />
                <span className="font-title text-body-sm text-on-surface">
                  Solved Bank: <strong>{qCount} Qs</strong>
                </span>
              </div>
            )}
            <div className="flex items-center gap-1 rounded-full bg-surface-container-low px-4 py-2">
              <ScrollText className="h-[18px] w-[18px] text-outline" aria-hidden="true" />
              <span className="font-title text-body-sm text-on-surface">
                Board Appearances: <strong>2074–2081</strong>
              </span>
            </div>
          </div>
        </div>

        <div className={cn("mb-10 grid grid-cols-1 gap-6 lg:gap-10", qCount > 0 && "lg:grid-cols-2")}>
          <Link
            href={`/subjects/${subjectSlug}/${chapterSlug}/notes`}
            className="group relative flex flex-col justify-between rounded-xl bg-surface-container-lowest p-6 shadow-[0_2px_4px_rgba(14,16,32,0.03),0_12px_32px_rgba(14,16,32,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_14px_rgba(75,79,242,0.18),0_20px_40px_rgba(75,79,242,0.12)] lg:p-10"
          >
            <div>
              <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-surface-container text-primary-container shadow-inner">
                  <BookOpen className="h-[30px] w-[30px]" fill="currentColor" strokeWidth={1} aria-hidden="true" />
                </div>
                <span className="rounded-full bg-primary/10 px-4 py-1 text-label-caps uppercase tracking-wide text-primary">
                  Comprehensive Notes &amp; Formula Guide
                </span>
              </div>
              <h2 className="mb-1 text-headline-md text-on-surface transition-colors group-hover:text-primary-container">
                Read Chapter Notes
              </h2>
              <p className="mb-6 font-body-md text-body-md leading-relaxed text-on-surface-variant">
                Structured conceptual breakdowns, standard definitions, formulas, and worked examples covering every topic in this chapter.
              </p>
              <div className="mb-6 space-y-2 rounded-[1rem] bg-surface-container-low/60 p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <span className="font-body-sm text-body-sm text-on-surface">
                    Full chapter coverage — every concept, definition, and key formula explained step by step
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <span className="font-body-sm text-body-sm text-on-surface">
                    Solved examples and derivations presented exactly the way the board expects
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <span className="font-body-sm text-body-sm text-on-surface">
                    Common pitfalls and mark-loss traps flagged so you can present clean, full-mark answers
                  </span>
                </div>
              </div>
            </div>
            <span className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-container px-6 py-2 font-title text-title text-on-primary shadow-[0_4px_14px_rgba(75,79,242,0.28),0_1px_2px_rgba(75,79,242,0.16)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(75,79,242,0.42)]">
              Read Notes
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </span>
          </Link>

          {qCount > 0 && (
            <Link
              href={`/subjects/${subjectSlug}/${chapterSlug}/questions`}
              className="group relative flex flex-col justify-between rounded-xl bg-surface-container-lowest p-6 shadow-[0_2px_4px_rgba(14,16,32,0.03),0_12px_32px_rgba(14,16,32,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_14px_rgba(253,88,58,0.20),0_20px_40px_rgba(253,88,58,0.12)] lg:p-10"
            >
            <div>
              <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-secondary-fixed text-secondary shadow-inner">
                  <FileQuestion className="h-[30px] w-[30px]" fill="currentColor" strokeWidth={1} aria-hidden="true" />
                </div>
                <span className="rounded-full bg-secondary-fixed/70 px-4 py-1 text-label-caps uppercase tracking-wide text-on-secondary-fixed">
                  Solved Question Bank
                </span>
              </div>
              <h2 className="mb-1 text-headline-md text-on-surface transition-colors group-hover:text-secondary">
                Study Solved Questions
              </h2>
              <p className="mb-6 font-body-md text-body-md leading-relaxed text-on-surface-variant">
                {qCount} verified step-by-step solutions with mark distribution breakdowns. Learn how to present your working to lock down the full marks.
              </p>
              <div className="mb-6 space-y-2 rounded-[1rem] bg-surface-container-low/60 p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-secondary" aria-hidden="true" />
                  <span className="font-body-sm text-body-sm text-on-surface">
                    <strong>Every question in this chapter</strong> solved with clear reasoning and diagrams
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-secondary" aria-hidden="true" />
                  <span className="font-body-sm text-body-sm text-on-surface">
                    <strong>Patterns drawn from</strong> SEE board papers and official model sets
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-secondary" aria-hidden="true" />
                  <span className="font-body-sm text-body-sm text-on-surface">
                    <strong>Alternative methods</strong> plus full-mark presentation tips
                  </span>
                </div>
              </div>
            </div>
            <span className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-secondary-container px-6 py-2 font-title text-title text-on-secondary shadow-[0_4px_14px_rgba(253,88,58,0.30),0_1px_2px_rgba(253,88,58,0.16)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(253,88,58,0.45)]">
              Study Questions ({qCount})
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </span>
          </Link>
          )}

        </div>

        {isSets && (
          <>
            <div className="mb-10 rounded-xl bg-surface-container-lowest p-6 shadow-[0_2px_4px_rgba(14,16,32,0.03),0_12px_32px_rgba(14,16,32,0.04)] lg:p-10">
              <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <div className="mb-1 flex items-center gap-1">
                    <Sigma className="h-5 w-5 text-primary" aria-hidden="true" />
                    <span className="font-bold text-label-caps uppercase tracking-wider text-primary">Fast Formula Cheat Sheet</span>
                  </div>
                  <h3 className="text-headline-md text-on-surface">Cardinality Laws for Examination Day</h3>
                </div>
                <CopyFormulasButton />
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="flex flex-col justify-between rounded-[1rem] bg-surface-container-low p-6 transition-all hover:bg-surface-container">
                  <div>
                    <span className="text-label-caps font-semibold uppercase text-on-surface-variant">Two Sets Cardinality</span>
                    <div className="my-4 overflow-x-auto py-1 font-mono text-headline-sm font-bold tracking-tight text-primary-container">
                      n(A ∪ B) = n(A) + n(B) − n(A ∩ B)
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Fundamental union rule. When disjoint (<code className="font-mono text-[12px]">A ∩ B = ∅</code>), the intersection term cancels to zero.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between pt-1 text-label-md text-on-surface-variant">
                    <span>Frequently tested in Q11(a)</span>
                    <CheckCircle2 className="h-[18px] w-[18px] text-tertiary" aria-hidden="true" />
                  </div>
                </div>

                <div className="flex flex-col justify-between rounded-[1rem] bg-surface-container-low p-6 transition-all hover:bg-surface-container">
                  <div>
                    <span className="text-label-caps font-semibold uppercase text-on-surface-variant">Three Sets (Core SEE Group C)</span>
                    <div className="my-4 overflow-x-auto py-1 font-mono text-title font-bold leading-snug tracking-tight text-primary-container">
                      n(A ∪ B ∪ C) = n(A) + n(B) + n(C) − n(A ∩ B) − n(B ∩ C) − n(C ∩ A) + n(A ∩ B ∩ C)
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Notice the <strong className="text-on-surface">+ n(A ∩ B ∩ C)</strong> term at the end! 68% of student marks lost are due to a misplaced negative sign here.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between pt-1 text-label-md text-on-surface-variant">
                    <span>Core Group C Theorem</span>
                    <Star className="h-[18px] w-[18px] text-secondary" aria-hidden="true" />
                  </div>
                </div>

                <div className="flex flex-col justify-between rounded-[1rem] bg-surface-container-low p-6 transition-all hover:bg-surface-container">
                  <div>
                    <span className="text-label-caps font-semibold uppercase text-on-surface-variant">&ldquo;Only&rdquo; Cardinality Shorthand</span>
                    <div className="my-4 overflow-x-auto py-1 font-mono text-headline-sm font-bold tracking-tight text-primary-container">
                      n(A) = n(A) − n(A ∩ B)
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      In 3-set systems: <code className="rounded bg-surface px-1 font-mono text-[11px]">n(A) = n(A) − n(A ∩ B) − n(A ∩ C) + n(A ∩ B ∩ C)</code>. Represents isolated regions.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between pt-1 text-label-md text-on-surface-variant">
                    <span>Crucial for survey problems</span>
                    <CheckCircle2 className="h-[18px] w-[18px] text-tertiary" aria-hidden="true" />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col items-center gap-6 rounded-[1rem] bg-surface-container p-4 md:flex-row">
                <div className="flex w-full shrink-0 items-center justify-center p-1 md:w-64">
                  <svg aria-label="3-Set Venn Diagram Schema" className="h-auto w-full max-w-[220px] drop-shadow-sm" viewBox="0 0 240 180">
                    <rect className="fill-surface-container-lowest" height="180" rx="16" width="240" />
                    <text className="fill-on-surface-variant font-sans text-[11px] font-bold" x="18" y="24">
                      U (Universal)
                    </text>
                    <circle className="cursor-pointer fill-primary/20 transition-all hover:fill-primary/30" cx="95" cy="80" r="50" />
                    <text className="fill-primary font-bold text-[12px]" x="65" y="65">
                      A
                    </text>
                    <circle className="cursor-pointer fill-secondary/20 transition-all hover:fill-secondary/30" cx="145" cy="80" r="50" />
                    <text className="fill-secondary font-bold text-[12px]" x="170" y="65">
                      B
                    </text>
                    <circle className="cursor-pointer fill-tertiary/20 transition-all hover:fill-tertiary/30" cx="120" cy="115" r="50" />
                    <text className="fill-tertiary font-bold text-[12px]" textAnchor="middle" x="120" y="152">
                      C
                    </text>
                    <circle className="fill-primary-container" cx="120" cy="92" r="10" />
                    <text className="fill-on-primary text-[8px] font-bold" textAnchor="middle" x="120" y="95">
                      A∩B∩C
                    </text>
                  </svg>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="inline-flex items-center gap-1 text-label-caps text-tertiary">
                    <PenTool className="h-4 w-4" aria-hidden="true" />
                    CDC EXAM PRESENTATION PROTOCOL
                  </div>
                  <h4 className="font-title text-title text-on-surface">Always Label Universal Set &ldquo;U&rdquo; Enclosure</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    In SEE grading specifications, <strong>1.0 mark out of 4.0</strong> is exclusively assigned to the neatness, outer rectangle boundary <code className="font-mono text-primary-container">U</code>, and legible numeric allocations within the intersection regions.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-10 rounded-lg bg-surface-container-low p-6 lg:p-10">
              <div className="mb-4 flex items-center gap-1">
                <BarChart3 className="h-[22px] w-[22px] text-secondary" aria-hidden="true" />
                <h3 className="text-headline-sm text-on-surface">SEE Examination Blueprint &amp; Marking Rubric</h3>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-[1rem] bg-surface-container-lowest p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-bold text-label-caps uppercase text-primary">Location</span>
                    <span className="rounded bg-surface-container px-1 py-0.5 text-label-caps text-on-surface">Compulsory</span>
                  </div>
                  <div className="mb-1 font-title text-title text-on-surface">Question No. 11 (Group C)</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Sets is consistently positioned as the very first 4-mark analytical question in Group C.
                  </p>
                </div>
                <div className="rounded-[1rem] bg-surface-container-lowest p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-bold text-label-caps uppercase text-secondary">Standard Prompt Style</span>
                    <span className="rounded bg-secondary-fixed px-1 py-0.5 text-label-caps text-on-secondary-fixed">Survey Problem</span>
                  </div>
                  <div className="mb-1 font-title text-title text-on-surface">3-Set Real World Survey</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    e.g., &ldquo;In a survey of 100 students regarding tea, coffee, and juice preferences...&rdquo;
                  </p>
                </div>
                <div className="rounded-[1rem] bg-surface-container-lowest p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-bold text-label-caps uppercase text-tertiary">4.0 Mark Breakdown</span>
                    <span className="rounded bg-tertiary-container px-1 py-0.5 text-label-caps text-on-tertiary">Official Rubric</span>
                  </div>
                  <ul className="space-y-1 font-body-sm text-body-sm text-on-surface-variant">
                    <li>• Venn diagram representation: <strong>1.0 Mark</strong></li>
                    <li>• Value substitution &amp; equation: <strong>1.5 Marks</strong></li>
                    <li>• Final answer statement &amp; unit: <strong>1.5 Marks</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex flex-col items-center justify-between gap-4 border-t border-surface-container pt-4 sm:flex-row">
          <Link
            href={`/subjects/${subject.slug}`}
            className="inline-flex w-full items-center justify-center gap-1 rounded-full bg-surface-container px-6 py-2 font-title text-title text-on-surface transition-colors hover:bg-surface-container-high sm:w-auto"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            Back to {subject.name.split(" ")[0]} Chapters
          </Link>
          {nextChapter && (
            <Link
              href={`/subjects/${subject.slug}/${nextChapter.slug}`}
              className="inline-flex w-full items-center justify-center gap-1 rounded-full bg-primary-container px-6 py-2 font-title text-title text-on-primary shadow-[0_4px_14px_rgba(75,79,242,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(75,79,242,0.38)] sm:w-auto"
            >
              Next Chapter: {String(nextChapter.number).padStart(2, "0")}. {splitTitle(nextChapter.title)[0]}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}