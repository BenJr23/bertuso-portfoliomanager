"use client";

import { useState, type FormEvent } from "react";
import { editAboutMe } from "@/app/_actions/aboutme/editaboutme";
import { aboutMeCategoryOptions, type AboutMeRecord } from "@/app/_actions/aboutme/shared";

interface EditAboutMeProps {
	open: boolean;
	onClose: () => void;
	onSaved: () => void;
	aboutMe?: AboutMeRecord | null;
}

export default function EditAboutMe({ open, onClose, onSaved, aboutMe }: EditAboutMeProps) {
	const [category, setCategory] = useState(aboutMe?.category ?? aboutMeCategoryOptions[0].value);
	const [title, setTitle] = useState(aboutMe?.title ?? "");
	const [description, setDescription] = useState(aboutMe?.description ?? "");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	if (!open || !aboutMe) return null;

	const currentAboutMe: AboutMeRecord = aboutMe;

	function resetForm() {
		setCategory(aboutMeCategoryOptions[0].value);
		setTitle("");
		setDescription("");
		setLoading(false);
		setError(null);
		onClose();
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);

		if (!title.trim()) {
			setError("Title is required.");
			return;
		}

		setLoading(true);
		try {
			const result = await editAboutMe({
				id: currentAboutMe.id,
				category,
				title: title.trim(),
				description: description.trim() || undefined,
			});

			if (!result.success || !result.data) {
				setError(result.error || "Failed to update about me entry.");
				return;
			}

			onSaved();
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
				className="relative z-10 w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/90 shadow-2xl shadow-black/40 backdrop-blur-2xl"
			>
				<div className="border-b border-white/10 px-6 py-5 sm:px-8">
					<p className="text-[10px] uppercase tracking-[0.32em] text-slate-500">Story Builder</p>
					<h3 className="mt-2 text-2xl font-semibold text-white">Edit About Me Entry</h3>
					  <p className="mt-2 text-sm text-slate-400">Last updated {new Date(currentAboutMe.updatedAt).toLocaleString()}</p>
				</div>

				<div className="space-y-5 p-6 sm:p-8">
					<div>
						<label className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-400" htmlFor="edit-about-category">
							Category
						</label>
						<select
							id="edit-about-category"
							value={category}
							onChange={(event) => setCategory(event.target.value as typeof category)}
							className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400/30"
						>
							{aboutMeCategoryOptions.map((option) => (
								<option key={option.value} value={option.value} className="bg-slate-900 text-white">
									{option.label}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-400" htmlFor="edit-about-title">
							Title
						</label>
						<input
							id="edit-about-title"
							value={title}
							onChange={(event) => setTitle(event.target.value)}
							className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/30"
						/>
					</div>

					<div>
						<label
							className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-400"
							htmlFor="edit-about-description"
						>
							Description
						</label>
						<textarea
							id="edit-about-description"
							rows={5}
							value={description}
							onChange={(event) => setDescription(event.target.value)}
							className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/30"
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
							{loading ? "Saving..." : "Save Changes"}
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}
