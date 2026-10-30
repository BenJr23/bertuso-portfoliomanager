"use server";

import { auth } from "@/lib/auth";

interface ForgotPasswordResult {
  success: boolean;
  message?: string;
  error?: string;
}

interface ResetPasswordResult {
  success: boolean;
  error?: string;
}

export async function requestPasswordReset(email: string): Promise<ForgotPasswordResult> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return { success: false, error: "Enter a valid email address." };
  }

  try {
    const baseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
    const result = await auth.api.requestPasswordReset({
      body: {
        email: normalizedEmail,
        redirectTo: `${baseUrl}/reset-password`,
      },
    });

    return {
      success: result.status,
      message: result.message,
      ...(result.status ? {} : { error: "Unable to send the password reset email." }),
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to send the password reset email.";
    console.error("Request password reset error:", message);
    return { success: false, error: message };
  }
}

export async function resetPassword(password: string, token: string): Promise<ResetPasswordResult> {
  if (password.length < 8) {
    return { success: false, error: "Your password must be at least 8 characters." };
  }

  if (!token) {
    return { success: false, error: "This password reset link is invalid or incomplete." };
  }

  try {
    const result = await auth.api.resetPassword({
      body: {
        newPassword: password,
        token,
      },
    });

    return result.status
      ? { success: true }
      : { success: false, error: "This password reset link is invalid or expired." };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to reset your password.";
    console.error("Reset password error:", message);
    return { success: false, error: message };
  }
}