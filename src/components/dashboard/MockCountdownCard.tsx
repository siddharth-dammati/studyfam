"use client";

import { useEffect, useState } from "react";
import { Clock, Monitor, CheckCircle2, FileText, AlertTriangle } from "lucide-react";

export function MockCountdownCard() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date("2027-12-27T09:00:00+05:30").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Mock Exam Schedule
          </span>
        </div>
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
          27 December 2027
        </span>
      </div>

      <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-4">
        All-India JEE Main 2027 Mock CBT
      </h3>

      {/* Countdown Digits */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {[
          { label: "Days", val: timeLeft.days },
          { label: "Hours", val: timeLeft.hours },
          { label: "Mins", val: timeLeft.minutes },
          { label: "Secs", val: timeLeft.seconds },
        ].map(({ label, val }) => (
          <div key={label} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center">
            <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 tabular-nums">
              {String(val).padStart(2, "0")}
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider mt-0.5">
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* CBT Engine Checklist */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs">
        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-2">
            <FileText size={14} className="text-slate-400" /> Pattern
          </span>
          <span className="font-semibold text-slate-900">300 Marks · 75 Questions (3 Hours)</span>
        </div>
        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-2">
            <Monitor size={14} className="text-slate-400" /> Engine
          </span>
          <span className="font-semibold text-slate-900">TCS iON NTA Interface</span>
        </div>
        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-500" /> System Compatibility
          </span>
          <span className="font-semibold text-emerald-700">Verified & Ready</span>
        </div>
      </div>
    </div>
  );
}
