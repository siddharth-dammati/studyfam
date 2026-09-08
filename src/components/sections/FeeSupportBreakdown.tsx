"use client";

import { formatIndianCurrency, formatIndianNumber, getActiveMilestone } from "@/lib/impactConfig";
import { useState } from "react";
import Link from "next/link";
import { CheckIcon, Trophy, Award, Users, Sparkles, MessageCircle, Send } from "lucide-react";
import { useImpactStats } from "@/hooks/useImpactStats";

const milestones = [
  { students: 1000, meritBoys: 5, meritGirls: 5, needBoys: 5, needGirls: 5, meritCount: 10, needCount: 10, topN: 20 },
  { students: 5000, meritBoys: 25, meritGirls: 25, needBoys: 25, needGirls: 25, meritCount: 50, needCount: 50, topN: 100 },
  { students: 10000, meritBoys: 50, meritGirls: 50, needBoys: 50, needGirls: 50, meritCount: 100, needCount: 100, topN: 200 },
  { students: 25000, meritBoys: 125, meritGirls: 125, needBoys: 125, needGirls: 125, meritCount: 250, needCount: 250, topN: 500 },
  { students: 50000, meritBoys: 250, meritGirls: 250, needBoys: 250, needGirls: 250, meritCount: 500, needCount: 500, topN: 1000 },
];

const RATE = 18;
const shareText = "Take the StudyFam All-India JEE Main Mock on 27 Dec 2026 (9 AM – 12 PM) for ₹27! Top performers win 100% of their official NTA JEE Main application fees refunded (₹1,000 Boys / ₹800 Girls). 50% of slots are Merit Scholarships (100% rank) and 50% are reserved for Need-Based Support: https://studyfam.in";

