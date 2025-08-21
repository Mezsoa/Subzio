import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Disable built‑in optimization to avoid 400s when sharp/squoosh isn't available in the build env
    unoptimized: true,
  },
};

export default nextConfig;
