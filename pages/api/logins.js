import { createHandlers } from '../../lib/rest-utils'
import { Login } from '../../models/login'

const handlers = {
  GET: async (req, res) => {
    try {
      const loginModel = new Login()
      const logins = await loginModel.getAll()
      res.status(200).send(logins && logins.data)
    } catch (ex) {
      res.status(500).send({ ex: ex.ToString(), logins: [] })
    }
  }
}

export default function loginStats (req, res) {
  const handler = createHandlers(handlers)
  return handler(req, res)
}
