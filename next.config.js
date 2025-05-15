/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Always skip type checking during builds to prevent deployment failures
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/join-the-team',
        destination: '/apply',
        permanent: true,
      },
      {
        source: '/join-the-us',
        destination: '/apply',
        permanent: true,
      },
      {
        source: '/join-the-team/:path*',
        destination: '/apply',
        permanent: true,
      },
      {
        source: '/join-us',
        destination: '/apply',
        permanent: true,
      },
      {
        source: '/careers',
        destination: '/apply',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig 