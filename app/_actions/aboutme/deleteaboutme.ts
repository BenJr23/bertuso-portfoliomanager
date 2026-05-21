"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface DeleteAboutMeResult {
	success: boolean;
	error?: string;
}

export async function deleteAboutMe(aboutMeId: string): Promise<DeleteAboutMeResult> {
	try {
		if (!aboutMeId?.trim()) {
			return { success: false, error: "About me ID is required." };
		}

		const cookieStore = await cookies();
		const session = await auth.api.getSession({
			headers: { cookie: cookieStore.toString() },
		});

		if (!session?.user?.id) {
			return { success: false, error: "Not authenticated." };
		}

		const existingAboutMe = await prisma.aboutMe.findUnique({
			where: { id: aboutMeId },
		});

		if (!existingAboutMe) {
			return { success: false, error: "About me entry not found." };
		}

		if (existingAboutMe.createdBy !== session.user.id) {
			return { success: false, error: "Unauthorized." };
		}

		await prisma.aboutMe.delete({
			where: { id: aboutMeId },
		});

		return { success: true };
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Failed to delete about me entry.";
		console.error("Delete about me error:", message);
		return { success: false, error: message };
	}
}
