import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { NotesReaderShell } from "@/components/content/NotesReaderShell";
import { FirestoreChapterNotes } from "@/components/firestore/FirestoreChapterNotes";
import { NotesLoading } from "@/components/firestore/readingSkeleton";
import { getChapters, getSubject } from "@/lib/data/subjects";
import { getNotes } from "@/lib/data/notes";
import { getSubjectChapter } from "@/lib/firebase/chapterDoc";
import type { Chapter, Subject } from "@/lib/types";
import { JsonLd } from "@/components/seo/JsonLd";

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
  const title = chapter ? `${chapter.title} — Class 10 ${subject?.name} Notes | SEE Sathi` : "Notes not found — SEE Sathi";
  const description = chapter?.description || `Study notes for Class 10 ${subject?.name}, ${chapter?.title}.`;
  
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description, card: "summary_large_image" },
  };
}

async function ChapterNotesLoader({ subject, chapter }: { subject: Subject; chapter: Chapter }) {
  const { en, ne } = await getSubjectChapter(subject.slug, chapter.number, chapter.slug);

  if (subject.slug === "social-studies") {
    if (!en && !ne) notFound();
    return (
      <FirestoreChapterNotes
        en={en}
        ne={ne}
        subject={subject}
        chapter={chapter}
      />
    );
  }
  if (en || ne) {
    return (
      <FirestoreChapterNotes
        en={en}
        ne={ne}
        subject={subject}
        chapter={chapter}
        defaultLang={subject.slug === "nepali" ? "ne" : undefined}
      />
    );
  }
  if (!chapter.hasNotes) notFound();
  const blocks = await getNotes(subject.slug, chapter.slug);
  return (
    <div className="pb-24">
      <NotesReaderShell subject={subject} chapter={chapter} blocks={blocks} />
    </div>
  );
}

export default async function NotesPage({ params }: { params: { subjectSlug: string; chapterSlug: string } }) {
  const { subjectSlug, chapterSlug } = params;
  const subject = await getSubject(subjectSlug);
  const chapter = (await getChapters(subjectSlug)).find((c) => c.slug === chapterSlug);

  if (!subject || !chapter) notFound();

  if (subjectSlug === "science" || subjectSlug === "nepali" || subjectSlug === "computer-science" || subjectSlug === "english" || subjectSlug === "social-studies") {
    return (
      <Suspense fallback={<NotesLoading title={chapter.title} />}>
        <ChapterNotesLoader subject={subject} chapter={chapter} />
      </Suspense>
    );
  }

  if (!chapter.hasNotes) notFound();

  const blocks = await getNotes(subjectSlug, chapterSlug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${chapter.title} Notes`,
    description: `Study notes for Class 10 ${subject.name}, ${chapter.title}.`,
    author: {
      "@type": "Organization",
      name: "SEE Sathi",
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="pb-24">
        <NotesReaderShell subject={subject} chapter={chapter} blocks={blocks} />
      </div>
    </>
  );
}