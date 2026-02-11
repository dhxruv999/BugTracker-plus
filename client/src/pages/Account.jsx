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
    try {
      const { data } = await api.put('/users/me', profile)
      updateUser(data)
      setProfileMessage('Account details updated.')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
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
    try {
      await api.put('/users/change-password', {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword
      })
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' })
      setPasswordMessage('Password updated successfully.')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password')
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Account Management</h2>
          <p>Update your profile details and keep your password secure.</p>
        </div>
      </div>

      {error && <div className="alert">{error}</div>}
      {profileMessage && <div className="success">{profileMessage}</div>}
      <div className="card">
        <h3>Profile Details</h3>
        <form className="form-grid" onSubmit={saveProfile}>
          <label>
            Full Name
            <input name="name" value={profile.name} onChange={onProfileChange} required />
          </label>
          <label>
            Email
            <input name="email" type="email" value={profile.email} onChange={onProfileChange} required />
          </label>
          <div className="actions">
            <button className="primary" type="submit">Save Changes</button>
          </div>
        </form>
      </div>

      {passwordMessage && <div className="success">{passwordMessage}</div>}
      <div className="card">
        <h3>Change Password</h3>
        <form className="form-grid" onSubmit={changePassword}>
          <label>
            Current Password
            <input
              name="oldPassword"
              type="password"
              value={passwords.oldPassword}
              onChange={onPasswordChange}
              required
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
            />
          </label>
          <div className="actions">
            <button className="primary" type="submit">Update Password</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Account
