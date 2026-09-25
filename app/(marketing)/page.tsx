import Link from "next/link";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookMarked,
  Brain,
  CheckCircle2,
  ChevronRight,
  Highlighter,
  Lock,
  MonitorSmartphone,
  PieChart,
  ScanSearch,
  Sigma,
  Zap,
} from "lucide-react";
import { SubjectIcon } from "@/components/brand/SubjectIcon";
import { getSubjects } from "@/lib/data/subjects";
import type { Subject } from "@/lib/types";

const regions = [
  { name: "Bagmati", count: "2081 Paper + Solutions", width: "85%", dark: false },
  { name: "Gandaki", count: "2081 Paper + Solutions", width: "74%", dark: false },
  { name: "Koshi", count: "2081 Science + Maths", width: "68%", dark: false },
  { name: "Lumbini", count: "2081 Paper + Solutions", width: "62%", dark: false },
  { name: "Madhesh", count: "2081 Paper + Solutions", width: "58%", dark: false },
  { name: "Sudurpaschim", count: "2081 Paper + Solutions", width: "52%", dark: false },
  { name: "Karnali", count: "2081 Paper + Solutions", width: "50%", dark: true },
];

const stats = [
  { value: "7", accent: "Core", title: "Curriculum Subjects", body: "Aligned with latest Curriculum Development Centre (CDC) Nepal syllabus.", accentClass: "text-[#e1e0ff]" },
  { value: "80+", accent: "Units", title: "Detailed Chapters", body: "High-clarity modular summaries, formula sheets, and key theorems.", accentClass: "text-[#e1e0ff]" },
  { value: "1,000+", accent: "", title: "Solved Questions", body: "SEE past papers & model sets from 2074 to 2081 with mark allocation.", accentClass: "text-[#e1e0ff]" },
  { value: "100%", accent: "Free", title: "Accessible for All", body: "No paywalls, subscriptions, or login locks for Nepalese students.", accentClass: "text-[#7cfbb1]" },
];

const features = [
  {
    icon: BookMarked,
    tile: "bg-[#e1e0ff] text-[#2f30da]",
    title: "Clear Notes",
    body: "Structured step-by-step summaries written specifically for the Class 10 syllabus with clear visual diagrams and clean formulas.",
    chipIcon: BadgeCheck,
    chipColor: "text-[#2f30da]",
    chip: "Point-to-point revision",
  },
  {
    icon: ScanSearch,
    tile: "bg-[#007645]/[0.15] text-[#005b34]",
    title: "Solved Questions",
    body: "Model answers and SEE past-paper solutions with exact step-by-step mark distribution according to official CDC marking schemes.",
    chipIcon: Award,
    chipColor: "text-[#005b34]",
    chip: "Past 7 Years Solved",
  },
  {
    icon: MonitorSmartphone,
    tile: "bg-[#ffdad3] text-[#b5250c]",
    title: "Instant Search",
    body: "Jump directly to any formula, definition, scientific law, or geometry theorem in seconds without thumbing through pages.",
    chipIcon: Zap,
    chipColor: "text-[#b5250c]",
    chip: "Under 100ms lookup",
  },
  {
    icon: BookMarked,
    tile: "bg-[#e1e1f8] text-[#4b4ff2]",
    title: "Continue Anytime",
    body: "Seamlessly resume where you left off. Read smoothly on low-bandwidth connections across your phone, tablet, or home desktop.",
    chipIcon: MonitorSmartphone,
    chipColor: "text-[#4b4ff2]",
    chip: "Zero-install offline mode",
  },
];

export const revalidate = 3600;

