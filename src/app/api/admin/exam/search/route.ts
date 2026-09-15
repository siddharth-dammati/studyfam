import { NextRequest, NextResponse } from "next/server";
import { DatabaseSync } from "node:sqlite";
import path from "path";
import fs from "fs";
import { isAuthorizedAdmin } from "@/lib/adminAuth";

const DB_PATH = path.join(process.cwd(), "questions_database", "jee_questions.db");

export async function POST(request: NextRequest) {
  try {
    const isAuth = isAuthorizedAdmin(request);
    if (!isAuth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const subject = body.subject || "";
    const chapter = body.chapter || "";
    const query = (body.q || "").trim();
    const limit = Math.min(50, Math.max(5, Number(body.limit) || 20));

    if (!fs.existsSync(DB_PATH)) {
      return NextResponse.json({ success: false, error: "Questions database not found" }, { status: 404 });
    }

    const db = new DatabaseSync(DB_PATH, { readOnly: true });

    let sql = `
      SELECT id, subject, chapter, question_text, option_a, option_b, option_c, option_d, correct_answer, solution, difficulty, has_image, image_paths
      FROM questions
      WHERE 1=1
    `;
    const params: any[] = [];

    if (subject) {
      sql += ` AND subject = ?`;
      params.push(subject);
    }

    if (chapter) {
      sql += ` AND chapter LIKE ?`;
      params.push(`%${chapter}%`);
    }

    if (query) {
      sql += ` AND (question_text LIKE ? OR chapter LIKE ?)`;
      params.push(`%${query}%`, `%${query}%`);
    }

    sql += ` ORDER BY id ASC LIMIT ?`;
    params.push(limit);

    const rows = db.prepare(sql).all(...params) as any[];

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

      return {
        id: r.id,
        subject: r.subject,
        chapter: r.chapter,
        questionText: r.question_text || "",
        optionA: r.option_a,
        optionB: r.option_b,
        optionC: r.option_c,
        optionD: r.option_d,
        correctAnswer: r.correct_answer || "",
        solution: r.solution || "",
        difficulty: r.difficulty || "Medium",
        imagePaths: images,
      };
    });

    return NextResponse.json({ success: true, count: formatted.length, questions: formatted });
  } catch (err: any) {
    console.error("Error in POST /api/admin/exam/search:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
