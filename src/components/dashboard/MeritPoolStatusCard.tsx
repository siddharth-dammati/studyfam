"use client";

import { useImpactStats } from "@/hooks/useImpactStats";
import { Trophy, Award, Users, TrendingUp } from "lucide-react";

export function MeritPoolStatusCard() {
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
            <Users size={12} /> Total Registered
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
            {total_registrations.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Aspirants competing</div>
        </div>

        <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100">
          <div className="text-[10px] uppercase font-mono text-emerald-700 mb-1 flex items-center gap-1">
            <Award size={12} /> Live Pool
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-900 tabular-nums">
            ₹{support_pool.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
            Top {Math.max(funded_students, 20)} Guaranteed Funded
          </div>
        </div>
      </div>

      {/* Dynamic prize structure badges */}
      <div className="space-y-2 mb-5">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs border border-slate-100">
          <span className="font-semibold text-slate-700 flex items-center gap-2">
            <span>👨</span> Top {tier.boysCount} Boys
          </span>
          <span className="font-bold text-slate-900">₹1,000 each (100% NTA Fee)</span>
        </div>
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs border border-slate-100">
          <span className="font-semibold text-slate-700 flex items-center gap-2">
            <span>👩</span> Top {tier.girlsCount} Girls
          </span>
          <span className="font-bold text-slate-900">₹800 each (100% NTA Fee)</span>
        </div>
      </div>

      {/* Progress to target */}
      <div className="pt-4 border-t border-slate-100">
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
      </div>
    </div>
  );
}
