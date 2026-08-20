import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Allows production builds to complete even if your project has type errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // Allows production builds to complete even if your project has ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;