"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HeartHandshake, ShieldCheck, ArrowUp } from "lucide-react";

export function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      try {
        const stored = localStorage.getItem("sf_newsletter_subscribers") || "[]";
        const list = JSON.parse(stored);
        list.push({ email, date: new Date().toISOString() });
        localStorage.setItem("sf_newsletter_subscribers", JSON.stringify(list));
      } catch {}
    }
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer
      style={{
        background: "linear-gradient(180deg, #0a1c96, #060d4d)",
        color: "#ffffff",
        marginTop: "88px",
        borderRadius: "36px 36px 0 0",
      }}
      className="relative text-white overflow-hidden print:hidden"
    >
      {/* Scoped CSS for Tokko Footer Layout */}
      <style dangerouslySetInnerHTML={{ __html: `
        .tokko-foot-grid {
          max-width: 1200px;
          margin: 0 auto;
          padding: 64px 24px 28px;
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1fr;
          gap: 32px;
        }
        .tokko-foot-grid h4 {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: .1em;
          color: rgba(255, 255, 255, .55);
          margin-bottom: 16px;
          font-weight: 700;
          font-family: 'Sora', sans-serif;
        }
        .tokko-foot-grid a {
          display: block;
          font-size: 15px;
          color: rgba(255, 255, 255, .8);
          margin: 10px 0;
          text-decoration: none;
          transition: color 0.18s ease;
        }
        .tokko-foot-grid a:hover {
          color: #ffffff;
        }
        .tokko-foot-brand p {
          font-size: 15px;
          color: rgba(255, 255, 255, .68);
          margin: 16px 0;
          max-width: 320px;
          line-height: 1.5;
        }
        .tokko-news {
          display: flex;
          border-radius: 9999px;
          background: #ffffff;
          padding: 4px 6px 4px 16px;
          max-width: 340px;
          border: 1px solid rgba(255, 255, 255, .25);
          margin-top: 18px;
        }
        .tokko-news input {
          border: none;
          outline: none;
          background: transparent;
          font-size: 14px;
          flex: 1;
          color: #0B1526;
          min-width: 0;
        }
        .tokko-news input::placeholder {
          color: #7A8CA8;
        }
        .tokko-news button {
          background: #0B1526;
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          padding: 8px 18px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .tokko-news button:hover {
          background: #1A5FE0;
        }
        .tokko-foot-bottom {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
          border-top: 1px solid rgba(255, 255, 255, .12);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          font-size: 13.5px;
          color: rgba(255, 255, 255, .65);
        }
        .tokko-foot-bottom a {
          color: rgba(255, 255, 255, .8);
          margin-left: 20px;
          text-decoration: none;
          transition: color 0.18s ease;
        }
        .tokko-foot-bottom a:hover {
          color: #ffffff;
        }
        @media (max-width: 900px) {
          .tokko-foot-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 600px) {
          .tokko-foot-grid {
            grid-template-columns: 1fr;
            padding: 48px 20px 24px;
          }
          footer {
            padding-bottom: 78px;
          }
        }
      `}} />

      {/* Main Grid */}
      <div className="tokko-foot-grid">
        {/* Brand & Newsletter Column */}
        <div className="tokko-foot-brand">
          <Link href="/" aria-label="StudyFAM Home" className="inline-flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-light.png"
              alt="StudyFAM"
              style={{ height: "34px", width: "auto", objectFit: "contain" }}
            />
          </Link>
          <p>
            StudyFAM helps JEE Main 2027 aspirants practise with clarity, consistency, and purpose — free.
          </p>

          {/* Seat Alerts Form */}
          <form className="tokko-news" onSubmit={handleSubscribe}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email for seat alerts"
              aria-label="Email for seat alerts"
            />
            <button type="submit">
              {subscribed ? "✓ Joined" : "Join"}
            </button>
          </form>

          {/* Micro trust badges */}
          <div className="mt-4 space-y-1.5 text-xs text-blue-200/80 font-mono">
            <div className="flex items-center gap-1.5">
              <HeartHandshake size={13} className="text-cyan-300 shrink-0" />
              <span>₹18 of ₹27 → Escrowed Fee Support Pool</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
              <span>DPDP Act 2023 · Zero Data Monetization</span>
            </div>
          </div>
        </div>

        {/* Column 1: Mock Tests */}
        <div>
          <h4>Practice</h4>
          <Link href="/#mfts">10 Free Mocks (MFT 1–10)</Link>
          <Link href="/all-india-mock#exam-pattern">Exam Pattern (NTA 75-Q)</Link>
          <Link href="/exam">Full Mock Exam Hall</Link>
          <Link href="/#faq">Frequently Asked Questions</Link>
        </div>

        {/* Column 2: Legal & Support */}
        <div>
          <h4>Support &amp; Legal</h4>
          <Link href="/contact">Candidate Support Desk</Link>
          <Link href="/about">About StudyFam</Link>
          <Link href="/refund-policy">Cancellation &amp; Refund</Link>
          <Link href="/privacy">Privacy Policy (DPDP Act)</Link>
          <Link href="/terms">Terms of Service</Link>
        </div>

        {/* Column 3: Explore & Transparency */}
        <div>
          <h4>Explore</h4>
          <Link href="/dashboard">Candidate Dashboard</Link>
          <Link href="/all-india-mock">All-India Mock (27 Dec)</Link>
          <Link href="/scholarship-rules">Scholarship Rules &amp; Policy</Link>
          <Link href="/transparency">Escrow &amp; Audit Report</Link>
          <Link href="/admit-card">Admit Card Specimen</Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="tokko-foot-bottom">
        <span>© 2026 StudyFAM Technologies · All rights reserved · Not affiliated with NTA or TCS iON</span>
        <span className="flex items-center flex-wrap gap-y-2">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/refund-policy">Refunds</Link>
          <a
            href="#"
            onClick={scrollToTop}
            style={{ color: "#d6aef2" }}
            className="inline-flex items-center gap-1 font-semibold"
          >
            <span>Back to top</span>
            <ArrowUp size={13} />
          </a>
        </span>
      </div>
    </footer>
  );
}
