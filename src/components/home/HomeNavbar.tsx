"use client";

import { useAuth } from "@/hooks/useAuth";
import { GoogleSignInButton } from "@/components/ui/GoogleSignInButton";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";
import { Menu, X, LogOut, Trophy, Sparkles, BookOpen, Layers, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function HomeNavbar() {
  const { profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "10 Free Mocks", href: "#free-mocks", highlight: true },
    { label: "All-India Mock (27 Dec)", href: "#all-india-mock", badge: "Win Fees" },
    { label: "Special Features", href: "#special-features" },
    { label: "300+ Chapter Tests", href: "/exam" },
    { label: "Pattern & Weightage", href: "#pattern" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header className="sticky top-3 left-0 right-0 z-50 flex justify-center px-3 sm:px-4 pt-1 pointer-events-none">
      <nav
        className={cn(
          "w-full max-w-[1240px] transition-all duration-300 pointer-events-auto rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5",
          "bg-white/95 backdrop-blur-xl border border-slate-200/90 text-slate-800",
          scrolled
            ? "shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-slate-300/80 py-2"
            : "shadow-[0_4px_20px_rgb(0,0,0,0.04)]"
        )}
      >
        <div className="flex h-11 items-center justify-between gap-3">

          {/* Brand Logo with Free CBT badge */}
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="StudyFam Free JEE Mocks Home" className="flex items-center">
              <Logo inverted={false} className="h-7 sm:h-8 shrink-0" />
            </Link>
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono font-bold uppercase tracking-wider">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-600" />
              </span>
              <span>Free CBT Portal</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5",
                  link.highlight
                    ? "text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50/80"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                )}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200 px-1.5 py-0.2 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            {profile ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 p-1 pr-2.5 rounded-full bg-slate-100 border border-slate-200 text-xs">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt={profile.fullName} className="w-6 h-6 rounded-full" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                      {profile.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-semibold text-slate-800 max-w-[85px] truncate">
                    {profile.fullName.split(" ")[0]}
                  </span>
                  <button
                    onClick={signOut}
                    title="Sign Out"
                    className="text-slate-400 hover:text-red-600 p-0.5 rounded-full hover:bg-slate-200 transition-colors"
                  >
                    <LogOut size={13} />
                  </button>
                </div>
                <Link
                  href="/dashboard"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <GoogleSignInButton size="medium" shape="pill" theme="outline" />
                <Link
                  href="/dashboard"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Dashboard
                </Link>
              </div>
            )}

            <a
              href="#free-mocks"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold shadow-xs hover:shadow transition-all active:scale-95"
            >
              <span>Take Free Mock</span>
              <ArrowRight size={13} />
            </a>
          </div>

          {/* Mobile Actions & Toggle */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <a
              href="#free-mocks"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white font-bold rounded-full text-xs shadow-xs transition-transform active:scale-95"
            >
              <span>Free Mocks</span>
            </a>

            <button
              className="p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-200/90 px-2 py-4 mt-2 space-y-1.5 bg-white rounded-2xl shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl transition-all"
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}

            <div className="pt-3 border-t border-slate-200 mt-2 space-y-2.5">
              {profile ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    {profile.avatarUrl ? (
                      <img src={profile.avatarUrl} alt={profile.fullName} className="w-7 h-7 rounded-full" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                        {profile.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-slate-800">{profile.fullName}</span>
                  </div>
                  <button
                    onClick={() => { setMobileOpen(false); signOut(); }}
                    className="text-xs text-red-600 font-semibold hover:underline flex items-center gap-1"
                  >
                    <LogOut size={12} /> Sign out
                  </button>
                </div>
              ) : (
                <div className="flex justify-center w-full py-1">
                  <GoogleSignInButton size="medium" width={260} shape="pill" theme="outline" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="w-full flex items-center justify-center py-2.5 px-3 bg-slate-100 text-slate-800 font-bold rounded-xl text-xs hover:bg-slate-200 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/all-india-mock"
                  onClick={() => setMobileOpen(false)}
                  className="w-full flex items-center justify-center py-2.5 px-3 bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold rounded-xl text-xs hover:bg-indigo-100 transition-colors"
                >
                  All-India Mock
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
