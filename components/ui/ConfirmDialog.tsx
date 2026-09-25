"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  body?: React.ReactNode;
  confirmLabel: string;
  confirmIcon?: React.ReactNode;
  cancelLabel?: string;
  tone?: "primary" | "danger";
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onClose?: () => void;
}

/**
 * Accessible, visually-consistent confirmation dialog used for the danger
 * moments of the mock test flow (finishing / cancelling an exam, leaving
 * mid-exam). Pairs a soft backdrop, a gradient accent glow and expressive
 * call-to-action buttons so these windows feel deliberate — not like a
 * plain browser alert.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  body,
  confirmLabel,
  confirmIcon,
  cancelLabel = "Keep going",
  tone = "primary",
  pending = false,
  onConfirm,
  onCancel,
  onClose,
}: ConfirmDialogProps) {
  if (!open) return null;

  const toneClasses =
    tone === "danger"
      ? {
          icon: "bg-error-container text-error",
          confirm:
            "bg-error-container text-on-error-container hover:shadow-[0_6px_22px_rgba(186,26,26,0.28)]",
          glow: "bg-error/20",
        }
      : {
          icon: "bg-primary-fixed text-primary",
          confirm:
            "bg-primary-container text-on-primary shadow-[0_4px_14px_rgba(75,79,242,0.3)] hover:shadow-[0_6px_22px_rgba(75,79,242,0.42)]",
          glow: "bg-primary-fixed-dim/40",
        };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cfm-title"
      aria-describedby="cfm-description"
    >
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose ?? onCancel} aria-hidden="true" />

      <div className="relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-3xl border border-surface-container bg-surface-container-lowest p-4 shadow-[0_24px_64px_rgba(0,0,0,0.35)] dark:border-surface-container-high dark:bg-surface-container-lowest dark:shadow-[0_24px_64px_rgba(0,0,0,0.6)] sm:p-6">
        <div className={cn("pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-2xl", toneClasses.glow)} aria-hidden="true" />
        <button
          type="button"
          aria-label="Close dialog"
          onClick={onClose ?? onCancel}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
        >
          <X className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>

        <div className={cn("relative mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm sm:h-14 sm:w-14", toneClasses.icon)}>
          {confirmIcon}
        </div>
        <h3 id="cfm-title" className="relative font-headline-md text-headline-md tracking-tight text-on-surface">
          {title}
        </h3>
        <p id="cfm-description" className="relative mt-1.5 font-body-md text-body-md text-on-surface-variant">
          {description}
        </p>
        {body && <div className="relative mt-4">{body}</div>}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="inline-flex items-center justify-center rounded-full bg-surface-container px-6 py-2.5 font-title text-title text-on-surface transition-colors hover:bg-surface-container-high disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 font-title text-title transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0",
              toneClasses.confirm,
            )}
          >
            {pending ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" /> : confirmIcon}
            {pending ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}