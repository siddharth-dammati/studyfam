"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, LogOut, ShieldCheck } from "lucide-react";

export function DashboardHeader() {
  const { profile, signOut } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Back Link & Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Site</span>
          </Link>
          <div className="h-4 w-px bg-slate-200" />
          <Link href="/" className="flex items-center">
            <Logo className="h-7 shrink-0" textClassName="text-base" />
          </Link>
        </div>

        {/* Right: Candidate Profile & Sign Out */}
        {profile && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs text-emerald-800 font-medium">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Verified Student</span>
            </div>

            <div className="flex items-center gap-2">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="w-8 h-8 rounded-full border border-slate-200 shadow-xs"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {profile.fullName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight max-w-[140px] truncate">
                  {profile.fullName}
                </div>
                <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
                  {profile.email}
                </div>
              </div>
            </div>

            <button
              onClick={signOut}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}

      </div>
    </header>
  );
}
