export const mockUser = {
  id: "user-1",
  name: "Alex Chen",
  email: "alex.chen@example.com",
  emailVerified: true,
  image:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  description:
    "Full-stack developer with 8+ years of experience building scalable web applications",
  address: "San Francisco, CA",
  phoneNumber: "+1 (555) 123-4567",
  linkedinLink: "https://linkedin.com/in/alexchen",
  createdAt: new Date("2023-01-15"),
  updatedAt: new Date("2024-05-10"),
};

export const mockAboutMe = [
  {
    id: "about-1",
    title: "Professional Background",
    description:
      "Experienced software engineer specializing in modern web technologies and cloud architecture. Led multiple successful product launches and team initiatives.",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2024-03-20"),
  },
  {
    id: "about-2",
    title: "Technical Expertise",
    description:
      "Deep expertise in React, Node.js, TypeScript, and cloud platforms. Passionate about building performant, accessible, and maintainable applications.",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2024-03-20"),
  },
  {
    id: "about-3",
    title: "Philosophy",
    description:
      "Believer in clean code, continuous learning, and collaborative development. Always exploring new technologies and best practices.",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2024-03-20"),
  },
];

export const mockTools = [
  {
    id: "tool-1",
    name: "React",
    picture:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    category: "Frontend",
  },
  {
    id: "tool-2",
    name: "TypeScript",
    picture:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    category: "Frontend",
  },
  {
    id: "tool-3",
    name: "Node.js",
    picture:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    category: "Backend",
  },
  {
    id: "tool-4",
    name: "PostgreSQL",
    picture:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    category: "Database",
  },
  {
    id: "tool-5",
    name: "Docker",
    picture:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    category: "DevOps",
  },
  {
    id: "tool-6",
    name: "Jest",
    picture:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg",
    category: "Testing",
  },
  {
    id: "tool-7",
    name: "Git",
    picture:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    category: "Version Control",
  },
  {
    id: "tool-8",
    name: "AWS",
    picture:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
    category: "Cloud",
  },
];

export const mockFrameworks = [
  {
    id: "framework-1",
    name: "Next.js",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    tools: ["React", "TypeScript"],
    projects: ["E-Commerce Platform", "Task Management App"],
  },
  {
    id: "framework-2",
    name: "Express",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    tools: ["Node.js", "TypeScript"],
    projects: ["API Gateway Service"],
  },
  {
    id: "framework-3",
    name: "Prisma",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg",
    tools: ["PostgreSQL", "TypeScript"],
    projects: ["Database Layer"],
  },
  {
    id: "framework-4",
    name: "React Native",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    tools: ["React", "TypeScript"],
    projects: ["Mobile Fitness Tracker"],
  },
];

export const mockProjects = [
  {
    id: "project-1",
    name: "E-Commerce Platform",
    description:
      "Full-featured e-commerce platform with real-time inventory management, payment processing, and admin dashboard",
    imageUrl:
      "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
    frameworkId: "framework-1",
    framework: "Next.js",
  },
  {
    id: "project-2",
    name: "Task Management App",
    description:
      "Collaborative task management application with real-time updates, team workspaces, and project tracking",
    imageUrl:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop",
    frameworkId: "framework-1",
    framework: "Next.js",
  },
  {
    id: "project-3",
    name: "API Gateway Service",
    description:
      "Microservices API gateway with authentication, rate limiting, and request routing",
    imageUrl:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
    frameworkId: "framework-2",
    framework: "Express",
  },
  {
    id: "project-4",
    name: "Mobile Fitness Tracker",
    description:
      "Cross-platform mobile app for tracking workouts, nutrition, and fitness goals",
    imageUrl:
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=600&fit=crop",
    frameworkId: "framework-4",
    framework: "React Native",
  },
];

export const mockCertifications = [
  {
    id: "cert-1",
    name: "AWS Certified Solutions Architect",
    description:
      "Professional level certification demonstrating expertise in designing distributed systems on AWS",
    image:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=400&fit=crop",
  },
  {
    id: "cert-2",
    name: "Google Cloud Professional Developer",
    description:
      "Validates strong skills in building and deploying scalable applications on Google Cloud",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop",
  },
];
