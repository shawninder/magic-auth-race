import { useState } from 'react'
import Head from 'next/head'
import Leaderboard from '../components/Leaderboard'
import Login from '../components/Login'
import Footer from '../components/Footer'

import useLogins from '../use/logins'

import styles from '../styles/Home.module.css'

export default function Home () {
  const { logins, loading: loginsLoading, mutate: mutateLogins } = useLogins()

  const [loggedIn, setLoggedIn] = useState(false)
  const [loginErr, setLoginErr] = useState({})

  const title = 'Magic Auth Race!'

  const loginErrors = Object.keys(loginErr)

  function addLogin (login) {
    mutateLogins((logins) => {
      return logins.concat([login])
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
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:creator' content='@shawn_inder' />
        <meta name='twitter:title' content='Magic Auth race' />
        <meta name='og:title' content='Magic Auth race' />
        <meta name='twitter:description' content='How fast is passwordless login? Log in to join the race!' />
        <meta name='og:description' content='How fast is passwordless login? Log in to join the race!' />
        <meta name='twitter:image' content='https://magic-auth-race.vercel.app/magic-auth-race-screenshot.png' />
        <meta name='og:image' content='https://magic-auth-race.vercel.app/magic-auth-race-screenshot.png' />
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
              login: ({ duration }) => {
                console.log('Logged in')
                addLogin(duration)
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
          {loginErrors.length > 0 ? (
            <>
              <h3>Errors</h3>
              <pre>
                {loginErrors.map((key) => {
                  const err = loginErr[key]
                  return `${key}: ${err instanceof Error ? err.toString() : JSON.stringify(err)}`
                }).join('\n')}
              </pre>
              <pre>{JSON.stringify(loginErr, null, 2)}</pre>
            </>
          ) : null}
        </section>
      </main>

      <footer className={styles.footer}>
        <Footer />
      </footer>
    </div>
  )
}
