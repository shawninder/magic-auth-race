import fetch from 'node-fetch'

export default function jsonFetcher (opts = { expectedStatus: 200 }) {
  const { expectedStatus } = opts
  return async (url) => {
    const res = await fetch(url)
    try {
      if (res.status === expectedStatus) {
        const json = await res.json()
        return json || null
      } else {
        console.error(`expected ${expectedStatus}, but res.status is`, res.status)
        return null
      }
    } catch (ex) {
      console.error('await res.json() exception', ex)
      try {
        const txt = await res.text()
        console.error('... await res.text()', txt)
      } catch (ex) {
        console.error('... await res.text() exception', ex)
      }
      return null
    }
  }
}
