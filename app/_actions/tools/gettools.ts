"use server";

import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

interface ToolData {
  id: string;
  name: string;
  picture: string | null;
  category: string;
}

interface GetToolsResult {
  success: boolean;
  data?: ToolData[];
  error?: string;
}

export async function getTools(): Promise<GetToolsResult> {
  try {
    // Verify session via Better Auth
    const cookieStore = await cookies();
    const session = await auth.api.getSession({
      headers: { cookie: cookieStore.toString() },
    });

    if (!session) {
      return { success: false, error: "Not authenticated." };
    }

    // Extract user id from session
    const userId = (session as any).user?.id ?? (session as any).userId ?? (session as any).id;
    if (!userId) {
      return { success: false, error: "Unable to determine authenticated user." };
    }

    // Fetch all tools created by the user
    const tools = await prisma.tool.findMany({
      where: {
        createdBy: userId,
      },
      select: {
        id: true,
        name: true,
        picture: true,
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: tools,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch tools.";
    console.error("Get tools error:", message);
    return {
      success: false,
      error: message,
    };
  }
}
