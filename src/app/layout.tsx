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
    // Core high volume terms
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
    // Competitor & alternative search terms
    "mathongo test series free alternative",
    "allen test series free alternative",
    "resonance test series free alternative",
    "best free test series for jee main",
    "jee main mock test series free online with timer",
    // Subject specific student queries
    "jee main physics mock test 25 questions with solutions",
    "jee main chemistry mock test 25 questions with solutions",
    "jee main maths mock test 25 questions with solutions",
    "jee main section b numerical practice integer questions",
    "jee main chapterwise and full syllabus test series",
    "jee mock test with negative marking +4 -1",
    // Score & Percentile specific searches
    "jee main marks for 99 percentile",
    "jee main 2026 score to rank predictor",
    "how to score 200 marks in jee main",
    "nta percentile calculation formula",
    // Target groups
    "jee mock test for class 12",
    "jee mock test for droppers 2026",
    "jee main mock test with step by step solutions pdf",
    "national scholarship exam for jee aspirants",
    "nta jee application fee refund scholarship",
  ],
  authors: [{ name: "StudyFAM Academic Team", url: "https://studyfam.in" }],
  creator: "StudyFAM",
  publisher: "StudyFAM Technologies",
  category: "education",
  applicationName: "StudyFAM",
  other: {
    subject: "JEE Main Free Mock Tests, TCS iON CBT Practice Engine, Percentile & Rank Predictor",
    topic: "Engineering Entrance Exam Preparation India (JEE Main 2026/2027)",
    classification: "Education / Competitive Exams / Engineering Entrance",
    coverage: "India",
    distribution: "Global",
    rating: "General",
  },
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
      {
        "@type": "FAQPage",
        name: "JEE Main Free Mock Tests & CBT Exam Guide",
        mainEntity: [
          {
            "@type": "Question",
            name: "Where can I attempt free full-length JEE Main mock tests on TCS iON CBT interface?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "StudyFAM (https://studyfam.in/exam) provides 10 free full-length Major Full Tests (MFT-01 to MFT-10) featuring 75 questions each, 180-minute countdown timers, official +4/-1 marking, and an authentic TCS iON 5-state question palette.",
            },
          },
          {
            "@type": "Question",
            name: "What is the best free alternative to paid JEE test series like MathonGo and Allen?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "StudyFAM offers a completely free alternative to paid test series like MathonGo and Allen. Candidates get 750 high-yield questions across Physics, Chemistry, and Mathematics, question-by-question speed telemetry, step-by-step textbook solutions, and All-India percentile benchmarking with zero subscription fees.",
            },
          },
          {
            "@type": "Question",
            name: "How many marks are required to score 99 percentile in JEE Main 2026/2027?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Historically, 99 percentile in JEE Main requires between 175 to 205 marks out of 300, depending on shift difficulty level. You can use the StudyFAM Percentile & Rank Predictor (https://studyfam.in/percentile-analyzer) to estimate your percentile from your raw score.",
            },
          },
          {
            "@type": "Question",
            name: "How are Section B numerical integer questions evaluated in JEE Main?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "In Section B, candidates must solve numerical value problems and enter integers or decimals rounded to the nearest integer. Correct answers earn +4 marks, while incorrect answers deduct -1 mark.",
            },
          },
          {
            "@type": "Question",
            name: "What is the StudyFAM All-India Mock Test on 27 Dec 2026?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The StudyFAM All-India Mock is a nationwide proctored CBT examination conducted on Sunday, 27 Dec 2026 (09:00 AM – 12:00 PM IST). With a nominal ₹27 registration fee, ₹18 per candidate is escrowed to refund 100% of the official NTA JEE Main application fee (₹1,000 for boys / ₹800 for girls) for top rankers across Merit and Need-based tracks.",
            },
          },
        ],
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
