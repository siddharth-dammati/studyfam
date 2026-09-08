"use client";

import { impactConfig, formatIndianNumber, formatIndianCurrency } from "@/lib/impactConfig";
import { useEffect, useState } from "react";
import { TrendingUp, Trophy, Award, Users } from "lucide-react";

export function ImpactProgress() {
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(impactConfig.registrations);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => {
      if (Math.random() > 0.6) setCount(c => c + Math.ceil(Math.random() * 2));
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const pool = count * impactConfig.supportPerRegistration;
  const avg = (impactConfig.supportAmountBoys + impactConfig.supportAmountGirls) / 2;
  const topN = Math.floor(pool / avg);
  const remaining = Math.max(0, impactConfig.milestone - count);
  const nextMilestoneTopN = impactConfig.calculateTopN(impactConfig.milestone);
  const pct = Math.min((count / impactConfig.milestone) * 100, 100);

  if (!mounted) return null;

  return (
    <section id="impact" className="py-20 sm:py-24 bg-slate-50/70 border-y border-slate-200">
      <div className="max-w-[1140px] mx-auto px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-3.5 py-1 mb-4">
            <Trophy className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-800 text-[11px] font-mono font-bold uppercase tracking-wider">
              Live Merit Scholarship Pool
            </span>
          </div>

          <h2 className="text-[clamp(1.9rem,3.8vw,3.2rem)] font-bold tracking-tight text-slate-900 leading-tight mb-3">
            More Students Join.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-600">
              More Top Rankers Win.
            </span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            ₹18 from every ₹27 registration goes straight into the Scholarship Pool. As more aspirants participate, the number of students who win 100% of their official JEE Main exam fees scales up!
          </p>
        </div>

        {/* 3 Clear Metric Cards (Input -> Pool -> Prize) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          
          {/* Card 1: Registrations */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono uppercase font-semibold text-slate-500 tracking-wider">
                1. Students Registered
              </span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight tabular-nums mb-1">
                {formatIndianNumber(count)}
              </div>
              <p className="text-xs text-slate-500">Aspirants joined nationwide</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-600">
              <span>Fee per mock</span>
              <strong className="text-slate-800 font-bold">₹27</strong>
            </div>
          </div>

          {/* Card 2: Scholarship Pool */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono uppercase font-semibold text-indigo-700 tracking-wider">
                2. Scholarship Pool
              </span>
              <Award className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-indigo-600 tracking-tight tabular-nums mb-1">
                {formatIndianCurrency(pool)}
              </div>
              <p className="text-xs text-indigo-900/70">₹18 per student deposited live</p>
            </div>
            <div className="mt-4 pt-3 border-t border-indigo-100/80 flex items-center justify-between text-[11px] font-mono text-indigo-700">
              <span>Pool allocation</span>
              <strong className="font-bold">66.7% of fee</strong>
            </div>
          </div>

          {/* Card 3: Top N Winners */}
          <div className="bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono uppercase font-bold text-emerald-800 tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                3. Funded Rankers Today
              </span>
              <Trophy className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-emerald-700 tracking-tight tabular-nums mb-1">
                Top {formatIndianNumber(topN)}
              </div>
              <p className="text-xs text-emerald-900 font-medium">Win 100% JEE Main Exam Fees</p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-200 flex items-center justify-between text-[11px] font-mono text-emerald-800">
              <span>Reimbursement</span>
              <strong className="font-bold">₹1,000 Boys · ₹800 Girls</strong>
            </div>
          </div>

        </div>

        {/* The 1,000 Rule (Simple, Visual, Concrete Example) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-base">💡</span>
              <h3 className="text-sm font-bold text-slate-900">
                Simple Example: For Every 1,000 Students Who Register
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Pool created = 1,000 × ₹18 = <strong className="text-slate-900 font-bold">₹18,000</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold shrink-0">
                👨
              </span>
              <div className="text-xs">
                <div className="text-slate-500 font-medium">Top 10 Boys</div>
                <div className="font-bold text-slate-900">₹1,000 each <span className="font-mono text-[11px] text-slate-500 font-normal">(= ₹10,000)</span></div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center text-sm font-bold shrink-0">
                👩
              </span>
              <div className="text-xs">
                <div className="text-slate-500 font-medium">Top 10 Girls</div>
                <div className="font-bold text-slate-900">₹800 each <span className="font-mono text-[11px] text-slate-500 font-normal">(= ₹8,000)</span></div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                🏆
              </span>
              <div className="text-xs">
                <div className="text-emerald-900 font-bold">Top 20 Winners</div>
                <div className="font-bold text-emerald-700">100% Exam Fee Funded</div>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-medium text-slate-600 mb-3 gap-2">
            <div>
              Next Goal: <strong className="text-slate-900 font-bold">{formatIndianNumber(impactConfig.milestone)} registrations</strong>
              <span className="text-emerald-700 font-semibold ml-1.5">(Expands to Top {nextMilestoneTopN} Winners)</span>
            </div>
            <span className="text-indigo-600 font-mono font-semibold">
              {formatIndianNumber(remaining)} registrations left
            </span>
          </div>

          <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${pct}%`, background: "linear-gradient(90deg, #6366F1, #10B981)" }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0</span>
            <span className="text-slate-700 font-semibold">{formatIndianNumber(count)} today (Top {topN} Funded)</span>
            <span>Target: {formatIndianNumber(impactConfig.milestone)} (Top {nextMilestoneTopN})</span>
          </div>
        </div>

      </div>
    </section>
  );
}
