import { createHandlers } from '../../lib/rest-utils'
import { Login } from '../../models/login'

const handlers = {
  HEAD: (req, res) => {
    res.status(200)
  },
  GET: async (req, res) => {
    try {
      const loginModel = new Login()
      const logins = await loginModel.getAll()
      console.log('===logins', logins)
      console.error('===logins', logins)
      res.status(200).send(logins && logins.data)
    } catch (ex) {
      console.log('ex', ex)
      console.error('ex', ex)
      res.status(500).send({ ex: ex.ToString(), logins: [] })
    }
  }
}

export default function loginStats (req, res) {
  const handler = createHandlers(handlers)
  return handler(req, res)
}
