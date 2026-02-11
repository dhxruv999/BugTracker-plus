import React, { useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const AdminUsers = () => {
  const { user } = useAuth()
  const [pending, setPending] = useState([])
  const [active, setActive] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [resetInputs, setResetInputs] = useState({})
  const [securityPhrase, setSecurityPhrase] = useState('')

  const roleRank = useMemo(() => ({
    org_admin: 3,
    project_admin: 2,
    developer: 1,
    tester: 1
  }), [])

  const allowedRoles = useMemo(() => {
    if (user?.role === 'org_admin') return ['project_admin', 'developer', 'tester']
    return ['developer', 'tester']
  }, [user?.role])

  const canReject = user?.role === 'org_admin'

  const formatRole = (role) => {
    if (!role) return 'Unassigned'
    return role.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const fetchUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const [pendingRes, activeRes] = await Promise.all([
        api.get('/users', { params: { status: 'pending' } }),
        api.get('/users', { params: { status: 'active' } })
      ])
      setPending(pendingRes.data)
      setActive(activeRes.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleApprove = async (id, role) => {
    try {
      await api.put(`/users/${id}/approve`, { role })
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Approval failed')
    }
  }

  const handleReject = async (id) => {
    try {
      await api.put(`/users/${id}/reject`)
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Rejection failed')
    }
  }

  const handleRoleChange = async (id, role) => {
    try {
      await api.put(`/users/${id}/change-role`, { role })
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Role change failed')
    }
  }

  const handleResetInputChange = (id, field, value) => {
    setResetInputs((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }))
  }

  const handleAdminReset = async (id) => {
    try {
      const payload = {
        userId: id,
        newPassword: resetInputs[id]?.newPassword || ''
      }
      if (user?.role === 'org_admin') {
        payload.securityPhrase = securityPhrase
        await api.put('/users/org-admin-reset-password', payload)
      } else {
        await api.put('/users/admin-reset-password', payload)
      }
      setResetInputs((prev) => ({ ...prev, [id]: {} }))
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed')
    }
  }

  const resetRequests = active.filter((item) => {
    if (!item.password_reset_requested) return false
    if (user?.role === 'org_admin') return ['project_admin', 'developer', 'tester'].includes(item.role)
    if (user?.role === 'project_admin') return ['developer', 'tester'].includes(item.role)
    return false
  })

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>User Approvals</h2>
          <p>Review new accounts, change roles, and handle password resets.</p>
        </div>
      </div>

      {error && <div className="alert">{error}</div>}

      <div className="card">
        <h3>Pending Approvals</h3>
        {loading ? (
          <p>Loading...</p>
        ) : pending.length === 0 ? (
          <p className="hint">No pending users.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Assign Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((person) => (
                  <tr key={person.id}>
                    <td>{person.name}</td>
                    <td>{person.email}</td>
                    <td>
                      <select
                        className="inline-select"
                        defaultValue=""
                        onChange={(e) => handleApprove(person.id, e.target.value)}
                      >
                        <option value="" disabled>Select role</option>
                        {allowedRoles.map((role) => (
                          <option key={role} value={role}>{formatRole(role)}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {canReject ? (
                        <button className="ghost" onClick={() => handleReject(person.id)}>Reject</button>
                      ) : (
                        <span className="hint">Org Admin only</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Active Users</h3>
        {loading ? (
          <p>Loading...</p>
        ) : active.length === 0 ? (
          <p className="hint">No active users.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Change Role</th>
                </tr>
              </thead>
              <tbody>
                {active.map((person) => {
                  const canManage = roleRank[user?.role] > roleRank[person.role]
                  return (
                  <tr key={person.id}>
                    <td>{person.name}</td>
                    <td>{person.email}</td>
                    <td>{formatRole(person.role)}</td>
                    <td>
                      {person.id === user?.id ? (
                        <span className="hint">Current user</span>
                      ) : canManage ? (
                        <select
                          className="inline-select"
                          defaultValue=""
                          onChange={(e) => handleRoleChange(person.id, e.target.value)}
                        >
                          <option value="" disabled>Change role</option>
                          {allowedRoles.map((role) => (
                            <option key={role} value={role}>{formatRole(role)}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="hint">Not permitted</span>
                      )}
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Password Reset Requests</h3>
        {user?.role === 'org_admin' && (
          <label className="inline-field">
            Security Phrase
            <input
              type="password"
              value={securityPhrase}
              onChange={(e) => setSecurityPhrase(e.target.value)}
              placeholder="Enter org admin phrase"
            />
          </label>
        )}
        {loading ? (
          <p>Loading...</p>
        ) : resetRequests.length === 0 ? (
          <p className="hint">No reset requests.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>New Password</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {resetRequests.map((person) => (
                  <tr key={person.id}>
                    <td>{person.name}</td>
                    <td>{person.email}</td>
                    <td>{formatRole(person.role)}</td>
                    <td>
                      <input
                        type="password"
                        value={resetInputs[person.id]?.newPassword || ''}
                        onChange={(e) => handleResetInputChange(person.id, 'newPassword', e.target.value)}
                        placeholder="New password"
                      />
                    </td>
                    <td>
                      <button className="primary" onClick={() => handleAdminReset(person.id)}>Reset</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminUsers
