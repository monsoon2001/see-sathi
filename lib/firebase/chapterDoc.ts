import fs from "node:fs";
import path from "node:path";
import { FIRESTORE_REST_BASE, FIREBASE_API_KEY } from "@/lib/firebase/config";

/**
 * Typed model for Firestore chapter documents (collection: `chapters`).
 * Every document carries BOTH the study notes (`blocks`) and the solved
 * questions (`questionSections`), each field bi-lingual (en / ne).
 * Example: `see-sci-c1-en`, `see-sci-c1-ne`.
 */

export type Lang = "en" | "ne";

export interface Bilingual {
  en: string;
  ne: string;
}

export interface FsTable {
  headers: Bilingual[];
  rows: Bilingual[][];
}

export type FsBlock =
  | { type: "heading" | "paragraph"; text: Bilingual; image?: string }
  | { type: "list"; ordered: boolean; items: Bilingual[]; image?: string }
  | { type: "table"; table: FsTable; image?: string }
  | { type: "image"; url: string; caption?: Bilingual };

export interface FsQuestion {
  id: string;
  source: string;
  question: Bilingual;
  options?: Bilingual[];
  answer?: Bilingual;
  solution?: Bilingual;
  solutionTable?: FsTable;
  image?: string;
}

export interface FsQuestionSection {
  title: Bilingual;
  items: FsQuestion[];
}

export interface FsChapterDoc {
  chapterId: string;
  subjectId: string;
  number: number;
  classLevel: string;
  titleEn: string;
  titleNe: string;
  blocks: FsBlock[];
  questionSections: FsQuestionSection[];
  questionCount: number;
}

/* ------------------------------------------------------------------ *
 * Firestore REST (v1) value helpers
 * ------------------------------------------------------------------ */

type FNode = Record<string, unknown> | null | undefined;

function sVal(node: FNode): string | null {
  if (node && "stringValue" in node) return (node as { stringValue: string }).stringValue;
  return null;
}

function bVal(node: FNode): boolean {
  if (node && "booleanValue" in node) return (node as { booleanValue: boolean }).booleanValue;
  return false;
}

function iVal(node: FNode): number {
  if (node && "integerValue" in node) return Number((node as { integerValue: string }).integerValue);
  return 0;
}

function arr(node: FNode): FNode[] {
  if (node && "arrayValue" in node) {
    const values = (node as { arrayValue: { values?: FNode[] } }).arrayValue.values;
    return values ?? [];
  }
  return [];
}

function flds(node: FNode): Record<string, FNode> {
  if (node && "mapValue" in node) {
    return (node as { mapValue: { fields: Record<string, FNode> } }).mapValue.fields ?? {};
  }
  return {};
}

function parseLang(node: FNode): Bilingual {
  const f = flds(node);
  return { en: sVal(f["en"]) ?? "", ne: sVal(f["ne"]) ?? "" };
}

const IMAGE_URL_RE = /^https?:\/\/\S+\.(?:png|jpe?g|gif|webp|svg|avif)(?:\?\S*)?$/i;

function extractImage(fields: Record<string, FNode>): string | null {
  let found: string | null = null;
  function walk(node: FNode) {
    if (!node || found) return;
    if ("stringValue" in node) {
      const text = (node as { stringValue: string }).stringValue;
      if (IMAGE_URL_RE.test(text)) found = text;
      return;
    }
    if ("mapValue" in node) {
      for (const key of Object.keys((node as { mapValue: { fields: Record<string, FNode> } }).mapValue.fields)) {
        walk((node as { mapValue: { fields: Record<string, FNode> } }).mapValue.fields[key]);
      }
      return;
    }
    if ("arrayValue" in node) {
      (node as { arrayValue: { values?: FNode[] } }).arrayValue.values?.forEach(walk);
    }
  }
  walk({ mapValue: { fields } });
  return found;
}

function parseTable(node: FNode): FsTable {
  const f = flds(node);
  return {
    headers: arr(f["headers"]).map(parseLang),
    rows: arr(f["rows"]).map((row) => arr(flds(row)["cells"]).map(parseLang)),
  };
}

