import get from 'lodash.get'
import { q, adminClient, getClient } from '../lib/faunadb'

export class User {
  async createUser (email) {
    return adminClient.query(q.Create(q.Collection('users'), {
      data: { email }
    }))
  }

  async getUserByEmail (email) {
    return adminClient.query(
      q.Get(q.Match(q.Index('users_by_email'), email))
    ).catch(() => undefined)
  }

  async obtainFaunaDBToken (user) {
    return adminClient.query(
      q.Create(q.Tokens(), { instance: q.Select('ref', user) })
    )
      .then((res) => {
        return get(res, 'secret')
      })
      .catch(() => undefined)
  }

  async invalidateFaunaDBToken (token) {
    await getClient(token).query(q.Logout(true))
  }
}
