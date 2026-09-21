# SEE Sathi — Web App Build Specification (design.md)

This is the master build document for the SEE Sathi web app. It's meant to be handed to an AI coding assistant (Claude Code, Cursor, etc.) in two phases:

- **Phase 1** — build the exact UI from the Stitch designs, using placeholder/mock data. No Firebase yet.
- **Phase 2** — replace the mock data layer with real Firebase (Firestore + Storage + Auth), using your existing seeded content.

Keep this file in the root of the repo (`/design.md`) so the AI assistant can reference it throughout the build.

---

## 1. Project Overview

**Product:** SEE Sathi — a web study companion for Class 10 (SEE) students in Nepal, with subject → chapter → notes/solved-questions browsing, search, and bookmarking.

**Companion product:** A mobile app already exists using the same Firebase content (subjects, chapters, notes, solved questions). The web app must read from the **same Firestore collections** — do not duplicate or restructure content, only add web-specific user data (bookmarks, reading position) as needed.

**Design source:** Google Stitch exports (attach/upload the exported screens or screenshots for each page listed in Section 5 before starting Phase 1 — the AI assistant should treat those as the exact visual reference, matching spacing, type sizes, colors, and icon placement as closely as the framework allows).

---

## 2. Tech Stack

```
Framework: Next.js 14+ (App Router)
Styling: Tailwind CSS + a small tokens file for the design system (colors, type scale, radii)
Icons: lucide-react as the base icon set, custom SVGs for subject badges if the Stitch export has bespoke icons
Fonts: next/font — one bold display sans (e.g. "Clash Display" / "General Sans" / "Satoshi") for headings, Inter for body, Noto Sans Devanagari for Nepali text
State/data: React Server Components + Firestore for data; small client-side context only for auth/user state
Backend: Firebase — Firestore (content + user data), Firebase Storage (images), Firebase Auth (email/password + Google)
Search: client-side search over a small denormalized index collection to start (see Section 8); can upgrade to Algolia/Typesense later if needed
Hosting: Vercel (recommended) or Firebase Hosting
```

---

## 3. Design System Reference

*(Condensed from the brand system already established in Stitch — keep this file as the single source of truth so code and design never drift apart.)*

```css
/* Colors */
--ink: #0E1020;            /* primary text, dark sections */
--paper: #FFFFFF;
--paper-warm: #F7F6F2;     /* alternate section background */
--brand-primary: #4B4FF2;  /* Electric Indigo — buttons, links, active states */
--brand-secondary: #FF5A3C;/* Coral — highlights, badges, emphasis */
--success: #2FB673;        /* correct answers, progress */
--muted: #5B5E6E;          /* secondary text */

/* Subject accent colors */
--subject-math: #4B4FF2;      /* Indigo */
--subject-science: #2FB673;   /* Green */
--subject-english: #FF5A3C;   /* Coral */
--subject-nepali: #F0A93C;    /* Amber */
--subject-social: #E85D75;    /* Rose */
--subject-optmath: #2FB6A8;   /* Teal */
--subject-cs: #5B6EE8;        /* Slate blue */

/* Type scale */
--text-hero: 64px/1.05;    /* homepage hero only */
--text-h1: 48px/1.1;
--text-h2: 32px/1.2;
--text-h3: 22px/1.3;
--text-body: 17px/1.7;
--text-small: 14px/1.5;
--text-eyebrow: 12px/1.4;  /* uppercase, +6% letter-spacing */

/* Radii & shadows */
--radius-card: 16px;
--radius-button: 999px;    /* pill buttons */
--radius-input: 12px;
--shadow-soft: 0 4px 16px rgba(14,16,32,0.06);
--shadow-glow-primary: 0 8px 24px rgba(75,79,242,0.18);
```

Set these up as Tailwind theme extensions (`tailwind.config.ts`) plus a `subjectColors` lookup map keyed by subject slug, so every component pulls color from data instead of hardcoding per-subject styles.

---

## 4. Folder Structure

```
/app
  /(marketing)
    page.tsx                 → Homepage
    /login/page.tsx
    /signup/page.tsx
  /(app)
    /subjects/page.tsx
    /subjects/[subjectSlug]/page.tsx
    /subjects/[subjectSlug]/[chapterSlug]/page.tsx
    /subjects/[subjectSlug]/[chapterSlug]/notes/page.tsx
    /subjects/[subjectSlug]/[chapterSlug]/questions/page.tsx
    /subjects/[subjectSlug]/[chapterSlug]/questions/[questionId]/page.tsx
    /search/page.tsx
    /saved/page.tsx
    /profile/page.tsx
    /settings/page.tsx
  /not-found.tsx              → 404
/components
  /layout (Header, Footer)
  /brand (Logo, SubjectIcon, SubjectBadge)
  /content (NotesRenderer, DefinitionBlock, FormulaBlock, ExampleBlock, ImageWithCaption)
  /cards (SubjectCard, ChapterRow, QuestionRow)
  /ui (Button, Input, Pill, SearchBar)
/lib
  /firebase (config.ts, firestore.ts, storage.ts, auth.ts)
  /data (subjects.ts, chapters.ts, notes.ts, questions.ts, search.ts, bookmarks.ts)
  /mock (mockSubjects.ts, mockChapters.ts, mockNotes.ts, mockQuestions.ts)   ← Phase 1 only
/design.md                    ← this file
```

