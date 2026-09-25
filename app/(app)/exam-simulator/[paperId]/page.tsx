import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPastPaper } from "@/lib/pastPapers";
import { ExamSimulatorViewer } from "@/components/examsimulator/ExamSimulatorViewer";
import { PastPaperAccessGate } from "@/components/pastpapers/PastPaperAccessGate";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { paperId: string } }): Promise<Metadata> {
  const paper = getPastPaper(params.paperId);
  if (!paper) return { title: "Mock Test — SEE Sathi" };
  return { title: `Mock Test: ${paper.question.titleEn} — SEE Sathi` };
}

export default async function ExamSimulatorPaperPage({ params }: { params: { paperId: string } }) {
  const paper = getPastPaper(params.paperId);
  if (!paper) notFound();
  return (
    <div className="pb-24">
      <PastPaperAccessGate paperId={paper.folderId}>
        <ExamSimulatorViewer paper={paper} />
      </PastPaperAccessGate>
    </div>
  );
}