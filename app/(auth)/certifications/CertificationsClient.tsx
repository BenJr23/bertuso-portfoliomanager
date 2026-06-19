"use client";

import { useMemo, useState } from "react";
import AddCertification from "../components/modals/AddCertification";
import EditCertification from "../components/modals/EditCertification";
import type { CertificationItem } from "@/app/_actions/certifications/getcertifications";

interface Props {
  initialCertifications: CertificationItem[];
  addCertificationAction: (input: { name: string; description?: string | null; image?: string | null }) => Promise<any>;
  editCertificationAction: (input: { id: string; name: string; description?: string | null; image?: string | null }) => Promise<any>;
  deleteCertificationAction: (id: string) => Promise<any>;
  uploadCertificationImageAction: (file: File) => Promise<any>;
}

export default function CertificationsClient({
  initialCertifications,
  addCertificationAction,
  editCertificationAction,
  deleteCertificationAction,
  uploadCertificationImageAction,
}: Props) {
  const [certifications, setCertifications] = useState(initialCertifications);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selected, setSelected] = useState<CertificationItem | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return certifications;
    return certifications.filter((cert) => {
      return [cert.name, cert.description || ""].some((value) => value.toLowerCase().includes(q));
    });
  }, [certifications, query]);

  function handleAdd(cert: CertificationItem) {
    setCertifications((prev) => [cert, ...prev]);
    setIsAddOpen(false);
  }

  function handleEdit(cert: CertificationItem) {
    setCertifications((prev) => prev.map((item) => (item.id === cert.id ? cert : item)));
    setIsEditOpen(false);
    setSelected(null);
  }

  function handleDelete(id: string) {
    setCertifications((prev) => prev.filter((item) => item.id !== id));
    setIsEditOpen(false);
    setSelected(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5 backdrop-blur-2xl lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Credentials</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Certifications</h2>
          <p className="mt-1 text-sm text-slate-400">Track the badges, licenses, and milestones that validate your craft.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search certifications..."
            className="min-w-[240px] rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-emerald-400/30"
          />
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="rounded-2xl bg-emerald-500/20 px-4 py-2.5 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/30"
          >
            + Add Certification
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-8 text-slate-400">No certifications found.</div>
        ) : (
          filtered.map((cert) => (
            <article
              key={cert.id}
              className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/70 backdrop-blur-2xl transition hover:border-emerald-400/20 hover:bg-slate-900/70"
            >
              <div className="aspect-video border-b border-white/10 bg-gradient-to-br from-emerald-400/10 via-slate-950 to-slate-900">
                {cert.image ? (
                  <img src={cert.image} alt={cert.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-500">No image provided</div>
                )}
              </div>
              <div className="space-y-4 p-5">
                <div>
                  <p className="mb-2 text-[10px] uppercase tracking-[0.32em] text-slate-400">Certification</p>
                  <h3 className="text-base font-semibold text-white">{cert.name}</h3>
                </div>
                <p className="text-sm text-slate-400">{cert.description || "No description yet."}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(cert);
                      setIsEditOpen(true);
                    }}
                    className="flex-1 rounded-xl bg-blue-500/20 px-3 py-2 text-sm font-medium text-blue-200 hover:bg-blue-500/30"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <AddCertification
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={(cert) => handleAdd(cert)}
        addCertificationAction={addCertificationAction}
        uploadCertificationImageAction={uploadCertificationImageAction}
      />

      <EditCertification
        open={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelected(null);
        }}
        certification={selected || undefined}
        onEdit={(cert) => handleEdit(cert)}
        onDelete={(id) => handleDelete(id)}
        editCertificationAction={editCertificationAction}
        deleteCertificationAction={deleteCertificationAction}
        uploadCertificationImageAction={uploadCertificationImageAction}
      />

    </div>
  );
}
