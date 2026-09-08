
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "JEE Main 2027 All India Mock Test | StudyFam ₹27",
  description: "Take the StudyFam JEE Main 2027 All India Mock for ₹27. Compare your performance with a growing pool of JEE aspirants across India.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${geist.variable} ${geistMono.variable}`}>
      <body className={`font-sans bg-[var(--background)] text-[var(--foreground)] antialiased selection:bg-[var(--accent)]/20 selection:text-[var(--accent)]`}>
        {children}
      </body>
    </html>
  );
}

