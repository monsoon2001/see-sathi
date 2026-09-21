import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Noto_Sans_Devanagari, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { ThemeSync } from "@/components/theme/ThemeSync";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-noto-devanagari",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SEE Sathi — Class 10 (SEE) Study Companion for Nepal",
  description:
    "Free, beautifully structured study notes and solved questions for every compulsory and optional SEE subject. Compulsory Math, Science, English, नेपाली, Social Studies, Health Population & Environment, Optional Math & Computer Science.",
  keywords: [
    "SEE",
    "Secondary Education Examination",
    "Nepal",
    "Class 10",
    "Study Notes",
    "Solved Questions",
    "CDC Curriculum",
    "Optional Math NEEMA",
    "Compulsory Math",
    "Science Nepal",
  ],
  openGraph: {
    title: "SEE Sathi — Class 10 Companion",
    description: "Master notes, solved questions, and formula sheets for every SEE subject.",
    type: "website",
    siteName: "SEE Sathi",
  },
  twitter: {
    card: "summary_large_image",
    title: "SEE Sathi — Class 10 Companion",
    description: "Master notes, solved questions, and formula sheets for every SEE subject.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable} ${notoDevanagari.variable}`} suppressHydrationWarning>
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var el=document.documentElement;el.classList.remove("dark");el.style.colorScheme="light";}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-body text-on-surface antialiased" suppressHydrationWarning>
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}