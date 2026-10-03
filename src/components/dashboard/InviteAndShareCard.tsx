"use client";

import { useState } from "react";
import { Share2, Copy, Check, MessageSquare, Send, Trophy } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function InviteAndShareCard() {
  const [copied, setCopied] = useState(false);
  const shareUrl = "https://studyfam.in";
  const shareText =
    "Take the StudyFam All-India JEE Main Mock on 27 Dec 2026 (9 AM – 12 PM) for ₹27! If you rank on top of the list, you win 100% of your official NTA JEE Main application fees paid back (₹1,000 for Boys / ₹800 for Girls). See if you can top the national leaderboard:";

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`, "_blank");
  };

  const handleTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, "_blank");
  };

  return (
    <div className="bg-gradient-to-br from-[#081680] via-[#0a1c96] to-[#1a5fe0] text-white rounded-[32px] p-6 sm:p-8 shadow-[0_20px_50px_-20px_rgba(10,28,150,0.35)] relative overflow-hidden">
      {/* Subtle dot matrix overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 -z-0"
        style={{
          backgroundImage: "radial-gradient(rgba(214,174,242,.3) 1.2px, transparent 1.8px)",
          backgroundSize: "16px 16px",
        }}
      />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-xs border border-white/15 rounded-full text-xs font-mono font-bold tracking-wider uppercase mb-3">
          <Trophy size={13} className="text-amber-300" />
          <span>Top Rankers Win 100% Exam Fees</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-2 text-white">
          Compete on the All-India Mock &amp; Win Your Fees
        </h3>
        <p className="text-xs sm:text-sm text-blue-100 leading-relaxed mb-6 max-w-lg">
          Top performers on the All-India Mock leaderboard receive 100% of their official NTA JEE Main application fees refunded (₹1,000 for Boys / ₹800 for Girls). Invite your study groups and coaching friends to see who ranks on top of the list!
        </p>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full text-xs font-semibold transition-all shadow-xs cursor-pointer hover:-translate-y-0.5 active:scale-95"
          >
            <MessageSquare size={14} />
            <span>Share on WhatsApp</span>
          </button>

          <button
            onClick={handleTelegram}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#229ED9] hover:bg-[#1d8bc0] text-white rounded-full text-xs font-semibold transition-all shadow-xs cursor-pointer hover:-translate-y-0.5 active:scale-95"
          >
            <Send size={14} />
            <span>Telegram</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white border border-white/20 rounded-full text-xs font-semibold transition-all cursor-pointer hover:-translate-y-0.5 active:scale-95"
          >
            {copied ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}
            <span>{copied ? "Copied Link & Text!" : "Copy Share Link"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
