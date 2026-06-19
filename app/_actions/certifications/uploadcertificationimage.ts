"use server";

import { uploadAuthenticatedImage } from "@/lib/supabase-storage";

interface UploadCertificationImageResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadCertificationImage(file: File): Promise<UploadCertificationImageResult> {
  try {
    if (!file) {
      return { success: false, error: "No file provided." };
    }

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadAuthenticatedImage(formData, "certifications");
    if (!result.success) {
      return { success: false, error: result.error || "Upload failed." };
    }

    return { success: true, url: result.url };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to upload image.";
    return { success: false, error: message };
  }
}
