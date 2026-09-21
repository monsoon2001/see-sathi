"use client";

import { useState } from "react";
import Link from "next/link";
import katex from "katex";
import { ArrowLeft, BadgeCheck, BookOpen, ChevronDown, Clock3, PencilLine, Shapes, Text } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Bilingual, Lang } from "@/lib/firebase/chapterDoc";
import type { MathAnswerStep, MathBlock, MathChapter } from "@/lib/mathChapter";
import { ImageBox, LangToggle, langFont, pickText } from "@/components/firestore/fsBlocks";
import { RichText } from "@/components/math/RichText";
import { ScrollProgressBar } from "@/components/layout/ScrollProgressBar";

const SECTION_COLORS = [
  "bg-primary-container text-on-primary",
  "bg-tertiary-fixed text-[#005B34]",
  "bg-secondary-fixed text-on-secondary-fixed",
  "bg-surface-container-high text-on-surface",
  "bg-primary-fixed text-on-primary-fixed",
  "bg-secondary-container/40 text-on-surface",
];

function Formula({ expr, className }: { expr: string; className?: string }) {
  const clean = expr.replace(/^\$\$?/, "").replace(/\$\$?$/, "");
  const html = katex.renderToString(clean, { displayMode: true, throwOnError: false, strict: false, output: "html" });
  return (
    <span
      className={cn("inline-block overflow-x-auto py-1", className)}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function partLabel(lang: Lang, partId: string) {
  if (lang === "ne") {
    const map: Record<string, string> = { a: "क", b: "ख", c: "ग", d: "घ", e: "ङ" };
    return map[partId] ?? partId;
  }
  return partId.toUpperCase();
}

function BlockRenderer({ block, lang, imageUrls }: { block: MathBlock; lang: Lang; imageUrls: Record<string, string> }) {
  switch (block.type) {
    case "text":
      return (
        <p className={cn("whitespace-pre-line font-body-lg text-[17px] leading-[30px] text-on-surface", langFont(lang))}>
          <RichText text={pickText(block.text, lang)} lang={lang} />
        </p>
      );
    case "formula":
      return (
        <div className="my-5 flex flex-col items-center gap-1 rounded-DEFAULT border border-primary/15 bg-primary-fixed/10 px-6 py-5">
          {block.label && (
            <span className={cn("mb-1 font-label-caps text-label-caps uppercase tracking-wider text-primary", langFont(lang))}>
              {pickText(block.label, lang)}
            </span>
          )}
          <Formula expr={block.expression} />
        </div>
      );
    case "list":
      return (
        <ul className="my-5 space-y-3">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-[10px] h-2 w-2 shrink-0 rounded-full bg-tertiary-container" />
              <span className={cn("font-body-md text-[16px] leading-[28px] text-on-surface-variant", langFont(lang))}>
                <RichText text={pickText(item, lang)} lang={lang} />
              </span>
            </li>
          ))}
        </ul>
      );
    case "image": {
      const src = imageUrls[block.imageId];
      if (!src) return null;
      return (
        <figure className="my-6">
          <ImageBox src={src} alt={pickText(block.altText, lang)} />
          {block.caption && (
            <figcaption className={cn("-mt-1 mb-2 text-center font-body-sm text-[13.5px] leading-[20px] text-on-surface-variant", langFont(lang))}>
              <RichText text={pickText(block.caption, lang)} lang={lang} />
            </figcaption>
          )}
        </figure>
      );
    }
    case "example":
      return (
        <div className="my-5 overflow-hidden rounded-DEFAULT border border-tertiary-container/30 bg-tertiary-fixed/5">
          <div className="border-b border-tertiary-container/20 bg-tertiary-fixed/15 px-5 py-3">
            <span className="inline-flex items-center gap-1.5 font-label-caps text-label-caps uppercase tracking-wider text-tertiary">
              <PencilLine className="h-3.5 w-3.5" aria-hidden="true" />
              {lang === "ne" ? "उदाहरण" : "Worked Example"}
            </span>
          </div>
          <div className="px-5 py-4">
            <p className={cn("font-title text-[17px] leading-[28px] text-on-surface", langFont(lang))}>
              <RichText text={pickText(block.problem, lang)} lang={lang} />
            </p>
            <ol className="mt-4 space-y-3">
              {block.solutionSteps.map((s) => (
                <li key={s.step} className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-title text-body-sm text-on-primary",
                      SECTION_COLORS[(s.step - 1) % SECTION_COLORS.length],
                    )}
                  >
                    {s.step}
                  </span>
                  <span className={cn("font-body-md text-[16px] leading-[28px] text-on-surface-variant", langFont(lang))}>
                    <RichText text={pickText(s.text, lang)} lang={lang} />
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-4 flex flex-wrap items-center gap-2 rounded-DEFAULT bg-surface-container-low px-4 py-2.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-tertiary-fixed/50 px-2.5 py-0.5 font-label-caps text-label-caps uppercase text-tertiary">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                {lang === "ne" ? "उत्तर" : "Answer"}
              </span>
              <span className={cn("font-title text-title font-semibold text-on-surface", langFont(lang))}>
                <RichText text={pickText(block.finalAnswer, lang)} lang={lang} />
              </span>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
}

function SolutionSteps({ steps, finalAnswer, lang }: { steps: MathAnswerStep[]; finalAnswer?: Bilingual; lang: Lang }) {
  return (
    <div className="mt-4 space-y-3 rounded-DEFAULT bg-surface-container-low p-4">
      {steps.length > 0 && (
        <ol className="space-y-3">
          {steps.map((s) => (
            <li key={s.step} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-container-high font-title text-body-sm text-on-surface">
                {s.step}
              </span>
              <span className={cn("font-body-md text-[15.5px] leading-[26px] text-on-surface-variant", langFont(lang))}>
                <RichText text={pickText(s.text, lang)} lang={lang} />
              </span>
            </li>
          ))}
        </ol>
      )}
      {finalAnswer && (
        <div className="flex flex-wrap items-center gap-2 rounded-DEFAULT bg-surface-container-lowest px-3 py-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-fixed px-2.5 py-0.5 font-label-caps text-label-caps uppercase text-primary">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Ans.
          </span>
          <span className={cn("font-title text-title font-semibold text-on-surface", langFont(lang))}>
            <RichText text={pickText(finalAnswer, lang)} lang={lang} />
          </span>
        </div>
      )}
    </div>
  );
}

export function MathChapterViewer({ chapter }: { chapter: MathChapter }) {
  const { notes, answers, folderId, imageUrls } = chapter;
  const [lang, setLang] = useState<Lang>("en");
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const title = lang === "ne" ? notes.title.ne : notes.title.en;

  const answerFor = (questionId: string) => answers?.answers.find((a) => a.questionId === questionId);

  return (
    <div className="pb-24">
      <div className="sticky top-20 z-40">
        <ScrollProgressBar />
        <div className="border-b border-surface-container bg-background/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-on-surface-variant">
              <Link
                href="/subjects"
                className="flex items-center gap-1 rounded-full bg-surface-container-lowest px-4 py-1.5 font-title text-body-sm text-on-surface shadow-sm transition-colors hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {lang === "ne" ? "विषयहरू" : "Subjects"}
              </Link>
              <span className="rounded-full bg-primary-fixed px-3 py-1.5 font-label-caps text-label-caps text-primary">
                {notes.subject ?? "Compulsory Mathematics"}
              </span>
              <span className="hidden font-label-caps text-label-caps uppercase tracking-wider text-tertiary sm:inline">
                {"·"} {notes.chapterNumber != null && `Unit ${notes.chapterNumber} · `}
                {lang === "ne" ? "परीक्षण नोट" : "Test chapter"}
              </span>
            </nav>
            <LangToggle lang={lang} onChange={setLang} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 lg:px-0">
        <div className="mb-2 inline-flex flex-wrap items-center gap-2 pt-8">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-4 py-1 font-bold text-label-caps uppercase tracking-wider text-primary">
            <Shapes className="h-[14px] w-[14px]" aria-hidden="true" />
            {notes.subject ?? "Compulsory Mathematics"} · Chapter {String(notes.chapterNumber ?? "").padStart(2, "0")}
          </span>
          {notes.estimatedPeriods != null && (
            <span className="inline-flex items-center gap-1 rounded-full bg-tertiary-fixed/50 px-3 py-1 font-label-caps text-label-caps text-tertiary">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
              {notes.estimatedPeriods} {lang === "ne" ? "अवधि" : "periods"}
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-3 py-1 font-label-caps text-label-caps text-on-surface-variant">
            {notes.sections.length} {lang === "ne" ? "खण्ड" : "sections"} · {notes.practiceQuestions.length}{" "}
            {lang === "ne" ? "प्रश्न" : "questions"}
          </span>
        </div>

        <h1 className="mb-2 font-display-hero text-display-hero tracking-tight text-on-surface">{title}</h1>
        <p className={cn("mb-8 font-headline-sm text-headline-sm text-outline", langFont(lang))}>
          {lang === "ne" ? notes.title.en : notes.title.ne}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {notes.sections.map((s, i) => (
            <a
              key={s.sectionId}
              href={`#m-section-${s.sectionId}`}
              className={cn(
                "rounded-full px-4 py-2 font-title text-body-sm transition-transform hover:-translate-y-0.5",
                SECTION_COLORS[i % SECTION_COLORS.length],
              )}
            >
              {pickText(s.title, lang)}
              <span className="ml-2 rounded-full bg-background/70 px-2 py-0.5 font-mono text-xs text-on-surface">
                {s.content.length}
              </span>
            </a>
          ))}
        </div>

        <div className="mt-8 space-y-12">
          {notes.sections.map((s, i) => (
            <section key={s.sectionId} id={`m-section-${s.sectionId}`} className="scroll-mt-40">
              <div className="mb-5 flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full font-title text-body-sm",
                    SECTION_COLORS[i % SECTION_COLORS.length],
                  )}
                >
                  {s.sectionId.split(".")[1] ?? i + 1}
                </span>
                <h2 className={cn("font-headline-md text-headline-md tracking-tight text-on-surface", langFont(lang))}>
                  {pickText(s.title, lang)}
                </h2>
              </div>
              <div className="space-y-4">
                {s.content.map((block, bi) => (
                  <BlockRenderer key={bi} block={block} lang={lang} imageUrls={imageUrls} />
                ))}
              </div>
            </section>
          ))}

          <section id="m-practice" className="scroll-mt-40 border-t border-surface-container pt-12">
            <div className="mb-2 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-tertiary-container font-title text-body-sm text-white">
                ✓
              </span>
              <h2 className={cn("font-headline-md text-headline-md tracking-tight text-on-surface", langFont(lang))}>
                {lang === "ne" ? "अभ्यास प्रश्नहरू" : "Practice Questions"}
              </h2>
              <span className="ml-auto rounded-full bg-surface-container px-3 py-1 font-mono text-xs text-on-surface-variant">
                {notes.practiceQuestions.length}
              </span>
            </div>
            <p className={cn("mb-6 font-body-sm text-on-surface-variant", langFont(lang))}>
              {lang === "ne"
                ? "प्रत्येक प्रश्नको चरणबद्ध हल हेर्न 'हल देखाउनुहोस्' मा थिच्नुहोस्।"
                : "Press “Show solution” on any question to reveal its step-by-step bilingual answer."}
            </p>

            <div className="space-y-4">
              {notes.practiceQuestions.map((q, qi) => {
                const answer = answerFor(q.questionId);
                const isOpen = Boolean(open[q.questionId]);
                const refImage = q.referenceImageId ? imageUrls[q.referenceImageId] : undefined;
                return (
                  <article key={q.questionId} className="rounded-DEFAULT border border-surface-container bg-surface-container-lowest p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container font-title text-body-sm text-on-primary">
                        {qi + 1}
                      </span>
                      <span className="rounded-full bg-surface-container px-3 py-0.5 font-title text-body-sm text-on-surface-variant">
                        {q.type === "multi-part" ? (q.marksTotal != null ? `${q.marksTotal} ` : "") : q.marks != null ? `${q.marks} ` : ""}
                        {lang === "ne" ? "अङ्क" : "marks"}
                      </span>
                      {q.type === "multi-part" && (
                        <span className="rounded-full bg-secondary-fixed px-3 py-0.5 font-label-caps text-label-caps uppercase tracking-wider text-on-secondary-fixed">
                          {lang === "ne" ? "बहुभाग" : "Multi-part"}
                        </span>
                      )}
                    </div>

                    {q.type === "single" ? (
                      <p className={cn("whitespace-pre-line font-title text-[17px] leading-[28px] text-on-surface", langFont(lang))}>
                        <RichText text={pickText(q.text, lang)} lang={lang} />
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {q.parts?.map((part) => (
                          <div key={part.partId} className="flex items-start gap-2.5">
                            <span
                              className={cn(
                                "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-container-high font-title text-body-sm text-on-surface",
                                langFont(lang),
                              )}
                            >
                              {partLabel(lang, part.partId)}
                            </span>
                            <p className={cn("font-title text-[16px] leading-[27px] text-on-surface", langFont(lang))}>
                              <RichText text={pickText(part.text, lang)} lang={lang} />
                              {part.marks != null && (
                                <span className="ml-2 font-label-caps text-label-caps uppercase tracking-wider text-outline">
                                  {part.marks} {lang === "ne" ? "अङ्क" : "marks"}
                                </span>
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {refImage && (
                      <div className="my-4">
                        <ImageBox src={refImage} alt={`${q.questionId} diagram`} />
                      </div>
                    )}

                    {answer && (
                      <>
                        <button
                          type="button"
                          onClick={() => setOpen((prev) => ({ ...prev, [q.questionId]: !prev[q.questionId] }))}
                          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary-container px-4 py-1.5 font-title text-title text-on-primary transition-colors hover:bg-primary-dark"
                        >
                          {isOpen ? (lang === "ne" ? "हल लुकाउनुहोस्" : "Hide solution") : (lang === "ne" ? "हल देखाउनुहोस्" : "Show solution")}
                          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} aria-hidden="true" />
                        </button>
                        {isOpen && (
                          <>
                            {q.type === "single" && (
                              <SolutionSteps
                                steps={answer.solutionSteps ?? []}
                                finalAnswer={answer.finalAnswer}
                                lang={lang}
                              />
                            )}
                            {q.type === "multi-part" && (
                              <div className={cn("mt-4 space-y-4 rounded-DEFAULT bg-surface-container-low p-4", langFont(lang))}>
                                {q.parts?.map((part) => {
                                  const aPart = answer.parts?.find((p) => p.partId === part.partId);
                                  return (
                                    <div key={part.partId}>
                                      <div className="mb-2 flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-primary-fixed px-2.5 py-0.5 font-label-caps text-label-caps uppercase text-primary">
                                          {lang === "ne" ? "भाग" : "Part"} {partLabel(lang, part.partId)}
                                        </span>
                                        <span className="font-title text-title text-on-surface">{pickText(part.text, lang)}</span>
                                      </div>
                                      {aPart ? (
                                        <SolutionSteps steps={aPart.solutionSteps} finalAnswer={aPart.finalAnswer} lang={lang} />
                                      ) : (
                                        <p className="font-body-sm text-on-surface-variant">
                                          {lang === "ne" ? "यस भागको हल उपलब्ध छैन।" : "Solution not available for this part yet."}
                                        </p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}

                    {!answer && (
                      <p className={cn("mt-4 flex items-center gap-1.5 font-body-sm text-on-surface-variant", langFont(lang))}>
                        <Text className="h-4 w-4" aria-hidden="true" />
                        {lang === "ne" ? "हल पछि थपिनेछ।" : "Solution coming soon."}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-surface-container pt-6 sm:flex-row">
          <Link
            href="/subjects"
            className="inline-flex w-full items-center justify-center gap-1 rounded-full bg-surface-container px-6 py-2 font-title text-title text-on-surface transition-colors hover:bg-surface-container-high sm:w-auto"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            {lang === "ne" ? "सबै विषयहरू" : "All Subjects"}
          </Link>
          <Link
            href="#m-practice"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-container px-6 py-2 font-title text-title text-on-primary shadow-[0_4px_14px_rgba(75,79,242,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(75,79,242,0.38)] sm:w-auto"
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            {lang === "ne" ? "अभ्यास गर्नुहोस्" : "Try the Practice"}
          </Link>
        </div>
      </div>
    </div>
  );
}