import { NextRequest, NextResponse } from "next/server";
import { evaluateTest } from "@/lib/examDb";
import { getActiveExamPaper, evaluateActivePaper } from "@/lib/activeExamService";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testId, responses, timeSpentSeconds, candidateEmail, submissionReason } = body;

    if (!testId || typeof responses !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid test submission payload" },
        { status: 400 }
      );
    }

    let evaluation: any = null;

    // Check if submitting the Active 75-Question Mock Paper
    if (testId === "active" || testId === "jee_main_75_official_mock" || testId.startsWith("jee_main_75")) {
      const paper = getActiveExamPaper();
      evaluation = evaluateActivePaper(paper, responses, Number(timeSpentSeconds) || 0);
    } else {
      evaluation = evaluateTest(testId, responses, Number(timeSpentSeconds) || 0);
    }

    if (!evaluation) {
      return NextResponse.json(
        { success: false, error: "Test not found for evaluation" },
        { status: 404 }
      );
    }

    if (submissionReason) {
      evaluation.submissionReason = submissionReason;
    }

    // Try saving attempt to Supabase if candidate is logged in or provides email
    try {
      const cookieStore = await cookies();
      const supabase = createClient(cookieStore);
      const userRes = await supabase.auth.getUser();
      const user = userRes.data?.user;

      const email = user?.email || candidateEmail || null;

      if (email) {
        await supabase.from("exam_attempts").insert({
          user_id: user?.id || null,
          email,
          test_id: evaluation.testId,
          score: evaluation.totalScore,
          max_score: evaluation.maxScore,
          percentage: evaluation.percentage,
          accuracy: evaluation.accuracy,
          time_spent_seconds: evaluation.timeSpentSeconds,
          total_questions: evaluation.totalQuestions,
          attempted_count: evaluation.attemptedCount,
          correct_count: evaluation.correctCount,
          incorrect_count: evaluation.incorrectCount,
          section_breakdown: evaluation.sectionBreakdown,
        });
      }
    } catch (saveErr) {
      console.warn("Supabase attempt persistence skipped:", saveErr);
    }

    return NextResponse.json({
      success: true,
      result: evaluation,
    });
  } catch (err: any) {
    console.error("Error evaluating exam:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to evaluate exam" },
      { status: 500 }
    );
  }
}

