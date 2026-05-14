"use client";

import { useState } from "react";
import { deleteTool } from "@/app/_actions/tools/deletetools";

interface DeleteToolsProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  toolId: string;
  toolName: string;
}

export default function DeleteTools({ open, onClose, onDelete, toolId, toolName }: DeleteToolsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setError(null);
    setLoading(true);

    try {
      const result = await deleteTool(toolId);

      if (result.success) {
        onDelete();
      } else {
        setError(result.error || "Failed to delete tool.");
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-slate-950 p-8 backdrop-blur-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">Delete Tool?</h2>
        <p className="text-slate-300 mb-2">
          Are you sure you want to delete <span className="font-semibold text-white">{toolName}</span>?
        </p>
        <p className="text-sm text-slate-400 mb-6">This action cannot be undone.</p>

        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl border border-white/10 px-4 py-2 font-medium text-slate-300 hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 rounded-2xl bg-red-500/20 px-4 py-2 font-medium text-red-200 hover:bg-red-500/30 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </>
  );
}
