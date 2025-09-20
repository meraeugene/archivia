import { NextResponse, type NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

const PUBLIC_PATHS = ["/auth/login"];
const PROTECTED_PATHS = ["/find-adviser", "/dashboard"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Read cookie
  const token = request.cookies.get("session")?.value;
  const user = token ? verifyToken(token) : null;

  const url = request.nextUrl.clone();

  // 2. If not logged in but visiting protected page → redirect to login
  if (!user && PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // 3. If logged in and trying to access /auth → redirect to home
  if (user && PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Allow request to continue
  return NextResponse.next();
}

// Tell Next.js which routes to run middleware on
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"], // apply to all routes except assets
};
