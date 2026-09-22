/**
 * Seeds the four Computer Science SEE past papers (2081/2082 × regular/grade
 * increment) into the past-paper data source.
 *
 * Reads the source JSONs under computer-past-paper/ (transcribed from scans,
 * English-only, single paper per exam — not province-wise), converts each
 * pair into the canonical PastPaperDoc shape used by lib/pastPapers.ts
 * (bilingual en/ne, docType, typed blocks; code / ocrFlag / altLabel /
 * alternativeGroup preserved on items; solutionTable cells made bilingual),
 * and writes them as:
 *   - science-questions/<folder>/<folder>-questions.json  (docType: questionPaper)
 *   - science-questions/<folder>/<folder>-answers.json    (docType: answerKey)
 *
 * Usage: node scripts/seed-cs-past-papers.mjs
 */
import fs from "node:fs";
import path from "node:path";

const REPO = process.cwd();
const SOURCE = path.join(REPO, "computer-past-paper");
const OUT_ROOT = path.join(REPO, "science-questions");
const EXAM_BOARD = "SEE (National Examinations Board, Nepal)";

const bi = (s) => ({ en: String(s ?? ""), ne: String(s ?? "") });

const PAPERS = [
  {
    srcDir: "2081",
    prefix: "see-2081-computer-science",
    folder: "see-2081-computer-science",
    gi: false,
  },
  {
    srcDir: "2081/grade-increment-2081",
    prefix: "see-grade-increment-2081-computer-science",
    folder: "see-2081-computer-science-grade-increment",
    gi: true,
  },
  {
    srcDir: "2082",
    prefix: "see-2082-computer-science",
    folder: "see-2082-computer-science",
    gi: false,
  },
  {
    srcDir: "2082/grade-increment",
    prefix: "see-grade-increment-2082-computer-science",
    folder: "see-2082-computer-science-grade-increment",
    gi: true,
  },
];

const TITLES = {
  "see-2081-computer-science": {
    en: "SEE 2081 (2025) Computer Science (Optional Second) - RE-3031",
    ne: "SEE २०८१ (२०२५) कम्प्युटर विज्ञान (ऐच्छिक दोस्रो) - RE-3031",
  },
  "see-2081-computer-science-grade-increment": {
    en: "SEE (Grade Increment) 2081 (2025) Computer Science (Optional Second) - GI-3031",
    ne: "SEE ग्रेड वृद्धि २०८१ (२०२५) कम्प्युटर विज्ञान (ऐच्छिक दोस्रो) - GI-3031",
  },
  "see-2082-computer-science": {
    en: "SEE 2082 (2026) Computer Science (Optional Second) - RE-3031'B'",
    ne: "SEE २०८२ (२०२६) कम्प्युटर विज्ञान (ऐच्छिक दोस्रो) - RE-3031'B'",
  },
  "see-2082-computer-science-grade-increment": {
    en: "SEE (Grade Increment) 2082 (2026) Computer Science (Optional Second) - GI-3031",
    ne: "SEE ग्रेड वृद्धि २०८२ (२०२६) कम्प्युटर विज्ञान (ऐच्छिक दोस्रो) - GI-3031",
  },
};

const YEAR_TEXT = { "see-2081": "2081 (2025 AD)", "see-2082": "2082 (2026 AD)" };

function sourceNote(folder, isAnswer, paperCode) {
  const year = YEAR_TEXT[folder.slice(0, 8)];
  const suffix = folder.includes("grade-increment") ? " (Grade Increment)" : "";
  const en =
    isAnswer
      ? `Answer key for the SEE ${year}${suffix} Optional Computer Science question paper, paper code ${paperCode}. Solutions are written at Class 10 / SEE level in the same QBASIC/C vocabulary the paper uses, keyed to each question number.`
      : `Digitised from the scanned SEE ${year}${suffix} Optional Computer Science question paper, paper code ${paperCode}. Transcribed and translated to English; no diagrams appeared in this paper.`;
  const ne =
    isAnswer
      ? `SEE ${year}${suffix} ऐच्छिक कम्प्युटर विज्ञान प्रश्नपत्र (कोड ${paperCode}) को उत्तर कुञ्जी। समाधानहरू कक्षा १० / SEE स्तरमा प्रश्नपत्रले प्रयोग गरेकै QBASIC/C शब्दावलीमा तयार गरिएका छन्।`
      : `स्क्यान गरिएको SEE ${year}${suffix} ऐच्छिक कम्प्युटर विज्ञान प्रश्नपत्र (कोड ${paperCode}) बाट डिजिटाइज गरिएको। अङ्ग्रेजीमा अभिलेख गरिएको; यस प्रश्नपत्रमा कुनै चित्र रहेको छैन।`;
  return { en, ne };
}

