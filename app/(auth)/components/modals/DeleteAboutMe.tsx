"use client";

import { useState } from "react";
import { deleteAboutMe } from "@/app/_actions/aboutme/deleteaboutme";
import { getAboutMeCategoryLabel, type AboutMeRecord } from "@/app/_actions/aboutme/shared";

interface DeleteAboutMeProps {
	open: boolean;
	onClose: () => void;
	onDeleted: () => void;
	aboutMe?: AboutMeRecord | null;
}

export default function DeleteAboutMe({ open, onClose, onDeleted, aboutMe }: DeleteAboutMeProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	if (!open || !aboutMe) return null;

	const currentAboutMe: AboutMeRecord = aboutMe;

	async function handleDelete() {
		setError(null);
		setLoading(true);

		try {
			const result = await deleteAboutMe(currentAboutMe.id);

			if (!result.success) {
				setError(result.error || "Failed to delete about me entry.");
				return;
			}

			onDeleted();
			onClose();
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : "An unexpected error occurred.";
			setError(message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center px-4">
			<div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
			<div className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-black/40 sm:p-8">
				<p className="text-[10px] uppercase tracking-[0.32em] text-slate-500">Danger Zone</p>
				<h3 className="mt-2 text-2xl font-semibold text-white">Delete this entry?</h3>
				<p className="mt-4 text-sm leading-6 text-slate-300">
					This will permanently remove <span className="font-semibold text-white">{currentAboutMe.title}</span> from the {" "}
					{getAboutMeCategoryLabel(currentAboutMe.category)} section.
				</p>
				<p className="mt-2 text-sm text-slate-400">This action cannot be undone.</p>

				{error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

				<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
					<button
						type="button"
						onClick={onClose}
						disabled={loading}
						className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 disabled:opacity-60"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleDelete}
						disabled={loading}
						className="rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-3 text-sm font-semibold text-red-100 transition hover:bg-red-400/20 disabled:opacity-60"
					>
						{loading ? "Deleting..." : "Delete Entry"}
					</button>
				</div>
			</div>
		</div>
	);
}
