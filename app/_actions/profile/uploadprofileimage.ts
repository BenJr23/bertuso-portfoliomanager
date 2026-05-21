"use server";

import { uploadAuthenticatedImage } from "@/lib/supabase-storage";

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadProfileImage(file: File): Promise<UploadResult> {
  try {
    if (!file) return { success: false, error: "No file provided." };
    const fd = new FormData();
    fd.append("file", file);
    const result = await uploadAuthenticatedImage(fd, "profiles");
    if (!result.success) return { success: false, error: result.error || "Upload failed." };
    return { success: true, url: result.url };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed.";
    return { success: false, error: message };
  }
}
