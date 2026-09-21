import { MetadataRoute } from "next";
import { getSubjects, getChapters } from "@/lib/data/subjects";
import { getQuestions } from "@/lib/data/questions";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://seesathi.com";
  const subjects = await getSubjects();
  const sitemapEntries: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/subjects`, lastModified: new Date() },
  ];

  for (const subject of subjects) {
    sitemapEntries.push({ url: `${baseUrl}/subjects/${subject.slug}`, lastModified: new Date() });
    
    const chapters = await getChapters(subject.slug);
    for (const chapter of chapters) {
      sitemapEntries.push({ url: `${baseUrl}/subjects/${subject.slug}/${chapter.slug}`, lastModified: new Date() });
      sitemapEntries.push({ url: `${baseUrl}/subjects/${subject.slug}/${chapter.slug}/notes`, lastModified: new Date() });
      sitemapEntries.push({ url: `${baseUrl}/subjects/${subject.slug}/${chapter.slug}/questions`, lastModified: new Date() });
      
      const questions = await getQuestions(subject.slug, chapter.slug);
      for (const q of questions) {
        sitemapEntries.push({ url: `${baseUrl}/subjects/${subject.slug}/${chapter.slug}/questions/${q.id}`, lastModified: new Date() });
      }
    }
  }

  return sitemapEntries;
}
