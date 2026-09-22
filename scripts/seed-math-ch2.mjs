/**
 * Seeds Compulsory Mathematics Chapter 2 (Compound Interest) notes + solved
 * exercises into Firestore, creating the see-math-ch2-en / -ne docs.
 *
 * Usage: node scripts/seed-math-ch2.mjs   (DRY_RUN=1 for a dry run)
 */
import path from "node:path";
import { REPO, seedMathChapter } from "./lib/mathChapterSeed.mjs";

seedMathChapter({
  label: "Maths Ch.2 seed",
  src: path.join(REPO, "maths_chapter_2"),
  notesFile: "notes-content-ci.json",
  solvedFile: "solved-exercises-ci.json",
  docIds: ["see-math-ch2-en", "see-math-ch2-ne"],
  imgFolder: "see-math-ch2",
  chapterId: "see-math-ch2",
  number: 2,
  titleEn: "Chapter 2: Compound Interest",
  titleNe: "एकाइ २: चक्रवृद्धि ब्याज",
  version: 1,
  exerciseGroups: [
    { prefix: "ex2.1-", title: { en: "Exercise 2.1", ne: "अभ्यास २.१" } },
  ],
}).catch((err) => {
  console.error(err);
  process.exit(1);
});