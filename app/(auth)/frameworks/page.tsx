import { mockFrameworks } from "../lib/mockData";

export default function FrameworksPage() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {mockFrameworks.map((framework) => (
        <article
          key={framework.id}
          className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6 text-center backdrop-blur-2xl transition hover:border-emerald-400/20 hover:bg-slate-900/70"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <img src={framework.image} alt={framework.name} className="h-10 w-10 object-contain" />
          </div>
          <h3 className="mb-5 text-base font-semibold text-white">{framework.name}</h3>
          <div className="space-y-2 text-left">
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
              <span>Tools</span>
              <span className="font-semibold text-white">{framework.tools.length}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
              <span>Projects</span>
              <span className="font-semibold text-white">{framework.projects.length}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
