"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export interface CertificationItem {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
}

interface GetCertificationsResult {
  success: boolean;
  data?: CertificationItem[];
  error?: string;
}

export async function getCertifications(): Promise<GetCertificationsResult> {
  try {
    const cookieStore = await cookies();
    const session = await auth.api.getSession({ headers: { cookie: cookieStore.toString() } });

    if (!session) {
      return { success: false, error: "Not authenticated." };
    }

    const userId = (session as any).user?.id ?? (session as any).userId ?? (session as any).id;
    if (!userId) {
      return { success: false, error: "Unable to determine authenticated user." };
    }

    const certifications = await prisma.certification.findMany({
      where: { createdBy: userId },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: certifications };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch certifications.";
    console.error("Get certifications error:", message);
    return { success: false, error: message };
  }
}
