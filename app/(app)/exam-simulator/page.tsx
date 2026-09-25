import type { Metadata } from "next";
import { getAllPastPapers } from "@/lib/pastPapers";
import { PastPapersIndex, type SubjectOption } from "@/components/pastpapers/PastPapersIndex";
import { mockSubjects } from "@/lib/mock/mockSubjects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Mock Test Simulator — SEE Sathi" };

export default async function ExamSimulatorPage() {
  const papers = getAllPastPapers();
  const subjectOptions: SubjectOption[] = mockSubjects
    .map((s) => ({ id: s.slug, name: s.name, color: s.accentColor }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="pb-24">
      <PastPapersIndex
        papers={papers}
        subjectOptions={subjectOptions}
        eyebrow="Timed mock tests for real exam practice"
        heading="Mock Test Simulator"
        description="Pick any past paper — or a model paper — and sit it as a timed mock test. The clock starts counting down, the answer key locks away until you finish, and you can cancel any time."
        ctaLabel="Start Mock Test"
        hrefPrefix="/exam-simulator"
        showTypeFilter
      />
    </div>
  );
}