function parseBlock(node: FNode): FsBlock {
  const f = flds(node);
  const type = sVal(f["type"]) ?? "paragraph";
  if (type === "image") {
    return {
      type: "image",
      url: sVal(f["url"]) ?? "",
      caption: { en: sVal(f["captionEn"]) ?? "", ne: sVal(f["captionNe"]) ?? "" },
    };
  }
  if (type === "table") {
    return { type: "table", table: parseTable(node), image: extractImage(f) ?? undefined };
  }
  if (type === "list") {
    return {
      type: "list",
      ordered: bVal(f["ordered"]),
      items: arr(f["items"]).map(parseLang),
      image: extractImage(f) ?? undefined,
    };
  }
  return {
    type: type === "heading" ? "heading" : "paragraph",
    text: parseLang(node),
    image: extractImage(f) ?? undefined,
  };
}

function parseQuestion(node: FNode): FsQuestion {
  const f = flds(node);
  const q: FsQuestion = {
    id: sVal(f["id"]) ?? "",
    source: sVal(f["source"]) ?? "textbook",
    question: parseLang(f["question"]),
  };
  const options = arr(f["options"]).map(parseLang);
  if (options.length > 0) q.options = options;
  if (f["answer"]) q.answer = parseLang(f["answer"]);
  if (f["solution"]) q.solution = parseLang(f["solution"]);
  if (f["solutionTable"]) q.solutionTable = parseTable(f["solutionTable"]);
  const image = extractImage(f);
  if (image) q.image = image;
  return q;
}

function parseSection(node: FNode): FsQuestionSection {
  const f = flds(node);
  return {
    title: parseLang(f["section"]),
    items: arr(f["items"]).map(parseQuestion),
  };
}

/**
 * Science chapters 2+ store their solved questions inside `questionBlocks`
 * as a flat bilingual sequence:
 *   - a `heading` that is immediately followed by a `paragraph`/`table` = a
 *     QUESTION (the following paragraph/table is its answer),
 *   - a `heading` followed by another `heading` = a SECTION title.
 * `paragraph`s are answers (stripped of the "Answer:"/"उत्तर:" prefix),
 * `table`s are the answer grids of "Differentiate …" questions.
 */
function stripAnswerPrefix(text: Bilingual): Bilingual {
  return {
    en: text.en.replace(/^\s*Answer\s*[:–—-]?\s*/i, ""),
    ne: text.ne.replace(/^\s*उत्तर\s*[:–—-]?\s*/, ""),
  };
}

function stripQuestionPrefix(text: Bilingual): Bilingual {
  return {
    en: text.en.replace(/^\s*Q(?:[0-9]+)?[.:\s]\s*/i, ""),
    ne: text.ne.replace(/^\s*प्र[.।]?\s*\s*/, ""),
  };
}

function parseQuestionBlocks(nodes: FNode[]): FsQuestionSection[] {
  const blocks = nodes.map(parseBlock);
  const sections: FsQuestionSection[] = [];
  let current: FsQuestionSection | null = null;
  let qn = 0;

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === "heading") {
      const next = blocks[i + 1];
      const isQuestion = next !== undefined && (next.type === "paragraph" || next.type === "table");
      if (isQuestion) {
        if (current) {
          current.items.push({ id: `qb-q${qn++}`, source: "see", question: stripQuestionPrefix(b.text) });
        }
      } else if (b.text.en || b.text.ne) {
        current = { title: b.text, items: [] };
        sections.push(current);
      }
      continue;
    }
    if (current && current.items.length > 0 && (b.type === "paragraph" || b.type === "table")) {
      const last = current.items[current.items.length - 1];
      if (b.type === "table") {
        if (!last.solutionTable) last.solutionTable = b.table;
      } else {
        const text = stripAnswerPrefix(b.text);
        if (!text.en && !text.ne) continue;
        if (!last.answer) last.answer = text;
        else if (!last.solution) last.solution = text;
      }
    }
  }
  return sections.filter((s) => s.items.length > 0);
}

/* ------------------------------------------------------------------ *
 * English practice split
 * ------------------------------------------------------------------ *
 * English docs (grammar see-eng-g{1..14}, plus the writing doc
 * see-eng-w2) store their solved practice exercises INSIDE `blocks`,
 * appended after a heading matching "{topic} — Grammar Practice" as
 * repeated pairs of "Questions" / "Answers" headings followed by the
 * question / answer lists. Without splitting, those exercises render
 * inline inside the notes, so notes and solved questions are mixed.
 * Everything before the practice marker stays as notes and the paired
 * Questions/Answers lists are re-published as `questionSections` so the
 * solved-questions screen owns them.
 * ------------------------------------------------------------------ */

