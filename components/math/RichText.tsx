"use client";

import "katex/dist/katex.min.css";
import katex from "katex";
import { cn } from "@/lib/utils";
import { langFont } from "@/components/firestore/fsBlocks";
import type { Lang } from "@/lib/firebase/chapterDoc";

type Part =
  | { kind: "text"; value: string }
  | { kind: "inline"; value: string }
  | { kind: "display"; value: string };

const MATH_RE = /(\$\$[\s\S]+?\$\$|\$[^$]+\$)/g;

function splitMath(text: string): Part[] {
  const parts: Part[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  MATH_RE.lastIndex = 0;
  while ((m = MATH_RE.exec(text))) {
    if (m.index > last) parts.push({ kind: "text", value: text.slice(last, m.index) });
    const raw = m[0];
    if (raw.startsWith("$$")) {
      parts.push({ kind: "display", value: raw.slice(2, -2) });
    } else {
      parts.push({ kind: "inline", value: raw.slice(1, -1) });
    }
    last = m.index + raw.length;
  }
  if (last < text.length) parts.push({ kind: "text", value: text.slice(last) });
  return parts;
}

function renderMath(expr: string, displayMode: boolean): string {
  return katex.renderToString(expr, {
    displayMode,
    throwOnError: false,
    strict: false,
    output: "html",
  });
}

export function RichText({ text, lang }: { text: string; lang: Lang }) {
  const parts = splitMath(text);
  return (
    <>
      {parts.map((part, i) => {
        if (part.kind === "text") {
          return (
            <span key={i} className={cn(langFont(lang))}>
              {part.value}
            </span>
          );
        }
        if (part.kind === "display") {
          return (
            <span
              key={i}
              className="my-2 block overflow-x-auto py-1 text-center"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: renderMath(part.value, true) }}
            />
          );
        }
        return (
          <span
            key={i}
            className="mx-0.5 inline-block align-middle"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: renderMath(part.value, false) }}
          />
        );
      })}
    </>
  );
}