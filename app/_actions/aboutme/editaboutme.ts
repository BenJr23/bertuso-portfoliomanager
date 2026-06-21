"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { isAboutMeCategory, type AboutMeCategoryValue, type AboutMeRecord } from "./shared";

interface EditAboutMeInput {
  id: string;
  category: AboutMeCategoryValue;
  title: string;
  description?: string;
  startDate?: string | null;
  endDate?: string | null;
  isPresent?: boolean;
  projectIds?: string[];
}

interface EditAboutMeResult {
  success: boolean;
  data?: AboutMeRecord;
  error?: string;
}

function toAboutMeRecord(aboutMe: {
  id: string;
  category: AboutMeCategoryValue;
  title: string;
  description: string | null;
  startDate: Date | null;
  endDate: Date | null;
  isPresent: boolean;
  createdAt: Date;
  updatedAt: Date;
  projects: { id: string; name: string }[];
}): AboutMeRecord {
  return {
    id: aboutMe.id,
    category: aboutMe.category,
    title: aboutMe.title,
    description: aboutMe.description,
    startDate: aboutMe.startDate?.toISOString() ?? null,
    endDate: aboutMe.endDate?.toISOString() ?? null,
    isPresent: aboutMe.isPresent,
    projects: aboutMe.projects.map(p => ({ id: p.id, name: p.name })),
    createdAt: aboutMe.createdAt.toISOString(),
    updatedAt: aboutMe.updatedAt.toISOString(),
  };
}

export async function editAboutMe(input: EditAboutMeInput): Promise<EditAboutMeResult> {
  try {
    if (!input.id?.trim() || !input.title?.trim()) {
      return { success: false, error: "Missing required fields." };
    }

    if (!input?.category || !isAboutMeCategory(input.category)) {
      return { success: false, error: "A valid category is required." };
    }

    const cookieStore = await cookies();
    const session = await auth.api.getSession({
      headers: { cookie: cookieStore.toString() },
    });

    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated." };
    }

    const existingAboutMe = await prisma.aboutMe.findUnique({
      where: { id: input.id },
    });

    if (!existingAboutMe) {
      return { success: false, error: "About me entry not found." };
    }

    if (existingAboutMe.createdBy !== session.user.id) {
      return { success: false, error: "Unauthorized." };
    }

    const updatedAboutMe = await prisma.aboutMe.update({
      where: { id: input.id },
      data: {
        category: input.category,
        title: input.title.trim(),
        description: input.description?.trim() || null,
        startDate: input.startDate ? new Date(input.startDate) : null,
        endDate: input.isPresent ? null : (input.endDate ? new Date(input.endDate) : null),
        isPresent: input.isPresent ?? false,
        projects: input.projectIds?.length ? {
          set: input.projectIds.map(id => ({ id }))
        } : { set: [] },
      },
      select: {
        id: true,
        category: true,
        title: true,
        description: true,
        startDate: true,
        endDate: true,
        isPresent: true,
        createdAt: true,
        updatedAt: true,
        projects: {
          select: { id: true, name: true }
        }
      },
    });

    return {
      success: true,
      data: toAboutMeRecord(updatedAboutMe),
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update about me entry.";
    console.error("Edit about me error:", message);
    return { success: false, error: message };
  }
}