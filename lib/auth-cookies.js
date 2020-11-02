import { serialize, parse } from 'cookie'
import get from 'lodash.get'
import { encrypt, decrypt } from './iron'

const TOKEN_NAME = 'MAGIC_AUTH_PERF_SESSION'
const MAX_AGE = 60 * 60 // in seconds

function parseCookies (req) {
  // For API Routes we don't need to parse the cookies.
  if (req.cookies) {
    return req.cookies
  }

  // For pages we do need to parse the cookies.
  const cookie = get(req, 'headers.cookie')
  return parse(cookie || '')
}

export async function createSession (res, data) {
  const encryptedToken = await encrypt(data)

  const cookie = serialize(TOKEN_NAME, encryptedToken, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax'
  })

  res.setHeader('Set-Cookie', cookie)
}

export async function getSession (req) {
  const cookies = parseCookies(req)
  return decrypt(get(cookies, TOKEN_NAME))
}

export function removeSession (res) {
  const cookie = serialize(TOKEN_NAME, '', {
    maxAge: -1,
    path: '/'
  })

  res.setHeader('Set-Cookie', cookie)
}
