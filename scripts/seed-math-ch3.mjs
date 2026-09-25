/**
 * Seeds Compulsory Mathematics Chapter 3 (Growth and Depreciation) notes +
 * solved exercises into Firestore, creating the see-math-ch3-en / -ne docs.
 *
 * Usage: node scripts/seed-math-ch3.mjs   (DRY_RUN=1 for a dry run)
 */
import path from "node:path";
import { REPO, seedMathChapter } from "./lib/mathChapterSeed.mjs";

seedMathChapter({
  label: "Maths Ch.3 seed",
  src: path.join(REPO, "maths_chapter_3"),
  notesFile: "notes-content-gd.json",
  solvedFile: "solved-exercises-gd.json",
  docIds: ["see-math-ch3-en", "see-math-ch3-ne"],
  outFile: "science-questions/see-math-ch3/see-math-ch3-en.json",
  imgFolder: "see-math-ch3",
  chapterId: "see-math-ch3",
  number: 3,
  titleEn: "Chapter 3: Growth and Depreciation",
  titleNe: "एकाइ ३: वृद्धि र ह्रास",
  version: 1,
  exerciseGroups: [
    { prefix: "ex3.1-", title: { en: "Exercise 3.1", ne: "अभ्यास ३.१" } },
    { prefix: "ex3.2-", title: { en: "Exercise 3.2", ne: "अभ्यास ३.२" } },
  ],
}).catch((err) => {
  console.error(err);
  process.exit(1);
});