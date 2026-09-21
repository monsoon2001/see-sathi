"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, CircleCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Bilingual, FsBlock, FsQuestion, FsTable, Lang } from "@/lib/firebase/chapterDoc";

export function pickText(b: Bilingual | undefined, lang: Lang): string {
  if (!b) return "";
  const t = lang === "ne" ? b.ne : b.en;
  return t || b.en || b.ne || "";
}

const ENUM_TOKEN_RE = /\(([0-9]{1,2}|[ivxlc]{1,3}|[a-h])\)/g;

export function splitEnumeratedPoints(text: string): string[] | null {
  if (!text) return null;

  const matches: { index: number; end: number }[] = [];
  const re = new RegExp(ENUM_TOKEN_RE.source, "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const after = text[m.index + m[0].length];
    if (after !== undefined && /\S/.test(after)) continue;
    matches.push({ index: m.index, end: m.index + m[0].length });
  }
  if (matches.length < 2) return null;
  if (/\S/.test(text.slice(0, matches[0].index))) return null;

  const splits: number[] = [matches[0].index];
  for (let i = 1; i < matches.length; i++) {
    const gap = text.slice(matches[i - 1].end, matches[i].index);
    if (/[A-Za-z0-9]/.test(gap)) splits.push(matches[i].index);
  }

  if (splits.length < 2) return null;
  return splits.map((start, i) => text.slice(start, splits[i + 1]).trim()).filter(Boolean);
}

export function langFont(lang: Lang): string {
  return lang === "ne" ? "font-devanagari" : "font-body";
}

