import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for easier deployment
  output: 'standalone',
  
  // Environment variables configuration
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-0dc3.up.railway.app',
  },
  
  // Image optimization for deployment
  images: {
    unoptimized: true
  },
  
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Disable authentication requirements
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow'
          }
        ],
      },
    ];
  }
};

export default nextConfig;