const ENGLISH_PRACTICE_MARKER_RE = /[—-]\s*(?:Grammar\s+)?Practice\s*$/i;
const ENGLISH_QUESTIONS_RE = /^Questions$/i;
const ENGLISH_ANSWERS_RE = /^Answers$/i;

function englishHeadingText(b: FsBlock): string {
  return b.type === "heading" ? (b.text.en || b.text.ne).trim() : "";
}

function englishListLines(b: FsBlock): string[] {
  if (b.type === "list") return b.items.map((it) => (it.en || it.ne).trim()).filter(Boolean);
  if (b.type === "paragraph") {
    const text = (b.text.en || b.text.ne).trim();
    return text ? [text] : [];
  }
  return [];
}

function englishPracticeTail(blocks: FsBlock[], start: number): FsQuestionSection[] {
  const sections: FsQuestionSection[] = [];
  let current: FsQuestionSection | null = null;
  let pendingQs: string[] = [];
  let pendingAns: string[] = [];
  let mode: "qlist" | "alist" | null = null;
  let qn = 0;

  const commit = () => {
    if (current) {
      const pairs = Math.min(pendingQs.length, pendingAns.length);
      for (let i = 0; i < pairs; i++) {
        current.items.push({
          id: `eng-q${qn++}`,
          source: "see",
          question: { en: pendingQs[i], ne: pendingQs[i] },
          solution: { en: pendingAns[i], ne: pendingAns[i] },
        });
      }
      for (let i = pairs; i < pendingQs.length; i++) {
        current.items.push({ id: `eng-q${qn++}`, source: "see", question: { en: pendingQs[i], ne: pendingQs[i] } });
      }
      for (let i = pairs; i < pendingAns.length; i++) {
        const last = current.items[current.items.length - 1];
        if (!last) continue;
        const extra = pendingAns[i];
        last.solution = last.solution
          ? { en: `${last.solution.en}\n${extra}`, ne: `${last.solution.ne}\n${extra}` }
          : { en: extra, ne: extra };
      }
    }
    pendingQs = [];
    pendingAns = [];
    mode = null;
  };

  for (let i = start; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === "heading") {
      const text = englishHeadingText(b);
      if (!text) continue;
      if (ENGLISH_QUESTIONS_RE.test(text)) {
        commit();
        mode = "qlist";
        continue;
      }
      if (ENGLISH_ANSWERS_RE.test(text)) {
        mode = "alist";
        continue;
      }
      commit();
      current = { title: { en: text, ne: text }, items: [] };
      sections.push(current);
      continue;
    }
    const lines = englishListLines(b);
    if (lines.length === 0) continue;
    if (mode === "qlist") pendingQs.push(...lines);
    else if (mode === "alist") pendingAns.push(...lines);
  }

  commit();
  return sections.filter((s) => s.items.length > 0);
}

function splitEnglishPractice(blocks: FsBlock[]): { notes: FsBlock[]; sections: FsQuestionSection[] } | null {
  let marker = -1;
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === "heading" && ENGLISH_PRACTICE_MARKER_RE.test((b.text.en || b.text.ne).trim())) {
      marker = i;
      break;
    }
  }
  if (marker < 0) return null;
  const tail = blocks.slice(marker);
  const hasQuestionLabels = tail.some(
    (b) => b.type === "heading" && ENGLISH_QUESTIONS_RE.test((b.text.en || b.text.ne).trim()),
  );
  const hasAnswerLabels = tail.some(
    (b) => b.type === "heading" && ENGLISH_ANSWERS_RE.test((b.text.en || b.text.ne).trim()),
  );
  if (!hasQuestionLabels || !hasAnswerLabels) return null;
  const sections = englishPracticeTail(blocks, marker + 1);
  if (sections.length === 0) return null;
  return { notes: blocks.slice(0, marker), sections };
}

