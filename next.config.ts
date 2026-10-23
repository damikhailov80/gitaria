import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Don't create AGENTS.md when running next dev
  agentRules: false,
  // YouTube video thumbnails in material cards
  images: {
    remotePatterns: [new URL("https://i.ytimg.com/vi/**")],
  },
  experimental: {
    agentUpgrade: "security",
  },
};

export default nextConfig;
