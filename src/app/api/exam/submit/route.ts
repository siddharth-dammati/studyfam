import { NextRequest, NextResponse } from "next/server";
import { evaluateTest } from "@/lib/examDb";
import { getActiveExamPaper, ActiveExamPaper } from "@/lib/activeExamService";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testId, responses, timeSpentSeconds, candidateEmail } = body;

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

function evaluateActivePaper(
  paper: ActiveExamPaper,
  responses: Record<string, string>,
  timeSpentSeconds: number
) {
  let totalQuestions = 0;
  let attemptedCount = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let totalScore = 0;

  const sectionBreakdown: any[] = [];
  const detailedResults: any[] = [];

  for (const subj of paper.subjects) {
    let secTotal = 0;
    let secAttempted = 0;
    let secCorrect = 0;
    let secIncorrect = 0;
    let secScore = 0;

    for (const q of subj.questions) {
      totalQuestions++;
      secTotal++;

      const userAns = responses[q.id]?.trim() || null;
      const isAttempted = Boolean(userAns);

      let isCorrect = false;
      let marksAwarded = 0;

      if (isAttempted) {
        attemptedCount++;
        secAttempted++;

        if (q.type === "NUMERICAL") {
          const numUser = parseFloat(userAns!);
          const numCorrect = parseFloat(q.correctAnswer);
          if (!isNaN(numUser) && !isNaN(numCorrect)) {
            // Allow precision tolerance of 0.01 for numericals
            isCorrect = Math.abs(numUser - numCorrect) < 0.01;
          } else {
            isCorrect = userAns!.toLowerCase() === q.correctAnswer.trim().toLowerCase();
          }
        } else {
          // MCQ comparison
          isCorrect = userAns!.toUpperCase() === q.correctAnswer.trim().toUpperCase();
        }

        if (isCorrect) {
          correctCount++;
          secCorrect++;
          marksAwarded = paper.marksPerQuestion;
          totalScore += paper.marksPerQuestion;
          secScore += paper.marksPerQuestion;
        } else {
          incorrectCount++;
          secIncorrect++;
          marksAwarded = -paper.negativeMarks;
          totalScore -= paper.negativeMarks;
          secScore -= paper.negativeMarks;
        }
      }

      detailedResults.push({
        questionId: q.id,
        questionNumber: q.questionNumber,
        subject: q.subject,
        section: q.section,
        type: q.type,
        questionText: q.questionText,
        optionA: q.optionA || null,
        optionB: q.optionB || null,
        optionC: q.optionC || null,
        optionD: q.optionD || null,
        imagePaths: q.imagePaths || [],
        userResponse: userAns,
        correctAnswer: q.correctAnswer,
        isCorrect,
        solution: q.solution,
        marksAwarded,
      });
    }

    sectionBreakdown.push({
      sectionName: subj.name,
      total: secTotal,
      attempted: secAttempted,
      correct: secCorrect,
      incorrect: secIncorrect,
      score: secScore,
    });
  }

  const unattemptedCount = totalQuestions - attemptedCount;
  const maxScore = totalQuestions * paper.marksPerQuestion;
  const percentage = maxScore > 0 ? Math.max(0, Math.round((totalScore / maxScore) * 100 * 10) / 10) : 0;
  const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100 * 10) / 10 : 0;

  return {
    testId: paper.id,
    totalQuestions,
    attemptedCount,
    correctCount,
    incorrectCount,
    unattemptedCount,
    totalScore,
    maxScore,
    percentage,
    accuracy,
    timeSpentSeconds,
    sectionBreakdown,
    detailedResults,
  };
}
