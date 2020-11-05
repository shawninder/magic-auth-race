export default function Smiley ({ txt, x, y, correction = {} }) {
  const cx = correction.x || 0
  const cy = (correction.y || 0) + 6
  return (
    <text
      x={x}
      y={y}
      fill='white'
      textAnchor='middle'
      transform={`translate(${cx}, ${cy})`}
      fontSize='24px'
    >
      {txt}
    </text>
  )
}
