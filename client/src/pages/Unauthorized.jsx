import React from 'react'
import { Link } from 'react-router-dom'

const Unauthorized = () => (
  <div className="page">
    <div className="card">
      <h2>Access denied</h2>
      <p>You do not have permission to view this page.</p>
      <Link to="/dashboard" className="primary">Back to dashboard</Link>
    </div>
  </div>
)

export default Unauthorized
