import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import PublicNav from '../components/PublicNav'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [resetError, setResetError] = useState('')
  const [resetMessage, setResetMessage] = useState('')
  const [showReset, setShowReset] = useState(false)
  const [isOrgAdminReset, setIsOrgAdminReset] = useState(false)
  const [canRequestReset, setCanRequestReset] = useState(false)
  const [showOrgAdminForm, setShowOrgAdminForm] = useState(false)
  const [resetForm, setResetForm] = useState({ securityPhrase: '', newPassword: '' })
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setResetError('')
    setResetMessage('')
    setShowReset(false)
    setIsOrgAdminReset(false)
    setCanRequestReset(false)
    setShowOrgAdminForm(false)
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      const status = err.response?.status
      if (status === 401) {
        setError('Incorrect password')
      } else if (status === 404) {
        setError('Email not found')
      } else if (status === 403) {
        setError('Account approval pending')
      } else {
        setError(err.response?.data?.message || 'Unable to sign in. Please try again.')
      }
      if (status === 401) {
        const data = err.response?.data || {}
        const orgAdmin = Boolean(data.isOrgAdmin)
        const canReset = Boolean(data.canRequestReset)
        setIsOrgAdminReset(orgAdmin)
        setCanRequestReset(canReset)
        setShowReset(orgAdmin || canReset)
      }
    } finally {
      setLoading(false)
    }
  }

  const requestReset = async () => {
    if (!form.email) {
      setResetError('Please enter your email first.')
      return
    }
    setResetError('')
    setResetMessage('')
    setResetLoading(true)
    try {
      const { data } = await api.post('/auth/request-password-reset', { email: form.email })
      setResetMessage(data?.message || 'Reset request submitted.')
    } catch (err) {
      setResetError(err.response?.data?.message || 'Failed to submit reset request')
    } finally {
      setResetLoading(false)
    }
  }

  const submitOrgAdminReset = async () => {
    if (!form.email) {
      setResetError('Please enter your org admin email first.')
      return
    }
    setResetError('')
    setResetMessage('')
    setResetLoading(true)
    try {
      const { data } = await api.put('/auth/org-admin-reset-password', {
        email: form.email,
        newPassword: resetForm.newPassword,
        securityPhrase: resetForm.securityPhrase
      })
      setResetMessage(data?.message || 'Password updated. Please sign in.')
      setResetForm({ securityPhrase: '', newPassword: '' })
    } catch (err) {
      setResetError(err.response?.data?.message || 'Org Admin reset failed')
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <>
      <PublicNav />
      <div className="auth-page with-nav">
        <div className="auth-card">
        <div className="auth-brand">BugTracker+</div>
        <h1>Enter your credentials</h1>
        {error && <div className="alert">{error}</div>}
        <form onSubmit={onSubmit}>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={onChange} required />
          </label>
          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={onChange} required />
          </label>
          <button type="submit" className="primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        {showReset && (
          <div className="hint" style={{ marginTop: '0.8rem' }}>
            {resetError && <div className="alert">{resetError}</div>}
            {resetMessage && <div className="success">{resetMessage}</div>}
            {canRequestReset && !isOrgAdminReset && (
              <button
                className="link-button"
                type="button"
                onClick={requestReset}
                disabled={resetLoading}
              >
                {resetLoading ? 'Requesting reset...' : 'Forgot password? Request reset'}
              </button>
            )}
            {isOrgAdminReset && (
              <>
                <button
                  className="link-button"
                  type="button"
                  onClick={() => setShowOrgAdminForm((prev) => !prev)}
                >
                  Org Admin reset? Use security phrase
                </button>
                {showOrgAdminForm && (
                  <div className="role-guide">
                    <label className="inline-field">
                      Security Phrase
                      <input
                        type="password"
                        value={resetForm.securityPhrase}
                        onChange={(e) => setResetForm((prev) => ({ ...prev, securityPhrase: e.target.value }))}
                      />
                    </label>
                    <label className="inline-field">
                      New Password
                      <input
                        type="password"
                        value={resetForm.newPassword}
                        onChange={(e) => setResetForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                      />
                    </label>
                    <div className="actions">
                      <button className="primary" type="button" onClick={submitOrgAdminReset} disabled={resetLoading}>
                        {resetLoading ? 'Resetting...' : 'Reset Org Admin Password'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        <div className="hint">
          New here? <Link to="/register">Create an account</Link>
        </div>
        </div>
      </div>
    </>
  )
}

export default Login
