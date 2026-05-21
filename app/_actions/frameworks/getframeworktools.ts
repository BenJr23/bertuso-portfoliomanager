"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface GetFrameworkToolsResult {
  success: boolean;
  data?: string[];
  error?: string;
}

export async function getFrameworkTools(frameworkId: string): Promise<GetFrameworkToolsResult> {
  try {
    if (!frameworkId) return { success: false, error: "Missing framework id." };

    const cookieStore = await cookies();
    const session = await auth.api.getSession({ headers: { cookie: cookieStore.toString() } });
    if (!session) return { success: false, error: "Not authenticated." };

    const userId = (session as any).user?.id ?? (session as any).userId ?? (session as any).id;
    if (!userId) return { success: false, error: "Unable to determine user." };

    const framework = await prisma.framework.findUnique({
      where: { id: frameworkId },
      include: { tools: { select: { id: true } } },
    });

    if (!framework) return { success: false, error: "Framework not found." };
    if (framework.createdBy !== userId) return { success: false, error: "Unauthorized." };

    return { success: true, data: framework.tools.map((t) => t.id) };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch framework tools.";
    console.error("getFrameworkTools error:", message);
    return { success: false, error: message };
  }
}
