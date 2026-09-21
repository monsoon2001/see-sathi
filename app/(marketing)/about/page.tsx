import type { Metadata } from "next";
import { BadgeCheck, Globe, HeartHandshake, Zap } from "lucide-react";
import { InfoPage, InfoSection } from "@/components/marketing/InfoPage";

export const metadata: Metadata = {
  title: "About Our Mission — SEE Sathi",
  description:
    "SEE Sathi is a free, open-access study platform built to help every Class 10 student in Nepal prepare for the SEE with beautifully structured notes and solved questions.",
};

export default function AboutPage() {
  return (
    <InfoPage
      eyebrow="About Mission"
      title="Free, beautiful study materials for every Class 10 student in Nepal."
      subtitle="SEE Sathi exists because every student deserves the same high-quality preparation — whether they study in a Kathmandu coaching centre or a village school in Solukhumbu."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: BadgeCheck, stat: "80+", label: "Chapter Summaries" },
          { icon: Globe, stat: "1,000+", label: "Past Paper Solutions" },
          { icon: Zap, stat: "100%", label: "Free Forever" },
        ].map((f) => (
          <div key={f.label} className="flex flex-col items-start gap-2 rounded-2xl border border-surface-container-high/60 bg-surface-container-lowest p-5 shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
              <f.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-headline-md text-headline-md text-on-surface">{f.stat}</span>
            <span className="font-title text-title text-on-surface-variant">{f.label}</span>
          </div>
        ))}
      </div>

      <InfoSection icon={HeartHandshake} title="Why we built this">
        <p>
          Class 10 is the single most consequential academic year for a Nepalese student. The Secondary Education Examination (SEE)
          decides stream placement, scholarship eligibility, and — for many families — whether education can continue at all.
        </p>
        <p>
          We noticed that quality preparation material existed almost entirely behind paid subscribers and coaching-centre doors.
          Students without those resources relied on photocopied, outdated question sets. SEE Sathi turns that imbalance on its head:
          the best-structured notes, formulas, and model answers should be the most accessible ones.
        </p>
      </InfoSection>

      <InfoSection icon={BadgeCheck} title="What we promise">
        <ul className="list-inside space-y-1.5">
          <li className="marker:text-primary">Notes and solutions aligned to the official CDC 2081/2082 curriculum.</li>
          <li>Step-by-step model answers matching the real SEE marking scheme.</li>
          <li>Offline-friendly pages that work even on low data connections.</li>
        </ul>
      </InfoSection>

      <InfoSection icon={Zap} title="An open-access initiative">
        <p>
          SEE Sathi is run as an open-access educational initiative for Nepalese secondary students. Our content is freely licensed,
          community-corrected, and constantly updated by teachers who mark real SEE papers. If you spot an error, we fix it —
          usually within days, not semesters.
        </p>
      </InfoSection>
    </InfoPage>
  );
}