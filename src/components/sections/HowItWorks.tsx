
export function HowItWorks() {
  const steps = [
    { num: "01", title: "REGISTER", desc: "Secure your ₹27 spot." },
    { num: "02", title: "TAKE THE MOCK", desc: "Attempt the full JEE Main-style mock on 27 December 2026." },
    { num: "03", title: "GET YOUR PERFORMANCE", desc: "Receive your score and detailed analysis." },
    { num: "04", title: "SEE YOUR BENCHMARK", desc: "Understand how you performed within the participating pool." },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-16 text-center">
          HOW IT WORKS
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              <div className="text-6xl font-bold text-slate-800 mb-4">{step.num}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-slate-600">{step.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(100%-2rem)] w-[calc(100%-2rem)] h-[1px] bg-slate-100" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

