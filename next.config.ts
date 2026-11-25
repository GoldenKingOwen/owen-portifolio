import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/cv/OwenCV.pdf", destination: "/cv/Owen-Matola-CV.pdf", permanent: true }];
  },
};

export default nextConfig;
