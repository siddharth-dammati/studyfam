"use client";

import { X, Copy, Check, MessageCircle, Send } from "lucide-react";
import { Button } from "./Button";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isMockOpen?: boolean;
}

export function ShareModal({ isOpen, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const shareUrl = "https://studyfam.com";
  
  const shareText =
    "Take the StudyFam All-India JEE Main Mock on 27 Dec 2026 for ₹27! Rank on top of the list to win 100% of your official NTA JEE application fees paid back (₹1,000 for Boys / ₹800 for Girls). Compete nationwide and win your exam fees:";

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`,
      "_blank"
    );
  };

  const handleTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-[28px] shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Themed Header Banner */}
        <div className="relative -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-6 p-6 overflow-hidden bg-[#070E22] border-b border-cyan-500/20">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-45 mix-blend-screen pointer-events-none"
            style={{ backgroundImage: "url('/footer-theme-bg.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050D24]/80 to-[#040814]/95 pointer-events-none" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-20"
          >
            <X size={18} />
          </button>

          <div className="relative z-10">
            <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-300 uppercase block mb-1">
              Top Rankers Win 100% Exam Fees
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Challenge & Win Your JEE Fees
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Invite your coaching peers. Compete on the same All-India Mock, and top performers win 100% of their official NTA JEE Main fees funded!
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 mb-6 relative group">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium italic">
            &quot;{shareText}&quot;
          </p>
          <div className="mt-3 text-xs text-indigo-600 font-mono font-bold">
            {shareUrl}
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              <MessageCircle size={16} />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleTelegram}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-[#229ED9] hover:bg-[#1d8bc0] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              <Send size={16} />
              <span>Telegram</span>
            </button>
          </div>

          <Button size="md" variant="secondary" onClick={handleCopy} className="w-full flex items-center justify-center gap-2">
            {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
            <span>{copied ? "Copied Share Text & Link ✓" : "Copy Share Link & Text"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
