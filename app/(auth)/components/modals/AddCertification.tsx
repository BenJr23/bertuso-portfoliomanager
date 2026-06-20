"use client";

import { useState } from "react";

interface CertificationItem {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (certification: CertificationItem) => void;
  addCertificationAction: (input: { name: string; description?: string | null; image?: string | null }) => Promise<any>;
  uploadCertificationImageAction: (file: File) => Promise<any>;
}

export default function AddCertification({ open, onClose, onAdd, addCertificationAction, uploadCertificationImageAction }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!open) return null;

  function reset() {
    setName("");
    setDescription("");
    setImage("");
    setError(null);
    setUploadError(null);
    setPreviewUrl(null);
    setSelectedFile(null);
    onClose();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => setPreviewUrl(event.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleUpload() {
    if (!selectedFile) {
      setUploadError("No file selected.");
      return;
    }

    setUploadError(null);
    try {
      const result = await uploadCertificationImageAction(selectedFile);
      if (!result?.success) {
        setUploadError(result?.error || "Upload failed.");
        return;
      }
      setImage(result.url || "");
      setPreviewUrl(null);
      setSelectedFile(null);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await addCertificationAction({
        name,
        description: description || null,
        image: image || null,
      });

      if (!result?.success || !result?.data) {
        setError(result?.error || "Failed to add certification.");
        return;
      }

      onAdd(result.data);
      reset();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add certification.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 py-4 sm:items-center">
      <div className="absolute inset-0 bg-black/50" onClick={reset} />
      <form onSubmit={handleSubmit} className="relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl border border-white/10 bg-slate-950/85 p-6 backdrop-blur-2xl">
        <h3 className="mb-4 text-lg font-semibold text-white">Add Certification</h3>

        <label className="block text-sm text-slate-300">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 mb-3 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white placeholder:text-slate-400" />

        <label className="block text-sm text-slate-300">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 mb-3 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white placeholder:text-slate-400" placeholder="A short summary of the certification" />

        <div className="mb-4">
          <label className="mb-2 block text-sm text-slate-300">Image</label>
          <input id="cert-add-image" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          {previewUrl ? (
            <div className="space-y-2 rounded-md border border-white/10 bg-white/5 p-3">
              <img src={previewUrl} alt="Preview" className="h-36 w-full rounded object-cover" />
              <div className="flex gap-2">
                <button type="button" onClick={() => document.getElementById("cert-add-image")?.click()} className="flex-1 rounded-md bg-white/10 px-3 py-2 text-sm text-slate-200">Choose another</button>
                <button type="button" onClick={handleUpload} className="flex-1 rounded-md bg-emerald-500/20 px-3 py-2 text-sm text-emerald-200">Upload</button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => document.getElementById("cert-add-image")?.click()} className="w-full rounded-md bg-white/10 px-3 py-2 text-sm text-slate-200">Choose Image</button>
          )}
          {image ? <p className="mt-2 text-xs text-emerald-300">Image ready</p> : null}
          {uploadError ? <p className="mt-2 text-xs text-red-400">{uploadError}</p> : null}
        </div>

        {error ? <p className="mb-3 text-sm text-red-400">{error}</p> : null}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={reset} disabled={loading} className="rounded-2xl px-4 py-2 text-sm text-slate-300 hover:bg-white/5 disabled:opacity-60">Cancel</button>
          <button type="submit" disabled={loading} className="rounded-2xl bg-emerald-500/20 px-4 py-2 text-sm text-emerald-200 disabled:opacity-60">{loading ? "Adding..." : "Add Certification"}</button>
        </div>
      </form>
    </div>
  );
}
