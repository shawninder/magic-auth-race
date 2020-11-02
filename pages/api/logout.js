import { magic } from '../../lib/magic'
import { getSession, removeSession } from '../../lib/auth-cookies'
import { createHandlers } from '../../lib/rest-utils'
import { User } from '../../models/user'

const handlers = {
  GET: async (req, res) => {
    const { token, issuer } = await getSession(req)
    const userModel = new User()

    await Promise.all([
      magic.users.logoutByIssuer(issuer),
      userModel.invalidateFaunaDBToken(token)
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
