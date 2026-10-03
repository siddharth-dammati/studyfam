/**
 * Question, Option, and Solution Text Formatting & Math Normalization Engine
 * Standardizes mathematical expressions, exponents (squares, cubes), sub/superscripts,
 * fractions, vectors, and eliminates private-use (PUA) tofu/square box artifacts.
 */

const SUBSCRIPT_CHARS: Record<string, string> = {
  "0": "₀",
  "1": "₁",
  "2": "₂",
  "3": "₃",
  "4": "₄",
  "5": "₅",
  "6": "₆",
  "7": "₇",
  "8": "₈",
  "9": "₉",
  "+": "₊",
  "-": "₋",
  "−": "₋",
  "=": "₌",
  "(": "₍",
  ")": "₎",
  a: "ₐ",
  e: "ₑ",
  o: "ₒ",
  x: "ₓ",
  i: "ᵢ",
  j: "ⱼ",
  k: "ₖ",
  n: "ₙ",
  m: "ₘ",
  r: "ᵣ",
  t: "ₜ",
  p: "ₚ",
};

const SUPERSCRIPT_CHARS: Record<string, string> = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
  "+": "⁺",
  "-": "⁻",
  "−": "⁻",
  "=": "⁼",
  "(": "⁽",
  ")": "⁾",
  a: "ᵃ",
  b: "ᵇ",
  c: "ᶜ",
  d: "ᵈ",
  n: "ⁿ",
  m: "ᵐ",
  x: "ˣ",
  i: "ⁱ",
  k: "ᵏ",
  T: "ᵀ",
};

export function toSubscript(str: string): string {
  return str
    .split("")
    .map((c) => SUBSCRIPT_CHARS[c] || c)
    .join("");
}

export function toSuperscript(str: string): string {
  return str
    .split("")
    .map((c) => SUPERSCRIPT_CHARS[c] || c)
    .join("");
}

/**
 * Core mathematical normalizer:
 * Cleans extracted PDF symbols, fixes missing operators/powers, and removes tofu squares.
 */
