"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/utils/supabase/client";
import { TestDetail, EvaluationResult } from "@/lib/examDb";
import { TcsIonInstructions } from "@/components/exam/TcsIonInstructions";
import { TcsIonPlayer } from "@/components/exam/TcsIonPlayer";
import { TcsIonResultView } from "@/components/exam/TcsIonResultView";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

function ExamPlayerContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || searchParams.get("testId") || "MFT-1.pdf";
  const { profile } = useAuth();

  const [test, setTest] = useState<TestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Exam Flow Phases: "instructions" | "in_exam" | "result"
  const [phase, setPhase] = useState<"instructions" | "in_exam" | "result">("instructions");
  const [submitting, setSubmitting] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);

  // Candidate Name & Roll resolution
  const [candidateName, setCandidateName] = useState<string>("Candidate");
  const [candidateRoll, setCandidateRoll] = useState<string>("SF-JEE-2026");

  useEffect(() => {
    try {
      const cached = localStorage.getItem("sf_candidate_record");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.full_name) setCandidateName(parsed.full_name);
        if (parsed.order_id) setCandidateRoll(`SF-${parsed.order_id.slice(-6).toUpperCase()}`);
      } else if (profile?.fullName) {
        setCandidateName(profile.fullName);
      }
    } catch {}
  }, [profile]);

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
          let reviewLoaded = false;
          if (isReview) {
            try {
              const cachedResult =
                localStorage.getItem(`sf_exam_result_${testData.id}`) ||
                localStorage.getItem(`sf_exam_result_${id}`) ||
                localStorage.getItem(`sf_exam_result_${decodeURIComponent(id)}`);
              if (cachedResult) {
                const parsedResult = JSON.parse(cachedResult);
                if (parsedResult) {
                  setEvaluationResult(parsedResult);
                  setPhase("result");
                  reviewLoaded = true;
                }
              }
            } catch {}

            // If not found in local cache, load solutions and chapter diagnostics from server
            if (!reviewLoaded) {
              try {
                const solRes = await fetch("/api/exam/solutions", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id }),
                });
                const solJson = await solRes.json();
                if (solJson.success && solJson.result) {
                  setEvaluationResult(solJson.result);
                  setPhase("result");
                  reviewLoaded = true;
                  try {
                    localStorage.setItem(`sf_exam_result_${testData.id}`, JSON.stringify(solJson.result));
                  } catch {}
                }
              } catch (solErr) {
                console.warn("Could not fetch remote solutions:", solErr);
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
      const res = await fetch("/api/exam/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testId: test.id,
          testTitle: test.title,
          responses,
          timeSpentSeconds,
          candidateEmail: profile?.email || null,
          submissionReason: submissionReason || null,
          questionTimes: questionTimes || {},
          tabViolations: 0, // will be overridden by security auto-submit if triggered
        }),
      });

      const json = await res.json();

      if (json.success && json.result) {
        if (submissionReason) {
          json.result.submissionReason = submissionReason;
        }
        setEvaluationResult(json.result);
        setPhase("result");

        // Persist attempt & evaluation result for dashboard performance analytics & review
        try {
          localStorage.setItem(`sf_exam_result_${test.id}`, JSON.stringify(json.result));
          if (questionTimes) {
            localStorage.setItem(`sf_exam_qtimes_${test.id}`, JSON.stringify(questionTimes));
          }

          const existingRaw = localStorage.getItem("sf_recent_attempts");
          const existingList = existingRaw ? JSON.parse(existingRaw) : [];
          const newAttemptRecord = {
            id: `${test.id}_${Date.now()}`,
            testId: test.id,
            testTitle: test.title,
            score: json.result.totalScore ?? json.result.score ?? 0,
            maxScore: json.result.maxScore || 300,
            percentage: json.result.percentage || 0,
            accuracy: json.result.accuracy || 0,
            totalQuestions: json.result.totalQuestions || 75,
            attemptedCount: json.result.attemptedCount || 0,
            correctCount: json.result.correctCount || 0,
            incorrectCount: json.result.incorrectCount || 0,
            timeSpentSeconds: timeSpentSeconds,
            submissionReason: submissionReason || null,
            createdAt: new Date().toISOString(),
          };
          const updated = [
            newAttemptRecord,
            ...existingList.filter((a: any) => a.id !== newAttemptRecord.id),
          ].slice(0, 30);
          localStorage.setItem("sf_recent_attempts", JSON.stringify(updated));

          // Guaranteed direct Supabase sync for authenticated candidate
          if (profile?.email) {
            try {
              const supabase = createClient();
              // Build question_times map from the questionTimes argument
              const questionTimesMap: Record<string, number> = {};
              if (questionTimes) {
                for (const [qId, secs] of Object.entries(questionTimes)) {
                  questionTimesMap[qId] = secs;
                }
              }
              await supabase.from("exam_attempts").insert({
                user_id: profile.id || null,
                email: profile.email.toLowerCase().trim(),
                test_id: test.id,
                test_title: test.title,
                score: json.result.totalScore ?? json.result.score ?? 0,
                max_score: json.result.maxScore || 300,
                percentage: json.result.percentage || 0,
                accuracy: json.result.accuracy || 0,
                time_spent_seconds: timeSpentSeconds,
                total_questions: json.result.totalQuestions || 75,
                attempted_count: json.result.attemptedCount || 0,
                correct_count: json.result.correctCount || 0,
                incorrect_count: json.result.incorrectCount || 0,
                section_breakdown: json.result.sectionBreakdown || [],
                detailed_results: json.result.detailedResults || [],
                question_times: questionTimesMap,
                tab_violations: json.result.tabViolations || 0,
                submission_reason: submissionReason || null,
              });
            } catch (syncErr) {
              console.warn("Client Supabase attempt sync skipped:", syncErr);
            }
          }
        } catch (storageErr) {
          console.warn("Could not cache exam attempt locally:", storageErr);
        }
      } else {
        alert(json.error || "Submission failed. Please try again.");
      }
    } catch (err: any) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-sm font-semibold text-gray-700">
          Preparing NTA / TCS iON Assessment Engine...
        </p>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-md w-full text-center shadow-sm space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-gray-800">Exam Not Available</h2>
          <p className="text-sm text-gray-600">{error || "Unable to find the requested test."}</p>
          <Link
            href="/exam"
            className="inline-block px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            Back to Test Series
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
