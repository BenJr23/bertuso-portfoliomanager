"use client";

import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const portfolioHighlights = [
  { label: "Projects completed", value: "24", change: "+3 this month" },
  { label: "Skills mastered", value: "18", change: "3 new skills" },
  { label: "Open source contrib", value: "156", change: "+42 commits" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  const { user } = session;

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-10 lg:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_26%),radial-gradient(circle_at_70%_20%,_rgba(59,130,246,0.16),_transparent_26%),linear-gradient(180deg,_rgba(2,6,23,0.96),_rgba(8,17,31,1))]" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 backdrop-blur-2xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Portfolio hub</p>
              <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                Welcome back, {user.name || "Developer"}.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Track your projects, showcase your skills, and manage your professional portfolio all in one place.
              </p>
            </div>

            <button
              type="button"
              onClick={async () => {
                await signOut();
                router.push("/");
              }}
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Sign out
            </button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {portfolioHighlights.map((highlight) => (
            <article key={highlight.label} className="rounded-[1.75rem] border border-white/10 bg-white/6 p-6 backdrop-blur-xl">
              <p className="text-sm text-slate-400">{highlight.label}</p>
              <p className="mt-4 text-3xl font-semibold text-white">{highlight.value}</p>
              <p className="mt-2 text-sm text-emerald-300">{highlight.change}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <article className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 backdrop-blur-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">This week</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Keep your profile fresh and up to date.</h2>
              </div>
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
                7 pending
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ["Update projects", "2 projects need documentation"],
                ["Add testimonials", "1 new feedback to feature"],
                ["Polish portfolio", "Review showcase page copy"],
                ["Code cleanup", "Refactor outdated snippets"],
              ].map(([title, description]) => (
                <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm font-medium text-white">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 backdrop-blur-2xl sm:p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Profile</p>
            <div className="mt-4 space-y-3">
              <h2 className="text-2xl font-semibold text-white">{user.name || "Developer"}</h2>
              <p className="text-sm text-slate-300">{user.email}</p>
            </div>

            <div className="mt-8 space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5">
              <div>
                <p className="text-sm text-slate-400">Portfolio status</p>
                <p className="mt-1 text-sm text-white">Active & visible</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Profile views</p>
                <p className="mt-1 text-sm text-white">284 this month</p>
              </div>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
