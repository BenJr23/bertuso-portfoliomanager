import { getDashboard } from "@/app/_actions/dashboard/getdashboard";

export default async function DashboardPage() {
  const result = await getDashboard();

  if (!result.success || !result.data) {
    return (
      <div className="rounded-[2rem] border border-red-400/20 bg-red-500/10 p-6 text-sm text-red-200">
        {result.error || "Failed to load dashboard."}
      </div>
    );
  }

  const { userName, stats, updates } = result.data;

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 backdrop-blur-2xl sm:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Portfolio Control</p>
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold text-white">Welcome back, {userName}.</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              This dashboard shows only the live portfolio data you manage here: tools, frameworks, projects, and certifications.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
            Live data
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6 backdrop-blur-2xl">
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="mt-4 text-3xl font-semibold text-white">{stat.value}</p>
            <p className="mt-2 text-sm text-slate-300">{stat.suffix}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 backdrop-blur-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Recent activity</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Latest portfolio updates</h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {updates.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300 md:col-span-2">
              No updates yet. Add a tool, framework, project, or certification to populate this area.
            </div>
          ) : (
            updates.map((update) => (
              <div key={`${update.title}-${update.description}`} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-white">{update.title}</p>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">{update.updatedAt}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{update.description}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
