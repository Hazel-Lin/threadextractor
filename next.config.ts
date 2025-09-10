import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/proxy-image**',
      },
      {
        protocol: 'https',
        hostname: 'scontent-*.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: '*.threads.net',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      }
    ],
  },
  // Environment variables configuration
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
  // Webpack configuration to handle optional dependencies
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    // Ignore optional drizzle-orm dependency in rate-limiter-flexible
    config.externals = config.externals || []
    config.externals.push({
      'drizzle-orm': 'drizzle-orm'
    })
    
    return config
  },
};

export default nextConfig;
