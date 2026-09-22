/**
 * Seeds Computer Science chapter notes + solved questions into Firestore.
 *
 * Reads the source JSONs from /Users/monsoonparajuli/Downloads/all_chapters_computer_science,
 * converts them to the app's FsChapterDoc shape (blocks + questionSections with
 * bilingual en/ne fields and Cloudinary image URLs from scripts/cloudinary-manifest.json),
 * and PATCHes the docs:
 *   - see-cs-ch1 .. see-cs-ch3, see-cs-ch5
 *   - see-cs-ch4-1 .. see-cs-ch4-6  (Part1/Part2 content mapped by topic;
 *       Turtle graphics + Python libraries fold into ch4-3)
 *
 * Usage: node scripts/seed-computer-science.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { patchChapterDoc } from "./lib/firebaseAdmin.mjs";

const SOURCE = "/Users/monsoonparajuli/Downloads/all_chapters_computer_science";
const MANIFEST = "scripts/cloudinary-manifest.json";

const repo = path.resolve(new URL("..", import.meta.url).pathname);
const manifest = JSON.parse(fs.readFileSync(path.join(repo, MANIFEST), "utf8"));

const bi = (text) => ({ en: text, ne: text });

/* ---------------------------------------------------------------- *
 * Notes content -> blocks
 * ---------------------------------------------------------------- */
function contentToBlocks(content, chapterNum) {
  const blocks = [];
  for (const b of content) {
    const textOf = (o) => (typeof o === "string" ? o : "");
    switch (b.type) {
      case "h1":
      case "h2":
        blocks.push({ mapValue: { fields: { type: { stringValue: "heading" }, en: { stringValue: textOf(b.text) }, ne: { stringValue: textOf(b.text) } } } });
        break;
      case "p":
        blocks.push({ mapValue: { fields: { type: { stringValue: "paragraph" }, en: { stringValue: textOf(b.text) }, ne: { stringValue: textOf(b.text) } } } });
        break;
      case "bullets":
      case "numbered": {
        const items = (b.items ?? []).map((it) => ({ mapValue: { fields: { en: { stringValue: String(it) }, ne: { stringValue: String(it) } } } }));
        blocks.push({
          mapValue: {
            fields: {
              type: { stringValue: "list" },
              ordered: { booleanValue: b.type === "numbered" },
              items: { arrayValue: { values: items } },
            },
          },
        });
        break;
      }
      case "table": {
        const cell = (s) => ({ mapValue: { fields: { en: { stringValue: String(s) }, ne: { stringValue: String(s) } } } });
        const headers = (b.headers ?? []).map(cell);
        const rows = (b.rows ?? []).map((r) => ({ mapValue: { fields: { cells: { arrayValue: { values: r.map(cell) } } } } }));
        blocks.push({
          mapValue: {
            fields: {
              type: { stringValue: "table" },
              table: {
                mapValue: {
                  fields: {
                    headers: { arrayValue: { values: headers } },
                    rows: { arrayValue: { values: rows } },
                  },
                },
              },
            },
          },
        });
        break;
      }
      case "image": {
        const url = manifest[`see-cs-ch${chapterNum}/${b.image_name}`];
        if (!url) {
          console.error(`  !! Missing cloudinary url for ${b.image_name}`);
          continue;
        }
        const cap = b.caption || "";
        blocks.push({
          mapValue: {
            fields: {
              type: { stringValue: "image" },
              url: { stringValue: url },
              captionEn: { stringValue: cap },
              captionNe: { stringValue: cap },
            },
          },
        });
        break;
      }
      default:
        console.warn(`  !! Unknown notes block type "${b.type}"`);
    }
  }
  return blocks;
}

/* ---------------------------------------------------------------- *
 * Solved questions -> questionSections
 * ---------------------------------------------------------------- */
const isQMarker = (t) => /^questions?$/i.test(t);
const isAMarker = (t) => /^answers?$/i.test(t);

