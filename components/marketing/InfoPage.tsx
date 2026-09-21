import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function InfoPage({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-[#FBF8FF]">
      <section className="relative overflow-hidden border-b border-surface-container/60 bg-surface-container-lowest">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary-container/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 top-40 h-80 w-80 rounded-full bg-secondary-container/10 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 py-12 lg:px-8 lg:py-16">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-fixed px-3 py-1 font-label-caps text-label-caps uppercase tracking-wider text-primary">
            {eyebrow}
          </span>
          <h1 className="mt-3 font-display-hero text-display-hero tracking-tight text-on-surface">{title}</h1>
          {subtitle && <p className="mt-3 max-w-3xl font-body-lg text-body-lg leading-relaxed text-on-surface-variant">{subtitle}</p>}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10 lg:px-8 lg:py-12">
        <div className="space-y-8">{children}</div>
        <footer className="mt-12 flex flex-col items-center gap-1 rounded-2xl bg-surface-container-lowest p-6 text-center shadow-sm">
          <p className="font-title text-title text-on-surface">Questions or feedback?</p>
          <p className="max-w-md font-body-sm text-body-sm text-on-surface-variant">
            Write to{" "}
            <a href="mailto:support@see-sathi.edu.np" className="text-primary underline-offset-2 hover:underline">
              support@see-sathi.edu.np
            </a>{" "}
            — we respond within 48 hours.
          </p>
        </footer>
      </section>
    </div>
  );
}

export function InfoSection({
  icon: Icon,
  title,
  children,
}: {
  icon?: ComponentType<{ className?: string }>;
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-2.5">
        {Icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-fixed text-primary">
            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
        )}
        <h2 className={cn("font-headline-md text-headline-md tracking-tight text-on-surface", !Icon && "pl-0")}>{title}</h2>
      </div>
      <div className="mt-3 space-y-3 font-body-md text-body-md leading-relaxed text-on-surface-variant">{children}</div>
    </section>
  );
}