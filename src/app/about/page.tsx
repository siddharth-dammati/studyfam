import { ExternalPageShell } from "@/components/layout/ExternalPageShell";
import { Users, BarChart3, HeartHandshake, ShieldCheck, Award, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About StudyFam | Engineering India's True JEE Benchmark",
  description: "Learn about the mission, statistical methodology, and social scholarship architecture powering the StudyFam JEE Main 2027 All India Mock.",
};

export default function AboutPage() {
  return (
    <ExternalPageShell
      badgeText="Our Mission & Engineering DNA"
      badgeTone="indigo"
      title="Democratizing the National"
      titleGradient="JEE Benchmark."
      subtitle="We are building India's largest independent diagnostic testing engine—where data truth replaces marketing hype, and where community registrations sponsor deserving peers."
      metaItems={[
        { label: "Founded", value: "2026" },
        { label: "Community Model", value: "₹27 Transparent Entry" },
        { label: "Scholarship Escrow", value: "₹18 per Registration" },
        { label: "Interface Standard", value: "Authentic TCS iON Replica" },
      ]}
      maxWidth="narrow"
    >
      <div className="space-y-8">
        {/* Mission Statement Hero Card */}
        <div className="p-6 sm:p-8 rounded-[20px] bg-gradient-to-br from-[#0A1C96] via-[#1A5FE0] to-[#123AC8] text-white shadow-lg space-y-3 relative overflow-hidden">
          <div
            className="absolute w-72 h-72 rounded-full -top-20 -right-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(214, 174, 242, 0.4), transparent 70%)" }}
          />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-200 bg-white/10 border border-white/20 px-3 py-1 rounded-full inline-block">
            Foundational Philosophy
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight tokko-font-sora">
            Testing against 500 local students produces deceptive optimism. Real percentiles require true national sample sizes.
          </h2>
          <p className="text-blue-100/90 text-sm leading-relaxed max-w-2xl">
            In statistics, sample error is inversely proportional to the square root of sample size (SE ∝ 1/√N). By removing economic barriers, StudyFam unites hundreds of thousands of aspirants on a singular proctored afternoon.
          </p>
        </div>

        {/* Section 1: The Coaching Cohort Problem */}
        <div className="tokko-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-[#1A5FE0] bg-[#EFF5FF] border border-[#D7E4FA] px-2.5 py-1 rounded-md">
              1.0
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1526] tracking-tight">
              The Coaching Cohort Trap
            </h2>
          </div>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            Over 1.4 million students register for JEE (Main) annually. Yet 95% of candidates prepare inside isolated coaching batches or local test series. A student ranking in the 99th percentile of a local cohort of 500 aspirants routinely discovers on exam day that their actual national standing is tens of thousands of ranks lower.
          </p>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            Small batches suffer from severe selection bias. Aspirants must face a statistically significant national cross-section to accurately diagnose weaknesses in their Class 11 and Class 12 chapters before NTA Session 1.
          </p>
        </div>

        {/* Section 2: Why the ₹27 Economic Architecture Works */}
        <div className="tokko-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-[#1A5FE0] bg-[#EFF5FF] border border-[#D7E4FA] px-2.5 py-1 rounded-md">
              2.0
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1526] tracking-tight">
              The ₹27 Economic Architecture
            </h2>
          </div>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            Commercial mock test series charge anywhere between ₹3,000 and ₹15,000. These paywalls self-select an elite demographic, effectively excluding brilliant aspirants from rural districts and small towns who cannot afford commercial coaching.
          </p>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            StudyFam set the entry barrier at <strong>₹27</strong>—less than the price of a cup of tea. Removing economic friction enables aspirants from Kashmir to Kanyakumari to participate on equal ground. High volume creates statistical truth.
          </p>
        </div>

        {/* Section 3: Merit Sponsorship via Community Pool */}
        <div className="tokko-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
              3.0
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1526] tracking-tight">
              Merit Sponsorship via the Community Pool
            </h2>
          </div>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            Education should lift everyone. That is why exactly <strong>₹18.00</strong> of every ₹27 registration fee is mandatorily escrowed into the <strong>JEE Fee Support Pool</strong>.
          </p>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            Top rankers from our All-India leaderboard have their official NTA JEE Main examination application fee (up to ₹1,000) 100% refunded as a merit scholarship. The mathematics scales directly: when 50,000 students participate, 1,000 top aspirants receive ₹9,00,000 in direct fee support.
          </p>
        </div>

        {/* Section 4: Academic Advisory & Engineering Board */}
        <div className="tokko-card p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-[#1A5FE0] bg-[#EFF5FF] border border-[#D7E4FA] px-2.5 py-1 rounded-md">
              4.0
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1526] tracking-tight">
              Academic &amp; Statistical Governance
            </h2>
          </div>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            StudyFam mock examination papers are curated by IIT alumni, senior faculties, and psychometric statisticians. Each question undergoes double-blind peer review for NTA syllabus conformity, difficulty calibration, and discrimination index.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="font-bold text-[#0B1526] text-sm flex items-center gap-2">
                <BookOpen size={16} className="text-[#1A5FE0]" />
                <span>CBT Simulation Engine</span>
              </div>
              <p className="text-xs text-[#4B5B76] leading-relaxed">
                Faithfully replicating official TCS iON keyboard lockouts, question palettes, and responsive multi-resolution split views.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="font-bold text-[#0B1526] text-sm flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span>Escrow Reserve Verification</span>
              </div>
              <p className="text-xs text-[#4B5B76] leading-relaxed">
                Overseeing the 100% transparent disbursement of fee sponsorships directly to verified student bank accounts post-exam.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ExternalPageShell>
  );
}
