import {
  Bot,
  ClipboardList,
  Clock,
  Code2,
  Database,
  GraduationCap,
  ListChecks,
  MonitorPlay,
  Server,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";

const keyStats = [
  {
    icon: ClipboardList,
    value: "50",
    unit: "Full Marks",
    sub: "Theory: 50 Marks · Optional II (Technical)",
    accent: "bg-primary-fixed text-primary",
  },
  {
    icon: Timer,
    value: "2 Hours",
    unit: "Total Exam Time",
    sub: "Official 50-mark question-paper duration",
    accent: "bg-tertiary-fixed text-tertiary",
  },
  {
    icon: Clock,
    value: "64 Hours",
    unit: "Curriculum Working Hours",
    sub: "≈ 5 periods per week across the grade 10 year",
    accent: "bg-secondary-fixed text-on-secondary-fixed-variant",
  },
];

const questionTypeGrid = [
  { cat: "Multiple Choice Question (MCQ)", perQ: "1 Mark", count: "10", total: "10 Marks", domain: "Knowledge and Recall" },
  { cat: "Short Question (SQ)", perQ: "2 Marks", count: "10", total: "20 Marks", domain: "Understanding and Application" },
  { cat: "Long Question (LQ)", perQ: "4 Marks", count: "5", total: "20 Marks", domain: "Application & Higher Ability" },
];

const unitComposition = [
  { unit: "1. Computer Network and Communication", mcq: 3, short: 2, long: 1, questions: 6, marks: 11 },
  { unit: "2. Database Management System", mcq: 2, short: 1, long: 1, questions: 4, marks: 8 },
  { unit: "3. Multimedia", mcq: 2, short: 1, long: 1, questions: 4, marks: 8 },
  { unit: "4. Programming in Python", mcq: 2, short: 3, long: 1, questions: 6, marks: 12 },
  { unit: "5. AI and Contemporary Technologies", mcq: 1, short: 3, long: 1, questions: 5, marks: 11 },
  { unit: "TOTAL", mcq: 10, short: 10, long: 5, questions: 25, marks: 50 },
];

const cognitiveTable = [
  { domain: "Knowledge (ज्ञान)", share: "20%", mcq: 4, short: 1, long: 1, marks: 10 },
  { domain: "Understanding (बोध)", share: "30%", mcq: 1, short: 3, long: 2, marks: 15 },
  { domain: "Application (प्रयोग)", share: "30%", mcq: 3, short: 4, long: 1, marks: 15 },
  { domain: "Higher Ability (उच्च दक्षता)", share: "20%", mcq: 2, short: 2, long: 1, marks: 10 },
];

interface UnitRow {
  topic: string;
  detail: string;
  range: string;
  hours: string;
}

interface DomainBlock {
  icon: typeof Server;
  emoji: string;
  title: string;
  marks: string;
  hours: string;
  mix: string;
  accentClass: string;
  desc: string;
  rows: UnitRow[];
}

const domains: DomainBlock[] = [
  {
    icon: Server,
    emoji: "🖧",
    title: "Computer Networking & Communication",
    marks: "11 Marks",
    hours: "14 Hours",
    mix: "MCQ 3 · Short 2 · Long 1 = 6 questions",
    accentClass: "bg-primary-fixed text-primary",
    desc: "Fundamentals of data communication — network types and applications, topologies, transmission media and connectors, network devices, and telecommunication.",
    rows: [
      { topic: "Network Types & Applications", detail: "LAN, PAN, MAN, WAN and network applications.", range: "3 Marks", hours: "4 Hours" },
      { topic: "Topologies & Transmission Media", detail: "Bus, star, ring, hybrid topologies; guided and unguided media, connectors.", range: "4 Marks", hours: "5 Hours" },
      { topic: "Network Devices & Telecommunication", detail: "Hub, switch, router, modem, gateway; telecommunication terms.", range: "4 Marks", hours: "5 Hours" },
    ],
  },
  {
    icon: Database,
    emoji: "🗄️",
    title: "Database Management System",
    marks: "8 Marks",
    hours: "10 Hours",
    mix: "MCQ 2 · Short 1 · Long 1 = 4 questions",
    accentClass: "bg-secondary-fixed text-on-secondary-fixed-variant",
    desc: "Relational database concepts — DBMS vs RDBMS, data types, tables, queries, keys and relationships, forms and reports.",
    rows: [
      { topic: "DBMS Fundamentals", detail: "DBMS vs RDBMS, advantages, data types.", range: "3 Marks", hours: "4 Hours" },
      { topic: "Tables, Keys & Relationships", detail: "Records, fields, primary key, foreign key, cardinality and relationships.", range: "3 Marks", hours: "4 Hours" },
      { topic: "Queries, Forms & Reports", detail: "SELECT/INSERT queries, form and report design.", range: "2 Marks", hours: "2 Hours" },
    ],
  },
  {
    icon: MonitorPlay,
    emoji: "🎬",
    title: "Multimedia Technology",
    marks: "8 Marks",
    hours: "10 Hours",
    mix: "MCQ 2 · Short 1 · Long 1 = 4 questions",
    accentClass: "bg-tertiary-fixed text-tertiary",
    desc: "Multimedia components and authoring — text, graphics, audio, video; color models; common file formats; animation and presentation tools.",
    rows: [
      { topic: "Components & Color Models", detail: "Text, image, audio, video, animation; RGB/CMYK models.", range: "3 Marks", hours: "4 Hours" },
      { topic: "File Formats", detail: "Image (JPEG, PNG, GIF), audio (MP3, WAV), video (MP4, AVI) formats.", range: "3 Marks", hours: "4 Hours" },
      { topic: "Authoring & Design", detail: "Multimedia authoring tools and design principles.", range: "2 Marks", hours: "2 Hours" },
    ],
  },
  {
    icon: Code2,
    emoji: "🐍",
    title: "Programming in Python",
    marks: "12 Marks",
    hours: "16 Hours",
    mix: "MCQ 2 · Short 3 · Long 1 = 6 questions",
    accentClass: "bg-primary-fixed text-primary",
    desc: "The single largest unit. Heavy Application and Higher-Ability load — outputs, flow traces and program writing dominate the paper. Marks below are an estimated part-wise split of the 12-mark unit.",
    rows: [
      { topic: "Basics of Python", detail: "Variables, data types, operators, input/output, control statements.", range: "3 Marks", hours: "4 Hours" },
      { topic: "User Defined Functions", detail: "Function definition, parameters, arguments, return and scope.", range: "2 Marks", hours: "3 Hours" },
      { topic: "Modules, Packages & Libraries", detail: "Importing standard and custom modules; Turtle graphics.", range: "2 Marks", hours: "3 Hours" },
      { topic: "Error Handling", detail: "Syntax, runtime and logical errors; try-except.", range: "1 Mark", hours: "1 Hour" },
      { topic: "File Handling", detail: "Reading and writing files; CSV and pandas operations.", range: "2 Marks", hours: "3 Hours" },
      { topic: "Data Visualization", detail: "Matplotlib line, bar and pie charts; labels and legends.", range: "2 Marks", hours: "2 Hours" },
    ],
  },
  {
    icon: Bot,
    emoji: "🤖",
    title: "AI & Contemporary Technologies",
    marks: "11 Marks",
    hours: "14 Hours",
    mix: "MCQ 1 · Short 3 · Long 1 = 5 questions",
    accentClass: "bg-surface-container-highest text-primary-container",
    desc: "Artificial intelligence and emerging technology — AI concepts and applications, robotics, IoT, cloud computing, cyber security, and real-world impacts.",
    rows: [
      { topic: "Artificial Intelligence", detail: "Concepts, types, applications and impacts of AI.", range: "4 Marks", hours: "5 Hours" },
      { topic: "Robotics & IoT", detail: "Robot components, industrial and domestic robots; Internet of Things.", range: "4 Marks", hours: "5 Hours" },
      { topic: "Cloud, Security & Emerging Tech", detail: "Cloud computing, cyber security, and new-age technologies.", range: "3 Marks", hours: "4 Hours" },
    ],
  },
];

const sources = [
  {
    label: "CDC Secondary Education Curriculum 9–10 (PDF)",
    href: "https://giwmscdnone.gov.np/media/pdf_upload/Secondary%20education%20curriculum%209-10_gvlnpgv.pdf",
  },
  { label: "Grade 10 Computer Science Specification Grid 2081/2082", href: "/grade10-cs-specification-grid.json" },
];

function SectionHeading({
  icon: Icon,
  eyebrow,
  title,
  sub,
  accent,
}: {
  icon: typeof Server;
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

export function ComputerScienceExamGuide() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-8 inline-flex items-center gap-1 rounded-full bg-primary-fixed px-4 py-1 font-label-caps text-label-caps uppercase tracking-wider text-primary">
        <GraduationCap className="h-4 w-4" aria-hidden="true" />
        Computer Science · Official Exam Blueprint 2081/2082
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
            title="The 50-mark written paper across three question types."
            sub="The specification grid divides the 50-mark written question paper into Multiple Choice, Short, and Long questions across five units:"
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
                {questionTypeGrid.map((row) => (
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
                  <td className="px-4 py-3 font-title text-title text-on-surface">25 Questions</td>
                  <td className="px-4 py-3 font-title text-title text-primary">50 Marks</td>
                  <td className="px-4 py-3" />
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <SectionHeading
            icon={ListChecks}
            eyebrow="Question Composition by Unit"
            title="Which unit produces which question types."
            sub="Each unit targets a fixed mix of MCQ, Short, and Long questions. Python and AI units dominate the Short questions; every unit contributes exactly one Long question except the network unit's single Long construction."
            accent="bg-primary-fixed text-primary"
          />
          <div className="overflow-x-auto rounded-2xl border border-surface-container-high/60 bg-surface-container-lowest shadow-sm">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="bg-surface-container-high">
                  {["Unit", "MCQ (1 Mark)", "Short (2 Marks)", "Long (4 Marks)", "Total Questions", "Unit Marks"].map((h) => (
                    <th key={h} className="px-4 py-3 font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {unitComposition.map((row) => {
                  const isTotal = row.unit === "TOTAL";
                  return (
                    <tr
                      key={row.unit}
                      className={cn("border-t border-surface-container/60", isTotal && "bg-surface-container-low font-title")}
                    >
                      <td className="px-4 py-3 font-title text-title text-on-surface">{row.unit}</td>
                      <td className="px-4 py-3 font-body-md text-body-md text-on-surface-variant">{row.mcq}</td>
                      <td className="px-4 py-3 font-body-md text-body-md text-on-surface-variant">{row.short}</td>
                      <td className="px-4 py-3 font-body-md text-body-md text-on-surface-variant">{row.long}</td>
                      <td className="px-4 py-3 font-body-md text-body-md text-on-surface-variant">{row.questions}</td>
                      <td className={cn("px-4 py-3 font-title text-title", isTotal ? "text-on-surface" : "text-primary")}>{row.marks}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <SectionHeading
            icon={Code2}
            eyebrow="Chapter-Wise Breakdown and Estimates"
            title="Five units, 64 working hours, and where the marks fall."
            sub="Marks and hours below are unit totals from the official grid; the per-topic/part numbers are estimated splits of those totals to guide revision time allocation."
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
                  <div className="shrink-0 text-right">
                    <span className="block rounded-full bg-surface-container-high px-2.5 py-1 text-right font-label-caps text-label-caps uppercase tracking-wider text-primary">
                      {domain.marks}
                    </span>
                    <span className="mt-1 block font-label-md text-label-md text-on-surface-variant">~{domain.hours}</span>
                  </div>
                </div>
                <p className="mb-3 font-body-md text-body-md text-on-surface-variant">{domain.desc}</p>
                <p className="mb-3 inline-block rounded-full bg-surface-container px-2.5 py-1 font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
                  {domain.mix}
                </p>
                <ul className="space-y-2">
                  {domain.rows.map((ch) => (
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
            eyebrow="Detailed Breakdown by Cognitive Level"
            title="20% Knowledge · 30% Understanding · 30% Application · 20% Higher Ability."
            sub="Across the full paper, cognitive levels are distributed as follows, with MCQ and Short items carrying most of the application weight in Python and AI units."
            accent="bg-primary-fixed text-primary"
          />
          <div className="overflow-x-auto rounded-2xl border border-surface-container-high/60 bg-surface-container-lowest shadow-sm">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="bg-surface-container-high">
                  {["Cognitive Level", "Share", "MCQ (1m)", "Short (2m)", "Long (4m)", "Marks"].map((h) => (
                    <th key={h} className="px-4 py-3 font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cognitiveTable.map((row) => (
                  <tr key={row.domain} className="border-t border-surface-container/60">
                    <td className="px-4 py-3 font-title text-title text-on-surface">{row.domain}</td>
                    <td className="px-4 py-3 font-body-md text-body-md text-on-surface-variant">{row.share}</td>
                    <td className="px-4 py-3 font-body-md text-body-md text-on-surface-variant">{row.mcq}</td>
                    <td className="px-4 py-3 font-body-md text-body-md text-on-surface-variant">{row.short}</td>
                    <td className="px-4 py-3 font-body-md text-body-md text-on-surface-variant">{row.long}</td>
                    <td className="px-4 py-3 font-title text-title text-primary">{row.marks}</td>
                  </tr>
                ))}
                <tr className="border-t border-surface-container bg-surface-container-low">
                  <td className="px-4 py-3 font-title text-title text-on-surface">Total</td>
                  <td className="px-4 py-3 font-title text-title text-on-surface">100%</td>
                  <td className="px-4 py-3 font-title text-title text-on-surface">10</td>
                  <td className="px-4 py-3 font-title text-title text-on-surface">10</td>
                  <td className="px-4 py-3 font-title text-title text-on-surface">5</td>
                  <td className="px-4 py-3 font-title text-title text-primary">50</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-surface-container-high/60 bg-surface-container-lowest p-5 shadow-sm">
            <h3 className="mb-3 font-headline-sm text-headline-sm tracking-tight text-on-surface">High Weightage Units (Priority for SEE)</h3>
            <ul className="space-y-2">
              {[
                "Programming in Python → 12 marks (Largest unit; drives Short/Application items)",
                "Computer Network and Communication → 11 marks",
                "AI and Contemporary Technologies → 11 marks",
                "These three units together carry 34 of 50 marks (68%)",
              ].map((item) => (
                <li key={item} className="rounded-xl bg-surface-container-low px-3.5 py-2.5 font-body-md text-body-md text-on-surface">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-surface-container-high/60 bg-surface-container-lowest p-5 shadow-sm">
            <h3 className="mb-3 font-headline-sm text-headline-sm tracking-tight text-on-surface">Quick Tips for Students</h3>
            <ul className="space-y-2">
              {[
                "Secure the 10 MCQs with crisp definitions and telecommunication/naming conventions.",
                "Draw labelled diagrams for topologies, network devices, and DBMS ER relationships to bank Short marks.",
                "Long questions usually pair a theory part with a Python program or DBMS table/query construction — practise writing clean output traces.",
                "Time budget: ~2 minutes per MCQ, ~6 minutes per Short, and ~10 minutes per Long in the 2-hour paper.",
              ].map((item) => (
                <li key={item} className="rounded-xl bg-surface-container-low px-3.5 py-2.5 font-body-md text-body-md text-on-surface">
                  {item}
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