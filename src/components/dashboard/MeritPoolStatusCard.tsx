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
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Merit Scholarship Pool
          </span>
        </div>
        <span className="text-xs font-bold font-mono text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
          Target: {milestone.toLocaleString()} Aspirants
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="text-[10px] uppercase font-mono text-slate-400 mb-1 flex items-center gap-1">
            <Users size={12} /> {showLive ? "Total Registered" : "Target Milestone"}
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
            {showLive ? total_registrations.toLocaleString() : milestone.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {showLive ? "Aspirants competing" : "Aspirants nationwide target"}
          </div>
        </div>

        <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100">
          <div className="text-[10px] uppercase font-mono text-emerald-700 mb-1 flex items-center gap-1">
            <Award size={12} /> {showLive ? "Live Pool" : "Target Pool"}
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-900 tabular-nums">
            ₹{showLive ? support_pool.toLocaleString("en-IN") : (milestone * 18).toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
            Top {tier.topN} Guaranteed Funded
          </div>
        </div>
      </div>

      {/* Dynamic prize structure badges: 50% Merit + 50% Need-Based */}
      <div className="space-y-2 mb-5">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/70 text-xs border border-emerald-200/80">
          <span className="font-semibold text-emerald-900 flex items-center gap-2">
            <span>🏆</span> 50% Merit: Top {tier.meritBoys ?? Math.floor(tier.boysCount / 2)} Boys + Top {tier.meritGirls ?? Math.floor(tier.girlsCount / 2)} Girls
          </span>
          <span className="font-bold text-emerald-800 font-mono text-[11px]">100% Mock Rank</span>
        </div>
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50/70 text-xs border border-rose-200/80">
          <span className="font-semibold text-rose-900 flex items-center gap-2">
            <span>❤️</span> 50% Need-Based: Next {tier.needBoys ?? Math.floor(tier.boysCount / 2)} Boys + Next {tier.needGirls ?? Math.floor(tier.girlsCount / 2)} Girls
          </span>
          <span className="font-bold text-rose-800 font-mono text-[11px]">50% Reserved</span>
        </div>
      </div>

      {/* Progress to target or milestone info */}
      <div className="pt-4 border-t border-slate-100">
        {showLive ? (
          <>
            <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium">
              <span>Target Milestone: {milestone.toLocaleString()} (Top {tier.topN} Winners)</span>
              <span className="font-mono text-indigo-600">{remaining_to_milestone.toLocaleString()} left</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-700 rounded-full"
                style={{ width: `${Math.min(progress_percentage, 100)}%` }}
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Milestone 1: {milestone.toLocaleString()} Aspirants (Top {tier.topN} Funded)</span>
            <span className="font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
              ₹18 Escrowed / Student
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
