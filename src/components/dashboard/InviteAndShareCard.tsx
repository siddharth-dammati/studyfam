"use client";

import { useState } from "react";
import { Share2, Copy, Check, MessageSquare, Send, Trophy } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function InviteAndShareCard() {
  const [copied, setCopied] = useState(false);
  const shareUrl = "https://studyfam.com";
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
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/10 rounded-full text-xs font-mono font-bold tracking-wider uppercase mb-4">
          <Trophy size={12} className="text-amber-300" />
          <span>Top Rankers Win Full Exam Fees</span>
        </div>

        <h3 className="text-xl font-bold tracking-tight mb-2">
          Compete on the All-India Mock & Win Your Fees
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 max-w-lg">
          Top performers on the All-India Mock leaderboard receive 100% of their official NTA JEE Main application fees refunded (₹1,000 for Boys / ₹800 for Girls). Invite your study groups and coaching friends to see who ranks on top of the list!
        </p>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            <MessageSquare size={15} />
            <span>Share on WhatsApp</span>
          </button>

          <button
            onClick={handleTelegram}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#229ED9] hover:bg-[#1d8bc0] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            <Send size={15} />
            <span>Telegram</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold transition-colors"
          >
            {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
            <span>{copied ? "Copied Link & Text!" : "Copy Share Link"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
