import fetch from 'node-fetch'
import get from 'lodash.get'

export default function jsonFetcher (selector) {
  return async (url) => {
    const json = await fetch(url)
    let obj
    try {
      obj = await json.json()
      return selector
        ? get(obj, selector, null)
        : (obj || null)
    } catch (ex) {
      console.error('ex', ex, 'json', json)
      return null
    }
  }
}
