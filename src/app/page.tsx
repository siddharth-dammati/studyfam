import type { Metadata } from "next";
import { StudyFamTokkoPage } from "@/components/home/StudyFamTokkoPage";
import { HOME_FAQS } from "@/lib/faqData";
import { FREE_MOCKS_DATA } from "@/lib/freeMocksData";

export const metadata: Metadata = {
  title: "StudyFam — India's Free JEE Main CBT Platform & ₹27 National Scholarship Exam",
  description:
    "Practice 10 free full-length JEE Main mock tests (MFT-01 to MFT-10) and 400+ chapter tests with authentic NTA TCS iON CBT interface, question pacing diagnostics, and compete on 27 Dec 2026 in the National Mock (₹27 entry / ₹18 scholarship pool per student). 100% free practice suite forever.",
  keywords: [
    "free jee mock test",
    "jee main 2027 mock test free",
    "all india jee mock test",
    "online cbt test series for jee",
    "nta jee main mock test with solutions",
    "tcs ion cbt mock test replica",
    "full syllabus jee mock test free",
    "jee main cbt simulation",
    "studyfam jee mock",
    "jee test series 75 questions",
    "jee scholarship mock test",
  ],
  authors: [{ name: "StudyFAM Education" }],
  creator: "StudyFAM",
  publisher: "StudyFAM",
  metadataBase: new URL("https://studyfam.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "StudyFam — Free JEE Main CBT Platform & ₹27 National Scholarship Exam",
    description:
      "Take 10 free full-length JEE Main mock tests (750 questions) with official TCS iON CBT simulation, All-India rank predictor, and step-by-step solutions. Compete in the 27 Dec All-India Mock (Registrations start 20 Oct 2026).",
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
    title: "StudyFam — Free JEE Main CBT Platform",
    description:
      "Practice 10 free full-length JEE Main mock tests on official TCS iON CBT interface with instant solutions. 27 Dec All-India Mock Registrations open 20 Oct 2026.",
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
  // Comprehensive Structured JSON-LD Data for Rich Google Results & SEO
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
        description:
          "Comprehensive full syllabus mock tests for JEE Main 2027 aspirants featuring 75 questions each, 180 minutes, and detailed step-by-step solutions.",
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
        "@type": "Event",
        "@id": "https://studyfam.in/#all-india-mock-event",
        name: "All-India Major Mock Test 2027 (National Scholarship Examination)",
        description:
          "Nationwide JEE Main 2027 CBT mock exam where ₹18 of every ₹27 registration fee funds 100% NTA application fee refunds for top rankers across Merit and Need-based tracks.",
        startDate: "2026-12-27T09:00:00+05:30",
        endDate: "2026-12-27T12:00:00+05:30",
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
        location: {
          "@type": "VirtualLocation",
          url: "https://studyfam.in/all-india-mock",
        },
        offers: {
          "@type": "Offer",
          price: "27",
          priceCurrency: "INR",
          validFrom: "2026-10-20T00:00:00+05:30",
          availability: "https://schema.org/PreOrder",
          url: "https://studyfam.in/all-india-mock",
        },
        organizer: {
          "@id": "https://studyfam.in/#organization",
        },
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
          {
            "@type": "ListItem",
            position: 3,
            name: "All-India Mock (27 Dec)",
            item: "https://studyfam.in/#all-india-mock",
          },
        ],
      },
    ],
  };

  return (
    <>
      {/* Semantic JSON-LD Schema for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* StudyFAM Main High-Converting Landing Page */}
      <StudyFamTokkoPage />
    </>
  );
}
