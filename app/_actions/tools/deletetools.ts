"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface DeleteToolResult {
  success: boolean;
  error?: string;
}

export async function deleteTool(toolId: string): Promise<DeleteToolResult> {
  try {
    // Verify session
    const cookieStore = await cookies();
    const session = await auth.api.getSession({
      headers: { cookie: cookieStore.toString() },
    });

    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated." };
    }

    // Validate input
    if (!toolId?.trim()) {
      return { success: false, error: "Tool ID is required." };
    }

    // Check if tool exists and belongs to user
    const existingTool = await prisma.tool.findUnique({
      where: { id: toolId },
    });

    if (!existingTool) {
      return { success: false, error: "Tool not found." };
    }

    if (existingTool.createdBy !== session.user.id) {
      return { success: false, error: "Unauthorized." };
    }

    // Delete tool from database
    await prisma.tool.delete({
      where: { id: toolId },
    });

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete tool.";
    console.error("Delete tool error:", message);
    return { success: false, error: message };
  }
}
