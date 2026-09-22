/**
 * Seeds Compulsory Mathematics Chapter 1 (Sets) notes + solved exercises into
 * Firestore, REPLACING the existing see-math-ch1-en / -ne docs.
 *
 * Usage: node scripts/seed-math-ch1.mjs   (DRY_RUN=1 for a dry run)
 */
import path from "node:path";
import { REPO, seedMathChapter } from "./lib/mathChapterSeed.mjs";

seedMathChapter({
  label: "Maths Ch.1 seed",
  src: path.join(REPO, "maths_chapter_1"),
  notesFile: "notes-content.json",
  solvedFile: "solved-exercises.json",
  docIds: ["see-math-ch1-en", "see-math-ch1-ne"],
  imgFolder: "see-math-ch1",
  chapterId: "see-math-ch1",
  number: 1,
  titleEn: "Chapter 1: Sets",
  titleNe: "एकाइ १: सेट (Sets)",
  version: 2,
  exerciseGroups: [
    { prefix: "ex1.1-", title: { en: "Exercise 1.1", ne: "अभ्यास १.१" } },
    { prefix: "ex1.2-", title: { en: "Exercise 1.2", ne: "अभ्यास १.२" } },
    { prefix: "mixed-", title: { en: "Mixed Exercise", ne: "मिश्रित अभ्यास" } },
  ],
}).catch((err) => {
  console.error(err);
  process.exit(1);
});