function blocksToCanonical(blocks) {
  const out = [];
  for (const b of blocks ?? []) {
    if (b?.heading) out.push({ type: "heading", text: bi(b.heading) });
    if (b?.paragraph) out.push({ type: "paragraph", text: bi(b.paragraph) });
  }
  return out;
}

function itemToCanonical(it) {
  const out = {};
  for (const [k, v] of Object.entries(it ?? {})) {
    if (v == null) continue;
    if (k === "question" || k === "answer" || k === "solution") out[k] = bi(v);
    else if (k === "solutionTable") out[k] = tableToCanonical(v);
    else out[k] = v;
  }
  return out;
}

function tableToCanonical(t) {
  if (!t || typeof t !== "object") return t;
  const cell = (c) => (c && typeof c === "object" && "en" in c ? c : bi(c));
  return {
    headers: (t.headers ?? []).map(cell),
    rows: (t.rows ?? []).map((row) => (Array.isArray(row) ? row.map(cell) : [cell(row)])),
  };
}

function sectionToCanonical(sec) {
  const out = { title: bi(sec?.title ?? ""), items: (sec?.items ?? []).map(itemToCanonical) };
  if (sec?.instructions) out.instructions = bi(sec.instructions);
  return out;
}

function buildDoc(src, folderId, docType, titleEn, titleNe, note, isAnswer) {
  const out = {
    chapterId: folderId,
    subjectId: src.subjectId,
    classLevel: src.classLevel ?? "10",
    examBoard: EXAM_BOARD,
    examYear: src.examYear,
    paperCode: src.paperCode,
    fullMarks: src.fullMarks,
    timeAllowed: src.timeAllowed,
    titleEn,
    titleNe,
    sourceNote: note,
    blocks: blocksToCanonical(src.blocks),
    docType,
    questionSections: (src.questionSections ?? []).map(sectionToCanonical),
  };
  if (isAnswer) out.linkedQuestionPaperId = folderId;
  return out;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function main() {
  for (const p of PAPERS) {
    const outDir = path.join(OUT_ROOT, p.folder);
    const qSrc = readJson(path.join(SOURCE, p.srcDir, `${p.prefix}-questions.json`));
    const aSrc = readJson(path.join(SOURCE, p.srcDir, `${p.prefix}-answers.json`));

    const title = TITLES[p.folder];
    const qDoc = buildDoc(qSrc, p.folder, "questionPaper", qSrc.title, title.ne, sourceNote(p.folder, false, qSrc.paperCode), false);
    const aDoc = buildDoc(
      aSrc,
      p.folder,
      "answerKey",
      aSrc.title,
      `${title.ne} - उत्तर कुञ्जी`,
      sourceNote(p.folder, true, aSrc.paperCode),
      true,
    );

    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, `${p.folder}-questions.json`), `${JSON.stringify(qDoc, null, 2)}\n`);
    fs.writeFileSync(path.join(outDir, `${p.folder}-answers.json`), `${JSON.stringify(aDoc, null, 2)}\n`);

    const qCount = qDoc.questionSections.reduce((n, s) => n + s.items.length, 0);
    const aCount = aDoc.questionSections.reduce((n, s) => n + s.items.length, 0);
    const qIds = qDoc.questionSections.flatMap((s) => s.items.map((i) => i.id)).sort();
    const aIds = aDoc.questionSections.flatMap((s) => s.items.map((i) => i.id)).sort();
    const idsMatch = JSON.stringify(qIds) === JSON.stringify(aIds);
    console.log(`  ✓ ${p.folder} — ${qDoc.questionSections.length} sections, ${qCount} questions, ${aCount} answers, idsMatch=${idsMatch} (${qSrc.examYear})`);
  }
  console.log("Done. Papers written under science-questions/.");
}

main();