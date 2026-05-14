"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * Generic Supabase storage utilities for file uploads
 */

interface UploadFileOptions {
  folder?: string;
  maxSizeBytes?: number;
}

interface UploadFileResult {
  success: boolean;
  url?: string;
  error?: string;
}

interface UploadToolImageResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload a file to Supabase storage
 * @param file - File to upload
 * @param options - Upload options (folder path, max size)
 * @returns Upload result with public URL or error message
 */
export async function uploadFile(
  file: File,
  options: UploadFileOptions = {}
): Promise<UploadFileResult> {
  try {
    const { folder = "uploads", maxSizeBytes = 5 * 1024 * 1024 } = options;

    // Validate file type is image
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "File must be an image." };
    }

    // Validate file size
    if (file.size > maxSizeBytes) {
      return {
        success: false,
        error: `File size must be less than ${maxSizeBytes / (1024 * 1024)}MB.`,
      };
    }

    // Get Supabase configuration
    const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const bucketName = process.env.SUPABASE_BUCKET_NAME;
    const apiSecret = process.env.IMS_API_SECRET_KEY;

    if (!projectUrl || !bucketName || !apiSecret) {
      return { success: false, error: "Supabase configuration missing." };
    }

    // Create a unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const filename = `${folder}/${timestamp}-${random}-${file.name}`;

    // Build upload URL using project URL directly
    const uploadUrl = `${projectUrl}/storage/v1/object/${encodeURIComponent(
      bucketName
    )}/${filename
      .split("/")
      .map(encodeURIComponent)
      .join("/")}`;

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Supabase using REST API
    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiSecret}`,
        apikey: apiSecret,
        "Content-Type": file.type || "application/octet-stream",
        "x-upsert": "true",
      },
      body: buffer,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Supabase upload error:", {
        status: res.status,
        statusText: res.statusText,
        body: errorText,
      });
      return {
        success: false,
        error: `Supabase error (${res.status}): ${errorText || res.statusText}`,
      };
    }

    // Return the public URL
    const encodedFilename = filename
      .split("/")
      .map(encodeURIComponent)
      .join("/");
    const publicUrl = `${projectUrl}/storage/v1/object/public/${encodeURIComponent(
      bucketName
    )}/${encodedFilename}`;

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to upload file.";
    console.error("Upload file error:", message);
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Upload a tool image to Supabase storage with authentication
 * @param formData - FormData containing the file to upload
 * @returns Upload result with public URL or error message
 */
export async function uploadToolImage(
  formData: FormData
): Promise<UploadToolImageResult> {
  try {
    // Verify session
    const cookieStore = await cookies();
    const session = await auth.api.getSession({
      headers: { cookie: cookieStore.toString() },
    });

    if (!session) {
      return { success: false, error: "Not authenticated." };
    }

    // Get file from form data
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided." };
    }

    // Upload using generic upload function
    const result = await uploadFile(file, { folder: "tools" });
    return result as UploadToolImageResult;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to upload image.";
    console.error("Upload tool image error:", message);
    return {
      success: false,
      error: message,
    };
  }
}
