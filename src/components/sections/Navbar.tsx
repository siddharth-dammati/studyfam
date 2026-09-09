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
      if (storedRecord) {
        try {
          const rec = JSON.parse(storedRecord);
          if (profile?.email) {
            setIsEnrolled(rec?.email?.toLowerCase() === profile.email.toLowerCase());
          } else {
            setIsEnrolled(Boolean(storedOrder || rec.order_id || rec.amount_paid >= 27));
          }
          return;
        } catch {}
      }
      setIsEnrolled(false);
    }
  }, [profile?.email]);

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
    <header className="sticky top-3 left-0 right-0 z-40 flex justify-center px-4 pt-3 pointer-events-none">
      <nav
        className={cn(
          "w-full max-w-[1100px] figma-nav transition-all duration-300 pointer-events-auto",
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
              {profile && (
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
              )}

              {isEnrolled ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
                >
                  <span>Enter Dashboard →</span>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard"
                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <span className="pill pill-indigo">₹27 Only</span>
                  <Button size="md" onClick={onOpenRegistration}>
                    {isOpen ? "Register — ₹27" : "Opens Oct 20"}
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Actions & Toggle */}
            <div className="flex md:hidden items-center gap-2 shrink-0">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs transition-transform active:scale-95"
              >
                <span>Enter Dashboard</span>
              </Link>

              <button
                className="p-2 rounded-[10px] text-[var(--text-secondary)] hover:bg-[var(--surface-1)] hover:text-[var(--text-primary)] transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[var(--border)] px-4 py-4 space-y-2 bg-white rounded-b-[28px]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-1)] rounded-[10px] transition-all"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-3 border-t border-[var(--border)] mt-2 space-y-2">
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
                  <GoogleSignInButton size="medium" width={260} shape="pill" />
                </div>
              )}

              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-center py-2.5 px-4 bg-indigo-600 text-white font-bold rounded-xl text-xs shadow-xs hover:bg-indigo-700 transition-colors"
              >
                Enter Candidate Dashboard →
              </Link>

              {!isEnrolled && (
                <Button
                  size="md"
                  className="w-full"
                  onClick={() => { setMobileOpen(false); onOpenRegistration(); }}
                >
                  {isOpen ? "Register for Mock — ₹27" : "Opens Oct 20"}
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
