import type { NextConfig } from 'next';
import path from 'path';
import type { Configuration as WebpackConfiguration } from 'webpack';

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

export default nextConfig;