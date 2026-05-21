export const aboutMeCategoryOptions = [
  { value: "PERSONAL_BACKGROUND", label: "Personal Background" },
  { value: "TECHNICAL_EXPERTISE", label: "Technical Expertise" },
  { value: "WORK_PHILOSOPHY", label: "Work Philosophy" },
  { value: "CAREER_HIGHLIGHTS", label: "Career Highlights" },
  { value: "CONTINUOUS_LEARNING", label: "Continuous Learning" },
] as const;

export type AboutMeCategoryValue = (typeof aboutMeCategoryOptions)[number]["value"];

export interface AboutMeRecord {
  id: string;
  category: AboutMeCategoryValue;
  title: string;
  description: string | null;
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