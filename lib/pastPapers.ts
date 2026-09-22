import fs from "node:fs";
import path from "node:path";
import type { Bilingual, FsBlock, FsTable } from "@/lib/firebase/chapterDoc";
import { mockSubjects } from "@/lib/mock/mockSubjects";
import type { SearchResult } from "@/lib/types";

/**
 * Past-paper JSON lives on disk under a per-subject questions directory
 * (e.g. `science-questions/<folder>/`) as:
 *   - `*-questions.json`  → question paper document (docType: "questionPaper")
 *   - `*-answers.json`    → answer key document     (docType: "answerKey")
 * Every text value is bilingual { en, ne }; diagrams are plain image URLs
 * (typically hosted on Cloudinary) in each item's `image.url` field.
 */

const QUESTION_DIRS = ["science-questions", "english-questions"].map((d) => path.join(process.cwd(), d));
const QUESTION_FILE_RE = /-questions\.json$/;
const ANSWER_FILE_RE = /-answers\.json$/;

/**
 * Diagrams ship on Cloudinary under the `see-papers/` folder (public id
 * `see-papers/<subfolder>/<file>.png`) while JSON files reference them with
 * a `YOUR_STORAGE_BUCKET` placeholder URL. Rewrite those to the Cloudinary
 * delivery URL so images render directly from the CDN (never from disk).
 */
const CLOUDINARY_PAPERS_BASE = "https://res.cloudinary.com/q5f7r5xt/image/upload/see-papers";

export function resolveImageUrl(folderId: string, url?: string): string | undefined {
  if (!url) return url;
  const match = url.match(/YOUR_STORAGE_BUCKET\/(.+)$/i);
  if (!match) return url;
  return `${CLOUDINARY_PAPERS_BASE}/${match[1].replace(/\.[a-z0-9]+$/i, "")}`;
}

function rewriteImageUrls(doc: PastPaperDoc, folderId: string): PastPaperDoc {
  return {
    ...doc,
    blocks: doc.blocks.map((b) => {
      if (b.type === "image") return { ...b, url: resolveImageUrl(folderId, b.url) ?? b.url };
      if (b.image) return { ...b, image: resolveImageUrl(folderId, b.image) ?? b.image };
      return b;
    }),
    questionSections: doc.questionSections.map((s) => ({
      ...s,
      items: s.items.map((it) => ({
        ...it,
        image: it.image ? { ...it.image, url: resolveImageUrl(folderId, it.image.url) ?? it.image.url } : it.image,
      })),
    })),
  };
}

export interface PastPaperImage {
  url: string;
  caption?: Bilingual;
}

export interface PastPaperItem {
  id: string;
  questionNumber?: string;
  section?: string;
  marks?: number;
  source?: string;
  /** Question stem. Absent on answer-key items, which only carry the answer/solution. */
  question?: Bilingual;
  /** Reading passage / stimulus text that precedes the question (English papers). */
  passage?: Bilingual;
  options?: Bilingual[];
  image?: PastPaperImage;
  answer?: Bilingual;
  solution?: Bilingual;
  /** Full model answer for writing tasks (notice/story/conversation/letter). */
  modelAnswer?: Bilingual;
  correctOption?: string;
  solutionTable?: FsTable;
  /** Table given in the question stem (e.g. a statistics frequency table). */
  table?: FsTable;
  /** Program listing printed in the question stem (Computer Science). */
  code?: string;
  /** Language of `code` (e.g. "QBASIC", "C"). */
  codeLanguage?: string;
  /** Solution program from the answer key (Computer Science). Kept separate from
   *  `code` so a printed program in the question is never overwritten by the worked one. */
  answerCode?: string;
  /** Choice label when an item is one alternative of a grouped question. */
  altLabel?: string;
  /** Group id linking alternative items (e.g. "q10"). */
  alternativeGroup?: string;
  /** Transcription/OCR caveat attached to a printed excerpt. */
  ocrFlag?: string;
}

export interface PastPaperSection {
  title: Bilingual;
  instructions?: Bilingual;
  items: PastPaperItem[];
}

export interface PastPaperDoc {
  chapterId: string;
  subjectId: string;
  classLevel?: string;
  province?: string;
  examBoard?: string;
  examYear?: string;
  paperCode?: string;
  fullMarks?: number;
  timeAllowed?: string;
  docType: "questionPaper" | "answerKey";
  linkedQuestionPaperId?: string;
  titleEn: string;
  titleNe: string;
  sourceNote?: Bilingual;
  answerLanguageLevelNote?: Bilingual;
  blocks: FsBlock[];
  questionSections: PastPaperSection[];
}

export interface PastPaper {
  folderId: string;
  question: PastPaperDoc;
  answer: PastPaperDoc | null;
}

