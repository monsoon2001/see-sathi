import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  LayoutGrid,
  PlayCircle,
  Timer,
} from "lucide-react";
import { ChapterRoadmap } from "@/components/chapters/ChapterRoadmap";
import { SubjectReadinessCard } from "@/components/subjects/SubjectReadinessCard";
import { SubjectIcon } from "@/components/brand/SubjectIcon";
import { ComputerScienceExamGuide } from "@/components/subjects/ComputerScienceExamGuide";
import { ScienceExamGuide } from "@/components/subjects/ScienceExamGuide";
import { getChapters, getSubject } from "@/lib/data/subjects";
import { cn } from "@/lib/utils";

export async function generateStaticParams() {
  const { mockSubjects } = await import("@/lib/mock/mockSubjects");
  return mockSubjects.map((s) => ({ subjectSlug: s.slug }));
}

export async function generateMetadata({ params }: { params: { subjectSlug: string } }): Promise<Metadata> {
  const subject = await getSubject(params.subjectSlug);
  if (!subject) return { title: "Subject not found — SEE Sathi" };
  const title = `${subject.name} — SEE Sathi`;
  const description = `Prepare for Class 10 SEE ${subject.name} with our complete study guide, chapters, and solved questions.`;
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description, card: "summary_large_image" },
  };
}

export const revalidate = 3600;

const typeLabel: Record<string, string> = {
  Compulsory: "Compulsory Subject",
  "Optional I (Elective)": "Elective I · Advanced",
  "Optional II (Elective)": "Elective II · Technical",
};

const weightageTiles = [
  { letter: "A", label: "Very Short", marks: "10 Marks", detail: "(10 × 1)", hot: false },
  { letter: "B", label: "Short Questions", marks: "34 Marks", detail: "(17 × 2)", hot: false },
  { letter: "C", label: "Long Questions", marks: "40 Marks", detail: "(10 × 4)", hot: false },
  { letter: "D", label: "Higher Ability (HOT)", marks: "16 Marks", detail: "(4 × 4)", hot: true },
];

const scienceWeightageTiles = [
  { letter: "A", label: "Very Short Answer", marks: "9 Marks", detail: "(9 × 1)", hot: false },
  { letter: "B", label: "Short Answer", marks: "28 Marks", detail: "(14 × 2)", hot: false },
  { letter: "C", label: "Long Answer", marks: "24 Marks", detail: "(8 × 3)", hot: false },
  { letter: "D", label: "Higher Ability", marks: "12 Marks", detail: "(3 × 4)", hot: true },
];

const csWeightageTiles = [
  { letter: "A", label: "Multiple Choice", marks: "10 Marks", detail: "(10 × 1)", hot: false },
  { letter: "B", label: "Short Questions", marks: "20 Marks", detail: "(10 × 2)", hot: false },
  { letter: "C", label: "Long Questions", marks: "20 Marks", detail: "(5 × 4)", hot: true },
];

