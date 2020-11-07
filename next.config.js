const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})
module.exports = withBundleAnalyzer({
  images: {
    domains: [
      process.env.NODE_ENV === 'production'
        ? 'magic-auth-race.vercel.app'
        : 'localhost'
    ]
  }
})
