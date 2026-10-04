import type { Metadata } from "next";
import { FREE_MOCKS_DATA } from "@/lib/freeMocksData";

export const metadata: Metadata = {
  title: "10 Free Full-Length JEE Main Mock Tests (MFT Series) | Official TCS iON CBT",
  description:
    "Practice 10 full-length JEE Main mock tests (750 questions) with authentic NTA TCS iON CBT simulation. Features real 180-minute countdown, +4/-1 marking, per-question pacing diagnostics, and step-by-step solutions.",
  keywords: [
    "jee main mock tests free",
    "free jee test series 2026",
    "free jee test series 2027",
    "nta jee mock papers with solutions",
    "mft series jee main",
    "tcs ion cbt exam simulation",
    "jee full syllabus mock test",
    "jee main physics chemistry maths practice",
    "major full test studyfam",
  ],
  alternates: {
    canonical: "https://studyfam.in/exam",
  },
  openGraph: {
    title: "10 Free Full-Length JEE Main Mock Tests | StudyFAM",
    description:
      "Practice 10 authentic full-length JEE Main CBT mock tests (750 questions) modeled on the latest NTA question pattern with instant solutions.",
    url: "https://studyfam.in/exam",
    siteName: "StudyFAM",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "10 Free Full-Length JEE Main Mock Tests on StudyFAM",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "10 Free Full-Length JEE Main Mock Tests (MFT Series)",
    description:
      "Simulate the actual NTA CBT examination with real 180-min timers, official question palettes, and step-by-step solutions.",
    images: ["/og-image.png"],
  },
};

export default function ExamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: "10 Free Official JEE Main Mock Tests (Major Full Test Series)",
        description:
          "Full syllabus JEE Main practice tests adhering to official NTA guidelines: 75 questions, 300 marks, 180 minutes, with detailed explanations.",
        numberOfItems: FREE_MOCKS_DATA.length,
        itemListElement: FREE_MOCKS_DATA.map((mock, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: mock.title,
          description: `${mock.keyHighlights} Focus topics: ${mock.focusTopics.join(", ")}.`,
          url: `https://studyfam.in/exam/mft-${mock.mockNumber}`,
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
            item: "https://studyfam.in/exam",
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {children}
    </>
  );
}
