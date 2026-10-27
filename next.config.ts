import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [
      {
        source: '/assuntos/estado',
        destination: '/assuntos/react',
        permanent: true,
      },
      {
        source: '/assuntos/tanstack-query',
        destination: '/assuntos/react',
        permanent: true,
      },
      {
        source: '/assuntos/nx',
        destination: '/assuntos/monorepos',
        permanent: true,
      },
      {
        source: '/assuntos/mentoria',
        destination: '/assuntos/lideranca-tecnica',
        permanent: true,
      },
      {
        source: '/assuntos/breaking-changes',
        destination: '/assuntos/design-system',
        permanent: true,
      },
    ]
  },
  experimental: {
    agentUpgrade: 'latest',
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
}

export default nextConfig
