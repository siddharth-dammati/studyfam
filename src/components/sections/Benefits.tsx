
import { CheckCircle2 } from "lucide-react";

export function Benefits() {
  const benefits = [
    "Full JEE Main-style mock",
    "All-India comparison",
    "Score analysis",
    "Percentile-style benchmarking where applicable",
    "Subject-wise performance",
    "Accuracy analysis",
    "Time-management insights",
    "Strength/weakness analysis",
    "Rank/position within the participating pool",
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-12 text-center">
          WHAT STUDENTS GET
        </h2>
        
        <div className="figma-card rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="text-blue-500 shrink-0 mt-0.5" size={20} />
                <span className="text-slate-700 font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

