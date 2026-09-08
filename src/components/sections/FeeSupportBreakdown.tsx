"use client";

import { formatIndianCurrency, formatIndianNumber } from "@/lib/impactConfig";
import { useState } from "react";
import Link from "next/link";
import { CheckIcon, Trophy, Award, Users, Sparkles } from "lucide-react";

const milestones = [
  { students: 1000, boysCount: 10, girlsCount: 10, boysAmount: 10000, girlsAmount: 8000, topN: 20 },
  { students: 5000, boysCount: 50, girlsCount: 50, boysAmount: 50000, girlsAmount: 40000, topN: 100 },
  { students: 10000, boysCount: 100, girlsCount: 100, boysAmount: 100000, girlsAmount: 80000, topN: 200 },
  { students: 25000, boysCount: 250, girlsCount: 250, boysAmount: 250000, girlsAmount: 200000, topN: 500 },
  { students: 50000, boysCount: 500, girlsCount: 500, boysAmount: 500000, girlsAmount: 400000, topN: 1000 },
];

const RATE = 18;
const shareText = "I'm taking the StudyFam National Mock 2027 on 27 December. ₹27 entry, national ranking, AI percentile analysis, and Top N performers win their full JEE exam fees (e.g. 1000 registrations = Top 10 Boys + Top 10 Girls). Join me.";

export function FeeSupportBreakdown() {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(shareText); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const wa = () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");

  return (
    <section className="bg-white border-t border-[var(--border)]">

      {/* === Fee Breakdown & Win Your Fees === */}
      <div className="py-28">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-3.5 py-1.5 mb-6">
                <Trophy className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-800 text-[10px] font-mono font-bold uppercase tracking-widest">
                  Merit Scholarship Model
                </span>
              </div>
              
              <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-tight text-[var(--text-primary)] leading-tight mb-6">
                Win Your JEE Exam Fees.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-600">
                  Earn Your Full Refund.
                </span>
              </h2>

              <p className="text-[var(--text-secondary)] leading-relaxed mb-8 text-[15px]">
                We believe financial barriers shouldn&apos;t hold back serious aspirants. ₹18 of every ₹27 registration goes straight into the JEE Exam Fee Scholarship Pool. The top N performers on the All-India Mock leaderboard receive 100% of their official NTA JEE Main application fee reimbursed!
              </p>

              {/* Specific Concrete Example Box: 1,000 Registrations */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-indigo-50/50 border border-emerald-200 shadow-sm mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider">
                    Transparent Math: If 1,000 Students Register
                  </h4>
                </div>
                
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Total pool created = 1,000 registrations × ₹18 = <strong className="text-slate-900 font-mono">₹18,000</strong>. This funds the official NTA JEE application fee (₹1,000 for boys / ₹800 for girls) with equal gender opportunity:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs">
                    <div className="text-slate-500 font-mono text-[10px] uppercase font-semibold">Boys Scholarship</div>
                    <div className="text-base font-bold text-slate-900 mt-0.5">Top 10 Boys</div>
                    <div className="text-emerald-700 font-mono font-medium text-xs mt-1">
                      10 × ₹1,000 = <span className="font-bold">₹10,000</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs">
                    <div className="text-slate-500 font-mono text-[10px] uppercase font-semibold">Girls Scholarship</div>
                    <div className="text-base font-bold text-slate-900 mt-0.5">Top 10 Girls</div>
                    <div className="text-emerald-700 font-mono font-medium text-xs mt-1">
                      10 × ₹800 = <span className="font-bold">₹8,000</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-emerald-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                  <span className="font-mono text-slate-700 font-semibold">
                    ₹10,000 (Boys) + ₹8,000 (Girls) = <span className="text-emerald-800 font-bold">₹18,000 Total</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold font-mono text-[11px]">
                    = Top 20 Students Funded!
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { 
                    emoji: "🏆", 
                    t: "Strict Merit Leaderboard", 
                    d: "Scholarships are awarded strictly in leaderboard rank order for eligible boys and girls." 
                  },
                  { 
                    emoji: "🤝", 
                    t: "Voluntary Roll-over", 
                    d: "If an eligible ranker declines the grant, it immediately rolls down to the next candidate." 
                  },
                ].map(item => (
                  <div key={item.t} className="flex gap-3.5 p-4 bg-[var(--surface-1)] rounded-xl border border-[var(--border)]">
                    <span className="text-lg shrink-0">{item.emoji}</span>
                    <div>
                      <h4 className="text-xs font-bold text-[var(--text-primary)] mb-0.5">{item.t}</h4>
                      <p className="text-[var(--text-secondary)] text-xs leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold">
                <Link href="/scholarship-rules" className="text-emerald-700 hover:text-emerald-800 transition-colors inline-flex items-center gap-1">
                  View Official Scholarship Rules (SF-SCH-2027) →
                </Link>
                <span className="text-slate-300">·</span>
                <Link href="/transparency" className="text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-1">
                  Financial Transparency Report →
                </Link>
              </div>
            </div>

            {/* Right: visual split */}
            <div className="flex flex-col gap-4">
              <div className="bg-[var(--surface-1)] border border-[var(--border)] rounded-3xl p-8 text-center">
                <div className="text-[var(--text-muted)] text-[10px] font-mono uppercase tracking-widest mb-3">Your ₹27 Registration Split</div>
                <div className="text-7xl font-bold text-[var(--text-primary)] tracking-tighter mb-1">₹27</div>
                <div className="text-[var(--text-muted)] text-sm">Powers the National Mock & Merit Pool</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-600 rounded-3xl p-7 text-center text-white shadow-sm">
                  <div className="text-4xl font-bold mb-1.5">₹18</div>
                  <div className="text-emerald-100 text-[10px] font-mono uppercase tracking-wider mb-3">JEE Scholarship Pool</div>
                  <div className="h-1.5 bg-emerald-800 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: "66.7%" }} />
                  </div>
                  <div className="text-emerald-200 text-[10px] font-mono mt-1.5">66.7% directly funds students</div>
                </div>
                
                <div className="bg-[var(--surface-1)] rounded-3xl p-7 text-center border border-[var(--border)]">
                  <div className="text-4xl font-bold text-[var(--text-primary)] mb-1.5">₹9</div>
                  <div className="text-[var(--text-muted)] text-[10px] font-mono uppercase tracking-wider mb-3">Platform & Operations</div>
                  <div className="h-1.5 bg-[var(--surface-3)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--text-muted)] rounded-full opacity-60" style={{ width: "33.3%" }} />
                  </div>
                  <div className="text-[var(--text-muted)] text-[10px] font-mono mt-1.5">33.3% StudyFam Platform</div>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-4">
                <Award className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-bold text-emerald-900 mb-0.5">Community-Funded Scholarships</h5>
                  <p className="text-xs text-emerald-700 leading-relaxed font-medium">
                    Every student who enters not only tests their own preparation against India&apos;s best, but also directly expands the number of peers who win their JEE exam fees!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === Impact Projections: Dynamic Top N Table with Boys & Girls Breakdown === */}
      <div className="bg-[var(--surface-1)] border-t border-[var(--border)] py-28">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Left: share */}
            <div>
              <span className="text-[var(--indigo-600)] text-[10px] font-mono uppercase tracking-widest mb-5 block">
                More Registrations = Higher Top N Cutoff
              </span>
              <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-tight text-[var(--text-primary)] leading-tight mb-6">
                The more we participate,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-600">
                  the more top students win.
                </span>
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-8 text-[15px]">
                Share with your coaching peers and study groups. Every registration adds ₹18 to the pool, expanding the scholarship cutoff so more top rankers get their official NTA fees reimbursed!
              </p>

              {/* Chain */}
              <div className="flex flex-wrap items-center gap-2.5 mb-10">
                {["1,000", "5,000", "10,000", "25,000", "50,000"].map((n, i, arr) => (
                  <div key={n} className="flex items-center gap-2.5">
                    <span className="bg-white border border-[var(--border-strong)] text-[var(--text-primary)] font-bold text-xs rounded-xl px-3 py-2 shadow-[var(--shadow-xs)]">{n}</span>
                    {i < arr.length - 1 && <span className="text-[var(--text-muted)] text-xs">→</span>}
                  </div>
                ))}
                <span className="text-[var(--text-muted)] text-xs">→</span>
                <span className="bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs rounded-xl px-3 py-2">
                  Top 1,000 Win Fees!
                </span>
              </div>

              <div className="flex gap-3">
                <button onClick={wa} className="inline-flex items-center gap-2 h-10 px-5 bg-[#25D366] text-white text-sm font-semibold rounded-[12px] border border-[#1FAD55] shadow-[0_1px_4px_rgba(37,211,102,0.3)] hover:-translate-y-[1px] transition-all">
                  Share on WhatsApp
                </button>
                <button onClick={copy} className="inline-flex items-center gap-2 h-10 px-5 bg-white text-[var(--text-primary)] text-sm font-semibold rounded-[12px] border border-[var(--border-strong)] shadow-[var(--shadow-xs)] hover:border-[var(--indigo-400)] transition-all">
                  {copied ? <><CheckIcon size={14} className="text-emerald-600" />Copied Link</> : "Copy Share Link"}
                </button>
              </div>
            </div>

            {/* Right: milestones table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[var(--text-muted)] text-[10px] font-mono uppercase tracking-widest">
                  Milestone Projections (Boys ₹1,000 · Girls ₹800)
                </span>
                <span className="text-emerald-700 text-xs font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  ₹18 / Student
                </span>
              </div>
              
              <div className="bg-white border border-[var(--border)] rounded-2xl overflow-hidden shadow-[var(--shadow-xs)]">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--surface-1)] text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                      <th className="text-left px-4 py-3.5">Registrations</th>
                      <th className="text-left px-4 py-3.5">Pool</th>
                      <th className="text-left px-4 py-3.5">Boys + Girls Breakdown</th>
                      <th className="text-right px-4 py-3.5 text-emerald-800 font-bold">Total Winners</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {milestones.map((m) => {
                      const pool = m.students * RATE;
                      const isActive = m.students === 10000;
                      return (
                        <tr key={m.students} className={`hover:bg-[var(--surface-1)] transition-colors ${isActive ? "bg-emerald-50/50" : ""}`}>
                          <td className="px-4 py-3.5 font-semibold text-[var(--text-primary)]">
                            {m.students.toLocaleString("en-IN")}
                          </td>
                          <td className="px-4 py-3.5 font-bold text-[var(--text-primary)]">
                            {formatIndianCurrency(pool)}
                          </td>
                          <td className="px-4 py-3.5 text-slate-600 font-mono text-xs">
                            Top {m.boysCount} Boys (₹{(m.boysAmount/1000).toFixed(0)}k) + Top {m.girlsCount} Girls (₹{(m.girlsAmount/1000).toFixed(0)}k)
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                              🏆 Top {m.topN}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Social preview message */}
              <div className="bg-white border border-[var(--border)] rounded-2xl p-4 mt-4 shadow-[var(--shadow-xs)]">
                <p className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider mb-1.5">Share Template</p>
                <p className="text-[var(--text-secondary)] text-xs leading-relaxed italic">&quot;{shareText}&quot;</p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}
