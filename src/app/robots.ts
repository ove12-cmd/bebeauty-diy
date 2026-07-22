import type { MetadataRoute } from "next";

const BASE_URL = "https://bebeauty-diy.ee";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Transactional / private / API routes have no search value.
      disallow: ["/dashboard", "/checkout", "/api"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
