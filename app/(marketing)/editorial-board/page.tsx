import type { Metadata } from "next";
import { BookOpenCheck, Files, Languages, ShieldCheck } from "lucide-react";
import { InfoPage, InfoSection } from "@/components/marketing/InfoPage";

export const metadata: Metadata = {
  title: "Editorial Board — SEE Sathi",
  description:
    "Meet the editorial standards behind SEE Sathi: every note and model answer is verified against the CDC syllabus and the real SEE marking scheme.",
};

const roles = [
  {
    icon: ShieldCheck,
    area: "Curriculum Alignment",
    body: "Validates every definition, law, and diagram against the official CDC 2081/2082 Science, Math, English, and नेपाली syllabi. Nothing ships without a source.",
  },
  {
    icon: BookOpenCheck,
    area: "Marking Scheme Verification",
    body: "Reviews step-by-step solutions against how SEE examiners actually award part-marks — so a numerical stays 3 marks, not 1.",
  },
  {
    icon: Languages,
    area: "Bilingual & Terminology Review",
    body: "Ensures Nepali medium and English medium renderings carry identical technical meaning, with regional terminological consistency.",
  },
  {
    icon: Files,
    area: "Diagrams & Typography",
    body: "Checks ray diagrams, circuit layouts, cell models, and mathematical notation for exam-answer-sheet legibility.",
  },
];

export default function EditorialBoardPage() {
  return (
    <InfoPage
      eyebrow="Editorial Board"
      title="Reviewed by teachers. Marked like the real exam."
      subtitle="Every chapter summary and model answer passes through a four-tier editorial gate before it reaches a student's screen."
    >
      {roles.map((r) => (
        <InfoSection key={r.area} icon={r.icon} title={r.area}>
          <p>{r.body}</p>
        </InfoSection>
      ))}

      <InfoSection title="The review pipeline">
        <ol className="list-inside list-decimal space-y-1.5">
          <li>Subject teacher drafts content from the CDC textbook and past papers.</li>
          <li>Independent second reader cross-checks marks, units, and source references.</li>
          <li>Bilingual reviewer reconciles Nepali and English terminology.</li>
          <li>Community error reports are triaged weekly and corrections published with a changelog.</li>
        </ol>
      </InfoSection>
    </InfoPage>
  );
}