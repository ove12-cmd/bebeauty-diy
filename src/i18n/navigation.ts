import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale- and pathname-aware replacements for next/link and next/navigation.
// Every internal link/redirect in the app must go through these (not raw
// <a> tags or next/link directly) so it carries the current locale prefix
// and resolves through the `pathnames` map above.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
