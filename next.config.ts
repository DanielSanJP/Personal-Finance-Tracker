import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Suppress the warning about Supabase realtime dependency
    config.ignoreWarnings = [
      {
        module: /node_modules\/@supabase\/realtime-js/,
        message: /Critical dependency: the request of a dependency is an expression/,
      },
    ];
    return config;
  },
  // Turbopack configuration for development (now stable)
  turbopack: {
    rules: {
      // Add any custom Turbopack rules here if needed
    },
    resolveAlias: {
      // Add any resolve aliases here if needed
    },
  },
};

export default nextConfig;
