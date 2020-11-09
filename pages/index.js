import { useState } from 'react'
import get from 'lodash.get'

import { getSession } from '../lib/auth-cookies'
import jsonFetcher from '../lib/jsonFetcher'

import { toAbsoluteUrl } from '../utils'

import Head from '../components/head'
import Leaderboard from '../components/Leaderboard'
import Login from '../components/Login'
import Footer from '../components/Footer'

import useLogins from '../use/logins'
import useTimer from '../use/timer'

import styles from '../styles/Home.module.css'

function Home ({ ssrLogins, session }) {
  const { logins, mutate: mutateLogins } = useLogins(ssrLogins)
  const [loggedIn, setLoggedIn] = useState(get(session, 'email', false))
  const { startTimer, stopTimer, resetTimer, elapsed } = useTimer()
  const [loginErr, setLoginErr] = useState({})
  const [label, setLabel] = useState(null)

  const title = 'Magic Auth Race!'

  const loginErrors = Object.keys(loginErr)

  function addLogin (login) {
    mutateLogins((logins) => {
      return logins && logins.concat([login])
    }, false)
  }

  function handleErr (err) {
    resetTimer()
    setLabel('')
    setLoginErr(err)
  }

  return (
    <div className={styles.container}>
      <Head>
        <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
        <meta name='language' content='English' />
        <title>{title}</title>
        <meta name='description' content='How fast is passwordless login? Login to join the race!' />
        <meta name='robots' content='index, follow' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content='Magic Auth race' />
        <meta name='og:title' content='Magic Auth race' />
        <meta name='twitter:description' content='How fast is passwordless login? Log in to join the race!' />
        <meta name='og:description' content='How fast is passwordless login? Log in to join the race!' />
        <meta name='twitter:image' content='https://magic-auth-race.vercel.app/magic-auth-race-screenshot.png' />
        <meta name='og:image' content='https://magic-auth-race.vercel.app/magic-auth-race-screenshot.png' />
        <meta name='title' content={title} />
      </Head>

      <main className={styles.main}>
        <section className={styles.leaderboard}>
          <Leaderboard
            logins={logins}
            label={label}
            elapsed={elapsed}
          />
        </section>
        <section className={styles.header}>
          <h1 className={`${styles.welcome} title`}>Magic Auth Race</h1>

          <p className={`${styles.desc} nes-balloon`}>
            How fast can you login?
          </p>
        </section>
        <section className={styles.login}>
          <Login
            session={session}
            loggedIn={loggedIn}
            setLoggedIn={setLoggedIn}
            on={{
              start: startTimer,
              login: async ({ auth, login, email }) => {
                const duration = stopTimer()
                console.log('Logged in', duration)
                setLabel(`Your time: ${duration}ms`)
                addLogin(duration)
                try {
                  const res = await window.fetch('/api/save', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${auth.didToken}`
                    },
                    body: JSON.stringify({ email, t: duration })
                  })

                  if (res.status === 201) {
                    console.log('Saved')
                  } else {
                    return setLoginErr({
                      'Save error': {
                        status: res.status,
                        text: await res.text()
                      }
                    })
                  }
                } catch (err) {
                  return handleErr(err)
                }
              },
              logout: () => {
                resetTimer()
                setLabel('')
                console.log('Logged out')
                setLoginErr({})
              },
              err: handleErr
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

Home.getInitialProps = async (ctx) => {
  const fetch = jsonFetcher()
  const todo = [
    fetch(toAbsoluteUrl('/api/logins'))
  ]
  if (ctx.req) {
    todo.push(getSession(ctx.req))
  }

  const [
    ssrLogins,
    session
  ] = await Promise.all(todo)
  return {
    ssrLogins,
    session
  }
}
export default Home
