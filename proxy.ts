import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * Verify user session via Better Auth
 * Used by protected layouts to check authentication
 */
export async function verifySession() {
  try {
    const cookieStore = await cookies();
    
    // Get session from Better Auth
    const session = await auth.api.getSession({
      headers: {
        cookie: cookieStore.toString(),
      },
    });

    return {
      isAuthenticated: !!session,
      session,
    };
  } catch (error) {
    console.error("Error verifying session:", error);
    return {
      isAuthenticated: false,
      session: null,
    };
  }
}

/**
 * Redirect unauthenticated users
 * To be used in protected layout components
 */
export async function requireAuth() {
  const { isAuthenticated, session } = await verifySession();

  if (!isAuthenticated) {
    const { redirect } = await import("next/navigation");
    redirect("/sign-in");
  }

  return session;
}

/**
 * Main proxy function for Next.js 16+
 * Handles authentication checks for protected routes
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes - always allow
  const publicRoutes = ["/", "/sign-in", "/sign-up"];
  const isPublic = publicRoutes.includes(pathname) || pathname.startsWith("/api/auth");
  
  if (isPublic) {
    return NextResponse.next();
  }

  // Protected routes - check session
  const protectedRoutes = ["/dashboard"];
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected) {
    try {
      const cookieStore = await cookies();
      const session = await auth.api.getSession({
        headers: {
          cookie: cookieStore.toString(),
        },
      });

      if (!session) {
        // Not authenticated - redirect to sign-in
        return NextResponse.redirect(
          new URL(`/sign-in?from=${pathname}`, request.url)
        );
      }
    } catch (error) {
      console.error("Proxy auth check failed:", error);
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files and internal Next.js routes
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
