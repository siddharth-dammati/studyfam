import { NextRequest, NextResponse } from "next/server";
import { getActiveExamPaper, saveActiveExamPaper, ActiveExamPaper, generateDefaultMockPaper } from "@/lib/activeExamService";
import { isAuthorizedAdmin } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  try {
    const isAuth = isAuthorizedAdmin(request);
    if (!isAuth) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));

    // Action: GET paper
    if (body.action === "get") {
      const paper = getActiveExamPaper();
      return NextResponse.json({ success: true, paper });
    }

    // Action: RESET paper
    if (body.action === "reset") {
      const defaultPaper = generateDefaultMockPaper();
      saveActiveExamPaper(defaultPaper);
      return NextResponse.json({
        success: true,
        message: "Paper reset to default 75 questions",
        paper: defaultPaper,
      });
    }

    // Action: SAVE paper
    const paper = body.paper as ActiveExamPaper;
    if (!paper || !Array.isArray(paper.subjects) || paper.subjects.length !== 3) {
      return NextResponse.json(
        { success: false, error: "Invalid paper payload. Must contain Physics, Chemistry, and Mathematics." },
        { status: 400 }
      );
    }

    saveActiveExamPaper(paper);

    return NextResponse.json({
      success: true,
      message: "Active exam paper updated successfully",
      paper,
    });
  } catch (err: any) {
    console.error("Error in POST /api/admin/exam:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
