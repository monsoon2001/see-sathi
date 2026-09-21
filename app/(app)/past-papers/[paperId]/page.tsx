import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPastPaper } from "@/lib/pastPapers";
import { PastPaperViewer } from "@/components/pastpapers/PastPaperViewer";
import { PastPaperAccessGate } from "@/components/pastpapers/PastPaperAccessGate";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { paperId: string } }): Promise<Metadata> {
  const paper = getPastPaper(params.paperId);
  if (!paper) return { title: "Past Paper — SEE Sathi" };
  return { title: `${paper.question.titleEn} — SEE Sathi` };
}

export default async function PastPaperDetailPage({ params }: { params: { paperId: string } }) {
  const paper = getPastPaper(params.paperId);
  if (!paper) notFound();
  return (
    <div className="pb-24">
      <PastPaperAccessGate paperId={paper.folderId}>
        <PastPaperViewer paper={paper} />
      </PastPaperAccessGate>
    </div>
  );
}