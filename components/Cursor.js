import styles from '../styles/Cursor.module.css'

export default function Cursor ({ viewBox, elapsed, X, lineHeight, strokeWidth }) {
  const x = X(X(elapsed))
  return (
    <g
      className={styles.cursor}
      transform={`translate(${x})`}
    >
      <path
        d={`M${viewBox.x},0L${viewBox.x},${lineHeight}`}
        stroke='deepskyblue'
        strokeWidth={3 * strokeWidth}
        opacity={0.8}
      />
    </g>
  )
}
