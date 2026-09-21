import { BadgeCheck, Image as ImageIcon, Lightbulb, TriangleAlert } from "lucide-react";
import type { NoteBlock } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CopyButton } from "./CopyButton";

export function ParagraphBlock({ block }: { block: NoteBlock }) {
  return (
    <div className="space-y-2">
      <p className="font-body text-[16px] leading-[1.75] text-on-surface">{block.content}</p>
      {block.caption && (
        <p className="border-l-2 border-primary/30 pl-3 font-body text-[13px] italic leading-relaxed text-muted">
          {block.caption}
        </p>
      )}
    </div>
  );
}

export function DefinitionBlock({ block }: { block: NoteBlock }) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-primary-fixed/40 p-5">
      {block.title && (
        <div className="mb-3 flex items-center gap-2">
          <BadgeCheck className="h-5 w-5 text-primary" />
          <h4 className="font-display text-[17px] font-semibold tracking-tight text-on-surface">{block.title}</h4>
        </div>
      )}
      <ul className="space-y-2.5">
        {(block.items ?? [block.content ?? ""].filter(Boolean)).map((item, i) => (
          <li key={i} className="flex items-start gap-3 font-body text-[15px] leading-relaxed text-on-surface-variant">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FormulaBlock({ block }: { block: NoteBlock }) {
  return (
    <div className="rounded-2xl bg-success-soft/30 p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="font-mono text-[26px] font-extrabold tracking-wide text-success-dark">{block.content}</div>
          <div className="hidden space-y-0.5 font-mono text-xs text-on-surface-variant sm:block">
            {block.items?.slice(0, 3).map((item) => <div key={item}>{item}</div>)}
          </div>
        </div>
        {block.content && <CopyButton value={block.content} label="Copy Formula" />}
      </div>
      {block.items && block.items.length > 3 && (
        <ul className="mt-3 space-y-1">
          {block.items.slice(3).map((item) => (
            <li key={item} className="font-body text-[13px] leading-relaxed text-on-surface-variant">
              • {item}
            </li>
          ))}
        </ul>
      )}
      {block.title && block.items && (
        <div className="mt-3">
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.06em] text-success-dark">
            {block.title}
          </span>
        </div>
      )}
    </div>
  );
}

export function ExampleBlock({ block }: { block: NoteBlock }) {
  return (
    <div className="rounded-2xl bg-surface-container-low p-5">
      <div className="mb-2 flex items-start gap-2">
        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
        <div>
          <h4 className="font-display text-[17px] font-semibold tracking-tight text-on-surface">{block.title}</h4>
          <p className="font-body text-[14px] leading-relaxed text-on-surface-variant">{block.content}</p>
        </div>
      </div>
      <div className="mt-3 space-y-1.5 rounded-xl bg-surface-container-lowest p-4 font-body text-[14px] leading-relaxed text-on-surface">
        {(block.items ?? []).map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="font-mono text-xs font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ImageWithCaption({ block }: { block: NoteBlock }) {
  return (
    <figure className="space-y-2 rounded-2xl bg-surface-container-lowest p-2 shadow-soft">
      <div className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-xl bg-surface-container-low">
        {block.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={block.imageUrl} alt={block.caption ?? block.title ?? "Diagram"} className="h-full w-full object-contain" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-outline">
            <ImageIcon className="h-8 w-8" />
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.06em]">{block.title ?? "Diagram"}</span>
            <svg viewBox="0 0 240 180" className="w-full max-w-[220px] p-2" aria-hidden="true">
              <rect width="240" height="180" rx="16" fill="var(--seed-svg-bg, #FFFFFF)" />
              <text x="18" y="24" fontSize="11" fill="#454556" fontWeight="700">U (Universal)</text>
              <circle cx="95" cy="80" r="50" fill="rgba(75,79,242,0.2)" />
              <text x="65" y="65" fontSize="12" fill="#4B4FF2" fontWeight="700">A</text>
              <circle cx="145" cy="80" r="50" fill="rgba(255,90,60,0.2)" />
              <text x="170" y="65" fontSize="12" fill="#B5250C" fontWeight="700">B</text>
              <circle cx="120" cy="115" r="50" fill="rgba(47,182,115,0.2)" />
              <text x="120" y="152" fontSize="12" fill="#005B34" fontWeight="700" textAnchor="middle">C</text>
              <circle cx="120" cy="92" r="10" fill="#4B4FF2" />
            </svg>
          </div>
        )}
      </div>
      {block.caption && (
        <figcaption className="px-2 pb-2 text-center font-body text-[13px] italic text-muted">{block.caption}</figcaption>
      )}
    </figure>
  );
}

export function TipCallout({ block, variant = "tip" }: { block: NoteBlock; variant?: "tip" | "warning" }) {
  const isWarning = variant === "warning";
  const Icon = isWarning ? TriangleAlert : Lightbulb;
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl p-4",
        isWarning ? "border border-secondary/20 bg-secondary/5" : "border border-success/20 bg-success/5",
      )}
    >
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", isWarning ? "text-secondary" : "text-success")} />
      <div className="space-y-1">
        <h4 className={cn("font-sans text-[11px] font-bold uppercase tracking-[0.08em]", isWarning ? "text-secondary-dark" : "text-success-dark")}>
          {block.title}
        </h4>
        <p className="font-body text-[14px] leading-relaxed text-on-surface-variant">{block.content}</p>
      </div>
    </div>
  );
}

export function HeadingBlock({ block, index, id }: { block: NoteBlock; index: number; id: string }) {
  return (
    <div className="flex items-center gap-2.5" id={id}>
      <span className="font-display text-[19px] font-bold text-primary">{String(index + 1).padStart(2, "0")}.</span>
      <h2 className="scroll-mt-28 font-display text-[19px] font-semibold tracking-tight text-on-surface">
        {block.content}
      </h2>
    </div>
  );
}