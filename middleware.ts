import { NextResponse, type NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { createClient } from "./utils/supabase/server";

const PUBLIC_PATHS = ["/auth/login", "/auth/forgot-password"];
const PROTECTED_PATHS = [
  // root
  "/",
  "/advisers",
  "/bookmarks",
  "/profile",
  "/settings",

  // student
  "/find-adviser",
  "/my-requests",
  "/publish-thesis",

  // faculty
  "/advisees",
  "/advisory-requests",
  "/dashboard",
  "/handled-thesis",
  "/thesis-approval",

  // admin
  "/backup",
  "/admin/dashboard",
  "/manage-theses",
  "/manage-advisees",
  "/manage-users",
  "/retrain-model",
  "/admin/settings",
];

const STUDENT_ONLY_PATHS = ["/find-adviser", "/my-requests", "/publish-thesis"];

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

  // 4. Faculty or Admin trying to access student-only page → redirect home
  if (
    (user?.role === "faculty" || user?.role === "admin") &&
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

  // 7. Student without authorization → block /publish-thesis
  if (user?.role === "student" && pathname.startsWith("/publish-thesis")) {
    // query student_requests where status = 'accepted' and is_authorized = true
    const { data: authorizedRequests, error } = await supabase
      .from("student_requests")
      .select("id")
      .eq("student_id", user.sub)
      .eq("status", "accepted")
      .eq("is_authorized", true)
      .limit(1);

    if (error) {
      console.error("Error checking authorization:", error);
      // fail-safe: block access if error
      url.pathname = "/my-requests";
      return NextResponse.redirect(url);
    }

    if (!authorizedRequests || authorizedRequests.length === 0) {
      // Student is not authorized → redirect
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