function questionSection(id, title, qItems, aItems) {
  const items = [];
  const n = Math.max(qItems.length, aItems.length);
  for (let i = 0; i < n; i++) {
    const q = (qItems[i] || "").trim();
    const a = (aItems[i] || "").trim();
    if (!q && !a) continue;
    const question = { en: q, ne: q };
    const item = {
      mapValue: {
        fields: {
          id: { stringValue: `${id}-q${i + 1}` },
          source: { stringValue: "textbook" },
          question: { mapValue: { fields: { en: { stringValue: q }, ne: { stringValue: q } } } },
        },
      },
    };
    if (a) {
      item.mapValue.fields.answer = { mapValue: { fields: { en: { stringValue: a }, ne: { stringValue: a } } } };
    }
    items.push(item);
  }
  return {
    mapValue: {
      fields: {
        section: { mapValue: { fields: { en: { stringValue: title }, ne: { stringValue: title } } } },
        items: { arrayValue: { values: items } },
      },
    },
  };
}

const Q_PREFIX_RE = /^Q(?:uestion)?\.?\s*\d+\s*[.:)\-]?\s*/i;
const ANS_PREFIX_RE = /^Ans(?:wer)?\.?\s*[:.\-]?\s*/i;

function parseSolvedQuestions(content) {
  const hasLists = content.some((b) => b.type === "numbered" || b.type === "bullets");
  const sections = [];
  let cur = null; // { title, qItems, aItems, view }
  let qn = 0;

  const flush = () => {
    if (!cur) return;
    const title = cur.title || "(Questions)";
    const sec = questionSection(`cs${qn++}`, title, cur.qItems, cur.aItems);
    if (sec.mapValue.fields.items.arrayValue.values.length > 0) sections.push(sec);
    cur = null;
  };
  const startSection = (title) => {
    flush();
    cur = { title, qItems: [], aItems: [], view: null };
  };

  const itemsOf = (b) => (b.items ?? []).map((x) => String(x));

  for (const b of content) {
    if (b.type === "h1" || b.type === "h2") {
      const text = String(b.text || "").trim();
      // combined form: "Section A: ... — Questions" / "... — Answers"
      const combined = text.match(/^(.*?)[\-–—]\s*(questions?|answers?)\s*$/i);
      if (combined) {
        const kind = /^questions?/i.test(combined[2]) ? "q" : "a";
        if (kind === "a" && cur && cur.qItems.length > 0) {
          // "… — Answers" attaches to the currently-open questions section
          cur.view = "a";
          continue;
        }
        startSection(combined[1].trim());
        cur.view = kind;
        continue;
      }
      if (isQMarker(text)) {
        if (!cur) startSection("Questions");
        cur.view = "q";
        continue;
      }
      if (isAMarker(text)) {
        if (!cur) startSection("Answers");
        cur.view = "a";
        continue;
      }
      startSection(text);
      continue;
    }

    if (b.type === "p") {
      const text = String(b.text || "").trim();
      if (isQMarker(text)) {
        if (!cur) startSection("Questions");
        cur.view = "q";
        continue;
      }
      if (isAMarker(text)) {
        if (!cur) startSection("Answers");
        cur.view = "a";
        continue;
      }
      if (!cur) continue; // intro prose before any heading
    } else if (!cur) {
      startSection("Questions");
    }

    const items = b.type === "p" ? [String(b.text || "")] : itemsOf(b);
    for (let raw of items) {
      raw = raw.trim();
      if (!raw) continue;
      if (hasLists) {
        // List mode: items land in whichever list is active
        if (cur.view === "q") cur.qItems.push(raw);
        else if (cur.view === "a") cur.aItems.push(raw);
        // ignore preamble paragraphs
      } else {
        // Paragraph (interleaved) mode: "Q1." lines and "Answer:" lines
        if (Q_PREFIX_RE.test(raw)) {
          cur.qItems.push(raw.replace(Q_PREFIX_RE, ""));
        } else if (ANS_PREFIX_RE.test(raw)) {
          cur.aItems.push(raw.replace(ANS_PREFIX_RE, ""));
        } else if (cur.qItems.length > cur.aItems.length) {
          cur.aItems[cur.aItems.length - 1] = `${cur.aItems[cur.aItems.length - 1] ?? ""}\n${raw}`.trim();
        }
      }
    }
  }
  flush();
  return sections;
}

/* ---------------------------------------------------------------- *
 * Chapter 4 topic routing
 * ---------------------------------------------------------------- */
