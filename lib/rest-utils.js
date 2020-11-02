export function createHandlers (handlers) {
  return async (req, res) => {
    const handler = handlers[req.method]
    if (handler) {
      try {
        await handler(req, res)
      } catch (err) {
        res.status(err.status || 500).end(err.message)
      }
    } else {
      res.setHeader('Allow', Object.keys(handlers))
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  }
}
