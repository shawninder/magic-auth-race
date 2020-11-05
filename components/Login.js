import { useState, useRef } from 'react'
import { Magic } from 'magic-sdk'

import styles from '../styles/Login.module.css'

const loggedInMsg = 'Logged in'
const loggingInMsg = 'Logging in...'

export default function Login ({
  login,
  disabled,
  loggedIn,
  setLoggedIn,
  on
}) {
  const [loggingIn, setLoggingIn] = useState(false)
  const [, setSaving] = useState(false)
  const emailRef = useRef(null)

  async function logIn (event) {
    event.preventDefault()
    const email = emailRef.current.value

    setLoggingIn(true)

    const time = {
      startTime: Date.now()
    }

    on.startTime && on.startTime(time.startTime)

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
        time.endTime = Date.now()
        time.duration = time.endTime - time.startTime
        const login = await res.text()
        on.login && on.login({ login, duration: time.duration })
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
    setLoggingIn(false)
    setSaving(true)
    try {
      const res = await window.fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.didToken}`
        },
        body: JSON.stringify({ email, t: time.duration })
      })

      if (res.status === 201) {
        setSaving(false)
        on.save && on.save()
      } else {
        setSaving(false)
        return on.err && on.err({
          'Save error': {
            status: res.status,
            text: await res.text()
          }
        })
      }
    } catch (err) {
      setSaving(false)
      return on.err && on.err('Save exception', err)
    }
    on.done && on.done({ ...time })
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

  return (
    <section className={styles.section}>
      <form
        onSubmit={logIn}
      >
        <label className={`${styles.label} nes-field`}>
          <input
            className={`${styles.input} nes-input`}
            name='email'
            type='email'
            placeholder='Your email'
            ref={emailRef}
            disabled={loggedIn || disabled || loggingIn}
            defaultValue={(login && login.email) || ''}
          />
        </label>
        <br />
        <div
          className={styles.bgContainer}
        >
          <p
            className={styles.bg}
            style={{
              opacity: (loggedIn && !disabled && !loggingIn) ? 1 : 0
            }}
          >
            {loggedIn ? loggedInMsg : null}
          </p>
          <button
            className={`${styles.input} nes-btn is-primary`}
            type='submit'
            disabled={loggedIn || disabled || loggingIn}
            style={{
              opacity: (loggedIn || disabled) ? 0 : 1
            }}
          >
            Login to join the race!
          </button>
        </div>
      </form>
      <form
        onSubmit={logIn}
        className={styles.bgContainer}
      >
        <p
          className={styles.bg}
          style={{
            opacity: (!loggedIn || disabled || loggingIn) ? 1 : 0
          }}
        >
          {loggingIn ? loggingInMsg : null}
        </p>
        <button
          className={`${styles.input} nes-btn is-success`}
          type='submit'
          disabled={!loggedIn || disabled || loggingIn}
          style={{
            opacity: (!loggedIn || disabled || loggingIn) ? 0 : 1
          }}
        >
          Try Again<br />
          (Already logged in)
        </button>
      </form>
      <form
        onSubmit={logout}
      >
        <button
          className={`${styles.input} nes-btn is-warning`}
          type='submit'
          disabled={!loggedIn || disabled || loggingIn}
          style={{
            opacity: (!loggedIn || disabled || loggingIn) ? 0 : 1
          }}
        >
          Logout
        </button>
      </form>
    </section>
  )
}