export function formatMathSymbols(text?: string | null): string {
  if (!text) return "";

  // 1. Remove zero-width characters and normalize linebreaks & non-breaking spaces
  let t = text
    .replace(/[\u200B\uFEFF\u200E\u200F]/g, "")
    .replace(/\r\n|\r/g, "\n")
    .replace(/\xa0/g, " ");

  // 2. Eliminate PUA (Private Use Area) tofu / square box glyphs
  // \uE020 is LaTeX slash / not-equal indicator
  t = t.replace(/=\s*[\ue020\uE020]/g, " ≠ ");
  t = t.replace(/[\ue020\uE020]/g, " ≠ ");
  // \uE131 is dotless math i (î or î)
  t = t.replace(/[\ue131\uE131]\^?/g, "î");
  // \uE150-\uE154 are Computer Modern horizontal underbrace fragments
  t = t.replace(/[\ue150-\ue154\uE150-\uE154]/g, "");
  // Strip any remaining PUA characters so no empty square boxes (tofu) ever render
  t = t.replace(/[\uE000-\uF8FF]/g, "");

  // 3. Clean broken vector artifacts & unit vector notations
  t = t.replace(/−−+→\s*→?/g, "");
  t = t.replace(/−→\s*→/g, "");
  t = t.replace(/→\s*→+/g, "");
  t = t.replace(/[ˆ^]i\b/g, "î").replace(/[ˆ^]j\b/g, "ĵ").replace(/[ˆ^]k\b/g, "k̂");
  // Vector lowercase letters (e.g. →a -> a⃗, b→ -> b⃗)
  t = t.replace(/→\s*([abcrxd])\b/g, "$1⃗");
  t = t.replace(/\b([abcrxd])\s*→\b/g, "$1⃗");

  // 4. Clean broken vertical bracket fragments from matrix/determinant extractions
  t = t.replace(/⎢ ⎥ ⎢ ⎥/g, "");
  t = t.replace(/⎢ ⎥/g, "");
  t = t.replace(/⎜ ⎟ ⎜ ⎟⎜ ⎟/g, "");
  t = t.replace(/⎛ ⎞ ⎛ ⎞⎛ ⎞/g, "");
  t = t.replace(/⎝ ⎠ ⎝ ⎠⎝ ⎠/g, "");
  t = t.replace(/∣∣∣ ∣/g, "");

  // 5. Standardize minus sign and degrees
  t = t.replace(/−/g, "−");
  t = t.replace(/([0-9]+)\s*∘/g, "$1°");

  // 6. Fix Inverse Trig: sin-1, cos-1, tan-1, cot-1, sec-1, cosec-1 -> sin⁻¹, etc.
  t = t.replace(/\b(sin|cos|tan|cot|sec|cosec|csc)[\-−]1\b/g, "$1⁻¹");

  // 7. Fix Matrix Inverses & Transposes: A-1, B-1, P-1, (BT)-1 -> A⁻¹, (Bᵀ)⁻¹
  t = t.replace(/\b([A-Z])[\-−]1\b/g, "$1⁻¹");
  t = t.replace(/\(B\s*T\s*\)[\-−]1/g, "(Bᵀ)⁻¹");
  t = t.replace(/\(B\s*T\s*\)/g, "(Bᵀ)");
  t = t.replace(/\b([A-Z])\s*T\b/g, "$1ᵀ");

  // 8. Units formatting
  t = t.replace(/\b(m\/s)\s*2\b/g, "$1²");
  t = t.replace(/\b(cm|mm|m|km)\s*2\b/g, "$1²");
  t = t.replace(/\b(cm|mm|m|km)\s*3\b/g, "$1³");
  t = t.replace(/\b(m\s*s)[\-−]1\b/g, "$1⁻¹");
  t = t.replace(/\b(m\s*s)[\-−]2\b/g, "$1⁻²");
  t = t.replace(/\bs[\-−]1\b/g, "s⁻¹");
  t = t.replace(/\bs[\-−]2\b/g, "s⁻²");
  t = t.replace(/\bkg\s*m\s*2\b/g, "kg m²");

  // 9. Powers of 10: 10^-4 or 10 -4 -> 10⁻⁴, 10^3 -> 10³
  t = t.replace(/10\s*[\^]\s*[\-−]\s*([0-9]+)/g, (_, d) => `10⁻${toSuperscript(d)}`);
  t = t.replace(/10\s*[\^]\s*([0-9]+)/g, (_, d) => `10${toSuperscript(d)}`);

  // 10. Trigonometric powers: sin2 x -> sin² x, cos2 x -> cos² x, etc.
  t = t.replace(/\b(sin|cos|tan|sec|cosec|csc|cot)\s*2\b/g, "$1²");
  t = t.replace(/\b(sin|cos|tan|sec|cosec|csc|cot)\s*3\b/g, "$1³");
  t = t.replace(/\b(sin|cos|tan|sec|cosec|csc|cot)\s*4\b/g, "$1⁴");

  // 11. Parenthesized powers: (x - 1)2 -> (x - 1)², (2)2 -> (2)², (40)20 -> (40)²⁰
  t = t.replace(/(\([^\)]+\))\s*2\b/g, "$1²");
  t = t.replace(/(\([^\)]+\))\s*3\b/g, "$1³");
  t = t.replace(/(\([^\)]+\))\s*4\b/g, "$1⁴");
  t = t.replace(/(\([^\)]+\))\s*20\b/g, "$1²⁰");
  t = t.replace(/(\([^\)]+\))\s*n\b/g, "$1ⁿ");

  // 12. Algebraic Squares & Exponents (e.g. x2 + y2 = 1 -> x² + y² = 1, 2x2 -> 2x²)
  t = t.replace(/(?:\b|(?<=[0-9\(\)\]\+\-\=\/\*]))([xyzrubcpqkm])\s*2(?=[^0-9a-zA-Z]|$)/g, "$1²");
  t = t.replace(/(?:\b|(?<=[0-9\(\)\]\+\-\=\/\*]))([xyzrubcpqkm])\s*3(?=[^0-9a-zA-Z]|$)/g, "$1³");
  t = t.replace(/(?:\b|(?<=[0-9\(\)\]\+\-\=\/\*]))([xyzrubcpqkm])\s*4(?=[^0-9a-zA-Z]|$)/g, "$1⁴");
  t = t.replace(/(?:\b|(?<=[0-9\(\)\]\+\-\=\/\*]))([xyzrubcpqkm])\s*5(?=[^0-9a-zA-Z]|$)/g, "$1⁵");
  t = t.replace(/(?:\b|(?<=[0-9\(\)\]\+\-\=\/\*]))([xyzrubcpqkm])\s*8(?=[^0-9a-zA-Z]|$)/g, "$1⁸");

  // Exact whole-token variable powers
  t = t.replace(/\b([xyzrubcpqkm])2\b/g, "$1²");
  t = t.replace(/\b([xyzrubcpqkm])3\b/g, "$1³");
  t = t.replace(/\b([xyzrubcpqkm])4\b/g, "$1⁴");
  t = t.replace(/\b([xyzrubcpqkm])5\b/g, "$1⁵");

  // High polynomial powers from mock questions
  t = t.replace(/\bx2010\b/g, "x²⁰¹⁰");
  t = t.replace(/\bx1010\b/g, "x¹⁰¹⁰");
  t = t.replace(/\bx510\b/g, "x⁵¹⁰");
  t = t.replace(/\bx210\b/g, "x²¹⁰");

  // Greek letters with powers
  t = t.replace(/([αβγθλπ])\s*2\b/g, "$1²");
  t = t.replace(/([αβγθλπ])\s*3\b/g, "$1³");

  // 13. Subscript Series Variables: x1x2x3x4 -> x₁ x₂ x₃ x₄, a1, a2 -> a₁, a₂
  t = t.replace(/\bx1x2x3x4\b/g, "x₁ x₂ x₃ x₄");
  t = t.replace(/\b([aztlpdIΔ])\s*([0-9])\b/g, (_, v, d) => `${v}${toSubscript(d)}`);
  t = t.replace(/\b([lpr])([123])\b/g, (_, v, d) => `${v}${toSubscript(d)}`);
  t = t.replace(/\b([BWvrpTINMV])\s*([0-9])\b/g, (_, v, d) => `${v}${toSubscript(d)}`);

  // 14. Proportionalities and specific physics formulas
  t = t.replace(/F\s*∝\s*A\s*a\s*v\s*b\s*d\s*c/gi, "F ∝ Aᵃ vᵇ dᶜ");
  t = t.replace(/F\s*∝\s*Aavbdc/gi, "F ∝ Aᵃ vᵇ dᶜ");

  // 15. Known mangled expressions from PDF extractions
  // Missing radicals in determinant MFT-1 Q53
  t = t.replace(/5\(\s*6\s*−\s*5\)/g, "5(√6 − √5)");
  t = t.replace(/5\s+3\(\s*6\s*−\s*5\)/g, "5√3(√6 − √5)");
  t = t.replace(/5\(\s*6\s*−\s*3\)/g, "5(√6 − √3)");
  t = t.replace(/2\(\s*7\s*−\s*5\)/g, "2(√7 − √5)");
  t = t.replace(/13\s*\+\s*3\s*2\s*5\s*5/g, "√13 + 3√2   √5   √5");
  t = t.replace(/15\s*\+\s*26\s*5\s*10/g, "√15 + √26   5   √10");
  t = t.replace(/3\s*\+\s*65\s*15\s*5/g, "3 + √65   √15   5");

  // MFT-1 Q54 exponent sum
  t = t.replace(/233x−2\s*\+\s*211x\+2\s*=\s*222x\+1\s*\+\s*1/g, "2^(33x−2) + 2^(11x+2) = 2^(22x+1) + 1");

  // MFT-1 Q55 fractional part
  t = t.replace(/The fractional part of 278 is 31/g, "The fractional part of 2⁷⁸ / 31 is");

  // MFT-1 Q57 split differential equation
  t = t.replace(
    /dy\s+yf′\(x\)−y2\s+The solution to the differential equation\s*=\s*where f\(x\) is a given function is\s+dx\s+f\(x\)/g,
    "The solution to the differential equation dy/dx = (y f′(x) − y²) / f(x), where f(x) is a given function, is"
  );

  // MFT-2 Q52 3D symmetric line
  t = t.replace(
    /in the line x = y−1 = z−2 1 2 3 Statement II: The line x = y−1 = z−2 bisects the line segment joining A\(1, 0, 7\) and B\(1, 6, 3\)\. 1 2 3/g,
    "in the line x/1 = (y − 1)/2 = (z − 2)/3.\nStatement II: The line x/1 = (y − 1)/2 = (z − 2)/3 bisects the line segment joining A(1, 0, 7) and B(1, 6, 3)."
  );

  // MFT-2 Q54 differential equation
  t = t.replace(
    /dy\s+y2\+xlnx\s+The solution of the differential equation\s*=\s*is \(where, c is the constant of integration\)\s+dx\s+2xy/g,
    "The solution of the differential equation dy/dx = (y² + x ln x) / (2xy) is (where c is the constant of integration)"
  );

  // MFT-7 Q68 differential equation
  t = t.replace(
    /The solution of the equation dy \+ y tan x = xm cos x is dx/g,
    "The solution of the equation dy/dx + y tan x = xᵐ cos x is"
  );

  // MFT-8 Q67 underbrace
  t = t.replace(
    /⎛\s*⎞\s*⎛\s*⎞⎛\s*⎞\s*Let f\(x\) = x,\s*n ≥2,\s*g x = fofo.*?⎝\s*⎠\s*⎝\s*⎠⎝\s*⎠\s*n times/g,
    "Let f(x) = x / (1 + xⁿ)^(1/n), n ≥ 2, and g(x) = (f ∘ f ∘ ... ∘ f)(x) [n times]"
  );

  // MFT-9 Q69 ellipse reflection
  t = t.replace(
    /ellipse x245 \+ 20 = 1, a ray of light is sent which makes an angle cos−1\(−1\) with the positive direction y2 √5 of x-axis/g,
    "ellipse x²/45 + y²/20 = 1, a ray of light is sent which makes an angle cos⁻¹(−1/√5) with the positive direction of x-axis"
  );

  // MFT-10 Q70 3D perpendicular line
  t = t.replace(
    /to the line x\+5 = y\+3 = z−6\. The equation of the 1 4 −9 perpendicular from P to the given line is/g,
    "to the line (x + 5)/1 = (y + 3)/4 = (z − 6)/(-9). The equation of the perpendicular from P to the given line is"
  );

  // MFT-10 Q73 differential equation
  t = t.replace(
    /x\+x33!\s*\+x55!\s*\+…\s*dx−dy\s*Consider the differential equation\s*x2\s*x4\s*=\s*dx\+dy\.\s*If y\(0\) = 1 and the solution of the differential equation is 1\+\s*2!\s*\+\s*4!\s*\+…\s*of the form 2y f\(x\) = me2x \+ n\.\s*Evaluate \(m \+ n\) f\(0\)\./g,
    "Consider the differential equation (x + x³/3! + x⁵/5! + …) / (1 + x²/2! + x⁴/4! + …) = (dx − dy) / (dx + dy). If y(0) = 1 and the solution of the differential equation is of the form 2y f(x) = m e²ˣ + n, evaluate (m + n) f(0)."
  );

  // 16. Spacing around mathematical relations
  t = t.replace(/\s*([∝⇌±≤≥≠≈])\s*/g, " $1 ");

  return t;
}

