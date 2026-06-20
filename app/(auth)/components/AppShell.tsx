"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { signOut, useSession } from "@/lib/auth-client";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
  { href: "/about", label: "About Me" },
  { href: "/tools", label: "Tools" },
  { href: "/frameworks", label: "Frameworks" },
  { href: "/projects", label: "Projects" },
  { href: "/certifications", label: "Certifications" },
];

const pageMeta: Record<string, { eyebrow: string; title: string; subtitle: string }> = {
  "/dashboard": {
    eyebrow: "Portfolio hub",
    title: "Dashboard",
    subtitle: "Track your projects, skills, and portfolio activity.",
  },
  "/profile": {
    eyebrow: "Account",
    title: "Profile",
    subtitle: "Manage your personal information and contact links.",
  },
  "/about": {
    eyebrow: "Story",
    title: "About Me",
    subtitle: "Manage your about sections and highlights.",
  },
  "/tools": {
    eyebrow: "Stack",
    title: "Tools",
    subtitle: "Manage your technical skills and tools.",
  },
  "/frameworks": {
    eyebrow: "Stack",
    title: "Frameworks",
    subtitle: "Organize your frameworks and supporting tools.",
  },
  "/projects": {
    eyebrow: "Showcase",
    title: "Projects",
    subtitle: "Showcase your work and accomplishments.",
  },
  "/certifications": {
    eyebrow: "Achievements",
    title: "Certifications",
    subtitle: "Showcase your professional certifications.",
  },
};

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const meta = pageMeta[pathname] ?? pageMeta["/dashboard"];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_26%),radial-gradient(circle_at_70%_20%,_rgba(59,130,246,0.16),_transparent_26%),linear-gradient(180deg,_rgba(2,6,23,0.96),_rgba(8,17,31,1))]" />
      <div className="relative flex min-h-screen">
        <aside className="hidden w-72 flex-col border-r border-white/10 bg-slate-950/70 px-5 py-6 backdrop-blur-2xl lg:flex">
          <div className="flex items-center gap-3 rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-sm font-semibold text-emerald-200">
              P
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-slate-400">Portfolio</p>
              <p className="text-sm font-semibold text-white">Hub</p>
            </div>
          </div>

          <nav className="mt-8 space-y-1">
            <p className="px-4 pb-2 text-[10px] uppercase tracking-[0.32em] text-slate-500">
              Navigation
            </p>
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                      : "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {session?.user ? (
            <div className="mt-auto rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? "User"}
                    className="h-12 w-12 rounded-2xl object-cover ring-2 ring-white/10"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-sm font-semibold text-emerald-200 ring-2 ring-white/10">
                    {session.user.name
                      ? session.user.name
                          .split(" ")
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((part) => part[0].toUpperCase())
                          .join("")
                      : "UD"}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{session.user.name ?? "Developer"}</p>
                  <p className="truncate text-xs text-slate-400">{session.user.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  router.push("/");
                }}
                className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
              >
                Logout
              </button>
            </div>
          ) : null}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 px-4 py-4 backdrop-blur-2xl sm:px-6 lg:px-8">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 px-4 py-4 sm:px-6">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.32em] text-slate-400">{meta.eyebrow}</p>
                <h1 className="truncate text-xl font-semibold text-white sm:text-2xl">{meta.title}</h1>
                <p className="truncate text-sm text-slate-400">{meta.subtitle}</p>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
