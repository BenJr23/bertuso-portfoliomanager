"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export interface DeleteCertificationResult {
	success: boolean;
	error?: string;
}

export async function deleteCertification(certificationId: string): Promise<DeleteCertificationResult> {
	try {
		if (!certificationId?.trim()) {
			return { success: false, error: "Certification ID is required." };
		}

		const cookieStore = await cookies();
		const session = await auth.api.getSession({ headers: { cookie: cookieStore.toString() } });

		if (!session?.user?.id) {
			return { success: false, error: "Not authenticated." };
		}

		const existingCertification = await prisma.certification.findUnique({ where: { id: certificationId } });
		if (!existingCertification) {
			return { success: false, error: "Certification not found." };
		}

		if (existingCertification.createdBy !== session.user.id) {
			return { success: false, error: "Unauthorized." };
		}

		await prisma.certification.delete({ where: { id: certificationId } });
		return { success: true };
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Failed to delete certification.";
		console.error("Delete certification error:", message);
		return { success: false, error: message };
	}
}

