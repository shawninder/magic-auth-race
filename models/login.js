import { q, adminClient, getClient } from '../lib/faunadb'

export class Login {
  constructor (token) {
    if (token) {
      this.client = getClient(token)
    }
  }

  async createLogin ({ email, totalTime }) {
    return adminClient.query(q.Create(q.Collection('logins'), {
      data: {
        user: q.Select(
          'ref',
          q.Get(
            q.Match(
              q.Index('users_by_email'),
              email
            )
          )
        ),
        totalTime
      }
    }))
  }

  async getStats () {
    const total = q.Count(q.Documents(q.Collection('logins')))
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
  }
}
