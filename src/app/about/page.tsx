import { Footer } from "@/components/sections/Footer";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export const metadata = {
  title: "About StudyFam | Engineering India's True JEE Benchmark",
  description: "Learn about the mission, statistical methodology, and social scholarship architecture powering the StudyFam JEE Main 2027 All India Mock.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:pt-6 pointer-events-none">
        <div className="w-full max-w-[1100px] figma-nav pointer-events-auto px-6 py-3 bg-white/95 backdrop-blur-md shadow-sm border border-slate-200 flex items-center justify-between">
          <Link href="/" aria-label="Home">
            <Logo className="h-8" textClassName="text-lg" />
          </Link>
          <Link href="/" className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pt-36 pb-24 max-w-[840px] mx-auto px-6 w-full">
        {/* Header */}
        <div className="mb-14 border-b border-slate-200 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-[11px] font-mono font-bold uppercase tracking-wider mb-5">
            About StudyFam Technologies
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
            Democratizing the National Benchmark for Every JEE Aspirant.
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">
            We are building India&apos;s largest independent diagnostic testing engine—where data truth replaces marketing hype, and where community registrations sponsor deserving peers.
          </p>
        </div>

        {/* Narrative */}
        <div className="space-y-12 text-sm leading-relaxed text-slate-700">

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              1. The Coaching Cohort Problem
            </h2>
            <p>
              Over 1.4 million students register for the Joint Entrance Examination (Main) each year. Yet, 95% of candidates prepare within isolated coaching batches or local test series. A student who scores in the 99th percentile of a local coaching batch of 500 students often discovers on exam day that their actual national standing is tens of thousands of ranks lower.
            </p>
            <p>
              In statistics, standard error is inversely proportional to the square root of sample size (SE ∝ 1/√N). Testing against small cohorts produces high variance and deceptive optimism. To obtain an actionable All-India percentile prediction, aspirants must compete on a unified paper against an All-India cross-section.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              2. Why the ₹27 Economic Architecture Works
            </h2>
            <p>
              Commercial mock test packages routinely charge between ₹3,000 and ₹15,000. These price tags self-select an elite demographic, effectively excluding talented aspirants from rural districts and non-metro towns.
            </p>
            <p>
              StudyFam set the registration barrier at ₹27—less than the price of a cup of tea. By removing the economic friction, we enable hundreds of thousands of aspirants from Kashmir to Kanyakumari to compete on the exact same afternoon. High volume yields statistical certainty.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              3. The Cause: Merit Sponsorship via Community Pool
            </h2>
            <p>
              Education should lift everyone. That is why ₹18 out of every ₹27 fee is permanently allocated into the <strong>JEE Fee Support Pool</strong>.
            </p>
            <p>
              The top rankers from our All-India leaderboard have their official NTA JEE Main exam fees 100% refunded as a merit scholarship. The mathematics is pure: when 1,000 students register, the pool sponsors the Top 10 Boys and Top 10 Girls (₹18,000). When 50,000 register, 1,000 top aspirants are sponsored (₹9,00,000).
            </p>
          </section>

          <section id="advisory" className="space-y-4 pt-6 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              4. Academic & Statistical Advisory Board
            </h2>
            <p>
              Our examination papers are curated by a panel of IIT alumni, seasoned subject matter experts, and psychometric statisticians. Each question undergoes rigorous calibration for difficulty index, discrimination index, and NTA syllabus conformity.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="font-bold text-slate-900 text-sm mb-1">CBT Engineering Cell</div>
                <p className="text-slate-600">Simulating the exact TCS iON examination client interface, keyboard restrictions, and question palette behavior.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="font-bold text-slate-900 text-sm mb-1">Independent Audit Board</div>
                <p className="text-slate-600">Overseeing the 100% escrowed disbursement of scholarship reserves directly to verified student bank accounts.</p>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
