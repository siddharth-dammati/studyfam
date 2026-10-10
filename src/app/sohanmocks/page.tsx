import type { Metadata } from "next";
import Link from "next/link";
import { Play, Clock, Award, CheckCircle2, Lock, FileText, Zap, Sparkles, Orbit, FlaskConical } from "lucide-react";

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

      <div className="w-full max-w-5xl mx-auto">
        {/* Hub Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Sohan Mocks • Unlisted Testing Hub</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Sohan Mocks Series
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Curated JEE Advanced and Main mock tests. Experience authentic TCS iON CBT simulation with instant diagnostics and step-by-step solutions.
          </p>
        </div>

        {/* Mock Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
          
          {/* Card 1: Gravitation (Very Hard Mock Test) */}
          <div className="bg-slate-900/80 border border-amber-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative flex flex-col justify-between overflow-hidden group hover:border-amber-500/60 transition-all">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold uppercase tracking-wide border border-amber-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Physics Special • Very Hard
                </span>
                <span className="text-xs font-mono font-bold text-red-400 bg-red-950/40 border border-red-500/20 px-2.5 py-0.5 rounded-md">
                  JEE Advanced
                </span>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Orbit className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-black text-white group-hover:text-amber-200 transition-colors">
                  Gravitation Mock Test
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 mb-6 font-medium leading-relaxed">
                25 ultra-hard problems: Kepler elliptical orbits, variable density profiles, chord tunnel SHM, cavity field superposition, Hohmann transfers, and self-gravitational binding energy.
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2.5 mb-6">
                <div className="bg-slate-800/60 border border-white/5 rounded-xl p-3 text-center">
                  <div className="text-xl font-extrabold font-mono text-amber-400">25</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Questions</div>
                </div>
                <div className="bg-slate-800/60 border border-white/5 rounded-xl p-3 text-center">
                  <div className="text-xl font-extrabold font-mono text-orange-400">60m</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Duration</div>
                </div>
                <div className="bg-slate-800/60 border border-white/5 rounded-xl p-3 text-center">
                  <div className="text-xl font-extrabold font-mono text-red-400">100</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Max Marks</div>
                </div>
              </div>

              <div className="text-xs text-slate-400 bg-white/5 border border-white/5 rounded-xl py-2 px-3 mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pattern: 20 MCQs (+4/-1) + 5 Integer Numericals (+4/0)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 mt-auto">
              <Link
                href="/exam/player?id=sohan-gravitation-mock&guest=1"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm shadow-[0_8px_20px_-4px_rgba(217,119,6,0.5)] transition-all transform hover:-translate-y-0.5 active:scale-95 border border-white/20"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Gravitation Test</span>
              </Link>
              <Link
                href="/exam/player?id=sohan-gravitation-mock&guest=1&review=1"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-xs border border-white/10 transition-all"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>View Step-by-Step Solutions</span>
              </Link>
            </div>
          </div>

          {/* Card 2: Chemistry Full Mock Test */}
          <div className="bg-slate-900/80 border border-blue-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative flex flex-col justify-between overflow-hidden group hover:border-blue-500/60 transition-all">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500" />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 text-xs font-bold uppercase tracking-wide border border-blue-500/30">
                  <FlaskConical className="w-3.5 h-3.5 text-blue-400" />
                  Major Test 02 • Chemistry
                </span>
                <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/40 border border-blue-500/20 px-2.5 py-0.5 rounded-md">
                  JEE Main Pattern
                </span>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-black text-white group-hover:text-blue-200 transition-colors">
                  Chemistry Mock Test
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 mb-6 font-medium leading-relaxed">
                Full 25-question Chemistry test covering Thermodynamics, p-Block elements, Qualitative Analysis, Coordination Chemistry, and Reaction Mechanisms.
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2.5 mb-6">
                <div className="bg-slate-800/60 border border-white/5 rounded-xl p-3 text-center">
                  <div className="text-xl font-extrabold font-mono text-blue-400">25</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Questions</div>
                </div>
                <div className="bg-slate-800/60 border border-white/5 rounded-xl p-3 text-center">
                  <div className="text-xl font-extrabold font-mono text-indigo-400">60m</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Duration</div>
                </div>
                <div className="bg-slate-800/60 border border-white/5 rounded-xl p-3 text-center">
                  <div className="text-xl font-extrabold font-mono text-emerald-400">100</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Max Marks</div>
                </div>
              </div>

              <div className="text-xs text-slate-400 bg-white/5 border border-white/5 rounded-xl py-2 px-3 mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pattern: 20 MCQs (+4/-1) + 5 Integer Numericals (+4/0)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 mt-auto">
              <Link
                href="/exam/player?id=sohan-chem-mock&guest=1"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-[0_8px_20px_-4px_rgba(37,99,235,0.5)] transition-all transform hover:-translate-y-0.5 active:scale-95 border border-white/20"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Chemistry Test</span>
              </Link>
              <Link
                href="/exam/player?id=sohan-chem-mock&guest=1&review=1"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-xs border border-white/10 transition-all"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>View Step-by-Step Solutions</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-500 border-t border-white/5 pt-6">
          StudyFAM Assessment Platform • Offline LaTeX Paper available in <code className="text-amber-400 font-mono">sohanmock/Gravitation_JEE_Advanced_Hard_Test.tex</code>
        </div>
      </div>
    </main>
  );
}
