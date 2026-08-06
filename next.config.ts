import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client"],
  experimental: {
    // @ts-expect-error
    allowedHosts: [".monkeycode-ai.live"],
  },
  turbopack: {},
};

export default nextConfig;
