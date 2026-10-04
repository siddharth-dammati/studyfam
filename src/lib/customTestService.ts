import fs from "fs";
import path from "path";
import { DatabaseSync } from "node:sqlite";
import { TestDetail, QuestionRecord, TestSummary } from "@/lib/examDb";
import { ActiveExamPaper, ActiveExamQuestion, saveActiveExamPaper } from "@/lib/activeExamService";

const CUSTOM_TESTS_DIR = path.join(process.cwd(), "questions_database", "custom_tests");
const DB_PATH = path.join(process.cwd(), "questions_database", "jee_questions.db");
const ACTIVE_CONFIG_PATH = path.join(process.cwd(), "questions_database", "active_exam_paper.json");

function ensureDir() {
  if (!fs.existsSync(CUSTOM_TESTS_DIR)) {
    fs.mkdirSync(CUSTOM_TESTS_DIR, { recursive: true });
  }
}

export function listCustomTests(): TestSummary[] {
  ensureDir();
  const files = fs.readdirSync(CUSTOM_TESTS_DIR).filter((f) => f.endsWith(".json"));
  const summaries: TestSummary[] = [];

  for (const f of files) {
    try {
      const fullPath = path.join(CUSTOM_TESTS_DIR, f);
      const raw = fs.readFileSync(fullPath, "utf-8");
      const test = JSON.parse(raw) as TestDetail & { is_custom?: boolean; updatedAt?: string; is_unlisted?: boolean; unlisted?: boolean };
      if (test && test.id && Array.isArray(test.sections)) {
        // Skip unlisted / secret tests from public mock test listings
        if (test.is_unlisted || (test as any).unlisted) {
          continue;
        }

        const totalQ = test.sections.reduce((acc, s) => acc + (s.questions?.length || 0), 0);
        const isMftOverride = test.id.startsWith("MFT-");
        summaries.push({
          id: test.id,
          title: test.title || f.replace(/\.json$/i, ""),
          source_file: test.source_file || f,
          subject: test.sections.length === 1 ? test.sections[0].name : "All Subjects",
          chapter: test.sections.length === 1 ? test.sections[0].questions[0]?.chapter : undefined,
          question_count: totalQ || test.total_questions || 0,
          duration_minutes: test.duration_minutes || 180,
          is_full_mock: isMftOverride || totalQ >= 50 || test.sections.length > 1,
        });
      }
    } catch (e) {
      console.warn(`Error reading custom test file ${f}:`, e);
    }
  }

  return summaries;
}

export function getCustomTest(testId: string): TestDetail | null {
  ensureDir();
  const cleanId = decodeURIComponent(testId).trim();

  // 1. If asking for "active", load from active_exam_paper.json
  if (cleanId === "active") {
    if (fs.existsSync(ACTIVE_CONFIG_PATH)) {
      try {
        const raw = fs.readFileSync(ACTIVE_CONFIG_PATH, "utf-8");
        const activePaper = JSON.parse(raw) as ActiveExamPaper;
        if (activePaper && Array.isArray(activePaper.subjects)) {
          return {
            id: "active",
            title: activePaper.title || "Live Active JEE Main Mock Test",
            source_file: "active",
            total_questions: activePaper.totalQuestions || 75,
            duration_minutes: activePaper.durationMinutes || 180,
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
      } catch (e) {
        console.warn("Failed to parse active_exam_paper.json:", e);
      }
    }
  }

  const baseName = cleanId.replace(/\.pdf$/i, "").replace(/\.json$/i, "");
  const mftMatch = cleanId.match(/^MFT-0?(\d+)/i);
  const normalizedMftName = mftMatch ? `MFT-${mftMatch[1]}` : null;

  const candidatePaths = [
    path.join(CUSTOM_TESTS_DIR, `${cleanId}.json`),
    path.join(CUSTOM_TESTS_DIR, cleanId),
    path.join(CUSTOM_TESTS_DIR, `${baseName}.json`),
    path.join(CUSTOM_TESTS_DIR, `${baseName}.pdf.json`),
  ];

  if (normalizedMftName) {
    candidatePaths.push(
      path.join(CUSTOM_TESTS_DIR, `${normalizedMftName}.pdf.json`),
      path.join(CUSTOM_TESTS_DIR, `${normalizedMftName}.json`)
    );
  }

  for (const p of candidatePaths) {
    if (fs.existsSync(p) && fs.statSync(p).isFile()) {
      try {
        const raw = fs.readFileSync(p, "utf-8");
        return JSON.parse(raw);
      } catch {}
    }
  }

  return null;
}

export function saveCustomTest(test: TestDetail, makeActive = false): boolean {
  ensureDir();
  if (!test.id) {
    test.id = `custom_${Date.now()}`;
  }

  const cleanId = decodeURIComponent(test.id).trim();
  const baseName = cleanId.replace(/\.pdf$/i, "").replace(/\.json$/i, "");
  
  // If it is an MFT (e.g. MFT-1 or MFT-1.pdf)
  const isMft = baseName.toUpperCase().startsWith("MFT-");
  const safeFilename = isMft ? `${baseName}.pdf.json` : cleanId.endsWith(".json") ? cleanId : `${cleanId}.json`;
  const filePath = path.join(CUSTOM_TESTS_DIR, safeFilename);

  // Recalculate total_questions
  const totalQuestions = test.sections.reduce((acc, s) => acc + (s.questions?.length || 0), 0);
  test.total_questions = totalQuestions;

  fs.writeFileSync(filePath, JSON.stringify(test, null, 2), "utf-8");

  // If makeActive or test.id === "active", also update active_exam_paper.json
  if (makeActive || test.id === "active") {
    syncToActiveExamPaper(test);
  }

  return true;
}

export function deleteCustomTest(testId: string): boolean {
  ensureDir();
  const cleanId = decodeURIComponent(testId).trim();
  const baseName = cleanId.replace(/\.pdf$/i, "").replace(/\.json$/i, "");

  const candidatePaths = [
    path.join(CUSTOM_TESTS_DIR, `${cleanId}.json`),
    path.join(CUSTOM_TESTS_DIR, cleanId),
    path.join(CUSTOM_TESTS_DIR, `${baseName}.json`),
    path.join(CUSTOM_TESTS_DIR, `${baseName}.pdf.json`),
  ];

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
      return true;
    }
  }
  return false;
}