function sliceByH1(content, starts, stops) {
  // Returns blocks between first H1 matching `starts` and the first H1 matching any `stops`.
  const h1s = content.map((b, i) => (b.type === "h1" ? { i, text: String(b.text || "") } : null)).filter(Boolean);
  let s = -1;
  let e = content.length;
  for (const h of h1s) {
    if (s === -1 && starts.some((p) => h.text.startsWith(p))) s = h.i;
    else if (s !== -1 && stops.some((p) => h.text.startsWith(p))) {
      e = h.i;
      break;
    }
  }
  if (s === -1) return [];
  return content.slice(s, e);
}

const ch4Part1Notes = () => JSON.parse(fs.readFileSync(`${SOURCE}/chapter_4/Chapter4_Part1_Notes_EN.json`, "utf8")).content;
const ch4Part2Notes = () => JSON.parse(fs.readFileSync(`${SOURCE}/chapter_4/Chapter4_Part2_Notes_EN.json`, "utf8")).content;

function buildCh4Notes() {
  const p1 = ch4Part1Notes();
  const p2 = ch4Part2Notes();
  const intro = p1.slice(0, p1.findIndex((b) => b.type === "h1" && b.text?.startsWith("4.1"))); // title + Chapter Overview
  return {
    docs: [
      { id: "see-cs-ch4-1", blocks: [...intro, ...sliceByH1(p1, ["4.1"], ["4.2"])] },
      { id: "see-cs-ch4-2", blocks: sliceByH1(p1, ["4.2"], ["4.3"]) },
      {
        id: "see-cs-ch4-3",
        blocks: [...sliceByH1(p1, ["4.3"], ["__none__"]), ...sliceByH1(p2, ["4.3 Python Libraries"], ["4.5"])].flat(),
      },
      { id: "see-cs-ch4-4", blocks: sliceByH1(p2, ["4.5"], ["4.6"]) },
      { id: "see-cs-ch4-5", blocks: sliceByH1(p2, ["4.6"], ["4.7"]) },
      { id: "see-cs-ch4-6", blocks: sliceByH1(p2, ["4.7"], ["__none__"]) },
    ],
  };
}

/* ---------------------------------------------------------------- *
 * Firestore write
 * ---------------------------------------------------------------- */
async function patchDoc(docId, fields) {
  await patchChapterDoc(docId, fields);
  return { name: `chapters/${docId}` };
}

function docFields({ docId, num, titleEn, titleNe, blocks, questionSections }) {
  return {
    chapterId: { stringValue: docId },
    subjectId: { stringValue: "see-cs" },
    number: { integerValue: String(num) },
    classLevel: { stringValue: "10" },
    titleEn: { stringValue: titleEn },
    titleNe: { stringValue: titleNe },
    version: { integerValue: "1" },
    questions: { arrayValue: {} },
    questionBlocks: { arrayValue: {} },
    blocks: { arrayValue: { values: blocks } },
    questionSections: { arrayValue: { values: questionSections } },
  };
}

const readJson = (f) => JSON.parse(fs.readFileSync(f, "utf8"));

/* ---------------------------------------------------------------- *
 * Routing of ch4 solved-question sections to the 6 part docs
 * ---------------------------------------------------------------- */
function routeCh4Sections(sections, fromPart1) {
  const routed = { "see-cs-ch4-1": [], "see-cs-ch4-2": [], "see-cs-ch4-3": [], "see-cs-ch4-4": [], "see-cs-ch4-5": [], "see-cs-ch4-6": [] };
  for (const sec of sections) {
    const title = sec.mapValue.fields.section.mapValue.fields.en.stringValue;
    let target;
    if (/^Section A\b/i.test(title)) target = "see-cs-ch4-1";
    else if (/^Section B\b/i.test(title)) target = "see-cs-ch4-2";
    else if (/^Section [CDE]\b/i.test(title)) target = "see-cs-ch4-3";
    else if (/Concept in Practice 3|Concept in Practice 4/i.test(title)) target = "see-cs-ch4-3";
    else if (/Concept in Practice 5/i.test(title)) target = "see-cs-ch4-4";
    else if (/Lab Activity/i.test(title)) target = "see-cs-ch4-4";
    else if (/Concept in Practice 6|Concept in Practice 7/i.test(title)) target = "see-cs-ch4-5";
    else if (/Concept in Practice 8/i.test(title)) target = "see-cs-ch4-6";
    else if (/Additional SEE-Style/i.test(title)) target = fromPart1 ? "see-cs-ch4-3" : "see-cs-ch4-6";
    else if (/^Level \d/i.test(title)) target = "see-cs-ch4-6";
    else target = fromPart1 ? "see-cs-ch4-3" : "see-cs-ch4-6";
    routed[target].push(sec);
  }
  return routed;
}

