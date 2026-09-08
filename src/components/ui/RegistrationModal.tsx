"use client";

import { X, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "./Button";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isMockOpen: boolean;
}

export function RegistrationModal({ isOpen, onClose, isMockOpen }: Props) {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [jeeStatus, setJeeStatus] = useState("class-11");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [registeredId, setRegisteredId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("registrations")
        .insert([
          {
            full_name: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            jee_status: jeeStatus,
            status: isMockOpen ? "registered" : "waitlist",
            amount_paid: isMockOpen ? 27 : 0,
          },
        ])
        .select("id")
        .single();

      if (error) {
        // If table doesn't exist yet or connection issue, report clearly
        setErrorMsg(error.message || "Unable to save registration. Please try again.");
        setLoading(false);
        return;
      }

      setRegisteredId(data?.id || "CONFIRMED");
      setStep(3); // success view
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
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={handleReset}
      />
      
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-[28px] shadow-2xl p-8 overflow-hidden transform transition-all">
        <button 
          onClick={handleReset}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X size={20} />
        </button>

        {step === 3 ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
              {isMockOpen ? "Registration Received!" : "You're on the Waitlist!"}
            </h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              {isMockOpen 
                ? "Your spot for the All-India Mock has been created in the registry."
                : "Thank you for joining. We will notify you via WhatsApp and Email the moment registrations open."}
            </p>
            {registeredId && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-6 font-mono text-xs text-slate-500">
                Ref ID: <span className="text-slate-900 font-semibold select-all">{registeredId.slice(0, 18)}...</span>
              </div>
            )}
            <Button size="lg" className="w-full" onClick={handleReset}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
              {isMockOpen ? "Complete Registration" : "Join Official Waitlist"}
            </h3>
            <p className="text-sm text-slate-600 mb-6 font-medium">
              {isMockOpen 
                ? "Enter your details to secure your spot for ₹27." 
                : "Get notified as soon as registrations open."}
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                {errorMsg}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
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
                  onChange={(e) => setJeeStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors"
                >
                  <option value="class-11">Class 11 (2027 Aspirant)</option>
                  <option value="class-12">Class 12</option>
                  <option value="dropper">Dropper / Target 2027</option>
                </select>
              </div>
              <div className="pt-3">
                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                    </span>
                  ) : isMockOpen ? (
                    "Register for ₹27"
                  ) : (
                    "Join Waitlist — Free"
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
