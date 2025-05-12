import fs from 'fs';
import path from 'path';
import type { NextConfig } from 'next';
import type { Configuration as WebpackConfiguration } from 'webpack';
import withBundleAnalyzer from '@next/bundle-analyzer';
import { withHighlightConfig } from '@highlight-run/next/config';

interface PackageJson {
  name: string;
  version: string;
}

// Read package.json to get version
const pkgJsonPath = path.join(process.cwd(), 'package.json');
const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8')) as PackageJson;
const appVersion = pkgJson.version;

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
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
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "vercel.com",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
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
  webpack: (config: WebpackConfiguration, { isServer, webpack }) => {
    // Configure webpack resolution
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

    // Enable more detailed error messages in webpack
    config.stats = {
      errorDetails: true
    };

    // Fix serialization of large strings in cache
    if (config.cache && typeof config.cache === 'object') {
      // For webpack caching - improve serialization performance
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
        cacheDirectory: path.resolve('.next/cache'),
        compression: 'gzip',
        // Standard options without custom ones that cause type errors
      };
    }

    // Add MDX support
    config.module?.rules?.push({
      test: /\.mdx?$/,
      use: [
        {
          loader: '@mdx-js/loader',
          /** @type {import('@mdx-js/loader').Options} */
          options: {},
        },
      ],
    });

    // Inject app version
    config.plugins?.push(
      new webpack.DefinePlugin({
        'process.env.APP_VERSION': JSON.stringify(appVersion),
      })
    );

    // Client-side source maps for error tracking
    if (!isServer) {
      config.devtool = 'source-map';
    }

    return config;
  },
  transpilePackages: ['ui'],
  distDir: 'dist',
  cleanDistDir: false,
  typescript: {
    tsconfigPath: "tsconfig.json",
  },
  productionBrowserSourceMaps: true,
  env: {
    APP_VERSION: appVersion,
    NEXT_PUBLIC_APP_VERSION: appVersion,
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  experimental: {
    instrumentationHook: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
    serverMinification: true,
  },
  // This property is compatible with Next.js 15
  serverExternalPackages: ['esbuild', '@highlight-run/node', 'require-in-the-middle'],
} as NextConfig;

// Need to handle async config properly
// @ts-ignore - Next.js types are not handling async configs correctly
export default bundleAnalyzer(
  withHighlightConfig(nextConfig, {
    uploadSourceMaps: true,
    configureHighlightProxy: true,
    apiKey: process.env.HIGHLIGHT_SOURCEMAP_UPLOAD_API_KEY,
    appVersion,
    serviceName: 'ready-set-frontend',
  })
);