"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import AddProject from "../components/modals/AddProject";
import DeleteProject from "../components/modals/DeleteProject";
import EditProject from "../components/modals/EditProject";
import { getProjects } from "@/app/_actions/projects/getproject";
import type { ProjectFrameworkOption, ProjectRecord } from "@/app/_actions/projects/shared";

interface ProjectsPageClientProps {
  initialProjects: ProjectRecord[];
  initialFrameworks: ProjectFrameworkOption[];
  initialError: string | null;
}

export default function ProjectsPageClient({ initialProjects, initialFrameworks, initialError }: ProjectsPageClientProps) {
  const [projects, setProjects] = useState<ProjectRecord[]>(initialProjects);
  const [selectedFramework, setSelectedFramework] = useState("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectRecord | null>(null);
  const [deletingProject, setDeletingProject] = useState<ProjectRecord | null>(null);

  const frameworks = initialFrameworks;

  const filteredProjects = useMemo(
    () => (selectedFramework === "ALL" ? projects : projects.filter((project) => project.frameworkId === selectedFramework)),
    [projects, selectedFramework],
  );

  const frameworkOptions = useMemo(() => [{ id: "ALL", name: "All Projects", image: null }, ...frameworks], [frameworks]);

  async function reloadProjects() {
    setError(null);
    setIsLoading(true);

    try {
      const result = await getProjects();

      if (!result.success || !result.data) {
        setError(result.error || "Failed to fetch projects.");
        setProjects([]);
        return;
      }

      setProjects(result.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred while fetching projects.";
      setError(message);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleAdd(project: ProjectRecord) {
    setProjects((prev) => [project, ...prev]);
    setIsAddOpen(false);
  }

  function handleEdit(project: ProjectRecord) {
    setProjects((prev) => prev.map((item) => (item.id === project.id ? project : item)));
    setIsEditOpen(false);
    setEditingProject(null);
  }

  function handleDelete() {
    if (!deletingProject) {
      return;
    }

    setProjects((prev) => prev.filter((project) => project.id !== deletingProject.id));
    setIsDeleteOpen(false);
    setDeletingProject(null);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 backdrop-blur-2xl sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.32em] text-slate-500">Showcase Control</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Projects</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Build and curate project cards directly from the live database, grouped by framework.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void reloadProjects()}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/20"
            >
              + Add Project
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 rounded-[1.5rem] border border-white/10 bg-white/5 p-3">
          {frameworkOptions.map((framework) => {
            const active = selectedFramework === framework.id;

            return (
              <button
                key={framework.id}
                type="button"
                onClick={() => setSelectedFramework(framework.id)}
                className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {framework.id !== "ALL" && framework.image ? (
                  <Image src={framework.image} alt={framework.name} width={16} height={16} className="h-4 w-4 rounded-full object-cover" />
                ) : null}
                {framework.name}
              </button>
            );
          })}
        </div>
      </div>

      {error ? <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div> : null}

      {isLoading ? (
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-10 text-center text-slate-300 backdrop-blur-2xl">
          Loading projects...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-white/10 bg-slate-950/60 p-10 text-center backdrop-blur-2xl">
          <p className="text-lg font-semibold text-white">No projects found</p>
          <p className="mt-2 text-sm text-slate-400">Create the first project to start curating the portfolio.</p>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/20"
          >
            Add your first project
          </button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/70 backdrop-blur-2xl transition hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-slate-900/70"
            >
              <div className="aspect-video border-b border-white/10 bg-white/5">
                {project.imageUrl ? (
                  <div className="relative h-full w-full">
                    <Image src={project.imageUrl} alt={project.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-400/10 via-slate-950 to-slate-900">
                    <span className="text-sm uppercase tracking-[0.32em] text-slate-400">No image</span>
                  </div>
                )}
              </div>
              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                    {project.framework.name}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
                    Updated {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <h3 className="text-base font-semibold text-white">{project.name}</h3>
                <p className="line-clamp-3 text-sm text-slate-400">
                  {project.description || "No description has been added yet."}
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProject(project);
                      setIsEditOpen(true);
                    }}
                    className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeletingProject(project);
                      setIsDeleteOpen(true);
                    }}
                    className="rounded-2xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm font-medium text-red-100 transition hover:bg-red-400/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <AddProject
        open={isAddOpen}
        frameworks={frameworks}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAdd}
      />
      <EditProject
        key={editingProject?.id ?? "project-edit"}
        open={isEditOpen}
        frameworks={frameworks}
        project={editingProject}
        onClose={() => {
          setIsEditOpen(false);
          setEditingProject(null);
        }}
        onEdit={handleEdit}
        onDelete={() => {
          if (editingProject) {
            setDeletingProject(editingProject);
            setIsDeleteOpen(true);
          }
        }}
      />
      <DeleteProject
        open={isDeleteOpen}
        project={deletingProject}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingProject(null);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}