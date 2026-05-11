import { mockAboutMe } from "../lib/mockData";

export default function AboutPage() {
  return (
    <div className="grid max-w-4xl gap-6">
      {mockAboutMe.map((entry) => (
        <article key={entry.id} className="rounded-[2rem] border border-white/10 bg-slate-950/70 backdrop-blur-2xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <p className="text-[10px] uppercase tracking-[0.32em] text-slate-400">{entry.category.replaceAll("_", " ")}</p>
            <h3 className="mt-2 text-xl font-semibold text-white">{entry.title}</h3>
            <p className="mt-4 text-slate-300 leading-relaxed">{entry.description}</p>
            <p className="mt-5 text-xs text-slate-500">Updated {new Date(entry.updatedAt).toLocaleDateString()}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
