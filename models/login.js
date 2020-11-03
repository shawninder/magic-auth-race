import get from 'lodash.get'
import { q, adminClient, getClient } from '../lib/faunadb'

export class Login {
  constructor (token) {
    if (token) {
      this.client = getClient(token)
    }
  }

  async obtainFaunaDBToken (login) {
    return adminClient.query(
      q.Create(q.Tokens(), { instance: q.Select('ref', login) })
    )
      .then((res) => {
        return get(res, 'secret')
      })
      .catch(() => undefined)
  }

  async invalidateFaunaDBToken (token) {
    await getClient(token).query(q.Logout(true))
  }

  async getAll () {
    return adminClient.query(
      q.Paginate(
        q.Match(
          q.Index('all_logins')
        )
      )
    )
  }

  async createLogin ({ email, t }) {
    if (!t) {
      return adminClient.query(q.Create(
        q.Collection('logins'), {
          data: {
            email,
            t: 0
          }
        })
      )
    }
    const untimed = await adminClient.query(
      q.Get(
        q.Match(q.Index('logins_by_email'), email, 0)
      )
    )
    if (untimed) {
      return adminClient.query(q.Update(
        q.Select(['ref'], q.Get(
          q.Match(q.Index('logins_by_email'), email, 0)
        )),
        {
          data: { t }
        }
      ))
    } else {
      return adminClient.query(q.Create(
        q.Collection('logins'), {
          data: {
            email,
            t
          }
        })
      )
    }
  }

  async getLoginsByEmail (email) {
    return adminClient.query(
      q.Paginate(
        q.Match(q.Index('logins_by_email'), email)
      )
    )
  }

  async getStats () {
    const total = q.Count(q.Documents(q.Collection('logins')))
    if (total > 0) {
      const time = q.Lambda(
        (acc, value) => q.Append(
          q.Select(
            ['data', 'totalTime'],
            q.Get(value)
          ),
          acc
        )
      )
      const sum = q.Lambda(
        (acc, value) => {
          return q.Add(
            acc,
            q.Select(
              ['data', 'totalTime'],
              q.Get(value)
            )
          )
        }
      )
      const avg = q.Divide(
        q.Reduce(
          sum,
          0,
          q.Match(q.Index('all_logins'))
        ),
        total
      )
      const min = q.Min(
        q.Reduce(
          time,
          [],
          q.Match(q.Index('all_logins'))
        )
      )
      const max = q.Max(
        q.Reduce(
          time,
          [],
          q.Match(q.Index('all_logins'))
        )
      )
      return adminClient.query(
        {
          total,
          avg,
          min,
          max
        }
      )
    } else {
      return {
        total: 0,
        avg: 0,
        min: 0,
        max: 0
      }
    }
  }
}
