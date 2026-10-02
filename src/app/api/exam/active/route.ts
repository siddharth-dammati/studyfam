import { NextResponse } from "next/server";
import { getActiveExamPaper } from "@/lib/activeExamService";

function getSanitizedPaper() {
  const paper = getActiveExamPaper();

  const sanitizedSubjects = paper.subjects.map((subj) => ({
    name: subj.name,
    totalQuestions: subj.totalQuestions,
    mcqCount: subj.mcqCount,
    numericalCount: subj.numericalCount,
    questions: subj.questions.map((q) => ({
      id: q.id,
      subject: q.subject,
      section: q.section,
      type: q.type,
      questionNumber: q.questionNumber,
      overallNumber: q.overallNumber,
      questionText: q.questionText,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      imagePaths: q.imagePaths,
      chapter: q.chapter,
      difficulty: q.difficulty,
    })),
  }));

  return {
    ...paper,
    subjects: sanitizedSubjects,
  };
}

export async function POST() {
  try {
    return NextResponse.json({
      success: true,
      paper: getSanitizedPaper(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load active exam" },
      { status: 500 }
    );
  }
}


