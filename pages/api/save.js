import { getSession } from '../../lib/auth-cookies'
import { createHandlers } from '../../lib/rest-utils'
import { Login } from '../../models/login'

const handlers = {
  POST: async (req, res) => {
    const { email, token } = await getSession(req)

    const { totalTime } = req.body

    const loginModel = new Login(token)
    const login = await loginModel.createLogin({ email, totalTime })

    res.status(201).send(login)
  }
}

export default function login (req, res) {
  const handler = createHandlers(handlers)
  return handler(req, res)
}
