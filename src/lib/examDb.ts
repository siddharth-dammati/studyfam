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

import { getCustomTest, listCustomTests } from "@/lib/customTestService";

export function getAvailableTests(): { fullMocks: TestSummary[]; chapterTests: TestSummary[] } {
  const db = getDb();
  const query = `
    SELECT 
      source_file,
      subject,
      chapter,
      count(*) as question_count
    FROM questions 
    WHERE source_file LIKE 'MFT-%'
    GROUP BY source_file 
    HAVING question_count >= 5
    ORDER BY source_file ASC
  `;

  const rows = db.prepare(query).all() as Array<{
    source_file: string;
    subject: string;
    chapter: string;
    question_count: number;
  }>;

  const fullMocks: TestSummary[] = [];
  const chapterTests: TestSummary[] = [];

  // Add custom tests first
  try {
    const customSummaries = listCustomTests();
    for (const c of customSummaries) {
      if (c.is_full_mock) {
        fullMocks.push(c);
      }
    }
  } catch (e) {
    console.warn("Failed to list custom tests in getAvailableTests:", e);
  }

  for (const r of rows) {
    const cleanTitle = r.source_file.replace(/\.pdf$/i, "").replace(/_/g, " ");

    const summary: TestSummary = {
      id: encodeURIComponent(r.source_file),
      title: `JEE Main - ${cleanTitle} (Official Pattern)`,
      source_file: r.source_file,
      subject: "All Subjects",
      chapter: r.chapter,
      question_count: Number(r.question_count),
      duration_minutes: 180,
      is_full_mock: true,
    };

    fullMocks.push(summary);
  }

  return { fullMocks, chapterTests };
}

