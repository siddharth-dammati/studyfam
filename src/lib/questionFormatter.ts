/**
 * Question and Option Text Formatting Utilities
 * Standardizes mathematical expressions, chemical formulas, sub/superscripts,
 * and fixes fragmented newlines from PDF extractions.
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
  "=": "₌",
  "(": "₍",
  ")": "₎",
  a: "ₐ",
  e: "ₑ",
  o: "ₒ",
  x: "ₓ",
  i: "ᵢ",
  j: "ⱼ",
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
  "=": "⁼",
  "(": "⁽",
  ")": "⁾",
  a: "ᵃ",
  b: "ᵇ",
  c: "ᶜ",
  n: "ⁿ",
  x: "ˣ",
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
 * Clean and format question text:
 * - Collapses broken single newlines while preserving genuine list items or paragraph breaks.
 * - Formats mathematical and physical variables with correct subscripts (B₁, W₁, r₁, v₁).
 * - Corrects proportionalities (e.g., F ∝ Aᵃ vᵇ dᶜ).
 * - Cleans up multiple spaces and misplaced punctuation.
 */
export function formatQuestionText(text?: string | null): string {
  if (!text) return "";

  // 1. Remove zero-width characters and normalize spaces
  let cleaned = text
    .replace(/[\u200B\uFEFF\u200E\u200F]/g, "")
    .replace(/\r\n|\r/g, "\n")
    .replace(/\xa0/g, " ");

  // 2. Specific physics/chemistry formula reconstructions
  cleaned = cleaned.replace(/F\s*∝\s*A\s*a\s*v\s*b\s*d\s*c/gi, "F ∝ Aᵃ vᵇ dᶜ");
  cleaned = cleaned.replace(/F\s*∝\s*Aavbdc/gi, "F ∝ Aᵃ vᵇ dᶜ");

  // Fix separated variable subscripts: B 1 -> B₁, W 1 -> W₁, r 1 -> r₁, etc.
  cleaned = cleaned.replace(
    /\b([BWvrpTINMV])\s*([0-9])\b/g,
    (_, v, d) => `${v}${toSubscript(d)}`
  );

  // Common units formatting: m/s2 -> m/s², cm2 -> cm², cm3 -> cm³, m3 -> m³
  cleaned = cleaned.replace(/\b(m\/s)\s*2\b/g, "$1²");
  cleaned = cleaned.replace(/\b(cm|m|mm)\s*2\b/g, "$1²");
  cleaned = cleaned.replace(/\b(cm|m|mm)\s*3\b/g, "$1³");

  // Powers of 10: 10^-4 or 10 -4 -> 10⁻⁴
  cleaned = cleaned.replace(/10\s*[\^]\s*([0-9]+)/g, (_, d) => `10${toSuperscript(d)}`);
  cleaned = cleaned.replace(/10\s*[\^]\s*[-−]\s*([0-9]+)/g, (_, d) => `10⁻${toSuperscript(d)}`);

  // Spacing around arrows and mathematical relations
  cleaned = cleaned.replace(/\s*([∝⇌±≤≥≠≈])\s*/g, " $1 ");

  // 3. Intelligent newline handling:
  // If the text contains single newlines that break sentences in halves,
  // collapse single newlines into spaces unless the newline precedes a numbered/bulleted list item
  // like (i), (1), (a), List-I, Column-I, Assertion, Reason, or double newline.
  const lines = cleaned.split("\n");
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
      /^(?:\([0-9a-zA-ZivxLCDM]+\)|[0-9ivxLCDM]+[\.\)]|List\s*[-–I|12]|Column\s*[-–I|12]|Statement\s*[-–I|12]|Assertion|Reason|Case\s*[0-9]|Where|Here)/i.test(
        line
      );

    if (mergedLines.length === 0 || mergedLines[mergedLines.length - 1] === "") {
      mergedLines.push(line);
    } else if (isListItem) {
      mergedLines.push(line);
    } else {
      // Check if previous line ended with a colon, semicolon, or sentence end
      const prev = mergedLines[mergedLines.length - 1];
      const prevEndsWithColon = /[:;]$/.test(prev);
      const isContinuation =
        /^[a-z0-9,\.\)\/=\+\-–]/.test(line) ||
        !/[.?!:]$/.test(prev) ||
        prev.length < 40;

      if (!prevEndsWithColon && isContinuation) {
        // Merge with previous line
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
 * - Strips redundant leading option label pills: (A), (B), A., 1., etc.
 * - Formats subscripts, superscripts, and relations (W₁ > W₂ = W₃).
 * - Collapses broken line breaks into a single readable string.
 */
export function formatOptionText(text?: string | null): string {
  if (!text) return "";

  let cleaned = text
    .replace(/[\u200B\uFEFF\u200E\u200F]/g, "")
    .replace(/\r\n|\r|\n/g, " ")
    .replace(/\xa0/g, " ")
    .trim();

  // ONLY strip if it is a truly redundant prefix like 'Option A: ' or 'Option 1: '
  cleaned = cleaned.replace(/^\s*Option\s+[A-Da-d1-4]\s*[:\-]\s*/i, "");

  // Variables with subscripts: W 1 -> W₁, B 2 -> B₂, r 1 -> r₁
  cleaned = cleaned.replace(
    /\b([BWvrpTINMV])\s*([0-9])\b/g,
    (_, v, d) => `${v}${toSubscript(d)}`
  );
  cleaned = cleaned.replace(
    /\b([BWvrpTINMV])([0-9])\b/g,
    (_, v, d) => `${v}${toSubscript(d)}`
  );

  // Spacing around comparison operators (<, >, =, -, ≈)
  cleaned = cleaned.replace(/\s*([<>=\-≈])\s*/g, " $1 ");

  // Clean double spaces
  cleaned = cleaned.replace(/[ \t]{2,}/g, " ").trim();
  cleaned = cleaned.replace(/\s+([,.:;?!])/g, "$1");

  return cleaned;
}

/**
 * Clean and format solution and explanation text:
 * - Collapses broken line breaks and orphan variable tokens (e.g. single lines with 'd', 'V', 'q', 'C').
 * - Formats fractions, proportionalities, and mathematical equations.
 * - Formats subscripts (B₁, W₁, r₁, v₁) and powers (10⁻⁴).
 * - Preserves authentic paragraph and step-by-step breaks (Step 1, (i), Case 1, etc.).
 */
export function formatSolutionText(text?: string | null): string {
  if (!text) return "";

  let cleaned = text
    .replace(/[\u200B\uFEFF\u200E\u200F]/g, "")
    .replace(/\r\n|\r/g, "\n")
    .replace(/\xa0/g, " ")
    .trim();

  // If text contains "Solution:", strip preceding answer regurgitation if present
  if (cleaned.includes("Solution:")) {
    const parts = cleaned.split("Solution:");
    if (parts[1]?.trim().length > 5) {
      cleaned = parts[1].trim();
    }
  }

  // Format variable subscripts
  cleaned = cleaned.replace(
    /\b([BWvrpTINMV])\s*([0-9])\b/g,
    (_, v, d) => `${v}${toSubscript(d)}`
  );
  cleaned = cleaned.replace(
    /\b([BWvrpTINMV])([0-9])\b/g,
    (_, v, d) => `${v}${toSubscript(d)}`
  );

  // Common units & powers
  cleaned = cleaned.replace(/\b(m\/s)\s*2\b/g, "$1²");
  cleaned = cleaned.replace(/\b(cm|m|mm)\s*2\b/g, "$1²");
  cleaned = cleaned.replace(/\b(cm|m|mm)\s*3\b/g, "$1³");
  cleaned = cleaned.replace(/10\s*[\^]\s*[-−]\s*([0-9]+)/g, (_, d) => `10⁻${toSuperscript(d)}`);

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
      // Orphan variable (like d, V, q, C, A, etc.)
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

