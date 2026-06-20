import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseUrl ? [new URL(supabaseUrl)] : [],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // Increase from default 1mb
    },
  },
};

export default nextConfig;
