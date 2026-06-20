"use client";

import { useEffect, useState } from "react";
import DeleteCertification from "./DeleteCertification";

interface CertificationItem {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onEdit: (certification: CertificationItem) => void;
  onDelete: (id: string) => void;
  certification?: CertificationItem;
  editCertificationAction: (input: { id: string; name: string; description?: string | null; image?: string | null }) => Promise<any>;
  deleteCertificationAction: (id: string) => Promise<any>;
  uploadCertificationImageAction: (file: File) => Promise<any>;
}

export default function EditCertification({
  open,
  onClose,
  onEdit,
  onDelete,
  certification,
  editCertificationAction,
  deleteCertificationAction,
  uploadCertificationImageAction,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!open || !certification) return;
    setName(certification.name);
    setDescription(certification.description || "");
    setImage(certification.image || "");
    setError(null);
    setUploadError(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowDeleteConfirm(false);
  }, [open, certification]);

  if (!open || !certification) return null;

  const currentCertification = certification;

  function reset() {
    setError(null);
    setUploadError(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowDeleteConfirm(false);
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
    setIsUploading(true);
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
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await editCertificationAction({
        id: currentCertification.id,
        name,
        description: description || null,
        image: image || null,
      });

      if (!result?.success || !result?.data) {
        setError(result?.error || "Failed to update certification.");
        return;
      }

      onEdit(result.data);
      reset();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update certification.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={reset} />
      <div className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100vh-2rem)] w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-white/10 bg-slate-950 p-8 backdrop-blur-2xl">
        <h2 className="mb-6 text-2xl font-bold text-white">Edit Certification</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Certification Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., AWS Certified Solutions Architect" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-400/50 focus:outline-none" required />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="What this certification validates..." className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-400/50 focus:outline-none" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Image</label>
            <input id="cert-edit-image" type="file" accept="image/*" onChange={handleFileChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-400 focus:outline-none" />
            <div className="mt-3 flex items-center gap-3">
              {previewUrl ? <img src={previewUrl} alt="Preview" className="h-20 w-20 rounded-2xl object-cover" /> : image ? <img src={image} alt="Current" className="h-20 w-20 rounded-2xl object-cover" /> : <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xs text-slate-500">No image</div>}
              <div className="flex flex-1 flex-col gap-2">
                <button type="button" onClick={() => document.getElementById("cert-edit-image")?.click()} className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5">Choose Photo</button>
                <button type="button" onClick={handleUpload} disabled={isUploading} className="rounded-2xl bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-500/30 disabled:opacity-50">{isUploading ? "Uploading..." : "Upload Image"}</button>
              </div>
            </div>
            {uploadError ? <p className="mt-2 text-xs text-red-400">{uploadError}</p> : null}
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <div className="flex gap-3">
            <button type="button" onClick={reset} className="flex-1 rounded-2xl border border-white/10 px-4 py-2 font-medium text-slate-300 hover:bg-white/5">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 rounded-2xl bg-emerald-500/20 px-4 py-2 font-medium text-emerald-200 hover:bg-emerald-500/30 disabled:opacity-50">{loading ? "Saving..." : "Save Changes"}</button>
          </div>

          <button type="button" onClick={() => setShowDeleteConfirm(true)} className="w-full rounded-2xl bg-red-500/20 px-4 py-2 font-medium text-red-200 hover:bg-red-500/30">Delete Certification</button>
        </form>
      </div>

      <DeleteCertification
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onDelete={() => {
          onDelete(currentCertification.id);
          setShowDeleteConfirm(false);
          reset();
        }}
        deleteCertificationAction={deleteCertificationAction}
        certificationId={currentCertification.id}
        certificationName={currentCertification.name}
      />
    </>
  );
}
