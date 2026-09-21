import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { mockSubjects } from "@/lib/mock/mockSubjects";

const columns = [
  {
    title: "Study",
    links: [
      { label: "Master Notes", href: "/subjects" },
      { label: "Question Bank", href: "/subjects" },
      { label: "Mock SEE Papers", href: "/subjects" },
    ],
  },
  {
    title: "Subjects",
    links: mockSubjects
      .filter((s) => !s.comingSoon)
      .map((s) => ({ label: s.name.replace(" (Nepali)", ""), href: `/subjects/${s.slug}` })),
  },
  {
    title: "Resources",
    links: [
      { label: "SEE Grading Guide", href: "/grading-guide" },
      { label: "Syllabus Breakdown", href: "/subjects" },
      { label: "Topper Answer Sets", href: "/saved" },
      { label: "Model Exam Simulator", href: "/subjects" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "About Mission", href: "/about" },
      { label: "Editorial Board", href: "/editorial-board" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-low text-on-surface">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6 lg:gap-8">
          <div className="space-y-4 lg:col-span-2">
            <Logo />
            <p className="max-w-sm font-body-md text-body-md text-on-surface-variant">
              Empowering every Class 10 student across Nepal with world-class, beautifully structured
              study notes and solved questions.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title} className="space-y-3">
              <h4 className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider">
                {col.title}
              </h4>
              <ul className="space-y-1.5 font-body-sm text-body-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-on-surface-variant transition-colors hover:text-on-surface">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-between gap-3 border-t border-ink/5 pt-6 text-on-surface-variant sm:flex-row">
          <p className="font-body-sm text-body-sm">© 2026 SEE Sathi Technologies Pvt. Ltd. Kathmandu, Nepal.</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Built for every Class 10 student across Nepal</p>
        </div>
      </div>
    </footer>
  );
}