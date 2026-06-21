"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { AboutMeRecord } from "./shared";

interface GetAboutMeResult {
	success: boolean;
	data?: AboutMeRecord[];
	error?: string;
}

function toAboutMeRecord(aboutMe: {
	id: string;
	category: AboutMeRecord["category"];
	title: string;
	description: string | null;
	startDate: Date | null;
	endDate: Date | null;
	isPresent: boolean;
	createdAt: Date;
	updatedAt: Date;
	projects: { id: string; name: string }[];
}): AboutMeRecord {
	return {
		id: aboutMe.id,
		category: aboutMe.category,
		title: aboutMe.title,
		description: aboutMe.description,
		startDate: aboutMe.startDate?.toISOString() ?? null,
		endDate: aboutMe.endDate?.toISOString() ?? null,
		isPresent: aboutMe.isPresent,
		projects: aboutMe.projects.map(p => ({ id: p.id, name: p.name })),
		createdAt: aboutMe.createdAt.toISOString(),
		updatedAt: aboutMe.updatedAt.toISOString(),
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

export async function getAboutMe(): Promise<GetAboutMeResult> {
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

		const aboutMeEntries = await prisma.aboutMe.findMany({
			where: {
				createdBy: userId,
			},
			select: {
				id: true,
				category: true,
				title: true,
				description: true,
				startDate: true,
				endDate: true,
				isPresent: true,
				createdAt: true,
				updatedAt: true,
				projects: {
					select: { id: true, name: true }
				}
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
			data: aboutMeEntries.map(toAboutMeRecord),
		};
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Failed to fetch about me entries.";
		console.error("Get about me error:", message);
		return { success: false, error: message };
	}
}