export default async function SubjectDetailPage({ params }: { params: { subjectSlug: string } }) {
  const subject = await getSubject(params.subjectSlug);
  if (!subject) notFound();

  const chapters = await getChapters(subject.slug);
  const isNepali = subject.slug === "nepali";

  return (
    <div className="pb-24">
      <section className="relative w-full overflow-hidden bg-surface-container-lowest pb-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary-container/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 top-48 h-80 w-80 rounded-full bg-secondary-container/10 blur-3xl" />

        <div className="mx-auto w-full max-w-7xl px-4 pt-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-6 border-b border-surface-container/60 pb-2">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-label-md font-label-md text-on-surface-variant">
              <Link href="/subjects" className="flex items-center gap-1 transition-colors hover:text-primary">
                <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                Subjects
              </Link>
              <span className="font-title text-outline-variant">/</span>
              <div className="inline-flex items-center gap-1 rounded-full bg-surface-container-high px-2 py-0.5 font-title text-body-sm text-primary">
                <SubjectIcon icon={subject.icon} className="h-[15px] w-[15px] text-primary" />
                {subject.name} ({subject.type === "Compulsory" ? "Compulsory" : "Elective"})
              </div>
              <span className="font-title text-outline-variant">/</span>
              <span className="font-title text-on-surface">CDC Curriculum 2081/2082</span>
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <div className="inline-flex items-center gap-1 rounded-full bg-surface-container px-4 py-1.5 text-label-caps text-on-surface-variant">
                <span className="h-2 w-2 rounded-full bg-tertiary" />
                CDC Verified Syllabus
              </div>
            </div>
          </div>

          <div className="mb-10 grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="flex flex-col items-start lg:col-span-8">
              <div className="mb-1 rounded-md bg-primary-container/10 px-2 py-0.5 text-label-caps uppercase tracking-wider text-primary">
                {typeLabel[subject.type]} · CODE: {subject.code}
              </div>
              <h1 className={cn("text-hero-mobile font-extrabold tracking-tight text-on-surface sm:text-display-hero", isNepali && "font-devanagari")}>
                {subject.name}
              </h1>
              <div className="mt-2 mb-2 h-1.5 w-24 rounded-full bg-primary-container shadow-[0_2px_8px_rgba(75,79,242,0.35)]" />
              <p className="max-w-2xl pt-1 font-body-lg text-body-lg text-on-surface-variant">
                {subject.chapterCount} chapters · CDC Syllabus 2081/2082 · {subject.questionCount} Solved Model Questions · {subject.slug === "computer-science" ? "50" : "100"} Marks Preparation Guide
              </p>
            </div>

            <div className="lg:col-span-4">
            <SubjectReadinessCard chapters={chapters} />
          </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 sm:grid-cols-4">
            {(subject.slug === "science" ? scienceWeightageTiles : subject.slug === "computer-science" ? csWeightageTiles : weightageTiles).map((tile) => (
              <div
                key={tile.letter}
                className="flex items-center gap-2 rounded-xl bg-surface-container p-2 transition-all hover:bg-surface-container-high"
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-container-lowest font-headline-sm text-headline-sm shadow-sm",
                    tile.hot ? "text-secondary-container" : "text-primary",
                  )}
                >
                  {tile.letter}
                </div>
                <div className="min-w-0">
                  <div className="text-label-caps uppercase text-on-surface-variant">{tile.label}</div>
                  <div className="font-title text-title text-on-surface">
                    {tile.marks} <span className="font-body-sm text-body-sm text-on-surface-variant">{tile.detail}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ChapterRoadmap subjectSlug={subject.slug} chapters={chapters} />

      {subject.slug === "science" && <ScienceExamGuide />}
      {subject.slug === "computer-science" && <ComputerScienceExamGuide />}

      <section className="mx-auto w-full max-w-7xl px-4 pb-10 lg:px-8">
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-primary p-6 text-on-primary shadow-[0_8px_30px_rgba(47,48,218,0.25)] transition-all duration-300 sm:flex-row sm:items-center">
            <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="z-10 flex-1 space-y-2">
              <div className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-label-caps text-on-primary backdrop-blur-sm">
                <Timer className="h-4 w-4" aria-hidden="true" />
                {subject.slug === "computer-science" ? "2 Hours" : "3 Hours"} Real Simulation
              </div>
              <h4 className="text-headline-sm tracking-tight text-on-primary">
                Practice Full {subject.slug === "computer-science" ? "2-Hour" : "3-Hour"} {isNepali ? "गणित" : subject.name.split(" ")[0]} Model Paper 2081
              </h4>
              <p className="max-w-2xl font-body-md text-body-md text-primary-fixed">
                {subject.slug === "science"
                  ? "Complete full mock test set following the official 75-mark theory grid: VSA (9m), SA (28m), LA (24m), HA (12m) with real-time timer & step-by-step marking rubric."
                  : subject.slug === "computer-science"
                    ? "Complete full mock test set following the official 50-mark grid: MCQ (10m: 10 × 1), Short (20m: 10 × 2), Long (20m: 5 × 4) with real-time timer & step-by-step marking rubric."
                    : "Complete full mock test set following the official 100-mark grid: Group A (10m), Group B (34m), Group C (40m), Group D (16m) with real-time timer & step-by-step marking rubric."}
              </p>
            </div>
            <div className="z-10 flex shrink-0 flex-wrap items-center gap-4 pt-4 sm:pl-2 sm:pt-0">
              <a
                href="/subjects"
                className="inline-flex items-center gap-1 rounded-full bg-surface-container-lowest px-6 py-2 font-title text-title text-primary shadow-lg transition-all hover:scale-[1.02] hover:bg-surface-container-low"
              >
                <PlayCircle className="h-5 w-5" aria-hidden="true" />
                Start Simulated Exam
              </a>
              <span className="font-body-sm text-body-sm text-primary-fixed-dim">Free Access</span>
            </div>
          </div>
      </section>
    </div>
  );
}