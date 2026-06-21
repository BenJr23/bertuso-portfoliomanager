export const aboutMeCategoryOptions = [
  { value: "PERSONAL_BACKGROUND", label: "Personal Background" },
  { value: "TECHNICAL_EXPERTISE", label: "Technical Expertise" },
  { value: "WORK_PHILOSOPHY", label: "Work Philosophy" },
  { value: "CAREER_HIGHLIGHTS", label: "Career Highlights" },
  { value: "CONTINUOUS_LEARNING", label: "Continuous Learning" },
  { value: "WORK_EXPERIENCE", label: "Work Experience" },
  { value: "EDUCATIONAL_BACKGROUND", label: "Educational Background" },
] as const;

export type AboutMeCategoryValue = (typeof aboutMeCategoryOptions)[number]["value"];

export interface ProjectReference {
  id: string;
  name: string;
}

export interface AboutMeRecord {
  id: string;
  category: AboutMeCategoryValue;
  title: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  isPresent: boolean;
  projects: ProjectReference[];
  createdAt: string;
  updatedAt: string;
}

export function isAboutMeCategory(value: string): value is AboutMeCategoryValue {
  return aboutMeCategoryOptions.some((option) => option.value === value);
}

export function getAboutMeCategoryLabel(category: string) {
  return (
    aboutMeCategoryOptions.find((option) => option.value === category)?.label ??
    category.replaceAll("_", " ")
  );
}