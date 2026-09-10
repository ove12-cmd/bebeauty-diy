import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const BASE_URL = "https://bebeauty-diy.ee";

// Pages that use the shared (non-localized) "/" pathname entry in
// routing.ts's pathnames map don't need a `href` object — everything else
// does, so both locales' real slugs (e.g. /guide vs /juhend) are resolved
// from the single source of truth in routing.ts rather than hardcoded here.
const ENTRIES = [
  { href: "/", changeFrequency: "weekly", priority: 1 },
  { href: "/tooth-gem-kit", changeFrequency: "weekly", priority: 0.9 },
  { href: "/crystals", changeFrequency: "weekly", priority: 0.7 },
  { href: "/guide", changeFrequency: "monthly", priority: 0.7 },
  // /contact hidden for now — omitted from the sitemap while it's not linked.
  { href: "/shipping", changeFrequency: "yearly", priority: 0.3 },
  { href: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { href: "/terms", changeFrequency: "yearly", priority: 0.3 },
] as const satisfies { href: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return ENTRIES.map(({ href, changeFrequency, priority }) => {
    const languages = Object.fromEntries(
      routing.locales.map((locale) => [
        locale,
        `${BASE_URL}${getPathname({ href, locale })}`,
      ]),
    );
    return {
      url: languages[routing.defaultLocale],
      lastModified: now,
      changeFrequency,
      priority,
      alternates: { languages },
    };
  });
}
