"use client";

import { useState, type FormEvent } from "react";
import { addAboutMe } from "@/app/_actions/aboutme/addaboutme";
import { getProjectsForSelect } from "@/app/_actions/aboutme/getprojectsforselect";
import { aboutMeCategoryOptions } from "@/app/_actions/aboutme/shared";
import type { ProjectOption } from "@/app/_actions/aboutme/getprojectsforselect";

interface AddAboutMeProps {
	open: boolean;
	onClose: () => void;
	onSaved: () => void;
}

export default function AddAboutMe({ open, onClose, onSaved }: AddAboutMeProps) {
	const [category, setCategory] = useState<(typeof aboutMeCategoryOptions)[number]["value"]>(aboutMeCategoryOptions[0].value);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [isPresent, setIsPresent] = useState(false);
	const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
	const [availableProjects, setAvailableProjects] = useState<ProjectOption[]>([]);
	const [loading, setLoading] = useState(false);
	const [projectsLoading, setProjectsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function loadProjects() {
		if (projectsLoading || availableProjects.length > 0) return;
		setProjectsLoading(true);
		const result = await getProjectsForSelect();
		if (result.success && result.data) {
			setAvailableProjects(result.data);
		}
		setProjectsLoading(false);
	}

	if (!open) return null;

	function resetForm() {
		setCategory(aboutMeCategoryOptions[0].value);
		setTitle("");
		setDescription("");
		setStartDate("");
		setEndDate("");
		setIsPresent(false);
		setSelectedProjects([]);
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
			const result = await addAboutMe({
				category,
				title: title.trim(),
				description: description.trim() || undefined,
				startDate: startDate || null,
				endDate: endDate || null,
				isPresent,
				projectIds: selectedProjects,
			});

			if (!result.success || !result.data) {
				setError(result.error || "Failed to add about me entry.");
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

	function addProjectToSelection(projectId: string) {
		if (!selectedProjects.includes(projectId)) {
			setSelectedProjects([...selectedProjects, projectId]);
		}
	}

	function removeProjectFromSelection(projectId: string) {
		setSelectedProjects(selectedProjects.filter(id => id !== projectId));
	}

	const selectedProjectsData = availableProjects.filter(p => selectedProjects.includes(p.id));
	const unselectedProjects = availableProjects.filter(p => !selectedProjects.includes(p.id));

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center px-4">
			<div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={resetForm} />
			<form
				onSubmit={handleSubmit}
				className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[2rem] border border-white/10 bg-slate-950/90 shadow-2xl shadow-black/40 backdrop-blur-2xl"
			>
				<div className="border-b border-white/10 px-6 py-5 sm:px-8 sticky top-0 bg-slate-950/95">
					<p className="text-[10px] uppercase tracking-[0.32em] text-slate-500">Story Builder</p>
					<h3 className="mt-2 text-2xl font-semibold text-white">Add About Me Entry</h3>
				</div>

				<div className="space-y-5 p-6 sm:p-8">
					<div>
						<label className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-400" htmlFor="about-category">
							Category
						</label>
						<select
							id="about-category"
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
						<label className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-400" htmlFor="about-title">
							Title
						</label>
						<input
							id="about-title"
							value={title}
							onChange={(event) => setTitle(event.target.value)}
							placeholder="What should this section be called?"
							className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/30"
						/>
					</div>

					<div>
						<label className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-400" htmlFor="about-description">
							Description
						</label>
						<textarea
							id="about-description"
							rows={4}
							value={description}
							onChange={(event) => setDescription(event.target.value)}
							placeholder="Tell the story behind this section..."
							className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/30"
						/>
					</div>

					{/* Dates Section */}
					<div className="space-y-3 rounded-xl bg-white/5 border border-white/10 p-4">
						<p className="text-xs uppercase tracking-[0.24em] text-slate-400">Timeline</p>
						
						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="mb-2 block text-xs text-slate-400" htmlFor="start-date">
									Start Date
								</label>
								<input
									id="start-date"
									type="date"
									value={startDate}
									onChange={(event) => setStartDate(event.target.value)}
									className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-400/30"
								/>
							</div>
							<div>
								<label className="mb-2 block text-xs text-slate-400" htmlFor="end-date">
									End Date
								</label>
								<input
									id="end-date"
									type="date"
									value={endDate}
									onChange={(event) => setEndDate(event.target.value)}
									disabled={isPresent}
									className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
								/>
							</div>
						</div>

						<label className="flex items-center gap-3 cursor-pointer">
							<input
								type="checkbox"
								checked={isPresent}
								onChange={(event) => {
									setIsPresent(event.target.checked);
									if (event.target.checked) {
										setEndDate("");
									}
								}}
								className="w-4 h-4 rounded border border-white/20 bg-white/5 cursor-pointer accent-emerald-400"
							/>
							<span className="text-sm text-slate-300">Currently active (ongoing)</span>
						</label>
					</div>

					{/* Projects Section */}
					<div className="space-y-3 rounded-xl bg-white/5 border border-white/10 p-4">
						<p className="text-xs uppercase tracking-[0.24em] text-slate-400">Related Projects</p>
						
						{selectedProjectsData.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{selectedProjectsData.map((project) => (
									<div
										key={project.id}
										className="inline-flex items-center gap-2 rounded-lg bg-emerald-400/20 border border-emerald-400/30 px-3 py-1.5 text-sm text-emerald-100"
									>
										{project.name}
										<button
											type="button"
											onClick={() => removeProjectFromSelection(project.id)}
											className="hover:text-emerald-50 transition"
										>
											✕
										</button>
									</div>
								))}
							</div>
						)}

						<select
							onFocus={loadProjects}
							onChange={(event) => {
								if (event.target.value) {
									addProjectToSelection(event.target.value);
									event.target.value = "";
								}
							}}
							className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-400/30"
						>
							<option value="">{projectsLoading ? "Loading projects..." : "Select a project"}</option>
							{unselectedProjects.map((project) => (
								<option key={project.id} value={project.id} className="bg-slate-900 text-white">
									{project.name}
								</option>
							))}
						</select>
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
							{loading ? "Saving..." : "Add Entry"}
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}
