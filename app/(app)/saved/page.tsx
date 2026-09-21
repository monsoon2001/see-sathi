import type { Metadata } from "next";
import { SavedNotes } from "@/components/saved/SavedNotes";

export const metadata: Metadata = { title: "Saved Notes — SEE Sathi" };

export default function SavedPage() {
  return (
    <div className="pb-24">
      <SavedNotes />
    </div>
  );
}