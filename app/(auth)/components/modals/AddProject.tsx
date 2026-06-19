"use client";

import { useState, type FormEvent } from "react";
import { addProject } from "@/app/_actions/projects/addproject";
import type { ProjectFrameworkOption, ProjectRecord } from "@/app/_actions/projects/shared";

interface AddProjectProps {
  open: boolean;
  onClose: () => void;
  onAdd: (project: ProjectRecord) => void;
  frameworks: ProjectFrameworkOption[];
}

export default function AddProject({ open, onClose, onAdd, frameworks }: AddProjectProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [frameworkId, setFrameworkId] = useState(frameworks[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function resetForm() {
    setName("");
    setDescription("");
    setImageUrl("");
    setFrameworkId(frameworks[0]?.id ?? "");
    setLoading(false);
    setError(null);
    onClose();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!name.trim() || !frameworkId.trim()) {
      setError("Name and framework are required.");
      return;
    }

    setLoading(true);
    try {
      const result = await addProject({
        name: name.trim(),
        description: description.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        frameworkId,
      });

      if (!result.success || !result.data) {
        setError(result.error || "Failed to add project.");
        return;
      }

      onAdd(result.data);
      resetForm();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={resetForm} />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/40 backdrop-blur-2xl"
      >
        <div className="border-b border-white/10 px-6 py-5 sm:px-8">
          <p className="text-[10px] uppercase tracking-[0.32em] text-slate-500">Project Forge</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Add Project</h3>
        </div>

        <div className="grid gap-5 p-6 sm:p-8">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-400" htmlFor="project-name">
              Name
            </label>
            <input
              id="project-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/30"
              placeholder="Project name"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-400" htmlFor="project-framework">
              Framework
            </label>
            <select
              id="project-framework"
              value={frameworkId}
              onChange={(event) => setFrameworkId(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400/30"
            >
              <option value="" className="bg-slate-900 text-white">
                Select a framework
              </option>
              {frameworks.map((framework) => (
                <option key={framework.id} value={framework.id} className="bg-slate-900 text-white">
                  {framework.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-400" htmlFor="project-image-url">
              Image URL
            </label>
            <input
              id="project-image-url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/30"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-400" htmlFor="project-description">
              Description
            </label>
            <textarea
              id="project-description"
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/30"
              placeholder="Describe the outcome, scope, or impact..."
            />
          </div>

          {error ? <p className="text-sm text-red-300">{error}</p> : null}

          <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/20 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Add Project"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}