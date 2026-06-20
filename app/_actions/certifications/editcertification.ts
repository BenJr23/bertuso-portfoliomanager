"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export interface EditCertificationInput {
	id: string;
	name: string;
	dateIssued: string;
	description?: string | null;
	image?: string | null;
}

export interface EditCertificationResult {
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

export async function editCertification(input: EditCertificationInput): Promise<EditCertificationResult> {
	try {
		if (!input.id || !input.name?.trim()) {
			return { success: false, error: "Missing required fields." };
		}

		const cookieStore = await cookies();
		const session = await auth.api.getSession({ headers: { cookie: cookieStore.toString() } });

		if (!session?.user?.id) {
			return { success: false, error: "Not authenticated." };
		}

		const existingCertification = await prisma.certification.findUnique({ where: { id: input.id } });
		if (!existingCertification) {
			return { success: false, error: "Certification not found." };
		}

		if (existingCertification.createdBy !== session.user.id) {
			return { success: false, error: "Unauthorized." };
		}

		const dateIssued = new Date(input.dateIssued);
		if (Number.isNaN(dateIssued.getTime())) {
			return { success: false, error: "Valid date issued is required." };
		}

		const updated = await prisma.certification.update({
			where: { id: input.id },
			data: {
				name: input.name.trim(),
				dateIssued,
				description: input.description?.trim() || null,
				image: input.image?.trim() || null,
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
				...updated,
				dateIssued: updated.dateIssued.toISOString(),
			},
		};
	} catch (error: unknown) {
		const code = typeof error === "object" && error !== null ? (error as { code?: string }).code : undefined;
		if (code === "P2002") {
			return { success: false, error: "A certification with this name already exists." };
		}

		const message = error instanceof Error ? error.message : "Failed to edit certification.";
		console.error("Edit certification error:", message);
		return { success: false, error: message };
	}
}

