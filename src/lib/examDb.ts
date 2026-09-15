import { DatabaseSync } from "node:sqlite";
import path from "path";
import fs from "fs";

export interface QuestionRecord {
  id: string;
  subject: string;
  unit_id: string;
  unit_name: string;
  chapter: string;
  source_file: string;
  question_number: number;
  question_text: string;
  option_a: string | null;
  option_b: string | null;
  option_c: string | null;
  option_d: string | null;
  correct_answer: string;
  solution: string;
  difficulty: string;
  has_image: number;
  image_paths: string[];
}

export interface TestSection {
  name: string;
  questions: QuestionRecord[];
}

export interface TestDetail {
  id: string;
  title: string;
  source_file: string;
  total_questions: number;
  duration_minutes: number;
  marks_per_question: number;
  negative_marks: number;
  sections: TestSection[];
}

export interface TestSummary {
  id: string;
  title: string;
  source_file: string;
  subject: string;
  chapter?: string;
  question_count: number;
  duration_minutes: number;
  is_full_mock: boolean;
}

let dbInstance: DatabaseSync | null = null;

function getDb(): DatabaseSync {
  if (!dbInstance) {
    const dbPath = path.join(process.cwd(), "questions_database", "jee_questions.db");
    if (!fs.existsSync(dbPath)) {
      throw new Error(`Database file not found at: ${dbPath}`);
    }
    dbInstance = new DatabaseSync(dbPath, { readOnly: true });
  }
  return dbInstance;
}

function normalizeImagePaths(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((p) => `/exam-images/${p.replace(/^images[/\\]/, "")}`);
    }
  } catch {
    // fallback
  }
  return [];
}

export function getAvailableTests(): { fullMocks: TestSummary[]; chapterTests: TestSummary[] } {
  const db = getDb();
  const query = `
    SELECT 
      source_file,
      subject,
      chapter,
      count(*) as question_count
    FROM questions 
    GROUP BY source_file 
    HAVING question_count >= 5
    ORDER BY 
      CASE WHEN source_file LIKE 'MFT-%' THEN 0 ELSE 1 END,
      source_file ASC
  `;

  const rows = db.prepare(query).all() as Array<{
    source_file: string;
    subject: string;
    chapter: string;
    question_count: number;
  }>;

  const fullMocks: TestSummary[] = [];
  const chapterTests: TestSummary[] = [];

  for (const r of rows) {
    const isMft = r.source_file.startsWith("MFT-");
    const isMock = isMft || r.question_count >= 60;
    const cleanTitle = r.source_file.replace(/\.pdf$/i, "").replace(/_/g, " ");

    const summary: TestSummary = {
      id: encodeURIComponent(r.source_file),
      title: isMft ? `JEE Main - ${cleanTitle} (Official Pattern)` : cleanTitle,
      source_file: r.source_file,
      subject: isMock ? "All Subjects" : r.subject,
      chapter: r.chapter,
      question_count: Number(r.question_count),
      duration_minutes: isMock ? 180 : Math.max(30, Math.round(r.question_count * 2.4)),
      is_full_mock: isMock,
    };

    if (isMock) {
      fullMocks.push(summary);
    } else {
      chapterTests.push(summary);
    }
  }

  return { fullMocks, chapterTests };
}

export function getTestById(testId: string): TestDetail | null {
  const db = getDb();
  const decodedFile = decodeURIComponent(testId);

  const query = `
    SELECT 
      id, subject, unit_id, unit_name, chapter, source_file, 
      question_number, question_text, option_a, option_b, option_c, option_d, 
      correct_answer, solution, difficulty, has_image, image_paths
    FROM questions 
    WHERE source_file = ?
    ORDER BY 
      CASE 
        WHEN subject = 'Physics' THEN 1
        WHEN subject = 'Chemistry' THEN 2
        WHEN subject = 'Mathematics' THEN 3
        ELSE 4
      END,
      question_number ASC
  `;

  const rows = db.prepare(query).all(decodedFile) as any[];

  if (!rows || rows.length === 0) {
    return null;
  }

  const isMft = decodedFile.startsWith("MFT-");
  const isMock = isMft || rows.length >= 60;
  const cleanTitle = decodedFile.replace(/\.pdf$/i, "").replace(/_/g, " ");

  const sectionMap = new Map<string, QuestionRecord[]>();

  for (const row of rows) {
    const secName = row.subject || "General";
    if (!sectionMap.has(secName)) {
      sectionMap.set(secName, []);
    }

    sectionMap.get(secName)!.push({
      id: row.id,
      subject: row.subject,
      unit_id: row.unit_id,
      unit_name: row.unit_name,
      chapter: row.chapter,
      source_file: row.source_file,
      question_number: Number(row.question_number),
      question_text: row.question_text || "",
      option_a: row.option_a,
      option_b: row.option_b,
      option_c: row.option_c,
      option_d: row.option_d,
      correct_answer: row.correct_answer || "",
      solution: row.solution || "",
      difficulty: row.difficulty || "Medium",
      has_image: Number(row.has_image || 0),
      image_paths: normalizeImagePaths(row.image_paths),
    });
  }

  const sections: TestSection[] = [];
  const preferredOrder = ["Physics", "Chemistry", "Mathematics"];
  for (const p of preferredOrder) {
    if (sectionMap.has(p)) {
      sections.push({
        name: p,
        questions: sectionMap.get(p)!,
      });
      sectionMap.delete(p);
    }
  }
  for (const [name, questions] of sectionMap.entries()) {
    sections.push({ name, questions });
  }

  return {
    id: encodeURIComponent(decodedFile),
    title: isMft ? `JEE Main - ${cleanTitle}` : cleanTitle,
    source_file: decodedFile,
    total_questions: rows.length,
    duration_minutes: isMock ? 180 : Math.max(30, Math.round(rows.length * 2.4)),
    marks_per_question: 4,
    negative_marks: 1,
    sections,
  };
}

