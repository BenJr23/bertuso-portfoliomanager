"use client";

import { useState } from "react";

interface ProfileData {
  id?: string;
  name: string;
  email: string;
  image?: string | null;
  description?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
  linkedinLink?: string | null;
  githubLink?: string | null;
  photos?: string[];
  connectionCode?: string | null;
}

interface Props {
  initialData: ProfileData;
  editProfileAction: (input: any) => Promise<any>;
  uploadImageAction: (file: File) => Promise<any>;
  generateConnectionCodeAction: () => Promise<any>;
}

export default function ProfileForm({ initialData, editProfileAction, uploadImageAction, generateConnectionCodeAction }: Props) {
  const [formData, setFormData] = useState<ProfileData>({ ...initialData, photos: initialData.photos ?? [] });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedGalleryFile, setSelectedGalleryFile] = useState<File | null>(null);
  const [galleryPreviewUrl, setGalleryPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value } as ProfileData);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleUpload() {
    if (!selectedFile) return;
    setIsUploading(true);
    setMessage(null);
    try {
      const res = await uploadImageAction(selectedFile);
      if (!res || !res.success) {
        setMessage(res?.error || "Upload failed.");
        return;
      }
      setFormData((f) => ({ ...f, image: res.url }));
      setSelectedFile(null);
      setPreviewUrl(null);
      setMessage("Image uploaded.");
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Upload error");
    } finally {
      setIsUploading(false);
    }
  }

  function handleGalleryFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedGalleryFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setGalleryPreviewUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleGalleryUpload() {
    if (!selectedGalleryFile) return;
    setIsUploading(true);
    setMessage(null);
    try {
      const res = await uploadImageAction(selectedGalleryFile);
      if (!res || !res.success) {
        setMessage(res?.error || "Upload failed.");
        return;
      }
      setFormData((f) => ({ ...f, photos: [...(f.photos ?? []), res.url || ""] }));
      setSelectedGalleryFile(null);
      setGalleryPreviewUrl(null);
      setMessage("Photo added to gallery.");
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Upload error");
    } finally {
      setIsUploading(false);
    }
  }

  function removeGalleryPhoto(url: string) {
    setFormData((f) => ({ ...f, photos: (f.photos ?? []).filter((photo) => photo !== url) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await editProfileAction({
        name: formData.name,
        image: formData.image ?? null,
        description: formData.description ?? null,
        address: formData.address ?? null,
        phoneNumber: formData.phoneNumber ?? null,
        linkedinLink: formData.linkedinLink ?? null,
        githubLink: formData.githubLink ?? null,
        photos: formData.photos,
      });
      if (!res || !res.success) {
        setMessage(res?.error || "Save failed.");
      } else {
        setMessage("Saved successfully.");
      }
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Save error");
    } finally {
      setSaving(false);
    }
  }

  async function handleGenerateCode() {
    setGenerating(true);
    setMessage(null);
    try {
      const res = await generateConnectionCodeAction();
      if (res?.success && res.data?.connectionCode) {
        setFormData((f) => ({ ...f, connectionCode: res.data.connectionCode }));
        setMessage("Connection code created.");
      } else {
        setMessage(res?.error || "Failed to generate code.");
      }
    } catch (err) {
      // handled below via direct call; keep for safety
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 backdrop-blur-2xl overflow-hidden">
        <div className="border-b border-white/10 px-6 py-5 sm:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Personal Information</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Update your details</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 p-6 sm:p-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-semibold text-white">Connection Code</h4>
                <p className="mt-1 text-sm text-slate-400">A secret code used for integrations.</p>
              </div>
              <div className="flex items-center gap-3">
                {formData.connectionCode ? (
                  <div className="flex items-center gap-2">
                    <code className="rounded px-3 py-2 bg-slate-900 text-sm text-emerald-300">{formData.connectionCode}</code>
                    <button type="button" onClick={async () => { await navigator.clipboard.writeText(formData.connectionCode || ""); setMessage("Copied to clipboard."); }} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">Copy</button>
                    <button type="button" onClick={async () => {
                      setGenerating(true);
                      setMessage(null);
                      try {
                        const res = await generateConnectionCodeAction();
                        if (res?.success && res.data?.connectionCode) {
                          setFormData((f) => ({ ...f, connectionCode: res.data.connectionCode }));
                          setMessage("New connection code generated.");
                        } else {
                          setMessage(res?.error || "Failed to generate code.");
                        }
                      } catch (err: unknown) {
                        setMessage(err instanceof Error ? err.message : "Error generating code.");
                      } finally {
                        setGenerating(false);
                      }
                    }} className="rounded-2xl bg-emerald-500/20 px-3 py-2 text-sm text-emerald-200">Regenerate</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={handleGenerateCode} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">{generating ? "Generating..." : "Generate Connection Code"}</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-5 sm:flex-row sm:items-center">
            {formData.image ? (
              <img src={formData.image} alt={formData.name} className="h-24 w-24 rounded-2xl object-cover ring-2 ring-white/10" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-emerald-500/15 text-3xl font-semibold text-emerald-200 ring-2 ring-white/10">
                {formData.name
                  ? formData.name
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0].toUpperCase())
                      .join("")
                  : "UD"}
              </div>
            )}
            <div>
              <h4 className="text-base font-semibold text-white">Profile Photo</h4>
              <p className="mt-1 text-sm text-slate-400">Upload a new photo or update your existing one.</p>
              <div className="mt-3 flex items-center gap-3">
                <input id="profile-photo-input" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                <button type="button" onClick={() => document.getElementById("profile-photo-input")?.click()} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">Choose Photo</button>
                {previewUrl && (
                  <>
                    <div className="flex items-center gap-3">
                      <img src={previewUrl} alt="Preview" className="h-12 w-12 rounded" />
                      <button type="button" onClick={handleUpload} disabled={isUploading} className="rounded-2xl bg-emerald-500/20 px-3 py-2 text-sm text-emerald-200">{isUploading ? "Uploading..." : "Upload"}</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-semibold text-white">Gallery Photos</h4>
                <p className="mt-1 text-sm text-slate-400">Add additional profile photos for your portfolio gallery.</p>
              </div>
              <div className="flex items-center gap-3">
                <input id="gallery-photo-input" type="file" accept="image/*" onChange={handleGalleryFileChange} className="hidden" />
                <button type="button" onClick={() => document.getElementById("gallery-photo-input")?.click()} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">Select Photo</button>
                {galleryPreviewUrl && (
                  <button type="button" onClick={handleGalleryUpload} disabled={isUploading} className="rounded-2xl bg-emerald-500/20 px-4 py-2 text-sm text-emerald-200">{isUploading ? "Uploading..." : "Add Photo"}</button>
                )}
              </div>
            </div>

            {galleryPreviewUrl ? (
              <div className="mt-4 flex items-center gap-4">
                <img src={galleryPreviewUrl} alt="Gallery preview" className="h-20 w-20 rounded-2xl object-cover" />
                <p className="text-sm text-slate-300">Ready to add to your gallery.</p>
              </div>
            ) : null}

            {formData.photos && formData.photos.length > 0 ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {formData.photos.map((photo) => (
                  <div key={photo} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80">
                    <img src={photo} alt="Gallery" className="h-32 w-full object-cover" />
                    <button type="button" onClick={() => removeGalleryPhoto(photo)} className="absolute right-2 top-2 rounded-full bg-slate-950/80 p-2 text-xs text-white transition hover:bg-red-500/90">Remove</button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">No gallery photos added yet.</p>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[["Full Name", "name", "text", formData.name], ["Email Address", "email", "email", formData.email], ["Phone Number", "phoneNumber", "tel", formData.phoneNumber ?? ""], ["Location", "address", "text", formData.address ?? ""]].map(([label, name, type, value]) => (
              <div key={String(name)}>
                <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-400" htmlFor={String(name)}>{label}</label>
                <input id={String(name)} name={String(name)} type={String(type)} value={String(value)} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/30" />
              </div>
            ))}

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-400" htmlFor="linkedinLink">LinkedIn Profile</label>
              <input id="linkedinLink" name="linkedinLink" type="url" value={formData.linkedinLink ?? ""} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/30" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-400" htmlFor="githubLink">GitHub Profile</label>
              <input id="githubLink" name="githubLink" type="url" value={formData.githubLink ?? ""} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/30" />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-400" htmlFor="description">Bio</label>
              <textarea id="description" name="description" rows={4} value={formData.description ?? ""} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/30" placeholder="Tell us about yourself..." />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
            <button type="button" onClick={() => { setFormData(initialData); setMessage(null); }} className="rounded-2xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-6 py-2.5 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/20 disabled:opacity-60">{saving ? "Saving..." : "Save Changes"}</button>
          </div>
          {message && <p className="text-sm text-emerald-300">{message}</p>}
        </form>
      </div>
    </div>
  );
}
