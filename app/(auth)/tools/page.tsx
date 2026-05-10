"use client";

import { useMemo, useState } from "react";
import { mockTools } from "../lib/mockData";

const categories = ["All", "Frontend", "Backend", "Database", "DevOps", "Testing", "Version Control", "Cloud"];

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTools = useMemo(
    () =>
      selectedCategory === "All"
        ? mockTools
        : mockTools.filter((tool) => tool.category === selectedCategory),
    [selectedCategory],
  );

  return (
    <div className="space-y-6">
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

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTools.map((tool) => (
          <article
            key={tool.id}
            className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6 text-center backdrop-blur-2xl transition hover:border-emerald-400/20 hover:bg-slate-900/70"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <img src={tool.picture} alt={tool.name} className="h-10 w-10 object-contain" />
            </div>
            <h3 className="text-base font-semibold text-white">{tool.name}</h3>
            <p className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              {tool.category}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
