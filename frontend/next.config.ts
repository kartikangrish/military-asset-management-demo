import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for easier deployment
  output: 'standalone',
  
  // Environment variables configuration
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  },
  
  // Image optimization for deployment
  images: {
    unoptimized: true
  }
};

export default nextConfig;
