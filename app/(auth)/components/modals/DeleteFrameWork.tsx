"use client";

import { useState } from "react";
import { deleteFramework } from "@/app/_actions/frameworks/deleteframework";

interface DeleteFrameWorkProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  frameworkId: string;
  frameworkName: string;
}

export default function DeleteFrameWork({
  open,
  onClose,
  onDelete,
  frameworkId,
  frameworkName,
}: DeleteFrameWorkProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setError(null);
    setLoading(true);

    try {
      const result = await deleteFramework(frameworkId);

      if (result.success) {
        onDelete();
      } else {
        setError(result.error || "Failed to delete framework.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100vh-2rem)] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-white/10 bg-slate-950 p-8 backdrop-blur-2xl">
        <h2 className="mb-4 text-2xl font-bold text-white">Delete Framework?</h2>
        <p className="mb-2 text-slate-300">
          Are you sure you want to delete <span className="font-semibold text-white">{frameworkName}</span>?
        </p>
        <p className="mb-6 text-sm text-slate-400">This action cannot be undone.</p>

        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

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
