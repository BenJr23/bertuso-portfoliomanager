"use client";

import { useState } from "react";
import { addTool } from "@/app/_actions/tools/addtools";

interface AddToolsProps {
	open: boolean;
	onClose: () => void;
	onAdd: (tool: { name: string; picture?: string; category: string }) => void;
}

const categoryOptions = ["Frontend", "Backend", "Database", "DevOps", "Testing", "Version Control", "Cloud"];

export default function AddTools({ open, onClose, onAdd }: AddToolsProps) {
	const [name, setName] = useState("");
	const [picture, setPicture] = useState("");
	const [category, setCategory] = useState(categoryOptions[0]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	if (!open) return null;

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
			onClose();
		} catch (err: any) {
			setError(err?.message || "An unexpected error occurred.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/50" onClick={onClose} />
			<form onSubmit={handleSubmit} className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-slate-950/80 p-6 backdrop-blur-2xl">
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

				<label className="block text-sm text-slate-300">Category</label>
				<select
					value={category}
					onChange={(e) => setCategory(e.target.value)}
					className="mt-1 mb-4 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white"
				>
					{categoryOptions.map((c) => (
						<option key={c} value={c} className="text-black">
							{c}
						</option>
					))}
				</select>

				{error ? <p className="mb-2 text-sm text-red-400">{error}</p> : null}
				<div className="flex justify-end gap-2">
					<button type="button" onClick={onClose} disabled={loading} className="rounded-2xl px-4 py-2 text-sm text-slate-300 hover:bg-white/5 disabled:opacity-60">
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
