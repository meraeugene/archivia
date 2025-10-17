import { NextResponse, type NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { createClient } from "./utils/supabase/server";

const PUBLIC_PATHS = ["/auth/login"];
const PROTECTED_PATHS = [
  // root
  "/",
  "/advisers",
  "/browse",
  "/profile",

  // stuent
  "/find-adviser",
  "/my-requests",

  // faculty
  "/advisees",
  "/dashboard",
  "/requests",
  "/settings",
  "/upload-thesis",
];
const STUDENT_ONLY_PATHS = ["/find-adviser", "/my-requests"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  // 1. Read cookie and verify token
  const token = request.cookies.get("session")?.value;
  const user = token ? await verifyToken(token).catch(() => null) : null;

  // 2. If not logged in but visiting protected page → redirect to login
  if (
    !user &&
    PROTECTED_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    )
  ) {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // 3. If logged in and trying to access public path → redirect to home
  if (
    user &&
    PUBLIC_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    )
  ) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // 4. Redirect faculty away from student-only pages
  if (
    user?.role === "faculty" &&
    STUDENT_ONLY_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    )
  ) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // 5. If student already has an adviser, redirect away from find-adviser page
  if (user?.role === "student" && pathname.startsWith("/find-adviser")) {
    const supabase = await createClient();

    const { data: adviser } = await supabase
      .from("student_adviser_view")
      .select("adviser_id")
      .eq("student_id", user.sub)
      .maybeSingle();

    if (adviser) {
      url.pathname = "/my-requests";
      return NextResponse.redirect(url);
    }
  }

  // Allow request to continue
  return NextResponse.next();
}

// Apply middleware to all routes except assets
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
