import { NextResponse, type NextRequest } from "next/server";

import { REFRESH_TOKEN_COOKIE } from "@/lib/session-cookie";

/** Auth pages: redirect to "/" when a session already exists (except /login/verify, mid-flow). */
const AUTH_PATHS = ["/register", "/login", "/login/verify"];

function isAuthPath(pathname: string): boolean {
  return AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** "/" is the shared home page (home spec): does not require a session, decides the header/hero/footer CTA on the client. */
function requiresSession(pathname: string): boolean {
  return pathname !== "/" && !isAuthPath(pathname);
}

/**
 * Session-based route guard (spec §4.3, §12.3): checks only the PRESENCE of
 * the refresh token cookie, not its validity — the API decides that. UX
 * defense in depth, never the real source of authorization.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(REFRESH_TOKEN_COOKIE);

  if (requiresSession(pathname) && !hasSession) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPath(pathname) && pathname !== "/login/verify" && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
