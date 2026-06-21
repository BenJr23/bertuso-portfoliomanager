"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface EditProfileInput {
	name?: string;
	image?: string | null;
	description?: string | null;
	address?: string | null;
	phoneNumber?: string | null;
	linkedinLink?: string | null;
	githubLink?: string | null;
	photos?: string[];
}

interface EditProfileResult {
	success: boolean;
	data?: {
		id: string;
		name: string;
		email: string;
		image?: string | null;
		description?: string | null;
		address?: string | null;
		phoneNumber?: string | null;
		linkedinLink?: string | null;
		githubLink?: string | null;
		photos: string[];
	};
	error?: string;
}

export async function editProfile(input: EditProfileInput): Promise<EditProfileResult> {
	try {
		const cookieStore = await cookies();
		const session = await auth.api.getSession({ headers: { cookie: cookieStore.toString() } });
		if (!session) return { success: false, error: "Not authenticated." };

		const userId = (session as any).user?.id ?? (session as any).userId ?? (session as any).id;
		if (!userId) return { success: false, error: "Unable to determine user." };

		const data: any = {};
		if (typeof input.name !== "undefined") data.name = input.name?.trim();
		if (typeof input.image !== "undefined") data.image = input.image?.trim() || null;
		if (typeof input.description !== "undefined") data.description = input.description || null;
		if (typeof input.address !== "undefined") data.address = input.address || null;
		if (typeof input.phoneNumber !== "undefined") data.phoneNumber = input.phoneNumber || null;
		if (typeof input.linkedinLink !== "undefined") data.linkedinLink = input.linkedinLink || null;
		if (typeof input.githubLink !== "undefined") data.githubLink = input.githubLink || null;

		const updated = await prisma.user.update({
			where: { id: userId },
			data,
			select: {
				id: true,
				name: true,
				email: true,
				image: true,
				description: true,
				address: true,
				phoneNumber: true,
				linkedinLink: true,
				githubLink: true,
				photos: true,
			},
		});

		return { success: true, data: updated };
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : "Failed to update profile.";
		console.error("editProfile error:", message);
		return { success: false, error: message };
	}
}
