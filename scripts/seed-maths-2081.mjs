#!/usr/bin/env node
/**
 * Seeding script for the solved SEE 2081 Compulsory Mathematics paper
 * (Koshi Province) added under `maths-2081/koshi/`.
 *
 * The source files use the "schemaVersion 2.0" maths schema
 * (`questions[].parts[]`, `answers[].parts[].solutionSteps[]`,
 * `referenceImageId` diagrams). This converts them into the canonical
 * PastPaperDoc shape that `lib/pastPapers.ts` loads into `/past-papers`,
 * then stages the paper + its PNG diagrams inside the scanned folder
 * `science-questions/see-2081-compulsory-maths-koshi/`.
 *
 * Re-runnable (idempotent).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = path.join(root, "maths-2081", "koshi");
const SOURCE_QUESTIONS = path.join(SRC_DIR, "see-2081-compulsory-maths-questions.json");
const SOURCE_ANSWERS = path.join(SRC_DIR, "see-2081-compulsory-maths-answers.json");
const DIAGRAM_SRC = path.join(SRC_DIR, "math-geometry-diagrams");

const PAPER_ID = "see-2081-compulsory-maths-koshi";
const DEST_DIR = path.join(root, "science-questions", PAPER_ID);
const DIAGRAM_DEST = path.join(DEST_DIR, "maths-diagrams");

const IMG_BASE = "https://YOUR_STORAGE_BUCKET/see2081-compulsory-maths-koshi/";
const DEVANAGARI = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
const toDev = (s) => String(s).replace(/\d/g, (d) => DEVANAGARI[Number(d)]);

const questions = JSON.parse(fs.readFileSync(SOURCE_QUESTIONS, "utf8"));
const answers = JSON.parse(fs.readFileSync(SOURCE_ANSWERS, "utf8"));

const qImages = new Map((questions.images ?? []).map((i) => [i.imageId, i]));
const aImages = new Map((answers.images ?? []).map((i) => [i.imageId, i]));

const imgUrl = (imageId) => `${IMG_BASE}${imageId}.png`;

function imageItem(imageId, index) {
  if (!imageId) return undefined;
  const caption = index.get(imageId)?.caption;
  return { url: imgUrl(imageId), caption: caption ? { en: caption.en, ne: caption.ne } : undefined };
}

function toFsTable(table) {
  if (!table || !table.headers || !Array.isArray(table.rows)) return undefined;
  const headers = table.headers.en.map((h, i) => ({ en: h, ne: table.headers.ne[i] ?? h }));
  const rows = table.rows.map((row) =>
    Object.values(row).map((cell) => ({ en: String(cell), ne: String(cell) })),
  );
  return { headers, rows };
}

function partTitle(q, topic) {
  const n = q.questionNumber;
  return {
    en: `Q${n} · ${topic?.en ?? ""}`.replace(/[· ]+$/, ""),
    ne: `प्रश्न ${toDev(n)}${topic?.ne ? ` · ${topic.ne}` : ""}`,
  };
}

function baseDoc() {
  return {
    chapterId: PAPER_ID,
    subjectId: "mathematics",
    classLevel: String(questions.grade ?? "10"),
    province: "Koshi",
    examBoard: "SEE (National Examinations Board, Nepal)",
    examYear: "2081 (2025 AD)",
    paperCode: questions.symbolCode,
    fullMarks: questions.fullMarks,
    timeAllowed: questions.duration?.en ?? "3 hours",
    titleEn: "SEE 2081 (2025) Compulsory Mathematics Question Paper — Koshi Province",
    titleNe: "SEE २०८१ (२०२५) अनिवार्य गणित प्रश्नपत्र — कोशी प्रदेश",
    sourceNote: { en: questions.instructions?.en ?? "", ne: questions.instructions?.ne ?? "" },
    blocks: [
      {
        type: "heading",
        text: { en: "SEE 2081 (2025) — Compulsory Mathematics", ne: "SEE २०८१ (२०२५) — अनिवार्य गणित" },
      },
      {
        type: "paragraph",
        text: {
          en: `Time: ${questions.duration?.en ?? "3 hours"} | Full Marks: ${questions.fullMarks}.\n${questions.instructions?.en ?? ""}`.trim(),
          ne: `समय : ${questions.duration?.ne ?? "३ घण्टा"} | पूर्णाङ्क : ${questions.fullMarks}।\n${questions.instructions?.ne ?? ""}`.trim(),
        },
      },
    ],
  };
}

const sectionForQuestion = (q, isAnswer) => {
  const n = q.questionNumber;
  const section = { title: partTitle(q, q.topic) };
  if (q.context && (q.context.en || q.context.ne)) {
    section.instructions = { en: q.context.en, ne: q.context.ne };
  }
  const rootImg = imageItem(q.referenceImageId, qImages);
  const table = toFsTable(q.table);
  const answer = !isAnswer ? null : (answers.answers.find((a) => a.questionNumber === n) ?? null);

  section.items = q.parts.map((part, i) => {
    const item = {
      id: `q${n}-${part.partId}`,
      questionNumber: `${n}(${part.partId})`,
      marks: part.marks,
      question: { en: part.text.en, ne: part.text.ne },
    };

    const partImg = imageItem(part.referenceImageId, qImages);
    if (partImg) item.image = partImg;
    else if (i === 0 && rootImg) item.image = rootImg;
    if (i === 0 && table) item.table = table;

    if (isAnswer) {
      const ap = answer?.parts?.find((p) => p.partId === part.partId);
      const ansImg = imageItem(ap?.referenceImageId, aImages);
      if (ansImg) item.image = ansImg;
      if (ap?.finalAnswer && (ap.finalAnswer.en || ap.finalAnswer.ne)) {
        item.answer = { en: ap.finalAnswer.en, ne: ap.finalAnswer.ne };
      }
      if (ap?.solutionSteps?.length) {
        const join = (key) => ap.solutionSteps.map((s) => s.text?.[key] ?? "").filter(Boolean).join("\n");
        const solution = { en: join("en"), ne: join("ne") };
        if (solution.en || solution.ne) item.solution = solution;
      }
    }
    return item;
  });
  return section;
};

const questionDoc = {
  ...baseDoc(),
  docType: "questionPaper",
  questionSections: questions.questions.map((q) => sectionForQuestion(q, false)),
};

const answerDoc = {
  ...baseDoc(),
  docType: "answerKey",
  linkedQuestionPaperId: PAPER_ID,
  questionSections: questions.questions.map((q) => sectionForQuestion(q, true)),
};

fs.mkdirSync(DIAGRAM_DEST, { recursive: true });
for (const file of fs.readdirSync(DIAGRAM_SRC)) {
  if (/\.[A-Za-z0-9]+$/.test(file) && !file.startsWith(".")) {
    fs.copyFileSync(path.join(DIAGRAM_SRC, file), path.join(DIAGRAM_DEST, file));
  }
}

const qOut = path.join(DEST_DIR, `${PAPER_ID}-questions.json`);
const aOut = path.join(DEST_DIR, `${PAPER_ID}-answers.json`);
fs.writeFileSync(qOut, JSON.stringify(questionDoc, null, 2));
fs.writeFileSync(aOut, JSON.stringify(answerDoc, null, 2));

const parts = questions.questions.reduce((n, q) => n + q.parts.length, 0);
console.log(`Seeded ${PAPER_ID}`);
console.log(`  questions: ${questions.questions.length} questions / ${parts} parts`);
console.log(`  answers:   ${answers.answers.length} answered questions`);
console.log(`  diagrams:  ${fs.readdirSync(DIAGRAM_DEST).length} files`);
console.log(`  wrote → ${qOut}`);
console.log(`  wrote → ${aOut}`);