import { useState, useRef } from 'react'

export default function useTimer () {
  const raf = useRef(null)
  const animate = useRef(false)
  const startTimestamp = useRef(null)
  const elapsedRef = useRef(0)
  const [elapsed, setElapsed] = useState(0)

  function step (timestamp) {
    if (startTimestamp.current === null) {
      startTimestamp.current = timestamp
    }
    const newElapsed = timestamp - startTimestamp.current
    elapsedRef.current = newElapsed
    setElapsed(newElapsed)

    if (animate.current) {
      raf.current = window.requestAnimationFrame(step)
    } else {
      window.cancelAnimationFrame(raf.current)
    }
  }
  function startTimer () {
    animate.current = true
    startTimestamp.current = null
    raf.current = window.requestAnimationFrame(step)
  }
  function stopTimer () {
    animate.current = false
    return elapsedRef.current
  }
  function resetTimer () {
    elapsedRef.current = 0
    setElapsed(0)
  }
  return {
    startTimer,
    stopTimer,
    resetTimer,
    elapsed
  }
}
