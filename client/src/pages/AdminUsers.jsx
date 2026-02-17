import React, { useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const AdminUsers = () => {
  const { user } = useAuth()
  const [pending, setPending] = useState([])
  const [active, setActive] = useState([])
  const [resetRequests, setResetRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [resetInputs, setResetInputs] = useState({})
  const [securityPhrase, setSecurityPhrase] = useState('')
  const [activeTab, setActiveTab] = useState('pending')

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

  const canReject = user?.role === 'org_admin' || user?.role === 'project_admin'

  const formatRole = (role) => {
    if (!role) return 'Unassigned'
    return role.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const fetchUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const [pendingRes, activeRes, resetRes] = await Promise.all([
        api.get('/users', { params: { status: 'pending' } }),
        api.get('/users', { params: { status: 'active' } }),
        api.get('/users', { params: { resetRequested: 'true' } })
      ])
      setPending(pendingRes.data)
      setActive(activeRes.data)
      const requested = Array.isArray(resetRes.data) ? resetRes.data : []
      const filtered = requested.filter((item) => {
        if (user?.role === 'org_admin') return ['project_admin', 'developer', 'tester'].includes(item.role)
        if (user?.role === 'project_admin') return ['developer', 'tester'].includes(item.role)
        return false
      })
      setResetRequests(filtered)
      window.dispatchEvent(new Event('pending-approvals-updated'))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleApprove = async (id, role) => {
    if (!role) return
    try {
      await api.put(`/users/${id}/approve`, { role })
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Approval failed')
    }
  }

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this user?')) return
    try {
      await api.put(`/users/${id}/reject`)
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Rejection failed')
    }
  }

  const handleRoleChange = async (id, role) => {
    if (!role) return
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

  const handleResetApprove = async (id) => {
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

  const handleResetReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this password reset request?')) return
    try {
      await api.put(`/users/${id}/reject-password-reset`)
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Reset rejection failed')
    }
  }

  const renderTableSkeleton = () => (
    <div className="table-loading">
      <div className="skeleton-table">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton-row">
            <div className="skeleton-cell" />
            <div className="skeleton-cell" />
            <div className="skeleton-cell" />
            <div className="skeleton-cell" />
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="page admin-users-page">
      <div className="page-header">
        <div>
          <h2>User Management</h2>
          <p>Review new accounts, change roles, and handle password resets.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Approvals
          {pending.length > 0 && <span className="tab-badge">{pending.length}</span>}
        </button>
        <button 
          className={`tab ${activeTab === 'resets' ? 'active' : ''}`}
          onClick={() => setActiveTab('resets')}
        >
          Password Resets
          {resetRequests.length > 0 && <span className="tab-badge">{resetRequests.length}</span>}
        </button>
        <button 
          className={`tab ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active Users
          {active.length > 0 && <span className="tab-badge">{active.length}</span>}
        </button>
      </div>

      {activeTab === 'pending' && (
        <div className="card card-animate">
          <h3>Pending Approvals</h3>
          {loading ? (
            renderTableSkeleton()
          ) : pending.length === 0 ? (
            <div className="empty-state">
              <p className="hint">No pending users.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="interactive-table">
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
                      <td><strong>{person.name}</strong></td>
                      <td>{person.email}</td>
                      <td>
                        <select
                          className="inline-select interactive-select"
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
                          <button className="ghost btn-danger" onClick={() => handleReject(person.id)}>Reject</button>
                        ) : (
                          <span className="hint">Admin only</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'resets' && (
        <div className="card card-animate">
          <h3>Password Reset Requests</h3>
          {user?.role === 'org_admin' && resetRequests.length > 0 && (
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
            renderTableSkeleton()
          ) : resetRequests.length === 0 ? (
            <div className="empty-state">
              <p className="hint">No reset requests.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="interactive-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>New Password</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {resetRequests.map((person) => (
                    <tr key={person.id}>
                      <td><strong>{person.name}</strong></td>
                      <td>{person.email}</td>
                      <td>{formatRole(person.role)}</td>
                      <td>
                        <input
                          type="password"
                          className="inline-input"
                          value={resetInputs[person.id]?.newPassword || ''}
                          onChange={(e) => handleResetInputChange(person.id, 'newPassword', e.target.value)}
                          placeholder="New password"
                        />
                      </td>
                      <td>
                        <div className="actions">
                          <button 
                            className="primary" 
                            onClick={() => handleResetApprove(person.id)}
                            disabled={!resetInputs[person.id]?.newPassword}
                          >
                            Set
                          </button>
                          <button className="ghost btn-danger" onClick={() => handleResetReject(person.id)}>Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'active' && (
        <div className="card card-animate">
          <h3>Active Users</h3>
          {loading ? (
            renderTableSkeleton()
          ) : active.length === 0 ? (
            <div className="empty-state">
              <p className="hint">No active users.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="interactive-table">
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
                        <td><strong>{person.name}</strong></td>
                        <td>{person.email}</td>
                        <td>{formatRole(person.role)}</td>
                        <td>
                          {person.id === user?.id ? (
                            <span className="hint">Current user</span>
                          ) : canManage ? (
                            <select
                              className="inline-select interactive-select"
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
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminUsers
