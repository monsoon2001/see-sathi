"use client";

import { useEffect, useState, type ReactNode } from "react";
import { getStoredTheme, resolveTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

/**
 * Scoped dark mode wrapper for study screens (notes, solved questions,
 * past-paper solutions). Only this subtree flips to the dark palette —
 * the app chrome (header, footer, nav) always stays light.
 */
export function ReaderShell({ className, children }: { className?: string; children: ReactNode }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const update = () => setDark(resolveTheme(getStoredTheme()) === "dark");
    update();
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", update);
    window.addEventListener("see-sathi-theme-change", update);
    window.addEventListener("storage", update);
    return () => {
      media.removeEventListener("change", update);
      window.removeEventListener("see-sathi-theme-change", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return <div className={cn(dark && "dark bg-background", className)}>{children}</div>;
}