/**
 * Clean and format question text:
 * - Normalizes all math symbols, superscripts, fractions, and eliminates square tofu characters.
 * - Collapses broken single newlines while preserving genuine list items or paragraph breaks.
 * - Cleans up multiple spaces and misplaced punctuation.
 */
export function formatQuestionText(text?: string | null): string {
  if (!text) return "";

  const mathFormatted = formatMathSymbols(text);

  // Intelligent newline handling:
  // If the text contains single newlines that break sentences in halves,
  // collapse single newlines into spaces unless the newline precedes a numbered/bulleted list item
  // like (i), (1), (a), List-I, Column-I, Assertion, Reason, or double newline.
  const lines = mathFormatted.split("\n");
  const mergedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      if (mergedLines.length > 0 && mergedLines[mergedLines.length - 1] !== "") {
        mergedLines.push(""); // preserve paragraph break
      }
      continue;
    }

    // Check if line looks like an independent list item or section header
    const isListItem =
      /^(?:\([0-9a-zA-ZivxLCDM]+\)|[0-9ivxLCDM]+[\.\)]|List\s*[-–I|12]|Column\s*[-–I|12]|Statement\s*[-–I|12]|Assertion|Reason|Case\s*[0-9]|Where|Here|Let|If)/i.test(
        line
      );

    if (mergedLines.length === 0 || mergedLines[mergedLines.length - 1] === "") {
      mergedLines.push(line);
    } else if (isListItem) {
      mergedLines.push(line);
    } else {
      const prev = mergedLines[mergedLines.length - 1];
      const prevEndsWithColon = /[:;]$/.test(prev);
      const isContinuation =
        /^[a-z0-9,\.\)\/=\+\-–]/.test(line) ||
        !/[.?!:]$/.test(prev) ||
        prev.length < 40;

      if (!prevEndsWithColon && isContinuation) {
        mergedLines[mergedLines.length - 1] = `${prev} ${line}`;
      } else {
        mergedLines.push(line);
      }
    }
  }

  let result = mergedLines.join("\n").trim();

  // Final cleanup of extra internal spaces
  result = result.replace(/[ \t]{2,}/g, " ");
  result = result.replace(/\s+([,.:;?!])/g, "$1");

  return result;
}

