"use client";

import { useState } from "react";
import { addFramework } from "@/app/_actions/frameworks/addframework";
import { uploadAuthenticatedImage } from "@/lib/supabase-storage";

interface AddFrameworkProps {
  open: boolean;
  onClose: () => void;
  onAdd: (framework: {
    id: string;
    name: string;
    image: string | null;
    toolCount: number;
    projectCount: number;
  }) => void;
}

export default function AddFramework({ open, onClose, onAdd }: AddFrameworkProps) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
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
    setImage("");
    setLoading(false);
    setError(null);
    setIsUploading(false);
    setUploadError(null);
    setPreviewUrl(null);
    setSelectedFile(null);
    setUploadedUrl(null);
    onClose();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string);
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

      const result = await uploadAuthenticatedImage(formData, "frameworks");

      if (!result.success) {
        setUploadError(result.error || "Upload failed.");
        return;
      }

      setImage(result.url || "");
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    setLoading(true);
    try {
      const result = await addFramework({
        name: name.trim(),
        image: image.trim() || null,
      });

      if (!result.success || !result.data) {
        setError(result.error || "Failed to add framework.");
        return;
      }

      onAdd({
        id: result.data.id,
        name: result.data.name,
        image: result.data.image,
        toolCount: 0,
        projectCount: 0,
      });
      resetForm();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={resetForm} />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-slate-950/80 p-6 backdrop-blur-2xl"
      >
        <h3 className="mb-4 text-lg font-semibold text-white">Add Framework</h3>

        <label className="block text-sm text-slate-300">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 mb-3 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white placeholder:text-slate-400"
        />

        <label className="block text-sm text-slate-300">Image URL</label>
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://..."
          className="mt-1 mb-3 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white placeholder:text-slate-400"
        />

        <div className="mb-3">
          <label className="mb-2 block text-sm text-slate-300">Photo</label>

          {uploadedUrl ? (
            <div className="flex flex-col items-center gap-2 rounded-md border border-emerald-400/20 bg-emerald-500/10 p-3">
              <img
                src={uploadedUrl}
                alt="Uploaded"
                className="h-16 w-16 rounded-md border border-emerald-400/20 object-cover"
              />
              <p className="text-xs text-emerald-200">Photo uploaded</p>
              <button
                type="button"
                onClick={() => {
                  setUploadedUrl(null);
                  setImage("");
                  setPreviewUrl(null);
                  setSelectedFile(null);
                  setUploadError(null);
                }}
                className="text-xs underline hover:text-slate-300 text-slate-400"
              >
                Change photo
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
                id="framework-photo-input"
              />
              {previewUrl ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-center rounded-md border border-white/10 bg-white/5 p-2">
                    <img src={previewUrl} alt="Preview" className="h-16 w-16 rounded-md object-cover" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        document.getElementById("framework-photo-input")?.click();
                      }}
                      className="flex-1 rounded-md bg-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/20 disabled:opacity-60"
                      disabled={isUploading}
                    >
                      Choose Photo
                    </button>
                    <button
                      type="button"
                      onClick={handleUploadToSupabase}
                      className="flex-1 rounded-md bg-emerald-500/20 px-3 py-2 text-sm text-emerald-200 hover:bg-emerald-500/30 disabled:opacity-60"
                      disabled={isUploading}
                    >
                      {isUploading ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                  {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById("framework-photo-input")?.click();
                  }}
                  className="w-full rounded-md bg-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/20 disabled:opacity-60"
                  disabled={isUploading}
                >
                  Choose Photo
                </button>
              )}
            </>
          )}
        </div>

        {error ? <p className="mb-2 text-sm text-red-400">{error}</p> : null}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={resetForm}
            disabled={loading}
            className="rounded-2xl px-4 py-2 text-sm text-slate-300 hover:bg-white/5 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-emerald-500/20 px-4 py-2 text-sm text-emerald-200 disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Framework"}
          </button>
        </div>
      </form>
    </div>
  );
}
