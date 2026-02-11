import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import BugTable from '../components/BugTable'

const Bugs = () => {
  const { user } = useAuth()
  const [bugs, setBugs] = useState([])
  const [developers, setDevelopers] = useState([])
  const [filters, setFilters] = useState({ status: '', priority: '', assignedTo: '' })
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    screenshots: '',
    assignedTo: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

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

  const fetchDevelopers = async () => {
    if (user?.role !== 'Admin') {
      setDevelopers([])
      return
    }
    try {
      const { data } = await api.get('/users', { params: { role: 'Developer' } })
      setDevelopers(data)
    } catch (err) {
      setDevelopers([])
    }
  }

  useEffect(() => {
    fetchBugs()
    fetchDevelopers()
  }, [user?.role])

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const applyFilters = (e) => {
    e.preventDefault()
    fetchBugs()
  }

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        title: form.title,
        description: form.description,
        priority: form.priority,
        screenshots: form.screenshots
          ? form.screenshots.split(',').map((item) => item.trim()).filter(Boolean)
          : []
      }
      if (user?.role === 'Admin' && form.assignedTo) {
        payload.assignedTo = Number(form.assignedTo)
      }
      await api.post('/bugs', payload)
      setForm({ title: '', description: '', priority: 'Medium', screenshots: '', assignedTo: '' })
      fetchBugs()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create bug')
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

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Bug Inbox</h2>
          <p>Track, assign, and resolve your team’s issues.</p>
        </div>
      </div>

      {error && <div className="alert">{error}</div>}

      {(user?.role === 'Admin' || user?.role === 'Tester') && (
        <div className="card">
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
            {user?.role === 'Admin' && (
              <label>
                Assign to
                <select name="assignedTo" value={form.assignedTo} onChange={handleFormChange}>
                  <option value="">Unassigned</option>
                  {developers.map((dev) => (
                    <option key={dev.id} value={dev.id}>{dev.name}</option>
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
              <button className="primary" type="submit">Create Bug</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3>Filters</h3>
        <form className="filter-grid" onSubmit={applyFilters}>
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
          {user?.role === 'Admin' && (
            <label>
              Assigned Developer
              {developers.length ? (
                <select name="assignedTo" value={filters.assignedTo} onChange={handleFilterChange}>
                  <option value="">All</option>
                  {developers.map((dev) => (
                    <option key={dev.id} value={dev.id}>{dev.name}</option>
                  ))}
                </select>
              ) : (
                <input name="assignedTo" value={filters.assignedTo} onChange={handleFilterChange} placeholder="User ID" />
              )}
            </label>
          )}
          <div className="actions">
            <button className="ghost" type="submit">Apply</button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Active Bugs</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <BugTable
            bugs={bugs}
            user={user}
            developers={developers}
            onAssign={handleAssign}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </div>
  )
}

export default Bugs
