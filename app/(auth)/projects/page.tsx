import { getFrameworks } from "@/app/_actions/frameworks/getframeworks";
import { getProjects } from "@/app/_actions/projects/getproject";
import ProjectsPageClient from "./ProjectsPageClient";

export default async function ProjectsPage() {
  const [projectsResult, frameworksResult] = await Promise.all([getProjects(), getFrameworks()]);

  return (
    <ProjectsPageClient
      initialProjects={projectsResult.success && projectsResult.data ? projectsResult.data : []}
      initialFrameworks={frameworksResult.success && frameworksResult.data ? frameworksResult.data : []}
      initialError={
        projectsResult.success && frameworksResult.success
          ? null
          : projectsResult.error || frameworksResult.error || "Failed to fetch projects."
      }
    />
  );
}
