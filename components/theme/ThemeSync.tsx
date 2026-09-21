"use client";

import { useEffect } from "react";
import { applyTheme, getStoredTheme } from "@/lib/theme";

/**
 * Keeps the `.dark` class on <html> in sync after hydration.
 * The root layout ships an inline script that applies the stored theme
 * before paint to avoid a flash of the wrong theme.
 */
export function ThemeSync() {
  useEffect(() => {
    applyTheme(getStoredTheme());
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const stored = getStoredTheme();
      if (stored === "system") applyTheme(stored);
    };
    media.addEventListener("change", onChange);
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === "see-sathi-theme") applyTheme(getStoredTheme());
    };
    window.addEventListener("storage", onStorage);
    return () => {
      media.removeEventListener("change", onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return null;
}