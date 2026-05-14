"use client";

import { useEffect, useMemo, useState } from "react";
import { mockTools } from "../lib/mockData";
import AddTools from "../components/modals/AddTools";
import EditTools from "../components/modals/EditTools";
import { getTools } from "@/app/_actions/tools/gettools";

const categories = ["All", "Frontend", "Backend", "Database", "DevOps", "Testing", "Version Control", "Cloud"];

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
    // Add the new tool to the list immediately (optimistic update)
    const newTool = {
      id: Date.now().toString(),
      name: tool.name,
      picture: tool.picture || null,
      category: tool.category,
    };
    setTools((prev) => [newTool, ...prev]);
    setIsAddOpen(false);
    setSelectedCategory("All");
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
        <div className="flex flex-wrap gap-2 rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-3 backdrop-blur-2xl">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-2xl px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="rounded-2xl px-4 py-2 text-sm font-semibold bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30"
          >
            + Add Tool
          </button>
        </div>
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
                <img src={tool.picture || "/"} alt={tool.name} className="h-10 w-10 object-contain" />
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
