import { getSession } from '../../lib/auth-cookies'
import { createHandlers } from '../../lib/rest-utils'
import { Login } from '../../models/login'

const handlers = {
  POST: async (req, res) => {
    const { email, token } = await getSession(req)
    const { email: declared, t } = req.body
    if (email === declared) {
      const loginModel = new Login(token)
      const login = await loginModel.createLogin({ email, t })

      return res.status(201).send(login)
    } else {
      return res.status(403)
    }
  }
}

export default function login (req, res) {
  const handler = createHandlers(handlers)
  return handler(req, res)
}
