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
      coaching: "Limited to 3–5 free, then paywalled",
      advantage: true,
    },
    {
      feature: "Chapter-wise Tests Available",
      studyfam: "300+ Physics, Chem & Maths Tests",
      coaching: "Often restricted to batch packages",
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
      studyfam: "Included with every test instant submit",
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
      coaching: "Mandatory phone verification & sales calls",
      advantage: true,
    },
    {
      feature: "NTA Fee Sponsorship Opportunity",
      studyfam: "Win full JEE fee refund in Scholarship Mock",
      coaching: "No fee refund programs",
      advantage: true,
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-slate-50/70 border-b border-slate-200">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/90 rounded-full px-3.5 py-1 mb-4">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-800 text-[11px] font-mono font-bold uppercase tracking-wider">
              Transparent Value Comparison
            </span>
          </div>

          <h2 className="text-[clamp(1.9rem,3.8vw,3.2rem)] font-extrabold tracking-tight text-slate-900 leading-tight mb-4">
            Why Students Choose StudyFAM Over{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-600">
              Paid Coaching Test Series.
            </span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            High quality JEE Main practice should not be locked behind an expensive paywall. We believe every aspiring engineer in India deserves world-class CBT simulation without financial obstacles.
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
                  <th className="py-4 px-4 sm:px-6 text-indigo-700 bg-indigo-50/50 font-bold font-mono text-[11px] uppercase tracking-wider">
                    StudyFAM Free Tests
                  </th>
                  <th className="py-4 px-4 sm:px-6 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                    Typical Paid Test Series
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 sm:px-6 text-slate-900 font-bold">
                      {row.feature}
                    </td>

                    <td className="py-4 px-4 sm:px-6 bg-indigo-50/30 text-indigo-900 font-semibold">
                      <div className="flex items-center gap-2">
                        <Check size={16} className="text-emerald-600 shrink-0" />
                        <span>{row.studyfam}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-slate-500">
                      <div className="flex items-center gap-2">
                        <X size={15} className="text-red-400 shrink-0" />
                        <span>{row.coaching}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              Ready to test your All-India JEE Main 2027 preparation?
            </div>
            <Link
              href="#free-mocks"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              <span>Start Mock Test 01 (Free)</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
