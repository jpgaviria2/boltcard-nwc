/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produce a minimal standalone Node.js server output in .next/standalone
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    unoptimized: true
  },
  async rewrites() {
    return [
      {
        source: '/.well-known/lnurlp/:username',
        destination: '/api/lud16/:username'
      }
    ]
  }
}

export default nextConfig
