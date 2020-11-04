import fetch from 'node-fetch'
import get from 'lodash.get'

export default function jsonFetcher (selector) {
  return async (url) => {
    const res = await fetch(url)
    try {
      const json = await res.json()
      return selector
        ? get(json, selector, null)
        : (json || null)
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
