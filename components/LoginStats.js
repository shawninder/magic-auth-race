function LoginStats ({ logins }) {
  const stats = logins.reduce((_stats, time) => {
    const newCount = _stats.count + 1
    const newSum = _stats.sum + time
    return {
      count: _stats.count + 1,
      sum: newSum,
      min: time < _stats.min ? time : _stats.min,
      max: time > _stats.max ? time : _stats.max,
      avg: newSum / newCount
    }
  }, {
    count: 0,
    sum: 0,
    min: 9999999999,
    max: 0,
    avg: 0
  })
  return (
    <pre style={{ textAlign: 'left' }}>
      {JSON.stringify(stats, null, 2)}
    </pre>
  )
}
export default LoginStats
