import { NextRequest, NextResponse } from "next/server";
import { getTestById } from "@/lib/examDb";

function sanitizeTest(test: any) {
  const sanitizedSections = test.sections.map((sec: any) => ({
    name: sec.name,
    questions: sec.questions.map((q: any) => ({
      id: q.id,
      subject: q.subject,
      unit_id: q.unit_id,
      unit_name: q.unit_name,
      chapter: q.chapter,
      question_number: q.question_number,
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      difficulty: q.difficulty,
      has_image: q.has_image,
      image_paths: q.image_paths,
    })),
  }));

  return {
    ...test,
    sections: sanitizedSections,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const id = body.id;

    if (!id) {
      return NextResponse.json({ success: false, error: "Test ID is required" }, { status: 400 });
    }

    const test = getTestById(id);
    if (!test) {
      return NextResponse.json({ success: false, error: "Test not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      test: sanitizeTest(test),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
