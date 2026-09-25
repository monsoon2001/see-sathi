"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, Bug, Flag, Flame, LayoutGrid, Lightbulb, Search, TriangleAlert, X } from "lucide-react";

function TextbookIllustration() {
  return (
    <div className="relative mb-4 flex h-36 w-36 items-center justify-center sm:h-44 sm:w-44">
      <div className="absolute inset-0 scale-90 animate-pulse rounded-full bg-primary-fixed/40" />
      <svg className="relative z-10 h-full w-full drop-shadow-sm" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="40" fill="#4B4FF2" r="4" className="animate-bounce" style={{ animationDuration: "2.6s" }} />
        <path d="M148 36L152 46L162 50L152 54L148 64L144 54L134 50L144 46L148 36Z" fill="#FD583A" opacity="0.85" />
        <circle cx="156" cy="116" fill="#4B4FF2" opacity="0.4" r="3.5" />
        <path d="M34 122L36 128L42 130L36 132L34 138L32 132L26 130L32 128L34 122Z" fill="#FD583A" opacity="0.5" />
        <path d="M90 134C72 124 46 122 24 128V66C46 60 72 62 90 72C108 62 134 60 156 66V128C134 122 108 124 90 134Z" fill="#EDECFF" />
        <path d="M87 73C87 73 89 130 90 134C91 130 93 73 93 73" stroke="#4B4FF2" strokeLinecap="round" strokeWidth="2.5" />
        <path d="M26 125C46 119 70 121 88 131V70C70 60 46 58 26 64V125Z" fill="#FFFFFF" />
        <path d="M36 80H78M36 93H72M36 106H64" stroke="#C6C4D8" strokeLinecap="round" strokeWidth="3" />
        <path d="M154 125C134 119 110 121 92 131V70C110 60 134 58 154 64V125Z" fill="#FFFFFF" />
        <path d="M102 80H144M102 93H138M102 106H122" stroke="#C6C4D8" strokeLinecap="round" strokeWidth="3" />
        <path d="M22 128C46 121 72 123 90 134C108 123 134 121 158 128" stroke="#4B4FF2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        <g transform="translate(68, 24)">
          <circle cx="22" cy="18" fill="#4B4FF2" r="8" />
          <circle cx="22" cy="18" fill="#FFFFFF" r="3.5" />
          <path d="M18 24L5 66" stroke="#4B4FF2" strokeLinecap="round" strokeWidth="4.5" />
          <path d="M5 66L2 74L8 71Z" fill="#181A2B" />
          <path d="M26 24L39 66" stroke="#4B4FF2" strokeLinecap="round" strokeWidth="4.5" />
          <rect fill="#FD583A" height="20" rx="2" transform="rotate(-15 34 58)" width="8" x="34" y="58" />
          <polygon fill="#181A2B" points="34,78 40,86 44,79" />
          <path d="M12 46C18 43 26 43 32 46" stroke="#FD583A" strokeDasharray="2 3" strokeWidth="2.5" />
        </g>
        <g transform="translate(104, 18)">
          <circle cx="24" cy="24" fill="#FD583A" r="22" className="shadow-lg" />
          <circle cx="24" cy="24" fill="#B5250C" opacity="0.15" r="18" />
          <path d="M20 18C20 15.79 21.79 14 24 14C26.21 14 28 15.79 28 18C28 19.8 26.8 20.8 25.4 21.8C24 22.9 23.2 24.1 23.2 26H24.8M24 30.5V31" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

const quickLinks = [
  { dot: "bg-primary", label: "Compulsory Math: Sets", href: "/subjects/mathematics/sets" },
  { dot: "bg-secondary-container", label: "Science: Ohm’s Law", href: "/subjects/science/electricity" },
  { dot: "bg-tertiary", label: "Social Studies: Constitution", href: "/subjects/social-studies/constitution" },
  { flame: true, label: "2080 Model Papers", href: "/subjects/mathematics/sets/questions" },
];

export function NotFoundContent() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [path, setPath] = useState("/syllabus/chapter-404-missing");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let mounted = true;
    const full = window.location.pathname + window.location.search + window.location.hash;
    if (mounted) setPath(full || "/syllabus/chapter-404-missing");
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setModalOpen((open) => {
          if (open) return false;
          window.location.href = "/subjects";
          return open;
        });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex w-full flex-col items-center justify-center overflow-hidden py-16 lg:py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-container/10 blur-3xl" />
      <div className="pointer-events-none absolute left-1/4 top-1/3 -z-10 h-[380px] w-[380px] rounded-full bg-secondary-container/10 blur-2xl" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 flex select-none items-center justify-center">
        <span className="translate-y-4 font-display-hero text-[180px] font-extrabold leading-none tracking-tighter text-primary opacity-[0.06] sm:text-[280px] md:text-[380px] lg:text-[460px]">
          404
        </span>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <div className="relative flex w-full flex-col items-center rounded-xl bg-surface-container-lowest/90 p-5 shadow-[0_4px_24px_rgba(24,26,43,0.06),0_20px_48px_rgba(75,79,242,0.07)] backdrop-blur-xl sm:p-9">
          <div className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-secondary-fixed px-4 py-1.5 text-on-secondary-fixed shadow-sm">
            <TriangleAlert className="text-[16px] text-secondary" fill="currentColor" aria-hidden="true" />
            <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary">Error 404 · Syllabus Disconnected</span>
          </div>

          <TextbookIllustration />

          <h1 className="mb-2 max-w-xl text-hero-mobile font-extrabold tracking-tight text-on-surface lg:text-display-hero">
            Looks like this chapter wandered off.
          </h1>
          <p className="mx-auto mb-6 max-w-xl font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
            The page or question you&apos;re searching for isn&apos;t in the official CDC curriculum, or the link may have expired during syllabus updates.
          </p>

          <div className="mb-6 w-full max-w-2xl rounded-xl bg-surface-container-low/80 p-4 text-left shadow-sm sm:p-5">
            <div className="mb-2 flex items-center gap-1.5">
              <BookOpen className="text-[18px] text-primary" fill="currentColor" aria-hidden="true" />
              <p className="font-title text-title text-on-surface">Did you mean one of these popular chapters?</p>
            </div>
            <div className="flex flex-wrap gap-2 pt-1 sm:gap-3">
              {quickLinks.map((q) => (
                <Link
                  key={q.label}
                  href={q.href}
                  className="group inline-flex items-center gap-1.5 rounded-full bg-surface-container-lowest px-4 py-2 text-on-surface shadow-sm transition-all duration-150 hover:bg-primary-fixed hover:text-on-primary-fixed"
                >
                  {q.flame ? (
                    <Flame className="text-[14px] text-secondary" aria-hidden="true" />
                  ) : (
                    <span className={q.dot + " h-2 w-2 rounded-full"} />
                  )}
                  <span className="font-body-sm text-body-sm font-semibold">{q.label}</span>
                  <ArrowUpRight className="text-[15px] text-on-surface-variant transition-all group-hover:translate-x-0.5 group-hover:text-on-primary-fixed" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-primary-container px-8 py-3.5 font-title text-title text-on-primary shadow-[0_4px_14px_rgba(75,79,242,0.32),0_1px_2px_rgba(75,79,242,0.16)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(75,79,242,0.42)] active:translate-y-0 sm:w-auto"
            >
              Go to Homepage
              <ArrowRight className="text-[20px]" aria-hidden="true" />
            </Link>
            <Link
              href="/subjects"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-surface-container px-6 py-3.5 font-title text-title text-on-surface transition-all duration-150 hover:bg-surface-container-high sm:w-auto"
            >
              <LayoutGrid className="text-[20px] text-on-surface-variant" aria-hidden="true" />
              Browse All Subjects
            </Link>
          </div>

          <div className="mt-5 w-full max-w-md pt-4">
            <form
              className="relative flex items-center"
              onSubmit={(e) => {
                e.preventDefault();
                const q = inputRef.current?.value.trim();
                if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
              }}
            >
              <Search className="pointer-events-none absolute left-4 text-[20px] text-on-surface-variant" aria-hidden="true" />
              <input
                ref={inputRef}
                className="h-12 w-full rounded-full bg-surface-container-lowest pl-11 pr-24 font-body-md text-body-md text-on-surface shadow-sm transition-all placeholder:text-on-surface-variant/70 focus:bg-surface-container-lowest focus:shadow-[0_0_0_3px_rgba(75,79,242,0.18)] focus:outline-none"
                placeholder="Or search topics (e.g. Heredity, Sets)..."
                type="text"
              />
              <button type="submit" className="absolute right-1.5 rounded-full bg-primary px-4 py-1.5 font-label-md text-label-md text-on-primary transition-colors hover:bg-primary-container">
                Search
              </button>
            </form>
          </div>

          <div className="mt-6 flex items-center justify-center gap-1 pt-1 font-body-sm text-body-sm text-on-surface-variant">
            <Flag className="text-[16px] text-outline" aria-hidden="true" />
            <span>If you think this is a broken link in our curriculum, let us know via</span>
            <button type="button" onClick={() => setModalOpen(true)} className="font-title text-primary underline decoration-primary/40 transition-all hover:decoration-primary">
              Report Error
            </button>
          </div>
        </div>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-surface-container-low/70 px-4 py-2 font-body-sm text-body-sm text-on-surface-variant">
          <Lightbulb className="text-[16px] text-tertiary" aria-hidden="true" />
          <span>
            Pro-tip: Press <kbd className="rounded bg-surface-container-highest px-1.5 py-0.5 font-mono text-[11px] font-semibold text-on-surface shadow-xs">Esc</kbd> anytime to return to your dashboard
          </span>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-xl bg-surface-container-lowest p-6 shadow-2xl sm:p-8">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-fixed text-secondary">
                  <Bug className="text-[18px]" aria-hidden="true" />
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Report Curriculum Issue</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition-colors hover:bg-surface-container-high"
                aria-label="Close"
              >
                <X className="text-[18px]" aria-hidden="true" />
              </button>
            </div>
            <p className="mb-4 font-body-md text-body-md text-on-surface-variant">Help SEE Sathi&apos;s editorial team ensure every Class 10 student has 100% accurate syllabus access.</p>
            <div className="mb-6 space-y-3 text-left">
              <div>
                <label htmlFor="missing-path" className="mb-1 block font-label-caps text-label-caps uppercase text-on-surface-variant">Current Missing Path</label>
                <input id="missing-path" readOnly value={path} className="h-10 w-full rounded-DEFAULT bg-surface-container px-4 font-mono text-body-sm text-on-surface" />
              </div>
              <div>
                <label htmlFor="what-expected" className="mb-1 block font-label-caps text-label-caps uppercase text-on-surface-variant">What was expected?</label>
                <textarea
                  id="what-expected"
                  rows={3}
                  placeholder="e.g., I was searching for 2080 Compulsory Math Question Set 3 solutions..."
                  className="w-full rounded-DEFAULT border-0 bg-surface-container-low p-4 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-full px-4 py-2 font-title text-body-md text-on-surface-variant transition-colors hover:bg-surface-container">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  window.alert("Thank you! Our academic editorial board has received your note.");
                }}
                className="rounded-full bg-primary px-6 py-2 font-title text-body-md text-on-primary shadow-sm transition-all hover:bg-primary-container"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}