import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StudyFAM — India's Free JEE Main CBT Mock Platform",
    short_name: "StudyFAM",
    description:
      "Practice 10 free full-length JEE Main mock tests on official TCS iON CBT interface with instant solutions and pacing diagnostics.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#1a5fe0",
    orientation: "portrait",
    categories: ["education", "productivity"],
    lang: "en-IN",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
