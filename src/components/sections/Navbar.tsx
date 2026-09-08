"use client";

import { useRegistrationState } from "@/hooks/useRegistrationState";
import { useAuth } from "@/hooks/useAuth";
import { GoogleSignInButton } from "@/components/ui/GoogleSignInButton";
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
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOrder = localStorage.getItem("sf_confirmed_order_id");
      const storedRecord = localStorage.getItem("sf_candidate_record");
      if (storedOrder || storedRecord) {
        setIsEnrolled(true);
      }
    }
  }, []);

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
                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard"
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <span>Dashboard</span>
                  </Link>

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
                </div>
              ) : (
                <GoogleSignInButton size="medium" shape="pill" />
              )}

              {isEnrolled ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/admit-card"
                    className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-all border border-slate-200/80"
                  >
                    <span>Admit Slip</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
                  >
                    <span>✓ Seat Confirmed · Dashboard</span>
                  </Link>
                </div>
              ) : (
                <>
                  <span className="pill pill-indigo">₹27 Only</span>
                  <Button size="md" onClick={onOpenRegistration}>
                    {isOpen ? "Register — ₹27" : "Opens Nov 27"}
                  </Button>
                </>
              )}
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
                <div className="space-y-2">
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
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="w-full flex items-center justify-center py-2.5 px-4 bg-indigo-50 text-indigo-700 font-bold rounded-xl text-xs hover:bg-indigo-100 transition-colors"
                  >
                    Go to Candidate Dashboard →
                  </Link>
                  {isEnrolled && (
                    <Link
                      href="/admit-card"
                      onClick={() => setMobileOpen(false)}
                      className="w-full flex items-center justify-center py-2.5 px-4 bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold rounded-xl text-xs hover:bg-emerald-100 transition-colors"
                    >
                      📄 View & Print Admit Slip
                    </Link>
                  )}
                </div>
              ) : (
                <div className="flex justify-center w-full">
                  <GoogleSignInButton size="large" width={280} shape="rectangular" />
                </div>
              )}

              {isEnrolled ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="w-full flex items-center justify-center py-2.5 px-4 bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  ✓ Mock Seat Confirmed · Dashboard →
                </Link>
              ) : (
                <Button
                  size="md"
                  className="w-full"
                  onClick={() => { setMobileOpen(false); onOpenRegistration(); }}
                >
                  {isOpen ? "Register — ₹27" : "Opens Nov 27"}
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
