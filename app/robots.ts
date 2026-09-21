import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://seesathi.com";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/profile/", "/settings/", "/saved/", "/login/", "/signup/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
