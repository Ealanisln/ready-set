import type { NextConfig } from 'next';
import path from 'path';
import type { Configuration as WebpackConfiguration } from 'webpack';
import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
  experimental: {
    // Add Turbopack configuration
    turbo: {
      // Set memory limit to 1GB (1073741824 bytes)
      memoryLimit: 1073741824,
      // Optional: Configure module ID strategy for better caching in dev
      moduleIdStrategy: 'named',
      // Add any other Turbopack specific configuration if needed
    },
  },
  async rewrites() {
    return [
      {
        source: "/admin/orders/:order_number",
        destination: "/admin/orders/[order_number]",
      },
    ];
  },
  webpack: (config: WebpackConfiguration) => {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@': path.join(__dirname, 'src'),
      },
      modules: [
        ...(config.resolve?.modules || []),
        path.resolve('./src')
      ],
      fallback: {
        ...config.resolve?.fallback,
        fs: false,
      }
    };

    config.stats = {
      errorDetails: true
    };

    return config;
  },
};

export default bundleAnalyzer(nextConfig);