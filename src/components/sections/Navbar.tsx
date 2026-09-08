"use client";

import { useRegistrationState } from "@/hooks/useRegistrationState";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Navbar({ onOpenRegistration }: { onOpenRegistration: () => void }) {
  const { isOpen } = useRegistrationState();
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
            <div className="pt-3 border-t border-[var(--border)] mt-3">
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
