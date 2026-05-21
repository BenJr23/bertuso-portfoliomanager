"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { isAboutMeCategory, type AboutMeCategoryValue, type AboutMeRecord } from "./shared";

interface AddAboutMeInput {
	category: AboutMeCategoryValue;
	title: string;
	description?: string;
}

interface AddAboutMeResult {
	success: boolean;
	data?: AboutMeRecord;
	error?: string;
}

function toAboutMeRecord(aboutMe: {
	id: string;
	category: AboutMeCategoryValue;
	title: string;
	description: string | null;
	createdAt: Date;
	updatedAt: Date;
}): AboutMeRecord {
	return {
		id: aboutMe.id,
		category: aboutMe.category,
		title: aboutMe.title,
		description: aboutMe.description,
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

export async function addAboutMe(input: AddAboutMeInput): Promise<AddAboutMeResult> {
	try {
		if (!input?.title?.trim()) {
			return { success: false, error: "Title is required." };
		}

		if (!input?.category || !isAboutMeCategory(input.category)) {
			return { success: false, error: "A valid category is required." };
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

		const createdAboutMe = await prisma.aboutMe.create({
			data: {
				category: input.category,
				title: input.title.trim(),
				description: input.description?.trim() || null,
				createdBy: userId,
			},
			select: {
				id: true,
				category: true,
				title: true,
				description: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		return {
			success: true,
			data: toAboutMeRecord(createdAboutMe),
		};
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Failed to create about me entry.";
		console.error("Create about me error:", message);
		return { success: false, error: message };
	}
}
