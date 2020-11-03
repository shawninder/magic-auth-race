import { magic } from '../../lib/magic'
import { getSession, removeSession } from '../../lib/auth-cookies'
import { createHandlers } from '../../lib/rest-utils'
import { Login } from '../../models/login'

const handlers = {
  GET: async (req, res) => {
    const { token, issuer } = await getSession(req)
    const loginModel = new Login()

    await Promise.all([
      magic.users.logoutByIssuer(issuer),
      loginModel.invalidateFaunaDBToken(token)
    ])

    removeSession(res)

    res.writeHead(302)
    res.end()
  }
}

export default function logout (req, res) {
  const handler = createHandlers(handlers)
  return handler(req, res)
}
