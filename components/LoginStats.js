function LoginStats (stats) {
  return (
    <pre style={{ textAlign: 'left' }}>
      {JSON.stringify(stats, null, 2)}
    </pre>
  )
}
export default LoginStats
