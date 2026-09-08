"use client";

const items = [
  "12,847 Students Registered",
  "₹2,31,246 Support Pool Built",
  "300 Marks · 180 Minutes",
  "All-India Percentile Prediction",
  "NTA CBT Interface",
  "+4 / −1 Marking Scheme",
  "Physics · Chemistry · Maths",
  "27 December 2027",
  "Entry Fee: ₹27 Only",
  "₹18 Goes to JEE Fee Support",
  "Section A: 20 MCQs",
  "Section B: 5 Numerical",
];

export function StatsTicker() {
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
