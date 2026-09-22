import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { QuestionBoard } from "@/components/questions/QuestionBoard";
import { FirestoreChapterQuestions } from "@/components/firestore/FirestoreChapterQuestions";
import { QuestionsLoading } from "@/components/firestore/readingSkeleton";
import { getChapters, getSubject } from "@/lib/data/subjects";
import { getQuestions } from "@/lib/data/questions";
import { getSubjectChapter } from "@/lib/firebase/chapterDoc";
import type { Chapter, Subject } from "@/lib/types";

export const revalidate = 3600;

export async function generateStaticParams() {
  const { mockChapters } = await import("@/lib/mock/mockChapters");
  return Object.entries(mockChapters).flatMap(([subjectSlug, chapters]) =>
    chapters.map((c) => ({ subjectSlug, chapterSlug: c.slug })),
  );
}

export async function generateMetadata({ params }: { params: { subjectSlug: string; chapterSlug: string } }): Promise<Metadata> {
  const subject = await getSubject(params.subjectSlug);
  const chapter = (await getChapters(params.subjectSlug)).find((c) => c.slug === params.chapterSlug);
  const title = chapter ? `${chapter.title} Solved Questions — ${subject?.name} | SEE Sathi` : "Questions not found — SEE Sathi";
  const description = `Solved questions, past papers, and solutions for Class 10 ${subject?.name}, ${chapter?.title}.`;
  
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description, card: "summary_large_image" },
  };
}

async function ChapterQuestionsLoader({ subject, chapter }: { subject: Subject; chapter: Chapter }) {
  const { en, ne } = await getSubjectChapter(subject.slug, chapter.number, chapter.slug);
  const live = en ?? ne;

  if (subject.slug === "social-studies") {
    if (!live || (live.questionSections?.length ?? 0) === 0) notFound();
    return (
      <FirestoreChapterQuestions
        en={en}
        ne={ne}
        subject={subject}
        chapter={chapter}
      />
    );
  }

  if (live && (live.questionSections?.length ?? 0) > 0) {
    return (
      <FirestoreChapterQuestions
        en={en}
        ne={ne}
        subject={subject}
        chapter={chapter}
      />
    );
  }
  const questions = await getQuestions(subject.slug, chapter.slug);
  return (
    <div className="pb-24">
      <QuestionBoard subject={subject} chapter={chapter} questions={questions} />
    </div>
  );
}

export default async function QuestionsListPage({ params }: { params: { subjectSlug: string; chapterSlug: string } }) {
  const { subjectSlug, chapterSlug } = params;
  const subject = await getSubject(subjectSlug);
  const chapter = (await getChapters(subjectSlug)).find((c) => c.slug === chapterSlug);

  if (!subject || !chapter) notFound();

  if (subjectSlug === "science" || subjectSlug === "nepali" || subjectSlug === "computer-science" || subjectSlug === "english" || subjectSlug === "social-studies" || subjectSlug === "mathematics") {
    return (
      <Suspense fallback={<QuestionsLoading title={chapter.title} />}>
        <ChapterQuestionsLoader subject={subject} chapter={chapter} />
      </Suspense>
    );
  }

  const questions = await getQuestions(subjectSlug, chapterSlug);

  return (
    <div className="pb-24">
      <QuestionBoard subject={subject} chapter={chapter} questions={questions} />
    </div>
  );
}