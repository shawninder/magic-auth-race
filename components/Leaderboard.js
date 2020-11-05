import { useRef } from 'react'

import Smiley from './svg/Smiley'

import styles from '../styles/Leaderboard.module.css'

const secondsLabel = 's'

function Leaderboard ({ initialized, loading, logins, highlight, label, animate }) {
  const svgRef = useRef(null)
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

  const highlightX = typeof highlight === 'number'
    ? toPercent(highlight)
    : highlight

  const duration = animate
    ? `${stats.max}ms`
    : '200ms'

  function toPercent (val) {
    return `${100 * val / stats.max}%`
  }

  function toSec (ms) {
    return Math.round(ms / 10) / 100
  }

  return (
    <div className={styles.container}>
      <svg ref={svgRef}>
        {logins.map((time, idx) => {
          const transform = `translateX(${
            (100 * time / stats.max) - (
              (idx === logins.length - 1) ? 1 : 0
            )
          }%)`

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
        <g
          className={styles.highlight}
          style={{
            transform: `translateX(${highlightX})`,
            transitionDuration: duration,
            transitionTimingFunction: animate ? 'linear' : 'ease'
          }}
        >
          <path
            d='M0,0l0,100'
            stroke='deepskyblue'
            strokeWidth={6}
            opacity={0.8}
          />
          <text
            className={styles.overlay}
            x={0}
            y={90}
            fill='deepskyblue'
            style={{
              transform: 'translateX(0.8rem)',
              fontSize: 'larger'
            }}
          >
            {label}
          </text>
        </g>
        <Smiley
          txt='😀'
          x={toPercent(stats.min)}
          y={20}
          correction={{
            x: 10
          }}
        />
        <text
          className={styles.overlay}
          x={toPercent(stats.min)}
          y={20}
          fill='white'
          transform='translate(28, 5)'
          style={{
            textShadow: '0px -1px 7px black'
          }}
        >
          {toSec(stats.min)}{secondsLabel}
        </text>
        <text
          className={styles.overlay}
          x={toPercent(stats.min)}
          y={20}
          fill='chartreuse'
          transform='translate(120, 5)'
        >
          High score!
        </text>
        High score!
        <Smiley
          txt='😐'
          x={toPercent(stats.avg)}
          y={50}
        />
        <text
          className={styles.overlay}
          x={toPercent(stats.avg)}
          y={50}
          fill='white'
          transform='translate(15, 5)'
          textAnchor='start'
        >
          {toSec(stats.avg)}{secondsLabel}
        </text>
        <text
          className={styles.overlay}
          x={toPercent(stats.avg)}
          y={50}
          fill='gold'
          transform='translate(120, 5)'
          textAnchor='start'
        >
          average
        </text>
        <Smiley
          txt='🤫'
          x={toPercent(stats.max)}
          y={80}
          correction={{
            x: -20
          }}
        />
        <text
          className={styles.overlay}
          x={toPercent(stats.max)}
          y={80}
          fill='tomato'
          transform='translate(-30, 5)'
          textAnchor='end'
        >
          {toSec(stats.max)}{secondsLabel}...
        </text>
      </svg>
    </div>
  )
}

export default Leaderboard
