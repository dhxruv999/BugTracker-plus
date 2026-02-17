import React, { useState } from 'react'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const Account = () => {
  const { user, updateUser } = useAuth()
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || ''
  })
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [profileMessage, setProfileMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [error, setError] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  const onProfileChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const onPasswordChange = (e) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const saveProfile = async (e) => {
    e.preventDefault()
    setError('')
    setProfileMessage('')
    setSavingProfile(true)
    try {
      const { data } = await api.put('/users/me', profile)
      updateUser(data)
      setProfileMessage('Account details updated successfully.')
      setTimeout(() => setProfileMessage(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const changePassword = async (e) => {
    e.preventDefault()
    setError('')
    setPasswordMessage('')
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('New password and confirmation do not match')
      return
    }
    if (passwords.newPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }
    setChangingPassword(true)
    try {
      await api.put('/users/change-password', {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword
      })
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' })
      setPasswordMessage('Password updated successfully.')
      setTimeout(() => setPasswordMessage(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password')
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <div className="page account-page">
      <div className="page-header">
        <div>
          <h2>Account Management</h2>
          <p>Update your profile details and keep your password secure.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {profileMessage && <div className="alert alert-success">{profileMessage}</div>}
      
      <div className="card card-animate">
        <div className="card-header">
          <h3>Profile Details</h3>
          <div className="card-icon">👤</div>
        </div>
        <form className="form-grid" onSubmit={saveProfile}>
          <label>
            Full Name
            <input 
              name="name" 
              value={profile.name} 
              onChange={onProfileChange} 
              required 
              className="interactive-input"
            />
          </label>
          <label>
            Email
            <input 
              name="email" 
              type="email" 
              value={profile.email} 
              onChange={onProfileChange} 
              required 
              className="interactive-input"
            />
          </label>
          <div className="actions">
            <button className="primary" type="submit" disabled={savingProfile}>
              {savingProfile ? (
                <>
                  <span className="spinner" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>

      {passwordMessage && <div className="alert alert-success">{passwordMessage}</div>}
      
      <div className="card card-animate">
        <div className="card-header">
          <h3>Change Password</h3>
          <div className="card-icon">🔒</div>
        </div>
        <form className="form-grid" onSubmit={changePassword}>
          <label>
            Current Password
            <input
              name="oldPassword"
              type="password"
              value={passwords.oldPassword}
              onChange={onPasswordChange}
              required
              className="interactive-input"
            />
          </label>
          <label>
            New Password
            <input
              name="newPassword"
              type="password"
              value={passwords.newPassword}
              onChange={onPasswordChange}
              required
              className="interactive-input"
              minLength="6"
            />
          </label>
          <label>
            Re-enter New Password
            <input
              name="confirmPassword"
              type="password"
              value={passwords.confirmPassword}
              onChange={onPasswordChange}
              required
              className="interactive-input"
              minLength="6"
            />
          </label>
          <div className="actions">
            <button className="primary" type="submit" disabled={changingPassword}>
              {changingPassword ? (
                <>
                  <span className="spinner" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Account
