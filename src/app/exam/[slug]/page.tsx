import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Award,
  Zap,
  HelpCircle,
  BarChart2,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { FREE_MOCKS_DATA, FreeMockTestItem } from "@/lib/freeMocksData";
import { Logo } from "@/components/ui/Logo";
import { Footer } from "@/components/sections/Footer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function resolveMock(slug: string): FreeMockTestItem | undefined {
  const clean = slug.toLowerCase().trim();
  const numMatch = clean.match(/(?:mft-?|test-?)?0?(\d+)/i);
  if (!numMatch) return undefined;
  const num = parseInt(numMatch[1], 10);
  return FREE_MOCKS_DATA.find((m) => m.mockNumber === num);
}

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (const mock of FREE_MOCKS_DATA) {
    params.push({ slug: `mft-${mock.mockNumber}` });
    if (mock.mockNumber < 10) {
      params.push({ slug: `mft-0${mock.mockNumber}` });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const test = resolveMock(slug);
  if (!test) return {};

  const canonicalUrl = `https://studyfam.in/exam/mft-${test.mockNumber}`;

  return {
    title: `${test.title} (${test.code}) — Free JEE Main CBT Mock Test with Solutions`,
    description: `Attempt ${test.title} for free on authentic TCS iON CBT interface. 75 questions (Physics, Chemistry, Maths), 300 marks, 180 mins. Includes per-question pacing diagnostics & step-by-step textbook solutions.`,
    keywords: [
      test.title.toLowerCase(),
      `${test.code.toLowerCase()} jee mock`,
      "free jee main mock test",
      "jee main online cbt practice",
      "jee full syllabus mock test",
      ...test.focusTopics.map((t) => t.toLowerCase()),
      "jee main 2026 test series",
      "jee main 2027 test series",
      "tcs ion jee exam simulator",
      "jee question paper with solutions",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${test.title} (${test.code}) — Free JEE Main CBT Mock Test`,
      description: `${test.keyHighlights} Practice in authentic NTA TCS iON CBT mode with instant solutions and percentile predictor.`,
      url: canonicalUrl,
      siteName: "StudyFAM",
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${test.title} Free JEE Main CBT Practice Paper`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${test.title} (${test.code}) — Free JEE Main Mock Test`,
      description: `75 Questions · 300 Marks · 180 Minutes · TCS iON CBT Mode · Step-by-Step Solutions.`,
      images: ["/og-image.png"],
    },
  };
}

export default async function MockTestDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const test = resolveMock(slug);

  if (!test) {
    notFound();
  }

  const prevMock = FREE_MOCKS_DATA.find((m) => m.mockNumber === test.mockNumber - 1);
  const nextMock = FREE_MOCKS_DATA.find((m) => m.mockNumber === test.mockNumber + 1);

  // Structured Data Schema for Quiz / LearningResource
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Quiz",
        name: `${test.title} (${test.code}) — JEE Main CBT Practice Examination`,
        description: test.keyHighlights,
        typicalAgeRange: "16-19",
        educationalLevel: "Senior Secondary / Competitive Entrance Examination",
        timeRequired: "PT180M",
        assesses: "Physics, Chemistry, and Mathematics for JEE Main",
        hasPart: [
          {
            "@type": "Question",
            name: "Physics Section",
            text: "25 questions covering Mechanics, Electrodynamics, Modern Physics, and Optics (20 MCQs + 5 Numericals).",
          },
          {
            "@type": "Question",
            name: "Chemistry Section",
            text: "25 questions covering Physical, Inorganic, and Organic Chemistry (20 MCQs + 5 Numericals).",
          },
          {
            "@type": "Question",
            name: "Mathematics Section",
            text: "25 questions covering Calculus, Algebra, Coordinate Geometry, Vectors and 3D (20 MCQs + 5 Numericals).",
          },
        ],
      },
      {
        "@type": "LearningResource",
        name: `${test.title} Full Paper with Solutions`,
        learningResourceType: "Practice Test",
        educationalUse: "Exam Preparation",
        isAccessibleForFree: true,
        inLanguage: "en",
        provider: {
          "@type": "EducationalOrganization",
          name: "StudyFAM",
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
            name: "Free JEE Main Mock Tests",
            item: "https://studyfam.in/exam",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: test.title,
            item: `https://studyfam.in/exam/mft-${test.mockNumber}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `Is ${test.title} really 100% free to attempt?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Yes, ${test.title} is completely free. There are no paywalls, hidden tokens, or subscription locks. You can take the full 180-minute test and access comprehensive solutions immediately after submission.`,
            },
          },
          {
            "@type": "Question",
            name: `Does this test replicate the authentic TCS iON CBT interface?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Yes, StudyFAM provides a high-fidelity simulation of the official NTA TCS iON Computer Based Test interface with 5-state question palettes, live countdown timers, question paper views, and marking scheme (+4 for correct, -1 for incorrect).`,
            },
          },
          {
            "@type": "Question",
            name: `Are step-by-step textbook solutions provided for ${test.code}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Yes. Upon test submission, you receive instant access to step-by-step solutions with detailed mathematical derivations, reaction mechanisms, and question pacing diagnostics.`,
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] flex flex-col font-sans selection:bg-[#1a5fe0] selection:text-white">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Ambient Radial Backgrounds */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-radial from-[#d6aef2]/20 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 -left-40 w-[500px] h-[500px] rounded-full bg-radial from-[#2f8fff]/15 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(26,26,26,0.035)_1.2px,transparent_1.8px)] [background-size:24px_24px] pointer-events-none -z-10" />

      {/* Navigation Bar */}
      <header className="border-b border-[rgba(26,26,26,0.08)] bg-[#fafafa]/85 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link href="/" className="flex items-center">
            <Logo className="h-7 shrink-0" textClassName="text-base" />
          </Link>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <Link
            href="/exam"
            className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors hidden sm:inline"
          >
            All 10 Mock Tests
          </Link>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link
            href="/all-india-mock"
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors hidden sm:inline"
          >
            National Mock (27 Dec)
          </Link>
          <Link
            href="/percentile-analyzer"
            className="text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors hidden md:inline"
          >
            Percentile Analyzer
          </Link>
          <Link
            href="/dashboard"
            className="px-3.5 py-1.5 bg-gradient-to-r from-[#0a1c96] to-[#1f6ff2] hover:opacity-95 text-white rounded-full text-xs font-semibold transition-all shadow-2xs active:scale-95"
          >
            Candidate Portal
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <Link href="/" className="hover:text-slate-800 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/exam" className="hover:text-slate-800 transition-colors">
            Free Mock Tests
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">{test.code}</span>
        </nav>

        {/* Hero Card */}
        <section className="bg-white border border-[rgba(26,26,26,0.08)] rounded-[32px] p-6 sm:p-10 shadow-[0_20px_50px_-20px_rgba(10,28,150,0.08)] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0a1c96] via-[#1a5fe0] to-[#16a34a]" />

          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-[#e9f1fd] border border-[#1a5fe0]/20 text-[#0a1c96] text-xs font-bold font-mono rounded-full uppercase tracking-wider">
                {test.code}
              </span>
              <span className="px-3 py-1 bg-[#dcfce7] border border-[#86efac]/80 text-[#16a34a] text-xs font-semibold rounded-full">
                {test.badge}
              </span>
              <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-600 text-xs font-mono rounded-full">
                {test.pattern}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1a1a1a] tracking-tight leading-tight">
              {test.title} — Full Syllabus JEE Main CBT Practice Paper
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {test.keyHighlights} Experience the real NTA test environment with authentic 180-minute countdown timers, official marking scheme (+4 / -1), collapsible 5-state question palettes, and step-by-step textbook solutions.
            </p>

            {/* Test Core Attributes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              <div className="p-3 bg-[#fafafa] rounded-2xl border border-[rgba(26,26,26,0.06)]">
                <div className="text-[11px] text-slate-400 font-medium uppercase font-mono">Questions</div>
                <div className="text-base sm:text-lg font-bold text-slate-800 font-mono mt-0.5">
                  {test.totalQuestions} Questions
                </div>
              </div>

              <div className="p-3 bg-[#fafafa] rounded-2xl border border-[rgba(26,26,26,0.06)]">
                <div className="text-[11px] text-slate-400 font-medium uppercase font-mono">Duration</div>
                <div className="text-base sm:text-lg font-bold text-slate-800 font-mono mt-0.5">
                  {test.durationMinutes} Minutes
                </div>
              </div>

              <div className="p-3 bg-[#fafafa] rounded-2xl border border-[rgba(26,26,26,0.06)]">
                <div className="text-[11px] text-slate-400 font-medium uppercase font-mono">Max Marks</div>
                <div className="text-base sm:text-lg font-bold text-[#0a1c96] font-mono mt-0.5">
                  {test.totalMarks} Marks
                </div>
              </div>

              <div className="p-3 bg-[#fafafa] rounded-2xl border border-[rgba(26,26,26,0.06)]">
                <div className="text-[11px] text-slate-400 font-medium uppercase font-mono">Difficulty</div>
                <div className="text-base sm:text-lg font-bold text-[#16a34a] mt-0.5">
                  {test.difficulty}
                </div>
              </div>
            </div>

            {/* CTA Launcher */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href={test.playerUrl}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#0a1c96] via-[#1a5fe0] to-[#123ac8] text-white rounded-full text-sm font-bold shadow-[0_12px_24px_-8px_rgba(26,95,224,0.5)] hover:opacity-95 transition-all active:scale-98"
              >
                <span>Take {test.code} in CBT Interface Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/exam"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-3.5 bg-white border border-[rgba(26,26,26,0.12)] hover:border-[#1a5fe0]/40 text-slate-700 rounded-full text-xs sm:text-sm font-semibold transition-all active:scale-98"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
                <span>Explore All 10 MFTs</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Syllabus & Question Distribution Section */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#1a5fe0]" />
            <h2 className="text-lg sm:text-xl font-bold text-[#1a1a1a]">
              Subject Syllabus &amp; Question Distribution
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Physics Card */}
            <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-[24px] p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200/60 rounded-full font-mono text-xs font-bold">
                  Physics
                </span>
                <span className="text-xs font-mono font-semibold text-slate-500">
                  25 Qs · 100 Marks
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Section A: 20 Multiple Choice Questions<br />
                Section B: 5 Numerical Value Questions
              </p>
              <div className="pt-2 border-t border-slate-100">
                <div className="text-[11px] font-mono font-bold text-slate-400 uppercase">Key Focus</div>
                <div className="text-xs font-medium text-slate-800 mt-1">
                  Mechanics, Electrodynamics, Modern Physics, Thermodynamics &amp; Optics.
                </div>
              </div>
            </div>

            {/* Chemistry Card */}
            <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-[24px] p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full font-mono text-xs font-bold">
                  Chemistry
                </span>
                <span className="text-xs font-mono font-semibold text-slate-500">
                  25 Qs · 100 Marks
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Section A: 20 Multiple Choice Questions<br />
                Section B: 5 Numerical Value Questions
              </p>
              <div className="pt-2 border-t border-slate-100">
                <div className="text-[11px] font-mono font-bold text-slate-400 uppercase">Key Focus</div>
                <div className="text-xs font-medium text-slate-800 mt-1">
                  Physical Chemistry, Coordination Compounds, Organic Mechanisms &amp; Equilibrium.
                </div>
              </div>
            </div>

            {/* Mathematics Card */}
            <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-[24px] p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 border border-purple-200/60 rounded-full font-mono text-xs font-bold">
                  Mathematics
                </span>
                <span className="text-xs font-mono font-semibold text-slate-500">
                  25 Qs · 100 Marks
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Section A: 20 Multiple Choice Questions<br />
                Section B: 5 Numerical Value Questions
              </p>
              <div className="pt-2 border-t border-slate-100">
                <div className="text-[11px] font-mono font-bold text-slate-400 uppercase">Key Focus</div>
                <div className="text-xs font-medium text-slate-800 mt-1">
                  Calculus, Matrices &amp; Determinants, Coordinate Geometry, Vectors &amp; 3D.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Take this Mock on StudyFAM */}
        <section className="bg-white border border-[rgba(26,26,26,0.08)] rounded-[28px] p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#1a5fe0]" />
            <h2 className="text-lg sm:text-xl font-bold text-[#1a1a1a]">
              Key Features &amp; Diagnostic Advantages of {test.code}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-600">
            <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-[#fafafa] border border-slate-100">
              <CheckCircle2 className="w-5 h-5 text-[#16a34a] shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold mb-0.5">Authentic TCS iON CBT Engine</strong>
                Exact 1:1 replica of the candidate computer terminal used by NTA across official exam centers.
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-[#fafafa] border border-slate-100">
              <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold mb-0.5">Per-Question Speed Telemetry</strong>
                Track exactly how many seconds you spend per question to eliminate time sinks and negative marking.
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-[#fafafa] border border-slate-100">
              <BookOpen className="w-5 h-5 text-[#1a5fe0] shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold mb-0.5">Comprehensive Explanations</strong>
                Step-by-step textbook solutions available immediately on submission to review every question.
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-[#fafafa] border border-slate-100">
              <BarChart2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold mb-0.5">All-India Benchmarking</strong>
                Compare your raw score with thousands of peers nationwide to prepare for the 27 Dec National Mock.
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="bg-white border border-[rgba(26,26,26,0.08)] rounded-[28px] p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-[#1a5fe0]" />
            <h2 className="text-lg sm:text-xl font-bold text-[#1a1a1a]">
              Frequently Asked Questions about {test.code}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#fafafa] border border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Is {test.title} completely free?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes. All 10 Major Full Tests on StudyFAM are 100% free forever. No credit cards, trial locks, or payment walls.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#fafafa] border border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Can I reattempt {test.code} multiple times?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes. You can reattempt any mock test to improve your pacing, numerical accuracy, and time management skills.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#fafafa] border border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                How does taking this test prepare me for the 27 Dec All-India Mock?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The 10 MFT papers are calibrated to match the rigor and distribution of the 27 Dec All-India Mock. Practicing them guarantees you are fully conditioned for exam stamina and navigation speed.
              </p>
            </div>
          </div>
        </section>

        {/* Prev / Next Test Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[rgba(26,26,26,0.08)]">
          {prevMock ? (
            <Link
              href={`/exam/mft-${prevMock.mockNumber}`}
              className="flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-[#0a1c96] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous: {prevMock.code} ({prevMock.title})</span>
            </Link>
          ) : (
            <div />
          )}

          {nextMock ? (
            <Link
              href={`/exam/mft-${nextMock.mockNumber}`}
              className="flex items-center space-x-2 text-xs font-semibold text-[#0a1c96] hover:underline transition-colors"
            >
              <span>Next: {nextMock.code} ({nextMock.title})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/exam"
              className="flex items-center space-x-2 text-xs font-semibold text-[#0a1c96] hover:underline transition-colors"
            >
              <span>View All 10 Tests</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
