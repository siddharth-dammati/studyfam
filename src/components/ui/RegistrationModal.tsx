"use client";

import { X, CheckCircle2, Loader2, ShieldCheck, ArrowRight, Copy, Check, Sparkles } from "lucide-react";
import { Button } from "./Button";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { createCashfreeOrder, verifyCashfreeOrder } from "@/services/paymentService";
import { openCashfreeCheckout } from "@/utils/cashfree";
import Link from "next/link";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isMockOpen: boolean;
}

export function RegistrationModal({ isOpen, onClose, isMockOpen }: Props) {
  const { profile } = useAuth();
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [jeeStatus, setJeeStatus] = useState<"class-11" | "class-12" | "dropper">("class-11");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Processing...");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [registeredId, setRegisteredId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (profile) {
      if (profile.fullName && !fullName) setFullName(profile.fullName);
      if (profile.email && !email) setEmail(profile.email);
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Basic phone validation (at least 10 digits)
    const cleanDigits = phone.replace(/\D/g, "");
    if (cleanDigits.length < 10) {
      setErrorMsg("Please enter a valid 10-digit WhatsApp or mobile number.");
      return;
    }

    setLoading(true);

    try {
      // 1. If mock is open, process Cashfree payment (₹27)
      if (isMockOpen) {
        setLoadingText("Initializing Cashfree Gateway...");

        const orderRes = await createCashfreeOrder({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: cleanDigits.slice(-10),
          jeeStatus,
        });

        if (!orderRes.success || !orderRes.order_id) {
          setErrorMsg(orderRes.error || "Unable to initiate payment session. Please try again.");
          setLoading(false);
          return;
        }

        setOrderId(orderRes.order_id);

        // A. If payment session exists, open Cashfree checkout modal
        if (orderRes.payment_session_id) {
          setLoadingText("Opening Payment Modal...");
          const checkoutRes = await openCashfreeCheckout(orderRes.payment_session_id);

          setLoadingText("Verifying Payment Status...");
          const verifyRes = await verifyCashfreeOrder(orderRes.order_id);

          if (verifyRes.success && verifyRes.status === "PAID") {
            setRegisteredId(verifyRes.registration_id || orderRes.order_id);
            if (verifyRes.payment_id) setPaymentId(verifyRes.payment_id);
            setStep(3); // Success receipt
          } else if (checkoutRes.error) {
            setErrorMsg(checkoutRes.error.message || "Payment cancelled or incomplete. You can retry anytime.");
          } else {
            setErrorMsg("Payment verification pending. If money was debited, your enrollment will update shortly.");
          }
        } 
        // B. Simulation / Dev Fallback mode
        else if (orderRes.is_simulation) {
          setLoadingText("Confirming Test Enrollment...");
          const verifyRes = await verifyCashfreeOrder(orderRes.order_id);
          setRegisteredId(verifyRes.registration_id || orderRes.order_id);
          if (verifyRes.payment_id) setPaymentId(verifyRes.payment_id);
          setStep(3);
        } else {
          setErrorMsg("No active payment session returned from gateway.");
        }
      } 
      // 2. Waitlist mode (Free)
      else {
        setLoadingText("Saving waitlist spot...");
        const supabase = createClient();
        const newId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : undefined;

        const payload: Record<string, any> = {
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: cleanDigits.slice(-10),
          jee_status: jeeStatus,
          status: "waitlist",
          amount_paid: 0,
        };
        if (newId) payload.id = newId;

        const { error } = await supabase.from("registrations").insert([payload]);

        if (error) {
          setErrorMsg(error.message || "Unable to save registration. Please try again.");
          setLoading(false);
          return;
        }

        setRegisteredId(newId || "WAITLIST_CONFIRMED");
        setStep(3);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setFullName("");
    setEmail("");
    setPhone("");
    setJeeStatus("class-11");
    setErrorMsg(null);
    setRegisteredId(null);
    setOrderId(null);
    setPaymentId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={handleReset}
      />
      
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-[28px] shadow-2xl p-6 sm:p-8 overflow-hidden transform transition-all">
        <button 
          onClick={handleReset}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X size={20} />
        </button>

        {step === 3 ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={13} />
              <span>{isMockOpen ? "Payment Verified · Seat Confirmed" : "Waitlist Spot Secured"}</span>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
              {isMockOpen ? "Registration Confirmed!" : "You're on the Waitlist!"}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
              {isMockOpen 
                ? "Your seat for the All-India Mock Test on 27 December 2026 (9:00 AM - 12:00 PM) is officially locked in."
                : "Thank you for joining. We will notify you via WhatsApp and Email the moment mock test slots open."}
            </p>

            {/* Payment & Candidate Receipt */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 mb-5 text-left text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Candidate Name</span>
                <span className="font-semibold text-slate-900">{fullName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Amount Paid</span>
                <span className="font-bold text-emerald-700">{isMockOpen ? "₹27.00 (Cashfree PG)" : "₹0.00 (Waitlist)"}</span>
              </div>
              {orderId && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Order ID</span>
                  <span className="font-mono text-slate-700">{orderId}</span>
                </div>
              )}
              {paymentId && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Payment ID</span>
                  <span className="font-mono text-slate-700">{paymentId}</span>
                </div>
              )}
              {registeredId && (
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-mono font-bold text-slate-400">Reference ID</div>
                    <div className="font-mono text-xs font-semibold text-slate-900">{registeredId.slice(0, 18)}...</div>
                  </div>
                  <button
                    onClick={() => handleCopy(registeredId)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg transition-colors"
                    title="Copy Ref ID"
                  >
                    {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Link href="/dashboard" onClick={handleReset} className="block w-full">
                <Button size="lg" className="w-full flex items-center justify-center gap-2">
                  <span>Go to Candidate Dashboard</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <button
                onClick={handleReset}
                className="text-xs text-slate-500 hover:text-slate-700 font-medium py-2"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                {isMockOpen ? "Complete Registration" : "Join Official Waitlist"}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mb-5 font-medium">
              {isMockOpen 
                ? "Pay ₹27 via UPI, Cards, or Netbanking to lock your All-India Mock seat." 
                : "Get notified as soon as registrations open."}
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 leading-relaxed">
                {errorMsg}
              </div>
            )}

            {profile ? (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-emerald-900 font-medium truncate">
                    Google: <strong>{profile.fullName}</strong>
                  </span>
                </div>
                <span className="text-emerald-700 font-mono text-[10px] shrink-0 font-semibold ml-2">Auto-filled</span>
              </div>
            ) : (
              <>
                <div className="w-full flex justify-center mb-4">
                  <GoogleSignInButton
                    text="continue_with"
                    size="large"
                    shape="rectangular"
                    width={360}
                    className="w-full flex justify-center"
                  />
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px bg-slate-200 flex-1" />
                  <span className="text-[10px] uppercase font-mono text-slate-400">or enter details</span>
                  <div className="h-px bg-slate-200 flex-1" />
                </div>
              </>
            )}

            <form className="space-y-3.5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
                <input 
                  required 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors" 
                  placeholder="e.g. Aryan Sharma" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email</label>
                <input 
                  required 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors" 
                  placeholder="student@example.com" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">WhatsApp / Phone</label>
                <input 
                  required 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors" 
                  placeholder="+91 98765 43210" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">JEE Status</label>
                <select 
                  required 
                  value={jeeStatus}
                  onChange={(e) => setJeeStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors"
                >
                  <option value="class-11">Class 11 (2027 Aspirant)</option>
                  <option value="class-12">Class 12</option>
                  <option value="dropper">Dropper / Target 2027</option>
                </select>
              </div>

              {isMockOpen && (
                <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-indigo-950 font-medium">
                    <ShieldCheck size={16} className="text-indigo-600 shrink-0" />
                    <span>Cashfree Instant PG Checkout</span>
                  </div>
                  <span className="font-bold text-indigo-700 font-mono text-sm">₹27</span>
                </div>
              )}

              <div className="pt-2">
                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> {loadingText}
                    </span>
                  ) : isMockOpen ? (
                    "Pay ₹27 & Confirm Spot"
                  ) : (
                    "Join Waitlist — Free"
                  )}
                </Button>
              </div>

              {isMockOpen && (
                <p className="text-[11px] text-center text-slate-400">
                  Secured by Cashfree Payments · UPI, Cards, Netbanking supported
                </p>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}