export function parseChapterDoc(
  json: Record<string, unknown>,
  opts?: { nepali?: boolean; social?: boolean },
): FsChapterDoc {
  const f = (json["fields"] as Record<string, FNode>) ?? {};
  let blocks = arr(f["blocks"]).map(parseBlock);
  let sections = arr(f["questionSections"]).map(parseSection);
  if (sections.length === 0 && arr(f["questionBlocks"]).length > 0) {
    if (opts?.social) sections = parseSocialQuestionBlocks(arr(f["questionBlocks"]));
    else if (opts?.nepali) sections = parseNepaliQuestionBlocks(arr(f["questionBlocks"]));
    else sections = parseQuestionBlocks(arr(f["questionBlocks"]));
  }
  if (sections.length === 0) {
    const english = splitEnglishPractice(blocks);
    if (english) {
      blocks = english.notes;
      sections = english.sections;
    }
  }
  return {
    chapterId: sVal(f["chapterId"]) ?? "",
    subjectId: sVal(f["subjectId"]) ?? "",
    number: iVal(f["number"]) || 1,
    classLevel: sVal(f["classLevel"]) ?? "10",
    titleEn: sVal(f["titleEn"]) ?? "",
    titleNe: sVal(f["titleNe"]) ?? "",
    blocks,
    questionSections: sections,
    questionCount: sections.reduce((n, s) => n + s.items.length, 0),
  };
}

/* ------------------------------------------------------------------ *
 * Nepali questionBlocks
 * ------------------------------------------------------------------ *
 * The Nepali question bank (`questionBlocks`) is richer than Science's:
 *   - `heading` starting with "प्रश्न" is a QUESTION,
 *   - `heading` starting with "(" (e.g. "(क) प्रश्नहरू") is a nested
 *     note attached to the open question,
 *   - any other non-empty `heading` (e.g. "अभ्यास १ — शब्दभण्डार")
 *     starts a SECTION,
 *   - every `paragraph` / `list` / `table` after a question is part of
 *     that question's answer (steps, sample answers, grids, …).
 * Sections that carry only prose (no "प्रश्न" headings — e.g. "सुनाइ र
 * बोलाइ (नोट)") are surfaced as a single summary question.
 * ------------------------------------------------------------------ */

const NEPALI_QUESTION_RE = /^प्रश्न(?:[\s०-९0-9])/u;
const NEPALI_NESTED_RE = /^\(/u;
const NEPALI_LABEL_HEADINGS = new Set(["प्रश्नहरू", "उत्तरहरू", "प्रश्नहरू र उत्तरहरू"]);

function stripNepaliQuestionPrefix(text: Bilingual): Bilingual {
  return {
    en: text.en.replace(/^\s*प्रश्न\s*[०-९0-9]+[:.\s)\-—]+\s*/u, ""),
    ne: text.ne.replace(/^\s*प्रश्न\s*[०-९0-9]+[:.\s)\-—]+\s*/u, ""),
  };
}

function listToBullets(items: Bilingual[]): string[] {
  return items.map((it) => `• ${(it.en || it.ne).trim()}`);
}

function nepaliContentLines(b: FsBlock): { lines: string[]; table?: FsTable } {
  if (b.type === "paragraph") {
    const text = (b.text.en || b.text.ne).trim();
    return { lines: text ? [text] : [] };
  }
  if (b.type === "list") return { lines: listToBullets(b.items) };
  if (b.type === "table") return { lines: [], table: b.table };
  return { lines: [] };
}

