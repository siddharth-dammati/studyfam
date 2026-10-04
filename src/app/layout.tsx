import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { AnnouncementBanner } from "@/components/ui/AnnouncementBanner";

const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0d14" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://studyfam.in"),
  title: {
    default: "StudyFAM — India's Free JEE Main 2026/2027 CBT Mock Platform & National Scholarship Exam",
    template: "%s | StudyFAM",
  },
  description:
    "Practice 10 free full-length JEE Main mock tests (750 questions) with authentic NTA TCS iON CBT interface, question pacing diagnostics, and compete on 27 Dec 2026 in the National Mock (₹27 entry / ₹18 scholarship pool per student). 100% free practice suite forever.",
  keywords: [
    "free jee mock test",
    "jee main 2026 mock test free",
    "jee main 2027 mock test",
    "all india jee mock test",
    "online cbt test series for jee",
    "nta jee main mock test with solutions",
    "tcs ion cbt mock test replica",
    "jee percentile predictor 2026",
    "jee marks vs rank calculator",
    "full syllabus jee mock test free",
    "jee main cbt simulation",
    "studyfam jee mock",
    "jee test series 75 questions",
    "jee scholarship mock test",
    "major full test mft series",
  ],
  authors: [{ name: "StudyFAM Academic Team", url: "https://studyfam.in" }],
  creator: "StudyFAM",
  publisher: "StudyFAM Technologies",
  category: "education",
  applicationName: "StudyFAM",
  alternates: {
    canonical: "https://studyfam.in",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "StudyFAM — Free JEE Main CBT Mock Test Series & National Scholarship Exam",
    description:
      "Practice 10 free full-length JEE Main mock tests (750 questions) with official TCS iON CBT simulation, All-India rank predictor, and step-by-step solutions. Compete in the 27 Dec All-India Mock.",
    url: "https://studyfam.in",
    siteName: "StudyFAM",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StudyFAM Free JEE Main CBT Mock Tests & National Scholarship Exam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StudyFAM — India's Free JEE Main CBT Platform",
    description:
      "Practice 10 free full-length JEE Main mock tests on official TCS iON CBT interface with instant solutions and question pacing diagnostics. 100% free forever.",
    images: ["/og-image.png"],
    creator: "@studyfam",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Global Educational Platform & WebSite JSON-LD Schema
  const globalSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": "https://studyfam.in/#organization",
        name: "StudyFAM",
        url: "https://studyfam.in",
        logo: "https://studyfam.in/icon-512.png",
        sameAs: [
          "https://t.me/studyfam",
          "https://twitter.com/studyfam",
        ],
        description:
          "India's premier community-driven Free JEE Main CBT Mock Examination and Scholarship platform.",
        address: {
          "@type": "PostalAddress",
          addressCountry: "IN",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://studyfam.in/#website",
        url: "https://studyfam.in",
        name: "StudyFAM — Free JEE Main Mock Tests",
        publisher: {
          "@id": "https://studyfam.in/#organization",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: "https://studyfam.in/exam?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "StudyFAM TCS iON CBT Examination Engine",
        operatingSystem: "Any (Web Browser, Chrome, Firefox, Safari, Edge)",
        applicationCategory: "EducationalApplication",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR",
        },
        featureList:
          "Real-time 180 minute countdown timer, Official +4/-1 marking scheme, Section A MCQs and Section B Numericals, Collapsible 5-state TCS iON palette, Question pacing diagnostics, Detailed textbook solutions",
      },
    ],
  };

  return (
    <html lang="en" className={`scroll-smooth ${geist.variable} ${geistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />
      </head>
      <body className={`font-sans bg-[var(--background)] text-[var(--foreground)] antialiased selection:bg-[var(--accent)]/20 selection:text-[var(--accent)]`}>
        <SiteConfigProvider>
          <AnnouncementBanner />
          {children}
        </SiteConfigProvider>
      </body>
    </html>
  );
}
