import type { Metadata } from "next";
import { getAllPastPapers } from "@/lib/pastPapers";
import { PastPapersIndex, type SubjectOption } from "@/components/pastpapers/PastPapersIndex";
import { mockSubjects } from "@/lib/mock/mockSubjects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Past Papers — SEE Sathi" };

export default async function PastPapersPage() {
  const papers = getAllPastPapers();
  const subjectOptions: SubjectOption[] = mockSubjects
    .map((s) => ({ id: s.slug, name: s.name, color: s.accentColor }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="pb-24">
      <PastPapersIndex papers={papers} subjectOptions={subjectOptions} />
    </div>
  );
}