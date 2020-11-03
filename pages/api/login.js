import { magic } from '../../lib/magic'
import { createSession } from '../../lib/auth-cookies'
import { createHandlers } from '../../lib/rest-utils'
import { Login } from '../../models/login'

const handlers = {
  POST: async (req, res) => {
    const didToken = magic.utils.parseAuthorizationHeader(req.headers.authorization)
    const { email, issuer } = await magic.users.getMetadataByToken(didToken)

    const loginModel = new Login()
    const login = await loginModel.createLogin({ email, t: 0 })
    const token = await loginModel.obtainFaunaDBToken(login)

    await createSession(res, { token, email, issuer })

    res.status(200).send(login)
  }
}

export default function login (req, res) {
  const handler = createHandlers(handlers)
  return handler(req, res)
}
