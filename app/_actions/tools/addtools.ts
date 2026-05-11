"use server";

import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

type AddToolInput = {
  name: string;
  picture?: string | null;
  category: string;
};

interface AddToolResult {
  success: boolean;
  data?: {
    id: string;
    name: string;
    category: string;
    picture?: string | null;
  };
  error?: string;
}

export async function addTool(input: AddToolInput): Promise<AddToolResult> {
  try {
    // Validate required fields
    if (!input?.name?.trim()) {
      return { success: false, error: "Tool name is required." };
    }

    if (!input?.category?.trim()) {
      return { success: false, error: "Category is required." };
    }

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

    // Map human-friendly category (e.g. "Version Control") to enum value (VERSION_CONTROL)
    const categoryEnum = input.category.toUpperCase().replace(/\s+/g, "_");

    // Create tool
    const created = await prisma.tool.create({
      data: {
        name: input.name.trim(),
        picture: input.picture?.trim() || null,
        category: categoryEnum as any,
        createdBy: userId,
      },
    });

    return {
      success: true,
      data: {
        id: created.id,
        name: created.name,
        category: created.category,
        picture: created.picture,
      },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create tool.";
    console.error("Create tool error:", message);
    return {
      success: false,
      error: message,
    };
  }
}
