import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  // Disable telemetry in production
  telemetry: false,
  // Optional: Add other performance optimizations
  experimental: {
    // Enable modern bundling for better performance
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
};

export default nextConfig;
