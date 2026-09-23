import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep verification builds separate when a development server is running.
  distDir: process.env.NEXT_BUILD_DIR || ".next",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ddragon.leagueoflegends.com",
      },
    ],
  },
};

export default nextConfig;
