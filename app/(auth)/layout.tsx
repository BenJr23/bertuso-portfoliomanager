"use client";

import { ReactNode } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AppShell from "./components/AppShell";

/**
 * Protected layout for authenticated routes
 * All routes inside (auth) group will require authentication
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // Client-side auth check as fallback
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <AppShell>{children}</AppShell>;
}
