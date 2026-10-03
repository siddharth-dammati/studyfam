"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function handleAuth() {
      try {
        const supabase = createClient();
        const code = searchParams.get("code");
        const next = searchParams.get("next") || "/dashboard";
        const errDesc = searchParams.get("error_description") || searchParams.get("error");

        if (errDesc) {
          if (mounted) {
            setStatus("error");
            setErrorMessage(errDesc);
          }
          return;
        }

        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            // Check if detectSessionInUrl already successfully established the session
            const { data: sessData } = await supabase.auth.getSession();
            if (sessData?.session?.user) {
              if (mounted) {
                setStatus("success");
                setTimeout(() => router.replace(next), 350);
              }
              return;
            }
            if (mounted) {
              setStatus("error");
              setErrorMessage(error.message);
            }
            return;
          }

          if (mounted) {
            setStatus("success");
            setTimeout(() => {
              router.replace(next);
            }, 350);
          }
          return;
        }

        // If no code in query params, check existing active session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          if (mounted) {
            setStatus("success");
            router.replace(next);
          }
        } else {
          if (mounted) {
            setStatus("error");
            setErrorMessage("No authentication response found. Please try signing in again.");
          }
        }
      } catch (err: any) {
        if (mounted) {
          setStatus("error");
          setErrorMessage(err?.message || "Unexpected authentication error.");
        }
      }
    }

    handleAuth();

    return () => {
      mounted = false;
    };
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[#F6F9FF] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-[#E3EAF6] rounded-3xl p-8 text-center shadow-lg">
        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="w-10 h-10 text-[#1A5FE0] animate-spin mx-auto" />
            <h2 className="text-lg font-bold text-[#0B1526]">Signing you into StudyFAM...</h2>
            <p className="text-xs text-[#4B5B76]">Verifying your Google authentication credentials.</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h2 className="text-lg font-bold text-[#0B1526]">Signed in successfully!</h2>
            <p className="text-xs text-[#4B5B76]">Redirecting you to your destination...</p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <h2 className="text-lg font-bold text-[#0B1526]">Sign in was unsuccessful</h2>
            <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
              {errorMessage}
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/"
                className="px-5 py-2.5 bg-[#0B1526] hover:bg-[#1A5FE0] text-white rounded-xl text-xs font-bold transition-all"
              >
                Return to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F6F9FF] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#1A5FE0] animate-spin" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
