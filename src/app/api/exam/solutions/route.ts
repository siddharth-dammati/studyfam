import { NextRequest, NextResponse } from "next/server";
import { evaluateTest } from "@/lib/examDb";
import { getActiveExamPaper, evaluateActivePaper } from "@/lib/activeExamService";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

async function getSolutionsForTest(testId: string, attemptId?: string | null, candidateEmail?: string | null) {
  let evaluation: any = null;

  if (testId === "active" || testId === "jee_main_75_official_mock" || testId.startsWith("jee_main_75")) {
    const paper = getActiveExamPaper();
    evaluation = evaluateActivePaper(paper, {}, 0);
  } else {
    evaluation = evaluateTest(testId, {}, 0);
  }

  if (!evaluation) {
    return null;
  }

  // Attempt to enrich with past attempt score if student is authenticated in Supabase or attemptId is provided
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const userRes = await supabase.auth.getUser();
    const user = userRes.data?.user;
    const email = (user?.email || candidateEmail || "").toLowerCase().trim();

    let pastAttempt: any = null;

    if (attemptId) {
      const { data } = await supabase
        .from("exam_attempts")
        .select("*")
        .eq("id", attemptId)
        .maybeSingle();
      pastAttempt = data;
    }

    if (!pastAttempt && email) {
      const { data } = await supabase
        .from("exam_attempts")
        .select("*")
        .eq("email", email)
        .or(`test_id.eq.${testId},test_id.eq.${decodeURIComponent(testId)}`)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      pastAttempt = data;
    }

    if (pastAttempt) {
      evaluation.id = pastAttempt.id;
      evaluation.totalScore = pastAttempt.score ?? evaluation.totalScore;
      evaluation.maxScore = pastAttempt.max_score ?? evaluation.maxScore;
      evaluation.accuracy = pastAttempt.accuracy ?? evaluation.accuracy;
      evaluation.percentage = pastAttempt.percentage ?? evaluation.percentage;
      evaluation.attemptedCount = pastAttempt.attempted_count ?? evaluation.attemptedCount;
      evaluation.correctCount = pastAttempt.correct_count ?? evaluation.correctCount;
      evaluation.incorrectCount = pastAttempt.incorrect_count ?? evaluation.incorrectCount;
      evaluation.timeSpentSeconds = pastAttempt.time_spent_seconds ?? evaluation.timeSpentSeconds;
      if (pastAttempt.section_breakdown && Array.isArray(pastAttempt.section_breakdown)) {
        evaluation.sectionBreakdown = pastAttempt.section_breakdown;
      }
      if (pastAttempt.detailed_results && Array.isArray(pastAttempt.detailed_results)) {
        evaluation.detailedResults = pastAttempt.detailed_results;
      }
      if (pastAttempt.question_times) {
        evaluation.questionTimes = pastAttempt.question_times;
      }
      evaluation.createdAt = pastAttempt.created_at;
    }
  } catch (e) {
    // ignore
  }

  return evaluation;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const id = body.id || body.testId;
    const attemptId = body.attemptId || null;
    const candidateEmail = body.email || body.candidateEmail || null;

    if (!id && !attemptId) {
      return NextResponse.json({ success: false, error: "Test ID or Attempt ID is required" }, { status: 400 });
    }

    const evaluation = await getSolutionsForTest(id || "", attemptId, candidateEmail);
    if (!evaluation) {
      return NextResponse.json({ success: false, error: "Test not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, result: evaluation });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to load solutions" }, { status: 500 });
  }
}

