"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface AddFrameworkInput {
  name: string;
  image?: string | null;
  toolIds?: string[];
}

interface AddFrameworkResult {
  success: boolean;
  data?: {
    id: string;
    name: string;
    image: string | null;
  };
  error?: string;
}

export async function addFramework(input: AddFrameworkInput): Promise<AddFrameworkResult> {
  try {
    if (!input?.name?.trim()) {
      return { success: false, error: "Framework name is required." };
    }

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

    const created = await prisma.framework.create({
      data: {
        name: input.name.trim(),
        image: input.image?.trim() || null,
        tools: input.toolIds && input.toolIds.length > 0 ? { connect: input.toolIds.map((id) => ({ id })) } : undefined,
        createdBy: userId,
      },
    });

    return {
      success: true,
      data: {
        id: created.id,
        name: created.name,
        image: created.image,
      },
    };
  } catch (error: unknown) {
    const code = typeof error === "object" && error !== null ? (error as { code?: string }).code : undefined;
    if (code === "P2002") {
      return { success: false, error: "A framework with this name already exists." };
    }

    const message = error instanceof Error ? error.message : "Failed to create framework.";
    console.error("Create framework error:", message);
    return { success: false, error: message };
  }
}
