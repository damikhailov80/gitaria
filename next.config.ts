import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Не создавать AGENTS.md при запуске next dev
  agentRules: false,
  // Превью видео YouTube в карточках материалов
  images: {
    remotePatterns: [new URL("https://i.ytimg.com/vi/**")],
  },
  experimental: {
    agentUpgrade: "security",
  },
};

export default nextConfig;
