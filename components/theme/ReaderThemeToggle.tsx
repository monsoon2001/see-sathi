"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStoredTheme, resolveTheme, setTheme } from "@/lib/theme";

/**
 * Scoped dark-mode switch for study screens. ReaderShell owns the `dark`
 * class on a scoped subtree, so this only sits inside reader pages — the app
 * chrome (header/nav/footer) always stays light regardless.
 *
 * Used inline next to the reader toolbar buttons (e.g. next to "Save Note")
 * so it stays easy to find. `variant="floating"` keeps the old fixed button.
 */
export function ReaderThemeToggle({
  variant = "inline",
  className,
}: {
  variant?: "inline" | "floating";
  className?: string;
}) {
  const [mode, setMode] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    return resolveTheme(getStoredTheme());
  });

  function toggle() {
    const next: "light" | "dark" = mode === "dark" ? "light" : "dark";
    setMode(next);
    setTheme(next);
  }

  const variantClass =
    variant === "inline"
      ? "h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-container-lowest text-on-surface shadow-sm transition-all hover:bg-surface-container dark:bg-surface-container dark:hover:bg-surface-container-high"
      : "fixed bottom-24 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-surface-container text-on-surface shadow-[0_4px_16px_rgba(24,26,43,0.18)] ring-1 ring-surface-container-high/60 backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(75,79,242,0.3)] dark:bg-surface-container dark:text-on-surface sm:right-6";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={cn("flex", variantClass, className)}
    >
      {mode === "dark" ? (
        <Sun className="h-[18px] w-[18px]" aria-hidden="true" />
      ) : (
        <Moon className="h-[18px] w-[18px]" aria-hidden="true" />
      )}
    </button>
  );
}