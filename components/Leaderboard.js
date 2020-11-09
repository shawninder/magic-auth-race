import Cursor from './Cursor'

import styles from '../styles/Leaderboard.module.css'

// const secondsLabel = 's'

function Leaderboard ({ logins, elapsed }) {
  // function toPercent (val) {
  //   return `${100 * val / stats.max}%`
  // }

  // function toSec (ms) {
  //   return Math.round(ms / 10) / 100
  // }

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
    avg: 0,
    std: 0
  })
  stats.std = Math.sqrt(logins.reduce((std, time) => {
    return (time - stats.avg) * (time - stats.avg) / stats.count
  }, 0))

  function X (x) {
    return x <= 0 ? 0 : Math.log(x)
  }

  const lineHeight = 100
  const pixelWidth = stats.min / stats.max
  const strokeWidth = 2 * pixelWidth

  const viewBoxWidth = X(stats.max) - X(stats.min)

  const viewBox = {
    x: X(stats.min) - 0.02 * viewBoxWidth,
    y: lineHeight / 2,
    width: 1.04 * viewBoxWidth,
    height: 1
  }

  return (
    <div className={styles.container}>
      <svg
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        width='100%'
        height='100%'
      >
        {logins.map((time, idx) => {
          const x = X(time)
          return (
            <path
              key={idx}
              d={`M${x},0L${x},${lineHeight}`}
              stroke={
                time === stats.max ? 'tomato'
                  : time === stats.min ? 'chartreuse'
                    : 'black'
              }
              strokeWidth={strokeWidth}
              opacity={0.7}
            />
          )
        })}
        <Cursor
          X={X}
          viewBox={viewBox}
          elapsed={elapsed}
          lineHeight={lineHeight}
          strokeWidth={strokeWidth}
        />
        <rect
          x={X(stats.avg)}
          y={0}
          width={3 * strokeWidth}
          height={3 * strokeWidth}
          stroke='none'
          fill='gold'
        />
        <path
          d={`M${X(stats.avg - stats.std)},${strokeWidth / 2}L${X(stats.avg + stats.std)},${strokeWidth / 2}`}
          stroke='gold'
          strokeWidth={strokeWidth}
        />
      </svg>
    </div>
  )
}
// <text
//   className={styles.overlay}
//   x={0}
//   y={90}
//   fill='deepskyblue'
//   style={{
//     transform: 'translateX(0.8rem)',
//     fontSize: 'larger'
//   }}
// >
//   {label}
// </text>
// <Smiley
//   txt='😀'
//   x={toPercent(stats.min)}
//   y={20}
//   correction={{
//     x: 10
//   }}
// />
// <text
//   className={styles.overlay}
//   x={toPercent(stats.min)}
//   y={20}
//   fill='white'
//   transform='translate(28, 5)'
//   style={{
//     textShadow: '0px -1px 7px black'
//   }}
// >
//   {toSec(stats.min)}{secondsLabel}
// </text>
// <text
//   className={styles.overlay}
//   x={toPercent(stats.min)}
//   y={20}
//   fill='chartreuse'
//   transform='translate(120, 5)'
// >
//   High score!
// </text>
// High score!
// <Smiley
//   txt='😐'
//   x={toPercent(stats.avg)}
//   y={50}
// />
// <text
//   className={styles.overlay}
//   x={toPercent(stats.avg)}
//   y={50}
//   fill='white'
//   transform='translate(15, 5)'
//   textAnchor='start'
// >
//   {toSec(stats.avg)}{secondsLabel}
// </text>
// <circle cx={toPercent(stats.avg - stats.std)} cy={50} r={10} fill='white' />
// <circle cx={toPercent(stats.avg + stats.std)} cy={50} r={10} fill='white' />
// <path
//   d={`M${toPercent(stats.avg - stats.std)},50L${toPercent(stats.avg + stats.std)}`}
//   stroke='red'
//   strokeWidth={3}
// />
// <text
//   className={styles.overlay}
//   x={toPercent(stats.avg)}
//   y={50}
//   fill='gold'
//   transform='translate(120, 5)'
//   textAnchor='start'
// >
//   average
// </text>
// <Smiley
//   txt='🤫'
//   x={toPercent(stats.max)}
//   y={80}
//   correction={{
//     x: -20
//   }}
// />
// <text
//   className={styles.overlay}
//   x={toPercent(stats.max)}
//   y={80}
//   fill='tomato'
//   transform='translate(-30, 5)'
//   textAnchor='end'
// >
//   {toSec(stats.max)}{secondsLabel}...
// </text>

export default Leaderboard
