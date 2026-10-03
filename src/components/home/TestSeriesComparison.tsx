"use client";

import React from "react";
import { Check, X, Sparkles, Shield, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";

export function TestSeriesComparison() {
  const comparisonRows = [
    {
      feature: "Cost / Access Fee",
      studyfam: "100% Free Forever (₹0)",
      coaching: "₹4,000 – ₹15,000 / year",
      advantage: true,
    },
    {
      feature: "Full-Length Mocks Included",
      studyfam: "10 Full NTA Pattern Mocks (MFT 1–10)",
      coaching: "Limited to 2–3 free, then paywalled",
      advantage: true,
    },
    {
      feature: "Chapter-wise Diagnostic Tests",
      studyfam: "400+ Chapter Tests (9,395+ Qs)",
      coaching: "Often restricted to expensive batch packages",
      advantage: true,
    },
    {
      feature: "TCS iON CBT Interface Simulation",
      studyfam: "100% Authentic NTA Palette & Timer",
      coaching: "Generic web quiz or mobile-only UI",
      advantage: true,
    },
    {
      feature: "Detailed Step-by-Step Solutions",
      studyfam: "Included with every test on instant submit",
      coaching: "Often delayed by 24–48 hours",
      advantage: true,
    },
    {
      feature: "All-India Percentile & Rank Predictor",
      studyfam: "Instant comparative analytics",
      coaching: "Batch-only ranking",
      advantage: true,
    },
    {
      feature: "Sign-up / Credit Card Friction",
      studyfam: "Zero card / Immediate test launch",
      coaching: "Mandatory phone verification & telemarketing",
      advantage: true,
    },
    {
      feature: "NTA Exam Fee Sponsorship Opportunity",
      studyfam: "Win full JEE fee refund in 27 Dec Mock",
      coaching: "No fee refund programs",
      advantage: true,
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#F8FAFC] text-slate-900 border-b border-slate-200/90 relative overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/90 rounded-full px-3.5 py-1 mb-4">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-800 text-[11px] font-mono font-bold uppercase tracking-wider">
              Transparent Value Comparison
            </span>
          </div>

          <h2 className="text-[clamp(2.1rem,4.2vw,3.6rem)] font-extrabold tracking-tight text-slate-900 leading-tight mb-4">
            Why Aspirants Choose StudyFAM Over{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-600">
              Paid Coaching Test Series.
            </span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            High quality JEE Main practice should never be locked behind an expensive paywall. We believe every aspiring engineer in India deserves world-class CBT simulation without financial obstacles.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs max-w-4xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="py-4 px-4 sm:px-6 text-slate-500 font-mono text-[11px] uppercase tracking-wider">
                    Feature / Capability
                  </th>
                  <th className="py-4 px-4 sm:px-6 text-indigo-700 bg-indigo-50/60 font-bold font-mono text-[11px] uppercase tracking-wider border-x border-indigo-200/60">
                    StudyFAM Free Tests
                  </th>
                  <th className="py-4 px-4 sm:px-6 text-slate-500 font-mono text-[11px] uppercase tracking-wider">
                    Typical Paid Test Series
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-medium text-slate-800">
                      {row.feature}
                    </td>
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900 bg-indigo-50/20 border-x border-indigo-100">
                      <div className="flex items-center gap-2">
                        <Check size={16} className="text-emerald-600 shrink-0" />
                        <span>{row.studyfam}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-slate-500">
                      <div className="flex items-center gap-2">
                        <X size={15} className="text-rose-500 shrink-0" />
                        <span>{row.coaching}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Table Bar */}
          <div className="p-4 sm:p-6 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600 text-center sm:text-left font-medium">
              Ready to benchmark your score with zero financial obligation?
            </div>
            <a
              href="#free-mocks"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs shadow-xs hover:shadow transition-all active:scale-95"
            >
              <span>Launch Mock Test 01</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