function parseNepaliQuestionBlocks(nodes: FNode[]): FsQuestionSection[] {
  const blocks = nodes.map(parseBlock);
  const sections: FsQuestionSection[] = [];
  let current: FsQuestionSection | null = null;
  let open: FsQuestion | null = null;
  let pendingLines: string[] = [];
  let pendingTable: FsTable | undefined;
  let pendingTableCount = 0;
  let qn = 0;

  const newQuestion = (question: Bilingual): FsQuestion => ({ id: `qb-q${qn++}`, source: "see", question });

  const attachLines = (lines: string[], table?: FsTable) => {
    if (open) {
      if (lines.length) {
        const joined = lines.join("\n");
        open.solution = open.solution
          ? { en: `${open.solution.en}\n${joined}`, ne: `${open.solution.ne}\n${joined}` }
          : { en: joined, ne: joined };
      }
      if (table) open.solutionTable = open.solutionTable ?? table;
      return;
    }
    if (current) {
      pendingLines = pendingLines.concat(lines);
      if (table) {
        pendingTableCount += 1;
        pendingTable = pendingTable ?? table;
      }
    }
  };

  const flushPending = () => {
    if (!current || current.items.length > 0 || pendingLines.length === 0) {
      pendingLines = [];
      pendingTable = undefined;
      pendingTableCount = 0;
      return;
    }
    const q: FsQuestion = newQuestion(current.title);
    if (pendingLines.length) q.solution = { en: pendingLines.join("\n"), ne: pendingLines.join("\n") };
    if (pendingTableCount > 1) {
      if (q.solution) q.solution = { en: `${q.solution.en}\n\nयी उत्तरहरू तालिकामा दिइएका छन्।`, ne: `${q.solution.ne}\n\nयी उत्तरहरू तालिकामा दिइएका छन्।` };
    }
    if (pendingTable) q.solutionTable = pendingTable;
    current.items.push(q);
    pendingLines = [];
    pendingTable = undefined;
    pendingTableCount = 0;
  };

  for (const b of blocks) {
    if (b.type === "heading") {
      const text = (b.text.en || b.text.ne).trim();
      if (!text) continue;
      if (NEPALI_QUESTION_RE.test(text)) {
        if (!current) {
          current = { title: { en: "अभ्यास", ne: "अभ्यास" }, items: [] };
          sections.push(current);
        }
        open = newQuestion(stripNepaliQuestionPrefix(b.text));
        current.items.push(open);
        continue;
      }
      if (NEPALI_NESTED_RE.test(text) || NEPALI_LABEL_HEADINGS.has(text)) {
        attachLines([text]);
        continue;
      }
      flushPending();
      open = null;
      current = { title: b.text, items: [] };
      sections.push(current);
      continue;
    }
    if (b.type === "image") continue;
    const { lines, table } = nepaliContentLines(b);
    if (open) {
      attachLines(lines, table);
    } else if (current) {
      attachLines(lines, table);
    }
  }

  flushPending();
  return sections.filter((s) => s.items.length > 0);
}

/* ------------------------------------------------------------------ *
 * Social Studies questionBlocks
 * ------------------------------------------------------------------ *
 * Social Studies lessons store solved questions in `questionBlocks`
 * using two interchangeable grammars across the 74 lessons (2–4 lines):
 *   1. List-pair grammar (units 1, 2, 5–7, 9–10):
 *        heading "अभ्यास" → heading "प्रश्नहरू" → list [Q₁..Qₙ] →
 *        heading "उत्तरहरू" → list [A₁..Aₙ] → … (repeated per exercise,
 *        plus "थप SEE अभ्यास" blocks). Questions and answers pair by
 *        their list index.
 *   2. Heading+prose grammar (units 3, 4, 8):
 *        heading "प्रश्न १: …" → paragraph/table (the model answer) →
 *        heading "प्रश्न २: …" → … 
 * The trailing "SEE का लागि अति महत्वपूर्ण क्षेत्र" list has no Q/A
 * pairing; it is surfaced as a single summary question with bullets.
 * ------------------------------------------------------------------ */

const SOCIAL_QUESTION_RE = /^\s*प्रश्न\s*[०-९0-9]+[:.\s)\u0964\-—]*\s*/u;
const SOCIAL_LABEL_HEADINGS = new Set(["प्रश्नहरू", "उत्तरहरू", "प्रश्नहरू र उत्तरहरू"]);

function stripSocialQuestionPrefix(text: string): string {
  return text.replace(SOCIAL_QUESTION_RE, "").trim();
}

function socialContentLines(b: FsBlock): string[] {
  if (b.type === "list") return b.items.map((it) => (it.ne || it.en).trim()).filter(Boolean);
  if (b.type === "paragraph") {
    const text = (b.text.ne || b.text.en).trim();
    return text ? [text] : [];
  }
  return [];
}