---

## 5. Site Map / Pages to Build

```
Public: Homepage, Login, Sign Up
App: Subjects (index), Subject (chapter list), Chapter (notes/questions choice),
     Notes/Lecture page, Solved Questions list, Question detail,
     Search, Saved, Profile, Settings
System: 404, loading states, empty states
```

Every page shares the same **Header** and **Footer** components (Section 4). No sidebar, no dashboard shell — navigation happens via links between full pages, per the finalized design direction.

---

## 6. PHASE 1 — Static Build Prompt (match the design exactly, no Firebase yet)

Copy everything in the box below into your AI coding assistant (Claude Code, Cursor, etc.) as the first task. Attach the Stitch screen exports/screenshots alongside it, one per page if possible.

```
You are building the frontend for "SEE Sathi," a Class 10 SEE study web app for students in Nepal. Read /design.md in this repo fully before starting — it has the full design system, folder structure, and page list.

GOAL FOR THIS PHASE: Build every page listed in design.md Section 5, matching the attached Stitch design exports as closely as possible — exact layout, spacing, type sizes, colors, icon placement, and component structure. Use MOCK DATA ONLY in this phase (create /lib/mock/*.ts files with realistic placeholder content for at least 2 subjects, 3 chapters each, sample notes content blocks, and 5 sample solved questions per chapter). Do NOT connect to Firebase yet — that is Phase 2.

STACK: Next.js 14 App Router, TypeScript, Tailwind CSS, lucide-react icons, next/font (one bold display sans for headings, Inter for body, Noto Sans Devanagari available for Nepali text).

REQUIREMENTS:
1. Set up the Tailwind theme using the exact tokens in design.md Section 3 (colors, type scale, radii, shadows) as theme extensions — do not hardcode hex values inside components.
2. Build shared Header and Footer components first, used on every page (no sidebar, no app-shell — plain website navigation via links).
3. Build the component library first (Button, Pill, Input, SearchBar, SubjectCard, ChapterRow, QuestionRow, SubjectIcon/Badge, and the notes content blocks: Paragraph, DefinitionBlock, ExampleBlock, FormulaBlock, ImageWithCaption, TipCallout) — these get reused across pages.
4. Build each page from design.md Section 5, wiring them to the mock data via a thin /lib/data layer (functions like getSubjects(), getChapter(subjectSlug, chapterSlug)) — structure these functions now so that in Phase 2 we only need to swap their internal implementation from "read mock array" to "read Firestore," without changing any component code.
5. Make every page fully responsive (mobile + desktop), matching the mobile variants in the Stitch export where provided.
6. Implement basic client-side routing/navigation exactly as a normal website: clicking a subject goes to its page, clicking "Notes"/"Questions" goes to the right nested route, breadcrumbs are real links.
7. Add loading skeletons and empty states matching the "System" page list in design.md, even though mock data won't usually trigger them — stub them so Phase 2 can use them immediately.
8. Do not add authentication logic yet — Login/Sign Up pages should be static UI only, form submission can just log to console for now.

Work page by page, starting with Homepage, then Subjects, Subject, Chapter, Notes/Lecture page, Solved Questions list, Question detail, then the remaining pages (Login, Sign Up, Search, Saved, Profile, Settings, 404). After each page, briefly summarize what was built before moving to the next.
```

---

## 7. Firebase Data Model (Firestore Schema)

This assumes your mobile app already writes to Firestore in roughly this shape — adjust field names below to match your actual existing schema before Phase 2 (paste your real Firestore export/screenshot into the Phase 2 prompt if the shape differs).

```
/subjects/{subjectId}
  - name: string                  ("Mathematics")
  - slug: string                  ("mathematics")
  - order: number
  - accentColor: string           ("#4B4FF2")
  - chapterCount: number

/subjects/{subjectId}/chapters/{chapterId}
  - title: string                 ("Sets")
  - slug: string                  ("sets")
  - number: number                (1)
  - description: string
  - hasNotes: boolean
  - hasQuestions: boolean

/subjects/{subjectId}/chapters/{chapterId}/notes/{sectionId}
  - order: number
  - type: "heading" | "paragraph" | "definition" | "example" | "formula" | "image" | "tip" | "warning"
  - content: string               (or structured object depending on type)
  - imageUrl: string              (Firebase Storage URL, if type === "image")
  - caption: string               (if type === "image")

/subjects/{subjectId}/chapters/{chapterId}/questions/{questionId}
  - order: number
  - questionText: string
  - steps: array<string>          (solution steps, in order)
  - answer: string
  - imageUrl: string (optional)

/users/{userId}
  - name: string
  - email: string
  - photoUrl: string
  - enrolledSubjects: array<string>   (subject IDs)

/users/{userId}/bookmarks/{bookmarkId}
  - type: "notes" | "question"
  - subjectId: string
  - chapterId: string
  - questionId: string (if type === "question")
  - createdAt: timestamp

/users/{userId}/recentlyViewed/{entryId}
  - subjectId, chapterId, type, lastSectionId (for notes) or lastQuestionId (for questions)
  - updatedAt: timestamp

/searchIndex/{entryId}      (optional denormalized collection for fast client search)
  - type: "chapter" | "notes" | "question"
  - title: string
  - snippet: string
  - subjectId, chapterId, sectionId/questionId
  - keywords: array<string>   (lowercased words for simple search matching)
```

