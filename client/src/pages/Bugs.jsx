import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import BugTable from '../components/BugTable'

const Bugs = () => {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [bugs, setBugs] = useState([])
  const [assignees, setAssignees] = useState([])
  const [filters, setFilters] = useState({ 
    status: searchParams.get('status') || '', 
    priority: searchParams.get('priority') || '', 
    assignedTo: searchParams.get('assignedTo') || '' 
  })
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    screenshots: '',
    assignedTo: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const fetchBugs = async () => {
    setLoading(true)
    setError('')
    const params = {}
    if (filters.status) params.status = filters.status
    if (filters.priority) params.priority = filters.priority
    if (filters.assignedTo) params.assignedTo = filters.assignedTo

    try {
      const { data } = await api.get('/bugs', { params })
      setBugs(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bugs')
    }
    setLoading(false)
  }

  const isAdminRole = user?.role === 'org_admin' || user?.role === 'project_admin'
  const isTesterRole = user?.role === 'tester'

  const fetchAssignees = async () => {
    try {
      const { data } = await api.get('/users/assignees')
      setAssignees(data)
    } catch (err) {
      setAssignees([])
    }
  }

  useEffect(() => {
    fetchBugs()
    fetchAssignees()
  }, [user?.role])

  // Auto-apply filters when they change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchBugs()
      // Update URL params
      const newParams = new URLSearchParams()
      if (filters.status) newParams.set('status', filters.status)
      if (filters.priority) newParams.set('priority', filters.priority)
      if (filters.assignedTo) newParams.set('assignedTo', filters.assignedTo)
      setSearchParams(newParams)
    }, 300) // Debounce for 300ms

    return () => clearTimeout(timeoutId)
  }, [filters])

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      const payload = {
        title: form.title,
        description: form.description,
        priority: form.priority,
        screenshots: form.screenshots
          ? form.screenshots.split(',').map((item) => item.trim()).filter(Boolean)
          : []
      }
      if (isAdminRole && form.assignedTo) {
        payload.assignedTo = Number(form.assignedTo)
      }
      await api.post('/bugs', payload)
      setForm({ title: '', description: '', priority: 'Medium', screenshots: '', assignedTo: '' })
      setShowCreateForm(false)
      fetchBugs()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create bug')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAssign = async (bugId, assignedTo) => {
    try {
      await api.patch(`/bugs/${bugId}/assign`, { assignedTo: assignedTo || null })
      fetchBugs()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign bug')
    }
  }

  const handleStatusChange = async (bugId, status) => {
    try {
      await api.patch(`/bugs/${bugId}/status`, { status })
      fetchBugs()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status')
    }
  }

  const clearFilters = () => {
    setFilters({ status: '', priority: '', assignedTo: '' })
    setSearchParams({})
  }

  return (
    <div className="page bugs-page">
      <div className="page-header">
        <div>
          <h2>Bug Inbox</h2>
          <p>Track, assign, and resolve your team's issues.</p>
        </div>
        {(isAdminRole || isTesterRole) && (
          <button 
            className={`primary ${showCreateForm ? 'active' : ''}`}
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : '+ Create Bug'}
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {(isAdminRole || isTesterRole) && showCreateForm && (
        <div className="card card-animate">
          <h3>Create Bug</h3>
          <form className="form-grid" onSubmit={handleCreate}>
            <label>
              Title
              <input name="title" value={form.title} onChange={handleFormChange} required />
            </label>
            <label>
              Priority
              <select name="priority" value={form.priority} onChange={handleFormChange}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </label>
            {isAdminRole && (
              <label>
                Assign to
                <select name="assignedTo" value={form.assignedTo} onChange={handleFormChange}>
                  <option value="">Unassigned</option>
                  {assignees.map((person) => (
                    <option key={person.id} value={person.id}>{person.name}</option>
                  ))}
                </select>
              </label>
            )}
            <label className="full">
              Description
              <textarea name="description" value={form.description} onChange={handleFormChange} rows="3" />
            </label>
            <label className="full">
              Screenshot URLs (comma-separated)
              <input name="screenshots" value={form.screenshots} onChange={handleFormChange} />
            </label>
            <div className="actions full">
              <button className="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Bug'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card card-animate filter-card">
        <div className="filter-header">
          <h3>Filters</h3>
          {(filters.status || filters.priority || filters.assignedTo) && (
            <button className="ghost small" onClick={clearFilters}>Clear All</button>
          )}
        </div>
        <div className="filter-grid">
          <label>
            Status
            <select name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="">All</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
              <option>Closed</option>
              <option>Reopened</option>
            </select>
          </label>
          <label>
            Priority
            <select name="priority" value={filters.priority} onChange={handleFilterChange}>
              <option value="">All</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </label>
          <label>
            Assigned Developer
            <select name="assignedTo" value={filters.assignedTo} onChange={handleFilterChange}>
              <option value="">All</option>
              {assignees.length ? (
                assignees.map((person) => (
                  <option key={person.id} value={person.id}>{person.name}</option>
                ))
              ) : (
                <option value="" disabled>No active developers</option>
              )}
            </select>
          </label>
        </div>
      </div>

      <div className="card card-animate">
        <div className="table-header">
          <h3>Active Bugs {bugs.length > 0 && <span className="badge">{bugs.length}</span>}</h3>
        </div>
        {loading ? (
          <div className="table-loading">
            <div className="skeleton-table">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="skeleton-row">
                  <div className="skeleton-cell" />
                  <div className="skeleton-cell" />
                  <div className="skeleton-cell" />
                  <div className="skeleton-cell" />
                  <div className="skeleton-cell" />
                </div>
              ))}
            </div>
          </div>
        ) : bugs.length === 0 ? (
          <div className="empty-state">
            <p className="hint">No bugs found. {filters.status || filters.priority || filters.assignedTo ? 'Try adjusting your filters.' : 'Create your first bug to get started!'}</p>
          </div>
        ) : (
          <BugTable
            bugs={bugs}
            user={user}
            developers={assignees}
            onAssign={handleAssign}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </div>
  )
}

export default Bugs
