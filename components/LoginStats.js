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

  function toX (val) {
    return 100 * val / stats.max
  }

  return (
    <div>
      <svg>
        {logins.map((time, idx) => {
          const transform = `translateX(${100 * time / stats.max}%)`
          return (
            <path
              key={idx}
              d='M1,0L1,100'
              stroke='rgba(255, 255, 255, 0.3)'
              strokeWidth='2'
              style={{
                transform
              }}
            />
          )
        })}
        <Smiley
          txt='😀'
          x={`${toX(stats.min)}%`}
          y={20}
        />
        <text
          x={`${toX(stats.min)}%`}
          y={20}
          fill='white'
          transform='translate(8, 6)'
        >
          {Math.round(stats.min)}ms (High score!)
        </text>
        <Smiley
          txt='😐'
          x={`${toX(stats.avg)}%`}
          y={40}
        />
        <text
          x={`${toX(stats.avg)}%`}
          y={40}
          fill='white'
          transform='translate(0, 20)'
          textAnchor='middle'
        >
          {Math.round(stats.avg)}ms (average)
        </text>
        <Smiley
          txt='🤫'
          x={`${toX(stats.max)}%`}
          y={60}
          correction={{
            x: -10
          }}
        />
        <text
          x={`${toX(stats.max)}%`}
          y={60}
          fill='white'
          transform='translate(-20, 4)'
          textAnchor='end'
        >
          {Math.round(stats.max)}ms
        </text>
      </svg>
      <style jsx>
        {`
          svg {
            width: 100%;
            min-width: 300px;
            height: 100px;
            background: black;
          }
        `}
      </style>
    </div>
  )
}
export default LoginStats

function Smiley ({ txt, x, y, correction = {} }) {
  const cx = correction.x || 0
  const cy = (correction.y || 0) + 6
  return (
    <text
      x={x}
      y={y}
      fill='white'
      textAnchor='middle'
      transform={`translate(${cx}, ${cy})`}
    >
      {txt}
    </text>
  )
}
