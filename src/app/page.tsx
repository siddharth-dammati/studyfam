import type { Metadata } from "next";
import { AllIndiaMockTokkoPage } from "@/components/all-india-mock/AllIndiaMockTokkoPage";
import { HOME_FAQS } from "@/lib/faqData";
import { FREE_MOCKS_DATA } from "@/lib/freeMocksData";

export const metadata: Metadata = {
  title: "StudyFAM — All-India JEE Main 2027 CBT Mock Test & ₹18 Scholarship Pool",
  description:
    "Compete on 27 Dec 2026 in India's premier proctored JEE Main CBT mock. ₹18 of every ₹27 registration is escrowed to refund 100% of NTA application fees (₹1,000 Boys / ₹800 Girls) across 50% Merit & 50% Need-based tracks. Practice 10 free full-length MFTs forever.",
  keywords: [
    "all india jee mock test",
    "jee main 2027 scholarship exam",
    "free jee mock test",
    "jee main 2026 mock test free",
    "jee main 2027 mock test",
    "online cbt test series for jee",
    "nta jee main mock test with solutions",
    "tcs ion cbt mock test replica",
    "jee main cbt simulation",
    "studyfam jee mock",
    "jee test series 75 questions",
    "jee scholarship mock test",
    "jee application fee refund",
    "mathongo test series free alternative",
    "full syllabus jee mock test free",
  ],
  authors: [{ name: "StudyFAM Education" }],
  creator: "StudyFAM",
  publisher: "StudyFAM",
  metadataBase: new URL("https://studyfam.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "StudyFAM — All-India JEE Main 2027 CBT Mock Test & ₹18 Scholarship Pool",
    description:
      "Compete on 27 Dec 2026 in India's premier proctored JEE Main CBT mock. ₹18 of every ₹27 registration is escrowed to refund 100% of NTA application fees (₹1,000 Boys / ₹800 Girls) across 50% Merit & 50% Need-based tracks. Practice 10 free full-length MFTs.",
    url: "https://studyfam.in",
    siteName: "StudyFAM",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "StudyFAM All-India JEE Main CBT Mock Test & Scholarship Exam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StudyFAM — All-India JEE Main 2027 CBT Mock Test & ₹18 Scholarship Pool",
    description:
      "Compete on 27 Dec 2026 in India's premier proctored JEE Main CBT mock. ₹18 of every ₹27 registration is escrowed to refund 100% of NTA application fees. Practice 10 free full MFTs.",
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
        name: "StudyFAM All-India JEE Mock & Scholarship Exam",
        publisher: {
          "@id": "https://studyfam.in/#organization",
        },
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
          url: "https://studyfam.in/#register",
        },
        offers: {
          "@type": "Offer",
          price: "27",
          priceCurrency: "INR",
          validFrom: "2026-10-20T00:00:00+05:30",
          availability: "https://schema.org/PreOrder",
          url: "https://studyfam.in/#register",
        },
        organizer: {
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
            name: "All-India Mock (27 Dec)",
            item: "https://studyfam.in/#overview",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "₹18 Fee Pool",
            item: "https://studyfam.in/#fee-split",
          },
          {
            "@type": "ListItem",
            position: 4,
            name: "Free JEE Main Mock Tests",
            item: "https://studyfam.in/exam",
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
      {/* StudyFAM All-India Mock Flagship Index Page */}
      <AllIndiaMockTokkoPage />
    </>
  );
}
