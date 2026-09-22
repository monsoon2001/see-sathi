/**
 * Shared seeding helpers for Compulsory Mathematics chapter docs
 * (see-math-ch{N}-en / see-math-ch{N}-ne).
 *
 * Reads chapter notes + solved-exercises JSON from the local content folder,
 * resolves referenceImageId → Cloudinary URLs via cloudinary-manifest.json,
 * builds the canonical blocks[] + questionSections[] Firestore shape, and
 * PATCHes both the EN and NE chapter docs.
 */
import fs from "node:fs";
import path from "node:path";

export const REPO = path.resolve(new URL("../../", import.meta.url).pathname);
export const FIRESTORE = "https://firestore.googleapis.com/v1/projects/learning-832c9/databases/(default)/documents";
export const API_KEY = "AIzaSyAx_o_15KKSZGSyNFF3R6PcTayXViH2UvM";

const manifest = JSON.parse(fs.readFileSync(path.join(REPO, "scripts/cloudinary-manifest.json"), "utf8"));

/* ---------------------------------------------------------------- *
 * Firestore Value helpers
 * ---------------------------------------------------------------- */
export const sv = (s) => ({ stringValue: String(s) });
export const iv = (n) => ({ integerValue: String(n) });
export const mv = (fields) => ({ mapValue: { fields } });
export const av = (values) => ({ arrayValue: { values } });
export const bi = (b) => (b && (b.en || b.ne) ? b : { en: b, ne: b });
export const lang = (b) => mv({ en: sv(b.en), ne: sv(b.ne) });

export function blockValue(b) {
  const fields = { type: sv(b.type), en: sv(b.text.en), ne: sv(b.text.ne) };
  if (b.image) fields.image = sv(b.image);
  return mv(fields);
}

export function itemValue(it) {
  const fields = { id: sv(it.id), source: sv(it.source), question: lang(it.question) };
  if (it.solution) fields.solution = lang(it.solution);
  if (it.image) fields.image = sv(it.image);
  return mv(fields);
}

export function imgUrlResolver(imgFolder) {
  return (imageId) => {
    const base = manifest[`see-papers/${imgFolder}/${imageId}.png`];
    if (!base) {
      console.error(`  !! Missing Cloudinary URL for ${imageId}`);
      return undefined;
    }
    return `${base}.png`;
  };
}

/* ---------------------------------------------------------------- *
 * Notes content → blocks
 * ---------------------------------------------------------------- */
export function buildBlocks(notes, imgUrl) {
  const blocks = [];
  for (const sec of notes.sections) {
    blocks.push({ type: "heading", text: bi(sec.title) });
    for (const b of sec.content) {
      if (!b.text || (!b.text.en && !b.text.ne)) continue;
      const blk = { type: "paragraph", text: bi(b.text) };
      if (b.referenceImageId) blk.image = imgUrl(b.referenceImageId);
      blocks.push(blk);
    }
    for (const ex of sec.examples ?? []) {
      if (ex.question && (ex.question.en || ex.question.ne)) {
        const q = { type: "paragraph", text: bi(ex.question) };
        if (ex.referenceImageId) q.image = imgUrl(ex.referenceImageId);
        blocks.push(q);
      }
      if (ex.solution && (ex.solution.en || ex.solution.ne)) {
        const sol = bi(ex.solution);
        blocks.push({
          type: "paragraph",
          text: { en: `Solution: ${sol.en}`, ne: `हल: ${sol.ne}` },
        });
      }
    }
  }
  return blocks;
}

/* ---------------------------------------------------------------- *
 * Solved exercises → questionSections
 * ---------------------------------------------------------------- */
