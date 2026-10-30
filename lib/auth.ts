import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";

const trustedOrigin = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

async function sendResetPasswordEmail({
  user,
  url,
}: {
  user: { email: string; name: string };
  url: string;
}) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM) {
    throw new Error(
      "Password reset email is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM.",
    );
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: SMTP_FROM,
    to: user.email,
    subject: "Reset your Bertuso password",
    text: [
      `Hi ${user.name},`,
      "",
      "We received a request to reset your Bertuso password.",
      `Open this link to choose a new password: ${url}`,
      "",
      "If you did not request this, you can safely ignore this email.",
    ].join("\n"),
  });
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: sendResetPasswordEmail,
  },
  trustedOrigins: [trustedOrigin],
});