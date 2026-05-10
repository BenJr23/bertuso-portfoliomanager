"use client";

import { mockFrameworks, mockProjects, mockTools } from "../lib/mockData";

const highlights = [
  { label: "Projects completed", value: "24", change: "+3 this month" },
  { label: "Skills mastered", value: "18", change: "3 new skills" },
  { label: "Open source contrib", value: "156", change: "+42 commits" },
];

const updates = [
  ["Updated profile", "Added phone number and LinkedIn link"],
  ["Published project", "Released a new portfolio case study"],
  ["Added framework", "Included Next.js and React Native"],
  ["Tracked tools", "Documented frontend and backend stack"],
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {highlights.map((highlight) => (
          <article
            key={highlight.label}
            className="rounded-[1.75rem] border border-white/10 bg-white/6 p-6 backdrop-blur-xl"
          >
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
              <h2 className="mt-3 text-2xl font-semibold text-white">Keep your portfolio fresh and up to date.</h2>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
              7 pending
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {updates.map(([title, description]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-medium text-white">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 backdrop-blur-2xl sm:p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Workspace</p>
          <div className="mt-4 space-y-3">
            <h2 className="text-2xl font-semibold text-white">Portfolio overview</h2>
            <p className="text-sm text-slate-300">A quick snapshot of your current content library.</p>
          </div>

          <div className="mt-8 space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div>
              <p className="text-sm text-slate-400">Tools tracked</p>
              <p className="mt-1 text-sm text-white">{mockTools.length} documented skills</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Frameworks tracked</p>
              <p className="mt-1 text-sm text-white">{mockFrameworks.length} reusable stacks</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Projects tracked</p>
              <p className="mt-1 text-sm text-white">{mockProjects.length} showcased projects</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
