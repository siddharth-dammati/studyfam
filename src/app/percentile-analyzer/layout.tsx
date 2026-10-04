import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JEE Main Marks vs Percentile & AIR Rank Predictor 2026/2027 | StudyFAM",
  description:
    "Instant, accurate JEE Main 2026/2027 Marks vs Percentile and All India Rank (AIR) calculator. Modeled on pooled NTA shift normalization distributions, negative marking penalties, and real historical cutoffs.",
  keywords: [
    "jee main marks vs percentile",
    "jee main marks vs percentile 2026",
    "jee main marks vs percentile 2027",
    "jee rank predictor",
    "jee main rank calculator",
    "jee percentile calculator",
    "jee marks vs rank 2026",
    "nta percentile formula",
    "jee main score vs rank",
    "jee 99 percentile marks",
  ],
  alternates: {
    canonical: "https://studyfam.in/percentile-analyzer",
  },
  openGraph: {
    title: "JEE Main Marks vs Percentile & AIR Predictor 2026/2027 | StudyFAM",
    description:
      "Calculate your estimated JEE Main percentile and All India Rank from your raw score (out of 300). Based on statistical NTA normalization models.",
    url: "https://studyfam.in/percentile-analyzer",
    siteName: "StudyFAM",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JEE Main Marks vs Percentile Analyzer by StudyFAM",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JEE Main Marks vs Percentile & AIR Predictor | StudyFAM",
    description:
      "Estimate your All India Rank and Percentile from your raw score with NTA normalization statistical baselines.",
    images: ["/og-image.png"],
  },
};

export default function PercentileAnalyzerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "StudyFAM JEE Main Percentile & AIR Analyzer",
        url: "https://studyfam.in/percentile-analyzer",
        applicationCategory: "EducationalApplication",
        operatingSystem: "All",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR",
        },
        description:
          "Statistical estimator for converting JEE Main raw marks (out of 300) into estimated percentiles and All India Ranks based on pooled NTA normalization models.",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How are JEE Main marks converted into percentiles?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The NTA calculates percentiles using the formula: (100 * Number of candidates appeared in the session with raw score EQUAL TO OR LESS than the candidate) / Total number of candidates who appeared in that session.",
            },
          },
          {
            "@type": "Question",
            name: "How many marks are required for 99 percentile in JEE Main?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Historically, 99 percentile ranges between 175 to 205 marks depending on the shift difficulty level and candidate performance distribution.",
            },
          },
          {
            "@type": "Question",
            name: "Does negative marking affect your JEE percentile?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Negative marks (-1 per incorrect answer) reduce your raw aggregate score, which directly pulls down your percentile ranking compared to other candidates who avoided speculative guessing.",
            },
          },
        ],
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
            name: "JEE Main Percentile Analyzer",
            item: "https://studyfam.in/percentile-analyzer",
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
