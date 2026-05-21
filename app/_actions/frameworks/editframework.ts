"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface EditFrameworkInput {
  id: string;
  name: string;
  image?: string | null;
  toolIds?: string[];
}

interface EditFrameworkResult {
  success: boolean;
  data?: {
    id: string;
    name: string;
    image: string | null;
  };
  error?: string;
}

export async function editFramework(input: EditFrameworkInput): Promise<EditFrameworkResult> {
  try {
    if (!input.id || !input.name?.trim()) {
      return { success: false, error: "Missing required fields." };
    }

    const cookieStore = await cookies();
    const session = await auth.api.getSession({
      headers: { cookie: cookieStore.toString() },
    });

    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated." };
    }

    const existingFramework = await prisma.framework.findUnique({
      where: { id: input.id },
    });

    if (!existingFramework) {
      return { success: false, error: "Framework not found." };
    }

    if (existingFramework.createdBy !== session.user.id) {
      return { success: false, error: "Unauthorized." };
    }

    const updatedFramework = await prisma.framework.update({
      where: { id: input.id },
      data: {
        name: input.name.trim(),
        image: input.image?.trim() || null,
        tools: typeof input.toolIds !== "undefined" ? { set: input.toolIds.map((id) => ({ id })) } : undefined,
      },
    });

    return {
      success: true,
      data: {
        id: updatedFramework.id,
        name: updatedFramework.name,
        image: updatedFramework.image,
      },
    };
  } catch (error: unknown) {
    const code = typeof error === "object" && error !== null ? (error as { code?: string }).code : undefined;
    if (code === "P2002") {
      return { success: false, error: "A framework with this name already exists." };
    }

    const message = error instanceof Error ? error.message : "Failed to edit framework.";
    console.error("Edit framework error:", message);
    return { success: false, error: message };
  }
}