function parseSocialQuestionBlocks(nodes: FNode[]): FsQuestionSection[] {
  const blocks = nodes.map(parseBlock);
  const sections: FsQuestionSection[] = [];
  let current: FsQuestionSection | null = null;
  let pendingQs: string[] = [];
  let pendingAns: Bilingual[] = [];
  let mode: "qlist" | "alist" | null = null;
  let open: FsQuestion | null = null;
  let prose: string[] = [];
  let qn = 0;

  const pushQuestion = (fullText: string) => {
    if (!current) return;
    const text = stripSocialQuestionPrefix(fullText);
    const question: FsQuestion = { id: `qb-q${qn++}`, source: "see", question: { en: text, ne: text } };
    current.items.push(question);
    open = question;
  };

  const commit = () => {
    if (!current) return;
    const pairs = Math.min(pendingQs.length, pendingAns.length);
    for (let i = 0; i < pairs; i++) {
      const answer = (pendingAns[i].ne || pendingAns[i].en).trim();
      current.items.push({
        id: `qb-q${qn++}`,
        source: "see",
        question: { en: stripSocialQuestionPrefix(pendingQs[i]), ne: stripSocialQuestionPrefix(pendingQs[i]) },
        solution: { en: answer, ne: answer },
      });
    }
    for (let i = pairs; i < pendingQs.length; i++) {
      current.items.push({
        id: `qb-q${qn++}`,
        source: "see",
        question: { en: stripSocialQuestionPrefix(pendingQs[i]), ne: stripSocialQuestionPrefix(pendingQs[i]) },
      });
    }
    for (let i = pairs; i < pendingAns.length; i++) {
      const last = current.items[current.items.length - 1];
      if (!last) continue;
      const answer = (pendingAns[i].ne || pendingAns[i].en).trim();
      last.solution = last.solution
        ? { en: `${last.solution.en}\n\n${answer}`, ne: `${last.solution.ne}\n\n${answer}` }
        : { en: answer, ne: answer };
    }
    if (prose.length > 0 && current.items.length === 0) {
      const title = (current.title.ne || current.title.en).trim();
      current.items.push({
        id: `qb-q${qn++}`,
        source: "see",
        question: { en: title, ne: title },
        solution: {
          en: prose.map((line) => `• ${line}`).join("\n"),
          ne: prose.map((line) => `• ${line}`).join("\n"),
        },
      });
    }
    pendingQs = [];
    pendingAns = [];
    mode = null;
    open = null;
    prose = [];
  };

  const attachToOpen = (b: FsBlock): boolean => {
    if (!open || !current) return false;
    if (b.type === "table") {
      open.solutionTable = open.solutionTable ?? b.table;
      return true;
    }
    const lines = socialContentLines(b).filter(Boolean);
    if (lines.length === 0) return true;
    const joined = lines.join("\n");
    open.solution = open.solution
      ? { en: `${open.solution.en}\n${joined}`, ne: `${open.solution.ne}\n${joined}` }
      : { en: joined, ne: joined };
    return true;
  };

  for (const b of blocks) {
    if (b.type === "heading") {
      const text = (b.text.ne || b.text.en).trim();
      if (!text) continue;
      if (SOCIAL_QUESTION_RE.test(text)) {
        if (!current) {
          current = { title: { en: "अभ्यास", ne: "अभ्यास" }, items: [] };
          sections.push(current);
        }
        commit();
        pushQuestion(text);
        continue;
      }
      if (SOCIAL_LABEL_HEADINGS.has(text)) {
        mode = text === "उत्तरहरू" ? "alist" : "qlist";
        open = null;
        continue;
      }
      if (text.endsWith("प्रश्नहरू")) {
        commit();
        current = { title: { en: text, ne: text }, items: [] };
        sections.push(current);
        mode = "qlist";
        continue;
      }
      if (text.endsWith("उत्तरहरू")) {
        mode = "alist";
        open = null;
        continue;
      }
      commit();
      current = { title: { en: text, ne: text }, items: [] };
      sections.push(current);
      continue;
    }
    if (attachToOpen(b)) continue;
    if (b.type === "table") continue;
    if (b.type === "list") {
      const lines = b.items.map((it) => (it.ne || it.en).trim()).filter(Boolean);
      if (mode === "qlist") {
        pendingQs.push(...lines);
        continue;
      }
      if (mode === "alist") {
        pendingAns.push(...b.items);
        continue;
      }
      if (lines.length > 0) prose.push(...lines);
      continue;
    }
    if (b.type === "image") continue;
    const text = (b.text.ne || b.text.en).trim();
    if (!text) continue;
    if (mode === "qlist") {
      pendingQs.push(text);
      continue;
    }
    if (mode === "alist") {
      pendingAns.push(b.text);
      continue;
    }
    prose.push(text);
  }

  commit();
  return sections.filter((s) => s.items.length > 0);
}

/* ------------------------------------------------------------------ *
 * Public fetch helpers (server-only usage)
 * ------------------------------------------------------------------ */

function docUrl(docId: string): string {
  return `${FIRESTORE_REST_BASE}/chapters/${encodeURIComponent(docId)}?key=${FIREBASE_API_KEY}`;
}

