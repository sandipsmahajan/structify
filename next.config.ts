import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client"],
  experimental: {
    // @ts-expect-error -- allowedHosts runtime feature, TS types not current
    allowedHosts: [".monkeycode-ai.live"],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...config.externals as string[],
        { "node:path": "commonjs node:path" },
        { "node:fs": "commonjs node:fs" },
        { "node:os": "commonjs node:os" },
        { "node:crypto": "commonjs node:crypto" },
        { "node:module": "commonjs node:module" },
        { "node:url": "commonjs node:url" },
        { "node:process": "commonjs node:process" },
        { "node:buffer": "commonjs node:buffer" },
      ];
    }
    return config;
  },
};

export default nextConfig;