export function FeeSupportBreakdown() {
  const { total_registrations = 0 } = useImpactStats();
  const activeMilestone = getActiveMilestone(total_registrations);
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(shareText); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const wa = () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
  const tg = () => window.open(`https://t.me/share/url?url=https%3A%2F%2Fstudyfam.in&text=${encodeURIComponent(shareText)}`, "_blank");

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
                  50% Merit · 50% Need-Based Model
                </span>
              </div>
              
              <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-tight text-[var(--text-primary)] leading-tight mb-6">
                Win Your JEE Exam Fees.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-indigo-600 to-rose-600">
                  Merit & Need-Based Funding.
                </span>
              </h2>

              <p className="text-[var(--text-secondary)] leading-relaxed mb-8 text-[15px]">
                We believe financial constraints should never stand between an aspirant and IIT dreams. ₹18 of every ₹27 registration deposits directly into the Scholarship Pool. We reserve <strong>50% of all scholarship slots for students who genuinely need assistance</strong>, alongside <strong>50% pure merit scholarships</strong> awarded purely on mock test rank.
              </p>

              {/* Concrete Dual Track Box */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-indigo-50/50 border border-emerald-200 shadow-xs mb-8 space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-emerald-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                      Dynamic Dual-Track Allocation (Scales With Registrations)
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    50% Merit · 50% Need-Based
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Track 1: Merit */}
                  <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-xs">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-mono text-[11px] font-bold uppercase mb-1">
                      <span>🏆</span> Merit Track (50% of Pool)
                    </div>
                    <div className="text-sm font-bold text-slate-900 mb-1">
                      100% Mock AIR Rank Based
                    </div>
                    <div className="text-[11px] text-emerald-800 font-semibold mb-1.5">
                      If 50,000 registrations: Top 250 Boys + Top 250 Girls
                    </div>
                    <ul className="text-[11px] text-slate-600 space-y-1">
                      <li>• <strong>Pure Merit:</strong> No financial checks, open to all</li>
                      <li>• <strong>50:50 Gender Parity:</strong> Equal slots for boys & girls</li>
                      <li>• <strong>Full Reimbursement:</strong> ₹1,000 (Boys) · ₹800 (Girls)</li>
                    </ul>
                  </div>

                  {/* Track 2: Need-Based */}
                  <div className="p-4 rounded-xl bg-white border border-rose-200 shadow-xs">
                    <div className="flex items-center gap-1.5 text-rose-700 font-mono text-[11px] font-bold uppercase mb-1">
                      <span>❤️</span> Need-Based Support (50% of Pool)
                    </div>
                    <div className="text-sm font-bold text-slate-900 mb-1">
                      50% Reserved for Financial Aid
                    </div>
                    <div className="text-[11px] text-rose-800 font-semibold mb-1.5">
                      If 50,000 registrations: Next 250 Boys + Next 250 Girls
                    </div>
                    <ul className="text-[11px] text-slate-600 space-y-1">
                      <li>• <strong>Eligibility:</strong> Family income ≤ ₹8 Lakh / year</li>
                      <li>• <strong>50:50 Gender Parity:</strong> Equal slots for boys & girls</li>
                      <li>• <strong>Full Reimbursement:</strong> ₹1,000 (Boys) · ₹800 (Girls)</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-emerald-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                  <span className="font-mono text-slate-700 font-medium">
                    Scaling: <strong className="text-slate-900">20 funded at 1,000 registrations → 1,000 funded if 50,000 reached</strong>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold font-mono text-[11px]">
                    ₹18 Escrowed / Student
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { 
                    emoji: "🏆", 
                    t: "50% Pure Merit Track", 
                    d: "Selected 100% on All-India mock rank. Top boys and top girls receive full fee reimbursement without financial scrutiny." 
                  },
                  { 
                    emoji: "❤️", 
                    t: "50% Reserved Need-Based Track", 
                    d: "50% of all slots are strictly ring-fenced for candidates with verified financial need from a separate eligible pool." 
                  },
                  { 
                    emoji: "🤝", 
                    t: "Voluntary Roll-over", 
                    d: "If any ranker generously opts out, the scholarship instantly passes to the next eligible candidate in that track." 
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
                <div className="text-[var(--text-muted)] text-sm">Powers the National Mock & Merit + Need Pool</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-600 rounded-3xl p-7 text-center text-white shadow-sm">
                  <div className="text-4xl font-bold mb-1.5">₹18</div>
                  <div className="text-emerald-100 text-[10px] font-mono uppercase tracking-wider mb-3">Scholarship Pool</div>
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
                  <h5 className="text-sm font-bold text-emerald-900 mb-0.5">50% Reserved for Genuine Financial Need</h5>
                  <p className="text-xs text-emerald-700 leading-relaxed font-medium">
                    Every student who joins strengthens a national community model that rewards academic excellence while guaranteeing that half of all scholarship spots assist candidates who genuinely need help.
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
                More Registrations = More Scholarships
              </span>
              <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-tight text-[var(--text-primary)] leading-tight mb-6">
                The more we participate,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-600">
                  the more students win.
                </span>
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-8 text-[15px]">
                Share with your coaching peers and study groups. Every registration adds ₹18 to the pool, expanding both the <strong>Merit Track</strong> and the <strong>Need-Based Track</strong> so more deserving aspirants get their official NTA fees reimbursed!
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

              <div className="flex flex-wrap gap-2.5">
                <button onClick={wa} className="inline-flex items-center gap-2 h-10 px-4 bg-[#25D366] text-white text-xs font-bold rounded-[12px] border border-[#1FAD55] shadow-[0_1px_4px_rgba(37,211,102,0.3)] hover:-translate-y-[1px] transition-all">
                  <MessageCircle size={15} />
                  <span>Share on WhatsApp</span>
                </button>
                <button onClick={tg} className="inline-flex items-center gap-2 h-10 px-4 bg-[#229ED9] text-white text-xs font-bold rounded-[12px] border border-[#1d8bc0] shadow-[0_1px_4px_rgba(34,158,217,0.3)] hover:-translate-y-[1px] transition-all">
                  <Send size={15} />
                  <span>Share on Telegram</span>
                </button>
                <button onClick={copy} className="inline-flex items-center gap-2 h-10 px-4 bg-white text-[var(--text-primary)] text-xs font-semibold rounded-[12px] border border-[var(--border-strong)] shadow-[var(--shadow-xs)] hover:border-[var(--indigo-400)] transition-all">
                  {copied ? <><CheckIcon size={14} className="text-emerald-600" />Copied Link & Text</> : "Copy Share Link"}
                </button>
              </div>
            </div>

            {/* Right: milestones table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[var(--text-muted)] text-[10px] font-mono uppercase tracking-widest">
                  Dual-Track Milestones (50% Merit / 50% Need-Based)
                </span>
                <span className="text-emerald-700 text-xs font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  ₹18 / Student
                </span>
              </div>
              
              <div className="bg-white border border-[var(--border)] rounded-2xl overflow-hidden shadow-[var(--shadow-xs)]">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--surface-1)] text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                      <th className="text-left px-3 sm:px-4 py-3.5">Registrations</th>
                      <th className="text-left px-3 sm:px-4 py-3.5">Pool</th>
                      <th className="text-left px-3 sm:px-4 py-3.5">🏆 Merit Track</th>
                      <th className="text-left px-3 sm:px-4 py-3.5">❤️ Need Track</th>
                      <th className="text-right px-3 sm:px-4 py-3.5 text-emerald-800 font-bold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {milestones.map((m) => {
                      const pool = m.students * RATE;
                      const isActive = m.students === activeMilestone.students;
                      return (
                        <tr key={m.students} className={`hover:bg-[var(--surface-1)] transition-colors ${isActive ? "bg-emerald-50/70 font-semibold" : ""}`}>
                          <td className="px-3 sm:px-4 py-3.5 font-semibold text-[var(--text-primary)]">
                            <div className="flex items-center gap-1.5">
                              <span>{m.students.toLocaleString("en-IN")}</span>
                              {isActive && (
                                <span className="text-[8px] font-mono font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                  Goal
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 py-3.5 font-bold text-[var(--text-primary)]">
                            {formatIndianCurrency(pool)}
                          </td>
                          <td className="px-3 sm:px-4 py-3.5 text-slate-700 font-mono text-[11px]">
                            {m.meritCount} ({m.meritBoys}B + {m.meritGirls}G)
                          </td>
                          <td className="px-3 sm:px-4 py-3.5 text-rose-700 font-mono text-[11px]">
                            {m.needCount} ({m.needBoys}B + {m.needGirls}G)
                          </td>
                          <td className="px-3 sm:px-4 py-3.5 text-right">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${isActive ? "bg-emerald-600 text-white shadow-xs" : "bg-emerald-100 text-emerald-800"}`}>
                              {m.topN} Winners
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
