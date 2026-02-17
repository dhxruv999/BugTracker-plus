import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const BugTable = ({ bugs, user, developers: assignees = [], onAssign, onStatusChange }) => {
  const [hoveredRow, setHoveredRow] = useState(null)
  const isAdmin = user?.role === 'org_admin' || user?.role === 'project_admin'
  const isDeveloper = user?.role === 'developer'
  const isTester = user?.role === 'tester'

  const transitionMap = {
    developer: {
      Open: ['In Progress'],
      'In Progress': ['Resolved'],
      Reopened: ['In Progress']
    },
    tester: {
      Resolved: ['Closed', 'Reopened']
    }
  }

  const getStatusOptions = (bug) => {
    const all = ['Open', 'In Progress', 'Resolved', 'Closed', 'Reopened']

    if (isAdmin) return all

    if (isDeveloper && bug.assigned_to === user?.id) {
      return [bug.status, ...(transitionMap.developer[bug.status] || [])]
    }

    if (isTester) {
      return [bug.status, ...(transitionMap.tester[bug.status] || [])]
    }

    return [bug.status]
  }

  const canEditStatus = (bug) => {
    if (isAdmin) return true
    if (isDeveloper) {
      return bug.assigned_to === user?.id && Boolean(transitionMap.developer[bug.status]?.length)
    }
    if (isTester) {
      return Boolean(transitionMap.tester[bug.status]?.length)
    }
    return false
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#6c757d',
      medium: '#ffd166',
      high: '#ef476f',
      critical: '#c1121f'
    }
    return colors[priority.toLowerCase()] || colors.medium
  }

  const getStatusColor = (status) => {
    const colors = {
      open: '#ffb703',
      'in-progress': '#219ebc',
      resolved: '#8ecae6',
      closed: '#adb5bd',
      reopened: '#ef476f'
    }
    return colors[status.replace(' ', '-').toLowerCase()] || '#adb5bd'
  }

  return (
    <div className="table-wrap">
      <table className="interactive-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Created By</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Assigned</th>
            <th>Assigned By</th>
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bugs.map((bug) => (
            <tr 
              key={bug.id}
              className={hoveredRow === bug.id ? 'row-hovered' : ''}
              onMouseEnter={() => setHoveredRow(bug.id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <td className="bug-id">#{bug.id}</td>
              <td className="bug-title">{bug.title}</td>
              <td>{bug.created_by_name || 'Unknown'}</td>
              <td>
                {user && canEditStatus(bug) ? (
                  <select
                    className="inline-select interactive-select"
                    value={bug.status}
                    onChange={(e) => onStatusChange(bug.id, e.target.value)}
                    style={{ borderColor: getStatusColor(bug.status) }}
                  >
                    {getStatusOptions(bug).map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <span 
                    className={`pill status-${bug.status.replace(' ', '-').toLowerCase()}`}
                    style={{ backgroundColor: getStatusColor(bug.status) + '20', color: getStatusColor(bug.status) }}
                  >
                    {bug.status}
                  </span>
                )}
              </td>
              <td style={{ textAlign: 'center' }}>
                <span 
                  className={`pill priority-${bug.priority.toLowerCase()}`}
                  style={{ backgroundColor: getPriorityColor(bug.priority) + '20', color: getPriorityColor(bug.priority) }}
                >
                  {bug.priority}
                </span>
              </td>
              <td>
                {isAdmin ? (
                  <select
                    className="inline-select interactive-select"
                    value={bug.assigned_to ?? ''}
                    onChange={(e) => onAssign(bug.id, e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {assignees.map((person) => (
                      <option key={person.id} value={person.id}>{person.name}</option>
                    ))}
                  </select>
                ) : (
                  bug.assigned_to_name || <span className="hint">Unassigned</span>
                )}
              </td>
              <td>{bug.assigned_by_name || '—'}</td>
              <td className="date-cell">{new Date(bug.updated_at).toLocaleDateString()}</td>
              <td>
                <Link to={`/bugs/${bug.id}`} className="ghost btn-view">View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BugTable
