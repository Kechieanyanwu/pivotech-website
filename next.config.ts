import type { NextConfig } from "next";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const nextConfig: NextConfig = {
  images: {
    remotePatterns:
      projectId && dataset
        ? [
            {
              protocol: "https",
              hostname: "cdn.sanity.io",
              pathname: `/images/${projectId}/${dataset}/**`,
            },
          ]
        : [],
  },
};

export default nextConfig;
