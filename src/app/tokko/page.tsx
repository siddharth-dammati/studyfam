import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "StudyFam — India's Free JEE Main CBT Platform & ₹27 National Scholarship Exam",
  description: "Experience the real TCS iON JEE Main CBT screen with 10 free major mocks, question pacing diagnostics, and 27 Dec All-India Scholarship Mock (₹27 entry / ₹18 pool).",
};

export default function TokkoPage() {
  return (
    <div style={{ width: "100%", height: "100vh", margin: 0, padding: 0, overflow: "hidden" }}>
      <iframe
        src="/tokko-landing.html"
        style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        title="StudyFam Tokko Landing Page"
      />
    </div>
  );
}
