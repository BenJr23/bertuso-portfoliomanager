"use client";

import Link from "next/link";
import { Suspense, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/app/_actions/forgetpassword/forgetpassword";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-slate-300">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? undefined;
  const hasInvalidToken = searchParams.get("error") === "INVALID_TOKEN";
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(
    hasInvalidToken ? "This password reset link is invalid or expired." : null,
  );
  const [isComplete, setIsComplete] = useState(false);

  function handleSubmit(formData: FormData) {
    const password = String(formData.get("password") ?? "");
    const confirmation = String(formData.get("confirmation") ?? "");

    setError(null);
    if (password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }

    startTransition(async () => {
      const result = await resetPassword(password, token ?? "");

      if (!result.success) {
        setError(result.error ?? "Unable to reset your password.");
        return;
      }

      setIsComplete(true);
    });
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-10 sm:px-10 lg:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_28%),linear-gradient(180deg,_rgba(2,6,23,0.96),_rgba(8,17,31,1))]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-2xl items-center justify-center">
        <div className="w-full rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-[0_30px_80px_rgba(2,6,23,0.7)] backdrop-blur-2xl sm:p-10">
          {isComplete ? (
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Password updated</p>
                <h1 className="text-3xl font-semibold text-white">You&apos;re all set.</h1>
                <p className="text-sm leading-6 text-slate-300">
                  Your password has been changed. Sign in with your new password to access your portfolio.
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-4 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Account recovery</p>
                <h1 className="text-3xl font-semibold text-white">Choose a new password</h1>
                <p className="max-w-xl text-sm leading-6 text-slate-300">
                  Create a new password for your Bertuso portfolio workspace.
                </p>
              </div>

              <form action={handleSubmit} className="mt-8 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="password">
                    New password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    placeholder="At least 8 characters"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-white/[0.08]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="confirmation">
                    Confirm new password
                  </label>
                  <input
                    id="confirmation"
                    name="confirmation"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    placeholder="Enter your new password again"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-white/[0.08]"
                  />
                </div>

                {error ? (
                  <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200" role="alert">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={isPending || !token || hasInvalidToken}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-4 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? "Updating password..." : "Update password"}
                </button>
              </form>

              <div className="mt-6 text-sm text-slate-400">
                <Link href="/" className="font-medium text-emerald-300 transition hover:text-emerald-200">
                  Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
