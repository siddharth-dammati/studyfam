"use client";

import { useImpactStats } from "@/hooks/useImpactStats";
import { useSiteConfig } from "@/context/SiteConfigContext";

export function StatsTicker() {
  const { total_registrations = 0, support_pool = 0 } = useImpactStats();
  const { config } = useSiteConfig();
  const showLive = Boolean(config?.hero?.showLiveCounters);

  const items = [
    ...(showLive
      ? [
          `${(total_registrations ?? 0).toLocaleString()} Students Registered`,
          `₹${(support_pool ?? 0).toLocaleString("en-IN")} Support Pool Built`,
        ]
      : [
          "Registrations Open 20 October 2026",
          "₹18 of Every ₹27 Dedicated to Fee Scholarships",
          "50% Merit · 50% Need-Based Dual Track",
        ]),
    "300 Marks · 180 Minutes",
    "All-India Percentile Prediction",
    "NTA CBT Interface",
    "+4 / −1 Marking Scheme",
    "Physics · Chemistry · Maths",
    "27 December 2026 · 9:00 AM – 12:00 PM",
    "Entry Fee: ₹27 Only",
    "Section A: 20 MCQs",
    "Section B: 5 Numerical",
  ];

  const doubled = [...items, ...items];

  return (
    <div className="border-y border-[var(--border)] bg-[var(--surface-1)] overflow-hidden py-4 relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--surface-1)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--surface-1)] to-transparent z-10 pointer-events-none" />

      <div
        className="flex items-center gap-0 whitespace-nowrap"
        style={{
          animation: "ticker 40s linear infinite",
          width: "max-content",
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-6 px-8">
            <span className="text-xs font-semibold text-[var(--text-secondary)] tracking-wide">{item}</span>
            <span className="w-1 h-1 rounded-full bg-[var(--indigo-400)] opacity-60 flex-shrink-0" />
          </span>
        ))}
      </div>

      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
