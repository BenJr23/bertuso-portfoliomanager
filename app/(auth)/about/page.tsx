import AboutPageClient from "./AboutPageClient";
import { getAboutMe } from "@/app/_actions/aboutme/getaboutme";

export default async function AboutPage() {
  const result = await getAboutMe();

  return (
    <AboutPageClient
      initialAboutMeEntries={result.success && result.data ? result.data : []}
      initialError={result.success ? null : result.error || "Failed to fetch about me entries."}
    />
  );
}
