"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookCheck,
  CalendarDays,
  ChevronDown,
  FileText,
  Filter,
  Landmark,
  ListChecks,
  MapPin,
  RotateCcw,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PastPaper } from "@/lib/pastPapers";

export interface SubjectOption {
  id: string;
  name: string;
  color: string;
}

const NEPAL_PROVINCES = ["Koshi", "Madhesh", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"] as const;
const YEAR_OPTIONS = [2080, 2081, 2082] as const;

function paperYear(examYear?: string): number {
  return Number((examYear?.match(/\d{4}/)?.[0]) ?? 0);
}

function totalQuestions(doc: { questionSections: { items: unknown[] }[] }): number {
  return doc.questionSections.reduce((n, s) => n + s.items.length, 0);
}

function fmtMarks(marks?: number) {
  if (marks == null) return "";
  return Number.isInteger(marks) ? String(marks) : "½";
}

/** Normalises "3 hrs", "3 hours", "3 Hours" → "3 Hours", "1 hr" → "1 Hour", etc. */
function normalizeTime(raw: string): string {
  return raw
    .replace(/\bhrs?\b/gi, (m) => (m.toLowerCase().startsWith("hrs") ? "Hours" : "Hour"))
    .replace(/\bhours?\b/gi, (m) => (m.toLowerCase() === "hour" ? "Hour" : "Hours"))
    .replace(/\b(\d+)\s*(hour|hours|hr|hrs)\b/gi, (_, n, unit) =>
      `${n} ${Number(n) === 1 ? "Hour" : "Hours"}`,
    )
    .trim();
}

function FilterSelect({
  label,
  icon,
  value,
  onChange,
  options,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="relative flex items-center gap-2 rounded-full border border-surface-container bg-surface-container-lowest px-4 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-colors focus-within:border-primary/40">
      <span className="shrink-0 text-tertiary" aria-hidden="true">
        {icon}
      </span>
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer appearance-none bg-transparent pr-6 font-title text-title text-on-surface outline-none"
      >
        <option value="all">{label}: All</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-outline" aria-hidden="true" />
    </label>
  );
}

export function PastPapersIndex({
  papers,
  subjectOptions,
}: {
  papers: PastPaper[];
  subjectOptions: SubjectOption[];
}) {
  const [subject, setSubject] = useState("all");
  const [year, setYear] = useState("all");
  const [province, setProvince] = useState("all");

  const filtered = useMemo(() => {
    return papers.filter((p) => {
      const q = p.question;
      if (subject !== "all" && q.subjectId !== subject) return false;
      if (year !== "all" && paperYear(q.examYear) !== Number(year)) return false;
      if (province !== "all" && q.province !== province) return false;
      return true;
    });
  }, [papers, subject, year, province]);

  const hasFilter = subject !== "all" || year !== "all" || province !== "all";
  const reset = () => {
    setSubject("all");
    setYear("all");
    setProvince("all");
  };

  const yearCount = (y: number) => papers.filter((p) => paperYear(p.question.examYear) === y).length;
  const subjectCount = (id: string) => papers.filter((p) => p.question.subjectId === id).length;
  const provinceCount = (name: string) => papers.filter((p) => p.question.province === name).length;

  return (
    <div className="pb-24">
      <div className="mx-auto max-w-5xl px-4 pt-10 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-tertiary-fixed/40 px-4 py-1.5 text-tertiary">
          <FileText className="h-4 w-4" aria-hidden="true" />
          <span className="font-label-caps text-label-caps uppercase tracking-wider">Solved papers & answer keys</span>
        </div>
        <h1 className="mt-4 font-display-hero text-display-hero tracking-tight text-on-surface">Past Papers</h1>
        <p className="mt-3 max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
          Real SEE question papers digitised with step-by-step bilingual answer keys — every question solved in both
          English and नेपाली.
        </p>
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-8 lg:px-8">
        <div className="flex flex-wrap items-center gap-3 rounded-DEFAULT border border-surface-container bg-surface-container-lowest/70 p-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <span className="inline-flex flex-wrap items-center gap-1.5 bg-surface-container-low px-3 py-2 font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
            <Filter className="h-3.5 w-3.5 text-tertiary" aria-hidden="true" />
            Filters
          </span>
          <FilterSelect
            label="Subject"
            icon={<span className="h-2 w-2 rounded-full bg-primary" />}
            value={subject}
            onChange={setSubject}
            options={subjectOptions.map((s) => ({ value: s.id, label: `${s.name} (${subjectCount(s.id)})` }))}
          />
          <FilterSelect
            label="Year"
            icon={<CalendarDays className="h-4 w-4" />}
            value={year}
            onChange={setYear}
            options={YEAR_OPTIONS.map((y) => ({ value: String(y), label: `${y} (${yearCount(y)})` }))}
          />
          <FilterSelect
            label="Province"
            icon={<MapPin className="h-4 w-4" />}
            value={province}
            onChange={setProvince}
            options={NEPAL_PROVINCES.map((p) => ({ value: p, label: `${p} (${provinceCount(p)})` }))}
          />
          {hasFilter && (
            <button
              type="button"
              onClick={reset}
              className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-2 font-title text-title text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset
            </button>
          )}
        </div>

        {papers.length === 0 ? (
          <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-surface-container bg-surface-container-lowest/60 px-6 py-16 text-center">
            <FileText className="h-10 w-10 text-outline-variant" aria-hidden="true" />
            <h2 className="font-headline-sm text-headline-sm tracking-tight text-on-surface">No past papers published yet.</h2>
            <p className="max-w-md font-body-md text-body-md text-on-surface-variant">
              We&apos;re digitising SEE papers subject by subject — check back soon.
            </p>
          </div>
        ) : (
          <>
            <p className="mt-6 font-body-sm text-on-surface-variant">
              {filtered.length} of {papers.length} paper{papers.length === 1 ? "" : "s"} match
              {hasFilter ? " your filters." : "."}
            </p>

            {filtered.length === 0 ? (
              <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-surface-container bg-surface-container-lowest/60 px-6 py-14 text-center">
                <Filter className="h-10 w-10 text-outline-variant" aria-hidden="true" />
                <h2 className="font-headline-sm text-headline-sm tracking-tight text-on-surface">No papers match these filters.</h2>
                <p className="max-w-md font-body-md text-body-md text-on-surface-variant">
                  Try a different subject, year or province — or clear the filters to see everything.
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary-container px-6 py-2 font-title text-title text-on-primary shadow-[0_4px_14px_rgba(75,79,242,0.28)] transition-all hover:-translate-y-0.5"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
                {filtered.map((paper) => {
                  const q = paper.question;
                  const subjectOpt = subjectOptions.find((s) => s.id === q.subjectId);
                  const color = subjectOpt?.color ?? "#4B4FF2";
                  const answerCount = paper.answer ? totalQuestions(paper.answer) : 0;
                  return (
                    <Link
                      key={paper.folderId}
                      href={`/past-papers/${paper.folderId}`}
                      className="group flex flex-col rounded-DEFAULT border border-surface-container bg-surface-container-lowest p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_10px_30px_rgba(75,79,242,0.12)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 font-label-caps text-label-caps uppercase tracking-wider text-white" style={{ backgroundColor: color }}>
                          {subjectOpt?.name ?? q.subjectId}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-3 py-1 font-mono text-[11px] text-on-surface-variant">
                          <CalendarDays className="h-3 w-3" aria-hidden="true" />
                          {q.examYear}
                        </span>
                      </div>

                      <h2 className="mt-4 font-headline-md text-headline-md leading-snug tracking-tight text-on-surface transition-colors group-hover:text-primary">
                        {q.titleEn}
                      </h2>
                      <p className="mt-1 line-clamp-2 font-body-md text-outline">{q.titleNe}</p>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {q.province && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-low px-3 py-1 font-body-sm text-on-surface-variant">
                            <MapPin className="h-3.5 w-3.5 text-tertiary" aria-hidden="true" />
                            {q.province} Province
                          </span>
                        )}
                        {q.paperCode && (
                          <span className="rounded-full bg-surface-container-low px-3 py-1 font-mono text-[11px] text-on-surface-variant">
                            {q.paperCode}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-low px-3 py-1 font-body-sm text-on-surface-variant">
                          <ListChecks className="h-3.5 w-3.5 text-tertiary" aria-hidden="true" />
                          {totalQuestions(q)} questions
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {q.fullMarks != null && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 font-body-sm font-semibold text-primary">
                            <Landmark className="h-3.5 w-3.5" aria-hidden="true" />
                            FM {q.fullMarks}
                          </span>
                        )}
                        {q.timeAllowed && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 font-body-sm font-semibold text-primary">
                            <Timer className="h-3.5 w-3.5" aria-hidden="true" />
                            {normalizeTime(q.timeAllowed)}
                          </span>
                        )}

                        <span className="ml-auto" />

                        {paper.answer ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-tertiary-fixed/50 px-3 py-1 font-label-caps text-label-caps text-tertiary">
                            <BookCheck className="h-3.5 w-3.5" aria-hidden="true" />
                            Answers · {answerCount}
                          </span>
                        ) : (
                          <span className="rounded-full bg-surface-container px-3 py-1 font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
                            Paper only
                          </span>
                        )}
                      </div>

                      <span className={cn("mt-5 inline-flex items-center gap-1 border-t border-surface-container pt-4 font-title text-title text-primary", "transition-transform duration-200 group-hover:gap-2")}>
                        Open paper <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}