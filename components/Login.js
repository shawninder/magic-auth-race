import { useState, useRef } from 'react'
import { Magic } from 'magic-sdk'

export default function Login ({
  login,
  disabled,
  loggedIn,
  setLoggedIn,
  on
}) {
  const [loggingIn, setLoggingIn] = useState(false)
  const [saving, setSaving] = useState(false)
  const emailRef = useRef(null)

  async function logIn (event) {
    event.preventDefault()
    const email = emailRef.current.value

    setLoggingIn(true)

    const time = {
      startTime: Date.now()
    }

    const auth = { magic: null, didToken: null }
    try {
      auth.magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY)
      auth.didToken = await auth.magic.auth.loginWithMagicLink({ email })
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
        time.totalTime = time.endTime - time.startTime
        const login = await res.text()
        on.login && on.login({ login, totalTime: time.totalTime })
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
        body: JSON.stringify({ email, t: time.totalTime })
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
    <section>
      <form onSubmit={logIn}>
        <label>
          <input
            name='email'
            type='email'
            placeholder='Your email'
            ref={emailRef}
            disabled={loggedIn || disabled || loggingIn}
            defaultValue={(login && login.email) || ''}
          />
        </label>
        <br />
        <button type='submit' disabled={loggedIn || disabled || loggingIn}>
          Login to join the race!
        </button>
      </form>
      <form
        onSubmit={logIn}
      >
        <button type='submit' disabled={!loggedIn || disabled || loggingIn}>
          Try Again (Already logged in)
        </button>
      </form>
      <form
        onSubmit={logout}
      >
        <button type='submit' disabled={!loggedIn || disabled || loggingIn}>
          Logout
        </button>
      </form>
    </section>
  )
}
