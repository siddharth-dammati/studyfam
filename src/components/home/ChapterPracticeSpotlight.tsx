"use client";

import React from "react";
import Link from "next/link";
import {
  Layers,
  Atom,
  FlaskConical,
  Calculator,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  PlayCircle,
  HelpCircle,
  BookOpen,
} from "lucide-react";

export function ChapterPracticeSpotlight() {
  const subjectHighlights = [
    {
      subject: "Physics Chapter Question Banks",
      icon: <Atom className="w-6 h-6 text-sky-600" />,
      color: "sky",
      testCount: "110+ Chapter Tests",
      questionCount: "3,100+ Questions",
      topics: ["Kinematics & Dynamics", "Rotational Motion", "Electrodynamics & AC", "Modern Physics", "Wave Optics & Ray Optics"],
      bgBadge: "bg-sky-50 text-sky-700 border-sky-200",
      ctaUrl: "/exam",
    },
    {
      subject: "Chemistry Chapter Question Banks",
      icon: <FlaskConical className="w-6 h-6 text-emerald-600" />,
      color: "emerald",
      testCount: "125+ Chapter Tests",
      questionCount: "3,300+ Questions",
      topics: ["General Organic Chemistry (GOC)", "Chemical Thermodynamics", "Coordination Compounds", "Aldehydes & Ketones", "Chemical Bonding"],
      bgBadge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      ctaUrl: "/exam",
    },
    {
      subject: "Mathematics Chapter Question Banks",
      icon: <Calculator className="w-6 h-6 text-purple-600" />,
      color: "purple",
      testCount: "105+ Chapter Tests",
      questionCount: "2,900+ Questions",
      topics: ["Definite & Indefinite Integrals", "Conic Sections (Parabola, Ellipse)", "Matrices & Determinants", "Vectors & 3D Geometry", "Limits & Continuity"],
      bgBadge: "bg-purple-50 text-purple-700 border-purple-200",
      ctaUrl: "/exam",
    },
  ];

  return (
    <section id="chapter-tests" className="py-20 sm:py-28 bg-[#F8FAFC] text-slate-900 border-b border-slate-200/90 scroll-mt-20 relative overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-200/90 rounded-full px-3.5 py-1 mb-4">
              <Layers className="w-3.5 h-3.5 text-sky-600" />
              <span className="text-sky-800 text-[11px] font-mono font-bold uppercase tracking-wider">
                Targeted Chapter Mastery
              </span>
            </div>

            <h2 className="text-[clamp(2.1rem,4.2vw,3.6rem)] font-extrabold tracking-tight text-slate-900 leading-tight mb-4">
              Beyond Full Mocks:{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600">
                300+ Chapter-wise Diagnostic Tests.
              </span>
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Discovered a weak topic in Full Mock 1 or 2? Drill directly into targeted 15 to 30 question chapter tests with instant step-by-step solutions to seal your knowledge gaps.
            </p>
          </div>

          <Link
            href="/exam"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-all shadow-xs hover:shadow shrink-0 active:scale-95"
          >
            <span>Explore 9,300+ Question Bank</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 3 Subject Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {subjectHighlights.map((sub) => (
            <div
              key={sub.subject}
              className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-xs">
                    {sub.icon}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${sub.bgBadge}`}>
                      {sub.testCount}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 font-semibold">
                      {sub.questionCount}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-3">
                  {sub.subject}
                </h3>

                <p className="text-xs text-slate-500 mb-4">
                  Curated chapters with exact NTA difficulty distribution:
                </p>

                {/* Topics List */}
                <div className="space-y-1.5 mb-6">
                  {sub.topics.map((t) => (
                    <div key={t} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Link
                  href={sub.ctaUrl}
                  className="w-full inline-flex items-center justify-between py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition-all"
                >
                  <span>Practice Chapter Tests</span>
                  <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
