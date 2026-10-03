"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, LogOut, ShieldCheck } from "lucide-react";

export function DashboardHeader() {
  const { profile, signOut } = useAuth();

  return (
    <header className="border-b border-[rgba(26,26,26,0.08)] bg-[#fafafa]/85 backdrop-blur-xl sticky top-0 z-50 transition-all">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Back Link & Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-[rgba(26,26,26,0.08)] hover:border-[#1a5fe0]/40 px-3.5 py-1.5 rounded-full shadow-2xs transition-all active:scale-95"
          >
            <ArrowLeft size={14} className="text-slate-500" />
            <span>Back to Site</span>
          </Link>
          <div className="h-4 w-px bg-slate-200/80 hidden sm:block" />
          <Link href="/" className="flex items-center group">
            <Logo className="h-7 shrink-0 transition-transform group-hover:scale-[1.02]" textClassName="text-base" />
          </Link>
        </div>

        {/* Right: Candidate Profile & Sign Out */}
        {profile && (
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/admit-card"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-[#f3e9fd] hover:bg-[#ecd8fc] border border-[#d6aef2]/70 rounded-full text-xs text-[#7c3aed] font-semibold transition-all shadow-2xs active:scale-95"
              title="View & Print Official E-Admit Card"
            >
              <span>🎟️ Hall Ticket</span>
            </Link>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-[#dcfce7] border border-[#86efac]/80 rounded-full text-xs text-[#16a34a] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse" />
              <span>Verified Student</span>
            </div>

            <div className="flex items-center gap-2 pl-1">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="w-8 h-8 rounded-full border-2 border-white shadow-xs ring-1 ring-slate-200/80"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0a1c96] to-[#1a5fe0] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {profile.fullName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight max-w-[140px] truncate">
                  {profile.fullName}
                </div>
                <div className="text-[10px] text-slate-500 truncate max-w-[140px] font-mono">
                  {profile.email}
                </div>
              </div>
            </div>

            <button
              onClick={signOut}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 border border-[rgba(26,26,26,0.08)] rounded-full transition-all cursor-pointer active:scale-95"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}

      </div>
    </header>
  );
}
