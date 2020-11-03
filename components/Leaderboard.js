import Condition from '../components/Condition'
import LeaderboardLoader from '../components/LeaderboardLoader'
import LoginStats from '../components/LoginStats'

import styles from '../styles/Leaderboard.module.css'

function Leaderboard ({ initialized, loading, logins }) {
  return (
    <div className={styles.leaderboard}>
      <Condition
        ready={initialized}
        fallback={<LeaderboardLoader />}
      >
        <LoginStats logins={logins} />
      </Condition>
    </div>
  )
}

export default Leaderboard
