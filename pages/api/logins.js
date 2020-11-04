import { Login } from '../../models/login'

export default async (req, res) => {
  try {
    const loginModel = new Login()
    const logins = await loginModel.getAll()
    res.status(200).send(logins && logins.data)
  } catch (ex) {
    res.status(500).send({ ex: ex.ToString(), logins: [] })
  }
}