/* ---------------------------------------------------------------- *
 * Main
 * ---------------------------------------------------------------- */
async function main() {
  const titles = {
    "see-cs-ch1": ["Computer Network And Telecommunication"],
    "see-cs-ch2": ["Database Management System"],
    "see-cs-ch3": ["Multimedia Technology"],
    "see-cs-ch5": ["AI Contemporary Technologies"],
  };

  const jobs = [];

  for (const n of [1, 2, 3, 5]) {
    const notes = readJson(`${SOURCE}/chapter_${n}/Chapter${n}_Notes_EN.json`);
    const solved = readJson(`${SOURCE}/chapter_${n}/Chapter${n}_Solved_Questions_EN.json`);
    const blocks = contentToBlocks(notes.content, n);
    const sections = parseSolvedQuestions(solved.content);
    const docId = `see-cs-ch${n}`;
    jobs.push({
      docId,
      num: n,
      titleEn: titles[docId][0],
      titleNe: titles[docId][0],
      blocks,
      questionSections: sections,
    });
  }

  // Chapter 4
  const part1Notes = ch4Part1Notes();
  const part2Notes = ch4Part2Notes();
  const ch4Docs = buildCh4Notes().docs;
  const ch4Titles = {
    "see-cs-ch4-1": "Programming In Python - 4.1 Basic Of Python",
    "see-cs-ch4-2": "Programming In Python - 4.2 User Defined Function",
    "see-cs-ch4-3": "Programming In Python - 4.3 Concept Of Modules, Packages and Library",
    "see-cs-ch4-4": "Programming In Python - 4.4 Error Handling",
    "see-cs-ch4-5": "Programming In Python - 4.5 File Handling",
    "see-cs-ch4-6": "Programming In Python - 4.6 Introduction To Data Visualization",
  };
  const p1Solved = parseSolvedQuestions(readJson(`${SOURCE}/chapter_4/Chapter4_Part1_Solved_Questions_EN.json`).content);
  const p2Solved = parseSolvedQuestions(readJson(`${SOURCE}/chapter_4/Chapter4_Part2_Solved_Questions_EN.json`).content);
  const ch4Routed = { "see-cs-ch4-1": [], "see-cs-ch4-2": [], "see-cs-ch4-3": [], "see-cs-ch4-4": [], "see-cs-ch4-5": [], "see-cs-ch4-6": [] };
  for (const id of Object.keys(ch4Routed)) {
    ch4Routed[id].push(...routeCh4Sections(p1Solved, true)[id], ...routeCh4Sections(p2Solved, false)[id]);
  }

  for (const d of ch4Docs) {
    jobs.push({
      docId: d.id,
      num: 4,
      titleEn: ch4Titles[d.id],
      titleNe: ch4Titles[d.id],
      blocks: contentToBlocks(d.blocks, 4),
      questionSections: ch4Routed[d.id],
    });
  }

  console.log(`Seeding ${jobs.length} Computer Science docs to Firestore…`);
  if (process.env.DRY_RUN) {
    for (const j of jobs) {
      console.log(`  ~ ${j.docId} — ${j.blocks.length} blocks, ${j.questionSections.length} question sections`);
      if (process.env.DEBUG_SECTIONS) {
        for (const s of j.questionSections) {
          const t = s.mapValue.fields.section.mapValue.fields.en.stringValue;
          const n = s.mapValue.fields.items.arrayValue.values.length;
          console.log(`      [${n}] ${t}`);
        }
      }
    }
    console.log("DRY_RUN: nothing written.");
    return;
  }
  for (const j of jobs) {
    const fields = docFields(j);
    await patchDoc(j.docId, fields);
    console.log(`  ✓ ${j.docId} — ${j.blocks.length} blocks, ${j.questionSections.length} question sections`);
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});