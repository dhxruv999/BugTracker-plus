import React from 'react'
import { Link } from 'react-router-dom'

const BugTable = ({ bugs, user, developers: assignees = [], onAssign, onStatusChange }) => {
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
                      <option key={option} value={option}>{option}</option>
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
                    {assignees.map((person) => (
                      <option key={person.id} value={person.id}>{person.name}</option>
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
