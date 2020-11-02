import { magic } from '../../lib/magic'
import { createSession } from '../../lib/auth-cookies'
import { createHandlers } from '../../lib/rest-utils'
import { User } from '../../models/user'

const handlers = {
  POST: async (req, res) => {
    const didToken = magic.utils.parseAuthorizationHeader(req.headers.authorization)
    const { email, issuer } = await magic.users.getMetadataByToken(didToken)

    const userModel = new User()
    let user = await userModel.getUserByEmail(email)
    if (!user) {
      user = await userModel.createUser(email)
    }
    const token = await userModel.obtainFaunaDBToken(user)

    await createSession(res, { token, email, issuer })

    res.status(200).send(user)
  }
}

export default function login (req, res) {
  const handler = createHandlers(handlers)
  return handler(req, res)
}