export function buildQuestionSections(notes, solved, imgUrl, exerciseGroups) {
  const sections = [];

  for (const group of exerciseGroups) {
    const items = [];
    const exercises = notes.exercises.filter((e) => e.exerciseId.startsWith(group.prefix));
    for (const ex of exercises) {
      const sol = solved.exercises.find((e) => e.exerciseId === ex.exerciseId);
      if (!sol) continue;
      const qImg = ex.referenceImageId ? imgUrl(ex.referenceImageId) : undefined;

      if (sol.parts && sol.parts.length > 0) {
        sol.parts.forEach((part, i) => {
          const nPart = ex.parts?.find((p) => p.partId === part.partId);
          const preamble = i === 0 && ex.text && (ex.text.en || ex.text.ne) ? bi(ex.text) : null;
          const partQ = nPart?.text ?? part.partId;
          const item = {
            id: part.partId,
            source: "textbook",
            question: preamble
              ? { en: `${preamble.en}\n\n${partQ.en}`, ne: `${preamble.ne}\n\n${partQ.ne}` }
              : bi(partQ),
          };
          if (part.solution && (part.solution.en || part.solution.ne)) {
            item.solution = bi(part.solution);
            if (i === 0 && sol.note) {
              const note = bi(sol.note);
              item.solution = {
                en: `${item.solution.en}\n\n${note.en}`,
                ne: `${item.solution.ne}\n\n${note.ne}`,
              };
            }
          }
          if (part.referenceImageId) item.image = imgUrl(part.referenceImageId);
          else if (i === 0 && qImg) item.image = qImg;
          items.push(item);
        });
        continue;
      }

      const item = { id: sol.exerciseId, source: "textbook", question: bi(ex.text ?? sol.exerciseId) };
      if (sol.solution && (sol.solution.en || sol.solution.ne)) {
        item.solution = bi(sol.solution);
        if (sol.note) {
          const note = bi(sol.note);
          item.solution = { en: `${item.solution.en}\n\n${note.en}`, ne: `${item.solution.ne}\n\n${note.ne}` };
        }
      }
      if (sol.referenceImageId) item.image = imgUrl(sol.referenceImageId);
      else if (qImg) item.image = qImg;
      items.push(item);
    }

    if (items.length > 0) {
      sections.push({ title: group.title, items });
    }
  }

  const questionCount = sections.reduce((n, s) => n + s.items.length, 0);
  return { sections, questionCount };
}

/* ---------------------------------------------------------------- *
 * Firestore write
 * ---------------------------------------------------------------- */
export async function patchDoc(docId, fields) {
  const res = await fetch(`${FIRESTORE}/chapters/${docId}?key=${API_KEY}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`PATCH ${docId} failed: ${json?.error?.message ?? res.statusText}`);
  return json;
}

export function docFields(cfg, blocks, questionSections) {
  return {
    chapterId: sv(cfg.chapterId),
    subjectId: sv("see-math"),
    number: iv(cfg.number),
    classLevel: sv("10"),
    titleEn: sv(cfg.titleEn),
    titleNe: sv(cfg.titleNe),
    version: iv(cfg.version),
    questions: av([]),
    questionBlocks: av([]),
    blocks: av(blocks.map(blockValue)),
    questionSections: av(questionSections.map((s) => mv({ section: lang(s.title), items: av(s.items.map(itemValue)) }))),
  };
}

export async function seedMathChapter(cfg) {
  const notes = JSON.parse(fs.readFileSync(path.join(cfg.src, cfg.notesFile), "utf8"));
  const solved = JSON.parse(fs.readFileSync(path.join(cfg.src, cfg.solvedFile), "utf8"));

  const imgUrl = imgUrlResolver(cfg.imgFolder);
  const blocks = buildBlocks(notes, imgUrl);
  const { sections, questionCount } = buildQuestionSections(notes, solved, imgUrl, cfg.exerciseGroups);

  console.log(`${cfg.label}: ${blocks.length} blocks, ${questionCount} solved questions`);

  if (process.env.DRY_RUN) {
    console.log("DRY_RUN: nothing written.");
    return { blocks, sections, questionCount };
  }

  const fields = docFields(cfg, blocks, sections);
  for (const docId of cfg.docIds) {
    await patchDoc(docId, fields);
    console.log(`  ✓ ${docId}`);
  }
  console.log("Done.");
  return { blocks, sections, questionCount };
}