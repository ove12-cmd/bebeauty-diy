import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { COOKIE_NAME } from "@/lib/session";

const intlMiddleware = createMiddleware(routing);

// Optimistic check only — verifySession() in the dashboard page is the
// authoritative check. This just keeps unauthenticated visitors out early.
async function hasValidSession(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const secret = process.env.SESSION_SECRET;
  if (!token || !secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret), { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Dashboard keeps its own auth gate and never goes through i18n routing —
  // it's an internal admin tool, not part of the localized public site.
  if (pathname.startsWith("/dashboard")) {
    if (pathname === "/dashboard/login") return NextResponse.next();
    const authed = await hasValidSession(req);
    if (!authed) {
      return NextResponse.redirect(new URL("/dashboard/login", req.url));
    }
    return NextResponse.next();
  }

  // Everything else (the marketing site, checkout) goes through next-intl's
  // locale routing.
  return intlMiddleware(req);
}

export const config = {
  // next-intl's standard matcher (excludes /api, Next internals, and any
  // path with a file extension — static assets, sitemap.xml, robots.txt,
  // icon.png, etc). This one matcher also already covers /dashboard/:path*
  // — the branch above handles it before intlMiddleware ever runs.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
