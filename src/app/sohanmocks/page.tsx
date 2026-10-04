import type { Metadata } from "next";
import Link from "next/link";
import { Play, Clock, Award, CheckCircle2, Lock, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "JEE Main Chemistry Mock Test — Sohan Mocks",
  description: "Unlisted JEE Main Chemistry full mock test with 25 questions and 60-minute timer. Start immediately without login.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SohanMocksPage() {
  return (
    <main className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-radial from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1.2px,transparent_1.8px)] [background-size:28px_28px] pointer-events-none -z-10" />

      <div className="w-full max-w-xl mx-auto">
        {/* Main Mock Card */}
        <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-6">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Sohan Mocks • Unlisted Access</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3 leading-tight">
            Chemistry Mock Test
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mb-8 font-medium">
            Full 25-question JEE Main pattern test on the authentic TCS iON CBT exam player.
          </p>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-slate-800/60 border border-white/5 rounded-2xl p-3.5">
              <div className="text-2xl font-extrabold font-mono text-blue-400">25</div>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mt-1">Questions</div>
            </div>
            <div className="bg-slate-800/60 border border-white/5 rounded-2xl p-3.5">
              <div className="text-2xl font-extrabold font-mono text-purple-400">60m</div>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mt-1">Duration</div>
            </div>
            <div className="bg-slate-800/60 border border-white/5 rounded-2xl p-3.5">
              <div className="text-2xl font-extrabold font-mono text-emerald-400">100</div>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mt-1">Max Marks</div>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-300 bg-white/5 border border-white/5 rounded-xl py-2.5 px-4 mb-8">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>No login required • Free guest access with instant diagnostics</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3.5">
            <Link
              href="/exam/player?id=sohan-chem-mock&guest=1"
              className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-[0_12px_28px_-6px_rgba(37,99,235,0.6)] hover:shadow-[0_16px_36px_-6px_rgba(37,99,235,0.8)] transition-all transform hover:-translate-y-0.5 active:scale-95 border border-white/20"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start Mock Test</span>
            </Link>

            <Link
              href="/exam/player?id=sohan-chem-mock&guest=1&review=1"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-sm border border-white/10 transition-all"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>View Solutions & Diagnostic Key</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-8">
          StudyFAM Assessment Platform • Unlisted
        </p>
      </div>
    </main>
  );
}
