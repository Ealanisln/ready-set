/** @type {import('next').NextConfig} */
const path = require('path');
const withVercelToolbar = require('@vercel/toolbar/plugins/next');

const nextConfig = {
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
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src'),
    };
    
    config.resolve.modules.push(path.resolve('./src'));
    
    config.stats = {
      errorDetails: true
    };

    // Add fallback for fs module
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    return config;
  },
};

module.exports = nextConfig;
