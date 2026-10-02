"use client";

import React, { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Atom,
  FlaskConical,
  Calculator,
  TrendingUp,
  Percent,
  Layers,
  ArrowRight,
  Clock,
  Award,
} from "lucide-react";
import Link from "next/link";

export function SyllabusCoverageSection() {
  const [activeSubject, setActiveSubject] = useState<"physics" | "chemistry" | "maths">("physics");

  const syllabusData = {
    physics: {
      subject: "Physics",
      icon: <Atom className="w-5 h-5 text-sky-600" />,
      color: "sky",
      totalUnits: "10 Core Units",
      questionDistribution: "25 Questions (20 MCQ + 5 Numerical)",
      highYield: [
        { name: "Mechanics (Kinematics, Laws of Motion, Rotational)", weight: "24–28%", questions: "6–7 Qs" },
        { name: "Electrodynamics & Current Electricity", weight: "20–24%", questions: "5–6 Qs" },
        { name: "Modern Physics & Semiconductors", weight: "12–16%", questions: "3–4 Qs" },
        { name: "Optics (Ray & Wave Optics)", weight: "8–12%", questions: "2–3 Qs" },
        { name: "Thermodynamics & Kinetic Theory (KTG)", weight: "8–10%", questions: "2 Qs" },
        { name: "Oscillations, SHM & Waves", weight: "8–10%", questions: "2 Qs" },
      ],
      description: "Tested across all 10 free full mocks with balanced standard numericals and conceptual assertion-reasoning questions.",
    },
    chemistry: {
      subject: "Chemistry",
      icon: <FlaskConical className="w-5 h-5 text-emerald-600" />,
      color: "emerald",
      totalUnits: "10 Core Units (Physical, Organic, Inorganic)",
      questionDistribution: "25 Questions (20 MCQ + 5 Numerical)",
      highYield: [
        { name: "Organic Chemistry (GOC, Hydrocarbons, Functional Groups)", weight: "32–36%", questions: "8–9 Qs" },
        { name: "Physical Chemistry (Equilibrium, Thermo, Kinetics)", weight: "30–34%", questions: "7–8 Qs" },
        { name: "Coordination Compounds & d-Block Elements", weight: "14–18%", questions: "4–5 Qs" },
        { name: "Chemical Bonding & Molecular Structure", weight: "8–12%", questions: "2–3 Qs" },
        { name: "Periodic Properties & Trends", weight: "8–10%", questions: "2 Qs" },
        { name: "Biomolecules & Everyday Chemistry", weight: "4–6%", questions: "1–2 Qs" },
      ],
      description: "Carefully calibrated to mirror NTA's revised syllabus guidelines with complete NCERT line-by-line verification.",
    },
    maths: {
      subject: "Mathematics",
      icon: <Calculator className="w-5 h-5 text-purple-600" />,
      color: "purple",
      totalUnits: "12 Core Units",
      questionDistribution: "25 Questions (20 MCQ + 5 Numerical)",
      highYield: [
        { name: "Differential & Integral Calculus (Limits, Derivatives, Area)", weight: "28–32%", questions: "7–8 Qs" },
        { name: "Coordinate Geometry (Circles, Parabola, Ellipse, Hyperbola)", weight: "16–20%", questions: "4–5 Qs" },
        { name: "Vectors & 3D Geometry", weight: "12–16%", questions: "3–4 Qs" },
        { name: "Algebra (Matrices, Determinants, Quadratics, Sequences)", weight: "16–20%", questions: "4–5 Qs" },
        { name: "Probability & Statistics", weight: "8–10%", questions: "2 Qs" },
        { name: "Permutations, Combinations & Binomial Theorem", weight: "8–10%", questions: "2 Qs" },
      ],
      description: "Constructed to train stamina, calculation speed, and elimination techniques for lengthier JEE mathematics sections.",
    },
  };

  const current = syllabusData[activeSubject];

  return (
    <section id="pattern" className="py-20 sm:py-28 bg-white text-slate-900 border-b border-slate-200/90 scroll-mt-20 relative overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200/90 rounded-full px-3.5 py-1 mb-4">
            <BookOpen className="w-3.5 h-3.5 text-purple-600" />
            <span className="text-purple-800 text-[11px] font-mono font-bold uppercase tracking-wider">
              NTA JEE Main 2027 Pattern &amp; Weightage
            </span>
          </div>

          <h2 className="text-[clamp(2.1rem,4.2vw,3.6rem)] font-extrabold tracking-tight text-slate-900 leading-tight mb-4">
            100% Aligned with Latest NTA Syllabus &amp;{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600">
              Exam Specifications.
            </span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Every question in the 10 free full mock tests has been indexed against official NTA trends to replicate real examination weightage, chapter representation, and difficulty spread.
          </p>
        </div>

        {/* Exam Structure Fast Facts Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
            <div className="text-[10px] font-mono uppercase text-slate-500 font-bold mb-1">Total Questions</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">75 Qs</div>
            <div className="text-[11px] text-slate-500 mt-1">25 Phys · 25 Chem · 25 Math</div>
          </div>

          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
            <div className="text-[10px] font-mono uppercase text-slate-500 font-bold mb-1">Exam Duration</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">180 Mins</div>
            <div className="text-[11px] text-slate-500 mt-1">3 Hours Continuous Shift</div>
          </div>

          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
            <div className="text-[10px] font-mono uppercase text-slate-500 font-bold mb-1">Maximum Score</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">300 M</div>
            <div className="text-[11px] text-slate-500 mt-1">100 Marks per Subject</div>
          </div>

          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
            <div className="text-[10px] font-mono uppercase text-slate-500 font-bold mb-1">Marking Policy</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">+4 / -1</div>
            <div className="text-[11px] text-slate-500 mt-1">Applicable to MCQs &amp; Numericals</div>
          </div>
        </div>

        {/* Interactive Subject Tabs & High-Yield Breakdown */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
          {/* Tab Selector */}
          <div className="flex items-center justify-center gap-2 mb-8 border-b border-slate-100 pb-4">
            {(["physics", "chemistry", "maths"] as const).map((subKey) => {
              const sub = syllabusData[subKey];
              const isActive = activeSubject === subKey;
              return (
                <button
                  key={subKey}
                  onClick={() => setActiveSubject(subKey)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {sub.icon}
                  <span>{sub.subject}</span>
                </button>
              );
            })}
          </div>

          {/* Active Subject High-Yield List */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span>{current.subject} Weightage Breakdown</span>
                  <span className="text-xs font-mono font-normal text-slate-500">
                    ({current.questionDistribution})
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">{current.description}</p>
              </div>

              <Link
                href="/exam"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <span>Practice {current.subject} Chapter Tests</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {current.highYield.map((item, idx) => (
                <div
                  key={item.name}
                  className="bg-slate-50 border border-slate-200/80 hover:border-slate-300 rounded-2xl p-4 transition-all flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-900">
                      {idx + 1}. {item.name}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Expected in JEE: <span className="text-slate-800 font-semibold">{item.questions}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                      {item.weight}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
