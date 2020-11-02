import { createHandlers } from '../../lib/rest-utils'
import { Login } from '../../models/login'

const handlers = {
  GET: async (req, res) => {
    try {
      const loginModel = new Login()
      const stats = await loginModel.getStats()
      res.status(200).send({ stats })
    } catch (ex) {
      console.error('Unable to get login stats', ex)
    }
  }
}

export default function loginStats (req, res) {
  const handler = createHandlers(handlers)
  return handler(req, res)
}
