"use client";

import { useEffect, useMemo, useState } from "react";
import { getTools } from "@/app/_actions/tools/gettools";

interface ToolItem {
	id: string;
	name: string;
	picture?: string | null;
	category?: string;
}

interface Props {
	selected: string[];
	onChange: (ids: string[]) => void;
}

export default function AddToolsToFramework({ selected, onChange }: Props) {
	const [tools, setTools] = useState<ToolItem[]>([]);
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		getTools()
			.then((result) => {
				if (cancelled) return;
				if (!result.success) {
					setError(result.error || "Failed to load tools");
					setTools([]);
				} else {
					setTools(result.data || []);
				}
			})
			.catch((err) => setError(err?.message || "Failed to load tools"))
			.finally(() => !cancelled && setLoading(false));

		return () => {
			cancelled = true;
		};
	}, []);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return tools;
		return tools.filter((t) => t.name.toLowerCase().includes(q));
	}, [tools, query]);

	function toggle(id: string) {
		if (selected.includes(id)) onChange(selected.filter((s) => s !== id));
		else onChange([...selected, id]);
	}

	return (
		<div>
			<label className="mb-2 block text-sm text-slate-300">Tools</label>
			<input
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="Search tools..."
				className="mb-3 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white placeholder:text-slate-400"
			/>

			<div className="max-h-40 overflow-y-auto rounded-md border border-white/10 bg-white/5 p-2">
				{loading && <p className="text-xs text-slate-400">Loading tools...</p>}
				{error && <p className="text-xs text-red-400">{error}</p>}
				{!loading && filtered.length === 0 && <p className="text-xs text-slate-400">No tools found.</p>}
				<ul className="space-y-2">
					{filtered.map((tool) => (
						<li key={tool.id} className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								{tool.picture ? (
									<img src={tool.picture} alt={tool.name} className="h-6 w-6 rounded" />
								) : (
									<div className="h-6 w-6 rounded bg-white/5" />
								)}
								<div className="text-sm text-slate-200">{tool.name}</div>
							</div>
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={selected.includes(tool.id)}
									onChange={() => toggle(tool.id)}
									className="h-4 w-4"
								/>
							</label>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
