"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface GetProfileResult {
	success: boolean;
	data?: {
		id: string;
		name: string;
		email: string;
		image?: string | null;
		connectionCode?: string | null;
		description?: string | null;
		address?: string | null;
		phoneNumber?: string | null;
		linkedinLink?: string | null;
		githubLink?: string | null;
		photos: string[];
	};
	error?: string;
}

export async function getProfile(): Promise<GetProfileResult> {
	try {
		const cookieStore = await cookies();
		const session = await auth.api.getSession({ headers: { cookie: cookieStore.toString() } });
		if (!session) return { success: false, error: "Not authenticated." };

		const userId = (session as any).user?.id ?? (session as any).userId ?? (session as any).id;
		if (!userId) return { success: false, error: "Unable to determine user." };

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				name: true,
				email: true,
				image: true,
				connectionCode: true,
				description: true,
				address: true,
				phoneNumber: true,
				linkedinLink: true,
				githubLink: true,
				photos: true,
			},
		});

		if (!user) return { success: false, error: "User not found." };

		return { success: true, data: user };
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : "Failed to fetch profile.";
		console.error("getProfile error:", message);
		return { success: false, error: message };
	}
}

