"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  CircleCheck,
  Clock,
  Hourglass,
  ListChecks,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { chapterDisplayNumber } from "@/lib/chapterLabel";
import type { Chapter } from "@/lib/types";

type Filter = "all" | "group-c" | "group-d" | "high-yield";

function progressData(chapter: Chapter): { label: string; icon: typeof CheckCircle2; className: string } {
  if (chapter.progress === "mastered") {
    return { label: "Mastered (100%)", icon: CheckCircle2, className: "text-tertiary" };
  }
  if (chapter.progress === "in-progress") {
    return {
      label: `In Progress (${chapter.progressPercent ?? 0}%)`,
      icon: Hourglass,
      className: "text-primary font-title",
    };
  }
  return { label: "Not Started", icon: Circle, className: "text-outline" };
}

function ChapterCard({ subjectSlug, chapter }: { subjectSlug: string; chapter: Chapter }) {
  const status = progressData(chapter);
  const StatusIcon = status.icon;
  const number = chapterDisplayNumber(chapter);
  const isHot = chapter.group === "group-d";

  return (
    <article className="group relative rounded-2xl bg-surface-container-lowest p-4 shadow-[0_2px_8px_rgba(24,26,43,0.03)] transition-all duration-200 hover:bg-surface-container-low/80 hover:shadow-[0_8px_24px_rgba(75,79,242,0.08)] lg:p-6">
      <Link
        href={`/subjects/${subjectSlug}/${chapter.slug}`}
        aria-label={`Open chapter: ${chapter.title}`}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      />
      <div className="relative flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex min-w-0 items-start gap-4">
          <span className="w-12 shrink-0 pt-0.5 select-none text-headline-lg font-extrabold text-outline-variant transition-colors group-hover:text-primary">
            {number}
          </span>
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-1">
              <h3 className="text-headline-sm tracking-tight text-on-surface transition-colors group-hover:text-primary">
                {chapter.title}
              </h3>
              <span
                className={cn(
                  "rounded-full px-1 py-0.5 text-label-caps",
                  isHot ? "bg-secondary-fixed text-on-secondary-fixed" : "bg-surface-container text-on-surface-variant",
                )}
              >
                {chapter.weightage}
              </span>
              {chapter.highYield && (
                <span className="rounded-full bg-secondary-fixed px-1 py-0.5 text-label-caps text-on-secondary-fixed">
                  CDC High Yield
                </span>
              )}
            </div>
            <p className="line-clamp-1 font-body-md text-body-md text-on-surface-variant">{chapter.description}</p>
            <div className="flex items-center gap-4 pt-1 font-body-sm text-body-sm text-on-surface-variant">
              <span className={cn("flex items-center gap-1", status.className)}>
                <StatusIcon className="h-[15px] w-[15px]" aria-hidden="true" />
                {status.label}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="h-[15px] w-[15px]" aria-hidden="true" /> {chapter.readMinutes ?? 0} min notes
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <ListChecks className="h-[15px] w-[15px]" aria-hidden="true" /> {chapter.questionsCount ?? 0} questions
              </span>
              {chapter.workingHours ? (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Hourglass className="h-[15px] w-[15px]" aria-hidden="true" /> ~{chapter.workingHours} hrs curriculum
                  </span>
                </>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 self-end lg:self-center">
          <Link
            href={`/subjects/${subjectSlug}/${chapter.slug}/notes`}
            className="relative z-20 inline-flex items-center gap-1 rounded-full bg-surface-container-high px-4 py-2.5 font-title text-body-md text-on-surface transition-colors hover:bg-surface-container-highest"
          >
            <BookOpen className="h-[18px] w-[18px]" aria-hidden="true" />
            <span>Notes</span>
          </Link>
          {(chapter.questionsCount ?? 0) > 0 && (
            <Link
              href={`/subjects/${subjectSlug}/${chapter.slug}/questions`}
              className="relative z-20 inline-flex items-center gap-1 rounded-full bg-primary-container px-6 py-2.5 font-title text-body-md text-on-primary shadow-[0_4px_12px_rgba(75,79,242,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(75,79,242,0.38)]"
            >
              <CircleCheck className="h-[18px] w-[18px]" aria-hidden="true" />
              <span>{chapter.questionsCount ?? 0} Solved Qs →</span>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

type ListItem =
  | { kind: "chapter"; chapter: Chapter }
  | { kind: "group"; members: Chapter[] };

const GROUP_TITLES: Record<number, string> = { 4: "Python Programming" };

function groupTitle(number: number, section?: string): string {
  const socialName = section && SOCIAL_UNIT_TITLES[section];
  if (socialName) return socialName;
  return GROUP_TITLES[number] ?? `Chapter ${String(number).padStart(2, "0")}`;
}

function matchGroup(chapter: Chapter, filter: Filter): boolean {
  const dataGroup = [chapter.group && chapter.group !== "all" ? chapter.group : null, chapter.highYield ? "high-yield" : null]
    .filter(Boolean)
    .join(" ");
  return filter === "all" || dataGroup.includes(filter);
}

function matchQuery(chapter: Chapter, q: string): boolean {
  return !q || `${chapter.title} ${chapter.description}`.toLowerCase().includes(q);
}

function originalIndex(item: ListItem, chapters: Chapter[]): number {
  if (item.kind === "chapter") return chapters.indexOf(item.chapter);
  const first = chapters.findIndex((c) => c.subLabel && c.number === item.members[0].number);
  return first >= 0 ? first : Number.MAX_SAFE_INTEGER;
}

function SubChapterRow({ subjectSlug, chapter, letter }: { subjectSlug: string; chapter: Chapter; letter: string }) {
  const title = chapter.title.replace(/^Python — /, "");
  return (
    <li className="group relative flex flex-col justify-between gap-3 rounded-xl bg-surface-container-low px-3.5 py-3 transition-colors hover:bg-surface-container lg:flex-row lg:items-center">
      <Link
        href={`/subjects/${subjectSlug}/${chapter.slug}`}
        aria-label={`Open chapter: ${chapter.title}`}
        className="absolute inset-0 z-10 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      />
      <div className="relative flex min-w-0 items-start gap-3">
        <span className="w-8 shrink-0 pt-0.5 font-title text-title text-primary">{letter})</span>
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-1">
            <h4 className="font-title text-title text-on-surface transition-colors group-hover:text-primary">{title}</h4>
            <span className="rounded-full bg-surface-container px-1.5 py-0.5 font-label-caps text-label-caps text-on-surface-variant">
              {chapter.weightage}
            </span>
            {chapter.highYield && (
              <span className="rounded-full bg-secondary-fixed px-1.5 py-0.5 font-label-caps text-label-caps text-on-secondary-fixed">
                High Yield
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 font-body-sm text-body-sm text-on-surface-variant">
            <span className="flex items-center gap-1">
              <Clock className="h-[15px] w-[15px]" aria-hidden="true" /> {chapter.readMinutes ?? 0} min notes
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <ListChecks className="h-[15px] w-[15px]" aria-hidden="true" /> {chapter.questionsCount ?? 0} questions
            </span>
            {chapter.workingHours ? (
              <>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Hourglass className="h-[15px] w-[15px]" aria-hidden="true" /> ~{chapter.workingHours} hrs
                </span>
              </>
            ) : null}
          </div>
        </div>
      </div>
      <div className="relative flex shrink-0 items-center gap-2 self-end lg:self-center">
        <Link
          href={`/subjects/${subjectSlug}/${chapter.slug}/notes`}
          className="relative z-20 inline-flex items-center gap-1 rounded-full bg-surface-container-high px-3.5 py-2 font-title text-body-md text-on-surface transition-colors hover:bg-surface-container-highest"
        >
          <BookOpen className="h-[18px] w-[18px]" aria-hidden="true" />
          <span>Notes</span>
        </Link>
        {(chapter.questionsCount ?? 0) > 0 && (
          <Link
            href={`/subjects/${subjectSlug}/${chapter.slug}/questions`}
            className="relative z-20 inline-flex items-center gap-1 rounded-full bg-primary-container px-4 py-2 font-title text-body-md text-on-primary transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(75,79,242,0.25)]"
          >
            <CircleCheck className="h-[18px] w-[18px]" aria-hidden="true" />
            <span>{chapter.questionsCount ?? 0} Solved Qs →</span>
          </Link>
        )}
      </div>
    </li>
  );
}

function ChapterGroupCard({ subjectSlug, members }: { subjectSlug: string; members: Chapter[] }) {
  const first = members[0];
  const number = String(first.number).padStart(2, "0");
  const totalMarks = members.reduce((s, c) => s + (parseInt(c.weightage?.match(/Weightage: (\d+)/)?.[1] ?? "0", 10) || 0), 0);
  const totalHours = members.reduce((s, c) => s + (c.workingHours ?? 0), 0);
  const totalQ = members.reduce((s, c) => s + (c.questionsCount ?? 0), 0);
  const anyHigh = members.some((c) => c.highYield);
  const letters = "abcdefghijklmnopqrstuvwxyz";
  return (
    <article className="group rounded-2xl bg-surface-container-lowest p-4 shadow-[0_2px_8px_rgba(24,26,43,0.03)] transition-all duration-200 hover:shadow-[0_8px_24px_rgba(75,79,242,0.08)] lg:p-6">
      <div className="flex min-w-0 items-start gap-4">
        <span className="w-12 shrink-0 pt-0.5 select-none text-headline-lg font-extrabold text-outline-variant transition-colors group-hover:text-primary">
          {number}
        </span>
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-1">
            <h3 className="text-headline-sm tracking-tight text-on-surface">{groupTitle(first.number, first.section)}</h3>
            <span className="rounded-full bg-primary-fixed px-1.5 py-0.5 font-label-caps text-label-caps text-primary">
              Weightage: {totalMarks} Marks
            </span>
            <span className="rounded-full bg-surface-container px-1.5 py-0.5 font-label-caps text-label-caps text-on-surface-variant">
              Unit {number}
            </span>
            {anyHigh && (
              <span className="rounded-full bg-secondary-fixed px-1.5 py-0.5 font-label-caps text-label-caps text-on-secondary-fixed">
                CDC High Yield
              </span>
            )}
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Sub-chapters {letters.slice(0, members.length).split("").map((l) => `${l})`).join(", ")} · ~{totalHours} hrs curriculum · {totalQ} solved questions
          </p>
        </div>
      </div>
      <ul className="mt-4 space-y-2 border-t border-surface-container/70 pt-3">
        {members.map((member, i) => (
          <SubChapterRow key={member.slug} subjectSlug={subjectSlug} chapter={member} letter={letters[i]} />
        ))}
      </ul>
    </article>
  );
}

const WRITING_SECTION_TITLES: Record<string, string> = {
  Grammar: "Grammar (Units G1–G14)",
  Writing: "Writing (Units W1–W24)",
};

const SOCIAL_UNIT_TITLES: Record<string, string> = {
  "Unit 1": "एकाइ १: हामी र हाम्रो समाज",
  "Unit 2": "एकाइ २: विकास र विकासका पूर्वाधार",
  "Unit 3": "एकाइ ३: हाम्रा सामाजिक मूल्य र मान्यता",
  "Unit 4": "एकाइ ४: सामाजिक समस्या र समाधान",
  "Unit 5": "एकाइ ५: नागरिक चेतना",
  "Unit 6": "एकाइ ६: हाम्रो पृथ्वी (भूगोल)",
  "Unit 7": "एकाइ ७: नेपालको इतिहास",
  "Unit 8": "एकाइ ८: आर्थिक क्रियाकलाप",
  "Unit 9": "एकाइ ९: अन्तर्राष्ट्रिय सम्बन्ध र संस्थाहरू",
  "Unit 10": "एकाइ १०: जनसङ्ख्या र यसको व्यवस्थापन",
};

function sectionTitle(section?: string): string {
  return (section && (SOCIAL_UNIT_TITLES[section] || WRITING_SECTION_TITLES[section])) || section || "Chapters";
}

export function ChapterRoadmap({ subjectSlug, chapters }: { subjectSlug: string; chapters: Chapter[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isEnglish = subjectSlug === "english";

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const items: ListItem[] = [];
    const groups = new Map<number, Chapter[]>();
    for (const c of chapters) {
      if (c.subLabel) {
        const arr = groups.get(c.number) ?? [];
        arr.push(c);
        groups.set(c.number, arr);
        continue;
      }
      if (matchGroup(c, filter) && matchQuery(c, q)) items.push({ kind: "chapter", chapter: c });
    }
    for (const members of groups.values()) {
      const ordered = [...members].sort((a, b) => (a.subLabel ?? "").localeCompare(b.subLabel ?? ""));
      if (ordered.some((m) => matchGroup(m, filter) && matchQuery(m, q))) items.push({ kind: "group", members: ordered });
    }
    return items.sort((a, b) => originalIndex(a, chapters) - originalIndex(b, chapters));
  }, [chapters, filter, query]);

  const groupedItems = useMemo(() => {
    if (!isEnglish) return null;
    const map = new Map<string, ListItem[]>();
    for (const item of items) {
      const section = item.kind === "chapter" ? item.chapter.section : item.members[0].section;
      const arr = map.get(section ?? "") ?? [];
      arr.push(item);
      map.set(section ?? "", arr);
    }
    return Array.from(map.entries()).map(([name, list]) => ({ name: sectionTitle(name), list }));
  }, [items, isEnglish]);

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: `All (${chapters.length})` },
    { key: "group-c", label: "Group C (40m)" },
    { key: "group-d", label: "Group D HOTs (16m)" },
    { key: "high-yield", label: "High Yield" },
  ];

  return (
    <>
      <section className="z-20 mx-auto w-full max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-2 rounded-2xl bg-surface-container-lowest p-2 shadow-[0_4px_24px_rgba(24,26,43,0.06)] md:flex-row">
          <div className="relative w-full md:flex-1">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[20px] text-outline"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="text"
              id="chapterSearchInput"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chapters, topics, or formulas (e.g. Heredity, Sets, Ohm's Law)..."
              className="h-12 w-full rounded-full bg-surface-container-low pl-12 pr-16 font-body-md text-body-md text-on-surface transition-all duration-200 placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md bg-surface-container-high px-2 py-0.5 text-label-caps text-on-surface-variant sm:flex">
              <span>⌘</span>
              <span>K</span>
            </div>
          </div>
          <div className="no-scrollbar flex w-full shrink-0 items-center gap-1 overflow-x-auto pb-1 md:w-auto md:pb-0">
            {filters.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    "whitespace-nowrap rounded-full px-4 py-2 text-label-md transition-all",
                    active
                      ? "bg-primary text-on-primary shadow-[0_2px_8px_rgba(75,79,242,0.3)]"
                      : "bg-surface-container text-on-surface-variant hover:text-on-surface",
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-headline-md tracking-tight text-on-surface">Curriculum Roadmap</h2>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Showing {items.length} of {chapters.length} modules
          </span>
        </div>
        <div className="space-y-2">
          {groupedItems ? (
            groupedItems.map((section) => (
              <div key={section.name} className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 pt-4 first:pt-0">
                  <h3 className="flex items-center gap-2 text-headline-sm font-semibold tracking-tight text-on-surface">
                    {section.name}
                    <span className="rounded-full bg-surface-container px-2 py-0.5 font-label-caps text-label-caps text-on-surface-variant">
                      {section.list.length} Units
                    </span>
                  </h3>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {section.list.filter((i) => i.kind === "chapter").length + section.list.filter((i) => i.kind === "group").length} shown
                  </span>
                </div>
                {section.list.map((item) =>
                  item.kind === "chapter" ? (
                    <ChapterCard key={item.chapter.slug} subjectSlug={subjectSlug} chapter={item.chapter} />
                  ) : (
                    <ChapterGroupCard key={`unit-${item.members[0].number}`} subjectSlug={subjectSlug} members={item.members} />
                  ),
                )}
              </div>
            ))
          ) : (
            items.map((item) =>
              item.kind === "chapter" ? (
                <ChapterCard key={item.chapter.slug} subjectSlug={subjectSlug} chapter={item.chapter} />
              ) : (
                <ChapterGroupCard key={`unit-${item.members[0].number}`} subjectSlug={subjectSlug} members={item.members} />
              ),
            )
          )}
        </div>
      </section>
    </>
  );
}