export function syncToActiveExamPaper(test: TestDetail): void {
  const subjectsMap: Record<"Physics" | "Chemistry" | "Mathematics", ActiveExamQuestion[]> = {
    Physics: [],
    Chemistry: [],
    Mathematics: [],
  };

  let overallCounter = 1;

  for (const sec of test.sections) {
    const subjName = (sec.name === "Maths" ? "Mathematics" : sec.name) as "Physics" | "Chemistry" | "Mathematics";
    if (!subjectsMap[subjName]) {
      subjectsMap[subjName] = [];
    }

    sec.questions.forEach((q, idx) => {
      const isNum = !q.option_a && !q.option_b;
      const qNum = idx + 1;
      const type: "MCQ" | "NUMERICAL" = isNum ? "NUMERICAL" : "MCQ";
      const sectionLabel = isNum ? "Section B (Numerical)" : "Section A (MCQ)";

      // Canonical correct answer
      let cleanAns = (q.correct_answer || (isNum ? "10" : "A")).trim();
      if (!isNum && cleanAns.length > 1) {
        // Try to match option
        const normAns = cleanAns.toLowerCase();
        const opts = [
          (q.option_a || "").trim().toLowerCase(),
          (q.option_b || "").trim().toLowerCase(),
          (q.option_c || "").trim().toLowerCase(),
          (q.option_d || "").trim().toLowerCase(),
        ];
        const matchIdx = opts.findIndex(o => o && (o === normAns || normAns.includes(o) || o.includes(normAns)));
        if (matchIdx >= 0) {
          cleanAns = ["A", "B", "C", "D"][matchIdx];
        } else {
          cleanAns = "A";
        }
      }

      subjectsMap[subjName].push({
        id: q.id || `active_${subjName.toLowerCase()}_${qNum}`,
        subject: subjName,
        section: sectionLabel,
        type: type,
        questionNumber: qNum,
        overallNumber: overallCounter++,
        questionText: q.question_text || "",
        optionA: q.option_a || undefined,
        optionB: q.option_b || undefined,
        optionC: q.option_c || undefined,
        optionD: q.option_d || undefined,
        correctAnswer: cleanAns,
        solution: q.solution || "Step-by-step solution from database.",
        chapter: q.chapter || `${subjName} Core`,
        difficulty: (q.difficulty as any) || "Medium",
        imagePaths: q.image_paths || [],
      });
    });
  }

  const activePaper: ActiveExamPaper = {
    id: "active",
    title: test.title || "All India Joint Entrance Examination (Main) - Active Mock Paper",
    examCode: "JEE-MAIN-ACTIVE",
    totalQuestions: test.total_questions || 75,
    durationMinutes: test.duration_minutes || 180,
    marksPerQuestion: test.marks_per_question || 4,
    negativeMarks: test.negative_marks || 1,
    updatedAt: new Date().toISOString(),
    subjects: [
      {
        name: "Physics",
        totalQuestions: subjectsMap.Physics.length,
        mcqCount: subjectsMap.Physics.filter((q) => q.type === "MCQ").length,
        numericalCount: subjectsMap.Physics.filter((q) => q.type === "NUMERICAL").length,
        questions: subjectsMap.Physics,
      },
      {
        name: "Chemistry",
        totalQuestions: subjectsMap.Chemistry.length,
        mcqCount: subjectsMap.Chemistry.filter((q) => q.type === "MCQ").length,
        numericalCount: subjectsMap.Chemistry.filter((q) => q.type === "NUMERICAL").length,
        questions: subjectsMap.Chemistry,
      },
      {
        name: "Mathematics",
        totalQuestions: subjectsMap.Mathematics.length,
        mcqCount: subjectsMap.Mathematics.filter((q) => q.type === "MCQ").length,
        numericalCount: subjectsMap.Mathematics.filter((q) => q.type === "NUMERICAL").length,
        questions: subjectsMap.Mathematics,
      },
    ],
  };

  saveActiveExamPaper(activePaper);
}
