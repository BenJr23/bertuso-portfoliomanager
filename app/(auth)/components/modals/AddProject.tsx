"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { addProject } from "@/app/_actions/projects/addproject";
import { uploadAuthenticatedImage } from "@/lib/supabase-storage";
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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  if (!open) return null;

  function resetForm() {
    setName("");
    setDescription("");
    setImageUrl("");
    setFrameworkId(frameworks[0]?.id ?? "");
    setLoading(false);
    setError(null);
    setIsUploading(false);
    setUploadError(null);
    setPreviewUrl(null);
    setSelectedFile(null);
    setUploadedUrl(null);
    onClose();
  }

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
      setPreviewUrl(null);
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
            <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-400">Photo</label>

            {uploadedUrl ? (
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3">
                <Image src={uploadedUrl} alt="Uploaded project" width={80} height={80} className="h-20 w-20 rounded-2xl border border-emerald-400/20 object-cover" />
                <p className="text-xs text-emerald-200">Project image uploaded</p>
                <button
                  type="button"
                  onClick={() => {
                    setUploadedUrl(null);
                    setImageUrl("");
                    setPreviewUrl(null);
                    setSelectedFile(null);
                    setUploadError(null);
                  }}
                  className="text-xs underline text-slate-400 hover:text-slate-300"
                >
                  Change image
                </button>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="hidden"
                  id="project-photo-input"
                />

                {previewUrl ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-2">
                      <Image src={previewUrl} alt="Preview" width={80} height={80} className="h-20 w-20 rounded-2xl object-cover" />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          document.getElementById("project-photo-input")?.click();
                        }}
                        className="flex-1 rounded-2xl bg-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/20 disabled:opacity-60"
                        disabled={isUploading}
                      >
                        Choose Photo
                      </button>
                      <button
                        type="button"
                        onClick={handleUploadToSupabase}
                        className="flex-1 rounded-2xl bg-emerald-500/20 px-3 py-2 text-sm text-emerald-200 hover:bg-emerald-500/30 disabled:opacity-60"
                        disabled={isUploading}
                      >
                        {isUploading ? "Uploading..." : "Upload"}
                      </button>
                    </div>
                    {uploadError ? <p className="text-xs text-red-400">{uploadError}</p> : null}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      document.getElementById("project-photo-input")?.click();
                    }}
                    className="w-full rounded-2xl bg-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/20 disabled:opacity-60"
                    disabled={isUploading}
                  >
                    Choose Photo
                  </button>
                )}
              </>
            )}
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