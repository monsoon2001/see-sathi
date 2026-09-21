import fs from "node:fs";
import path from "node:path";
import type { Bilingual } from "@/lib/firebase/chapterDoc";

/**
 * Chapter-content JSON lives under `science-questions/<folder>/` as:
 *   - `*-notes.json`    → notes + practice questions   (chapter library)
 *   - `*-answers.json`  → step-by-step solutions for those practice questions
 * Math is embedded as LaTeX between `$…$` delimiters and rendered with KaTeX.
 * Diagrams ship as PNGs anywhere inside the folder (e.g. `math-diagrams/`) and
 * are referenced by `imageId` (URL resolved at load time to a local route).
 */

const CHAPTERS_DIR = path.join(process.cwd(), "science-questions");
const NOTES_FILE_RE = /-notes\.json$/;
const ANSWERS_FILE_RE = /-answers\.json$/;

export interface MathTextBlock {
  type: "text";
  text: Bilingual;
}

export interface MathFormulaBlock {
  type: "formula";
  label?: Bilingual;
  expression: string;
}

export interface MathListBlock {
  type: "list";
  items: Bilingual[];
}

export interface MathImageBlock {
  type: "image";
  imageId: string;
  caption?: Bilingual;
  altText?: Bilingual;
}

export interface MathExampleStep {
  step: number;
  text: Bilingual;
}

export interface MathExampleBlock {
  type: "example";
  problem: Bilingual;
  solutionSteps: MathExampleStep[];
  finalAnswer: Bilingual;
}

export type MathBlock = MathTextBlock | MathFormulaBlock | MathListBlock | MathImageBlock | MathExampleBlock;

export interface MathSection {
  sectionId: string;
  title: Bilingual;
  content: MathBlock[];
}

export interface MathPracticePart {
  partId: string;
  text: Bilingual;
  marks?: number;
}

export interface MathPracticeQuestion {
  questionId: string;
  type: "single" | "multi-part";
  text?: Bilingual;
  marks?: number;
  marksTotal?: number;
  parts?: MathPracticePart[];
  referenceImageId?: string;
}

export interface MathImageRecord {
  imageId: string;
  status?: string;
  url?: string | null;
  altText?: Bilingual;
  caption?: Bilingual;
}

export interface MathNotesDoc {
  schemaVersion?: string;
  chapterId: string;
  chapterNumber?: number;
  subject?: string;
  grade?: number;
  title: Bilingual;
  estimatedPeriods?: number;
  sections: MathSection[];
  practiceQuestions: MathPracticeQuestion[];
  images?: MathImageRecord[];
}

export interface MathAnswerStep {
  step: number;
  text: Bilingual;
}

export interface MathAnswerPart {
  partId: string;
  solutionSteps: MathAnswerStep[];
  finalAnswer?: Bilingual;
  marks?: number;
}

export interface MathAnswerItem {
  questionId: string;
  type: "single" | "multi-part";
  solutionSteps?: MathAnswerStep[];
  finalAnswer?: Bilingual;
  parts?: MathAnswerPart[];
  marks?: number;
  marksTotal?: number;
  referenceImageId?: string;
}

export interface MathAnswersDoc {
  schemaVersion?: string;
  chapterId: string;
  chapterNumber?: number;
  answers: MathAnswerItem[];
}

export interface MathChapter {
  folderId: string;
  notes: MathNotesDoc;
  answers: MathAnswersDoc | null;
  /** imageId → local serving URL */
  imageUrls: Record<string, string>;
}

function readJson<T>(file: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as T;
  } catch {
    return null;
  }
}

export function resolveImageUrl(folderId: string, imageId?: string): string | undefined {
  if (!imageId) return undefined;
  return `https://res.cloudinary.com/q5f7r5xt/image/upload/see-papers/${encodeURIComponent(folderId)}/${encodeURIComponent(imageId)}`;
}

export function getMathChapter(folderId: string): MathChapter | null {
  const dir = path.join(CHAPTERS_DIR, folderId);
  let notesFile = "";
  let answersFile = "";
  try {
    for (const file of fs.readdirSync(dir)) {
      if (NOTES_FILE_RE.test(file)) notesFile = file;
      else if (ANSWERS_FILE_RE.test(file)) answersFile = file;
    }
  } catch {
    return null;
  }
  if (!notesFile) return null;
  const notes = readJson<MathNotesDoc>(path.join(dir, notesFile));
  if (!notes) return null;
  const answers = answersFile ? readJson<MathAnswersDoc>(path.join(dir, answersFile)) : null;

  const imageUrls: Record<string, string> = {};
  if (notes.images) {
    for (const img of notes.images) imageUrls[img.imageId] = resolveImageUrl(folderId, img.imageId) ?? "";
  }

  return { folderId, notes, answers, imageUrls };
}

export function listMathChapterFolders(): string[] {
  try {
    return fs
      .readdirSync(CHAPTERS_DIR, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .filter((n) => !n.startsWith("."));
  } catch {
    return [];
  }
}

export function getAllMathChapters(): MathChapter[] {
  return listMathChapterFolders()
    .map(getMathChapter)
    .filter((c): c is MathChapter => c !== null);
}