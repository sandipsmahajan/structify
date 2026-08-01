import type { NextConfig } from "next";

const nextConfig = {
  experimental: {
    allowedHosts: [".monkeycode-ai.live"]
  }
} as NextConfig;

export default nextConfig;
