import fs from "fs";
import path from "path";
import { DatabaseSync } from "node:sqlite";

export interface ActiveExamQuestion {
  id: string;
  subject: "Physics" | "Chemistry" | "Mathematics";
  section: "Section A (MCQ)" | "Section B (Numerical)";
  type: "MCQ" | "NUMERICAL";
  questionNumber: number; // 1 to 25 within subject
  overallNumber: number; // 1 to 75
  questionText: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  correctAnswer: string; // "A" | "B" | "C" | "D" or numeric string "25", "3.5"
  solution: string;
  imagePaths?: string[];
  chapter?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
}

export interface ActiveExamPaper {
  id: string;
  title: string;
  examCode: string;
  totalQuestions: number;
  durationMinutes: number;
  marksPerQuestion: number;
  negativeMarks: number;
  updatedAt: string;
  subjects: {
    name: "Physics" | "Chemistry" | "Mathematics";
    totalQuestions: number;
    mcqCount: number;
    numericalCount: number;
    questions: ActiveExamQuestion[];
  }[];
}

const CONFIG_FILE_PATH = path.join(process.cwd(), "questions_database", "active_exam_paper.json");
const DB_PATH = path.join(process.cwd(), "questions_database", "jee_questions.db");

// Seed default 75 questions (25 Physics, 25 Chemistry, 25 Mathematics)
export function generateDefaultMockPaper(): ActiveExamPaper {
  const subjects: Array<"Physics" | "Chemistry" | "Mathematics"> = [
    "Physics",
    "Chemistry",
    "Mathematics",
  ];

  let db: DatabaseSync | null = null;
  try {
    if (fs.existsSync(DB_PATH)) {
      db = new DatabaseSync(DB_PATH, { readOnly: true });
    }
  } catch (e) {
    console.warn("Could not open sqlite db for seeding default mock paper:", e);
  }

  const paperSubjects = subjects.map((subj) => {
    let rawQuestions: any[] = [];
    if (db) {
      try {
        rawQuestions = db
          .prepare(
            `SELECT id, subject, chapter, question_text, option_a, option_b, option_c, option_d, correct_answer, solution, difficulty, has_image, image_paths 
             FROM questions 
             WHERE subject = ? AND question_text IS NOT NULL AND length(question_text) > 20
             ORDER BY CASE WHEN source_file LIKE 'MFT-1%' THEN 0 ELSE 1 END, id ASC
             LIMIT 35`
          )
          .all(subj) as any[];
      } catch {}
    }

    const questions: ActiveExamQuestion[] = [];

    // 20 MCQs (Questions 1 to 20)
    for (let i = 1; i <= 20; i++) {
      const qData = rawQuestions[i - 1];
      const qId = qData?.id || `${subj.toLowerCase()}_mcq_${i}`;
      const optA = qData?.option_a || `Option A for question ${i}`;
      const optB = qData?.option_b || `Option B for question ${i}`;
      const optC = qData?.option_c || `Option C for question ${i}`;
      const optD = qData?.option_d || `Option D for question ${i}`;

      let correct = "A";
      const rawAns = (qData?.correct_answer || "").trim().toUpperCase();
      if (["A", "B", "C", "D"].includes(rawAns)) {
        correct = rawAns;
      } else if (rawAns === "1") correct = "A";
      else if (rawAns === "2") correct = "B";
      else if (rawAns === "3") correct = "C";
      else if (rawAns === "4") correct = "D";

      let imgPaths: string[] = [];
      if (qData?.image_paths) {
        try {
          const parsed = JSON.parse(qData.image_paths);
          if (Array.isArray(parsed)) {
            imgPaths = parsed.map((p) => `/exam-images/${p.replace(/^images[/\\]/, "")}`);
          }
        } catch {}
      }

      questions.push({
        id: qId,
        subject: subj,
        section: "Section A (MCQ)",
        type: "MCQ",
        questionNumber: i,
        overallNumber: subj === "Physics" ? i : subj === "Chemistry" ? 25 + i : 50 + i,
        questionText:
          qData?.question_text ||
          `Sample JEE Main ${subj} Question ${i}: Calculate the resultant force or equilibrium state under standard testing conditions.`,
        optionA: optA,
        optionB: optB,
        optionC: optC,
        optionD: optD,
        correctAnswer: correct,
        solution:
          qData?.solution ||
          `Detailed solution for ${subj} Q.${i}: Applying the governing physical laws and solving for the required variable gives Option (${correct}).`,
        imagePaths: imgPaths,
        chapter: qData?.chapter || `${subj} Core Topic`,
        difficulty: (qData?.difficulty as any) || "Medium",
      });
    }

    // 5 Numericals (Questions 21 to 25)
    for (let i = 21; i <= 25; i++) {
      const qData = rawQuestions[i - 1];
      const qId = qData?.id ? `${qData.id}_num` : `${subj.toLowerCase()}_num_${i}`;
      const defaultNumericalAnswers: Record<number, string> = {
        21: "4",
        22: "15",
        23: "2",
        24: "100",
        25: "8",
      };

      questions.push({
        id: qId,
        subject: subj,
        section: "Section B (Numerical)",
        type: "NUMERICAL",
        questionNumber: i,
        overallNumber: subj === "Physics" ? i : subj === "Chemistry" ? 25 + i : 50 + i,
        questionText:
          qData?.question_text ||
          `Numerical Question ${i} (${subj}): A system undergoes a thermodynamic process. Determine the numerical value of work done or required quantity (in SI units). (Nearest integer)`,
        correctAnswer: defaultNumericalAnswers[i] || "5",
        solution:
          qData?.solution ||
          `Step 1: Write down the given parameters.\nStep 2: Apply the formula.\nStep 3: Calculating yields the final integer value of ${
            defaultNumericalAnswers[i] || "5"
          }.`,
        chapter: qData?.chapter || `${subj} Numerical Problem`,
        difficulty: "Medium",
        imagePaths: [],
      });
    }

    return {
      name: subj,
      totalQuestions: 25,
      mcqCount: 20,
      numericalCount: 5,
      questions,
    };
  });

  return {
    id: "jee_main_75_official_mock",
    title: "JEE (Main) - All India Major Mock Test 2027",
    examCode: "NTA-JEE-2027-SHIFT2",
    totalQuestions: 75,
    durationMinutes: 180,
    marksPerQuestion: 4,
    negativeMarks: 1,
    updatedAt: new Date().toISOString(),
    subjects: paperSubjects,
  };
}

export function getActiveExamPaper(): ActiveExamPaper {
  if (fs.existsSync(CONFIG_FILE_PATH)) {
    try {
      const raw = fs.readFileSync(CONFIG_FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.subjects) && parsed.subjects.length === 3) {
        return parsed;
      }
    } catch (e) {
      console.error("Error reading active_exam_paper.json:", e);
    }
  }

  // Fallback & generate default
  const defaultPaper = generateDefaultMockPaper();
  saveActiveExamPaper(defaultPaper);
  return defaultPaper;
}

export function saveActiveExamPaper(paper: ActiveExamPaper): void {
  try {
    const dir = path.dirname(CONFIG_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    paper.updatedAt = new Date().toISOString();
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(paper, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving active_exam_paper.json:", e);
    throw e;
  }
}
