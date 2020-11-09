import { useState, useRef, useEffect } from 'react'
import { Magic } from 'magic-sdk'

import styles from '../styles/Login.module.css'

const loggedInMsg = 'Logged in'
const loggingInMsg = 'Logging in...'

const emailFeedbacks = {
  empty: 'is-error',
  invalid: 'is-warning',
  valid: 'is-success'
}

export default function Login ({
  session = {},
  login,
  loggedIn,
  setLoggedIn,
  on
}) {
  const [loggingIn, setLoggingIn] = useState(false)
  const [email, setEmail] = useState(session.email || '')
  const [emailFeedback, setEmailFeedback] = useState(determineEmailFeedback(email))

  const emailRef = useRef(null)

  function isEmail (str) {
    const atIndex = str.indexOf('@')
    if (atIndex === -1) {
      return false
    }
    const lastDot = str.lastIndexOf('.')
    if (lastDot < atIndex) {
      return false
    }
    if (lastDot === str.length - 1) {
      return false
    }
    return true
  }
  function determineEmailFeedback (str) {
    if (isEmail(str)) {
      return emailFeedbacks.valid
    } else if (str === '') {
      return emailFeedbacks.empty
    } else {
      return emailFeedbacks.invalid
    }
  }
  useEffect(() => {
    setEmailFeedback(determineEmailFeedback(email))
  }, [email])

  async function logIn (event) {
    event.preventDefault()
    const email = emailRef.current.value

    setLoggingIn(true)

    on.start && on.start()

    const auth = { magic: null, didToken: null }
    try {
      auth.magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY)
      auth.didToken = await auth.magic.auth.loginWithMagicLink({ email })
      on.token && on.token(auth.didToken)
    } catch (ex) {
      setLoggingIn(false)
      return on.err && on.err({ 'Magic login error': ex })
    }

    try {
      const res = await window.fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.didToken}`
        },
        body: JSON.stringify({ email })
      })

      if (res.status === 200) {
        setLoggedIn(true)
        setLoggingIn(false)
        const login = await res.text()
        setLoggingIn(false)
        return on.login && on.login({ auth, login, email })
      } else {
        setLoggingIn(false)
        return on.err && on.err({
          'Login error': {
            status: res.status,
            text: await res.text()
          }
        })
      }
    } catch (err) {
      setLoggingIn(false)
      return on.err && on.err({ 'Login exception': err })
    }
  }

  async function logout (event) {
    event.preventDefault()

    try {
      const res = await window.fetch('/api/logout')
      if (res.status === 302) {
        setLoggedIn(false)
        on.logout && on.logout()
      } else {
        return on.err && on.err({
          'Logout error': {
            status: res.status,
            text: await res.text()
          }
        })
      }
    } catch (ex) {
      return on.err && on.err({ 'Logout error': ex })
    }
  }

  const disableEmail = loggedIn || loggingIn
  const disableLogin = loggedIn || loggingIn || emailFeedback !== 'is-success'
  const showLogin = !loggedIn && !loggingIn

  return (
    <section className={`${styles.section} nes-container with-title`}>
      <p className='title'>
        Join the race!
      </p>
      <form
        onSubmit={logIn}
      >
        <label className={`${styles.label} nes-field`}>
          Your email
          <input
            className={`${styles.input} ${styles.email} nes-input ${emailFeedback} ${(disableEmail) ? 'is-disabled' : ''}`}
            name='email'
            type='email'
            placeholder='Your email'
            ref={emailRef}
            disabled={disableEmail}
            defaultValue={email || ''}
            onChange={(event) => {
              setEmail(event.target.value)
            }}
          />
        </label>
        <br />
        <div
          className={styles.bgContainer}
        >
          <p
            className={styles.bg}
            style={{
              opacity: (!showLogin) ? 1 : 0
            }}
          >
            {loggedIn ? loggedInMsg : null}
            {loggingIn ? loggingInMsg : null}
          </p>
          <button
            className={`${styles.input} nes-btn ${disableLogin ? 'is-disabled' : 'is-primary'}`}
            type='submit'
            disabled={disableLogin}
            style={{
              opacity: (showLogin) ? 1 : 0
            }}
          >
            Login
          </button>
        </div>
      </form>
      <form
        onSubmit={logout}
      >
        <button
          className={`${styles.input} nes-btn is-warning`}
          type='submit'
          disabled={!loggedIn || loggingIn}
          style={{
            opacity: (!loggedIn || loggingIn) ? 0 : 1
          }}
        >
          Logout
        </button>
      </form>
    </section>
  )
}
