"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getSessionUserId } from "./shared";

interface DeleteProjectResult {
	success: boolean;
	error?: string;
}

export async function deleteProject(projectId: string): Promise<DeleteProjectResult> {
	try {
		if (!projectId?.trim()) {
			return { success: false, error: "Project ID is required." };
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
			where: { id: projectId },
			select: { id: true, createdBy: true },
		});

		if (!existingProject) {
			return { success: false, error: "Project not found." };
		}

		if (existingProject.createdBy !== userId) {
			return { success: false, error: "Unauthorized." };
		}

		await prisma.project.delete({
			where: { id: projectId },
		});

		return { success: true };
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Failed to delete project.";
		console.error("Delete project error:", message);
		return { success: false, error: message };
	}
}
