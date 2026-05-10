import { mockCertifications } from "../lib/mockData";

export default function CertificationsPage() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {mockCertifications.map((cert) => (
        <article
          key={cert.id}
          className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/70 backdrop-blur-2xl transition hover:border-emerald-400/20 hover:bg-slate-900/70"
        >
          <div className="aspect-video border-b border-white/10 bg-emerald-400/5">
            <img src={cert.image} alt={cert.name} className="h-full w-full object-cover" />
          </div>
          <div className="p-5">
            <p className="mb-2 text-[10px] uppercase tracking-[0.32em] text-slate-400">Certification</p>
            <h3 className="mb-2 text-base font-semibold text-white">{cert.name}</h3>
            <p className="text-sm text-slate-400">{cert.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
