"use client";

import { useImpactStats } from "@/hooks/useImpactStats";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { Trophy, Award, Users, TrendingUp } from "lucide-react";

export function MeritPoolStatusCard() {
  const { config } = useSiteConfig();
  const showLive = Boolean(config?.hero?.showLiveCounters);
  const {
    total_registrations = 0,
    support_pool = 0,
    funded_students = 0,
    milestone = 1000,
    progress_percentage = 0,
    remaining_to_milestone = 1000,
    current_tier,
  } = useImpactStats();

  const tier = current_tier || {
    students: 1000,
    topN: 20,
    boysCount: 10,
    boysAmount: 10000,
    girlsCount: 10,
    girlsAmount: 8000,
    pool: 18000,
  };

  return (
    <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-[32px] p-6 sm:p-8 shadow-[0_20px_50px_-25px_rgba(10,28,150,0.06)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dcfce7] text-[#16a34a] border border-[#86efac]/80 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Merit Scholarship Pool</span>
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1a1a1a] tracking-tight">
            100% Fee Refund Scholarship Reserve
          </h3>
        </div>
        <span className="self-start sm:self-center text-xs font-bold font-mono text-[#0a1c96] bg-[#e9f1fd] border border-[#1a5fe0]/20 px-3 py-1 rounded-full shadow-2xs">
          Target: {milestone.toLocaleString()} Aspirants
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mb-6">
        <div className="p-5 bg-[#fafafa] rounded-[22px] border border-[rgba(26,26,26,0.08)] hover:border-[#1a5fe0]/30 transition-all flex flex-col justify-between">
          <div className="text-[10px] uppercase font-mono font-bold text-slate-400 mb-2 flex items-center gap-1.5">
            <Users size={13} className="text-[#0a1c96]" /> {showLive ? "Total Registered" : "Target Milestone"}
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#1a1a1a] tabular-nums tracking-tight">
              {showLive ? total_registrations.toLocaleString() : milestone.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              {showLive ? "Aspirants competing nationwide" : "Aspirants nationwide target"}
            </div>
          </div>
        </div>

        <div className="p-5 bg-gradient-to-br from-[#dcfce7]/70 to-[#e9f1fd]/50 rounded-[22px] border border-[#86efac]/80 hover:shadow-xs transition-all flex flex-col justify-between">
          <div className="text-[10px] uppercase font-mono font-bold text-emerald-800 mb-2 flex items-center gap-1.5">
            <Award size={13} className="text-[#16a34a]" /> {showLive ? "Live Scholarship Pool" : "Target Pool"}
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-950 tabular-nums tracking-tight">
              ₹{showLive ? support_pool.toLocaleString("en-IN") : (milestone * 18).toLocaleString("en-IN")}
            </div>
            <div className="text-xs text-emerald-800 font-semibold mt-1">
              Top {tier.topN} Guaranteed 100% Exam Fee Refund
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic prize structure badges: 50% Merit + 50% Need-Based */}
      <div className="space-y-2.5 mb-6">
        <div className="flex items-center justify-between p-3 rounded-[18px] bg-[#fafafa] text-xs border border-[rgba(26,26,26,0.08)]">
          <span className="font-semibold text-slate-800 flex items-center gap-2">
            <span>🏆</span> 50% Pure Merit: Top {tier.meritBoys ?? Math.floor(tier.boysCount / 2)} Boys + Top {tier.meritGirls ?? Math.floor(tier.girlsCount / 2)} Girls
          </span>
          <span className="font-bold text-[#0a1c96] font-mono text-[11px] bg-[#e9f1fd] border border-[#1a5fe0]/20 px-2.5 py-0.5 rounded-full">
            100% Mock Rank
          </span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-[18px] bg-[#fafafa] text-xs border border-[rgba(26,26,26,0.08)]">
          <span className="font-semibold text-slate-800 flex items-center gap-2">
            <span>❤️</span> 50% Need-Based: Next {tier.needBoys ?? Math.floor(tier.boysCount / 2)} Boys + Next {tier.needGirls ?? Math.floor(tier.girlsCount / 2)} Girls
          </span>
          <span className="font-bold text-rose-800 font-mono text-[11px] bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
            50% Reserved
          </span>
        </div>
      </div>

      {/* Progress to target or milestone info */}
      <div className="pt-4 border-t border-[rgba(26,26,26,0.08)]">
        {showLive ? (
          <>
            <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium">
              <span>Target Milestone: {milestone.toLocaleString()} (Top {tier.topN} Winners)</span>
              <span className="font-mono text-[#0a1c96] font-bold">{remaining_to_milestone.toLocaleString()} left</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0a1c96] via-[#1a5fe0] to-[#16a34a] transition-all duration-700 rounded-full"
                style={{ width: `${Math.min(progress_percentage, 100)}%` }}
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Milestone 1: {milestone.toLocaleString()} Aspirants (Top {tier.topN} Funded)</span>
            <span className="font-mono text-[#16a34a] font-bold bg-[#dcfce7] border border-[#86efac]/80 px-2.5 py-0.5 rounded-full shadow-2xs">
              ₹18 Escrowed / Student
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
