export function getDomain () {
  if (process.env.NODE_ENV === 'production') {
    return 'https://magic-auth-race.vercel.app'
  } else {
    return 'http://localhost:3000'
  }
}

export function toAbsoluteUrl (relativeUrl) {
  const url = `${getDomain()}${relativeUrl}`
  return url
}
