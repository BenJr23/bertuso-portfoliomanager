"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getSessionUserId, type ProjectFrameworkOption, type ProjectRecord } from "./shared";

interface EditProjectInput {
	id: string;
	name: string;
	description?: string;
	imageUrl?: string;
	roles?: string[];
	frameworkId: string;
	type?: string;
}

interface EditProjectResult {
	success: boolean;
	data?: ProjectRecord;
	error?: string;
}

function toProjectRecord(project: {
	id: string;
	name: string;
  type: string;
	description: string | null;
	imageUrl: string | null;
	roles: string[];
	frameworkId: string;
	framework: ProjectFrameworkOption;
	createdAt: Date;
	updatedAt: Date;
}): ProjectRecord {
	return {
		id: project.id,
		name: project.name,
		type: project.type,
		description: project.description,
		imageUrl: project.imageUrl,
		roles: project.roles || [],
		frameworkId: project.frameworkId,
		framework: project.framework,
		createdAt: project.createdAt.toISOString(),
		updatedAt: project.updatedAt.toISOString(),
	};
}

export async function editProject(input: EditProjectInput): Promise<EditProjectResult> {
	try {
		if (!input.id?.trim() || !input.name?.trim() || !input.frameworkId?.trim()) {
			return { success: false, error: "Missing required fields." };
		}

		const cookieStore = await cookies();
		const session = await auth.api.getSession({
			headers: { cookie: cookieStore.toString() },
		});

		if (!session) {
			return { success: false, error: "Not authenticated." };
		}

		const userId = getSessionUserId(session);
		if (!userId) {
			return { success: false, error: "Unable to determine authenticated user." };
		}

		const existingProject = await prisma.project.findUnique({
			where: { id: input.id },
			select: { id: true, createdBy: true },
		});

		if (!existingProject) {
			return { success: false, error: "Project not found." };
		}

		if (existingProject.createdBy !== userId) {
			return { success: false, error: "Unauthorized." };
		}

		const framework = await prisma.framework.findUnique({
			where: { id: input.frameworkId },
			select: { id: true, name: true, image: true, createdBy: true },
		});

		if (!framework) {
			return { success: false, error: "Framework not found." };
		}

		if (framework.createdBy !== userId) {
			return { success: false, error: "Unauthorized framework selection." };
		}

		const updatedProject = await prisma.project.update({
			where: { id: input.id },
			data: {
				name: input.name.trim(),
				description: input.description?.trim() || null,
				imageUrl: input.imageUrl?.trim() || null,
				roles: input.roles || [],
				frameworkId: input.frameworkId,
				type: input.type ?? undefined,
			},
			select: {
				id: true,
				name: true,
				type: true,
				description: true,
				imageUrl: true,
				roles: true,
				frameworkId: true,
				framework: {
					select: {
						id: true,
						name: true,
						image: true,
					},
				},
				createdAt: true,
				updatedAt: true,
			},
		});

		return { success: true, data: toProjectRecord(updatedProject) };
	} catch (error: unknown) {
		const code = typeof error === "object" && error !== null ? (error as { code?: string }).code : undefined;
		if (code === "P2003") {
			return { success: false, error: "Selected framework is invalid." };
		}

		const message = error instanceof Error ? error.message : "Failed to update project.";
		console.error("Edit project error:", message);
		return { success: false, error: message };
	}
}
