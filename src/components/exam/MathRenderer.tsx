"use client";

import React, { useMemo } from "react";
import katex from "katex";

interface MathRendererProps {
  text?: string | null;
  className?: string;
  inline?: boolean;
}

const SUPERSCRIPT_MAP: Record<string, string> = {
  "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4",
  "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9",
  "⁺": "+", "⁻": "-",
};

/**
 * Converts common unicode math notation into valid LaTeX syntax for KaTeX.
 */
export function convertUnicodeToLatex(mathStr: string): string {
  let tex = mathStr.trim();

  // 1. Remove outer math wrappers if already present
  if (tex.startsWith("$") && tex.endsWith("$")) {
    tex = tex.slice(1, -1).trim();
  }

  // 2. Square roots: √34 -> \sqrt{34}, √(6 - 5) -> \sqrt{6 - 5}, 3√2 -> 3\sqrt{2}
  tex = tex.replace(/√\(([^)]+)\)/g, (_, m) => `\\sqrt{${m}}`);
  tex = tex.replace(/([0-9]*)\s*√([0-9a-zA-Z]+)/g, (_, c, m) => `${c}\\sqrt{${m}}`);

  // 3. Exponents & Superscripts
  tex = tex.replace(/([0-9a-zA-Z\)])²/g, "$1^2");
  tex = tex.replace(/([0-9a-zA-Z\)])³/g, "$1^3");
  tex = tex.replace(/([0-9a-zA-Z\)])⁴/g, "$1^4");
  tex = tex.replace(/([0-9a-zA-Z\)])⁵/g, "$1^5");
  tex = tex.replace(/([0-9a-zA-Z\)])⁶/g, "$1^6");
  tex = tex.replace(/([0-9a-zA-Z\)])⁷/g, "$1^7");
  tex = tex.replace(/([0-9a-zA-Z\)])⁸/g, "$1^8");
  tex = tex.replace(/([0-9a-zA-Z\)])⁹/g, "$1^9");
  tex = tex.replace(/([0-9a-zA-Z\)])ⁿ/g, "$1^n");
  tex = tex.replace(/([0-9a-zA-Z\)])⁻¹/g, "$1^{-1}");
  tex = tex.replace(/([0-9a-zA-Z\)])⁻²/g, "$1^{-2}");
  tex = tex.replace(/([0-9a-zA-Z\)])⁻³/g, "$1^{-3}");

  // Powers of 10
  tex = tex.replace(/10⁻([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, (_, d) => {
    return `10^{-${d.split("").map((c: string) => SUPERSCRIPT_MAP[c] || c).join("")}}`;
  });
  tex = tex.replace(/10([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, (_, d) => {
    return `10^{${d.split("").map((c: string) => SUPERSCRIPT_MAP[c] || c).join("")}}`;
  });

  // 4. Subscripts
  tex = tex.replace(/([a-zA-Z])₁/g, "$1_1");
  tex = tex.replace(/([a-zA-Z])₂/g, "$1_2");
  tex = tex.replace(/([a-zA-Z])₃/g, "$1_3");
  tex = tex.replace(/([a-zA-Z])₄/g, "$1_4");

  // 5. Vectors & Unit Vectors
  tex = tex.replace(/î/g, "\\hat{i}");
  tex = tex.replace(/ĵ/g, "\\hat{j}");
  tex = tex.replace(/k̂/g, "\\hat{k}");
  tex = tex.replace(/([a-zA-Z])⃗/g, "\\vec{$1}");

  // 6. Greek Letters & Symbols
  tex = tex.replace(/π/g, "\\pi ");
  tex = tex.replace(/θ/g, "\\theta ");
  tex = tex.replace(/α/g, "\\alpha ");
  tex = tex.replace(/β/g, "\\beta ");
  tex = tex.replace(/γ/g, "\\gamma ");
  tex = tex.replace(/λ/g, "\\lambda ");
  tex = tex.replace(/ϕ/g, "\\phi ");
  tex = tex.replace(/Δ/g, "\\Delta ");
  tex = tex.replace(/∞/g, "\\infty ");

  // 7. Operators & Relations
  tex = tex.replace(/−/g, "-");
  tex = tex.replace(/≥/g, "\\ge ");
  tex = tex.replace(/≤/g, "\\le ");
  tex = tex.replace(/≠/g, "\\neq ");
  tex = tex.replace(/±/g, "\\pm ");
  tex = tex.replace(/×/g, "\\times ");
  tex = tex.replace(/⋅/g, "\\cdot ");
  tex = tex.replace(/∈/g, "\\in ");
  tex = tex.replace(/∉/g, "\\notin ");
  tex = tex.replace(/°/g, "^\\circ ");

  // 8. Trigonometric and common functions
  tex = tex.replace(/\bsin⁻¹\b/g, "\\sin^{-1}");
  tex = tex.replace(/\bcos⁻¹\b/g, "\\cos^{-1}");
  tex = tex.replace(/\btan⁻¹\b/g, "\\tan^{-1}");
  tex = tex.replace(/\bcot⁻¹\b/g, "\\cot^{-1}");
  tex = tex.replace(/\bsec⁻¹\b/g, "\\sec^{-1}");
  tex = tex.replace(/\bcsc⁻¹\b/g, "\\csc^{-1}");
  tex = tex.replace(/\bdy\/dx\b/g, "\\frac{dy}{dx}");

  // 9. Fractions: convert simple "A / B" into \frac{A}{B}
  if (/^([−\-]?\s*(?:[0-9a-zA-Z\\]+|\\sqrt\{[0-9a-zA-Z]+\}|\([^\)]+\)))\s*\/\s*([0-9a-zA-Z\\]+|\\sqrt\{[0-9a-zA-Z]+\})$/.test(tex)) {
    tex = tex.replace(/^([−\-]?\s*(?:[0-9a-zA-Z\\]+|\\sqrt\{[0-9a-zA-Z]+\}|\([^\)]+\)))\s*\/\s*([0-9a-zA-Z\\]+|\\sqrt\{[0-9a-zA-Z]+\})$/, "\\frac{$1}{$2}");
  }

  return tex;
}

interface Segment {
  type: "text" | "math";
  content: string;
  isBlock?: boolean;
}

// Regex to identify inline math chunks inside regular text
const INLINE_CHUNK_REGEX = /((?:[0-9]+\s*)?√\([^\)]+\)|(?:[0-9]+\s*)?√[0-9a-zA-Z]+|\b[a-zA-Z0-9\(\)]+[²³⁴⁵⁶⁷⁸⁹ⁿ]|\b10[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+|[ijk]̂|[a-zA-Z]⃗)/g;

function renderTextWithInlineMath(text: string, keyPrefix: string | number) {
  const parts: React.ReactNode[] = [];
  let lastIdx = 0;
  let m: RegExpExecArray | null;
  INLINE_CHUNK_REGEX.lastIndex = 0;

  while ((m = INLINE_CHUNK_REGEX.exec(text)) !== null) {
    if (m.index > lastIdx) {
      parts.push(
        <span key={`${keyPrefix}-t-${lastIdx}`} className="whitespace-pre-wrap">
          {text.slice(lastIdx, m.index)}
        </span>
      );
    }
    const token = m[0];
    try {
      const tex = convertUnicodeToLatex(token);
      const html = katex.renderToString(tex, { throwOnError: false, displayMode: false });
      parts.push(
        <span
          key={`${keyPrefix}-m-${m.index}`}
          className="inline-block px-0.5 align-middle"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch {
      parts.push(
        <span key={`${keyPrefix}-m-${m.index}`}>
          {token}
        </span>
      );
    }
    lastIdx = INLINE_CHUNK_REGEX.lastIndex;
  }

  if (lastIdx < text.length) {
    parts.push(
      <span key={`${keyPrefix}-t-${lastIdx}`} className="whitespace-pre-wrap">
        {text.slice(lastIdx)}
      </span>
    );
  }

  return parts.length > 0 ? parts : <span className="whitespace-pre-wrap">{text}</span>;
}

export function MathRenderer({ text, className = "", inline = false }: MathRendererProps) {
  const renderedContent = useMemo(() => {
    if (!text) return null;

    // Fast check: if string contains explicit LaTeX tokens or delimiters
    const hasLatexDelimiters =
      /\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$[^\$\n]+?\$|\\\(.*?\\\)|\b\\begin\{([a-zA-Z*]+)\}[\s\S]*?\\end\{\1\}/.test(text);

    // If text has NO delimiters, check if it's a short pure math formula (e.g. option text "5(√6 − √5)" or "1 / 4" or "x² + y² = 1")
    if (!hasLatexDelimiters) {
      const hasEnglishWords = /\b(?:the|if|find|given|where|let|which|value|equation|between|then|number|root|roots|sum|point|line|plane|circle|curve|function|matrix|determinant|statement|correct|option|answer)\b/i.test(text);

      const isPureMath =
        !hasEnglishWords &&
        text.length <= 80 &&
        /^[-−+0-9a-zA-Z\s\(\)\[\]\{\}\/=\.,:;\^√²³⁴⁵⁶⁷⁸⁹ⁿ⁻¹⁻²⁻³πθλαβγλϕΔ∞≥≤≠±×⋅∈∉°\\_]+$/.test(text) &&
        /[√²³⁴⁵⁶⁷⁸⁹ⁿ⁻¹⁻²⁻³πθλαβγλϕΔ∞≥≤≠±×⋅∈∉°\\^_\/]/.test(text);

      if (isPureMath) {
        try {
          const tex = convertUnicodeToLatex(text);
          const html = katex.renderToString(tex, {
            throwOnError: false,
            displayMode: !inline && (tex.includes("\\begin{") || tex.includes("\\displaystyle")),
          });
          return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
        } catch {
          return <span className={className}>{text}</span>;
        }
      }
    }

    // Split text by LaTeX math delimiters:
    // 1. $$...$$ (Display Math)
    // 2. \[...\] (Display Math)
    // 3. $...$ (Inline Math)
    // 4. \(...\) (Inline Math)
    // 5. \begin{env}...\end{env} (Environment blocks like matrices/determinants)
    const regex = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$[^\$\n]+?\$|\\\(.*?\\\)|\b\\begin\{[a-zA-Z*]+\}[\s\S]*?\\end\{[a-zA-Z*]+\})/g;

    const segments: Segment[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        segments.push({
          type: "text",
          content: text.slice(lastIndex, match.index),
        });
      }

      const matchStr = match[0];
      if (matchStr.startsWith("$$") && matchStr.endsWith("$$")) {
        segments.push({
          type: "math",
          content: matchStr.slice(2, -2).trim(),
          isBlock: true,
        });
      } else if (matchStr.startsWith("\\[") && matchStr.endsWith("\\]")) {
        segments.push({
          type: "math",
          content: matchStr.slice(2, -2).trim(),
          isBlock: true,
        });
      } else if (matchStr.startsWith("$") && matchStr.endsWith("$")) {
        segments.push({
          type: "math",
          content: matchStr.slice(1, -1).trim(),
          isBlock: false,
        });
      } else if (matchStr.startsWith("\\(") && matchStr.endsWith("\\)")) {
        segments.push({
          type: "math",
          content: matchStr.slice(2, -2).trim(),
          isBlock: false,
        });
      } else if (matchStr.startsWith("\\begin{")) {
        segments.push({
          type: "math",
          content: matchStr.trim(),
          isBlock: true,
        });
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      segments.push({
        type: "text",
        content: text.slice(lastIndex),
      });
    }

    // If no math segments found, render text with inline math detection
    if (segments.length === 0) {
      return <span className={className}>{renderTextWithInlineMath(text, 0)}</span>;
    }

    return (
      <span className={className}>
        {segments.map((seg, idx) => {
          if (seg.type === "text") {
            return <React.Fragment key={idx}>{renderTextWithInlineMath(seg.content, idx)}</React.Fragment>;
          }

          try {
            const html = katex.renderToString(seg.content, {
              throwOnError: false,
              displayMode: seg.isBlock && !inline,
            });
            if (seg.isBlock && !inline) {
              return (
                <span
                  key={idx}
                  className="block my-3 text-center overflow-x-auto py-1"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              );
            }
            return (
              <span
                key={idx}
                className="inline-block px-0.5 align-middle"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch {
            return <span key={idx}>{seg.content}</span>;
          }
        })}
      </span>
    );
  }, [text, className, inline]);

  return renderedContent;
}