export function LangToggle({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-surface-container p-1">
      {(
        [
          { key: "en", label: "English" },
          { key: "ne", label: "नेपाली" },
        ] as const
      ).map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => onChange(o.key)}
          className={cn(
            "rounded-full px-4 py-1.5 font-title text-body-sm transition-all",
            lang === o.key ? "bg-surface-container-lowest text-on-surface shadow-sm" : "font-medium text-on-surface-variant hover:text-on-surface",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function BilingualTable({ table, lang }: { table: FsTable; lang: Lang }) {
  return (
    <div className="overflow-x-auto rounded-DEFAULT border border-surface-container bg-surface-container-lowest">
      <table className="w-full text-left">
        {table.headers.length > 0 && (
          <thead>
            <tr className="bg-surface-container-high">
              {table.headers.map((h, i) => (
                <th key={i} className={cn("px-5 py-4 font-title text-title text-on-surface", langFont(lang))}>
                  {pickText(h, lang)}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri} className="border-t border-surface-container">
              {row.map((cell, ci) => (
                <td key={ci} className={cn("px-5 py-4 align-top text-[0.88em] leading-[1.41em] text-on-surface-variant", langFont(lang))}>
                  {pickText(cell, lang)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import Image from "next/image";

export function ImageBox({ src, alt }: { src: string; alt?: string }) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(!src?.trim() || src.includes("YOUR_STORAGE_BUCKET"));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (hidden) return null;

  return (
    <>
      <figure className="my-4 overflow-hidden rounded-2xl border border-surface-container bg-surface-container-low">
        <button type="button" onClick={() => setOpen(true)} className="relative block w-full h-[34rem] cursor-zoom-in" aria-label="Open image viewer">
          <Image
            src={src}
            alt={alt || "Illustration"}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            onError={() => setHidden(true)}
            className="object-contain transition-transform duration-200 hover:scale-[1.02] p-4"
          />
        </button>
      </figure>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/35"
            aria-label="Close image viewer"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative w-full h-full max-h-[90vh] max-w-[94vw]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={src}
              alt={alt || "Illustration"}
              fill
              sizes="100vw"
              onError={() => setHidden(true)}
              className="rounded-xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}

export function BlockView({ block, lang }: { block: FsBlock; lang: Lang }) {
switch (block.type) {
    case "image": {
      const caption = block.caption && (block.caption.en || block.caption.ne) ? block.caption : undefined;
      return (
        <div className="my-5">
          <ImageBox src={block.url} alt={pickText(caption, lang)} />
          {caption && (
            <p
              className={cn(
                "-mt-1 mb-4 text-center font-body-sm text-[0.79em] leading-[1.18em] text-on-surface-variant",
                langFont(lang),
              )}
            >
              {pickText(caption, lang)}
            </p>
          )}
        </div>
      );
    }
    case "heading":
      return (
        <div className="mt-12">
          <h2 className={cn("mb-3 text-headline-md tracking-tight text-on-surface", langFont(lang))}>
            {pickText(block.text, lang)}
          </h2>
          {block.image && <ImageBox src={block.image} />}
        </div>
      );
    case "list":
      return (
        <div className="my-5">
          {block.ordered ? (
            <ol className="space-y-3">
              {block.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-container font-title text-body-sm text-on-primary">
                    {i + 1}
                  </span>
                  <span className={cn("font-body-md text-[0.94em] leading-[1.65em] text-on-surface-variant", langFont(lang))}>
                    {pickText(item, lang)}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <ul className="space-y-3">
              {block.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-[10px] h-2 w-2 shrink-0 rounded-full bg-tertiary-container" />
                  <span className={cn("font-body-md text-[0.94em] leading-[1.65em] text-on-surface-variant", langFont(lang))}>
                    {pickText(item, lang)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {block.image && <ImageBox src={block.image} />}
        </div>
      );
    case "table":
      return (
        <div className="my-5">
          <BilingualTable table={block.table} lang={lang} />
          {block.image && <ImageBox src={block.image} />}
        </div>
      );
    default:
      return (
        <p className={cn("whitespace-pre-line font-body-lg text-[1.03em] leading-[1.88em] text-on-surface", langFont(lang))}>
          {pickText(block.text, lang)}
        </p>
      );
  }
}

const SOURCE_LABELS: Record<string, string> = { textbook: "Textbook", see: "SEE Board", cdc: "CDC Model" };

export function QuestionCard({ q, index, lang }: { q: FsQuestion; index: number; lang: Lang }) {
  const answerText = pickText(q.answer, lang);
  const answerPoints = splitEnumeratedPoints(answerText);
  const showOptions = q.options && q.options.length > 0;

  return (
    <article className="rounded-DEFAULT border border-surface-container bg-surface-container-lowest p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container font-title text-body-sm text-on-primary">
          {index}
        </span>
        <span className="rounded-full bg-surface-container px-3 py-0.5 font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
          {SOURCE_LABELS[q.source] ?? q.source}
        </span>
        {q.id && (
          <span className="rounded-full bg-surface-container-low px-2.5 py-0.5 font-mono text-[11px] text-outline">{q.id}</span>
        )}
      </div>

      <p className={cn("whitespace-pre-line font-title text-[18px] leading-[30px] text-on-surface", langFont(lang))}>
        {pickText(q.question, lang)}
      </p>

      {q.image && <ImageBox src={q.image} />}

      {showOptions && (
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {q.options!.map((opt, i) => {
            const text = pickText(opt, lang);
            const correct = Boolean(answerText) && text === answerText;
            return (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 font-body-sm text-[15px]",
                  correct
                    ? "bg-tertiary-fixed/50 font-semibold text-tertiary ring-1 ring-inset ring-tertiary-container/40"
                    : "bg-surface-container-low text-on-surface-variant",
                )}
              >
                <span className="font-title text-label-md">{String.fromCharCode(65 + i)}.</span>
                <span className={cn(langFont(lang))}>{text}</span>
                {correct && <CircleCheck className="ml-auto h-4 w-4 shrink-0" aria-hidden="true" />}
              </div>
            );
          })}
        </div>
      )}

      {(q.answer || q.solution || q.solutionTable) && (
        <div className="mt-4 rounded-DEFAULT bg-surface-container-low p-4">
          {q.answer && (
            <div className="mb-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-fixed px-2.5 py-0.5 font-label-caps text-label-caps uppercase text-primary">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Ans.
              </span>
              {answerPoints ? (
                <ol className="mt-1.5 space-y-1.5">
                  {answerPoints.map((p, i) => (
                    <li key={i} className={cn("whitespace-pre-line font-title text-[16px] font-semibold text-on-surface", langFont(lang))}>
                      {p}
                    </li>
                  ))}
                </ol>
              ) : (
                <span className={cn("font-title text-[16px] font-semibold text-on-surface", langFont(lang))}>{answerText}</span>
              )}
            </div>
          )}
          {q.solution && (
            <p className={cn("whitespace-pre-line font-body-md text-[15.5px] leading-[26px] text-on-surface-variant", langFont(lang))}>
              {pickText(q.solution, lang)}
            </p>
          )}
          {q.solutionTable && (
            <div className="mt-3">
              <BilingualTable table={q.solutionTable} lang={lang} />
            </div>
          )}
        </div>
      )}
    </article>
  );
}