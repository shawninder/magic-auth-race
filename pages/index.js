import { useState } from 'react'
import Head from 'next/head'
import Leaderboard from '../components/Leaderboard'
import Login from '../components/Login'
import Footer from '../components/Footer'

import useUser from '../use/user'
import useLoginStats from '../use/loginStats'

import styles from '../styles/Home.module.css'

export default function Home () {
  const { user, logins, loading: userLoading } = useUser()
  const { loginStats, loading: loginStatsLoading, mutate: mutateStats } = useLoginStats()

  const [loggedIn, setLoggedIn] = useState(false)
  const [loginErr, setLoginErr] = useState({})

  const [totalTime, setTotalTime] = useState(null)

  const title = 'Magic Auth Race!'

  function addStats ({ totalTime }) {
    mutateStats(({ total, avg, min, max }) => {
      const newTotal = total + 1
      return {
        total: newTotal,
        avg: (avg * total + totalTime) / newTotal,
        min: totalTime < min ? totalTime : min,
        max: totalTime > max ? totalTime : max
      }
    }, false)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='title' content={title} />
        <meta name='description' content='How fast is passwordless login? Login to join the race!' />
        <meta name='robots' content='index, follow' />
        <meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
        <meta name='language' content='English' />
        <meta name='author' content='Shawn Freyssonnet-Inder <shawninder@gmail.com>' />
        <meat name='image' href='/magic-auth-perf.svg' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.welcome}>
          Welcome to the Magic Auth Race!
        </h1>

        <p className={styles.desc}>
          See the amazing perfomance of competitors all around the world.
        </p>
        <section className={styles.leaderboard}>
          <Leaderboard
            initialized={loginStats && loginStats.avg && !loginStatsLoading}
            loading={loginStatsLoading}
            stats={loginStats}
          />
        </section>
        <section className={styles.login}>
          <Login
            loggedIn={loggedIn}
            setLoggedIn={setLoggedIn}
            user={user}
            disabled={userLoading}
            on={{
              login: ({ totalTime }) => {
                console.log('Logged in')
                setTotalTime(totalTime)
                addStats({
                  totalTime
                })
              },
              logout: () => {
                console.log('Logged out')
              },
              save: () => {
                console.log('Saved')
              },
              err: setLoginErr
            }}
          />
          <h3>User</h3>
          <pre>{JSON.stringify(user, null, 2)}</pre>
          <h3>Time</h3>
          <pre>
            {JSON.stringify({
              totalTime
            }, null, 2)}
          </pre>
          <h3>Logins</h3>
          <pre>
            {JSON.stringify(logins, null, 2)}
          </pre>
          <h3>Errors</h3>
          <pre>
            {Object.keys(loginErr).map((key) => {
              const err = loginErr[key]
              return `${key}: ${err instanceof Error ? err.toString() : JSON.stringify(err)}`
            }).join('\n')}
          </pre>
        </section>
      </main>

      <footer className={styles.footer}>
        <Footer />
      </footer>
    </div>
  )
}
