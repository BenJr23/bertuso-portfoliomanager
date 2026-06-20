"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export interface CertificationItem {
  id: string;
  name: string;
  dateIssued: string;
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

    const certifications = await prisma.certification.findMany({
      where: { createdBy: userId },
      select: {
        id: true,
        name: true,
        dateIssued: true,
        description: true,
        image: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: certifications.map((cert) => ({
        ...cert,
        dateIssued: cert.dateIssued.toISOString(),
      })),
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch certifications.";
    console.error("Get certifications error:", message);
    return { success: false, error: message };
  }
}