> **Before Phase 2:** export or screenshot your actual Firestore structure and paste it into the Phase 2 prompt below in place of the schema above, so the AI assistant maps to your real field names instead of guessing.

---

## 8. Firebase Setup (env & config)

```
.env.local
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

`/lib/firebase/config.ts` should initialize the Firebase app once (guarding against re-initialization in Next.js dev mode with hot reload) and export `db` (Firestore), `storage`, and `auth` instances for use across `/lib/data/*.ts`.

**Do not commit `.env.local`** — add it to `.gitignore` if not already there. When you're ready to wire Firebase in, provide the real key/URL values directly to your coding assistant in the working session (not pasted into this document) so they only ever live in the local env file.

---

## 9. PHASE 2 — Dynamic Firebase Integration Prompt

Only run this after Phase 1 is complete and you have your real Firebase project keys ready. Paste your real Firestore schema (screenshot or export) in place of Section 7 above if it differs.

```
You are continuing work on "SEE Sathi." Phase 1 (static UI matching the Stitch design, using mock data) is complete. Read /design.md fully, especially Section 7 (Firestore schema) and Section 8 (env setup) — I've now added real Firebase keys to .env.local.

GOAL FOR THIS PHASE: Replace the mock data layer with real Firebase, without changing any component code — only the internals of /lib/data/*.ts functions should change from "read mock array" to "read Firestore."

REQUIREMENTS:
1. Set up /lib/firebase/config.ts to initialize Firebase using the NEXT_PUBLIC_FIREBASE_* env vars, exporting db (Firestore), storage, and auth.
2. Implement each function in /lib/data/*.ts to query Firestore per the schema in design.md Section 7:
   - getSubjects() → all subjects, ordered by `order`
   - getSubject(slug) → single subject by slug
   - getChapters(subjectId) → chapters for a subject, ordered by `number`
   - getChapter(subjectId, chapterSlug) → single chapter
   - getNotes(subjectId, chapterId) → ordered notes sections, mapped to the content-block types already rendered in Phase 1 (heading, paragraph, definition, example, formula, image, tip, warning)
   - getQuestions(subjectId, chapterId) → ordered solved questions
   - getQuestion(subjectId, chapterId, questionId) → single question with steps + answer
3. Wire Firebase Storage image URLs into the ImageWithCaption component — use next/image with the Storage download URL, add a blur placeholder if feasible.
4. Implement Firebase Auth (email/password + Google) for Login and Sign Up pages — on success, create/update the corresponding /users/{userId} document if it doesn't exist yet.
5. Implement bookmarking: writing to /users/{userId}/bookmarks/{bookmarkId} on the bookmark icon/button across Notes, Question Detail, and anywhere else bookmarking appears in the design; the Saved page should read from this collection live.
6. Implement "recently viewed" / "continue reading": on visiting a Notes or Question page while logged in, upsert an entry in /users/{userId}/recentlyViewed; use the most recent entry to power the "Continue studying" section on the Homepage/relevant page for logged-in users.
7. Implement Search: start with a simple client-side search against the /searchIndex collection (fetch once, cache in memory, filter by keyword match against title/snippet/keywords) — structure this behind a getSearchResults(query) function so it can be swapped for Algolia/Typesense later without touching the Search page component.
8. Add proper loading and error states around every Firestore call, using the skeleton/error components already stubbed in Phase 1 — never show a blank white page or a raw Firebase error to the user.
9. Add basic Firestore security rules: public read access to /subjects, /chapters, /notes, /questions; authenticated-user-only read/write to /users/{userId}/** scoped to their own uid.

Work through the /lib/data/*.ts functions first, verify each against real Firestore data (log sample output), then move to Auth, then Bookmarks/Recently Viewed, then Search. Confirm each piece works against real data before moving to the next.
```

---

## 10. Handoff Checklist

Before starting Phase 1 with your coding assistant:
- [ ] Export/screenshot every Stitch screen and have them ready to attach page-by-page
- [ ] Confirm the tech stack in Section 2 (or tell me what to change)
- [ ] Confirm subject list and slugs (e.g. `mathematics`, `science`, `english`, `nepali`, `social-studies`, `optional-mathematics`, `computer-science`)

Before starting Phase 2:
- [ ] Firebase project keys ready (do not paste them into this file — provide them directly in your coding session's env setup)
- [ ] A real Firestore schema export/screenshot, to replace the assumed schema in Section 7 if it differs
- [ ] Firebase Storage already contains the seeded images referenced by your notes content
