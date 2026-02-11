import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import PublicNav from '../components/PublicNav'

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const result = await register(form)
      if (result?.status === 'pending') {
        setSuccess('Account created successfully. Account approval pending.')
      } else {
        setSuccess('Account created successfully. You can now sign in.')
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PublicNav />
      <div className="auth-page with-nav">
        <div className="auth-card">
        <div className="auth-brand">BugTracker+</div>
        <h1>Create account</h1>
        <p className="auth-tagline">Your account will be reviewed by a Project Admin or Org Admin.</p>
        {error && <div className="alert">{error}</div>}
        {success ? (
          <div className="success">
            {success}
            <div className="actions" style={{ marginTop: '1rem' }}>
              <button className="primary" type="button" onClick={() => navigate('/login')}>
                Go to sign in
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <label>
              Name
              <input name="name" value={form.name} onChange={onChange} required />
            </label>
            <label>
              Email
              <input name="email" type="email" value={form.email} onChange={onChange} required />
            </label>
            <label>
              Password
              <input name="password" type="password" value={form.password} onChange={onChange} required />
            </label>
            <button type="submit" className="primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create account'}
            </button>
          </form>
        )}
        <div className="hint">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
        </div>
      </div>
    </>
  )
}

export default Register
