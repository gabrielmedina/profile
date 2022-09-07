module.exports = {
  images: {
    formats: ['image/webp'],
    domains: ['avatars.githubusercontent.com', 'localhost'],
  },
  pageExtensions: ['page.tsx', 'api.ts'],
  webpack(config) {
    config.resolve.fallback = { fs: false }

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
}
