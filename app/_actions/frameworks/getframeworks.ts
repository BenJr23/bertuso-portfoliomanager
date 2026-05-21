"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface FrameworkData {
  id: string;
  name: string;
  image: string | null;
  toolCount: number;
  projectCount: number;
}

interface GetFrameworksResult {
  success: boolean;
  data?: FrameworkData[];
  error?: string;
}

export async function getFrameworks(): Promise<GetFrameworksResult> {
  try {
    const cookieStore = await cookies();
    const session = await auth.api.getSession({
      headers: { cookie: cookieStore.toString() },
    });

    if (!session) {
      return { success: false, error: "Not authenticated." };
    }

    const userId = (session as any).user?.id ?? (session as any).userId ?? (session as any).id;
    if (!userId) {
      return { success: false, error: "Unable to determine authenticated user." };
    }

    const frameworks = await prisma.framework.findMany({
      where: {
        createdBy: userId,
      },
      select: {
        id: true,
        name: true,
        image: true,
        _count: {
          select: {
            tools: true,
            projects: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: frameworks.map((framework) => ({
        id: framework.id,
        name: framework.name,
        image: framework.image,
        toolCount: framework._count.tools,
        projectCount: framework._count.projects,
      })),
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch frameworks.";
    console.error("Get frameworks error:", message);
    return { success: false, error: message };
  }
}
