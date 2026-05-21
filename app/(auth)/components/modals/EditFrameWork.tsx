"use client";

import { useEffect, useState } from "react";
import { editFramework } from "@/app/_actions/frameworks/editframework";
import { uploadAuthenticatedImage } from "@/lib/supabase-storage";
import DeleteFrameWork from "./DeleteFrameWork";
import AddToolsToFramework from "./AddToolsToFramework";

interface FrameworkItem {
  id: string;
  name: string;
  image: string | null;
  toolCount: number;
  projectCount: number;
}

interface EditFrameWorkProps {
  open: boolean;
  onClose: () => void;
  onEdit: (framework: FrameworkItem) => void;
  onDelete: () => void;
  framework?: FrameworkItem;
}

export default function EditFrameWork({ open, onClose, onEdit, onDelete, framework }: EditFrameWorkProps) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>([]);

  useEffect(() => {
    if (framework && open) {
      setName(framework.name);
      setImage(framework.image || "");
      setPreviewUrl(framework.image);
      setError(null);
      setUploadError(null);
      setSelectedFile(null);
      setShowDeleteConfirm(false);
      setSelectedToolIds([]);
    }
  }, [framework, open]);

  useEffect(() => {
    if (!framework?.id || !open) return;

    let cancelled = false;
    import("@/app/_actions/frameworks/getframeworktools").then(({ getFrameworkTools }) =>
      getFrameworkTools(framework.id)
        .then((res) => {
          if (cancelled) return;
          if (res?.success && res.data) setSelectedToolIds(res.data);
        })
        .catch(() => {}),
    );

    return () => {
      cancelled = true;
    };
  }, [framework?.id, open]);

  function resetForm() {
    setName("");
    setImage("");
    setLoading(false);
    setError(null);
    setIsUploading(false);
    setUploadError(null);
    setPreviewUrl(null);
    setSelectedFile(null);
    setShowDeleteConfirm(false);
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
      setPreviewUrl(result.url || "");
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
    setLoading(true);

    try {
      const result = await editFramework({
        id: framework?.id || "",
        name: name.trim(),
        image: image.trim() || null,
        toolIds: selectedToolIds,
      });

      if (!result.success || !result.data) {
        setError(result.error || "Failed to update framework.");
        return;
      }

      onEdit({
        id: result.data.id,
        name: result.data.name,
        image: result.data.image,
        toolCount: selectedToolIds.length ?? framework?.toolCount ?? 0,
        projectCount: framework?.projectCount ?? 0,
      });
      resetForm();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={resetForm} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-slate-950 p-8 backdrop-blur-2xl">
        <h2 className="mb-6 text-2xl font-bold text-white">Edit Framework</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Framework Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Next.js"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-400/50 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Image URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-400/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-400 focus:outline-none"
              disabled={isUploading}
            />
            {previewUrl && (
              <div className="mt-3 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <img src={previewUrl} alt="Preview" className="h-14 w-14 object-contain" />
              </div>
            )}
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
                  setImage("");
                  setPreviewUrl(null);
                  setSelectedFile(null);
                  setUploadError(null);
                }}
                className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/5"
              >
                Clear
              </button>
            </div>
            {uploadError && <p className="mt-2 text-xs text-red-400">{uploadError}</p>}
          </div>

          <div>
            <AddToolsToFramework selected={selectedToolIds} onChange={setSelectedToolIds} />
            {selectedToolIds.length > 0 && (
              <p className="mt-2 text-xs text-slate-300">{selectedToolIds.length} tool(s) selected</p>
            )}
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 rounded-2xl border border-white/10 px-4 py-2 font-medium text-slate-300 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-2xl bg-emerald-500/20 px-4 py-2 font-medium text-emerald-200 hover:bg-emerald-500/30 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full rounded-2xl bg-red-500/20 px-4 py-2 font-medium text-red-200 hover:bg-red-500/30"
          >
            Delete Framework
          </button>
        </form>
      </div>

      <DeleteFrameWork
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onDelete={() => {
          onDelete();
          setShowDeleteConfirm(false);
          resetForm();
        }}
        frameworkId={framework?.id || ""}
        frameworkName={framework?.name || ""}
      />
    </>
  );
}
