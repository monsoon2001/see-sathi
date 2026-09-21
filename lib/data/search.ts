// Client-side search over a broadened in-memory index.
// The index is derived from mockChapters + mockQuestions at runtime,
// so coverage always matches the study hub, plus thin curated notes/formulas.
// Phase 2 (future): replace with a fetched /searchIndex for the full corpus.
import { mockChapters } from "@/lib/mock/mockChapters";
import { mockQuestions } from "@/lib/mock/mockQuestions";
import { mockSearchIndex } from "@/lib/mock/mockSaved";
import type { SearchResult } from "@/lib/types";

const SUBJECT_LABELS: Record<string, string> = {
  mathematics: "Compulsory Math",
  "optional-mathematics": "Optional Math",
  science: "Science & Tech",
  english: "English",
  nepali: "Compulsory Nepali",
  "social-studies": "Social Studies",
  "computer-science": "Computer Science",
};

const SUBJECT_SYNONYMS: Record<string, string[]> = {
  mathematics: ["mathematics", "maths", "math", "compulsory math", "algebra", "geometry"],
  "optional-mathematics": ["optional math", "optional mathematics"],
  science: ["science", "physics", "chemistry", "biology", "technology", "zoo", "botany", "pressure", "heat", "wave", "refraction", "lens", "electricity", "magnet", "universe", "planet", "ict", "elements", "periodic", "gases", "metals", "hydrocarbon", "chemical", "reaction", "daily life"],
  english: ["english", "grammar", "literature"],
  nepali: ["nepali", "नेपाली", "कविता", "कथा", "निबन्ध", "शब्दभण्डार", "व्याकरण", "भावविस्तार"],
  "social-studies": ["social", "social studies", "samajik"],
  "computer-science": ["computer", "computer science", "python", "networking", "dbms", "it"],
};

function wordsOf(value: string | undefined | null): string[] {
  return (value ?? "").split(/\W+/).filter(Boolean);
}

function buildChapterResults(): SearchResult[] {
  const out: SearchResult[] = [];
  for (const [subjectSlug, chapters] of Object.entries(mockChapters)) {
    const subjectLabel = SUBJECT_LABELS[subjectSlug] ?? subjectSlug;
    for (const c of chapters) {
      out.push({
        id: `chapter-${subjectSlug}-${c.slug}`,
        type: "chapter",
        title: c.title,
        snippet: c.description,
        subjectSlug,
        chapterSlug: c.slug,
        keywords: [...wordsOf(subjectLabel), ...(SUBJECT_SYNONYMS[subjectSlug] ?? []), ...wordsOf(c.title), c.group ?? "", c.highYield ? "high yield" : "weightage"],
      });
    }
  }
  // Social Studies units (encounters only through the lesson grid) — index the
  // units themselves so "unit 1 … unit 10" + Nepali unit names are searchable
  // with real counts, without needing to fetch every Firestore lesson.
  const socUnitTitles: [string, string][] = [
    ["Unit 1", "एकाइ १: हामी र हाम्रो समाज"],
    ["Unit 2", "एकाइ २: विकास र विकासका पूर्वाधार"],
    ["Unit 3", "एकाइ ३: हाम्रा सामाजिक मूल्य र मान्यता"],
    ["Unit 4", "एकाइ ४: सामाजिक समस्या र समाधान"],
    ["Unit 5", "एकाइ ५: नागरिक चेतना"],
    ["Unit 6", "एकाइ ६: हाम्रो पृथ्वी (भूगोल)"],
    ["Unit 7", "एकाइ ७: नेपालको इतिहास"],
    ["Unit 8", "एकाइ ८: आर्थिक क्रियाकलाप"],
    ["Unit 9", "एकाइ ९: अन्तर्राष्ट्रिय सम्बन्ध र सङ्घसंस्थाहरू"],
    ["Unit 10", "एकाइ १०: जनसङ्ख्या र यसको व्यवस्थापन"],
  ];
  for (const [title, neTitle] of socUnitTitles) {
    const slug = title.replace(/\s+/g, "-").toLowerCase();
    out.push({
      id: `social-unit-${slug}`,
      type: "chapter",
      title,
      snippet: neTitle,
      subjectSlug: "social-studies",
      chapterSlug: slug,
      keywords: [...wordsOf(title), ...wordsOf(neTitle), "social", "social studies", "samajik"],
    });
  }
  return out;
}

function buildQuestionResults(): SearchResult[] {
  const out: SearchResult[] = [];
  for (const [key, questions] of Object.entries(mockQuestions)) {
    const [subjectSlug, chapterSlug] = key.split("/");
    if (!subjectSlug || !chapterSlug) continue;
    for (const q of questions) {
      const text = q.questionText.replace(/\s+/g, " ").trim();
      out.push({
        id: `question-${subjectSlug}-${chapterSlug}-${q.id}`,
        type: "question",
        title: `${q.group} · ${q.marks} Marks`,
        snippet: text.slice(0, 180),
        subjectSlug,
        chapterSlug,
        questionId: q.id,
        keywords: [...wordsOf(text), ...(SUBJECT_SYNONYMS[subjectSlug] ?? []), ...(q.tags ?? []).flatMap((t) => wordsOf(t)), q.group ?? "", q.source ?? ""],
      });
    }
  }
  return out;
}

function buildCuratedResults(): SearchResult[] {
  return mockSearchIndex.filter((r) => r.type === "note" || r.type === "formula");
}

let cachedIndex: SearchResult[] | null = null;

export function getSearchIndex(): SearchResult[] {
  if (cachedIndex) return cachedIndex;
  const seen = new Set<string>();
  const out: SearchResult[] = [];
  for (const item of [...buildChapterResults(), ...buildQuestionResults(), ...buildCuratedResults()]) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  cachedIndex = out;
  return out;
}

export function getSearchResults(query: string, extra?: SearchResult[]): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const tokens = q.split(/\s+/).filter(Boolean);
  const phrase = tokens.join(" ");

  const index = [...getSearchIndex(), ...(extra ?? [])];

  const scored = index
    .map((item) => {
      const title = item.title.toLowerCase();
      const snippet = item.snippet.toLowerCase();
      const keywords = item.keywords.map((k) => k.toLowerCase());
      const full = `${title} ${snippet} ${keywords.join(" ")}`;

      let score = 0;
      if (full.includes(phrase)) score += 50;
      for (const token of tokens) {
        if (title.includes(token)) score += 14;
        if (keywords.some((k) => k.includes(token))) score += 9;
        if (snippet.includes(token)) score += 5;
        if (title.split(/\s+/).some((w) => w.startsWith(token) && w.length >= 3)) score += 4;
      }
      return { item, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map((r) => r.item);
}

export function getSearchSuggestions(): SearchResult[] {
  return getSearchIndex().slice(0, 4);
}