/**
 * Clean and format option text:
 * - Normalizes math symbols, fractions, and powers.
 * - Converts broken two-number string fractions (e.g. "1 4" -> "1/4", "π 4" -> "π/4").
 * - Converts broken symmetric line expressions in options.
 * - Strips redundant leading option label pills (e.g. "Option A: ").
 */
export function formatOptionText(text?: string | null): string {
  if (!text) return "";

  let cleaned = formatMathSymbols(text)
    .replace(/\r\n|\r|\n/g, " ")
    .trim();

  // ONLY strip if it is a truly redundant prefix like 'Option A: ' or 'Option 1: '
  cleaned = cleaned.replace(/^\s*Option\s+[A-Da-d1-4]\s*[:\-]\s*/i, "");

  // Interval fractions (e.g. "π (0, ) 4" -> "(0, π/4)")
  cleaned = cleaned.replace(/π\s*\(\s*0\s*,\s*\)\s*([0-9]+)/g, "(0, π/$1)");
  cleaned = cleaned.replace(/π\s*,\s*π\s*\(\s*\)\s*([0-9]+)\s+([0-9]+)/g, "(π/$1, π/$2)");

  // Standalone two-item fraction options:
  // e.g. "1 4" -> "1/4", "-1 4" -> "-1/4", "3 4" -> "3/4", "π 4" -> "π/4", "√6 2" -> "√6/2"
  const fractionMatch = cleaned.match(/^([−\-]?\s*(?:[0-9]+|π|k|√[0-9]+|[0-9]*\s*√[0-9]+))\s+([0-9]+|√[0-9]+)$/);
  if (fractionMatch) {
    cleaned = `${fractionMatch[1]} / ${fractionMatch[2]}`;
  }

  // Common inverted option fractions from vertical PDF extraction:
  // e.g. "4 1" -> "1/4", "3 1" -> "1/3", "5 1" -> "1/5", "5 2" -> "2/5"
  if (/^4\s+1$/.test(cleaned)) cleaned = "1 / 4";
  if (/^3\s+1$/.test(cleaned)) cleaned = "1 / 3";
  if (/^5\s+1$/.test(cleaned)) cleaned = "1 / 5";
  if (/^5\s+2$/.test(cleaned)) cleaned = "2 / 5";

  // Three numbers in options: e.g. "3 30 8" -> "(3√30)/8", "5 30 8" -> "(5√30)/8", "30 4" -> "(√30)/4"
  const opt3Match = cleaned.match(/^([1-9])\s+30\s+([0-9]+)$/);
  if (opt3Match) {
    const num = opt3Match[1];
    const den = opt3Match[2];
    cleaned = num !== "1" ? `(${num}√30) / ${den}` : `(√30) / ${den}`;
  }
  if (cleaned === "30 4") {
    cleaned = "(√30) / 4";
  }

  // 3D symmetric line options
  const lineMatch = cleaned.match(/^(x[−\+]2)\s*=?\s*(y[−\+]4)\s*=?\s*(z\+1)\s+([−\d]+)\s+(\d+)\s+(\d+)$/);
  if (lineMatch) {
    cleaned = `(${lineMatch[1]})/${lineMatch[4]} = (${lineMatch[2]})/${lineMatch[5]} = (${lineMatch[3]})/${lineMatch[6]}`;
  }

  // Clean double spaces
  cleaned = cleaned.replace(/[ \t]{2,}/g, " ").trim();
  cleaned = cleaned.replace(/\s+([,.:;?!])/g, "$1");

  return cleaned;
}

