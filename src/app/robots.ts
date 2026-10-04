import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://studyfam.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/exam",
          "/exam/*",
          "/all-india-mock",
          "/percentile-analyzer",
          "/about",
          "/transparency",
          "/scholarship-rules",
          "/contact",
          "/terms",
          "/privacy",
          "/refund-policy",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/auth/*",
          "/dashboard",
          "/admit-card",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/exam",
          "/exam/*",
          "/all-india-mock",
          "/percentile-analyzer",
          "/about",
          "/transparency",
          "/scholarship-rules",
          "/contact",
          "/terms",
          "/privacy",
          "/refund-policy",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/auth/*",
          "/dashboard",
          "/admit-card",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
