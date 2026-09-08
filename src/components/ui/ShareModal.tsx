"use client";

import { X, Copy, Check, MessageCircle } from "lucide-react";
import { Button } from "./Button";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isMockOpen: boolean;
}

export function ShareModal({ isOpen, onClose, isMockOpen }: Props) {
  const [copied, setCopied] = useState(false);
  const shareUrl = "https://studyfam.com/mock-2027";
  
  const shareText = isMockOpen 
    ? "I just registered for the StudyFam JEE Main 2027 All India Mock. It's only ₹27 and everyone takes the same paper. Let's see who scores higher!"
    : "I just joined the waitlist for the StudyFam JEE Main 2027 All India Mock. It's only ₹27 and designed to give us a real national benchmark. Join me!";

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-white/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-[24px] shadow-2xl p-8 overflow-hidden">
        {/* Themed Header Banner */}
        <div className="relative -mx-8 -mt-8 mb-6 p-6 overflow-hidden bg-[#070E22] border-b border-cyan-500/20">
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
              Compete · Improve · Impact
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Challenge Study Groups
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Invite your peers to take the All-India Mock and expand the scholarship pool.
            </p>
          </div>
        </div>

        <div className="bg-[var(--background-soft)] border border-[var(--border)] rounded-xl p-4 mb-6 relative group">
          <p className="text-sm text-[var(--foreground)] pr-8 italic">&quot;{shareText}&quot;</p>
          <div className="mt-3 text-xs text-[var(--accent)] font-bold">{shareUrl}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button size="md" variant="secondary" onClick={handleCopy} className="flex gap-2">
            {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
            {copied ? "Copied ✓" : "Copy Link"}
          </Button>
          <Button size="md" onClick={handleWhatsApp} className="flex gap-2 bg-[#25D366] hover:bg-[#20bd5a] shadow-[#25D366]/20">
            <MessageCircle size={18} />
            WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}
