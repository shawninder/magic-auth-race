import { magic } from '../../lib/magic'
import { getSession, removeSession } from '../../lib/auth-cookies'
import { createHandlers } from '../../lib/rest-utils'
import { Login } from '../../models/login'

const handlers = {
  GET: async (req, res) => {
    const { token, issuer } = await getSession(req)

    const loginModel = new Login(token)

    try {
      await Promise.all([
        magic.users.logoutByIssuer(issuer),
        loginModel.invalidateFaunaDBToken(token)
      ])
    } catch (ex) {
      if (ex.name === 'Unauthorized') {
        // ignore
      } else {
        console.error('Logout error', ex)
      }
    }
    removeSession(res)
    res.status(302).end()
  }
}

export default function logout (req, res) {
  const handler = createHandlers(handlers)
  return handler(req, res)
}