export default async function HomePage() {
  const subjects = await getSubjects();
  const featured = subjects.filter((s) => !s.comingSoon).slice(0, 3);

  return (
    <div className="flex w-full flex-col">
      {/* ── Top Ambient Glow Accent ─────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[340px] w-[720px] -translate-x-1/2 rounded-full bg-[#4b4ff2]/10 blur-[130px]" />
        <div className="pointer-events-none absolute right-10 top-48 -z-10 h-[280px] w-[380px] rounded-full bg-[#fd583a]/10 blur-[100px]" />

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 pb-10 pt-6 lg:px-8 lg:pt-10">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-10">
            {/* Left Hero Content */}
            <div className="flex flex-col items-start gap-4 lg:col-span-7">
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-1 rounded-full bg-[#ffdad3] px-4 py-1 text-[#b5250c] shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#fd583a] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#fd583a]" />
                </span>
                <span className="font-sans text-[11px] font-bold uppercase tracking-[0.08em]">Built for Class 10 · SEE 2026</span>
              </div>

              {/* Massive Display Headline */}
              <h1 className="font-display text-[32px] leading-[38px] font-extrabold tracking-tight text-[#181a2b] lg:text-[68px] lg:leading-[72px] lg:tracking-[-0.035em]">
                Study smarter.
                <br />
                Understand <span className="text-[#4b4ff2]">every chapter.</span>
              </h1>

              {/* Subheading */}
              <p className="max-w-xl font-body text-[16px] leading-[26px] tracking-[-0.005em] text-[#454556]">
                Class 10 notes and solved questions, organized beautifully — so you always know exactly what to study next.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pb-1 pt-1">
                <a
                  href="/subjects"
                  className="inline-flex items-center justify-center gap-1 rounded-full bg-[#4b4ff2] px-10 py-2 text-[16px] font-semibold text-white shadow-[0_4px_18px_rgba(75,79,242,0.35),0_1px_2px_rgba(75,79,242,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(75,79,242,0.45)]"
                >
                  <span>Start Studying</span>
                  <ArrowRight className="h-[18px] w-[18px]" />
                </a>
                <a
                  href="#subjects-catalog"
                  className="inline-flex items-center justify-center gap-1 rounded-full bg-[#f4f2ff] px-6 py-2 text-[16px] font-semibold text-[#181a2b] transition-colors duration-150 hover:bg-[#edecff]"
                >
                  <BookMarked className="h-[18px] w-[18px] text-[#2f30da]" />
                  <span>Explore Subjects</span>
                </a>
              </div>

              {/* Social Proof & Trust Strip */}
              <div className="flex flex-wrap items-center gap-4 pb-1 pt-1 text-[#454556]">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-[18px] w-[18px] text-[#005b34]" />
                  <span className="font-body text-[13px] font-medium text-[#181a2b]">
                    SEE 2081 (2025) papers for all 7 provinces — 100% free for Nepalese students
                  </span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual */}
            <div className="relative mt-4 lg:col-span-5 lg:mt-0">
              {/* Main Mockup Container */}
              <div className="relative w-full rounded-[2rem] bg-[#ffffff] p-4 shadow-[0_2px_8px_rgba(24,26,43,0.04),0_20px_48px_rgba(24,26,43,0.08)] transition-transform duration-300 hover:-translate-y-1 sm:p-6">
                {/* Header bar of the study module */}
                <div className="flex items-center justify-between gap-2 pb-2">
                  <div className="flex items-center gap-1">
                    <span className="rounded-full bg-[#e1e0ff] px-2 py-0.5 font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-[#04006d]">
                      C. Mathematics
                    </span>
                    <span className="font-body text-sm text-[#454556]">•</span>
                    <span className="font-sans text-[12px] font-semibold text-[#454556]">Chapter 01</span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#f4f2ff] px-2 py-0.5 font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-[#005b34]">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#005b34] opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#005b34]" />
                    </span>
                    CDC Aligned
                  </span>
                </div>

                {/* Chapter Title & Progress */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-[20px] font-semibold tracking-tight text-[#181a2b]">Set Theory (Sets)</h3>
                    <span className="font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-[#4b4ff2]">72% Completed</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#edecff]">
                    <div className="h-full w-[72%] rounded-full bg-[#4b4ff2] transition-all duration-700" />
                  </div>
                </div>

                {/* Solved Question Preview Box */}
                <div className="mt-4 space-y-2 rounded-[1rem] bg-[#f4f2ff] p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-[#454556]">SEE MODEL Q.NO. 1</span>
                    <span className="rounded bg-[#edecff] px-1 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.08em] text-[#181a2b]">
                      Weightage 4 Marks
                    </span>
                  </div>
                  <p className="font-body text-[13px] font-medium leading-snug text-[#181a2b]">
                    In a survey of 100 students in Pokhara, 65 like tea, 45 like coffee, and 15 like neither. Find how many students like both tea and coffee using a Venn diagram.
                  </p>
                  {/* Step Breakdown Accordion Item */}
                  <div className="space-y-1 rounded-[1rem] bg-[#ffffff] p-2">
                    <div className="flex items-center justify-between text-[#005b34]">
                      <span className="flex items-center gap-1 font-sans text-[10px] font-bold uppercase tracking-[0.08em]">
                        <CheckCircle2 className="h-[14px] w-[14px]" /> Verified CDC Method
                      </span>
                      <span className="font-sans text-[10px] font-bold uppercase tracking-[0.08em] text-[#454556]">Step 2 of 3</span>
                    </div>
                    <p className="rounded bg-[#f4f2ff]/60 px-1 py-1 font-mono text-[12px] leading-relaxed text-[#181a2b]">
                      n(T ∪ C) = n(U) − n(T ∪ C)&apos; = 100 − 15 = 85<br />
                      n(T ∩ C) = 65 + 45 − 85 = <strong>25 students</strong>
                    </p>
                  </div>
                </div>

                {/* Micro Quick-actions inside card */}
                <div className="mt-4 flex items-center justify-between font-body text-sm text-[#454556]">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-[#005b34]" />
                    Topper Solution Attached
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[16px] font-semibold text-[#2f30da]">
                    Practice Chapter
                  </span>
                </div>
              </div>

              {/* Floating Formula Chip */}
              <div className="absolute -bottom-4 -right-2 z-20 flex items-center gap-1 rounded-full bg-[#2d2f41] px-4 py-1 text-[#f1efff] shadow-[0_10px_25px_rgba(0,0,0,0.18)] sm:-right-4">
                <Sigma className="h-4 w-4 text-[#7cfbb1]" />
                <span className="font-mono text-[11px] font-semibold tracking-tight text-[#f1efff]">n(A∪B) = n(A) + n(B) − n(A∩B)</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── STATS BAR ───────────────────────────────────────────────────── */}
      <section className="w-full bg-[#0E1020] py-10 text-[#f1efff]">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-10">
            {stats.map((s) => (
              <div key={s.title} className="flex flex-col gap-1">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-[32px] font-extrabold leading-[38px] text-[#ffffff] lg:text-[44px] lg:leading-[46px]">
                    {s.value}
                  </span>
                  {s.accent && <span className={`font-display text-[20px] font-bold ${s.accentClass}`}>{s.accent}</span>}
                </div>
                <h4 className="font-display text-[16px] font-semibold text-[#ffffff]">{s.title}</h4>
                <p className="font-body text-[13px] leading-[18px] text-[#c6c4d8]">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES: WHY SEE SATHI ─────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="mx-auto mb-10 flex max-w-3xl flex-col items-center space-y-1 text-center">
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-[#4b4ff2]">Why SEE Sathi</span>
          <h2 className="font-display text-[32px] font-bold leading-[38px] tracking-[-0.025em] text-[#181a2b]">
            Everything you need, nothing you don&apos;t.
          </h2>
          <p className="font-body text-[16px] leading-[26px] text-[#454556]">
            Crafted to strip away textbook fluff and deliver high-yield conceptual clarity right before examination day.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col rounded-[2rem] bg-[#ffffff] p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${f.tile}`}>
                <f.icon className="h-[26px] w-[26px]" />
              </div>
              <h3 className="mb-1 font-display text-[20px] font-semibold tracking-tight text-[#181a2b]">{f.title}</h3>
              <p className="flex-grow font-body text-[14px] leading-[22px] text-[#454556]">{f.body}</p>
              <div className="mt-4 flex items-center gap-1 rounded-[1rem] bg-[#f4f2ff]/50 p-1">
                <f.chipIcon className={`h-[18px] w-[18px] ${f.chipColor}`} />
                <span className="font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-[#454556]">{f.chip}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SUBJECTS SHOWCASE ───────────────────────────────────────────── */}
      <section id="subjects-catalog" className="w-full scroll-mt-24 bg-[#f4f2ff] py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="space-y-3">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-[#4b4ff2]">Explore</span>
              <h2 className="font-display text-[32px] font-bold leading-[38px] tracking-[-0.025em] text-[#181a2b]">
                Pick a subject and start studying.
              </h2>
              <p className="max-w-2xl font-body text-[16px] leading-[27px] text-[#454556]">
                Full curriculum notes, definitions, formula sheets, and past SEE solutions indexed neatly by subject.
              </p>
            </div>
            <div className="flex items-center gap-1 pb-1">
              <span className="rounded-full bg-[#edecff] px-4 py-1 font-sans text-[12px] font-semibold text-[#181a2b]">
                8 Class 10 Subjects Loaded
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((subject) => (
              <SubjectCardDesign key={subject.slug} subject={subject} />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href="/subjects"
              className="inline-flex items-center gap-2 rounded-full bg-[#181a2b] px-6 py-3 font-display text-[16px] font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
            >
              <span>View All Subjects</span>
              <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── PRODUCT PREVIEW: PEDAGOGICAL DESIGN ────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-6 lg:col-span-5">
            <div className="space-y-3">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-[#4b4ff2]">Pedagogical Design</span>
              <h2 className="font-display text-[32px] font-bold leading-[38px] tracking-[-0.025em] text-[#181a2b]">
                Made for studying, not just reading.
              </h2>
              <p className="font-body text-[16px] leading-[27px] text-[#454556]">
                Every chapter module is engineered around cognitive recall — so tricky physics laws and multi-step math theorems stick immediately.
              </p>
            </div>

            <div className="space-y-4 pt-1">
              <AnchorRow icon={Highlighter} tile="bg-[#e1e0ff] text-[#2f30da]" title="Interactive Formula Callouts" body="Key variables, SI units, and conditions highlighted with instant copy action." />
              <AnchorRow icon={PieChart} tile="bg-[#7cfbb1] text-[#005b34]" title="CDC Mark Distribution Cues" body="Clear badges indicating 1-mark recall, 2-mark short, and 4-mark long answer requirements." />
              <AnchorRow icon={Brain} tile="bg-[#ffdad3] text-[#b5250c]" title="Topper Memory Tricks & Traps" body="Notes on common pitfalls that cause Class 10 students to lose marks on the SEE answer sheet." />
            </div>

            <div className="pt-2">
              <a href="/subjects/science/electricity/notes" className="inline-flex items-center gap-1 font-display text-[16px] font-semibold text-[#4b4ff2] hover:underline">
                Test a live chapter module <ArrowRight className="h-[18px] w-[18px]" />
              </a>
            </div>
          </div>

          {/* Right Column: Live Chapter Mockup */}
          <div className="lg:col-span-7">
            <div className="space-y-5 rounded-[2rem] bg-[#ffffff] p-5 shadow-[0_4px_24px_rgba(24,26,43,0.06)] sm:p-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="h-3 w-3 rounded-full bg-[#ffdad6]" />
                  <span className="h-3 w-3 rounded-full bg-[#ffdad3]" />
                  <span className="h-3 w-3 rounded-full bg-[#7cfbb1]" />
                  <span className="ml-2 font-mono text-[12px] font-semibold text-[#454556]">Science · Unit 06</span>
                </div>
                <span className="rounded-full bg-[#edecff] px-2 py-0.5 font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-[#181a2b]">
                  Curriculum 2081/82
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-[#005b34]">PHYSICS · ELECTRICITY &amp; MAGNETISM</span>
                <h3 className="font-display text-[24px] font-bold tracking-[-0.02em] text-[#181a2b]">Ohm&apos;s Law &amp; Circuit Calculations</h3>
                <p className="font-body text-[14px] leading-[22px] text-[#454556]">
                  &ldquo;The electric current passing through a conductor is directly proportional to the potential difference across its ends, provided physical conditions remain constant.&rdquo;
                </p>
              </div>

              <div className="flex flex-col items-start justify-between gap-2 rounded-[1rem] bg-[#7cfbb1]/30 p-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <div className="font-mono text-[28px] font-extrabold tracking-wider text-[#005b34]">V = I × R</div>
                  <div className="space-y-0.5 text-[12px] font-mono text-[#454556]">
                    <div>V = Potential Difference (Volts, V)</div>
                    <div>I = Electric Current (Amperes, A)</div>
                    <div>R = Electrical Resistance (Ohms, Ω)</div>
                  </div>
                </div>
                <button className="shrink-0 rounded-full bg-[#ffffff] px-2 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-[#005b34] shadow-sm transition-colors hover:bg-[#fbf8ff]">
                  Copy Formula
                </button>
              </div>

              <div className="space-y-1 rounded-[1rem] bg-[#f4f2ff] p-4">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-[#181a2b]">SEE 2079 Question (3 Marks)</span>
                  <span className="rounded-full bg-[#ffffff] px-1 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.08em] text-[#005b34]">
                    Step-by-step CDC solution
                  </span>
                </div>
                <p className="font-body text-[13px] leading-[18px] text-[#181a2b]">
                  A heater of 1000W operates at 220V. Calculate its resistance and current drawn.
                </p>
                <div className="rounded bg-[#ffffff] p-1 font-mono text-[12px] leading-relaxed text-[#454556]">
                  1. Current (I) = P / V = 1000 / 220 = <strong>4.55 Amperes</strong> [1 Mark]<br />
                  2. Resistance (R) = V / I = 220 / 4.55 = <strong>48.4 Ω</strong> [2 Marks]
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STUDENT COMMUNITY MOSAIC ────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-10 lg:px-8">
        <div className="rounded-[3rem] bg-[#ffffff] p-6 shadow-sm lg:p-10">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="space-y-2 lg:col-span-5">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-[#b5250c]">Nepal-Wide Community</span>
              <h3 className="font-display text-[32px] font-bold leading-[38px] tracking-[-0.025em] text-[#181a2b]">
                Designed with students across all 7 provinces.
              </h3>
              <p className="font-body text-[14px] leading-[22px] text-[#454556]">
                From remote schools in Solukhumbu to dense campuses in Lalitpur and Pokhara — SEE Sathi is lightweight, offline-ready, and built to level the playing field for every single student.
              </p>
              <div className="flex items-center gap-4 pt-1 font-body text-sm text-[#181a2b]">
                <span className="flex items-center gap-1">
                  <Zap className="h-[18px] w-[18px] text-[#005b34]" /> Fast 2G/3G loading
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 items-stretch gap-2 sm:grid-cols-3 lg:col-span-7 lg:gap-3">
              {regions.map((r) => (
                <div key={r.name} className="flex flex-col gap-1.5 rounded-[1rem] bg-[#f4f2ff] p-3">
                  <span className="truncate font-display text-[15px] font-semibold leading-tight text-[#181a2b]" title={r.name}>
                    {r.name}
                  </span>
                  <span className="truncate font-sans text-[10px] font-bold uppercase tracking-[0.08em] text-[#454556]" title={r.count}>
                    {r.count}
                  </span>
                  <div className="mt-auto flex w-full items-end pt-1.5">
                    <div className="h-1 w-full rounded-full bg-[#edecff]">
                      <div className={`h-1 rounded-full ${r.dark ? "bg-[#007645]" : "bg-[#4b4ff2]"}`} style={{ width: r.width }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DARK CTA ────────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden bg-[#0E1020] py-10 text-[#f1efff]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#4b4ff2]/15 via-transparent to-[#fd583a]/10" />
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 text-center lg:px-8">
          <div className="inline-flex items-center gap-1 rounded-full bg-white/10 px-4 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-[#e1e0ff] shadow-sm backdrop-blur-md">
            <Zap className="h-[14px] w-[14px] text-[#7cfbb1]" />
            <span>SEE 2026 Ready</span>
          </div>
          <h2 className="max-w-2xl font-display text-[32px] font-extrabold tracking-tight text-[#ffffff] lg:text-[44px] lg:leading-[48px]">
            Your next chapter is waiting.
          </h2>
          <p className="max-w-xl font-body text-[16px] leading-[26px] text-[#c6c4d8]">
            Study notes, solved past papers, and step-by-step solutions for every Class 10 subject — free across all 7 provinces.
          </p>
          <div className="pt-1">
            <a
              href="/subjects"
              className="inline-flex items-center justify-center gap-1 rounded-full bg-[#4b4ff2] px-10 py-2 text-[16px] font-semibold text-white shadow-[0_6px_22px_rgba(75,79,242,0.42),0_2px_4px_rgba(75,79,242,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(75,79,242,0.55)]"
            >
              <span>Explore All Subjects</span>
              <ArrowRight className="h-[18px] w-[18px]" />
            </a>
          </div>
          <p className="pt-1 font-body text-[13px] leading-[18px] text-[#c6c4d8]/80">
            No credit card or payment required. Free forever for all Nepalese students.
          </p>
        </div>
      </section>
    </div>
  );
}

const subjectMeta: Record<string, { sub: string; from: string; to: string; tile: string }> = {
  mathematics: { sub: "12 Chapters · 240 Qs", from: "Sets, Compound Interest, Mensuration, Geometry proofs, Trigonometry, and Statistics with step solutions.", to: "Full Formulas", tile: "calculate" },
  science: { sub: "18 Chapters · 310 Qs", from: "Force & Motion, Chemical Reactions, Heredity, Ohm's Law, Astronomical Universe, and Ecology.", to: "Diagram Sets", tile: "science" },
  english: { sub: "10 Chapters · 180 Qs", from: "Reading comprehension passages, guided essays, formal letters, voice, narration, and sentence transformation.", to: "Grammar Rules", tile: "translate" },
  nepali: { sub: "14 Chapters · 195 Qs", from: "शब्दवर्ग, पदयोग र पदवियोग, भावविस्तार, कथा र कविता व्याख्या, र विवेचनात्मक उत्तर लेखन नमुनाहरू।", to: "व्याकरण ब्यांक", tile: "history_edu" },
  "social-studies": { sub: "9 Chapters · 160 Qs", from: "Our Society, Governance, Constitution, Nepal Map drawing technique, International Relations, and Contemporary Events.", to: "Map Guidelines", tile: "public" },
  "optional-mathematics": { sub: "11 Chapters · 210 Qs", from: "Matrices, Coordinate Geometry, Trigonometric Identities, Vectors, Transformation, and Inversion geometry.", to: "Proof Formulas", tile: "square_foot" },
  "computer-science": { sub: "8 Chapters · 140 Qs", from: "QBASIC programming modular procedures, C fundamentals, Database Management Systems (MS-Access), Network Topologies, and Cyber Law.", to: "Code Exercises", tile: "terminal" },
  "health-population-environment": { sub: "11 Chapters · 165 Qs", from: "Human health, nutrition and food safety, sanitation and first aid, adolescence, family life education, population growth and environment conservation.", to: "Healthy Living", tile: "heart" },
};

const subjectPills: Record<string, { bg: string; text: string }> = {
  mathematics: { bg: "#e1e0ff", text: "#04006d" },
  science: { bg: "#7cfbb1", text: "#002110" },
  english: { bg: "#ffdad3", text: "#3f0400" },
  nepali: { bg: "#fef3c7", text: "#78350f" },
  "social-studies": { bg: "#fce7f3", text: "#831843" },
  "optional-mathematics": { bg: "#e0f2fe", text: "#0c4a6e" },
  "computer-science": { bg: "#edecff", text: "#181a2b" },
  "health-population-environment": { bg: "#d0f5ea", text: "#0b6b5a" },
};

const subjectIcons: Record<string, { bg: string; color: string; hover: string }> = {
  mathematics: { bg: "#e1e0ff", color: "#2f30da", hover: "#2f30da" },
  science: { bg: "#7cfbb1", color: "#005b34", hover: "#005b34" },
  english: { bg: "#ffdad3", color: "#b5250c", hover: "#b5250c" },
  nepali: { bg: "#fef3c7", color: "#92400e", hover: "#92400e" },
  "social-studies": { bg: "#fce7f3", color: "#9d174d", hover: "#9d174d" },
  "optional-mathematics": { bg: "#e0f2fe", color: "#075985", hover: "#075985" },
  "computer-science": { bg: "#edecff", color: "#2f30da", hover: "#2f30da" },
  "health-population-environment": { bg: "#d0f5ea", color: "#0b6b5a", hover: "#0b6b5a" },
};

function SubjectCardDesign({ subject }: { subject: Subject }) {
  const meta = subjectMeta[subject.slug];
  const pill = subjectPills[subject.slug];
  const icon = subjectIcons[subject.slug];
  const typeLabel =
    subject.slug === "nepali" ? "अनिवार्य (Compulsory)" : subject.type === "Compulsory" ? "Compulsory" : `Elective ${subject.type.includes("I") ? "I" : "II"}`;

  return (
    <div className="group flex flex-col rounded-[2rem] bg-[#ffffff] p-6 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full px-2 py-0.5 font-sans text-[11px] font-bold uppercase tracking-[0.08em]" style={{ backgroundColor: pill.bg, color: pill.text }}>
          {typeLabel}
        </span>
        <span className="font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-[#454556]">{meta.sub}</span>
      </div>

      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: icon.bg, color: icon.color }}>
          <SubjectIcon icon={subject.icon} className="h-[22px] w-[22px]" />
        </div>
        <h3 className="font-display text-[24px] font-bold tracking-[-0.02em] transition-colors" style={{ ["--hover" as string]: icon.hover }}>
          <span className="text-[#181a2b] transition-colors group-hover:text-[var(--hover)]">{subject.name}</span>
        </h3>
      </div>

      <p className="mb-4 font-body text-[14px] leading-[22px] text-[#454556]">{meta.from}</p>

<div className="mt-auto flex items-center justify-between pt-2">
        {subject.comingSoon ? (
          <span className="inline-flex items-center gap-1 font-display text-[16px] font-semibold text-[#8e8ea0]">
            <Lock className="h-[16px] w-[16px]" aria-hidden="true" />
            Coming Soon
          </span>
        ) : (
          <a
            href={`/subjects/${subject.slug}`}
            className="inline-flex items-center gap-1 font-display text-[16px] font-semibold transition-transform group-hover:translate-x-1"
            style={{ color: icon.color }}
          >
            <span>{subject.slug === "nepali" ? "विषय खोल्नुहोस्" : "Open Subject"}</span>
            <ChevronRight className="h-[18px] w-[18px]" />
          </a>
        )}
      </div>
    </div>
  );
}

function AnchorRow({ icon: Icon, tile, title, body }: { icon: typeof Highlighter; tile: string; title: string; body: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${tile}`}>
        <Icon className="h-[18px] w-[18px]" />
      </div>
      <div className="space-y-1">
        <h4 className="font-display text-[16px] font-semibold text-[#181a2b]">{title}</h4>
        <p className="font-body text-[13px] leading-[20px] text-[#454556]">{body}</p>
      </div>
    </div>
  );
}