export type NoteBlockType =
  | "heading"
  | "paragraph"
  | "definition"
  | "example"
  | "formula"
  | "image"
  | "tip"
  | "warning";

export interface NoteBlock {
  id: string;
  order: number;
  type: NoteBlockType;
  content?: string;
  title?: string;
  items?: string[];
  caption?: string;
  imageUrl?: string;
}

export type ChapterProgress = "mastered" | "in-progress" | "not-started";

export interface Chapter {
  id: string;
  title: string;
  slug: string;
  number: number;
  subLabel?: string;
  section?: string;
  description: string;
  hasNotes: boolean;
  hasQuestions: boolean;
  weightage?: string;
  group?: string;
  highYield?: boolean;
  readMinutes?: number;
  workingHours?: number;
  notesCount?: number;
  questionsCount?: number;
  progress?: ChapterProgress;
  progressPercent?: number;
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  code?: string;
  type: "Compulsory" | "Optional I (Elective)" | "Optional II (Elective)";
  order: number;
  accentColor: string;
  icon: string;
  tagline: string;
  description: string;
  chapterCount: number;
  questionCount: number;
  topics?: string[];
  comingSoon?: boolean;
}

export type QuestionGroup = "A" | "B" | "C" | "D";

export interface SolutionStep {
  number: number;
  title: string;
  subtitle?: string;
  marks: string;
  content: string[];
}

export interface Question {
  id: string;
  order: number;
  title?: string;
  group: QuestionGroup;
  marks: number;
  source: string;
  tags: string[];
  questionText: string;
  subParts?: string[];
  given?: string[];
  difficulty: "easy" | "moderate" | "hard";
  note?: string;
  steps: SolutionStep[];
  answer: string;
}

export interface SearchResult {
  id: string;
  type: "chapter" | "note" | "question" | "formula" | "pastpaper";
  title: string;
  snippet: string;
  subjectSlug: string;
  chapterSlug?: string;
  questionId?: string;
  /** Direct link override (e.g. past papers). Defaults to a derived subject link. */
  href?: string;
  keywords: string[];
}

export interface SavedNote {
  id: string;
  subjectSlug: string;
  subjectName: string;
  chapterSlug: string;
  chapterTitle: string;
  savedAt: string;
}