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
    // Add additional webpack configuration
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src'),
    };
    
    // Add additional module resolution paths
    config.resolve.modules.push(path.resolve('./src'));
    
    // Enable detailed error messages
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

module.exports = withVercelToolbar(nextConfig);