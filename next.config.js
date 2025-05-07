/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    resolveAlias: {
      // Add any necessary aliases here
    }
  },
  // Remove webpack configuration if not needed
  webpack: undefined,
  
  // Add images configuration to allow Sanity.io domain
  images: {
    domains: ['cdn.sanity.io'],
  }
}

module.exports = nextConfig 