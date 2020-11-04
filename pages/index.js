import { useState } from 'react'
import jsonFetcher from '../lib/jsonFetcher'
import Head from 'next/head'
import Leaderboard from '../components/Leaderboard'
import Login from '../components/Login'
import Footer from '../components/Footer'

import useLogins from '../use/logins'

import styles from '../styles/Home.module.css'

function Home ({ ssrLogins }) {
  const { logins, loading: loginsLoading, mutate: mutateLogins } = useLogins(ssrLogins)

  const [loggedIn, setLoggedIn] = useState(false)
  const [loginErr, setLoginErr] = useState({})

  const [highlight, setHighlight] = useState(0)
  const [label, setLabel] = useState(null)
  const [animate, setAnimate] = useState(false)

  const title = 'Magic Auth Race!'

  const loginErrors = Object.keys(loginErr)

  function addLogin (login) {
    mutateLogins((logins) => {
      return logins && logins.concat([login])
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
            highlight={highlight}
            label={label}
            animate={animate}
          />
        </section>
        <section className={styles.login}>
          <Login
            loggedIn={loggedIn}
            setLoggedIn={setLoggedIn}
            on={{
              startTime: () => {
                setHighlight(0)
                setAnimate(false)
                setLabel('')
                setTimeout(() => {
                  setAnimate(true)
                  setTimeout(() => {
                    setHighlight('100%')
                  }, 200)
                }, 10)
              },
              login: ({ duration }) => {
                console.log('Logged in')
                setHighlight(duration)
                setAnimate(false)
                setLabel(`Your time: ${duration}ms`)
                addLogin(duration)
              },
              logout: () => {
                setHighlight(0)
                setAnimate(false)
                setLabel('')
                console.log('Logged out')
              },
              save: () => {
                console.log('Saved')
              },
              err: (err) => {
                setHighlight(0)
                setAnimate(false)
                setLabel('')
                setLoginErr(err)
              }
            }}
          />
          {loginErrors.length > 0 ? (
            <div className={styles.errors}>
              <h3>Errors</h3>
              <pre>
                {loginErrors.map((key) => {
                  const err = loginErr[key]
                  return `${key}: ${err instanceof Error ? err.toString() : JSON.stringify(err)}`
                }).join('\n')}
              </pre>
              <pre>{JSON.stringify(loginErr, null, 2)}</pre>
            </div>
          ) : null}
        </section>
      </main>

      <footer className={styles.footer}>
        <Footer />
      </footer>
    </div>
  )
}

function getDomain () {
  if (process.env.NODE_ENV === 'production') {
    return 'https://magic-auth-race.vercel.com'
  } else {
    return 'http://localhost:3000'
  }
}

function toAbsoluteUrl (relativeUrl) {
  const url = `${getDomain()}${relativeUrl}`
  return url
}

Home.getInitialProps = async () => {
  const fetcher = jsonFetcher()
  const ssrLogins = await fetcher(toAbsoluteUrl('/api/logins'))
  console.error('===ssrLogins', ssrLogins)
  return {
    ssrLogins
  }
}
export default Home
