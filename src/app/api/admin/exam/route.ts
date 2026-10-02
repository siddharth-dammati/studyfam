import { NextRequest, NextResponse } from "next/server";
import { DatabaseSync } from "node:sqlite";
import path from "path";
import fs from "fs";
import { isAuthorizedAdmin } from "@/lib/adminAuth";
import {
  getActiveExamPaper,
  saveActiveExamPaper,
  ActiveExamPaper,
  generateDefaultMockPaper,
} from "@/lib/activeExamService";
import {
  listCustomTests,
  getCustomTest,
  saveCustomTest,
  deleteCustomTest,
  syncToActiveExamPaper,
} from "@/lib/customTestService";
import { getAvailableTests, getTestById, TestDetail } from "@/lib/examDb";

const DB_PATH = path.join(process.cwd(), "questions_database", "jee_questions.db");

export async function POST(request: NextRequest) {
  try {
    const isAuth = isAuthorizedAdmin(request);
    if (!isAuth) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const action = body.action || (body.paper ? "save_paper" : "get");

    // 1. GET FILTER OPTIONS (Subjects, Chapters, Difficulties, Question Types)
    if (action === "get_filters") {
      if (!fs.existsSync(DB_PATH)) {
        return NextResponse.json({
          success: true,
          subjects: ["Physics", "Chemistry", "Mathematics"],
          chapters: { Physics: [], Chemistry: [], Mathematics: [] },
          difficulties: ["Easy", "Medium", "Hard"],
          questionTypes: ["MCQ", "NUMERICAL"],
        });
      }

      const db = new DatabaseSync(DB_PATH, { readOnly: true });
      const rows = db
        .prepare(
          `SELECT DISTINCT subject, chapter 
           FROM questions 
           WHERE chapter IS NOT NULL AND length(chapter) > 0 
           ORDER BY subject ASC, chapter ASC`
        )
        .all() as Array<{ subject: string; chapter: string }>;

      const chaptersMap: Record<string, string[]> = {
        Physics: [],
        Chemistry: [],
        Mathematics: [],
      };

      for (const r of rows) {
        if (!chaptersMap[r.subject]) {
          chaptersMap[r.subject] = [];
        }
        chaptersMap[r.subject].push(r.chapter);
      }

      // Total counts
      const counts = db
        .prepare(
          `SELECT 
             count(*) as total,
             sum(CASE WHEN subject = 'Physics' THEN 1 ELSE 0 END) as physics_count,
             sum(CASE WHEN subject = 'Chemistry' THEN 1 ELSE 0 END) as chemistry_count,
             sum(CASE WHEN subject = 'Mathematics' THEN 1 ELSE 0 END) as math_count,
             sum(CASE WHEN option_a IS NOT NULL AND length(option_a) > 0 THEN 1 ELSE 0 END) as mcq_count,
             sum(CASE WHEN option_a IS NULL OR length(option_a) = 0 THEN 1 ELSE 0 END) as numerical_count,
             sum(has_image) as with_images_count
           FROM questions`
        )
        .get() as any;

      return NextResponse.json({
        success: true,
        subjects: ["Physics", "Chemistry", "Mathematics"],
        chapters: chaptersMap,
        difficulties: ["Easy", "Medium", "Hard"],
        questionTypes: ["MCQ", "NUMERICAL"],
        stats: counts,
      });
    }

    // 2. LIST ALL TESTS (Active Paper, Custom Tests, 10 MFTs, Chapter Tests)
    if (action === "list_tests") {
      const activePaper = getActiveExamPaper();
      const customMocks = listCustomTests();
      const available = getAvailableTests();

      const mftSuite = Array.from({ length: 10 }, (_, i) => {
        const num = i + 1;
        const code = `MFT-${num < 10 ? "0" + num : num}`;
        const sourceFile = `MFT-${num}.pdf`;
        const custom = customMocks.find(
          (c) => c.source_file === sourceFile || c.id === sourceFile || c.id === `MFT-${num}` || c.id === code
        );
        return {
          num,
          code,
          id: sourceFile,
          title: `JEE Main — ${code} (Major Full Mock)`,
          totalQuestions: custom?.question_count || 75,
          durationMinutes: custom?.duration_minutes || 180,
          isCustomized: Boolean(custom),
          playerUrl: `/exam/player?id=${encodeURIComponent(sourceFile)}`,
        };
      });

      return NextResponse.json({
        success: true,
        activePaper: {
          id: "active",
          title: activePaper.title,
          totalQuestions: activePaper.totalQuestions,
          durationMinutes: activePaper.durationMinutes,
          updatedAt: activePaper.updatedAt,
        },
        mftSuite,
        customMocks,
        fullMocks: available.fullMocks.filter((m) => !customMocks.some((c) => c.id === m.id)),
        chapterTests: available.chapterTests.filter((c) => !customMocks.some((cm) => cm.id === c.id)),
      });
    }

    // 3. GET SPECIFIC TEST BY ID (Active, Custom, MFT, or Chapter Test)
    if (action === "get_test") {
      const testId = body.id || "active";
      let test: TestDetail | null = null;

      if (testId === "active") {
        test = getCustomTest("active");
        if (!test) {
          const activePaper = getActiveExamPaper();
          test = {
            id: "active",
            title: activePaper.title,
            source_file: "active",
            total_questions: activePaper.totalQuestions,
            duration_minutes: activePaper.durationMinutes,
            marks_per_question: activePaper.marksPerQuestion || 4,
            negative_marks: activePaper.negativeMarks || 1,
            sections: activePaper.subjects.map((s) => ({
              name: s.name,
              questions: s.questions.map((q) => ({
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
                correct_answer: q.correctAnswer,
                solution: q.solution,
                difficulty: q.difficulty || "Medium",
                has_image: q.imagePaths && q.imagePaths.length > 0 ? 1 : 0,
                image_paths: q.imagePaths || [],
              })),
            })),
          };
        }
      } else {
        test = getTestById(testId);
      }

      if (!test) {
        return NextResponse.json({ success: false, error: `Test '${testId}' not found.` }, { status: 404 });
      }

      return NextResponse.json({ success: true, test });
    }

    // 4. SAVE TEST (Custom Test or Active Test Paper)
    if (action === "save_test") {
      const testData = body.test as TestDetail;
      const makeActive = Boolean(body.makeActive);

      if (!testData || !Array.isArray(testData.sections)) {
        return NextResponse.json({ success: false, error: "Invalid test payload" }, { status: 400 });
      }

      saveCustomTest(testData, makeActive);

      return NextResponse.json({
        success: true,
        message: `Test '${testData.title}' saved successfully!`,
        test: testData,
      });
    }

    // 5. DELETE CUSTOM TEST
    if (action === "delete_test") {
      const testId = body.id;
      if (!testId || testId === "active") {
        return NextResponse.json({ success: false, error: "Cannot delete active base test." }, { status: 400 });
      }
      const deleted = deleteCustomTest(testId);
      return NextResponse.json({ success: deleted });
    }

    // 6. SET ANY TEST AS ACTIVE LIVE TEST PAPER
    if (action === "set_active") {
      const testId = body.id;
      if (!testId) {
        return NextResponse.json({ success: false, error: "Test ID required" }, { status: 400 });
      }

      const test = getTestById(testId);
      if (!test) {
        return NextResponse.json({ success: false, error: "Test not found to activate" }, { status: 404 });
      }

      syncToActiveExamPaper(test);

      return NextResponse.json({
        success: true,
        message: `Successfully set '${test.title}' as live active exam paper!`,
      });
    }

    // 7. LEGACY / DIRECT ACTIONS
    if (action === "get") {
      const paper = getActiveExamPaper();
      return NextResponse.json({ success: true, paper });
    }

    if (action === "reset") {
      const testId = body.id;
      if (testId && testId !== "active") {
        deleteCustomTest(testId);
        const original = getTestById(testId);
        return NextResponse.json({
          success: true,
          message: `Reset '${original?.title || testId}' back to original questions`,
          test: original,
        });
      }

      const defaultPaper = generateDefaultMockPaper();
      saveActiveExamPaper(defaultPaper);
      return NextResponse.json({
        success: true,
        message: "Paper reset to default 75 questions",
        paper: defaultPaper,
      });
    }

    if (action === "save_paper") {
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
    }

    return NextResponse.json({ success: false, error: `Unknown action: ${action}` }, { status: 400 });
  } catch (err: any) {
    console.error("Error in POST /api/admin/exam:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
