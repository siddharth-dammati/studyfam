"use client";

const subjects = [
  {
    name: "Physics",
    color: "bg-[var(--indigo-500)]",
    light: "bg-[var(--indigo-50)]",
    textColor: "text-[var(--indigo-600)]",
    sections: [
      { name: "Section A", desc: "Single Correct MCQ", count: 20, marks: 80 },
      { name: "Section B", desc: "Numerical Value", count: 5, marks: 20 },
    ],
    topics: ["Mechanics", "Thermodynamics", "Electromagnetism", "Optics", "Modern Physics"],
  },
  {
    name: "Chemistry",
    color: "bg-[var(--emerald-500)]",
    light: "bg-[var(--emerald-50)]",
    textColor: "text-[var(--emerald-600)]",
    sections: [
      { name: "Section A", desc: "Single Correct MCQ", count: 20, marks: 80 },
      { name: "Section B", desc: "Numerical Value", count: 5, marks: 20 },
    ],
    topics: ["Physical Chemistry", "Organic Chemistry", "Inorganic Chemistry"],
  },
  {
    name: "Mathematics",
    color: "bg-[#F59E0B]",
    light: "bg-[#FFFBEB]",
    textColor: "text-[#D97706]",
    sections: [
      { name: "Section A", desc: "Single Correct MCQ", count: 20, marks: 80 },
      { name: "Section B", desc: "Numerical Value", count: 5, marks: 20 },
    ],
    topics: ["Algebra", "Calculus", "Coordinate Geometry", "Trigonometry", "Vectors"],
  },
];

export function ExamPattern() {
  return (
    <section id="exam-pattern" className="py-28 bg-[var(--surface-1)] border-t border-[var(--border)]">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-2xl mb-20">
          <span className="text-[var(--indigo-500)] text-xs font-mono uppercase tracking-widest mb-4 block">Exam Pattern</span>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-tight text-[var(--text-primary)] leading-tight mb-5">
            100% NTA aligned.<br />No surprises on test day.
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            The same structure, the same interface, the same marking scheme as the real JEE Main 2027.
            Experience the exact NTA CBT environment before it matters.
          </p>
        </div>

        {/* Overview strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { label: "Total Questions", value: "75" },
            { label: "Total Marks", value: "300" },
            { label: "Duration", value: "3 hrs" },
            { label: "Marking", value: "+4 / −1" },
          ].map(s => (
            <div key={s.label} className="bg-white border border-[var(--border)] rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">{s.value}</div>
              <div className="text-[var(--text-muted)] text-xs font-mono uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Subject cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {subjects.map(sub => (
            <div key={sub.name} className="bg-white border border-[var(--border)] rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-[var(--shadow-md)] transition-all duration-200">
              {/* Card header */}
              <div className={`${sub.light} px-6 py-5 border-b border-[var(--border)]`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-lg font-bold ${sub.textColor}`}>{sub.name}</span>
                  <div className={`w-2.5 h-2.5 rounded-full ${sub.color}`} />
                </div>
                <span className={`text-xs font-mono ${sub.textColor} opacity-70`}>100 Marks · 25 Questions</span>
              </div>

              {/* Sections */}
              <div className="divide-y divide-[var(--border)]">
                {sub.sections.map(sec => (
                  <div key={sec.name} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">{sec.name}</div>
                      <div className="text-xs text-[var(--text-muted)]">{sec.desc}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-[var(--text-primary)]">{sec.count} Qs</div>
                      <div className="text-xs text-[var(--text-muted)]">{sec.marks} marks</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Topics */}
              <div className="px-6 py-4">
                <div className="flex flex-wrap gap-1.5">
                  {sub.topics.map(t => (
                    <span key={t} className="text-[10px] bg-[var(--surface-1)] border border-[var(--border)] rounded-lg px-2.5 py-1 text-[var(--text-muted)] font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* NTA Interface note */}
        <div className="bg-[var(--indigo-600)] rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl shrink-0">
              🖥️
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-1">TCS iON Interface Simulation</h4>
              <p className="text-white/60 text-sm">
                Practice on the exact same UI you will face on exam day. No UI surprises. Save precious minutes.
              </p>
            </div>
          </div>
          <div className="shrink-0 bg-white/8 border border-white/12 rounded-xl px-5 py-3 text-center whitespace-nowrap">
            <div className="text-white font-bold">Exact replica</div>
            <div className="text-white/40 text-xs font-mono">NTA CBT 2027</div>
          </div>
        </div>

      </div>
    </section>
  );
}