/**
 * Clean and format solution and explanation text:
 * - Normalizes math expressions, fractions, powers, and removes tofu.
 * - Collapses broken line breaks and orphan variable tokens (e.g. single lines with 'd', 'V', 'q', 'C').
 * - Preserves authentic paragraph and step-by-step breaks (Step 1, (i), Case 1, etc.).
 */
export function formatSolutionText(text?: string | null): string {
  if (!text) return "";

  let cleaned = formatMathSymbols(text).trim();

  // If text contains "Solution:", strip preceding answer regurgitation if present
  if (cleaned.includes("Solution:")) {
    const parts = cleaned.split("Solution:");
    if (parts[1]?.trim().length > 5) {
      cleaned = parts[1].trim();
    }
  }

  const lines = cleaned.split("\n");
  const merged: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      if (merged.length > 0 && merged[merged.length - 1] !== "") {
        merged.push("");
      }
      continue;
    }

    if (merged.length === 0 || merged[merged.length - 1] === "") {
      merged.push(line);
      continue;
    }

    const prev = merged[merged.length - 1];

    // Check if line is floating denominator or short variable after equation
    if (/[=+\-–/*]\s*[^=]+$/.test(prev) && line.length <= 6 && !/^[=⇒∴\(\d]/.test(line)) {
      merged[merged.length - 1] = `${prev} / ${line}`;
    } else if (line.length <= 2 && /^[a-zA-Z0-9]$/.test(line)) {
      merged[merged.length - 1] = `${prev} ${line}`;
    } else if (/^(?:Step|Case|\([0-9a-zA-ZivxLCDM]+\)|[0-9ivxLCDM]+[\.\)]|∴|⇒|Hence|Therefore)/i.test(line)) {
      merged.push(line);
    } else if (!/[.?!:]$/.test(prev) || /^[a-z0-9,\.\)\/=\+\-–]/.test(line) || prev.length < 50) {
      merged[merged.length - 1] = `${prev} ${line}`;
    } else {
      merged.push(line);
    }
  }

  let result = merged.join("\n").trim();
  result = result.replace(/[ \t]{2,}/g, " ");
  result = result.replace(/\s+([,.:;?!])/g, "$1");
  return result;
}
