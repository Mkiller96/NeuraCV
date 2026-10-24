import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === "production"
          ? "https://neuracy-api.onrender.com/api"
          : "http://localhost:8000/api")}/:path*`,
      },
    ];
  },
};

export default nextConfig;
