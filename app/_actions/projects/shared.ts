export interface ProjectFrameworkOption {
  id: string;
  name: string;
  image: string | null;
}

export interface ProjectRecord {
  id: string;
  name: string;
  type: string;
  description: string | null;
  imageUrl: string | null;
  roles: string[];
  frameworkId: string;
  framework: ProjectFrameworkOption;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormValues {
  name: string;
  type: string;
  description: string;
  imageUrl: string;
  roles: string[];
  frameworkId: string;
}

export function getSessionUserId(session: unknown) {
  const typedSession = session as {
    user?: {
      id?: string;
    };
    userId?: string;
    id?: string;
  };

  return typedSession.user?.id ?? typedSession.userId ?? typedSession.id;
}