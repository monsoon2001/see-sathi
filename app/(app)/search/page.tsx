import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPageContent } from "@/components/search/SearchPageContent";
import { getPastPaperSearchResults } from "@/lib/pastPapers";

export const metadata: Metadata = { title: "Search — SEE Sathi" };

export default function SearchPage() {
  const pastPaperResults = getPastPaperSearchResults();
  return (
    <Suspense>
      <SearchPageContent pastPaperResults={pastPaperResults} />
    </Suspense>
  );
}