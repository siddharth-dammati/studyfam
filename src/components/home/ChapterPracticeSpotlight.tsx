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
} from "lucide-react";

export function ChapterPracticeSpotlight() {
  const subjectHighlights = [
    {
      subject: "Physics Chapter Tests",
      icon: <Atom className="w-6 h-6 text-blue-600" />,
      color: "blue",
      testCount: "110+ Tests",
      topics: ["Kinematics & Dynamics", "Rotational Motion", "Electrodynamics", "Modern Physics", "Wave Optics"],
      bgBadge: "bg-blue-50 text-blue-800 border-blue-200",
      ctaUrl: "/exam",
    },
    {
      subject: "Chemistry Chapter Tests",
      icon: <FlaskConical className="w-6 h-6 text-emerald-600" />,
      color: "emerald",
      testCount: "125+ Tests",
      topics: ["General Organic Chemistry", "Chemical Thermodynamics", "Coordination Compounds", "Aldehydes & Ketones", "Chemical Bonding"],
      bgBadge: "bg-emerald-50 text-emerald-800 border-emerald-200",
      ctaUrl: "/exam",
    },
    {
      subject: "Mathematics Chapter Tests",
      icon: <Calculator className="w-6 h-6 text-purple-600" />,
      color: "purple",
      testCount: "105+ Tests",
      topics: ["Definite & Indefinite Integrals", "Conic Sections", "Matrices & Determinants", "Vectors & 3D Geometry", "Limits & Continuity"],
      bgBadge: "bg-purple-50 text-purple-800 border-purple-200",
      ctaUrl: "/exam",
    },
  ];

  return (
    <section id="chapter-tests" className="py-20 sm:py-28 bg-white border-b border-slate-200 scroll-mt-20">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200/90 rounded-full px-3.5 py-1 mb-4">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-blue-800 text-[11px] font-mono font-bold uppercase tracking-wider">
                Targeted Chapter Practice
              </span>
            </div>

            <h2 className="text-[clamp(1.9rem,3.8vw,3.2rem)] font-extrabold tracking-tight text-slate-900 leading-tight mb-3">
              Beyond Full Mocks:{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                300+ Chapter-wise Practice Tests.
              </span>
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Found a weak area in Full Mock Test 1 or 2? Drill down into targeted 15 to 30 question chapter tests with immediate solutions to lock in your fundamentals.
            </p>
          </div>

          <Link
            href="/exam"
            className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-all shadow-sm shrink-0"
          >
            <span>Explore Full Question Bank</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 3 Subject Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {subjectHighlights.map((sub) => (
            <div
              key={sub.subject}
              className="bg-slate-50/70 border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center">
                    {sub.icon}
                  </div>
                  <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${sub.bgBadge}`}>
                    {sub.testCount}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-3">
                  {sub.subject}
                </h3>

                <p className="text-xs text-slate-500 mb-4">
                  Focused 15–30 question sets crafted to strengthen formula application and concept recall.
                </p>

                <div className="space-y-1.5 mb-6">
                  {sub.topics.map((t) => (
                    <div key={t} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={sub.ctaUrl}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 transition-colors"
              >
                <span>Browse Subject Tests</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          ))}
        </div>

        {/* Features banner */}
        <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-950 mb-1">
                Zero Fees · Completely Unlocked for All Students
              </h4>
              <p className="text-xs text-emerald-800 leading-relaxed max-w-2xl">
                No trial periods, no hidden fees, no subscription cards required. Every aspirant deserves access to top-tier JEE test practice.
              </p>
            </div>
          </div>

          <Link
            href="/exam"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shrink-0 shadow-xs"
          >
            <span>Start Practicing Now</span>
            <ArrowRight size={13} />
          </Link>
        </div>

      </div>
    </section>
  );
}
