"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export interface AddCertificationInput {
	name: string;
	dateIssued: string;
	description?: string | null;
	image?: string | null;
}

export interface AddCertificationResult {
	success: boolean;
	data?: {
		id: string;
		name: string;
		dateIssued: string;
		description: string | null;
		image: string | null;
	};
	error?: string;
}

export async function addCertification(input: AddCertificationInput): Promise<AddCertificationResult> {
	try {
		if (!input?.name?.trim()) {
			return { success: false, error: "Certification name is required." };
		}

		const cookieStore = await cookies();
		const session = (await auth.api.getSession({ headers: { cookie: cookieStore.toString() } })) as {
			user?: { id?: string };
			userId?: string;
			id?: string;
		} | null;

		if (!session) {
			return { success: false, error: "Not authenticated." };
		}

		const userId = session?.user?.id ?? session?.userId ?? session?.id;
		if (!userId) {
			return { success: false, error: "Unable to determine authenticated user." };
		}

		const dateIssued = new Date(input.dateIssued);
		if (Number.isNaN(dateIssued.getTime())) {
			return { success: false, error: "Valid date issued is required." };
		}

		const created = await prisma.certification.create({
			data: {
				name: input.name.trim(),
				dateIssued,
				description: input.description?.trim() || null,
				image: input.image?.trim() || null,
				createdBy: userId,
			},
			select: {
				id: true,
				name: true,
				dateIssued: true,
				description: true,
				image: true,
			},
		});

		return {
			success: true,
			data: {
				...created,
				dateIssued: created.dateIssued.toISOString(),
			},
		};
	} catch (error: unknown) {
		const code = typeof error === "object" && error !== null ? (error as { code?: string }).code : undefined;
		if (code === "P2002") {
			return { success: false, error: "A certification with this name already exists." };
		}

		const message = error instanceof Error ? error.message : "Failed to create certification.";
		console.error("Create certification error:", message);
		return { success: false, error: message };
	}
}

