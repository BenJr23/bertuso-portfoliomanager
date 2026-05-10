import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Hook to protect pages that require authentication
 * Redirects to /sign-in if user is not authenticated
 */
export function useProtectedRoute() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    }
  }, [session, isPending, router]);

  return { isAuthenticated: !!session, isLoading: isPending };
}

/**
 * Hook to redirect authenticated users away from auth pages
 * Redirects to /dashboard if user is already authenticated
 */
export function usePublicRoute() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && session) {
      router.push("/dashboard");
    }
  }, [session, isPending, router]);

  return { isAuthenticated: !!session, isLoading: isPending };
}

/**
 * Hook to get current session state
 */
export function useAuth() {
  const { data: session, isPending, error } = useSession();

  return {
    session,
    isAuthenticated: !!session,
    isLoading: isPending,
    error,
  };
}
