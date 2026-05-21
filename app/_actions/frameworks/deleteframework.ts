"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface DeleteFrameworkResult {
  success: boolean;
  error?: string;
}

export async function deleteFramework(frameworkId: string): Promise<DeleteFrameworkResult> {
  try {
    if (!frameworkId?.trim()) {
      return { success: false, error: "Framework ID is required." };
    }

    const cookieStore = await cookies();
    const session = await auth.api.getSession({
      headers: { cookie: cookieStore.toString() },
    });

    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated." };
    }

    const existingFramework = await prisma.framework.findUnique({
      where: { id: frameworkId },
    });

    if (!existingFramework) {
      return { success: false, error: "Framework not found." };
    }

    if (existingFramework.createdBy !== session.user.id) {
      return { success: false, error: "Unauthorized." };
    }

    await prisma.framework.delete({
      where: { id: frameworkId },
    });

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete framework.";
    console.error("Delete framework error:", message);
    return { success: false, error: message };
  }
}
