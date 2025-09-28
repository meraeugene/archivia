import { NextResponse, type NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

const PUBLIC_PATHS = ["/auth/login"];
const PROTECTED_PATHS = ["/find-adviser", "/dashboard", "/my-requests"];
const STUDENT_ONLY_PATHS = ["/find-adviser", "/my-requests"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Read cookie
  const token = request.cookies.get("session")?.value;
  const user = token ? await verifyToken(token) : null;

  const url = request.nextUrl.clone();

  // 2. If not logged in but visiting protected page → redirect to login
  if (!user && PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // 3. If logged in and trying to access public path → redirect to home
  if (user && PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // 4. Redirect faculty away from student-only pages
  if (
    user?.role === "faculty" &&
    STUDENT_ONLY_PATHS.some((path) => pathname.startsWith(path))
  ) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Allow request to continue
  return NextResponse.next();
}

// Apply middleware to all routes except assets
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
