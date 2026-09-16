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
} from "lucide-react";
import Link from "next/link";

export function SyllabusCoverageSection() {
  const [activeSubject, setActiveSubject] = useState<"physics" | "chemistry" | "maths">("physics");

  const syllabusData = {
    physics: {
      subject: "Physics",
      icon: <Atom className="w-5 h-5 text-blue-600" />,
      color: "blue",
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
        { name: "Periodic Properties & Metallurgy", weight: "8–10%", questions: "2 Qs" },
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
    <section id="pattern" className="py-20 sm:py-28 bg-slate-50/70 border-b border-slate-200 scroll-mt-20">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200/90 rounded-full px-3.5 py-1 mb-4">
            <BookOpen className="w-3.5 h-3.5 text-purple-600" />
            <span className="text-purple-800 text-[11px] font-mono font-bold uppercase tracking-wider">
              NTA JEE Main 2027 Pattern &amp; Weightage
            </span>
          </div>

          <h2 className="text-[clamp(1.9rem,3.8vw,3.2rem)] font-extrabold tracking-tight text-slate-900 leading-tight mb-4">
            100% Aligned with Latest NTA Syllabus &amp;{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Exam Pattern Specifications.
            </span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Every question in the 10 free full mock tests has been indexed against official NTA trends to replicate real examination weightage, chapter representation, and difficulty spread.
          </p>
        </div>

        {/* Exam Structure Fast Facts Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs text-center">
            <div className="text-[10px] font-mono uppercase font-bold text-slate-400 mb-1">Total Marks</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">300 M</div>
            <div className="text-[11px] text-slate-500 mt-0.5">100 marks per subject</div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs text-center">
            <div className="text-[10px] font-mono uppercase font-bold text-slate-400 mb-1">Duration</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 font-mono">180 Mins</div>
            <div className="text-[11px] text-slate-500 mt-0.5">3 hours continuous CBT</div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs text-center">
            <div className="text-[10px] font-mono uppercase font-bold text-slate-400 mb-1">Total Questions</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">75 Qs</div>
            <div className="text-[11px] text-slate-500 mt-0.5">60 MCQs + 15 Numericals</div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs text-center">
            <div className="text-[10px] font-mono uppercase font-bold text-slate-400 mb-1">Marking Scheme</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 font-mono">+4 / -1</div>
            <div className="text-[11px] text-slate-500 mt-0.5">-1 negative for both Sec A &amp; B</div>
          </div>
        </div>

        {/* Subject Tab Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-slate-200/80 p-1.5 rounded-2xl gap-1">
            {(["physics", "chemistry", "maths"] as const).map((sub) => (
              <button
                key={sub}
                onClick={() => setActiveSubject(sub)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all capitalize flex items-center gap-2 ${
                  activeSubject === sub
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {sub === "physics" && <Atom size={14} className="text-blue-600" />}
                {sub === "chemistry" && <FlaskConical size={14} className="text-emerald-600" />}
                {sub === "maths" && <Calculator size={14} className="text-purple-600" />}
                <span>{sub} Weightage</span>
              </button>
            ))}
          </div>
        </div>

        {/* Subject Breakdown Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center">
                {current.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{current.subject} Unit Breakdown</h3>
                <p className="text-xs text-slate-500">{current.totalUnits} · {current.questionDistribution}</p>
              </div>
            </div>

            <Link
              href="#free-mocks"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl transition-colors"
            >
              <span>Practice in 10 Full Mocks</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* High-Yield Units Table */}
          <div className="space-y-2.5 mb-6">
            {current.highYield.map((item, i) => (
              <div
                key={item.name}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-colors text-xs gap-2"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                    {i + 1}
                  </span>
                  <span className="font-bold text-slate-800">{item.name}</span>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <span className="text-slate-500 font-mono text-[11px]">{item.questions}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-200/80 font-mono font-bold text-slate-800 text-[11px]">
                    {item.weight}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 leading-relaxed">
            <strong>StudyFAM Preparation Tip:</strong> {current.description}
          </div>
        </div>

      </div>
    </section>
  );
}
