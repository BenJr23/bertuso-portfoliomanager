"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface EditToolInput {
  id: string;
  name: string;
  category: string;
  picture?: string;
}

interface EditToolResult {
  success: boolean;
  data?: {
    id: string;
    name: string;
    category: string;
    picture: string | null;
  };
  error?: string;
}

export async function editTool(input: EditToolInput): Promise<EditToolResult> {
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
    if (!input.id || !input.name?.trim() || !input.category?.trim()) {
      return { success: false, error: "Missing required fields." };
    }

    // Check if tool exists and belongs to user
    const existingTool = await prisma.tool.findUnique({
      where: { id: input.id },
    });

    if (!existingTool) {
      return { success: false, error: "Tool not found." };
    }

    if (existingTool.createdBy !== session.user.id) {
      return { success: false, error: "Unauthorized." };
    }

    // Update tool in database
    // Convert category string to enum format (e.g., "Version Control" -> "VERSION_CONTROL")
    const categoryEnum = input.category.toUpperCase().replace(/\s+/g, "_");
    const updatedTool = await prisma.tool.update({
      where: { id: input.id },
      data: {
        name: input.name.trim(),
        category: categoryEnum as any,
        picture: input.picture || null,
      },
    });

    return {
      success: true,
      data: {
        id: updatedTool.id,
        name: updatedTool.name,
        category: updatedTool.category,
        picture: updatedTool.picture,
      },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to edit tool.";
    console.error("Edit tool error:", message);
    return { success: false, error: message };
  }
}
