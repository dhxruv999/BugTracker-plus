import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Tester' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create account</h1>
        <p>Pick a role to get the right tools and permissions.</p>
        {error && <div className="alert">{error}</div>}
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
          <label>
            Role
            <select name="role" value={form.role} onChange={onChange}>
              <option value="Admin">Project Admin</option>
              <option value="Developer">Developer</option>
              <option value="Tester">Tester</option>
            </select>
          </label>
          <button type="submit" className="primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>
        <div className="role-guide">
          <h4>Roles & responsibilities</h4>
          <ul>
            <li><strong>Project Admin:</strong> Manage project settings & users</li>
            <li><strong>Developer:</strong> Work on & update issues</li>
            <li><strong>Tester:</strong> Create issues</li>
          </ul>
        </div>
        <div className="hint">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  )
}

export default Register
