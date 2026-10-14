import type { Metadata } from "next";
import Link from "next/link";
import { Play, Clock, Award, CheckCircle2, Lock, FileText, Zap, Sparkles, Orbit, FlaskConical, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "Sohan Mocks — Exclusive JEE Mock Test Series",
  description: "Unlisted JEE Advanced & Main mock tests with authentic TCS iON CBT exam player and step-by-step solutions.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SohanMocksPage() {
  return (
    <main className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col justify-start items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-radial from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1.2px,transparent_1.8px)] [background-size:28px_28px] pointer-events-none -z-10" />

      <div className="w-full max-w-6xl mx-auto">
        {/* Hub Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Sohan Mocks • Unlisted Testing Hub</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Sohan Mocks Series
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Curated JEE Main and Advanced mock tests. Experience authentic TCS iON CBT simulation with instant diagnostics and step-by-step solutions.
          </p>
        </div>

        {/* Mock Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 mb-12">
          
          {/* Card 1: Gravitation (Medium JEE Main Test) - NEW */}
          <div className="bg-slate-900/80 border border-emerald-500/30 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-2xl relative flex flex-col justify-between overflow-hidden group hover:border-emerald-500/60 transition-all">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold uppercase tracking-wide border border-emerald-500/30">
                  <Target className="w-3.5 h-3.5 text-emerald-400" />
                  Physics • Fresh New
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-0.5 rounded-md">
                  JEE Main (Medium)
                </span>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Orbit className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-emerald-200 transition-colors">
                  Gravitation (Medium)
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 mb-5 font-medium leading-relaxed">
                25 balanced JEE Main problems with diagrams: $g$ variation with height/depth, Kepler's 3rd law, escape velocity, Earth tunnels, orbital satellite energy, and neutral points.
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                <div className="bg-slate-800/60 border border-white/5 rounded-xl p-2.5 text-center">
                  <div className="text-lg font-extrabold font-mono text-emerald-400">25</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Questions</div>
                </div>
                <div className="bg-slate-800/60 border border-white/5 rounded-xl p-2.5 text-center">
                  <div className="text-lg font-extrabold font-mono text-teal-400">60m</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Duration</div>
                </div>
                <div className="bg-slate-800/60 border border-white/5 rounded-xl p-2.5 text-center">
                  <div className="text-lg font-extrabold font-mono text-cyan-400">100</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Max Marks</div>
                </div>
              </div>

              <div className="text-xs text-slate-400 bg-white/5 border border-white/5 rounded-xl py-2 px-3 mb-5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pattern: 20 MCQs (+4/-1) + 5 Numericals (+4/0)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 mt-auto">
              <Link
                href="/exam/player?id=sohan-gravitation-medium-mock&guest=1"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-[0_8px_20px_-4px_rgba(16,185,129,0.5)] transition-all transform hover:-translate-y-0.5 active:scale-95 border border-white/20"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Test</span>
              </Link>
              <Link
                href="/exam/player?id=sohan-gravitation-medium-mock&guest=1&review=1"
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-xs border border-white/10 transition-all"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>View Solutions & Key</span>
              </Link>
            </div>
          </div>

          {/* Card 2: Gravitation (Very Hard Mock Test) */}
          <div className="bg-slate-900/80 border border-amber-500/30 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-2xl relative flex flex-col justify-between overflow-hidden group hover:border-amber-500/60 transition-all">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold uppercase tracking-wide border border-amber-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Physics Special
                </span>
                <span className="text-xs font-mono font-bold text-red-400 bg-red-950/40 border border-red-500/20 px-2.5 py-0.5 rounded-md">
                  JEE Advanced (Hard)
                </span>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Orbit className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-200 transition-colors">
                  Gravitation (Very Hard)
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 mb-5 font-medium leading-relaxed">
                25 ultra-hard problems: Kepler orbits, variable density profiles, chord tunnel SHM, cavity field superposition, Hohmann transfers, and self-binding energy.
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                <div className="bg-slate-800/60 border border-white/5 rounded-xl p-2.5 text-center">
                  <div className="text-lg font-extrabold font-mono text-amber-400">25</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Questions</div>
                </div>
                <div className="bg-slate-800/60 border border-white/5 rounded-xl p-2.5 text-center">
                  <div className="text-lg font-extrabold font-mono text-orange-400">60m</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Duration</div>
                </div>
                <div className="bg-slate-800/60 border border-white/5 rounded-xl p-2.5 text-center">
                  <div className="text-lg font-extrabold font-mono text-red-400">100</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Max Marks</div>
                </div>
              </div>

              <div className="text-xs text-slate-400 bg-white/5 border border-white/5 rounded-xl py-2 px-3 mb-5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pattern: 20 MCQs (+4/-1) + 5 Numericals (+4/0)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 mt-auto">
              <Link
                href="/exam/player?id=sohan-gravitation-mock&guest=1"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm shadow-[0_8px_20px_-4px_rgba(217,119,6,0.5)] transition-all transform hover:-translate-y-0.5 active:scale-95 border border-white/20"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Test</span>
              </Link>
              <Link
                href="/exam/player?id=sohan-gravitation-mock&guest=1&review=1"
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-xs border border-white/10 transition-all"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>View Solutions & Key</span>
              </Link>
            </div>
          </div>

          {/* Card 3: Chemistry Full Mock Test */}
          <div className="bg-slate-900/80 border border-blue-500/30 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-2xl relative flex flex-col justify-between overflow-hidden group hover:border-blue-500/60 transition-all">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500" />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 text-xs font-bold uppercase tracking-wide border border-blue-500/30">
                  <FlaskConical className="w-3.5 h-3.5 text-blue-400" />
                  Chemistry Special
                </span>
                <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/40 border border-blue-500/20 px-2.5 py-0.5 rounded-md">
                  JEE Main Pattern
                </span>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-blue-200 transition-colors">
                  Chemistry Full Mock
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 mb-5 font-medium leading-relaxed">
                Full 25-question test covering Thermodynamics, p-Block elements, Qualitative Analysis, Coordination Chemistry, and Reaction Mechanisms.
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                <div className="bg-slate-800/60 border border-white/5 rounded-xl p-2.5 text-center">
                  <div className="text-lg font-extrabold font-mono text-blue-400">25</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Questions</div>
                </div>
                <div className="bg-slate-800/60 border border-white/5 rounded-xl p-2.5 text-center">
                  <div className="text-lg font-extrabold font-mono text-indigo-400">60m</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Duration</div>
                </div>
                <div className="bg-slate-800/60 border border-white/5 rounded-xl p-2.5 text-center">
                  <div className="text-lg font-extrabold font-mono text-emerald-400">100</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Max Marks</div>
                </div>
              </div>

              <div className="text-xs text-slate-400 bg-white/5 border border-white/5 rounded-xl py-2 px-3 mb-5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pattern: 20 MCQs (+4/-1) + 5 Numericals (+4/0)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 mt-auto">
              <Link
                href="/exam/player?id=sohan-chem-mock&guest=1"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-[0_8px_20px_-4px_rgba(37,99,235,0.5)] transition-all transform hover:-translate-y-0.5 active:scale-95 border border-white/20"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Test</span>
              </Link>
              <Link
                href="/exam/player?id=sohan-chem-mock&guest=1&review=1"
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-xs border border-white/10 transition-all"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>View Solutions & Key</span>
              </Link>
            </div>
          </div>

          {/* Card 4: Work, Power & Energy Full Mock Test - NEW */}
          <div className="bg-slate-900/80 border border-violet-500/30 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-2xl relative flex flex-col justify-between overflow-hidden group hover:border-violet-500/60 transition-all">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/15 text-violet-300 text-xs font-bold uppercase tracking-wide border border-violet-500/30">
                  <Zap className="w-3.5 h-3.5 text-violet-400" />
                  Physics • High Yield
                </span>
                <span className="text-xs font-mono font-bold text-violet-400 bg-violet-950/40 border border-violet-500/20 px-2.5 py-0.5 rounded-md">
                  JEE Main & Adv
                </span>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-violet-200 transition-colors">
                  Work, Power & Energy
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 mb-5 font-medium leading-relaxed">
                25 core problems with 7 diagrams: Lennard-Jones potential, vertical circle tension & slacking, rough incline friction, spring compression, loop-the-loop, two blocks with spring, and hanging chain.
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                <div className="bg-slate-800/60 border border-white/5 rounded-xl p-2.5 text-center">
                  <div className="text-lg font-extrabold font-mono text-violet-400">25</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Questions</div>
                </div>
                <div className="bg-slate-800/60 border border-white/5 rounded-xl p-2.5 text-center">
                  <div className="text-lg font-extrabold font-mono text-purple-400">60m</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Duration</div>
                </div>
                <div className="bg-slate-800/60 border border-white/5 rounded-xl p-2.5 text-center">
                  <div className="text-lg font-extrabold font-mono text-indigo-400">100</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Max Marks</div>
                </div>
              </div>

              <div className="text-xs text-slate-400 bg-white/5 border border-white/5 rounded-xl py-2 px-3 mb-5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pattern: 20 MCQs (+4/-1) + 5 Numericals (+4/0)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 mt-auto">
              <Link
                href="/exam/player?id=sohan-wpe-mock&guest=1"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-[0_8px_20px_-4px_rgba(139,92,246,0.5)] transition-all transform hover:-translate-y-0.5 active:scale-95 border border-white/20"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Test</span>
              </Link>
              <Link
                href="/exam/player?id=sohan-wpe-mock&guest=1&review=1"
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-xs border border-white/10 transition-all"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>View Solutions & Key</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-500 border-t border-white/5 pt-6">
          StudyFAM Assessment Platform • Offline LaTeX Papers available in <code className="text-emerald-400 font-mono">sohanmock/</code>
        </div>
      </div>
    </main>
  );
}
