import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMathChapter } from "@/lib/mathChapter";
import { MathChapterViewer } from "@/components/math/MathChapterViewer";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { chapterId: string } }): Promise<Metadata> {
  const chapter = getMathChapter(params.chapterId);
  if (!chapter) return { title: "Chapter — SEE Sathi" };
  return { title: `${chapter.notes.title.en} — SEE Sathi` };
}

export default async function MathChapterPage({ params }: { params: { chapterId: string } }) {
  const chapter = getMathChapter(params.chapterId);
  if (!chapter) notFound();
  return (
    <div className="pb-24">
      <MathChapterViewer chapter={chapter} />
    </div>
  );
}