export async function getChapterDoc(
  docId: string,
  opts?: { nepali?: boolean; social?: boolean },
): Promise<FsChapterDoc | null> {
  try {
    const local = readLocalChapterFile(docId);
    if (local) return parseChapterDoc({ fields: local }, opts);
    const res = await fetch(docUrl(docId), { cache: "no-store" });
    if (!res.ok) return null;
    const json = (await res.json()) as Record<string, unknown>;
    return parseChapterDoc(json, opts);
  } catch {
    return null;
  }
}

/**
 * Some MySQL-seeded chapter docs are shipped as static JSON inside the repo
 * (`science-questions/<folder>/see-math-chN-{en|ne}.json`, written by the
 * matching `scripts/seed-math-chN.mjs`). When present, they are served
 * locally in the exact Firestore wire shape, so no remote fetch happens.
 */
function readLocalChapterFile(docId: string): Record<string, FNode> | null {
  try {
    const base = path.join(process.cwd(), "science-questions");
    const candidates = [path.join(base, docId, `${docId}.json`)];
    const match = docId.match(/^see-math-ch(\d+)-(en|ne)$/);
    if (match) {
      candidates.unshift(path.join(base, `see-math-ch${match[1]}`, `${docId}.json`));
      candidates.unshift(path.join(base, `see-math-ch${match[1]}`, `see-math-ch${match[1]}-en.json`));
    }
    for (const file of candidates) {
      if (!fs.existsSync(file)) continue;
      const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as unknown;
      if (!parsed || typeof parsed !== "object" || !("blocks" in (parsed as object))) return null;
      return parsed as Record<string, FNode>;
    }
    return null;
  } catch {
    return null;
  }
}

/** Science chapters exist twice per unit — English and नेपाली (same merged data). */
export async function getScienceChapter(number: number): Promise<{ en: FsChapterDoc | null; ne: FsChapterDoc | null }> {
  const [en, ne] = await Promise.all([
    getChapterDoc(`see-sci-c${number}-en`),
    getChapterDoc(`see-sci-c${number}-ne`),
  ]);
  return { en, ne };
}

/**
 * Fetch the live Firestore chapter for a subject.
 *  - science: bilingual docs `see-sci-c{n}-{en|ne}`
 *  - nepali:  a single `see-nep-ch{n}` document (same data for both slots),
 *             parsed with the Nepali questionBlock grammar.
 *  - english: single English docs `see-eng-g{n}` (grammar) and `see-eng-w{n}`
 *             (writing), resolved by slug because the g/w numbering both start at 1.
 *  - computer-science: single English docs `see-cs-ch{n}`; chapter 4 is split
 *             across six topic docs `see-cs-ch4-1..6`, resolved by slug.
 *  - social-studies: single Nepali docs `see-soc-u{n}-l{m}` (many lessons per
 *             unit), resolved by slug, parsed with the Social questionBlocks
 *             grammar (list-pairs and "प्रश्न १: …" heading+prose sections).
 *  - mathematics: bilingual docs `see-math-ch{n}-{en|ne}` (same merged data).
 */
export async function getSubjectChapter(
  subjectSlug: string,
  number: number,
  chapterSlug?: string,
): Promise<{ en: FsChapterDoc | null; ne: FsChapterDoc | null }> {
  if (subjectSlug === "social-studies") {
    if (!chapterSlug) return { en: null, ne: null };
    const docId = SOC_LESSON_TO_DOC[chapterSlug];
    if (!docId) return { en: null, ne: null };
    const doc = await getChapterDoc(docId, { social: true });
    return { en: doc, ne: doc };
  }
  if (subjectSlug === "english") {
    if (!chapterSlug) return { en: null, ne: null };
    const docId = ENG_SLUG_TO_DOC[chapterSlug];
    if (!docId) return { en: null, ne: null };
    const doc = await getChapterDoc(docId);
    return { en: doc, ne: doc };
  }
  if (subjectSlug === "computer-science") {
    let docId = `see-cs-ch${number}`;
    if (number === 4 && chapterSlug) {
      const part = CS_CH4_PARTS[chapterSlug];
      if (!part) return { en: null, ne: null };
      docId = `see-cs-ch4-${part}`;
    }
    const doc = await getChapterDoc(docId);
    return { en: doc, ne: doc };
  }
  if (subjectSlug === "nepali") {
    const doc = await getChapterDoc(`see-nep-ch${number}`, { nepali: true });
    return { en: doc, ne: doc };
  }
  if (subjectSlug === "mathematics") {
    const [en, ne] = await Promise.all([
      getChapterDoc(`see-math-ch${number}-en`),
      getChapterDoc(`see-math-ch${number}-ne`),
    ]);
    return { en, ne };
  }
  return getScienceChapter(number);
}

