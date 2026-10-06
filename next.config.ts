import type { NextConfig } from "next";

const s3Host =
  process.env.S3_BUCKET?.trim() && process.env.S3_REGION?.trim()
    ? `${process.env.S3_BUCKET.trim()}.s3.${process.env.S3_REGION.trim()}.amazonaws.com`
    : null;

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    // Image uploads go through a Server Action. The default 1 MB limit
    // throws before the action runs and crashes the admin page.
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: s3Host
      ? [{ protocol: "https", hostname: s3Host }]
      : [],
  },
  async redirects() {
    return [
      {
        source: "/manage",
        destination: "/admin",
        permanent: true,
      },
      {
        source: "/manage/:path*",
        destination: "/admin/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