export function getTestById(testId: string): TestDetail | null {
  const cleanId = decodeURIComponent(testId);

  // 1. Check if it is a custom created/curated test or active paper
  try {
    const custom = getCustomTest(cleanId);
    if (custom) return custom;
  } catch (e) {
    console.warn("Error checking custom test in getTestById:", e);
  }

  const db = getDb();
  let decodedFile = cleanId;
  const mftMatch = cleanId.match(/^MFT-0?(\d+)(\.pdf)?$/i);
  if (mftMatch) {
    decodedFile = `MFT-${mftMatch[1]}.pdf`;
  }

  const query = `
    SELECT 
      id, subject, unit_id, unit_name, chapter, source_file, 
      question_number, question_text, option_a, option_b, option_c, option_d, 
      correct_answer, solution, difficulty, has_image, image_paths
    FROM questions 
    WHERE source_file = ? OR source_file = ? OR source_file = ?
    ORDER BY 
      CASE 
        WHEN subject = 'Physics' THEN 1
        WHEN subject = 'Chemistry' THEN 2
        WHEN subject = 'Mathematics' THEN 3
        ELSE 4
      END,
      question_number ASC
  `;

  const rows = db.prepare(query).all(decodedFile, cleanId, `${cleanId}.pdf`) as any[];

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
  id?: string;
  testId: string;
  testTitle?: string;
  createdAt?: string;
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
    chapter?: string;
    difficulty?: string;
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
    timeSpentSeconds?: number;
  }[];
  questionTimes?: Record<string, number>;
  submissionReason?: string;
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
          const hasKnownAnswer = Boolean(q.correct_answer && q.correct_answer !== "—" && q.correct_answer !== "-");
          if (hasKnownAnswer) {
            incorrectCount++;
            secStats.incorrect++;
            marksAwarded = -test.negative_marks;
            totalScore -= test.negative_marks;
            secStats.score -= test.negative_marks;
          } else {
            marksAwarded = 0;
          }
        }
      }

      detailedResults.push({
        questionId: q.id,
        questionNumber: q.question_number,
        subject: q.subject,
        chapter: q.chapter || "General",
        difficulty: q.difficulty || "Medium",
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
  if (!userAns) return false;
  const rawUser = userAns.trim();
  const normUser = rawUser.toLowerCase();
  const rawCorrect = (q.correct_answer || "").trim();
  const normCorrect = rawCorrect.toLowerCase();

  // 1. Direct string match
  if (normCorrect && normUser === normCorrect) return true;

  // 2. Letter to Number bidirectional mapping (A <-> 1, B <-> 2, C <-> 3, D <-> 4)
  const mapLetterToNum: Record<string, string> = { a: "1", b: "2", c: "3", d: "4" };
  const mapNumToLetter: Record<string, string> = { "1": "a", "2": "b", "3": "c", "4": "d" };
  if (mapLetterToNum[normUser] === normCorrect || mapLetterToNum[normCorrect] === normUser) return true;
  if (mapNumToLetter[normUser] === normCorrect || mapNumToLetter[normCorrect] === normUser) return true;

  // 3. Option text match
  const optA = (q.option_a || "").trim().toLowerCase();
  const optB = (q.option_b || "").trim().toLowerCase();
  const optC = (q.option_c || "").trim().toLowerCase();
  const optD = (q.option_d || "").trim().toLowerCase();

  let chosenText = "";
  if (normUser === "a" || normUser === "1") chosenText = optA;
  else if (normUser === "b" || normUser === "2") chosenText = optB;
  else if (normUser === "c" || normUser === "3") chosenText = optC;
  else if (normUser === "d" || normUser === "4") chosenText = optD;

  if (chosenText && normCorrect && (chosenText === normCorrect || normCorrect.includes(chosenText))) return true;

  // 4. Numerical float comparison
  const numUser = parseFloat(normUser);
  const numCorrect = parseFloat(normCorrect);
  if (!isNaN(numUser) && !isNaN(numCorrect)) {
    if (Math.abs(numUser - numCorrect) < 0.05) return true;
  }

  // 5. Solution check fallback
  const sol = (q.solution || "").trim();
  if (sol) {
    const solLower = sol.toLowerCase();

    // Check for explicit option mentions in solution
    const isLetter = ["a", "b", "c", "d"].includes(normUser);
    const isDigit = ["1", "2", "3", "4"].includes(normUser);
    if (isLetter || isDigit) {
      const letter = isLetter ? normUser : ["a", "b", "c", "d"][parseInt(normUser, 10) - 1];
      const digit = isDigit ? normUser : String(["a", "b", "c", "d"].indexOf(normUser) + 1);

      if (
        solLower.includes(`correct option is (${letter})`) ||
        solLower.includes(`correct option is ${letter}`) ||
        solLower.includes(`option (${letter}) is correct`) ||
        solLower.includes(`(${letter}) is correct`) ||
        solLower.includes(`correct option is (${digit})`) ||
        solLower.includes(`correct option is ${digit}`) ||
        solLower.includes(`option (${digit}) is correct`) ||
        solLower.includes(`(${digit}) is correct`) ||
        solLower.includes(`ans. (${digit})`) ||
        solLower.includes(`ans. (${letter})`)
      ) {
        return true;
      }
    }

    // Numerical in solution
    if (!isNaN(numUser)) {
      const patterns = [
        /(?:=|is|comes out to be|equal to|value of [a-zA-Zα-ωΑ-Ω_0-9\s]+ is|total|hence|therefore|∴|⇒)\s*(-?\d+(?:\.\d+)?)\s*(?:Ω|ohm|cm|m|s|j|kg|v|w|a|hz|k|n|c|deg|%|rad|mol|isomers|mole\/l)?(?:\.|\s|$)/gi,
      ];
      for (const pattern of patterns) {
        const matches = [...sol.matchAll(pattern)];
        for (const m of matches) {
          const extractedVal = parseFloat(m[1]);
          if (!isNaN(extractedVal) && Math.abs(numUser - extractedVal) < 0.05) {
            return true;
          }
        }
      }
    }
  }

  return false;
}
