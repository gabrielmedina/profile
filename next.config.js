module.exports = {
  images: {
    formats: ['image/webp'],
    domains: ['avatars.githubusercontent.com', 'localhost']
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
}