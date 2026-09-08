"use client";

import {
  formatIndianNumber,
  formatIndianCurrency,
  MILESTONE_TIERS,
  MilestoneTier,
  getActiveMilestone,
  getMilestoneProgress,
} from "@/lib/impactConfig";
import { useEffect, useState } from "react";
import {
  Trophy,
  Award,
  Users,
  Target,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Share2,
  Check,
  Send,
} from "lucide-react";
import { useImpactStats } from "@/hooks/useImpactStats";

export function ImpactProgress() {
  const [mounted, setMounted] = useState(false);
  const {
    total_registrations: count = 0,
    support_pool: pool = 0,
    funded_students: topN = 0,
  } = useImpactStats();

  const activeMilestone = getActiveMilestone(count);
  const milestoneInfo = getMilestoneProgress(count);
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneTier>(activeMilestone);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSelectedMilestone(getActiveMilestone(count));
  }, [count]);

  if (!mounted) return null;

  const isCurrentActive = selectedMilestone.students === activeMilestone.students;
  const isUnlocked = count >= selectedMilestone.students;

  const handleShare = () => {
    const text = `Take the StudyFam All-India JEE Main Mock on 27 Dec 2026 (9 AM – 12 PM) for ₹27! Rank on top of the list to win 100% of your official NTA JEE Main application fees paid back (₹1,000 for Boys / ₹800 for Girls). Target: Top ${selectedMilestone.topN} rankers win full fee sponsorship! Join here: https://studyfam.in`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleTelegram = () => {
    const text = `Take the StudyFam All-India JEE Main Mock on 27 Dec 2026 (9 AM – 12 PM) for ₹27! Rank on top of the list to win 100% of your official NTA JEE Main application fees paid back (₹1,000 for Boys / ₹800 for Girls). Target: Top ${selectedMilestone.topN} rankers win full fee sponsorship!`;
    window.open(`https://t.me/share/url?url=https%3A%2F%2Fstudyfam.in&text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleCopyLink = () => {
    const text = `Take the StudyFam All-India JEE Main Mock on 27 Dec 2026 (9 AM – 12 PM) for ₹27! Rank on top of the list to win 100% of your official NTA JEE Main application fees paid back (₹1,000 for Boys / ₹800 for Girls). Join here: https://studyfam.in`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

        {/* Live Active Target Progress Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-medium text-slate-600 mb-3 gap-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                Active Target: <strong className="text-slate-900 font-bold">{formatIndianNumber(activeMilestone.students)} registrations</strong>
              </span>
              <span className="text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px]">
                Funds Top {activeMilestone.topN} Winners
              </span>
            </div>
            <span className="text-indigo-600 font-mono font-semibold">
              {formatIndianNumber(milestoneInfo.remaining)} registrations left
            </span>
          </div>

          <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-2 relative">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min(100, Math.max(0, milestoneInfo.overallProgress))}%`,
                background: "linear-gradient(90deg, #6366F1, #10B981)",
              }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0</span>
            <span className="text-slate-700 font-semibold">
              {formatIndianNumber(count)} today ({milestoneInfo.overallProgress.toFixed(1)}% toward Target {formatIndianNumber(activeMilestone.students)})
            </span>
            <span>Target: {formatIndianNumber(activeMilestone.students)} Aspirants</span>
          </div>
        </div>

        {/* Milestone Progression Ladder & Benefits Explorer */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Scholarship Milestone Roadmap & Benefits
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                First targeting 1,000 students, then unlocking 5,000, 10,000, and scaling up to 1,00,000. Click any tier to inspect its exact benefits.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                <Share2 size={13} />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={handleTelegram}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#229ED9] hover:bg-[#1d8bc0] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                <Send size={13} />
                <span>Telegram</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                {copied ? <Check size={13} className="text-emerald-600" /> : null}
                <span>{copied ? "Copied" : "Copy Link & Text"}</span>
              </button>
            </div>
          </div>

          {/* Milestone Tier Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6">
            {MILESTONE_TIERS.map((tier) => {
              const isSelected = selectedMilestone.students === tier.students;
              const isTierActive = activeMilestone.students === tier.students;
              const isTierUnlocked = count >= tier.students;

              return (
                <button
                  key={tier.students}
                  onClick={() => setSelectedMilestone(tier)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border shrink-0 ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs scale-[1.02]"
                      : isTierActive
                      ? "bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100"
                      : isTierUnlocked
                      ? "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span>{formatIndianNumber(tier.students)} Students</span>
                  {isTierActive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                  {isTierUnlocked && !isTierActive && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Milestone Benefits Showcase */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-6 transition-all">
            
            {/* Header of Selected Tier */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎯</span>
                  <h4 className="text-lg font-bold text-slate-900">
                    {selectedMilestone.title}
                  </h4>
                  {isCurrentActive && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500 text-white tracking-wider animate-pulse">
                      Current Target
                    </span>
                  )}
                  {isUnlocked && !isCurrentActive && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-slate-900 text-white tracking-wider">
                      Unlocked & Achieved ✓
                    </span>
                  )}
                  {!isUnlocked && !isCurrentActive && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-slate-200 text-slate-600 tracking-wider">
                      Upcoming Target
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                  {selectedMilestone.tagline}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Guaranteed Pool</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-700">
                  {formatIndianCurrency(selectedMilestone.pool)}
                </div>
              </div>
            </div>

            {/* Key 3 Metric Cards for this Tier */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              
              {/* Boys Reimbursement */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/90 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-lg shrink-0">
                  👨
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500">Top {selectedMilestone.boysCount} Boys</div>
                  <div className="font-bold text-slate-900 text-sm">
                    ₹1,000 each <span className="text-xs font-mono text-slate-400 font-normal">(= {formatIndianCurrency(selectedMilestone.boysAmount)})</span>
                  </div>
                  <div className="text-[10px] text-indigo-600 font-medium">100% NTA Exam Fee</div>
                </div>
              </div>

              {/* Girls Reimbursement */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/90 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-lg shrink-0">
                  👩
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500">Top {selectedMilestone.girlsCount} Girls</div>
                  <div className="font-bold text-slate-900 text-sm">
                    ₹800 each <span className="text-xs font-mono text-slate-400 font-normal">(= {formatIndianCurrency(selectedMilestone.girlsAmount)})</span>
                  </div>
                  <div className="text-[10px] text-pink-600 font-medium">100% NTA Exam Fee</div>
                </div>
              </div>

              {/* Total Winners */}
              <div className="bg-emerald-50/90 p-4 rounded-xl border border-emerald-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Trophy size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono">
                    Total Winners
                  </div>
                  <div className="font-bold text-emerald-950 text-base">
                    Top {formatIndianNumber(selectedMilestone.topN)} Rankers
                  </div>
                  <div className="text-[10px] text-emerald-700 font-medium">
                    100% Full Fees Reimbursed
                  </div>
                </div>
              </div>

            </div>

            {/* Detailed Benefits List */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Guaranteed Benefits Unlocked At {formatIndianNumber(selectedMilestone.students)} Students:</span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-slate-700">
                {selectedMilestone.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
