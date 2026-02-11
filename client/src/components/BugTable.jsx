import React from 'react'

const BugTable = ({ bugs, user, developers = [], onAssign, onStatusChange }) => {
  const isAdmin = user?.role === 'Admin'

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
          </tr>
        </thead>
        <tbody>
          {bugs.map((bug) => (
            <tr key={bug.id}>
              <td>#{bug.id}</td>
              <td>{bug.title}</td>
              <td>
                {user && (user.role !== 'Developer' || bug.assigned_to === user.id) ? (
                  <select
                    className="inline-select"
                    value={bug.status}
                    onChange={(e) => onStatusChange(bug.id, e.target.value)}
                  >
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                    <option>Closed</option>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BugTable
