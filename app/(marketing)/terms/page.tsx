import type { Metadata } from "next";
import { AlertTriangle, BookUser, CalendarCheck, Lock } from "lucide-react";
import { InfoPage, InfoSection } from "@/components/marketing/InfoPage";

export const metadata: Metadata = {
  title: "Terms of Use — SEE Sathi",
  description: "The terms that govern your use of SEE Sathi's free educational resources.",
};

export default function TermsPage() {
  return (
    <InfoPage
      eyebrow="Terms of Use"
      title="Free to study. Fair to share."
      subtitle="By using SEE Sathi you agree to these terms. They are short, readable, and designed to protect both students and educators. Last updated: 16 September 2026."
    >
      <InfoSection icon={BookUser} title="1. Personal educational use">
        <p>
          All content on SEE Sathi is provided free of charge for personal, non-commercial study and teaching use. You may print,
          share, and reference our materials freely within your classroom or study group.
        </p>
      </InfoSection>

      <InfoSection icon={Lock} title="2. What is not allowed">
        <ul className="list-inside space-y-1.5">
          <li>Reselling or repackaging SEE Sathi content behind a paywall.</li>
          <li>Passing off our notes or model answers as your own commercial product.</li>
          <li>Scraping the site at volumes that degrade service for other students.</li>
        </ul>
      </InfoSection>

      <InfoSection icon={AlertTriangle} title="3. Educational disclaimer">
        <p>
          We work hard to align with the official CDC curriculum and SEE marking scheme, but marking rubrics occasionally change.
          Students must always verify weightages and syllabi against the National Examination Board (NEB) and their school before
          exams. SEE Sathi content supplements — it never replaces — your teacher&apos;s guidance.
        </p>
      </InfoSection>

      <InfoSection icon={CalendarCheck} title="4. Changes to these terms">
        <p>
          We may update these terms as the platform grows. Material changes will be announced on the homepage, and continued use
          after an update means you accept the revised terms.
        </p>
      </InfoSection>
    </InfoPage>
  );
}