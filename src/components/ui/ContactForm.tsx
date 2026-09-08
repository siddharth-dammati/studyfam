"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "./Button";
import { CheckCircle2, Loader2 } from "lucide-react";

export function ContactForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("Mock Test Registration & Payment Confirmation");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("support_inquiries").insert([
        {
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          category,
          message: message.trim(),
          status: "new",
        },
      ]);

      if (error) {
        setErrorMsg(error.message || "Failed to submit inquiry. Please try again.");
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Ticket Submitted Successfully</h3>
        <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto mb-6">
          Thank you, <strong>{fullName}</strong>. Our candidate grievance and technical desks have logged your query and will respond to <strong>{email}</strong> within 24-48 business hours.
        </p>
        <Button
          size="md"
          variant="secondary"
          onClick={() => {
            setSubmitted(false);
            setMessage("");
          }}
        >
          Submit Another Query
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-6 tracking-tight">Submit an Inquiry</h3>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
          {errorMsg}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Full Name
          </label>
          <input
            required
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors"
            placeholder="e.g. Aryan Sharma"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Registered Email
            </label>
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
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              WhatsApp / Phone
            </label>
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors"
              placeholder="+91 98765 43210"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Inquiry Department
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors"
          >
            <option>Mock Test Registration & Payment Confirmation</option>
            <option>CBT Examination Engine & Browser Compatibility</option>
            <option>Top N Scholarship Verification & Payout</option>
            <option>Question Key Challenge & Score Audit</option>
            <option>Other Institutional / Partnership Queries</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Detailed Message
          </label>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors resize-none"
            placeholder="Describe your query in detail..."
          ></textarea>
        </div>
        <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Submitting Ticket...
            </span>
          ) : (
            "Submit Support Ticket"
          )}
        </Button>
      </form>
    </div>
  );
}
