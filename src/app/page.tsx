import type { Metadata } from "next";
import { HomeNavbar } from "@/components/home/HomeNavbar";
import { FreeMocksHero } from "@/components/home/FreeMocksHero";
import { CbtExperienceSection } from "@/components/home/CbtExperienceSection";
import { SyllabusCoverageSection } from "@/components/home/SyllabusCoverageSection";
import { ChapterPracticeSpotlight } from "@/components/home/ChapterPracticeSpotlight";
import { TestSeriesComparison } from "@/components/home/TestSeriesComparison";
import { ScholarshipMockBanner } from "@/components/home/ScholarshipMockBanner";
import { HomeFAQ } from "@/components/home/HomeFAQ";
import { HOME_FAQS } from "@/lib/faqData";
import { HomeFooter } from "@/components/home/HomeFooter";
import { FREE_MOCKS_DATA } from "@/lib/freeMocksData";

export const metadata: Metadata = {
  title: "Free JEE Main Mock Test 2027 | 10 Full-Length NTA CBT Tests with Solutions",
  description: "Practice 10 free full-length JEE Main 2027 mock tests (MFT-1 to MFT-10) with authentic NTA / TCS iON CBT interface, instant All-India percentile prediction, and step-by-step solutions. 100% free.",
  keywords: [
    "free jee mock test",
    "jee main 2027 mock test free",
    "online cbt test series for jee",
    "nta jee main mock test with solutions",
    "full syllabus jee mock test free",
    "jee main cbt simulation",
    "studyfam jee mock",
    "jee main free online practice",
    "jee test series 75 questions",
  ],
  authors: [{ name: "StudyFAM Education" }],
  creator: "StudyFAM",
  publisher: "StudyFAM",
  metadataBase: new URL("https://studyfam.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Free JEE Main Mock Test 2027 | 10 Full-Length NTA CBT Tests with Solutions",
    description: "Take 10 free full-length JEE Main mock tests (750 questions) with real NTA CBT simulation, All-India rank predictor, and step-by-step solutions. 100% free forever.",
    url: "https://studyfam.in",
    siteName: "StudyFAM",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "StudyFAM Free JEE Main Mock Tests",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free JEE Main Mock Test 2027 | 10 Full-Length NTA CBT Tests",
    description: "Practice 10 free full-length JEE Main mock tests on official TCS iON CBT interface with instant solutions.",
    images: ["/icon.png"],
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

export default function HomePage() {
  // Structured JSON-LD Data for Rich Google Results
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": "https://studyfam.in/#organization",
        name: "StudyFAM",
        url: "https://studyfam.in",
        logo: "https://studyfam.in/icon.png",
        description: "India's premier community-driven Free JEE Main CBT Mock Examination and Scholarship platform.",
      },
      {
        "@type": "WebSite",
        "@id": "https://studyfam.in/#website",
        url: "https://studyfam.in",
        name: "StudyFAM Free JEE Mock Tests",
        publisher: {
          "@id": "https://studyfam.in/#organization",
        },
      },
      {
        "@type": "ItemList",
        name: "10 Free Full-Length JEE Main Mock Tests (Official NTA CBT Pattern)",
        description: "Comprehensive full syllabus mock tests for JEE Main 2027 aspirants featuring 75 questions each, 180 minutes, and detailed step-by-step solutions.",
        numberOfItems: FREE_MOCKS_DATA.length,
        itemListElement: FREE_MOCKS_DATA.map((mock, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: mock.title,
          description: `${mock.keyHighlights} Contains ${mock.totalQuestions} questions across Physics, Chemistry, and Mathematics. Duration: ${mock.durationMinutes} minutes.`,
          url: `https://studyfam.in${mock.playerUrl}`,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: HOME_FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://studyfam.in",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Free JEE Main Mock Tests",
            item: "https://studyfam.in/#free-mocks",
          },
        ],
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Semantic JSON-LD Schema for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Floating Sticky Home Navigation */}
      <HomeNavbar />

      <main>
        {/* Hero Section with 10 Free Full Mocks Showcase */}
        <FreeMocksHero />

        {/* Authentic NTA / TCS iON CBT Engine Simulation */}
        <CbtExperienceSection />

        {/* 300+ Chapter-wise & Subject Practice Spotlight */}
        <ChapterPracticeSpotlight />

        {/* Official NTA 2027 Exam Pattern & High-Yield Weightage */}
        <SyllabusCoverageSection />

        {/* Transparent Comparison: StudyFAM Free Mocks vs Paid Coaching */}
        <TestSeriesComparison />

        {/* Upcoming Flagship 27 Dec National Scholarship Mock Spotlight */}
        <ScholarshipMockBanner />

        {/* SEO-Optimized High-Intent FAQ Section */}
        <HomeFAQ />
      </main>

      {/* Rich Semantic Footer */}
      <HomeFooter />
    </div>
  );
}
