import type { MetadataRoute } from "next";

const BASE_URL = "https://bebeauty-diy.ee";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/hambakristalli-komplekt`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/juhend`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    // /kontakt hidden for now — omitted from the sitemap while it's not linked.
    { url: `${BASE_URL}/tarne`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/privaatsus`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/tingimused`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
