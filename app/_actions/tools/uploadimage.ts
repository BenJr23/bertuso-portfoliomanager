"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";

interface UploadToolImageResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadToolImage(formData: FormData): Promise<UploadToolImageResult> {
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

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "File must be an image." };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return { success: false, error: "File size must be less than 5MB." };
    }

    // Create a unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const filename = `tools/${timestamp}-${random}-${file.name}`;

    // Get Supabase configuration
    const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const bucketName = process.env.SUPABASE_BUCKET_NAME;
    const apiSecret = process.env.IMS_API_SECRET_KEY;

    if (!projectUrl || !bucketName || !apiSecret) {
      return { success: false, error: "Supabase configuration missing." };
    }

    // Build upload URL using project URL directly
    const uploadUrl = `${projectUrl}/storage/v1/object/${encodeURIComponent(bucketName)}/${filename
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
        error: `Supabase error (${res.status}): ${errorText || res.statusText}` 
      };
    }

    // Return the public URL
    const encodedFilename = filename
      .split("/")
      .map(encodeURIComponent)
      .join("/");
    const publicUrl = `${projectUrl}/storage/v1/object/public/${encodeURIComponent(bucketName)}/${encodedFilename}`;
    return {
      success: true,
      url: publicUrl,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to upload image.";
    console.error("Upload tool image error:", message);
    return {
      success: false,
      error: message,
    };
  }
}
