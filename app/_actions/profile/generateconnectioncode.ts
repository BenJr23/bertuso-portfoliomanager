"use server";

import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface Result {
  success: boolean;
  data?: { connectionCode: string };
  error?: string;
}

export async function generateConnectionCode(): Promise<Result> {
  try {
    const cookieStore = await cookies();
    const session = await auth.api.getSession({ headers: { cookie: cookieStore.toString() } });
    if (!session) return { success: false, error: "Not authenticated." };

    const userId = (session as any).user?.id ?? (session as any).userId ?? (session as any).id;
    if (!userId) return { success: false, error: "Unable to determine user." };

    const connectionCode = randomBytes(24).toString("hex");

    const updated = await (prisma as any).user.update({
      where: { id: userId },
      data: { connectionCode },
    });

    return { success: true, data: { connectionCode: (updated as any).connectionCode } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate connection code.";
    console.error("generateConnectionCode error:", message);
    return { success: false, error: message };
  }
}
