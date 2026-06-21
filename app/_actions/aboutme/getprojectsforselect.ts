"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export interface ProjectOption {
	id: string;
	name: string;
}

interface GetProjectsForSelectResult {
	success: boolean;
	data?: ProjectOption[];
	error?: string;
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

export async function getProjectsForSelect(): Promise<GetProjectsForSelectResult> {
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
			where: {
				createdBy: userId,
			},
			select: {
				id: true,
				name: true,
			},
			orderBy: {
				name: "asc",
			},
		});

		return {
			success: true,
			data: projects,
		};
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Failed to fetch projects.";
		console.error("Get projects for select error:", message);
		return { success: false, error: message };
	}
}
