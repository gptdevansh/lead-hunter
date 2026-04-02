import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a minimal `standalone` output used by the Docker image.
  // See: https://nextjs.org/docs/app/api-reference/next-config-js/output
  output: "standalone",
};

export default nextConfig;
