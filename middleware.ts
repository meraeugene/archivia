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
  "/bookmarks",

  // student
  "/find-adviser",
  "/my-requests",
  "/publish-thesis",

  // faculty
  "/advisees",
  "/dashboard",
  "/requests",
  "/thesis-approval",
  "/settings",
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

  // 4. Faculty trying to access student-only page → redirect home
  if (
    user?.role === "faculty" &&
    STUDENT_ONLY_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    )
  ) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // 5.  Student with adviser → prevent access to /find-adviser
  const supabase = await createClient();

  if (user?.role === "student" && pathname.startsWith("/find-adviser")) {
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

  // 6. Student without adviser → block /publish-thesis
  if (user?.role === "student" && pathname.startsWith("/publish-thesis")) {
    const { data: adviser } = await supabase
      .from("student_adviser_view")
      .select("adviser_id")
      .eq("student_id", user.sub)
      .maybeSingle();

    if (!adviser) {
      url.pathname = "/find-adviser";
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
