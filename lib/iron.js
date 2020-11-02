import Iron from '@hapi/iron'

const ENCRYPTION_SECRET = process.env.IRON_SECRET

export async function encrypt (data) {
  return data && Iron.seal(data, ENCRYPTION_SECRET, Iron.defaults)
}

export async function decrypt (data) {
  return data && Iron.unseal(data, ENCRYPTION_SECRET, Iron.defaults)
}
