import {
  Atom,
  ClipboardList,
  Clock,
  Dna,
  FlaskConical,
  Globe,
  GraduationCap,
  ListChecks,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";

const keyStats = [
  {
    icon: ClipboardList,
    value: "100",
    unit: "Full Marks",
    sub: "Theory: 75 Marks | Internal/Practical: 25 Marks",
    accent: "bg-primary-fixed text-primary",
  },
  {
    icon: Timer,
    value: "3 Hours",
    unit: "Total Exam Time (Theory)",
    sub: "Official classroom question-paper duration",
    accent: "bg-tertiary-fixed text-tertiary",
  },
  {
    icon: Clock,
    value: "160 Hours",
    unit: "Curriculum Working Hours",
    sub: "≈ 5 Credit Hours per week across the year",
    accent: "bg-secondary-fixed text-on-secondary-fixed-variant",
  },
];

const specGrid = [
  { cat: "Very Short Answer (VSA)", perQ: "1 Mark", count: "9", total: "9 Marks", domain: "Knowledge and Recall" },
  { cat: "Short Answer (SA)", perQ: "2 Marks", count: "14", total: "28 Marks", domain: "Understanding and Comprehension" },
  { cat: "Long Answer (LA)", perQ: "3 Marks", count: "8", total: "24 Marks", domain: "Application (e.g., Numericals, Diagrams)" },
  { cat: "Higher Ability (HA)", perQ: "4 Marks", count: "3", total: "12 Marks", domain: "Critical Thinking, Analysis & Evaluation" },
];

interface ChapterEstimate {
  topic: string;
  detail: string;
  range: string;
  hours: string;
}

interface DomainBlock {
  icon: typeof Atom;
  emoji: string;
  title: string;
  marks: string;
  accentClass: string;
  desc: string;
  chapters: ChapterEstimate[];
}

const domains: DomainBlock[] = [
  {
    icon: Atom,
    emoji: "🪐",
    title: "Physics",
    marks: "23–24 Marks",
    accentClass: "bg-primary-fixed text-primary",
    desc: "Heavy focus on conceptual definitions, laws, multi-step numerical problems, and ray diagrams.",
    chapters: [
      { topic: "Scientific Study (Measurement)", detail: "Variables and scientific research methods.", range: "3–4 Marks", hours: "6 Hours" },
      { topic: "Motion and Force", detail: "Gravitation, Newton's law, gravity (g), free fall, and terminal velocity.", range: "5–6 Marks", hours: "10 Hours" },
      { topic: "Pressure", detail: "Upthrust, Pascal's law, Archimedes' principle, atmospheric pressure.", range: "4–5 Marks", hours: "8 Hours" },
      { topic: "Energy / Heat", detail: "Sources of energy, heat vs. temperature, specific heat capacity calculations.", range: "3 Marks", hours: "8 Hours" },
      { topic: "Light", detail: "Refraction of light, refractive index, lenses, defects of vision.", range: "4–5 Marks", hours: "10 Hours" },
      { topic: "Current Electricity and Magnetism", detail: "Ohm's law, domestic wiring, transformers, electromagnetic induction.", range: "4–5 Marks", hours: "10 Hours" },
    ],
  },
  {
    icon: FlaskConical,
    emoji: "🧪",
    title: "Chemistry",
    marks: "18–19 Marks",
    accentClass: "bg-secondary-fixed text-on-secondary-fixed-variant",
    desc: "Focuses on balanced chemical equations, structures, properties, and chemical reactions.",
    chapters: [
      { topic: "Classification of Elements", detail: "Periodic table (Mendeleev vs. Modern), groups, periods, electronic configuration.", range: "4 Marks", hours: "10 Hours" },
      { topic: "Chemical Reaction", detail: "Types of chemical reactions, factors affecting rate, balancing reactions.", range: "4 Marks", hours: "10 Hours" },
      { topic: "Acids, Bases, and Salts", detail: "Properties, pH scale, indicator test uses.", range: "3 Marks", hours: "8 Hours" },
      { topic: "Some Gases", detail: "Laboratory preparation and properties of Ammonia (NH₃) and Carbon Dioxide (CO₂).", range: "3 Marks", hours: "8 Hours" },
      { topic: "Metals", detail: "Extraction, properties, and uses of Iron, Copper, Aluminum, and Gold.", range: "2 Marks", hours: "8 Hours" },
      { topic: "Carbon and its Compounds", detail: "Hydrocarbons (Saturated & Unsaturated), Alkanes, Alkenes, Alkynes, and functional alcohols.", range: "3 Marks", hours: "10 Hours" },
    ],
  },
  {
    icon: Dna,
    emoji: "🧬",
    title: "Biology",
    marks: "23–24 Marks",
    accentClass: "bg-tertiary-fixed text-tertiary",
    desc: "Heavy focus on structure labeling, life cycles, and analytical diagrams.",
    chapters: [
      { topic: "Classification of Living Beings", detail: "Five-kingdom system, characteristics of invertebrates and vertebrates.", range: "3–4 Marks", hours: "8 Hours" },
      { topic: "Honey Bee", detail: "Life cycle of a honey bee, types (Queen, Drone, Worker), and economic importance.", range: "2–3 Marks", hours: "6 Hours" },
      { topic: "Heredity", detail: "Chromosomes, DNA, RNA, Mendel's laws of inheritance, sex determination.", range: "4–5 Marks", hours: "10 Hours" },
      { topic: "Physiological Structure & Life Processes", detail: "Human circulatory system (heart structure, blood vessels) and nervous system.", range: "6–7 Marks", hours: "14 Hours" },
      { topic: "Chromosomes and Cell Division", detail: "Mitosis and Meiosis cell division (phases and significance).", range: "3 Marks", hours: "8 Hours" },
    ],
  },
  {
    icon: Globe,
    emoji: "🌍",
    title: "Earth & Space Science",
    marks: "9–10 Marks",
    accentClass: "bg-surface-container-highest text-primary-container",
    desc: "Geology and astronomy across Nature & Environment, Earth history, and the Universe.",
    chapters: [
      { topic: "Nature and Environment / Ecosystem", detail: "Food chain, food web, ecological pyramids, climate change.", range: "3–4 Marks", hours: "8 Hours" },
      { topic: "History of the Earth", detail: "Fossils, eras, epochs, and geological timescales.", range: "3 Marks", hours: "6 Hours" },
      { topic: "Atmosphere and Universe", detail: "Layers of the atmosphere, industrial gases, solar system, galaxies, and life cycle of stars.", range: "3 Marks", hours: "8 Hours" },
    ],
  },
];

const internalBreakdown = [
  { label: "Class Participation & Attendance", marks: 4 },
  { label: "Practical Activities & Lab Experiments", marks: 10 },
  { label: "Project Work / Terminal Exams", marks: 6 },
];

const sources = [
  {
    label: "CDC Secondary Education Curriculum 9–10 (PDF)",
    href: "https://giwmscdnone.gov.np/media/pdf_upload/Secondary%20education%20curriculum%209-10_gvlnpgv.pdf",
  },
  { label: "See Science Guide — Examkura", href: "https://www.examkura.com/class-10-science-guide/" },
  { label: "Class 10 SEE Science Preparation Guide", href: "https://subeshyadav.com.np/blog/class-10-see-science-preparation-guide" },
];

function SectionHeading({
  icon: Icon,
  eyebrow,
  title,
  sub,
  accent,
}: {
  icon: typeof Atom;
  eyebrow: string;
  title: string;
  sub?: string;
  accent: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl", accent)}>
        <Icon className="h-[22px] w-[22px]" aria-hidden="true" />
      </div>
      <div>
        <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">{eyebrow}</span>
        <h2 className="mt-0.5 font-headline-lg text-headline-lg tracking-tight text-on-surface">{title}</h2>
        {sub && <p className="mt-1 max-w-3xl font-body-md text-body-md text-on-surface-variant">{sub}</p>}
      </div>
    </div>
  );
}

export function ScienceExamGuide() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-8 inline-flex items-center gap-1 rounded-full bg-primary-fixed px-4 py-1 font-label-caps text-label-caps uppercase tracking-wider text-primary">
        <GraduationCap className="h-4 w-4" aria-hidden="true" />
        Science &amp; Technology · Official Exam Blueprint 2081/2082
      </div>

      <div className="space-y-10">
        <div>
          <SectionHeading
            icon={ClipboardList}
            eyebrow="Key Exam Statistics"
            title="Full marks, time, and curriculum load at a glance."
            accent="bg-surface-container-high text-primary"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {keyStats.map((stat) => (
              <div key={stat.unit} className="flex gap-3 rounded-2xl border border-surface-container-high/60 bg-surface-container-lowest p-5 shadow-sm">
                <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl", stat.accent)}>
                  <stat.icon className="h-[22px] w-[22px]" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="font-headline-md text-headline-md leading-none text-on-surface">{stat.value}</div>
                  <div className="mt-1 font-title text-title text-on-surface">{stat.unit}</div>
                  <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionHeading
            icon={ListChecks}
            eyebrow="Question Categories and Mark Weightages (Theory)"
            title="The 75-mark written paper across four cognitive domains."
            sub="The specification grid divides the 75-mark written question paper into four cognitive domains:"
            accent="bg-secondary-fixed text-on-secondary-fixed-variant"
          />
          <div className="overflow-x-auto rounded-2xl border border-surface-container-high/60 bg-surface-container-lowest shadow-sm">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="bg-surface-container-high">
                  {["Question Category", "Marks per Question", "No. of Questions", "Total Marks", "Domain Description"].map((h) => (
                    <th key={h} className="px-4 py-3 font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specGrid.map((row) => (
                  <tr key={row.cat} className="border-t border-surface-container/60">
                    <td className="px-4 py-3 font-title text-title text-on-surface">{row.cat}</td>
                    <td className="px-4 py-3 font-body-md text-body-md text-on-surface-variant">{row.perQ}</td>
                    <td className="px-4 py-3 font-body-md text-body-md text-on-surface-variant">{row.count}</td>
                    <td className="px-4 py-3 font-title text-title text-primary">{row.total}</td>
                    <td className="px-4 py-3 font-body-md text-body-md text-on-surface-variant">{row.domain}</td>
                  </tr>
                ))}
                <tr className="border-t border-surface-container bg-surface-container-low">
                  <td className="px-4 py-3 font-title text-title text-on-surface">TOTAL</td>
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3 font-title text-title text-on-surface">34 Questions</td>
                  <td className="px-4 py-3 font-title text-title text-primary">75 Marks</td>
                  <td className="px-4 py-3" />
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <SectionHeading
            icon={FlaskConical}
            eyebrow="Chapter-Wise Breakdown and Estimates"
            title="Thematic units across Physics, Chemistry, Biology, and Earth & Space."
            sub="The textbook is broadly divided into thematic units across Physics, Chemistry, Biology, and Geology/Astronomy. Calculated working time averages roughly 8 to 12 classroom periods per chapter to meet the 160-hour yearly requirement."
            accent="bg-tertiary-fixed text-tertiary"
          />
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {domains.map((domain) => (
              <div key={domain.title} className="rounded-2xl border border-surface-container-high/60 bg-surface-container-lowest p-5 shadow-sm">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", domain.accentClass)}>
                      <domain.icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <h3 className="font-headline-sm text-headline-sm tracking-tight text-on-surface">
                      {domain.emoji} {domain.title}
                    </h3>
                  </div>
                  <span className="shrink-0 rounded-full bg-surface-container-high px-2.5 py-1 font-label-caps text-label-caps uppercase tracking-wider text-primary">
                    {domain.marks}
                  </span>
                </div>
                <p className="mb-3 font-body-md text-body-md text-on-surface-variant">{domain.desc}</p>
                <ul className="space-y-2">
                  {domain.chapters.map((ch) => (
                    <li key={ch.topic} className="flex items-start justify-between gap-3 rounded-xl bg-surface-container-low px-3.5 py-2.5">
                      <div className="min-w-0">
                        <p className="font-title text-title text-on-surface">{ch.topic}</p>
                        <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">{ch.detail}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="font-title text-title text-primary">{ch.range}</div>
                        <div className="font-label-md text-label-md text-on-surface-variant">~{ch.hours}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionHeading
            icon={ListChecks}
            eyebrow="25-Mark Internal / Practical Evaluation Breakdown"
            title="Continuous-assessment segment evaluated by the school."
            sub="Schools evaluate this segment internally using the CDC's continuous assessment tracking system:"
            accent="bg-primary-fixed text-primary"
          />
          <div className="rounded-2xl border border-surface-container-high/60 bg-surface-container-lowest p-5 shadow-sm">
            <ul className="space-y-3">
              {internalBreakdown.map((item) => (
                <li key={item.label}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-title text-title text-on-surface">{item.label}</span>
                    <span className="font-title text-title text-primary">{item.marks} Marks</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
                    <div
                      className="h-full rounded-full bg-primary-container"
                      style={{ width: `${(item.marks / 25) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <footer className="border-t border-surface-container/60 pt-4">
          <p className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">Sources</p>
          <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1.5">
            {sources.map((s, i) => (
              <li key={s.href} className="font-body-sm text-body-sm text-on-surface-variant">
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-2 hover:underline">
                  [{i + 1}] {s.label}
                </a>
              </li>
            ))}
          </ul>
        </footer>
      </div>
    </section>
  );
}