import { NextResponse, type NextRequest } from "next/server";

import { REFRESH_TOKEN_COOKIE } from "@/lib/session-cookie";

/** Páginas de auth: redirecionam para "/" quando já há sessão (exceto /login/verify, meio do fluxo). */
const AUTH_PATHS = ["/register", "/login", "/login/verify"];

function isAuthPath(pathname: string): boolean {
  return AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** "/" é a home pública/dashboard (spec do home): não exige sessão, decide o conteúdo no client. */
function requiresSession(pathname: string): boolean {
  return pathname !== "/" && !isAuthPath(pathname);
}

/**
 * Guarda de rota por sessão (spec §4.3, §12.3): verifica apenas a PRESENÇA do
 * cookie de refresh token, não sua validade — isso a API decide. Defesa em
 * profundidade de UX, nunca a fonte real de autorização.
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
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
