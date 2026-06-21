"use client";

import { useMemo, useState } from "react";
import AddAboutMe from "../components/modals/AddAboutMe";
import DeleteAboutMe from "../components/modals/DeleteAboutMe";
import EditAboutMe from "../components/modals/EditAboutMe";
import { getAboutMe } from "@/app/_actions/aboutme/getaboutme";
import { getAboutMeCategoryLabel, type AboutMeRecord } from "@/app/_actions/aboutme/shared";

interface AboutPageClientProps {
  initialAboutMeEntries: AboutMeRecord[];
  initialError: string | null;
}

export default function AboutPageClient({ initialAboutMeEntries, initialError }: AboutPageClientProps) {
  const [aboutMeEntries, setAboutMeEntries] = useState<AboutMeRecord[]>(initialAboutMeEntries);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<AboutMeRecord | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<AboutMeRecord | null>(null);

  async function loadAboutMe() {
    setError(null);
    setIsLoading(true);

    try {
      const result = await getAboutMe();

      if (!result.success || !result.data) {
        setError(result.error || "Failed to fetch about me entries.");
        setAboutMeEntries([]);
        return;
      }

      setAboutMeEntries(result.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred while fetching about me entries.";
      setError(message);
      setAboutMeEntries([]);
    } finally {
      setIsLoading(false);
    }
  }

  const latestUpdated = useMemo(() => {
    if (aboutMeEntries.length === 0) {
      return null;
    }

    return new Date(aboutMeEntries[0].updatedAt).toLocaleString();
  }, [aboutMeEntries]);

  const categoryCount = aboutMeEntries.length;

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 backdrop-blur-2xl sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.32em] text-slate-500">Database Storyline</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">About Me</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Build, edit, and remove story sections directly against the authenticated database record set.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/20"
          >
            + Add Entry
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-[10px] uppercase tracking-[0.32em] text-slate-500">Entries</p>
            <p className="mt-2 text-2xl font-semibold text-white">{categoryCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-[10px] uppercase tracking-[0.32em] text-slate-500">Latest Sync</p>
            <p className="mt-2 text-sm font-semibold text-white">{latestUpdated ?? "No entries yet"}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-[10px] uppercase tracking-[0.32em] text-slate-500">Source</p>
            <p className="mt-2 text-sm font-semibold text-white">Prisma + server actions</p>
          </div>
        </div>
      </div>

      {error ? <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div> : null}

      {isLoading ? (
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-10 text-center text-slate-300 backdrop-blur-2xl">
          Loading about me entries...
        </div>
      ) : aboutMeEntries.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-white/10 bg-slate-950/60 p-10 text-center backdrop-blur-2xl">
          <p className="text-lg font-semibold text-white">No about me entries yet</p>
          <p className="mt-2 text-sm text-slate-400">Create the first section to start reflecting the live database.</p>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/20"
          >
            Add your first entry
          </button>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {aboutMeEntries.map((entry, index) => (
            <article
              key={entry.id}
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/75 backdrop-blur-2xl transition hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-slate-900/80"
            >
              <div className="border-b border-white/10 px-6 py-5 sm:px-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.32em] text-slate-500">
                      {getAboutMeCategoryLabel(entry.category)}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{entry.title}</h3>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.32em] text-slate-400">
                    0{index + 1}
                  </span>
                </div>
              </div>

              <div className="space-y-5 px-6 py-6 sm:px-8">
                <p className="text-sm leading-7 text-slate-300">{entry.description || "No description has been added yet."}</p>

                {/* Date Timeline */}
                {(entry.startDate || entry.endDate || entry.isPresent) && (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
                    <span>
                      {entry.startDate && new Date(entry.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      {entry.startDate && (entry.endDate || entry.isPresent) && ' → '}
                      {entry.isPresent ? (
                        <span className="font-semibold text-emerald-300">Present</span>
                      ) : entry.endDate ? (
                        new Date(entry.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                      ) : null}
                    </span>
                  </div>
                )}

                {/* Related Projects */}
                {entry.projects && entry.projects.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Related Projects</p>
                    <div className="flex flex-wrap gap-2">
                      {entry.projects.map((project) => (
                        <span
                          key={project.id}
                          className="inline-flex items-center rounded-lg bg-emerald-400/20 border border-emerald-400/30 px-2.5 py-1 text-xs font-medium text-emerald-200"
                        >
                          {project.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span>Created {new Date(entry.createdAt).toLocaleDateString()}</span>
                  <span>Updated {new Date(entry.updatedAt).toLocaleDateString()}</span>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEntry(entry);
                      setIsEditOpen(true);
                    }}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeletingEntry(entry);
                      setIsDeleteOpen(true);
                    }}
                    className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-400/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <AddAboutMe
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSaved={() => {
          void loadAboutMe();
        }}
      />
      <EditAboutMe
        key={editingEntry?.id ?? "about-edit"}
        open={isEditOpen}
        aboutMe={editingEntry}
        onClose={() => {
          setIsEditOpen(false);
          setEditingEntry(null);
        }}
        onSaved={() => {
          void loadAboutMe();
        }}
      />
      <DeleteAboutMe
        open={isDeleteOpen}
        aboutMe={deletingEntry}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingEntry(null);
        }}
        onDeleted={() => {
          void loadAboutMe();
        }}
      />
    </div>
  );
}