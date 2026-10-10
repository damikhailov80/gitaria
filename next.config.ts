import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Не создавать AGENTS.md при запуске next dev
  agentRules: false,
};

export default nextConfig;
