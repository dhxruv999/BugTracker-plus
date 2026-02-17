import React from 'react'
import { Link } from 'react-router-dom'

const Unauthorized = () => (
  <div className="page unauthorized-page">
    <div className="card card-animate unauthorized-card">
      <div className="unauthorized-icon">🚫</div>
      <h2>Access Denied</h2>
      <p>You do not have permission to view this page.</p>
      <p className="hint">Please contact your administrator if you believe this is an error.</p>
      <div className="actions">
        <Link to="/dashboard" className="primary">Back to Dashboard</Link>
      </div>
    </div>
  </div>
)

export default Unauthorized
