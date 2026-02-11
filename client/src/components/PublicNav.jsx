import React from 'react'
import { Link } from 'react-router-dom'

const PublicNav = ({ showSections = false, onNavClick }) => {
  return (
    <header className="landing-nav">
      <Link className="brand" to="/">BugTracker<span>+</span></Link>
      {showSections ? (
        <nav>
          <a href="#features" onClick={(e) => onNavClick?.(e, 'features')}>Features</a>
          <a href="#workflow" onClick={(e) => onNavClick?.(e, 'workflow')}>Workflow</a>
          <a href="#roles" onClick={(e) => onNavClick?.(e, 'roles')}>Roles</a>
          <a href="#reports" onClick={(e) => onNavClick?.(e, 'reports')}>Reports</a>
        </nav>
      ) : (
        <div className="nav-placeholder" />
      )}
      <div className="actions">
        <Link className="ghost" to="/login">Sign in</Link>
        <Link className="primary" to="/register">Create account</Link>
      </div>
    </header>
  )
}

export default PublicNav
