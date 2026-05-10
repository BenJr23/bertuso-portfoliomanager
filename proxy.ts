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
