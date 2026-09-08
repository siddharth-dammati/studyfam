"use client";

const bentoItems = [
  {
    id: "headline",
    span: "col-span-1 md:col-span-2 row-span-2",
    className: "bg-[var(--indigo-600)] rounded-[24px] hover:-translate-y-1 transition-transform duration-200 overflow-hidden",
    content: (
      <div className="h-full flex flex-col justify-between p-8 md:p-10">
        <div>
          <div className="text-indigo-200 text-[10px] font-mono uppercase tracking-widest mb-6">Why This Mock?</div>
          <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight mb-4">
            Your rank means nothing if only 500 students took the test.
          </h3>
          <p className="text-indigo-200 text-sm leading-relaxed max-w-sm">
            The strength of a mock is in the pool. With 10,000+ students on the same test, the same day, your percentile becomes a real national signal.
          </p>
        </div>
        <div className="flex gap-8 mt-8 pt-6 border-t border-indigo-500">
          {[{ n: "10,000+", l: "Students" }, { n: "99.12", l: "Top Percentile" }, { n: "1", l: "Common Paper" }].map(s => (
            <div key={s.l}>
              <div className="text-2xl font-bold text-white">{s.n}</div>
              <div className="text-indigo-300 text-[10px] font-mono uppercase">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: "analysis",
    span: "col-span-1",
    className: "bg-white border border-[var(--border)] rounded-[24px] hover:-translate-y-1 hover:shadow-[var(--shadow-md)] transition-all duration-200",
    content: (
      <div className="p-6 h-full flex flex-col">
        <div className="text-[var(--indigo-500)] text-[10px] font-mono uppercase tracking-widest mb-4">Subject Analysis</div>
        <div className="flex-1 space-y-3">
          {[{ s: "Physics", pct: 78, c: "bg-[var(--indigo-500)]" }, { s: "Chemistry", pct: 91, c: "bg-[var(--emerald-500)]" }, { s: "Maths", pct: 64, c: "bg-amber-400" }].map(sub => (
            <div key={sub.s}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[var(--text-secondary)] font-medium">{sub.s}</span>
                <span className="text-[var(--text-primary)] font-bold">{sub.pct}%</span>
              </div>
              <div className="h-1.5 bg-[var(--surface-2)] rounded-full overflow-hidden">
                <div className={`h-full ${sub.c} rounded-full`} style={{ width: `${sub.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <p className="text-[10px] text-[var(--text-muted)] font-mono">Personalised after test</p>
        </div>
      </div>
    )
  },
  {
    id: "rank",
    span: "col-span-1",
    className: "bg-[var(--surface-1)] border border-[var(--border)] rounded-[24px] hover:-translate-y-1 hover:shadow-[var(--shadow-md)] transition-all duration-200",
    content: (
      <div className="p-6 h-full flex flex-col justify-between">
        <div className="text-[var(--text-muted)] text-[10px] font-mono uppercase tracking-widest">Predicted AIR</div>
        <div>
          <div className="text-5xl font-bold text-[var(--text-primary)] tabular-nums leading-none mb-1.5">#4,219</div>
          <div className="text-[var(--emerald-600)] font-mono text-xs font-bold">99.12 percentile</div>
        </div>
        <p className="text-[var(--text-muted)] text-xs leading-relaxed">Based on 12,847 participants nationally</p>
      </div>
    )
  },
  {
    id: "performance",
    span: "col-span-1 md:col-span-2",
    className: "bg-white border border-[var(--border)] rounded-[24px] hover:-translate-y-1 hover:shadow-[var(--shadow-md)] transition-all duration-200",
    content: (
      <div className="p-6 flex gap-8 items-center h-full flex-wrap">
        <div className="flex-1 min-w-[180px]">
          <div className="text-[var(--text-muted)] text-[10px] font-mono uppercase tracking-widest mb-4">Your Scorecard</div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { l: "Score", v: "187/300" },
              { l: "Accuracy", v: "91%" },
              { l: "Avg Time/Q", v: "1m 45s" },
              { l: "Silly Mistakes", v: "−8 marks" },
            ].map(m => (
              <div key={m.l} className="bg-[var(--surface-1)] rounded-xl p-3 border border-[var(--border)]">
                <div className="text-[10px] text-[var(--text-muted)] font-mono mb-1">{m.l}</div>
                <div className="text-sm font-bold text-[var(--text-primary)]">{m.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="shrink-0 text-right hidden sm:block">
          <div className="text-6xl font-bold text-[var(--indigo-500)] leading-none mb-2">D−14</div>
          <p className="text-[var(--text-secondary)] text-sm max-w-[160px] ml-auto">days to improve before the real exam</p>
        </div>
      </div>
    )
  },
  {
    id: "fee",
    span: "col-span-1",
    className: "bg-emerald-50 border border-emerald-200 rounded-[24px] hover:-translate-y-1 transition-transform duration-200",
    content: (
      <div className="p-6 h-full flex flex-col justify-between">
        <div className="text-emerald-700 text-[10px] font-mono font-bold uppercase tracking-widest">Win Your Exam Fees</div>
        <div>
          <div className="text-3xl font-bold text-emerald-800 mb-1.5">Top N Win 100%</div>
          <p className="text-emerald-700 text-xs leading-relaxed">
            ₹18 from every entry funds the pool. Top N students receive their complete JEE Main exam fee refunded as a merit scholarship!
          </p>
        </div>
      </div>
    )
  },
];

export function WhyMock() {
  return (
    <section id="why-mock" className="py-28 bg-white border-t border-[var(--border)]">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-[var(--indigo-500)] text-[10px] font-mono uppercase tracking-widest mb-4 block">Why This Mock?</span>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-tight text-[var(--text-primary)] leading-tight">
              Not just a test.<br />A national benchmark.
            </h2>
          </div>
          <p className="text-[var(--text-secondary)] max-w-xs text-sm leading-relaxed md:text-right">
            One paper. One day. Hundreds of thousands of aspirants. The result is data that actually tells you where you stand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[220px]">
          {bentoItems.map(item => (
            <div key={item.id} className={`${item.span} ${item.className}`}>
              {item.content}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
