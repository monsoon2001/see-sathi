import type { Metadata } from "next";
import { Database, FileSearch, ShieldCheck, UserCheck } from "lucide-react";
import { InfoPage, InfoSection } from "@/components/marketing/InfoPage";

export const metadata: Metadata = {
  title: "Privacy Policy — SEE Sathi",
  description:
    "How SEE Sathi handles your data: no paywalls, no selling of student data. Read our full privacy policy.",
};

export default function PrivacyPage() {
  return (
    <InfoPage
      eyebrow="Privacy Policy"
      title="Your study data belongs to you."
      subtitle="SEE Sathi is built for students on limited data budgets — so we collect as little as possible, keep it local, and never sell anything. Last updated: 16 September 2026."
    >
      <InfoSection icon={FileSearch} title="1. Information we collect">
        <p>
          When you use the free public study pages, we do not require an account. We process only standard server logs (page
          viewed, browser type, approximate region) used to keep the site fast and defend against abuse. These logs are retained for
          30 days and then deleted.
        </p>
      </InfoSection>

      <InfoSection icon={Database} title="2. Offline cache and device storage">
        <p>
          Notes you open may be cached in your browser&apos;s IndexedDB so they work during load-shedding and on low data. This
          cache lives entirely on your device — we cannot read it, and clearing your browser data removes it.
        </p>
      </InfoSection>

      <InfoSection icon={UserCheck} title="3. Account features">
        <p>
          Optional features (saved items, progress tracking) are tied to your device.
        </p>
      </InfoSection>

      <InfoSection icon={ShieldCheck} title="4. Your rights">
        <p>
          You may request a copy or deletion of any data we hold about you at any time by writing to{" "}
          <a href="mailto:privacy@see-sathi.edu.np" className="text-primary underline-offset-2 hover:underline">
            privacy@see-sathi.edu.np
          </a>
          . We respond within 30 days.
        </p>
      </InfoSection>
    </InfoPage>
  );
}