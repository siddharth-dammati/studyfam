import { NextRequest, NextResponse } from "next/server";
import { DatabaseSync } from "node:sqlite";
import path from "path";
import fs from "fs";
import { isAuthorizedAdmin } from "@/lib/adminAuth";
import CURATED_BANK from "../../../../../../questions_database/curated_question_bank.json";

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
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const subject = (body.subject || "").trim();
    const chapter = (body.chapter || "").trim();
    const query = (body.q || "").trim();
    const limit = Math.min(50, Math.max(5, Number(body.limit) || 20));

    // Tokenize query words
    const rawTokens = (query || chapter)
      .toLowerCase()
      .split(/[\s,()&_\-\/]+/)
      .filter((w: string) => w.length > 2 && !["and", "the", "for", "with", "from", "into", "that", "this"].includes(w));

    // 1. First try SQLite if available
    if (fs.existsSync(DB_PATH)) {
      try {
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

        if (rawTokens.length > 0) {
          const tokenClauses = rawTokens.map(() => `(question_text LIKE ? OR chapter LIKE ?)`).join(" OR ");
          sql += ` AND (${tokenClauses})`;
          for (const tok of rawTokens) {
            params.push(`%${tok}%`, `%${tok}%`);
          }
        }

        sql += ` ORDER BY id ASC LIMIT ?`;
        params.push(limit);

        let rows = db.prepare(sql).all(...params) as any[];

        // If no results matched the specific tokens, fallback to general subject questions
        if (rows.length === 0 && subject) {
          rows = db
            .prepare(
              `SELECT id, subject, chapter, question_text, option_a, option_b, option_c, option_d, correct_answer, solution, difficulty, has_image, image_paths
               FROM questions
               WHERE subject = ? AND option_a IS NOT NULL AND length(option_a) > 0
               ORDER BY id ASC LIMIT ?`
            )
            .all(subject, limit) as any[];
        }

        if (rows.length > 0) {
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
              chapter: cleanText(r.chapter),
              questionText: cleanText(r.question_text),
              optionA: cleanText(r.option_a) || "Option A",
              optionB: cleanText(r.option_b) || "Option B",
              optionC: cleanText(r.option_c) || "Option C",
              optionD: cleanText(r.option_d) || "Option D",
              correctAnswer: (r.correct_answer || "A").trim().toUpperCase(),
              solution: cleanText(r.solution) || "Step-by-step solution from database.",
              difficulty: r.difficulty || "Medium",
              imagePaths: images,
            };
          });

          return NextResponse.json({ success: true, count: formatted.length, questions: formatted });
        }
      } catch (dbErr) {
        console.warn("SQLite search failed, falling back to curated bank:", dbErr);
      }
    }

    // 2. Fallback to Curated Bank JSON (1,056 cleaned questions)
    let filtered = (CURATED_BANK as any[]).filter((q) => {
      if (subject && q.subject.toLowerCase() !== subject.toLowerCase()) return false;
      if (rawTokens.length === 0) return true;
      const haystack = `${q.chapter} ${q.questionText}`.toLowerCase();
      return rawTokens.some((tok: string) => haystack.includes(tok));
    });

    if (filtered.length === 0 && subject) {
      filtered = (CURATED_BANK as any[]).filter(
        (q) => q.subject.toLowerCase() === subject.toLowerCase()
      );
    }

    const results = filtered.slice(0, limit);
    return NextResponse.json({ success: true, count: results.length, questions: results });
  } catch (err: any) {
    console.error("Error in POST /api/admin/exam/search:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
