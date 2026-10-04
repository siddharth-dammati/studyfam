import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sohan Mocks — Exclusive JEE Main Chemistry 25Q Mock Test",
  description: "Unlisted JEE Main Chemistry full mock test with 25 questions, 1-hour timer, TCS iON interface, and instant diagnostics without login.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SohanMocksPage() {
  return (
    <div style={{ width: "100%", height: "100vh", margin: 0, padding: 0, overflow: "hidden" }}>
      <iframe
        src="/sohanmocks.html"
        style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        title="Sohan Mocks — JEE Main Chemistry Special 25Q Mock Test"
      />
    </div>
  );
}
