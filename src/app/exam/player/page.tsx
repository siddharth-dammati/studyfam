"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/utils/supabase/client";
import { TestDetail, EvaluationResult } from "@/lib/examDb";
import { TcsIonInstructions } from "@/components/exam/TcsIonInstructions";
import { TcsIonPlayer } from "@/components/exam/TcsIonPlayer";
import { TcsIonResultView } from "@/components/exam/TcsIonResultView";
import { GoogleSignInButton } from "@/components/ui/GoogleSignInButton";
import { Logo } from "@/components/ui/Logo";
import { Loader2, AlertCircle, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import SOHAN_CHEM_MOCK from "@/../questions_database/custom_tests/sohan-chem-mock.json";

function evaluateSohanMockLocally(
  responses: Record<string, string>,
  timeSpentSeconds: number,
  questionTimes?: Record<string, number>
): EvaluationResult {
  const questions = SOHAN_CHEM_MOCK.sections[0].questions;
  let totalQuestions = 0;
  let attemptedCount = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let totalScore = 0;
  const sectionMap = new Map<string, { total: number; attempted: number; correct: number; incorrect: number; score: number }>();
  const detailedResults: any[] = [];
  const marksPerQ = SOHAN_CHEM_MOCK.marks_per_question || 4;
  const negMarks = SOHAN_CHEM_MOCK.negative_marks || 1;

  for (const q of questions) {
    totalQuestions++;
    const sec = q.subject || "Chemistry";
    if (!sectionMap.has(sec)) sectionMap.set(sec, { total: 0, attempted: 0, correct: 0, incorrect: 0, score: 0 });
    const s = sectionMap.get(sec)!;
    s.total++;

    const userAns = (responses[q.id] || "").trim();
    const isAttempted = Boolean(userAns);
    let isCorrect = false;
    let marksAwarded = 0;

    if (isAttempted) {
      attemptedCount++;
      s.attempted++;
      const normUser = userAns.toLowerCase();
      const normCorrect = (q.correct_answer || "").trim().toLowerCase();
      if (normUser === normCorrect) {
        isCorrect = true;
      } else {
        const numU = parseFloat(normUser);
        const numC = parseFloat(normCorrect);
        if (!isNaN(numU) && !isNaN(numC) && Math.abs(numU - numC) < 0.05) {
          isCorrect = true;
        }
      }

      if (isCorrect) {
        correctCount++;
        s.correct++;
        marksAwarded = marksPerQ;
        totalScore += marksPerQ;
        s.score += marksPerQ;
      } else {
        incorrectCount++;
        s.incorrect++;
        marksAwarded = -negMarks;
        totalScore -= negMarks;
        s.score -= negMarks;
      }
    }

    detailedResults.push({
      questionId: q.id,
      questionNumber: q.question_number,
      subject: q.subject,
      chapter: q.chapter || "General",
      difficulty: q.difficulty || "Medium",
      questionText: q.question_text,
      optionA: q.option_a,
      optionB: q.option_b,
      optionC: q.option_c,
      optionD: q.option_d,
      imagePaths: q.image_paths || [],
      userResponse: isAttempted ? userAns : null,
      correctAnswer: q.correct_answer,
      isCorrect,
      solution: q.solution,
      marksAwarded,
      timeSpentSeconds: questionTimes?.[q.id] || 0,
    });
  }

  const maxScore = totalQuestions * marksPerQ;
  const percentage = maxScore > 0 ? Math.max(0, Math.round((totalScore / maxScore) * 1000) / 10) : 0;
  const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 1000) / 10 : 0;
  const sectionBreakdown = Array.from(sectionMap.entries()).map(([sectionName, stats]) => ({
    sectionName,
    ...stats,
  }));

  return {
    testId: "sohan-chem-mock",
    totalQuestions,
    attemptedCount,
    correctCount,
    incorrectCount,
    unattemptedCount: totalQuestions - attemptedCount,
    totalScore,
    maxScore,
    percentage,
    accuracy,
    timeSpentSeconds: Number(timeSpentSeconds) || 0,
    sectionBreakdown,
    detailedResults,
  };
}

function ExamPlayerContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || searchParams.get("testId") || "MFT-1.pdf";
  const { user, profile, loading: authLoading } = useAuth();

  const [test, setTest] = useState<TestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Exam Flow Phases: "instructions" | "in_exam" | "result"
  const [phase, setPhase] = useState<"instructions" | "in_exam" | "result">("instructions");
  const [submitting, setSubmitting] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);

  // Candidate Name & Roll resolution
  const isGuestAllowed = Boolean(
    searchParams.get("guest") === "1" ||
    searchParams.get("noLogin") === "1" ||
    (test as any)?.allowGuest ||
    (test as any)?.is_unlisted ||
    id.toLowerCase().includes("sohan") ||
    id.toLowerCase().includes("chem")
  );

  const [candidateName, setCandidateName] = useState<string>("Candidate");
  const [candidateRoll, setCandidateRoll] = useState<string>("SF-JEE-2026");

  useEffect(() => {
    try {
      const nameParam = searchParams.get("name") || searchParams.get("candidate");
      if (nameParam) {
        setCandidateName(decodeURIComponent(nameParam));
      } else if (profile?.fullName) {
        setCandidateName(profile.fullName);
      } else if (user?.user_metadata?.full_name) {
        setCandidateName(user.user_metadata.full_name);
      } else if (profile?.email) {
        setCandidateName(profile.email.split("@")[0]);
      } else {
        const cached = localStorage.getItem("sf_candidate_record");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.full_name) setCandidateName(parsed.full_name);
          if (parsed.order_id) setCandidateRoll(`SF-${parsed.order_id.slice(-6).toUpperCase()}`);
        } else if (isGuestAllowed) {
          setCandidateName("Guest Scholar");
          setCandidateRoll("GUEST-CHEM-2026");
        }
      }

      if (profile?.id) {
        setCandidateRoll(`SF-${profile.id.slice(0, 8).toUpperCase()}`);
      }
    } catch {}
  }, [profile, user, searchParams, isGuestAllowed]);

  useEffect(() => {
    async function loadTest() {
      try {
        setLoading(true);
        let testData: any = null;

        if (id === "active" || id === "jee_main_75_official_mock") {
          const res = await fetch("/api/exam/active", { method: "POST" });
          const json = await res.json();
          if (json.success && json.paper) {
            testData = {
              id: json.paper.id,
              title: json.paper.title,
              source_file: "active",
              total_questions: json.paper.totalQuestions,
              duration_minutes: json.paper.durationMinutes,
              marks_per_question: json.paper.marksPerQuestion || 4,
              negative_marks: json.paper.negativeMarks || 1,
              sections: json.paper.subjects.map((s: any) => ({
                name: s.name,
                questions: s.questions.map((q: any) => ({
                  id: q.id,
                  subject: q.subject,
                  unit_id: "",
                  unit_name: "",
                  chapter: q.chapter || "",
                  source_file: "active",
                  question_number: q.questionNumber,
                  question_text: q.questionText,
                  option_a: q.optionA || null,
                  option_b: q.optionB || null,
                  option_c: q.optionC || null,
                  option_d: q.optionD || null,
                  correct_answer: "",
                  solution: "",
                  difficulty: q.difficulty || "Medium",
                  has_image: q.imagePaths?.length > 0 ? 1 : 0,
                  image_paths: q.imagePaths || [],
                  type: q.type,
                  section: q.section,
                })),
              })),
            };
          }
        } else if (id === "sohan-chem-mock" || id.toLowerCase().includes("sohan")) {
          // Direct guaranteed instant load for Sohan Chemistry Mock
          testData = {
            id: SOHAN_CHEM_MOCK.id,
            title: SOHAN_CHEM_MOCK.title,
            source_file: SOHAN_CHEM_MOCK.source_file,
            total_questions: SOHAN_CHEM_MOCK.total_questions,
            duration_minutes: SOHAN_CHEM_MOCK.duration_minutes,
            marks_per_question: SOHAN_CHEM_MOCK.marks_per_question || 4,
            negative_marks: SOHAN_CHEM_MOCK.negative_marks || 1,
            sections: SOHAN_CHEM_MOCK.sections.map((sec: any) => ({
              name: sec.name,
              questions: sec.questions.map((q: any) => ({
                id: q.id,
                subject: q.subject,
                unit_id: q.unit_id || "",
                unit_name: q.unit_name || "",
                chapter: q.chapter || "",
                source_file: q.source_file || "",
                question_number: q.question_number,
                question_text: q.question_text,
                option_a: q.option_a || null,
                option_b: q.option_b || null,
                option_c: q.option_c || null,
                option_d: q.option_d || null,
                correct_answer: "",
                solution: "",
                difficulty: q.difficulty || "Medium",
                has_image: q.has_image || 0,
                image_paths: q.image_paths || [],
                type: q.type || (q.question_number > 20 ? "NUMERICAL" : "MCQ"),
                section: q.section || (q.question_number > 20 ? "Section B (Numerical)" : "Section A (MCQ)"),
              })),
            })),
          };
        } else {
          const res = await fetch(`/api/exam/detail`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          });
          const json = await res.json();
          if (json.success && json.test) {
            testData = json.test;
          }
        }

        if (testData) {
          setTest(testData);

          // If review mode requested, show results directly (from cache or API)
          const isReview = searchParams.get("review") === "1" || searchParams.get("view") === "result";
          const attemptIdParam = searchParams.get("attemptId");
          let reviewLoaded = false;
          if (isReview) {
            try {
              let cachedResult: string | null = null;
              if (attemptIdParam) {
                cachedResult = localStorage.getItem(`sf_exam_result_attempt_${attemptIdParam}`);
              }
              if (!cachedResult) {
                cachedResult =
                  localStorage.getItem(`sf_exam_result_${testData.id}`) ||
                  localStorage.getItem(`sf_exam_result_${id}`) ||
                  localStorage.getItem(`sf_exam_result_${decodeURIComponent(id)}`);
              }
              if (cachedResult) {
                const parsedResult = JSON.parse(cachedResult);
                if (parsedResult) {
                  setEvaluationResult(parsedResult);
                  setPhase("result");
                  reviewLoaded = true;
                }
              }
            } catch {}

            // If not found in local cache, load solutions and past attempt diagnostics from server
            if (!reviewLoaded) {
              if (id.toLowerCase().includes("sohan")) {
                const localSol = evaluateSohanMockLocally({}, 0);
                setEvaluationResult(localSol);
                setPhase("result");
                reviewLoaded = true;
              } else {
                try {
                  const solRes = await fetch("/api/exam/solutions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      id,
                      attemptId: attemptIdParam || null,
                      email: profile?.email || null,
                    }),
                  });
                  const solJson = await solRes.json();
                  if (solJson.success && solJson.result) {
                    setEvaluationResult(solJson.result);
                    setPhase("result");
                    reviewLoaded = true;
                    try {
                      localStorage.setItem(`sf_exam_result_${testData.id}`, JSON.stringify(solJson.result));
                      if (attemptIdParam) {
                        localStorage.setItem(`sf_exam_result_attempt_${attemptIdParam}`, JSON.stringify(solJson.result));
                      }
                    } catch {}
                  }
                } catch (solErr) {
                  console.warn("Could not fetch remote solutions:", solErr);
                }
              }
            }
          }

          // If not in review mode and there's an ongoing test session in localStorage, jump directly to in_exam
          if (!reviewLoaded) {
            try {
              const savedState = localStorage.getItem(`sf_exam_state_${testData.id}`);
              if (savedState) {
                const parsed = JSON.parse(savedState);
                if (parsed && typeof parsed.secondsLeft === "number" && parsed.secondsLeft > 0) {
                  setPhase("in_exam");
                }
              }
            } catch {}
          }
        } else {
          setError("Failed to load examination.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load examination.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadTest();
    }
  }, [id, searchParams]);

  const handleSubmitExam = async (
    responses: Record<string, string>,
    timeSpentSeconds: number,
    submissionReason?: string,
    questionTimes?: Record<string, number>
  ) => {
    if (!test) return;

    setSubmitting(true);
    try {
      let json: any = null;
      try {
        const res = await fetch("/api/exam/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            testId: test.id,
            testTitle: test.title,
            responses,
            timeSpentSeconds,
            candidateEmail: profile?.email || user?.email || (isGuestAllowed ? "guest@studyfam.local" : null),
            isGuest: !profile && !user,
            allowGuest: isGuestAllowed,
            submissionReason: submissionReason || null,
            questionTimes: questionTimes || {},
            tabViolations: 0, // will be overridden by security auto-submit if triggered
          }),
        });
        json = await res.json();
      } catch (submitNetErr) {
        console.warn("Submit network error:", submitNetErr);
      }

      let resultToUse = json?.success ? json.result : null;

      // Fallback local evaluation if edge worker returned error or offline
      if (!resultToUse && (test.id.includes("sohan") || id.toLowerCase().includes("sohan"))) {
        resultToUse = evaluateSohanMockLocally(responses, timeSpentSeconds, questionTimes);
      }

      if (resultToUse) {
        if (submissionReason) {
          resultToUse.submissionReason = submissionReason;
        }
        setEvaluationResult(resultToUse);
        setPhase("result");

        // Persist attempt & evaluation result for dashboard performance analytics & review
        try {
          const attemptId = resultToUse.id || `${test.id}_${Date.now()}`;
          resultToUse.id = attemptId;
          localStorage.setItem(`sf_exam_result_${test.id}`, JSON.stringify(resultToUse));
          localStorage.setItem(`sf_exam_result_attempt_${attemptId}`, JSON.stringify(resultToUse));
          if (questionTimes) {
            localStorage.setItem(`sf_exam_qtimes_${test.id}`, JSON.stringify(questionTimes));
            localStorage.setItem(`sf_exam_qtimes_attempt_${attemptId}`, JSON.stringify(questionTimes));
          }

          const existingRaw = localStorage.getItem("sf_recent_attempts");
          const existingList = existingRaw ? JSON.parse(existingRaw) : [];
          const newAttemptRecord = {
            id: attemptId,
            testId: test.id,
            testTitle: test.title,
            score: resultToUse.totalScore ?? resultToUse.score ?? 0,
            maxScore: resultToUse.maxScore || (test.total_questions ? test.total_questions * 4 : 300),
            percentage: resultToUse.percentage || 0,
            accuracy: resultToUse.accuracy || 0,
            totalQuestions: resultToUse.totalQuestions || test.total_questions || 25,
            attemptedCount: resultToUse.attemptedCount || 0,
            correctCount: resultToUse.correctCount || 0,
            incorrectCount: resultToUse.incorrectCount || 0,
            timeSpentSeconds: timeSpentSeconds,
            questionTimes: questionTimes || {},
            submissionReason: submissionReason || null,
            createdAt: new Date().toISOString(),
          };
          const updated = [
            newAttemptRecord,
            ...existingList.filter((a: any) => a.id !== newAttemptRecord.id),
          ].slice(0, 50);
          localStorage.setItem("sf_recent_attempts", JSON.stringify(updated));
        } catch (storageErr) {
          console.warn("Could not cache exam attempt locally:", storageErr);
        }
      } else {
        alert(json?.error || "Submission failed. Please try again.");
      }
    } catch (err: any) {
      if (test.id.includes("sohan") || id.toLowerCase().includes("sohan")) {
        const fallbackResult = evaluateSohanMockLocally(responses, timeSpentSeconds, questionTimes);
        setEvaluationResult(fallbackResult);
        setPhase("result");
        return;
      }
      alert("Error submitting exam: " + (err.message || "Network error"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetakeExam = () => {
    if (!test) return;
    localStorage.removeItem(`sf_exam_state_${test.id}`);
    localStorage.removeItem(`sf_exam_violations_${test.id}`);
    setEvaluationResult(null);
    setPhase("instructions");
  };

  if (authLoading || (loading && !test)) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4 select-none relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-radial from-[#d6aef2]/20 to-transparent blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-radial from-[#2f8fff]/15 to-transparent blur-3xl pointer-events-none -z-10" />
        
        <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl border-2 border-indigo-100 border-t-[#1a5fe0] animate-spin" />
          <div className="w-12 h-12 bg-white rounded-xl shadow-xs flex items-center justify-center p-1.5 overflow-hidden border border-slate-200/80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon-512.png" alt="StudyFAM" className="w-full h-full object-contain animate-pulse" />
          </div>
        </div>
        <h3 className="text-base font-bold text-[#1a1a1a] tracking-tight">
          Verifying Candidate Session...
        </h3>
        <p className="text-xs text-slate-500 mt-1 font-mono">
          TCS iON CBT Examination Engine
        </p>
      </div>
    );
  }

  // Candidate must be signed in with Google to write mock examinations unless guest/unlisted mode is allowed
  if (!profile && !user && phase !== "result" && !isGuestAllowed) {
    const testTitle = test?.title || (id.startsWith("MFT") ? `Major Full Test ${id.match(/MFT[-_ ]*0?(\d+)/i)?.[1] || "1"}` : "JEE Main Full Mock Examination");

    return (
      <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] flex flex-col relative overflow-hidden selection:bg-[#1a5fe0] selection:text-white">
        {/* Tokko Ambient background glows */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-radial from-[#d6aef2]/20 to-transparent blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-1/3 -left-40 w-[500px] h-[500px] rounded-full bg-radial from-[#2f8fff]/15 to-transparent blur-3xl pointer-events-none -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(26,26,26,0.035)_1.2px,transparent_1.8px)] [background-size:24px_24px] pointer-events-none -z-10" />

        {/* Top Header */}
        <header className="border-b border-[rgba(26,26,26,0.08)] bg-[#fafafa]/85 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-[rgba(26,26,26,0.08)] hover:border-[#1a5fe0]/40 px-3.5 py-1.5 rounded-full shadow-2xs transition-all active:scale-95"
            >
              <ArrowLeft size={14} className="text-slate-500" />
              <span>Go back to dashboard</span>
            </Link>
            <div className="h-4 w-px bg-slate-200/80 hidden sm:block" />
            <Link href="/" className="flex items-center">
              <Logo className="h-7 shrink-0" textClassName="text-base" />
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#dcfce7] border border-[#86efac]/80 rounded-full text-xs text-[#16a34a] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse" />
              <span>Official CBT Assessment</span>
            </span>
          </div>
        </header>

        {/* Center Candidate Verification Gate Card */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
          <div className="max-w-lg w-full bg-white border border-[rgba(26,26,26,0.08)] rounded-[32px] p-6 sm:p-10 shadow-[0_25px_60px_-20px_rgba(10,28,150,0.12)] text-center relative overflow-hidden">
            {/* Top Accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0a1c96] via-[#1a5fe0] to-[#16a34a]" />

            <div className="w-14 h-14 bg-gradient-to-br from-[#0a1c96] to-[#1f6ff2] text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-[0_12px_24px_-8px_rgba(26,95,224,0.45)]">
              <Lock size={26} />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f3e9fd] border border-[#d6aef2]/70 rounded-full text-xs text-[#7c3aed] font-semibold mb-3">
              <span>Sign In Required to Write Mock</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] tracking-tight mb-2">
              Candidate Verification Required
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
              You must sign in with your Google account to write this mock test. Authentication verifies your test session, logs question pacing diagnostics, and ensures genuine All-India rank calculation.
            </p>

            {/* Test details preview */}
            <div className="p-4 sm:p-5 rounded-[22px] bg-[#fafafa] border border-[rgba(26,26,26,0.08)] mb-6 text-left space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 font-bold uppercase text-[10px]">Test Name</span>
                <span className="font-bold text-[#0a1c96] font-mono text-[11px] bg-[#e9f1fd] border border-[#1a5fe0]/20 px-2.5 py-0.5 rounded-full">
                  Official NTA Blueprint
                </span>
              </div>
              <div className="font-bold text-sm sm:text-base text-slate-900 tracking-tight">
                {testTitle}
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[rgba(26,26,26,0.06)] text-center font-mono">
                <div className="p-2 bg-white rounded-xl border border-[rgba(26,26,26,0.06)] shadow-2xs">
                  <div className="text-[10px] text-slate-400 uppercase">Questions</div>
                  <div className="font-bold text-xs sm:text-sm text-slate-800">{test?.total_questions || 75} Qs</div>
                </div>
                <div className="p-2 bg-white rounded-xl border border-[rgba(26,26,26,0.06)] shadow-2xs">
                  <div className="text-[10px] text-slate-400 uppercase">Duration</div>
                  <div className="font-bold text-xs sm:text-sm text-slate-800">{test?.duration_minutes || 180} Mins</div>
                </div>
                <div className="p-2 bg-white rounded-xl border border-[rgba(26,26,26,0.06)] shadow-2xs">
                  <div className="text-[10px] text-slate-400 uppercase">Total Marks</div>
                  <div className="font-bold text-xs sm:text-sm text-[#0a1c96]">300 Marks</div>
                </div>
              </div>
            </div>

            {/* Google One-Tap / Standard Button */}
            <div className="flex justify-center w-full mb-4">
              <GoogleSignInButton text="continue_with" size="large" shape="pill" width={320} />
            </div>

            <p className="text-[11px] text-slate-400 font-mono mb-5">
              Fast 1-click Google authentication. Your answers and timer will auto-save to the cloud.
            </p>

            <div className="pt-4 border-t border-[rgba(26,26,26,0.08)] flex items-center justify-center gap-4 text-xs font-semibold text-slate-600">
              <Link href="/dashboard" className="hover:text-[#0a1c96] transition-colors">
                Go back to dashboard
              </Link>
              <span>•</span>
              <Link href="/exam" className="hover:text-[#0a1c96] transition-colors">
                Explore all 10 MFTs
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4">
        <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-[28px] p-8 max-w-md w-full text-center shadow-md space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-[#1a1a1a]">Exam Not Available</h2>
          <p className="text-sm text-slate-500">{error || "Unable to find the requested test."}</p>
          <Link
            href="/dashboard"
            className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#0a1c96] to-[#1f6ff2] text-white rounded-full text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            Go back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Phase 1: Instructions screen
  if (phase === "instructions") {
    return (
      <TcsIonInstructions
        testTitle={test.title}
        durationMinutes={test.duration_minutes}
        totalQuestions={test.total_questions}
        candidateName={candidateName}
        onProceed={() => setPhase("in_exam")}
      />
    );
  }

  // Phase 2: Active Exam Player
  if (phase === "in_exam") {
    return (
      <TcsIonPlayer
        test={test}
        candidateName={candidateName}
        candidateRoll={candidateRoll}
        candidateAvatar={profile?.avatarUrl}
        onSubmitExam={handleSubmitExam}
        onBackToInstructions={() => setPhase("instructions")}
        submitting={submitting}
      />
    );
  }

  // Phase 3: Results & Solutions View
  if (phase === "result" && evaluationResult) {
    return (
      <TcsIonResultView
        testTitle={test.title}
        result={evaluationResult}
        candidateName={candidateName}
        onRetake={handleRetakeExam}
      />
    );
  }

  return null;
}

export default function ExamPlayerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      }
    >
      <ExamPlayerContent />
    </Suspense>
  );
}
