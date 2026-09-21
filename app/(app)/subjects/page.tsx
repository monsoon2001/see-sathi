import type { Metadata } from "next";
import { SubjectsDirectory } from "@/components/subjects/SubjectsDirectory";
import { getSubjects } from "@/lib/data/subjects";

export const metadata: Metadata = { title: "Subjects — SEE Sathi" };
export const revalidate = 3600;

export default async function SubjectsPage() {
  const subjects = await getSubjects();

  return (
    <div className="pb-24">
      <SubjectsDirectory subjects={subjects} />
    </div>
  );
}