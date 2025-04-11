/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    resolveAlias: {
      // Add any necessary aliases here
    }
  },
  // Remove webpack configuration if not needed
  webpack: undefined
}

module.exports = nextConfig 