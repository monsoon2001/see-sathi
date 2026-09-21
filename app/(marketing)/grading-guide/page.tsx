import type { Metadata } from "next";
import { Gauge, GraduationCap, Target, Trophy } from "lucide-react";
import { InfoPage, InfoSection } from "@/components/marketing/InfoPage";

export const metadata: Metadata = {
  title: "SEE Grading Guide — SEE Sathi",
  description:
    "Understand the SEE grading system: letter grades, GPA bands, mark distribution, and the minimum passing requirement.",
};

const gradeBands = [
  { grade: "A+", range: "90 – 100", gpa: "4.0", remark: "Outstanding Excellence" },
  { grade: "A", range: "80 – 89", gpa: "3.6", remark: "Excellent" },
  { grade: "B+", range: "70 – 79", gpa: "3.2", remark: "Very Good" },
  { grade: "B", range: "60 – 69", gpa: "2.8", remark: "Good" },
  { grade: "C+", range: "50 – 59", gpa: "2.4", remark: "Satisfactory" },
  { grade: "C", range: "40 – 49", gpa: "2.0", remark: "Acceptable" },
  { grade: "D+", range: "30 – 39", gpa: "1.6", remark: "Partially Acceptable" },
  { grade: "D", range: "20 – 29", gpa: "1.2", remark: "Insufficient" },
  { grade: "NG", range: "0 – 19", gpa: "0.0", remark: "Not Graded" },
];

export default function GradingGuidePage() {
  return (
    <InfoPage
      eyebrow="SEE Grading Guide"
      title="How the SEE is actually graded."
      subtitle="The Secondary Education Examination uses a 4.0-point relative grading scale, combining theory papers with school-based internal assessment. This guide decodes the official bands."
    >
      <InfoSection icon={GraduationCap} title="Letter grade and GPA bands">
        <p>
          Every subject is converted from raw marks into a letter grade and GPA using the published bands below. Your final
          SEE transcript reports this letter grade, not the raw percentage.
        </p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-surface-container-high/60 bg-surface-container-lowest shadow-sm">
          <table className="w-full min-w-[520px] border-collapse text-left">
            <thead>
              <tr className="bg-surface-container-high">
                {["Grade", "Marks Range", "GPA", "Description"].map((h) => (
                  <th key={h} className="px-4 py-3 font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gradeBands.map((row) => (
                <tr key={row.grade} className="border-t border-surface-container/60">
                  <td className="px-4 py-3 font-title text-title text-on-surface">{row.grade}</td>
                  <td className="px-4 py-3 font-body-md text-body-md text-on-surface-variant">{row.range}</td>
                  <td className="px-4 py-3 font-title text-title text-primary">{row.gpa}</td>
                  <td className="px-4 py-3 font-body-md text-body-md text-on-surface-variant">{row.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </InfoSection>

      <InfoSection icon={Target} title="Minimum passing requirement">
        <p>
          A student is considered to have passed the SEE when they secure the required minimum marks (roughly “35 percent”
          overall) in each graded subject, counting theory and internal assessment together. Falling below the threshold in any
          subject returns a grade of NG for that subject and may require a supplementary examination.
        </p>
        <p>
          Because thresholds are occasionally revised by the National Examination Board (NEB), always confirm the current
          passing rule from your school or the NEB notice board before assuming your result.
        </p>
      </InfoSection>

      <InfoSection icon={Trophy} title="Mark distribution at a glance">
        <p>
          Most compulsory subjects are examined out of 100 total marks: a written theory paper plus an internal/practical
          component evaluated by the school. For example, Science carries 75 theory marks and 25 internal marks, split across
          Class Participation, Practical Activities, and Project/Terminal work — a breakdown covered in detail on the Science
          subject page.
        </p>
      </InfoSection>

      <InfoSection icon={Gauge} title="What this means for your strategy">
        <ul className="list-inside space-y-1.5">
          <li>Targeting A+ means scoring 90+ raw — the extra 10% beyond “excellent” is where presentation matters.</li>
          <li>Internal 25 marks are awarded before you enter the hall; attendance, lab books, and projects genuinely move your grade.</li>
          <li>A strong answer earns the marks it deserves; a neat, well-labelled answer earns them reliably.</li>
        </ul>
      </InfoSection>
    </InfoPage>
  );
}