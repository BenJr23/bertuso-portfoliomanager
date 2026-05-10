"use client";

import { useMemo, useState } from "react";
import { mockFrameworks, mockProjects } from "../lib/mockData";

const allFrameworks = ["ALL", ...mockFrameworks.map((framework) => framework.id)];

export default function ProjectsPage() {
  const [selectedFramework, setSelectedFramework] = useState("ALL");

  const filteredProjects = useMemo(
    () =>
      selectedFramework === "ALL"
        ? mockProjects
        : mockProjects.filter((project) => project.frameworkId === selectedFramework),
    [selectedFramework],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-3 backdrop-blur-2xl">
        {allFrameworks.map((frameworkId) => {
          const framework = mockFrameworks.find((item) => item.id === frameworkId);
          const label = frameworkId === "ALL" ? "All Projects" : framework?.name ?? frameworkId;
          return (
            <button
              key={frameworkId}
              type="button"
              onClick={() => setSelectedFramework(frameworkId)}
              className={`rounded-2xl px-4 py-2 text-sm font-medium transition-colors ${
                selectedFramework === frameworkId
                  ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <article
            key={project.id}
            className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/70 backdrop-blur-2xl transition hover:border-emerald-400/20 hover:bg-slate-900/70"
          >
            <div className="aspect-video border-b border-white/10 bg-white/5">
              <img src={project.imageUrl} alt={project.name} className="h-full w-full object-cover" />
            </div>
            <div className="p-5">
              <p className="mb-3 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                {project.framework}
              </p>
              <h3 className="mb-2 text-base font-semibold text-white">{project.name}</h3>
              <p className="line-clamp-2 text-sm text-slate-400">{project.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
