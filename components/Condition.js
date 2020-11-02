export default function Condition ({ ready, fallback, children }) {
  return ready ? children : fallback
}
