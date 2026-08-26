import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Firebase Admin loads CommonJS auth dependencies that must remain in Node's
  // native resolver instead of being bundled by Turbopack.
  serverExternalPackages: ["firebase-admin", "google-auth-library", "jwks-rsa"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
};

export default nextConfig;
