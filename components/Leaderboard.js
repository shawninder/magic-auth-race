import Condition from '../components/Condition'
import LeaderboardLoader from '../components/LeaderboardLoader'
import LoginStats from '../components/LoginStats'

function Leaderboard ({ initialized, loading, stats }) {
  return (
    <Condition
      ready={initialized}
      fallback={<LeaderboardLoader />}
    >
      <LoginStats {...stats} />
    </Condition>
  )
}

export default Leaderboard
