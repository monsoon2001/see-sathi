"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Lock, Search } from "lucide-react";
import { SubjectIcon } from "@/components/brand/SubjectIcon";
import { cn } from "@/lib/utils";
import type { Subject } from "@/lib/types";

type Filter = "all" | "compulsory" | "elective";

interface CardSpec {
  category: "compulsory" | "elective";
  tileClass: string;
  pillClass: string;
  pillLabel: string;
  accent: string;
  glow: string;
  strip: string;
}

const cardSpecs: Record<string, CardSpec> = {
  mathematics: {
    category: "compulsory",
    tileClass: "bg-primary-fixed text-primary",
    pillClass: "bg-primary-fixed text-primary",
    pillLabel: "Compulsory · CDC Verified",
    accent: "#4B4FF2",
    glow: "0 16px 36px rgba(75,79,242,0.16)",
    strip: "linear-gradient(90deg,#4B4FF2,#8C6EF8)",
  },
  science: {
    category: "compulsory",
    tileClass: "bg-tertiary-fixed text-tertiary",
    pillClass: "bg-tertiary-fixed text-tertiary",
    pillLabel: "Compulsory · CDC Verified",
    accent: "#0E7460",
    glow: "0 16px 36px rgba(14,116,96,0.15)",
    strip: "linear-gradient(90deg,#2FB673,#14B8A6)",
  },
  english: {
    category: "compulsory",
    tileClass: "bg-secondary-fixed text-secondary",
    pillClass: "bg-secondary-fixed text-secondary",
    pillLabel: "Compulsory · CDC Verified",
    accent: "#B5250C",
    glow: "0 16px 36px rgba(181,37,12,0.14)",
    strip: "linear-gradient(90deg,#FD583A,#F59E0B)",
  },
  nepali: {
    category: "compulsory",
    tileClass: "bg-secondary-fixed text-on-secondary-fixed-variant",
    pillClass: "bg-secondary-fixed text-on-secondary-fixed-variant",
    pillLabel: "अनिवार्य · CDC पाठ्यक्रम",
    accent: "#7C3AED",
    glow: "0 16px 36px rgba(124,58,237,0.16)",
    strip: "linear-gradient(90deg,#8A63D2,#C084FC)",
  },
  "social-studies": {
    category: "compulsory",
    tileClass: "bg-surface-container-highest text-primary-container",
    pillClass: "bg-surface-container-highest text-primary-container",
    pillLabel: "Compulsory · CDC Verified",
    accent: "#D97706",
    glow: "0 16px 36px rgba(217,119,6,0.15)",
    strip: "linear-gradient(90deg,#F59E0B,#E49A3D)",
  },
  "optional-mathematics": {
    category: "elective",
    tileClass: "bg-primary-fixed-dim text-on-primary-fixed-variant",
    pillClass: "bg-primary-fixed-dim text-on-primary-fixed-variant",
    pillLabel: "Elective I · Advanced",
    accent: "#2423D2",
    glow: "0 16px 36px rgba(36,35,210,0.16)",
    strip: "linear-gradient(90deg,#2423D2,#4B4FF2)",
  },
  "health-population-environment": {
    category: "compulsory",
    tileClass: "bg-success-soft text-success-dark",
    pillClass: "bg-success-soft text-success-dark",
    pillLabel: "Compulsory · CDC Verified",
    accent: "#0B6E5B",
    glow: "0 16px 36px rgba(11,110,91,0.15)",
    strip: "linear-gradient(90deg,#0E7460,#2FB673)",
  },
  "computer-science": {
    category: "elective",
    tileClass: "bg-surface-container-high text-primary",
    pillClass: "bg-surface-container-high text-primary",
    pillLabel: "Elective II · Technical",
    accent: "#0E7490",
    glow: "0 16px 36px rgba(14,116,144,0.15)",
    strip: "linear-gradient(90deg,#14B8A6,#0EA5E9)",
  },
};

const subjectLinks: Record<string, string> = {
  mathematics: "/subjects/mathematics",
  science: "/subjects/science",
  english: "/subjects/english",
  nepali: "/subjects/nepali",
  "social-studies": "/subjects/social-studies",
  "optional-mathematics": "/subjects/optional-mathematics",
  "computer-science": "/subjects/computer-science",
};

