"use client";

import { useEffect, useState } from "react";
import AddFramework from "../components/modals/AddFramework";
import EditFrameWork from "../components/modals/EditFrameWork";
import { getFrameworks } from "@/app/_actions/frameworks/getframeworks";

interface FrameworkItem {
  id: string;
  name: string;
  image: string | null;
  toolCount: number;
  projectCount: number;
}

export default function FrameworksPage() {
  const [frameworks, setFrameworks] = useState<FrameworkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingFramework, setEditingFramework] = useState<FrameworkItem | null>(null);

  useEffect(() => {
    async function fetchFrameworks() {
      try {
        const result = await getFrameworks();

        if (result.success && result.data) {
          setFrameworks(result.data);
        } else {
          setError(result.error || "Failed to fetch frameworks.");
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An error occurred while fetching frameworks.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFrameworks();
  }, []);

  function handleAdd(framework: FrameworkItem) {
    setFrameworks((prev) => [framework, ...prev]);
    setIsAddOpen(false);
  }

  function handleEdit(framework: FrameworkItem) {
    setFrameworks((prev) =>
      prev.map((item) =>
        item.id === framework.id
          ? {
              ...item,
              name: framework.name,
              image: framework.image,
            }
          : item,
      ),
    );
    setIsEditOpen(false);
    setEditingFramework(null);
  }

  function handleDelete() {
    if (!editingFramework) {
      return;
    }

    setFrameworks((prev) => prev.filter((framework) => framework.id !== editingFramework.id));
    setIsEditOpen(false);
    setEditingFramework(null);
  }

  function openEditModal(framework: FrameworkItem) {
    setEditingFramework(framework);
    setIsEditOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Frameworks</h2>
          <p className="mt-1 text-sm text-slate-400">Manage the frameworks that power your portfolio projects.</p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="rounded-2xl bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/30"
        >
          + Add Framework
        </button>
      </div>

      {error && <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-300">Loading frameworks...</p>
        </div>
      ) : frameworks.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-400">No frameworks found. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {frameworks.map((framework) => (
            <article
              key={framework.id}
              className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6 text-center backdrop-blur-2xl transition hover:border-emerald-400/20 hover:bg-slate-900/70"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                {framework.image ? (
                  <img src={framework.image} alt={framework.name} className="h-10 w-10 object-contain" />
                ) : (
                  <span className="text-xl font-semibold text-slate-300">{framework.name.charAt(0)}</span>
                )}
              </div>
              <h3 className="mb-5 text-base font-semibold text-white">{framework.name}</h3>
              <div className="space-y-2 text-left">
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
                  <span>Tools</span>
                  <span className="font-semibold text-white">{framework.toolCount}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
                  <span>Projects</span>
                  <span className="font-semibold text-white">{framework.projectCount}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(framework)}
                  className="flex-1 rounded-xl bg-blue-500/20 px-3 py-2 text-sm font-medium text-blue-200 hover:bg-blue-500/30"
                >
                  Edit
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <AddFramework open={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={handleAdd} />
      <EditFrameWork
        open={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingFramework(null);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
        framework={editingFramework || undefined}
      />
    </div>
  );
}
