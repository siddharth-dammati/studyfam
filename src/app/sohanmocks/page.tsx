import type { Metadata } from "next";
import Link from "next/link";
import {
  Lock,
  Clock,
  Award,
  CheckCircle2,
  Atom,
  FlaskConical,
  TestTube2,
  ArrowRight,
  Play,
  FileText,
  ShieldAlert,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Sohan Mocks — Exclusive JEE Main Chemistry 25Q Mock Test",
  description: "Unlisted JEE Main Chemistry full mock test with 25 questions, 1-hour countdown timer, TCS iON interface, and instant diagnostics without login.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SohanMocksPage() {
  return (
    <main className="min-h-screen bg-[#070a12] text-slate-100 selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Tokko Ambient background glow meshes */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-radial from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 -left-40 w-[550px] h-[550px] rounded-full bg-radial from-emerald-600/10 via-teal-600/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1.2px,transparent_1.8px)] [background-size:28px_28px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Top Header Card */}
        <header className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-6 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Unlisted Special Access • Sohan Mocks</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]">
            JEE Main Chemistry Special <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              25Q Full Mock Test
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-8">
            Curated strictly in accordance with NTA&apos;s latest Chemistry chapter-wise weightage. Test yourself on StudyFAM&apos;s authentic TCS iON CBT exam player with a strict 60-minute countdown timer and instant post-exam analytics — completely accessible without login!
          </p>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 backdrop-blur-md hover:border-blue-500/40 transition-colors">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-400">25 Qs</div>
              <div className="text-xs uppercase font-semibold text-slate-400 mt-1">Total Questions</div>
            </div>
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 backdrop-blur-md hover:border-blue-500/40 transition-colors">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-400">60 Min</div>
              <div className="text-xs uppercase font-semibold text-slate-400 mt-1">1-Hour Countdown</div>
            </div>
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 backdrop-blur-md hover:border-blue-500/40 transition-colors">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">100</div>
              <div className="text-xs uppercase font-semibold text-slate-400 mt-1">Max Marks (+4 / -1)</div>
            </div>
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 backdrop-blur-md hover:border-blue-500/40 transition-colors">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400">No Login</div>
              <div className="text-xs uppercase font-semibold text-slate-400 mt-1">Instant Guest Mode</div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/exam/player?id=sohan-chem-mock&guest=1"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-[0_12px_28px_-6px_rgba(37,99,235,0.6)] hover:shadow-[0_16px_36px_-6px_rgba(37,99,235,0.8)] transition-all transform hover:-translate-y-0.5 active:scale-95 border border-white/20"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start 1-Hour Chemistry Mock Exam</span>
            </Link>

            <Link
              href="/exam/player?id=sohan-chem-mock&guest=1&review=1"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white font-semibold text-base border border-white/10 transition-all backdrop-blur-md"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>View Solutions & Analysis Key</span>
            </Link>
          </div>
        </header>

        {/* Chapter-wise Weightage Section */}
        <section className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl mb-12 shadow-2xl">
          <div className="flex items-center gap-3 mb-6 sm:mb-8 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                JEE Main Chemistry Chapter-Wise Weightage Breakdown
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                25 Questions balanced across Physical, Inorganic, and Organic Chemistry
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Physical Chemistry */}
            <div className="bg-slate-800/40 border border-blue-500/20 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-white flex items-center gap-1.5 text-base">
                  <Atom className="w-4 h-4 text-blue-400" />
                  <span>Physical Chemistry</span>
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  8 Qs (32%)
                </span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span>Chemical Thermodynamics</span>
                  <span className="text-[11px] font-mono text-blue-400 font-semibold">Q1 • MCQ</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span>Chemical Kinetics (Ea)</span>
                  <span className="text-[11px] font-mono text-blue-400 font-semibold">Q2 • MCQ</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span>Solutions & Colligative Properties</span>
                  <span className="text-[11px] font-mono text-blue-400 font-semibold">Q3 • MCQ</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span>Electrochemistry (Nernst)</span>
                  <span className="text-[11px] font-mono text-blue-400 font-semibold">Q4 • MCQ</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span>Ionic Equilibrium (Ksp)</span>
                  <span className="text-[11px] font-mono text-blue-400 font-semibold">Q5 • MCQ</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span>Mole Concept & Combustion</span>
                  <span className="text-[11px] font-mono text-purple-400 font-semibold">Q21 • Num</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span>Atomic Structure (Spectra)</span>
                  <span className="text-[11px] font-mono text-purple-400 font-semibold">Q22 • Num</span>
                </li>
                <li className="flex justify-between py-1">
                  <span>Redox Titrations (KMnO₄)</span>
                  <span className="text-[11px] font-mono text-purple-400 font-semibold">Q23 • Num</span>
                </li>
              </ul>
            </div>

            {/* Inorganic Chemistry */}
            <div className="bg-slate-800/40 border border-emerald-500/20 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-white flex items-center gap-1.5 text-base">
                  <TestTube2 className="w-4 h-4 text-emerald-400" />
                  <span>Inorganic Chemistry</span>
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  8 Qs (32%)
                </span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span>MOT Bond Order & Magnetism</span>
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold">Q6 • MCQ</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span>VSEPR Geometry (Xe/SF₄)</span>
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold">Q7 • MCQ</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span>Ionization Enthalpy Anomalies</span>
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold">Q8 • MCQ</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span>CFT Inner Orbital Complexes</span>
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold">Q9 • MCQ</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span>Coordination Optical Isomers</span>
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold">Q10 • MCQ</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span>Lanthanoid Contraction (Zr/Hf)</span>
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold">Q11 • MCQ</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span>Oxoacids of Phosphorus (P-H)</span>
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold">Q12 • MCQ</span>
                </li>
                <li className="flex justify-between py-1">
                  <span>High-Spin Unpaired Electrons</span>
                  <span className="text-[11px] font-mono text-purple-400 font-semibold">Q24 • Num</span>
                </li>
              </ul>
            </div>

            {/* Organic Chemistry */}
            <div className="bg-slate-800/40 border border-purple-500/20 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-white flex items-center gap-1.5 text-base">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Organic Chemistry</span>
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  9 Qs (36%)
                </span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span>GOC: Acidic Strength of Phenols</span>
                  <span className="text-[11px] font-mono text-purple-400 font-semibold">Q13 • MCQ</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span>Carbocation Stability Order</span>
                  <span className="text-[11px] font-mono text-purple-400 font-semibold">Q14 • MCQ</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span>Alkene Reductive Ozonolysis</span>
                  <span className="text-[11px] font-mono text-purple-400 font-semibold">Q15 • MCQ</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span>SN2 Walden Inversion</span>
                  <span className="text-[11px] font-mono text-purple-400 font-semibold">Q16 • MCQ</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span>Cleavage of Ethers with HI</span>
                  <span className="text-[11px] font-mono text-purple-400 font-semibold">Q17 • MCQ</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span>Tollens&apos; & Iodoform Carbonyls</span>
                  <span className="text-[11px] font-mono text-purple-400 font-semibold">Q18 • MCQ</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span>Hoffmann Bromamide & Azo Dye</span>
                  <span className="text-[11px] font-mono text-purple-400 font-semibold">Q19 • MCQ</span>
                </li>
                <li className="flex justify-between py-1 border-b border-white/5">
                  <span>Non-Reducing Disaccharides</span>
                  <span className="text-[11px] font-mono text-purple-400 font-semibold">Q20 • MCQ</span>
                </li>
                <li className="flex justify-between py-1">
                  <span>Chiral Centers in D-Glucose</span>
                  <span className="text-[11px] font-mono text-purple-400 font-semibold">Q25 • Num</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Exam Features */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
            <Clock className="w-6 h-6 text-blue-400 mb-3" />
            <h3 className="font-bold text-white text-sm mb-1">1-Hour Real CBT Clock</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Strict 60-minute countdown with automatic submission and pacing warnings.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
            <Award className="w-6 h-6 text-purple-400 mb-3" />
            <h3 className="font-bold text-white text-sm mb-1">Decimal Keypad</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Section B numerical questions feature official NTA-style virtual decimal keypads.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="font-bold text-white text-sm mb-1">Detailed Explanations</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Comprehensive textbook solutions with step-by-step chemical equations and math.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
            <ShieldAlert className="w-6 h-6 text-amber-400 mb-3" />
            <h3 className="font-bold text-white text-sm mb-1">Percentile Predictor</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Immediate scoring analytics mapped to NTA percentile and rank benchmarks.
            </p>
          </div>
        </section>

        {/* Instructions Card */}
        <section className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl mb-12">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            <span>Test-Taking Instructions</span>
          </h3>

          <div className="space-y-3 text-xs sm:text-sm text-slate-300">
            <div className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <span>
                <strong>Section A (Q1 – Q20):</strong> 20 Multiple Choice Questions (Single Correct). +4 marks for correct answer, -1 mark penalty for wrong answer.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
              <span>
                <strong>Section B (Q21 – Q25):</strong> 5 Numerical Value Questions. Enter answers using the on-screen keypad. +4 for correct, -1 for wrong.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span>
                <strong>No Account Required:</strong> Take the exam directly as a Guest Scholar. Your responses and performance analysis are saved locally in your browser.
              </span>
            </div>
          </div>
        </section>

        {/* Bottom CTA Card */}
        <div className="text-center py-6">
          <Link
            href="/exam/player?id=sohan-chem-mock&guest=1"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-extrabold text-lg shadow-[0_20px_40px_-10px_rgba(37,99,235,0.7)] transition-all transform hover:-translate-y-1 active:scale-95"
          >
            <span>Launch Sohan Chemistry Mock (1 Hour)</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-xs text-slate-500 mt-3 font-mono">
            Direct Link: <code>/exam/player?id=sohan-chem-mock&guest=1</code>
          </p>
        </div>

        <footer className="text-center pt-8 border-t border-white/5 text-xs text-slate-500">
          © 2026 StudyFAM. Unlisted Assessment Platform for Sohan Mocks. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
