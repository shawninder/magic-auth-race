import Condition from '../components/Condition'
import LeaderboardLoader from '../components/LeaderboardLoader'
import LoginStats from '../components/LoginStats'

import styles from '../styles/Leaderboard.module.css'

function Leaderboard ({ initialized, loading, logins, highlight, label, animate }) {
  return (
    <div className={styles.container}>
      <Condition
        ready={initialized}
        fallback={<LeaderboardLoader />}
      >
        <LoginStats
          logins={logins}
          highlight={highlight}
          label={label}
          animate={animate}
        />
      </Condition>
    </div>
  )
}

export default Leaderboard