export interface EvaluationResult {
  testId: string;
  totalQuestions: number;
  attemptedCount: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  totalScore: number;
  maxScore: number;
  percentage: number;
  accuracy: number;
  timeSpentSeconds: number;
  sectionBreakdown: {
    sectionName: string;
    total: number;
    attempted: number;
    correct: number;
    incorrect: number;
    score: number;
  }[];
  detailedResults: {
    questionId: string;
    questionNumber: number;
    subject: string;
    questionText: string;
    optionA: string | null;
    optionB: string | null;
    optionC: string | null;
    optionD: string | null;
    imagePaths: string[];
    userResponse: string | null;
    correctAnswer: string;
    isCorrect: boolean;
    solution: string;
    marksAwarded: number;
  }[];
}

export function evaluateTest(
  testId: string,
  userResponses: Record<string, string>,
  timeSpentSeconds: number
): EvaluationResult | null {
  const test = getTestById(testId);
  if (!test) return null;

  let totalQuestions = 0;
  let attemptedCount = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let totalScore = 0;

  const sectionMap = new Map<
    string,
    { total: number; attempted: number; correct: number; incorrect: number; score: number }
  >();

  const detailedResults: EvaluationResult["detailedResults"] = [];

  for (const sec of test.sections) {
    if (!sectionMap.has(sec.name)) {
      sectionMap.set(sec.name, { total: 0, attempted: 0, correct: 0, incorrect: 0, score: 0 });
    }
    const secStats = sectionMap.get(sec.name)!;

    for (const q of sec.questions) {
      totalQuestions++;
      secStats.total++;

      const userAns = userResponses[q.id]?.trim() || null;
      const isAttempted = Boolean(userAns);

      let isCorrect = false;
      let marksAwarded = 0;

      if (isAttempted) {
        attemptedCount++;
        secStats.attempted++;

        isCorrect = checkIsCorrect(userAns!, q);

        if (isCorrect) {
          correctCount++;
          secStats.correct++;
          marksAwarded = test.marks_per_question;
          totalScore += test.marks_per_question;
          secStats.score += test.marks_per_question;
        } else {
          incorrectCount++;
          secStats.incorrect++;
          marksAwarded = -test.negative_marks;
          totalScore -= test.negative_marks;
          secStats.score -= test.negative_marks;
        }
      }

      detailedResults.push({
        questionId: q.id,
        questionNumber: q.question_number,
        subject: q.subject,
        questionText: q.question_text,
        optionA: q.option_a,
        optionB: q.option_b,
        optionC: q.option_c,
        optionD: q.option_d,
        imagePaths: q.image_paths,
        userResponse: userAns,
        correctAnswer: q.correct_answer,
        isCorrect,
        solution: q.solution,
        marksAwarded,
      });
    }
  }

  const unattemptedCount = totalQuestions - attemptedCount;
  const maxScore = totalQuestions * test.marks_per_question;
  const percentage = maxScore > 0 ? Math.max(0, Math.round((totalScore / maxScore) * 100 * 10) / 10) : 0;
  const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100 * 10) / 10 : 0;

  const sectionBreakdown = Array.from(sectionMap.entries()).map(([sectionName, stats]) => ({
    sectionName,
    ...stats,
  }));

  return {
    testId,
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

function checkIsCorrect(userAns: string, q: QuestionRecord): boolean {
  const normUser = userAns.trim().toLowerCase();
  const normCorrect = (q.correct_answer || "").trim().toLowerCase();

  if (normUser === normCorrect) return true;

  const mapLetterToNum: Record<string, string> = { a: "1", b: "2", c: "3", d: "4" };
  const mapNumToLetter: Record<string, string> = { "1": "a", "2": "b", "3": "c", "4": "d" };

  if (mapLetterToNum[normUser] && mapLetterToNum[normUser] === normCorrect) return true;
  if (mapNumToLetter[normCorrect] && mapNumToLetter[normCorrect] === normUser) return true;

  let chosenOptionText = "";
  if (normUser === "a") chosenOptionText = (q.option_a || "").trim().toLowerCase();
  if (normUser === "b") chosenOptionText = (q.option_b || "").trim().toLowerCase();
  if (normUser === "c") chosenOptionText = (q.option_c || "").trim().toLowerCase();
  if (normUser === "d") chosenOptionText = (q.option_d || "").trim().toLowerCase();

  if (chosenOptionText && normCorrect && chosenOptionText === normCorrect) return true;

  const sol = (q.solution || "").toLowerCase();
  if (
    sol.includes(`correct option is (${normUser})`) ||
    sol.includes(`correct option is ${normUser}`) ||
    sol.includes(`option (${normUser}) is correct`) ||
    sol.includes(`(${normUser}) is correct`)
  ) {
    return true;
  }

  return false;
}
