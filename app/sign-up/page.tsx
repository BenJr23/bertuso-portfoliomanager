"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { signUp } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const result = await signUp.email({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error.message ?? "Unable to create your account.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-10 sm:px-10 lg:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_28%),linear-gradient(180deg,_rgba(2,6,23,0.96),_rgba(8,17,31,1))]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-2xl items-center justify-center">
        <div className="w-full rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-[0_30px_80px_rgba(2,6,23,0.7)] backdrop-blur-2xl sm:p-10">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Create account</p>
            <h1 className="text-3xl font-semibold text-white">Set up your portfolio workspace</h1>
            <p className="max-w-xl text-sm leading-6 text-slate-300">
              Create an operator account for your dashboard and start tracking every portfolio from one place.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Avery Morgan"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-white/[0.08]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@firm.com"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-white/[0.08]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="At least 8 characters"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-white/[0.08]"
              />
            </div>

            {error ? (
              <p className="sm:col-span-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="sm:col-span-2 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-4 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
            <span>Already have access?</span>
            <Link href="/" className="font-medium text-emerald-300 transition hover:text-emerald-200">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}