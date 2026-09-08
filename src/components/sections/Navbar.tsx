"use client";

import { useRegistrationState } from "@/hooks/useRegistrationState";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";
import { Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Navbar({ onOpenRegistration }: { onOpenRegistration: () => void }) {
  const { isOpen } = useRegistrationState();
  const { profile, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Why This Mock", href: "#why-mock" },
    { label: "Exam Pattern", href: "#exam-pattern" },
    { label: "Impact", href: "#impact" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={cn(
          "w-full max-w-[1100px] figma-nav transition-all duration-300",
          scrolled ? "shadow-[var(--shadow-md)]" : "shadow-[var(--shadow-sm)]"
        )}
      >
        <div className="px-4 sm:px-6">
          <div className="flex h-[58px] items-center justify-between gap-4">

            {/* Logo */}
            <Link href="/" aria-label="Home" className="flex items-center">
              <Logo className="h-8 shrink-0" textClassName="text-lg" />
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3.5 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-1)] rounded-[10px] transition-all duration-150"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              {profile ? (
                <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-full">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt={profile.fullName} className="w-6 h-6 rounded-full" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                      {profile.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-slate-800 max-w-[110px] truncate">
                    {profile.fullName.split(" ")[0]}
                  </span>
                  <button
                    onClick={signOut}
                    title="Sign Out"
                    className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200 transition-colors"
                  >
                    <LogOut size={13} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Sign in</span>
                </button>
              )}

              <span className="pill pill-indigo">₹27 Only</span>
              <Button size="md" onClick={onOpenRegistration}>
                {isOpen ? "Register — ₹27" : "Opens Nov 27"}
              </Button>
            </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden p-2 rounded-[10px] text-[var(--text-secondary)] hover:bg-[var(--surface-1)] hover:text-[var(--text-primary)] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[var(--border)] px-4 py-4 space-y-1 bg-white rounded-b-[28px]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-1)] rounded-[10px] transition-all"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-[var(--border)] mt-3 space-y-2">
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
                <button
                  onClick={() => { setMobileOpen(false); signInWithGoogle(); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              )}

              <Button
                size="md"
                className="w-full"
                onClick={() => { setMobileOpen(false); onOpenRegistration(); }}
              >
                {isOpen ? "Register — ₹27" : "Opens Nov 27"}
              </Button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
