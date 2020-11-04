import styles from '../styles/Leaderboard.module.css'

const secondsLabel = 's'

function LoginStats ({ logins, highlight, label, animate }) {
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

  function toPercent (val) {
    return `${100 * val / stats.max}%`
  }
  function toSec (ms) {
    return Math.round(ms / 10) / 100
  }

  const highlightX = typeof highlight === 'number'
    ? toPercent(highlight)
    : highlight

  const duration = animate
    ? `${stats.max}ms`
    : '1ms'
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
          x={toPercent(stats.min)}
          y={20}
        />
        <text
          x={toPercent(stats.min)}
          y={20}
          fill='white'
          transform='translate(12, 5)'
        >
          {toSec(stats.min)}{secondsLabel}
        </text>
        <text
          x={toPercent(stats.min)}
          y={20}
          fill='chartreuse'
          transform='translate(65, 5)'
        >
          High score!
        </text>
        High score!
        <Smiley
          txt='😐'
          x={toPercent(stats.avg)}
          y={45}
        />
        <text
          x={toPercent(stats.avg)}
          y={45}
          fill='white'
          transform='translate(0, 20)'
          textAnchor='middle'
        >
          {toSec(stats.avg)}{secondsLabel}
        </text>
        <text
          x={toPercent(stats.avg)}
          y={45}
          fill='gold'
          transform='translate(30, 20)'
          textAnchor='start'
        >
          (world average)
        </text>
        <Smiley
          txt='🤫'
          x={toPercent(stats.max)}
          y={80}
          correction={{
            x: -10
          }}
        />
        <text
          x={toPercent(stats.max)}
          y={80}
          fill='tomato'
          transform='translate(-20, 5)'
          textAnchor='end'
        >
          {toSec(stats.max)}{secondsLabel}...
        </text>
      </svg>
      <div
        className={styles.highlight}
        style={{
          transform: `translateX(${highlightX})`,
          transitionDuration: duration
        }}
      >
        <div />
        <p>{label}</p>
      </div>
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
