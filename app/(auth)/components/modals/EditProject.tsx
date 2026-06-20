"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { editProject } from "@/app/_actions/projects/editproject";
import { uploadAuthenticatedImage } from "@/lib/supabase-storage";
import type { ProjectFrameworkOption, ProjectRecord } from "@/app/_actions/projects/shared";

interface EditProjectProps {
  open: boolean;
  onClose: () => void;
  onEdit: (project: ProjectRecord) => void;
  onDelete: () => void;
  project?: ProjectRecord | null;
  frameworks: ProjectFrameworkOption[];
}

export default function EditProject({ open, onClose, onEdit, onDelete, project, frameworks }: EditProjectProps) {
  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [roles, setRoles] = useState<string[]>(project?.roles ?? []);
  const [roleInput, setRoleInput] = useState("");
  const [imageUrl, setImageUrl] = useState(project?.imageUrl ?? "");
  const [frameworkId, setFrameworkId] = useState(project?.frameworkId ?? frameworks[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(project?.imageUrl ?? null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(project?.imageUrl ?? null);

  if (!open || !project) return null;

  const currentProject: ProjectRecord = project;

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      setPreviewUrl(readerEvent.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  function addRole() {
    const value = roleInput.trim();
    if (!value) return;
    if (roles.includes(value)) {
      setRoleInput("");
      return;
    }

    setRoles((prev) => [...prev, value]);
    setRoleInput("");
  }

  function removeRole(roleToRemove: string) {
    setRoles((prev) => prev.filter((role) => role !== roleToRemove));
  }

  function handleRoleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addRole();
    }
  }

  async function handleUploadToSupabase() {
    if (!selectedFile) {
      setUploadError("No file selected.");
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const result = await uploadAuthenticatedImage(formData, "projects");

      if (!result.success) {
        setUploadError(result.error || "Upload failed.");
        return;
      }

      setImageUrl(result.url || "");
      setUploadedUrl(result.url || "");
      setPreviewUrl(result.url || "");
      setSelectedFile(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred during upload.";
      setUploadError(message);
    } finally {
      setIsUploading(false);
    }
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
      const result = await editProject({
        id: currentProject.id,
        name: name.trim(),
        description: description.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        roles,
        frameworkId,
      });

      if (!result.success || !result.data) {
        setError(result.error || "Failed to update project.");
        return;
      }

      onEdit(result.data);
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 py-4 sm:items-center">
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/40 backdrop-blur-2xl"
      >
        <div className="border-b border-white/10 px-6 py-5 sm:px-8">
          <p className="text-[10px] uppercase tracking-[0.32em] text-slate-500">Project Forge</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Edit Project</h3>
        </div>

        <div className="grid gap-5 p-6 sm:p-8">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-400" htmlFor="edit-project-name">
              Name
            </label>
            <input
              id="edit-project-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-400" htmlFor="edit-project-framework">
              Framework
            </label>
            <select
              id="edit-project-framework"
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
            <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-400" htmlFor="edit-project-image-url">
              Image URL
            </label>
            <input
              id="edit-project-image-url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-400">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-400 focus:outline-none"
              disabled={isUploading}
            />
            {previewUrl ? (
              <div className="mt-3 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <img src={previewUrl} alt="Preview" className="h-14 w-14 object-contain" />
              </div>
            ) : null}
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handleUploadToSupabase}
                disabled={isUploading}
                className="flex-1 rounded-2xl bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-500/30 disabled:opacity-50"
              >
                {isUploading ? "Uploading..." : "Upload Image"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setImageUrl("");
                  setPreviewUrl(null);
                  setSelectedFile(null);
                  setUploadError(null);
                }}
                className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/5"
              >
                Clear
              </button>
            </div>
            {uploadError ? <p className="mt-2 text-xs text-red-400">{uploadError}</p> : null}
            {uploadedUrl ? (
              <p className="mt-2 text-xs text-emerald-200">Image uploaded to bucket</p>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-400" htmlFor="edit-project-description">
              Description
            </label>
            <textarea
              id="edit-project-description"
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-400" htmlFor="edit-project-roles">
              Roles
            </label>
            <div className="grid gap-3">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="edit-project-roles"
                  value={roleInput}
                  onChange={(event) => setRoleInput(event.target.value)}
                  onKeyDown={handleRoleKeyDown}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/30"
                  placeholder="Add a role and press Enter"
                />
                <button
                  type="button"
                  onClick={addRole}
                  className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/20"
                >
                  Add Role
                </button>
              </div>
              {roles.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {roles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => removeRole(role)}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200 transition hover:bg-white/10"
                    >
                      <span>{role}</span>
                      <span className="text-xs text-slate-400">×</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Add one or more roles used in the project, such as Frontend, Backend, or DevOps.</p>
              )}
            </div>
          </div>

          {error ? <p className="text-sm text-red-300">{error}</p> : null}

          <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={onDelete}
              className="rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-3 text-sm font-semibold text-red-100 transition hover:bg-red-400/20"
            >
              Delete Project
            </button>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
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
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}