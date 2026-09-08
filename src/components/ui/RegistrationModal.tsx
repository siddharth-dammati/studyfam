"use client";

import { X } from "lucide-react";
import { Button } from "./Button";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isMockOpen: boolean;
}

export function RegistrationModal({ isOpen, onClose, isMockOpen }: Props) {
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-white/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-white border border-[var(--border)] rounded-[24px] shadow-[var(--shadow-lg)] p-8 overflow-hidden transform transition-all">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <X size={20} />
        </button>

        <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2 tracking-tight">
          {isMockOpen ? "Complete Registration" : "Join Waitlist"}
        </h3>
        <p className="text-sm text-[var(--foreground-secondary)] mb-8 font-medium">
          {isMockOpen 
            ? "Enter your details to secure your spot for ₹27." 
            : "Get notified as soon as registrations open."}
        </p>

        {step === 1 ? (
          <form 
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (isMockOpen) setStep(2);
              else {
                alert("You are on the list! We will notify you.");
                onClose();
              }
            }}
          >
            <div>
              <label className="block text-xs font-bold text-[var(--foreground-secondary)] uppercase tracking-wider mb-2">Full Name</label>
              <input required type="text" className="w-full bg-[var(--background-soft)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors" placeholder="Aman Kumar" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--foreground-secondary)] uppercase tracking-wider mb-2">Email</label>
              <input required type="email" className="w-full bg-[var(--background-soft)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors" placeholder="aman@example.com" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--foreground-secondary)] uppercase tracking-wider mb-2">Mobile Number</label>
              <input required type="tel" className="w-full bg-[var(--background-soft)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors" placeholder="+91 XXXXX XXXXX" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--foreground-secondary)] uppercase tracking-wider mb-2">JEE Status</label>
              <select required className="w-full bg-[var(--background-soft)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors appearance-none">
                <option value="" disabled selected>Select status...</option>
                <option value="class-11">Class 11 (2027 Aspirant)</option>
                <option value="class-12">Class 12</option>
                <option value="dropper">Dropper</option>
              </select>
            </div>
            <div className="pt-4">
              <Button type="submit" size="lg" className="w-full">
                {isMockOpen ? "Continue to Payment (₹27)" : "Notify Me"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-[var(--background-subtle)] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-[var(--accent)]">
              ₹27
            </div>
            <p className="text-[var(--foreground-secondary)] mb-8 font-medium">
              Payment Gateway Integration (Razorpay/PayU etc.) will be embedded here.
            </p>
            <Button size="lg" className="w-full" variant="secondary" onClick={() => setStep(1)}>
              Go Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
