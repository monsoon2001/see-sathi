import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuestionDetail } from "@/components/questions/QuestionDetail";
import { getChapters, getSubject } from "@/lib/data/subjects";
import { getQuestion, getQuestions } from "@/lib/data/questions";
import { JsonLd } from "@/components/seo/JsonLd";

export const revalidate = 3600;

export async function generateStaticParams() {
  const { mockQuestions } = await import("@/lib/mock/mockQuestions");
  return Object.entries(mockQuestions).flatMap(([key, questions]) => {
    const [subjectSlug, chapterSlug] = key.split("/");
    return questions.map((q) => ({ subjectSlug, chapterSlug, questionId: q.id }));
  });
}

export async function generateMetadata({ params }: { params: { subjectSlug: string; chapterSlug: string; questionId: string } }): Promise<Metadata> {
  const { subjectSlug, chapterSlug, questionId } = params;
  const question = await getQuestion(subjectSlug, chapterSlug, questionId);
  const chapter = (await getChapters(subjectSlug)).find((c) => c.slug === chapterSlug);
  const title = question
    ? `Q${question.order} — ${chapter?.title ?? chapterSlug} · Solved Question | SEE Sathi`
    : "Question not found — SEE Sathi";
  const description = question?.questionText ? `${question.questionText.slice(0, 140)}…` : "Solved question for Class 10.";
  
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description, card: "summary_large_image" },
  };
}

export default async function QuestionDetailPage({
  params,
}: {
  params: { subjectSlug: string; chapterSlug: string; questionId: string };
}) {
  const { subjectSlug, chapterSlug, questionId } = params;
  const subject = await getSubject(subjectSlug);
  const chapter = (await getChapters(subjectSlug)).find((c) => c.slug === chapterSlug);
  const question = await getQuestion(subjectSlug, chapterSlug, questionId);
  if (!subject || !chapter || !question) notFound();

  const all = await getQuestions(subjectSlug, chapterSlug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: question.questionText || `Question ${question.order}`,
      text: question.questionText,
      answerCount: 1,
      acceptedAnswer: {
        "@type": "Answer",
        text: question.answer || "Detailed solution is provided in the steps.",
      },
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="pb-24">
        <QuestionDetail subject={subject} chapter={chapter} question={question} all={all} />
      </div>
    </>
  );
}