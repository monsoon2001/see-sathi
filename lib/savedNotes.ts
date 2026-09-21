"use client";

import { useCallback, useEffect, useState } from "react";
import type { SavedNote } from "@/lib/types";

const STORAGE_KEY = "see-sathi:saved-notes";

function readSavedNotes(): SavedNote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedNote[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useSavedNotes() {
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSavedNotes(readSavedNotes());
    setReady(true);
  }, []);

  const persist = useCallback((next: SavedNote[]) => {
    setSavedNotes(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // storage unavailable — keep in-memory only
    }
  }, []);

  const isNoteSaved = useCallback(
    (subjectSlug: string, chapterSlug: string) => savedNotes.some((n) => n.subjectSlug === subjectSlug && n.chapterSlug === chapterSlug),
    [savedNotes],
  );

  const saveNote = useCallback(
    (input: { subjectSlug: string; subjectName: string; chapterSlug: string; chapterTitle: string }) => {
      const id = `${input.subjectSlug}:${input.chapterSlug}`;
      setSavedNotes((prev) => {
        const next = prev.filter((n) => n.id !== id);
        const note: SavedNote = { ...input, id, savedAt: new Date().toISOString() };
        persist([note, ...next]);
        return [note, ...next];
      });
    },
    [persist],
  );

  const unsaveNote = useCallback(
    (subjectSlug: string, chapterSlug: string) => {
      setSavedNotes((prev) => {
        const id = `${subjectSlug}:${chapterSlug}`;
        const next = prev.filter((n) => n.id !== id);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const clearNotes = useCallback(() => {
    persist([]);
  }, [persist]);

  return { savedNotes, ready, isNoteSaved, saveNote, unsaveNote, clearNotes };
}