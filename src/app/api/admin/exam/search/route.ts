export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { DatabaseSync } from "node:sqlite";
import path from "path";
import fs from "fs";
import { isAuthorizedAdmin } from "@/lib/adminAuth";

const DB_PATH = path.join(process.cwd(), "questions_database", "jee_questions.db");

function cleanText(t?: string | null): string {
  if (!t) return "";
  return t
    .replace(/\r/g, "")
    .replace(/\n(?=[0-9a-zA-Z+\-∘])/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    const isAuth = isAuthorizedAdmin(request);
    if (!isAuth) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const subject = (body.subject || "").trim();
    const chapter = (body.chapter || "").trim();
    const questionType = (body.questionType || "ALL").trim().toUpperCase(); // "MCQ" | "NUMERICAL" | "ALL"
    const difficulty = (body.difficulty || "ALL").trim(); // "Easy" | "Medium" | "Hard" | "ALL"
    const hasImage = body.hasImage; // true | false | undefined
    const query = (body.q || "").trim();
    const limit = Math.min(100, Math.max(5, Number(body.limit) || 25));
    const offset = Math.max(0, Number(body.offset) || 0);

    if (!fs.existsSync(DB_PATH)) {
      return NextResponse.json({ success: false, error: "Database not found" }, { status: 500 });
    }

    const db = new DatabaseSync(DB_PATH, { readOnly: true });

    // Build WHERE clauses
    const where: string[] = ["1=1"];
    const params: any[] = [];

    // 1. Subject filter
    if (subject && subject !== "ALL") {
      where.push("subject = ?");
      params.push(subject);
    }

    // 2. Chapter filter
    if (chapter && chapter !== "ALL" && chapter !== "All Chapters") {
      where.push("chapter = ?");
      params.push(chapter);
    }

    // 3. Difficulty filter (Easy / Medium / Hard)
    if (difficulty && difficulty !== "ALL" && difficulty !== "All Difficulties") {
      where.push("difficulty = ?");
      params.push(difficulty);
    }

    // 4. Question Type filter (MCQ vs NUMERICAL)
    if (questionType === "MCQ") {
      where.push("(option_a IS NOT NULL AND length(option_a) > 0)");
    } else if (questionType === "NUMERICAL") {
      where.push("(option_a IS NULL OR length(option_a) = 0)");
    }

    // 5. Has Image filter
    if (hasImage === true || hasImage === "true") {
      where.push("has_image = 1");
    } else if (hasImage === false || hasImage === "false") {
      where.push("has_image = 0");
    }

    // 6. Text search query
    if (query) {
      where.push("(question_text LIKE ? OR chapter LIKE ? OR solution LIKE ?)");
      params.push(`%${query}%`, `%${query}%`, `%${query}%`);
    }

    const whereSql = where.join(" AND ");

    // Get Total Count matching filters
    const countSql = `SELECT count(*) as count FROM questions WHERE ${whereSql}`;
    const countRow = db.prepare(countSql).get(...params) as { count: number };
    const totalCount = countRow?.count || 0;

    // Get matching questions with limit and offset
    const selectSql = `
      SELECT id, subject, unit_id, unit_name, chapter, question_number, question_text, 
             option_a, option_b, option_c, option_d, correct_answer, solution, 
             difficulty, has_image, image_paths
      FROM questions
      WHERE ${whereSql}
      ORDER BY id ASC
      LIMIT ? OFFSET ?
    `;

    const rows = db.prepare(selectSql).all(...params, limit, offset) as any[];

    const formatted = rows.map((r) => {
      let images: string[] = [];
      if (r.image_paths) {
        try {
          const parsed = JSON.parse(r.image_paths);
          if (Array.isArray(parsed)) {
            images = parsed.map((p) => `/exam-images/${p.replace(/^images[/\\]/, "")}`);
          }
        } catch {}
      }

      const isMcq = Boolean(r.option_a && r.option_a.trim().length > 0);
      let cleanAnswer = (r.correct_answer || (isMcq ? "A" : "0")).trim();
      if (isMcq) {
        const upper = cleanAnswer.toUpperCase();
        if (["A", "B", "C", "D"].includes(upper)) {
          cleanAnswer = upper;
        } else if (upper === "1") cleanAnswer = "A";
        else if (upper === "2") cleanAnswer = "B";
        else if (upper === "3") cleanAnswer = "C";
        else if (upper === "4") cleanAnswer = "D";
        else {
          const normAns = cleanAnswer.toLowerCase();
          const opts = [
            cleanText(r.option_a).toLowerCase(),
            cleanText(r.option_b).toLowerCase(),
            cleanText(r.option_c).toLowerCase(),
            cleanText(r.option_d).toLowerCase(),
          ];
          const foundIdx = opts.findIndex((o) => o && (o === normAns || normAns.includes(o) || o.includes(normAns)));
          cleanAnswer = foundIdx >= 0 ? ["A", "B", "C", "D"][foundIdx] : "A";
        }
      } else {
        if (cleanAnswer === "—" || cleanAnswer === "----" || cleanAnswer === "" || !cleanAnswer) {
          const solMatch = r.solution
            ? r.solution.match(/(?:Ans(?:wer)?|equal(?:s)? to|value of [a-zA-Z\s]+ is|is)\s*[:=]?\s*([0-9]+(?:\.[0-9]+)?)/i)
            : null;
          cleanAnswer = solMatch ? solMatch[1] : "0";
        }
      }

      return {
        id: r.id,
        subject: r.subject,
        unit_id: r.unit_id || "",
        unit_name: r.unit_name || "",
        chapter: cleanText(r.chapter),
        questionText: cleanText(r.question_text),
        type: isMcq ? "MCQ" : "NUMERICAL",
        optionA: cleanText(r.option_a) || (isMcq ? "Option A" : undefined),
        optionB: cleanText(r.option_b) || (isMcq ? "Option B" : undefined),
        optionC: cleanText(r.option_c) || (isMcq ? "Option C" : undefined),
        optionD: cleanText(r.option_d) || (isMcq ? "Option D" : undefined),
        correctAnswer: cleanAnswer,
        solution: cleanText(r.solution) || "Step-by-step solution from database.",
        difficulty: r.difficulty || "Medium",
        hasImage: Boolean(r.has_image),
        imagePaths: images,
      };
    });

    return NextResponse.json({
      success: true,
      total: totalCount,
      count: formatted.length,
      limit,
      offset,
      questions: formatted,
    });
  } catch (err: any) {
    console.error("Error in POST /api/admin/exam/search:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
