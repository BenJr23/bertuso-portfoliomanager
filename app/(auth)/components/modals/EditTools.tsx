"use client";

import { useEffect, useState } from "react";
import { editTool } from "@/app/_actions/tools/edittools";
import { uploadToolImage } from "@/lib/supabase-storage";
import DeleteTools from "./DeleteTools";

interface EditToolsProps {
  open: boolean;
  onClose: () => void;
  onEdit: (tool: { id: string; name: string; picture?: string; category: string }) => void;
  onDelete: () => void;
  tool?: {
    id: string;
    name: string;
    category: string;
    picture: string | null;
  };
}

const categories = ["Frontend", "Backend", "Database", "DevOps", "Testing", "Documentation", "Version Control", "API", "Mobile", "Cloud", "Monitoring", "Security", "Caching Layer", "ORM", "Task Scheduling", "Backend Automation"];

export default function EditTools({ open, onClose, onEdit, onDelete, tool }: EditToolsProps) {
  const [name, setName] = useState(tool?.name || "");
  const [category, setCategory] = useState(tool?.category || "");
  const [picture, setPicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(tool?.picture || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!open || !tool) return;
    setName(tool.name);
    setCategory(tool.category);
    setPicture(null);
    setPreviewUrl(tool.picture || "");
    setError(null);
    setShowDeleteConfirm(false);
  }, [open, tool]);

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!tool?.id) {
      setError("Tool ID is missing. Please close and try again.");
      return;
    }

    setLoading(true);

    try {
      let pictureUrl = previewUrl;

      // Upload new picture if selected
      if (picture) {
        const formData = new FormData();
        formData.append("file", picture);
        const uploadResult = await uploadToolImage(formData);

        if (!uploadResult.success) {
          setError(uploadResult.error || "Failed to upload image.");
          setLoading(false);
          return;
        }

        pictureUrl = uploadResult.url || "";
      }

      // Update tool
      const result = await editTool({
        id: tool.id,
        name,
        category,
        picture: pictureUrl,
      });

      if (result.success) {
        onEdit({
          id: tool.id,
          name,
          category,
          picture: pictureUrl,
        });
        resetForm();
      } else {
        setError(result.error || "Failed to update tool.");
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setCategory("");
    setPicture(null);
    setPreviewUrl("");
    setError(null);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={resetForm} />
      <div className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100vh-2rem)] w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-white/10 bg-slate-950 p-8 backdrop-blur-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">Edit Tool</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Tool Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., React"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-400/50 focus:outline-none"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-slate-200 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              size={5}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white focus:border-emerald-400/50 focus:outline-none"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-950 text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Icon/Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePictureChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-400 focus:outline-none"
            />
            {previewUrl && (
              <div className="mt-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <img src={previewUrl} alt="Preview" className="h-10 w-10 object-contain" />
              </div>
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
            Delete Tool
          </button>
        </form>
      </div>

      <DeleteTools
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onDelete={() => {
          onDelete();
          setShowDeleteConfirm(false);
          resetForm();
        }}
        toolId={tool?.id || ""}
        toolName={tool?.name || ""}
      />
    </>
  );
}