const ENG_SLUG_TO_DOC: Record<string, string> = {
  "articles": "see-eng-g1",
  "prepositions": "see-eng-g2",
  "tense": "see-eng-g3",
  "connectives": "see-eng-g4",
  "question-tags": "see-eng-g5",
  "reported-speech": "see-eng-g6",
  "voice": "see-eng-g7",
  "conditional-sentences": "see-eng-g8",
  "subject-verb-agreement": "see-eng-g9",
  "interrogation-and-negation": "see-eng-g10",
  "causative-verbs": "see-eng-g11",
  "modals": "see-eng-g12",
  "relative-pronouns": "see-eng-g13",
  "adjectives-and-adverbs": "see-eng-g14",
  "paragraph": "see-eng-w1",
  "description-of-labels-charts-diagrams": "see-eng-w2",
  "set-of-instructions": "see-eng-w3",
  "recipe": "see-eng-w4",
  "advertisement": "see-eng-w5",
  "notice": "see-eng-w6",
  "set-of-rules-and-regulations": "see-eng-w7",
  "news-story": "see-eng-w8",
  "skeleton-story": "see-eng-w9",
  "message-of-condolence": "see-eng-w10",
  "message-of-congratulations": "see-eng-w11",
  "invitation-letter": "see-eng-w12",
  "thank-you-letter": "see-eng-w13",
  "biography": "see-eng-w14",
  "paragraph-free": "see-eng-w15",
  "leave-application": "see-eng-w16",
  "job-application": "see-eng-w17",
  "dialogue": "see-eng-w18",
  "letter": "see-eng-w19",
  "email": "see-eng-w20",
  "short-essay": "see-eng-w21",
  "diary": "see-eng-w22",
  "news-paper-article": "see-eng-w23",
  "book-and-film-review": "see-eng-w24",
};

const CS_CH4_PARTS: Record<string, number> = {
  "python-basics": 1,
  "python-functions": 2,
  "python-modules": 3,
  "python-error-handling": 4,
  "python-file-handling": 5,
  "python-data-visualization": 6,
};

/** Lessons per Social Studies unit (SEE, Class 10). */
const SOC_UNIT_LESSONS: Record<string, number> = {
  "1": 4,
  "2": 4,
  "3": 8,
  "4": 7,
  "5": 8,
  "6": 12,
  "7": 10,
  "8": 9,
  "9": 6,
  "10": 6,
};

const SOC_LESSON_LABELS = "abcdefghijklmnopqrstuvwxyz";

/** Slug `social-u{n}-l{letter}` → Firestore doc `see-soc-u{n}-l{m}`. */
const SOC_LESSON_TO_DOC: Record<string, string> = {};
for (const unit of Object.keys(SOC_UNIT_LESSONS)) {
  for (let lesson = 1; lesson <= SOC_UNIT_LESSONS[unit]; lesson++) {
    SOC_LESSON_TO_DOC[`social-u${unit}-l${SOC_LESSON_LABELS[lesson - 1]}`] = `see-soc-u${unit}-l${lesson}`;
  }
}

export async function getScienceChapterOne(): Promise<{ en: FsChapterDoc | null; ne: FsChapterDoc | null }> {
  return getScienceChapter(1);
}

/** All Social Studies lesson doc-id recipes, grouped by unit slug `u{n}`. */
export function listSocialLessonIds(): { unit: string; slug: string; docId: string }[] {
  const out: { unit: string; slug: string; docId: string }[] = [];
  for (const unit of Object.keys(SOC_UNIT_LESSONS)) {
    for (let lesson = 1; lesson <= SOC_UNIT_LESSONS[unit]; lesson++) {
      const letter = SOC_LESSON_LABELS[lesson - 1];
      out.push({
        unit,
        slug: `social-u${unit}-l${letter}`,
        docId: SOC_LESSON_TO_DOC[`social-u${unit}-l${letter}`],
      });
    }
  }
  return out;
}