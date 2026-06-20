"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { ProjectRecord } from "./shared";

interface GetProjectsResult {
	success: boolean;
	data?: ProjectRecord[];
	error?: string;
}

function toProjectRecord(project: {
	id: string;
	name: string;
	description: string | null;
	imageUrl: string | null;
	roles: string[];
	frameworkId: string;
	framework: {
		id: string;
		name: string;
		image: string | null;
	};
	createdAt: Date;
	updatedAt: Date;
}): ProjectRecord {
	return {
		id: project.id,
		name: project.name,
		description: project.description,
		imageUrl: project.imageUrl,
		roles: project.roles || [],
		frameworkId: project.frameworkId,
		framework: project.framework,
		createdAt: project.createdAt.toISOString(),
		updatedAt: project.updatedAt.toISOString(),
	};
}

function getSessionUserId(session: unknown) {
	const typedSession = session as {
		user?: {
			id?: string;
		};
		userId?: string;
		id?: string;
	};

	return typedSession.user?.id ?? typedSession.userId ?? typedSession.id;
}

export async function getProjects(): Promise<GetProjectsResult> {
	try {
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

		const projects = await prisma.project.findMany({
			where: { createdBy: userId },
			select: {
				id: true,
				name: true,
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
			orderBy: [
				{
					updatedAt: "desc",
				},
				{
					createdAt: "desc",
				},
			],
		});

		return {
			success: true,
			data: projects.map(toProjectRecord),
		};
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Failed to fetch projects.";
		console.error("Get projects error:", message);
		return { success: false, error: message };
	}
}
