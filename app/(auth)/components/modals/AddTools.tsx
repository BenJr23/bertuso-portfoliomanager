"use client";

import { useState } from "react";
import { addTool } from "@/app/_actions/tools/addtools";
import { uploadToolImage } from "@/lib/supabase-storage";

interface AddToolsProps {
	open: boolean;
	onClose: () => void;
	onAdd: (tool: { name: string; picture?: string; category: string }) => void;
}

const categoryOptions = ["Frontend", "Backend", "Database", "DevOps", "Testing", "Documentation", "Version Control", "API", "Mobile", "Cloud", "Monitoring", "Security", "Caching Layer", "ORM", "Task Scheduling", "Backend Automation"];

export default function AddTools({ open, onClose, onAdd }: AddToolsProps) {
	const [name, setName] = useState("");
	const [picture, setPicture] = useState("");
	const [category, setCategory] = useState(categoryOptions[0]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

	if (!open) return null;

	async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
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

			const result = await uploadToolImage(formData);

			if (!result.success) {
				setUploadError(result.error || "Upload failed.");
				return;
			}

			setPicture(result.url!);
			setUploadedUrl(result.url!);
			setPreviewUrl(null);
			setSelectedFile(null);
		} catch (err: any) {
			setUploadError(err?.message || "An error occurred during upload.");
		} finally {
			setIsUploading(false);
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		if (!name.trim()) return setError("Name is required");

		setLoading(true);
		try {
			const result = await addTool({
				name: name.trim(),
				picture: picture.trim() || null,
				category,
			});

			if (!result.success) {
				setError(result.error || "Failed to add tool.");
				return;
			}

			onAdd({ name: result.data!.name, picture: result.data!.picture || undefined, category: result.data!.category });
			setName("");
			setPicture("");
			setCategory(categoryOptions[0]);
			setPreviewUrl(null);
			setSelectedFile(null);
			setUploadedUrl(null);
			setUploadError(null);
			onClose();
		} catch (err: any) {
			setError(err?.message || "An unexpected error occurred.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="fixed inset-0 z-50 flex items-start justify-center px-4 py-4 sm:items-center">
			<div
				className="absolute inset-0 bg-black/50"
				onClick={() => {
					setPreviewUrl(null);
					setUploadError(null);
					onClose();
				}}
			/>
			<form onSubmit={handleSubmit} className="relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/80 p-6 backdrop-blur-2xl">
				<h3 className="mb-4 text-lg font-semibold text-white">Add Tool</h3>

				<label className="block text-sm text-slate-300">Name</label>
				<input
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
					className="mt-1 mb-3 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white placeholder:text-slate-400"
				/>

				<label className="block text-sm text-slate-300">Picture URL</label>
				<input
					value={picture}
					onChange={(e) => setPicture(e.target.value)}
					placeholder="https://..."
					className="mt-1 mb-3 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white placeholder:text-slate-400"
				/>

				<div className="mb-3">
				<label className="block text-sm text-slate-300 mb-2">Photo</label>
				
				{uploadedUrl ? (
					<div className="flex flex-col items-center gap-2 p-3 rounded-md border border-emerald-400/20 bg-emerald-500/10">
						<img src={uploadedUrl} alt="Uploaded" className="h-16 w-16 rounded-md object-cover border border-emerald-400/20" />
						<p className="text-xs text-emerald-200">✓ Photo uploaded</p>
						<button
							type="button"
							onClick={() => {
								setUploadedUrl(null);
								setPicture("");
								setPreviewUrl(null);
								setSelectedFile(null);
								setUploadError(null);
							}}
							className="text-xs text-slate-400 hover:text-slate-300 underline"
						>
							Change photo
						</button>
					</div>
				) : (
					<>
						<input
							ref={(input) => {
								if (input) (window as any).fileInput = input;
							}}
							type="file"
							accept="image/*"
							onChange={handleFileUpload}
							disabled={isUploading}
							className="hidden"
							id="tool-photo-input"
						/>
						{previewUrl ? (
							<div className="flex flex-col gap-2">
								<div className="flex items-center justify-center p-2 rounded-md border border-white/10 bg-white/5">
									<img src={previewUrl} alt="Preview" className="h-16 w-16 rounded-md object-cover" />
								</div>
								<div className="flex gap-2">
									<button
										type="button"
										onClick={() => {
											document.getElementById("tool-photo-input")?.click();
										}}
										className="flex-1 rounded-md px-3 py-2 text-sm bg-white/10 text-slate-300 hover:bg-white/20 disabled:opacity-60"
										disabled={isUploading}
									>
										Choose Photo
									</button>
									<button
										type="button"
										onClick={handleUploadToSupabase}
										className="flex-1 rounded-md px-3 py-2 text-sm bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 disabled:opacity-60"
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
									document.getElementById("tool-photo-input")?.click();
								}}
								className="w-full rounded-md px-3 py-2 text-sm bg-white/10 text-slate-300 hover:bg-white/20 disabled:opacity-60"
								disabled={isUploading}
							>
								Choose Photo
							</button>
						)}
					</>
				)}
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
					{categoryOptions.map((c) => (
						<option key={c} value={c} className="bg-slate-950 text-white">
							{c}
						</option>
					))}
				</select>
			</div>

			{error ? <p className="mb-2 text-sm text-red-400">{error}</p> : null}
			<div className="flex justify-end gap-2">
					<button
						type="button"
						onClick={() => {
							setPreviewUrl(null);
							setUploadError(null);
							onClose();
						}}
						disabled={loading}
						className="rounded-2xl px-4 py-2 text-sm text-slate-300 hover:bg-white/5 disabled:opacity-60"
					>
						Cancel
					</button>
					<button type="submit" disabled={loading} className="rounded-2xl px-4 py-2 text-sm bg-emerald-500/20 text-emerald-200 disabled:opacity-60">
						{loading ? "Adding..." : "Add Tool"}
					</button>
				</div>
			</form>
		</div>
	);
}
