import React from 'react'
import { Link } from 'react-router-dom'

const PublicNav = ({ showSections = false, onNavClick }) => {
  const handleBrandClick = (e) => {
    if (showSections && onNavClick) {
      e.preventDefault()
      onNavClick(e, 'top')
    }
  }

  return (
    <header className="landing-nav">
      {showSections ? (
        <a className="brand" href="#top" onClick={handleBrandClick}>BugTracker<span>+</span></a>
      ) : (
        <Link className="brand" to="/">BugTracker<span>+</span></Link>
      )}
      {showSections ? (
        <nav>
          <a href="#problem" onClick={(e) => onNavClick?.(e, 'problem')}>Problem</a>
          <a href="#features" onClick={(e) => onNavClick?.(e, 'features')}>Features</a>
          <a href="#workflow" onClick={(e) => onNavClick?.(e, 'workflow')}>Workflow</a>
          <a href="#cta" onClick={(e) => onNavClick?.(e, 'cta')}>Get Started</a>
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
