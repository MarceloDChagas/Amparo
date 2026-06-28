import type { NextConfig } from "next";

// Backend reachable from inside the frontend container (compose service name).
// Overridable for other setups (e.g. local dev: http://127.0.0.1:3001).
const BACKEND_INTERNAL_URL =
  process.env.BACKEND_INTERNAL_URL || "http://backend:3000";

const nextConfig: NextConfig = {
  output: "standalone",
  // Same-origin proxy: the browser only ever talks to the frontend, which
  // forwards /api/* to the backend. This avoids CORS entirely and — crucially —
  // lets a single HTTPS tunnel expose the whole app to a phone (geolocation
  // requires a secure context, which only the tunnel/localhost provides).
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_INTERNAL_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
