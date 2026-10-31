import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { auth } from "@/lib/auth";
import AppShell from "./components/AppShell";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const session = await auth.api.getSession({
    headers: { cookie: cookieStore.toString() },
  });

  if (!session) {
    redirect("/");
  }

  return <AppShell>{children}</AppShell>;
}
