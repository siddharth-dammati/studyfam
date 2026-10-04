import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All-India JEE Main Mock Test (27 Dec) & ₹27 National Scholarship Exam | StudyFAM",
  description:
    "Register for India's nationwide JEE Main CBT Mock Test on Sunday, 27 Dec 2026 (09:00 AM – 12:00 PM IST). Entry ₹27 (₹18 scholarship pool per student). Top rankers win 100% official NTA JEE application fee refunds.",
  keywords: [
    "all india jee mock test",
    "national jee main mock test",
    "jee scholarship exam",
    "nta exam fee refund scholarship",
    "27 dec jee mock test",
    "studyfam all india mock test",
    "jee main 2027 scholarship test",
    "all india rank cbt mock",
  ],
  alternates: {
    canonical: "https://studyfam.in/all-india-mock",
  },
  openGraph: {
    title: "All-India JEE Main Mock Test (27 Dec) | StudyFAM National Scholarship",
    description:
      "Compete with thousands of JEE aspirants nationwide on 27 Dec 2026. Top rankers receive full NTA exam fee sponsorships funded by the community escrow pool.",
    url: "https://studyfam.in/all-india-mock",
    siteName: "StudyFAM",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "All-India JEE Main Mock Test on StudyFAM",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All-India JEE Main Mock Test — 27 Dec 2026",
    description:
      "₹27 entry · ₹18 scholarship pool · Top performers win 100% NTA application fee refund.",
    images: ["/og-image.png"],
  },
};

export default function AllIndiaMockLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Event",
        name: "StudyFAM All-India Major Mock Test & National Scholarship Exam",
        description:
          "Nationwide proctored Computer Based Test (CBT) for JEE Main 2026/2027 candidates. ₹18 of every ₹27 registration fee funds 100% NTA application fee refunds for top rankers across Merit and Need-based tracks.",
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
          availability: "https://schema.org/PreOrder",
          validFrom: "2026-10-20T00:00:00+05:30",
          url: "https://studyfam.in/all-india-mock",
        },
        organizer: {
          "@type": "EducationalOrganization",
          name: "StudyFAM Technologies",
          url: "https://studyfam.in",
        },
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
            item: "https://studyfam.in/all-india-mock",
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
