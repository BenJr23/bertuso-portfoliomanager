"use client";

import { useEffect, useMemo, useState } from "react";
import AddTools from "../components/modals/AddTools";
import EditTools from "../components/modals/EditTools";
import { getTools } from "@/app/_actions/tools/gettools";

const categories = ["All", "Frontend", "Backend", "Database", "DevOps", "Testing", "Version Control", "Language", "UI Toolkit", "API", "Mobile", "Cloud", "Monitoring", "Security", "Caching Layer", "ORM", "Task Scheduling", "Backend Automation"];

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [tools, setTools] = useState<Array<{ id: string; name: string; picture: string | null; category: string }>>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<{ id: string; name: string; category: string; picture: string | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tools from database on mount
  useEffect(() => {
    async function fetchTools() {
      try {
        const result = await getTools();
        if (result.success && result.data) {
          setTools(result.data);
        } else {
          setError(result.error || "Failed to fetch tools");
        }
      } catch (err: any) {
        setError(err?.message || "An error occurred while fetching tools");
      } finally {
        setIsLoading(false);
      }
    }
    fetchTools();
  }, []);

  const filteredTools = useMemo(
    () =>
      selectedCategory === "All"
        ? tools
        : tools.filter((tool) => tool.category === selectedCategory),
    [selectedCategory, tools],
  );

  function handleAdd(tool: { name: string; picture?: string; category: string }) {
    // Optionally add the new tool to the list immediately (optimistic update)
    // In this case, we skip it to avoid ID mismatches. The tool list will refresh on next load.
    setIsAddOpen(false);
    setSelectedCategory("All");
    // Optionally: reload tools to reflect new addition
    // (Uncomment if you want instant feedback)
    // void (async () => {
    //   const result = await getTools();
    //   if (result.success && result.data) setTools(result.data);
    // })();
  }

  function handleEdit(tool: { id: string; name: string; picture?: string; category: string }) {
    // Update the tool in the list
    setTools((prev) =>
      prev.map((t) => (t.id === tool.id ? { ...t, name: tool.name, category: tool.category, picture: tool.picture || null } : t))
    );
    setIsEditOpen(false);
    setEditingTool(null);
  }

  function handleDelete() {
    // Remove the deleted tool from the list
    if (editingTool) {
      setTools((prev) => prev.filter((t) => t.id !== editingTool.id));
    }
  }

  function openEditModal(tool: { id: string; name: string; picture: string | null; category: string }) {
    setEditingTool(tool);
    setIsEditOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-2 text-sm font-medium text-slate-300 backdrop-blur-2xl focus:border-emerald-400/30 focus:outline-none"
        >
          {categories.map((category) => (
            <option key={category} value={category} className="bg-slate-950 text-white">
              {category}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="rounded-2xl px-4 py-2 text-sm font-semibold bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30"
        >
          + Add Tool
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-300">Loading tools...</p>
        </div>
      ) : filteredTools.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-400">No tools found. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTools.map((tool) => (
            <article
              key={tool.id}
              className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6 text-center backdrop-blur-2xl transition hover:border-emerald-400/20 hover:bg-slate-900/70"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                {tool.picture ? (
                  <img src={tool.picture} alt={tool.name} className="h-10 w-10 object-contain" />
                ) : (
                  <span className="text-xl font-semibold text-slate-300">{tool.name.charAt(0)}</span>
                )}
              </div>
              <h3 className="text-base font-semibold text-white">{tool.name}</h3>
              <p className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                {tool.category}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(tool)}
                  className="flex-1 rounded-lg bg-blue-500/20 px-3 py-2 text-xs font-medium text-blue-200 hover:bg-blue-500/30"
                >
                  Edit
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <AddTools open={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={handleAdd} />
      <EditTools
        open={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingTool(null);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
        tool={editingTool || undefined}
      />
    </div>
  );
}
