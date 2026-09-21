// Phase 1: reads from mock arrays.
// Phase 2: swap internals to read Firestore (subjects/{id}/chapters/{id}/questions/{questionId}).
import { mockQuestions, mockSingleQuestions } from "@/lib/mock/mockQuestions";
import type { Question } from "@/lib/types";

export async function getQuestions(subjectSlug: string, chapterSlug: string): Promise<Question[]> {
  const key = `${subjectSlug}/${chapterSlug}`;
  return mockQuestions[key] ?? [];
}

export async function getQuestion(
  subjectSlug: string,
  chapterSlug: string,
  questionId: string,
): Promise<Question | undefined> {
  const list = await getQuestions(subjectSlug, chapterSlug);
  return list.find((q) => q.id === questionId) ?? mockSingleQuestions[questionId];
}