function SubjectCard({ subject }: { subject: Subject }) {
  const spec = cardSpecs[subject.slug];
  const isNepali = subject.slug === "nepali";

  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between rounded-lg bg-surface-container-lowest p-6 shadow-[0_2px_4px_rgba(24,26,43,0.03),0_12px_28px_rgba(24,26,43,0.05)] transition-all duration-300",
        !subject.comingSoon && "hover:-translate-y-1.5 hover:shadow-[var(--card-glow)]",
        subject.comingSoon && "opacity-80",
      )}
      data-category={spec.category}
      style={{ ["--card-glow" as string]: spec.glow }}
    >
      <div
        className="absolute inset-x-0 top-0 h-[3px] rounded-t-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spec.strip ?? spec.glow }}
        aria-hidden="true"
      />
      <div>
        <div className="mb-4 flex items-center justify-between gap-2">
          <div
            className={cn("flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-105", spec.tileClass)}
          >
            <SubjectIcon icon={subject.icon} className="h-[26px] w-[26px]" strokeWidth={1.8} />
          </div>
          <span className={cn("rounded-full px-2 py-1 text-label-caps uppercase tracking-wide", spec.pillClass)}>
            {spec.pillLabel}
          </span>
          {subject.comingSoon && (
            <span className="rounded-full bg-[#f4f2ff] px-2.5 py-1 text-label-caps uppercase tracking-wide text-outline">
              Coming Soon
            </span>
          )}
        </div>

        <h2
          className={cn("text-headline-md tracking-tight text-on-surface transition-colors group-hover:text-[var(--hover-c)]", isNepali && "font-devanagari")}
          style={{ ["--hover-c" as string]: spec.accent }}
        >
          {subject.name}
        </h2>

        <div className="mb-4 mt-1 flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
          <BookOpen className="h-4 w-4" style={{ color: spec.accent }} aria-hidden="true" />
          <span>
            {subject.slug === "nepali" ? subject.chapterCount : subject.chapterCount} Chapters
          </span>
          <span className="inline-block h-1 w-1 rounded-full bg-outline-variant" />
          <span>
            {subject.slug === "social-studies"
              ? `${subject.questionCount} Model Answers`
              : subject.slug === "nepali"
                ? `${subject.questionCount} Solved Exercises`
                : `${subject.questionCount} Solved Model Questions`}
          </span>
        </div>

        {subject.topics && (
          <div className="mb-6 flex flex-wrap gap-1.5">
            {subject.topics.map((topic) => (
              <span
                key={topic}
                className="rounded-md bg-surface-container px-2.5 py-1 font-body-sm text-body-sm text-on-surface-variant"
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto pt-2">
        {subject.comingSoon ? (
          <span className="inline-flex items-center gap-1 font-title text-title text-outline">
            <Lock className="h-[16px] w-[16px]" aria-hidden="true" />
            Coming Soon
          </span>
        ) : (
          <Link
            href={subjectLinks[subject.slug] ?? `/subjects/${subject.slug}`}
            className="inline-flex items-center gap-1 font-title text-title transition-transform group-hover:translate-x-1"
            style={{ color: spec.accent }}
          >
            <span>Explore Chapters</span>
            <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
          </Link>
        )}
      </div>
    </article>
  );
}

export function SubjectsDirectory({ subjects }: { subjects: Subject[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(
    () => ({
      total: subjects.length,
      compulsory: subjects.filter((s) => cardSpecs[s.slug]?.category === "compulsory").length,
      elective: subjects.filter((s) => cardSpecs[s.slug]?.category === "elective").length,
    }),
    [subjects],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return subjects.filter((s) => {
      const spec = cardSpecs[s.slug];
      if (!spec) return true;
      if (filter === "compulsory" && spec.category !== "compulsory") return false;
      if (filter === "elective" && spec.category !== "elective") return false;
      if (!q) return true;
      const haystack = `${s.name} ${s.tagline} ${s.topics?.join(" ") ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [subjects, filter, query]);

  const tabs: { key: Filter; label: string; count?: number }[] = [
    { key: "all", label: "All Subjects", count: counts.total },
    { key: "compulsory", label: "Compulsory", count: counts.compulsory },
    { key: "elective", label: "Electives", count: counts.elective },
  ];

  return (
    <div className="relative mx-auto w-full max-w-7xl px-4 pb-10 lg:px-8">
      <div className="pointer-events-none absolute -top-16 left-1/4 -z-10 h-96 w-96 rounded-full bg-primary-fixed/30 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-48 -z-10 h-80 w-80 rounded-full bg-secondary-fixed/20 blur-3xl" />

      <header className="max-w-4xl pb-4 pt-6">
        <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary-fixed px-4 py-1 text-label-caps uppercase tracking-wider text-primary shadow-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          Explore Curriculum · CDC Nepal 2081/2082
        </div>
        <h1 className="mb-2 text-display-hero tracking-tight text-on-surface">Subjects</h1>
        <p className="max-w-3xl font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
          Pick a subject and start studying, chapter by chapter. Formatted for high retention, step-by-step model answers, and official SEE mark distribution.
        </p>
      </header>

      <div className="mt-4 mb-10 flex flex-col items-stretch justify-between gap-4 xl:flex-row xl:items-center">
        <div className="no-scrollbar flex items-center gap-1 overflow-x-auto rounded-full bg-surface-container-high/60 p-1.5 shadow-inner">
          {tabs.map((tab) => {
            const active = filter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilter(tab.key)}
                className={cn(
                  "whitespace-nowrap rounded-full px-4 py-2 font-title text-title transition-all",
                  active
                    ? "bg-primary-container text-on-primary shadow-[0_4px_14px_rgba(75,79,242,0.28)]"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
                )}
              >
                {tab.label}
                {typeof tab.count === "number" && (
                  <span className={cn("text-label-md", active ? "opacity-80" : "opacity-70")}>
                    {" "}({tab.count})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="relative w-full shrink-0 xl:w-96">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[20px] text-outline"
            aria-hidden="true"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topic or chapter (e.g. Heredity, Motion, Grammar)..."
            className="w-full rounded-full bg-surface-container-lowest py-3 pl-11 pr-4 font-body-md text-body-md text-on-surface shadow-[0_2px_8px_rgba(24,26,43,0.05)] transition-all placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((subject) => (
          <SubjectCard key={subject.slug} subject={subject} />
        ))}
      </div>
    </div>
  );
}