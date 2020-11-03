import { useState } from 'react'
import Head from 'next/head'
import Leaderboard from '../components/Leaderboard'
import Login from '../components/Login'
import Footer from '../components/Footer'

import useUser from '../use/user'
import useLogins from '../use/logins'

import styles from '../styles/Home.module.css'

export default function Home () {
  const { user } = useUser()
  const { logins, loading: loginsLoading, mutate: mutateLogins } = useLogins()

  const [loggedIn, setLoggedIn] = useState(false)
  const [loginErr, setLoginErr] = useState({})

  const [totalTime, setTotalTime] = useState(null)

  const title = 'Magic Auth Race!'

  function addLogin (login) {
    mutateLogins((logins) => {
      logins.concat([login])
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
        <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
        <meta name='language' content='English' />
        <meta name='author' content='Shawn Freyssonnet-Inder <shawninder@gmail.com>' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.welcome}>Magic Auth Race</h1>

        <p className={styles.desc}>
          How fast can you login?
        </p>
        <section className={styles.leaderboard}>
          <Leaderboard
            initialized={logins && !loginsLoading}
            loading={loginsLoading}
            logins={logins}
          />
        </section>
        <section className={styles.login}>
          <Login
            loggedIn={loggedIn}
            setLoggedIn={setLoggedIn}
            on={{
              login: ({ totalTime }) => {
                console.log('Logged in')
                setTotalTime(totalTime)
                addLogin({
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
