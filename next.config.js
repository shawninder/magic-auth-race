module.exports = {
  images: {
    domains: [
      process.env.NODE_ENV === 'production'
        ? 'magic-auth-race.vercel.app'
        : 'localhost'
    ]
  }
}