export function listPastPaperFolders(): string[] {
  const seen = new Set<string>();
  const folders: string[] = [];
  for (const root of QUESTION_DIRS) {
    try {
      for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
        if (!entry.isDirectory() || entry.name.startsWith(".") || seen.has(entry.name)) continue;
        seen.add(entry.name);
        folders.push(entry.name);
      }
    } catch {
      /* directory may not exist for every subject yet */
    }
  }
  return folders;
}

function resolvePaperDir(folderId: string): string | null {
  if (!folderId || /[\\/]/.test(folderId) || folderId.includes("..")) return null;
  for (const root of QUESTION_DIRS) {
    const candidate = path.join(root, folderId);
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

function readJson<T>(file: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as T;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ *
 * Legacy / alternative seed schema.
 *
 * Some uploaded papers predate the canonical bilingual schema and use
 * plain strings + a reading `passage` on each item (English papers):
 *   - questions doc: `title`, `questionSections[].items[].question|passage`
 *   - answers doc:   `answerSections[].items[].answer|solution|solutionTable`
 *                    where solutionTable rows are `{ statement, evidence, verdict }`
 *   - blocks:        `{ heading, paragraph }` (no `type` field)
 * These are normalised into the canonical PastPaperDoc shape at load time.
 * ------------------------------------------------------------------ */

type LegacyAny = Record<string, unknown>;

function toBi(v: unknown): Bilingual {
  if (v && typeof v === "object" && !Array.isArray(v)) {
    const o = v as Record<string, unknown>;
    return { en: String(o.en ?? ""), ne: String(o.ne ?? "") };
  }
  const s = v == null ? "" : String(v);
  return { en: s, ne: s };
}

function toFsTable(t: unknown): FsTable {
  if (t && typeof t === "object" && !Array.isArray(t)) {
    const o = t as { headers?: unknown[]; rows?: unknown[][] };
    if (Array.isArray(o.headers) && Array.isArray(o.rows)) {
      return {
        headers: o.headers.map(toBi),
        rows: o.rows.map((r) => (Array.isArray(r) ? r.map(toBi) : [toBi(r)])),
      };
    }
  }
  if (Array.isArray(t)) {
    const keys = t.length > 0 && t[0] && typeof t[0] === "object" ? Object.keys(t[0] as Record<string, unknown>) : [];
    return {
      headers: keys.map((k) => toBi(k)),
      rows: t.map((row) =>
        row && typeof row === "object" && !Array.isArray(row)
          ? keys.map((k) => toBi((row as Record<string, unknown>)[k]))
          : [toBi(row)],
      ),
    };
  }
  return { headers: [], rows: [] };
}

function normalizeBlocks(blocks: unknown): FsBlock[] {
  if (!Array.isArray(blocks)) return [];
  const out: FsBlock[] = [];
  for (const b of blocks) {
    if (b && typeof b === "object") {
      const o = b as LegacyAny;
      if ("heading" in o || "paragraph" in o) {
        if (o.heading) out.push({ type: "heading", text: toBi(o.heading) });
        if (o.paragraph) out.push({ type: "paragraph", text: toBi(o.paragraph) });
      } else if ("type" in o) {
        out.push(b as FsBlock);
      }
    }
  }
  return out;
}

function isLegacyDoc(doc: LegacyAny | null): boolean {
  if (!doc || typeof doc !== "object") return false;
  return doc.docType == null && typeof doc.title === "string";
}

function normalizeLegacy(doc: LegacyAny, isAnswer: boolean): PastPaperDoc {
  const rawSections = (isAnswer ? doc.answerSections : doc.questionSections) ?? [];
  const toItem = (it: LegacyAny): PastPaperItem => ({
    id: String(it.id ?? ""),
    questionNumber: it.questionNumber ? String(it.questionNumber) : undefined,
    section: it.section ? String(it.section) : undefined,
    marks: typeof it.marks === "number" ? it.marks : undefined,
    source: it.source ? String(it.source) : undefined,
    question: it.question ? toBi(it.question) : undefined,
    passage: it.passage ? toBi(it.passage) : undefined,
    answer: it.answer ? toBi(it.answer) : undefined,
    solution: it.solution ? toBi(it.solution) : undefined,
    modelAnswer: it.modelAnswer ? toBi(it.modelAnswer) : undefined,
    solutionTable: it.solutionTable ? toFsTable(it.solutionTable) : undefined,
    code: it.code ? String(it.code) : undefined,
    codeLanguage: it.codeLanguage ? String(it.codeLanguage) : undefined,
    answerCode: it.answerCode ? String(it.answerCode) : undefined,
    altLabel: it.altLabel ? String(it.altLabel) : undefined,
    alternativeGroup: it.alternativeGroup ? String(it.alternativeGroup) : undefined,
    ocrFlag: it.ocrFlag ? String(it.ocrFlag) : undefined,
  });
  const questionSections: PastPaperSection[] = (Array.isArray(rawSections) ? rawSections : []).map((s: LegacyAny) => ({
    title: toBi(s.title ?? ""),
    instructions: s.instructions ? toBi(s.instructions) : undefined,
    items: (Array.isArray(s.items) ? s.items : []).map(toItem),
  }));
  const chapterId = String(doc.chapterId ?? "");
  return {
    chapterId,
    subjectId: String(doc.subjectId ?? ""),
    classLevel: doc.classLevel ? String(doc.classLevel) : undefined,
    province: doc.province ? String(doc.province) : undefined,
    examBoard: doc.examBoard ? String(doc.examBoard) : undefined,
    examYear: doc.examYear ? String(doc.examYear) : undefined,
    paperCode: doc.paperCode ? String(doc.paperCode) : undefined,
    fullMarks: typeof doc.fullMarks === "number" ? doc.fullMarks : undefined,
    timeAllowed: doc.timeAllowed ? String(doc.timeAllowed) : undefined,
    docType: isAnswer ? "answerKey" : "questionPaper",
    linkedQuestionPaperId: isAnswer ? String(doc.linkedQuestionPaperId ?? chapterId) : undefined,
    titleEn: String(doc.title ?? ""),
    titleNe: String(doc.title ?? ""),
    sourceNote: toBi(doc.sourceNote ?? ""),
    blocks: normalizeBlocks(doc.blocks),
    questionSections,
  };
}

export function getPastPaper(folderId: string): PastPaper | null {
  const dir = resolvePaperDir(folderId);
  if (!dir) return null;
  let questionFile = "";
  let answerFile = "";
  try {
    for (const file of fs.readdirSync(dir)) {
      if (QUESTION_FILE_RE.test(file)) questionFile = file;
      else if (ANSWER_FILE_RE.test(file)) answerFile = file;
    }
  } catch {
    return null;
  }
  if (!questionFile) return null;
  const question = readJson<LegacyAny>(path.join(dir, questionFile));
  if (!question) return null;
  const answer = answerFile ? readJson<LegacyAny>(path.join(dir, answerFile)) : null;
  const questionDoc = isLegacyDoc(question) ? normalizeLegacy(question, false) : (question as unknown as PastPaperDoc);
  const answerDoc = answer
    ? isLegacyDoc(answer)
      ? normalizeLegacy(answer, true)
      : (answer as unknown as PastPaperDoc)
    : null;
  return {
    folderId,
    question: rewriteImageUrls(questionDoc, folderId),
    answer: answerDoc ? rewriteImageUrls(answerDoc, folderId) : null,
  };
}

export function getAllPastPapers(): PastPaper[] {
  return listPastPaperFolders()
    .map(getPastPaper)
    .filter((p): p is PastPaper => p !== null);
}

/** Server-side search index entries for every past paper on disk. */
export function getPastPaperSearchResults(): SearchResult[] {
  const out: SearchResult[] = [];
  const seen = new Set<string>();
  for (const folderId of listPastPaperFolders()) {
    if (seen.has(folderId)) continue;
    seen.add(folderId);
    const paper = getPastPaper(folderId);
    if (!paper) continue;
    const d = paper.question;
    const title = d.titleEn || folderId;
    out.push({
      id: `paper-${folderId}`,
      type: "pastpaper",
      title,
      snippet: [subjectName(d.subjectId), d.province ? `Province: ${d.province}` : "", d.examYear ? `SEE ${d.examYear}` : ""].filter(Boolean).join(" · "),
      subjectSlug: d.subjectId,
      href: `/past-papers/${folderId}`,
      keywords: wordsOf(title).concat(d.titleNe ? wordsOf(d.titleNe) : [], wordsOf(d.subjectId), wordsOf(d.chapterId), wordsOf(d.province), ["see", "past paper", "board exam", "question paper"]),
    });
  }
  return out;
}

function wordsOf(value: string | undefined | null): string[] {
  return (value ?? "").split(/\W+/).filter(Boolean);
}

export function subjectName(subjectId: string): string {
  const found = mockSubjects.find((s) => s.slug === subjectId);
  if (found) return found.name;
  return subjectId
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function subjectColor(subjectId: string): string {
  return mockSubjects.find((s) => s.slug === subjectId)?.accentColor ?? "#4B4FF2";
}

export function totalQuestions(doc: PastPaperDoc): number {
  return doc.questionSections.reduce((n, s) => n + s.items.length, 0);
}