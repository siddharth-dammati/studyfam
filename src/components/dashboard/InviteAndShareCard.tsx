"use client";

import { useState } from "react";
import { Share2, Copy, Check, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function InviteAndShareCard() {
  const [copied, setCopied] = useState(false);
  const shareUrl = "https://studyfam.com";
  const shareText = "Hey! I just registered for StudyFam's All-India JEE Main Mock on 27 December 2026 (9 AM – 12 PM) for ₹27. Top rankers win 100% of their official NTA exam fees! Join here:";

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`, "_blank");
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/10 rounded-full text-xs font-mono font-bold tracking-wider uppercase mb-4">
          <Share2 size={12} className="text-indigo-300" />
          <span>Invite Classmates</span>
        </div>

        <h3 className="text-xl font-bold tracking-tight mb-2">
          Grow the Pool. Expand the Winners.
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 max-w-lg">
          For every student that joins, ₹18 goes straight into the Scholarship Pool. Share with your study group or coaching classmates so more top rankers get 100% of their official JEE fees funded!
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            <MessageSquare size={16} />
            <span>Share on WhatsApp</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold transition-colors"
          >
            {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            <span>{copied ? "Link Copied!" : "Copy Invite Link"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
