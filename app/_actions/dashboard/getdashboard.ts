"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface DashboardStat {
	label: string;
	value: number;
	suffix: string;
}

interface DashboardUpdate {
	title: string;
	description: string;
	updatedAt: string;
}

interface DashboardData {
	userName: string;
	stats: DashboardStat[];
	updates: DashboardUpdate[];
}

interface GetDashboardResult {
	success: boolean;
	data?: DashboardData;
	error?: string;
}

function getSessionUserId(session: unknown) {
	const typedSession = session as {
		user?: {
			id?: string;
			name?: string;
		};
		userId?: string;
		id?: string;
	};

	return typedSession.user?.id ?? typedSession.userId ?? typedSession.id;
}

function formatUpdateDate(value: Date) {
	return value.toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export async function getDashboard(): Promise<GetDashboardResult> {
	try {
		const cookieStore = await cookies();
		const session = await auth.api.getSession({ headers: { cookie: cookieStore.toString() } });

		if (!session) {
			return { success: false, error: "Not authenticated." };
		}

		const userId = getSessionUserId(session);
		if (!userId) {
			return { success: false, error: "Unable to determine authenticated user." };
		}

		const [user, toolCount, frameworkCount, projectCount, certificationCount, latestTools, latestFrameworks, latestProjects, latestCertifications] = await Promise.all([
			prisma.user.findUnique({
				where: { id: userId },
				select: { name: true },
			}),
			prisma.tool.count({ where: { createdBy: userId } }),
			prisma.framework.count({ where: { createdBy: userId } }),
			prisma.project.count({ where: { createdBy: userId } }),
			prisma.certification.count({ where: { createdBy: userId } }),
			prisma.tool.findMany({
				where: { createdBy: userId },
				select: { name: true, updatedAt: true },
				orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
				take: 1,
			}),
			prisma.framework.findMany({
				where: { createdBy: userId },
				select: { name: true, updatedAt: true },
				orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
				take: 1,
			}),
			prisma.project.findMany({
				where: { createdBy: userId },
				select: { name: true, updatedAt: true },
				orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
				take: 1,
			}),
			prisma.certification.findMany({
				where: { createdBy: userId },
				select: { name: true, updatedAt: true },
				orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
				take: 1,
			}),
		]);

		const updates: DashboardUpdate[] = [
			latestProjects[0]
				? {
						title: "Project updated",
						description: latestProjects[0].name,
						updatedAt: formatUpdateDate(latestProjects[0].updatedAt),
					}
				: null,
			latestFrameworks[0]
				? {
						title: "Framework updated",
						description: latestFrameworks[0].name,
						updatedAt: formatUpdateDate(latestFrameworks[0].updatedAt),
					}
				: null,
			latestTools[0]
				? {
						title: "Tool updated",
						description: latestTools[0].name,
						updatedAt: formatUpdateDate(latestTools[0].updatedAt),
					}
				: null,
			latestCertifications[0]
				? {
						title: "Certification updated",
						description: latestCertifications[0].name,
						updatedAt: formatUpdateDate(latestCertifications[0].updatedAt),
					}
				: null,
		].filter(Boolean) as DashboardUpdate[];

		return {
			success: true,
			data: {
				userName: user?.name || "there",
				stats: [
					{ label: "Tools", value: toolCount, suffix: "tracked" },
					{ label: "Frameworks", value: frameworkCount, suffix: "tracked" },
					{ label: "Projects", value: projectCount, suffix: "published" },
					{ label: "Certifications", value: certificationCount, suffix: "saved" },
				],
				updates,
			},
		};
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Failed to load dashboard.";
		console.error("Get dashboard error:", message);
		return { success: false, error: message };
	}
}

