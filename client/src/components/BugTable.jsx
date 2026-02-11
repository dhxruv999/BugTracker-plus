import React from 'react'
import { Link } from 'react-router-dom'

const BugTable = ({ bugs, user, developers = [], onAssign, onStatusChange }) => {
  const isAdmin = user?.role === 'Admin'
  const isDeveloper = user?.role === 'Developer'
  const isTester = user?.role === 'Tester'

  const getStatusOptions = (bug) => {
    const all = ['Open', 'In Progress', 'Resolved', 'Closed', 'Reopened']

    if (isAdmin) return all

    if (isDeveloper && bug.assigned_to === user?.id) return all

    if (isTester) {
      const allowed = ['In Progress', 'Reopened']
      if (!allowed.includes(bug.status)) {
        return [bug.status, ...allowed]
      }
      return allowed
    }

    return [bug.status]
  }

  const canEditStatus = (bug) => {
    if (isAdmin) return true
    if (isDeveloper) return bug.assigned_to === user?.id
    if (isTester) return true
    return false
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Assigned</th>
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bugs.map((bug) => (
            <tr key={bug.id}>
              <td>#{bug.id}</td>
              <td>{bug.title}</td>
              <td>
                {user && canEditStatus(bug) ? (
                  <select
                    className="inline-select"
                    value={bug.status}
                    onChange={(e) => onStatusChange(bug.id, e.target.value)}
                  >
                    {getStatusOptions(bug).map((option) => (
                      <option key={option} value={option} disabled={isTester && option === bug.status && !['In Progress', 'Reopened'].includes(option)}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className={`pill status-${bug.status.replace(' ', '-').toLowerCase()}`}>{bug.status}</span>
                )}
              </td>
              <td><span className={`pill priority-${bug.priority.toLowerCase()}`}>{bug.priority}</span></td>
              <td>
                {isAdmin ? (
                  <select
                    className="inline-select"
                    value={bug.assigned_to ?? ''}
                    onChange={(e) => onAssign(bug.id, e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {developers.map((dev) => (
                      <option key={dev.id} value={dev.id}>{dev.name}</option>
                    ))}
                  </select>
                ) : (
                  bug.assigned_to_name || 'Unassigned'
                )}
              </td>
              <td>{new Date(bug.updated_at).toLocaleDateString()}</td>
              <td>
                <Link to={`/bugs/${bug.id}`} className="ghost">View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BugTable
