"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, BookOpen, FileText, Gift, Lock, ShieldCheck, Timer } from "lucide-react";
import { useFirebaseUser } from "@/lib/firebase/client";

export function PastPaperAccessGate({ paperId, children }: { paperId: string; children: React.ReactNode }) {
  const { user, loading } = useFirebaseUser();
  const pathname = usePathname();
  const nextParam = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
  const [authTimedOut, setAuthTimedOut] = useState(false);

  useEffect(() => {
    if (!loading && !user) window.scrollTo({ top: 0, behavior: "auto" });
  }, [loading, user]);

  // If Firebase auth has not resolved within a short window (slow or blocked
  // network), stop waiting so the reader is never stuck on the spinner. The
  // gate falls through to the sign-in prompt below, and if the user state
  // resolves afterwards the paper opens automatically.
  useEffect(() => {
    const t = window.setTimeout(() => setAuthTimedOut(true), 2000);
    return () => window.clearTimeout(t);
  }, []);

  if (loading && !authTimedOut) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-fixed border-t-primary" />
          <p className="font-body-md text-body-md text-on-surface-variant">Checking access&hellip;</p>
        </div>
      </div>
    );
  }

  if (user) return <>{children}</>;

  return (
    <div className="mx-auto max-w-2xl px-4 pt-10 pb-24">
      <div className="relative overflow-hidden rounded-3xl bg-surface-container-lowest p-8 text-center shadow-lg">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-secondary-fixed-dim/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-primary-fixed-dim/30 blur-3xl" />

        <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-fixed text-primary shadow-sm">
          <Lock className="h-8 w-8" aria-hidden="true" />
        </div>

        <p className="relative mb-2 inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1 font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
          <Timer className="h-3.5 w-3.5" aria-hidden="true" /> Free for logged-in students
        </p>
        <h1 className="relative font-headline-lg text-headline-lg tracking-tight text-on-surface">Log in to open this past paper</h1>
        <p className="relative mx-auto mt-2 max-w-md font-body-md text-body-md text-on-surface-variant">
          You&apos;ll be back on this exact page after signing in. Unlock the printed paper and its step-by-step marking scheme solutions.
        </p>

        <ul className="relative mx-auto mt-6 grid max-w-md grid-cols-1 gap-2 text-left sm:grid-cols-2">
          {[
            { icon: FileText, text: "Full 2081 question paper, printable" },
            { icon: BookOpen, text: "Marking-scheme solutions for every part" },
            { icon: Gift, text: "100% free forever — no paywall" },
            { icon: ShieldCheck, text: "Your progress syncs to your account" },
          ].map((b) => (
            <li key={b.text} className="flex items-center gap-2 rounded-2xl bg-surface-container-low px-3 py-2.5 text-body-sm font-medium text-on-surface">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-container-highest text-primary">
                <b.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              {b.text}
            </li>
          ))}
        </ul>

        <div className="relative mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href={`/login${nextParam}`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-container px-7 py-3 font-title text-title text-on-primary shadow-[0_4px_14px_rgba(75,79,242,0.3)] transition-all hover:-translate-y-0.5"
          >
            Log in to open
            <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
          </Link>
          <Link
            href={`/signup${nextParam}`}
            className="inline-flex items-center justify-center rounded-full bg-surface-container px-7 py-3 font-title text-title text-on-surface transition-colors hover:bg-surface-container-high"
          >
            Create a free account
          </Link>
        </div>

        <p className="relative mt-6 font-body-sm text-body-sm text-outline">
          Paper ID: <code className="rounded bg-surface-container px-1.5 py-0.5 text-label-caps">{paperId}</code>
        </p>
      </div>
    </div>
  );
}