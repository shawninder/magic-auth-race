import faunadb from 'faunadb'

export const q = faunadb.query

export function getClient (secret) {
  return new faunadb.Client({ secret })
}

export const adminClient = getClient(process.env.FAUNADB_SECRET_KEY)
