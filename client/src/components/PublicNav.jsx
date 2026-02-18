import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'

const MOBILE_MENU_ID = 'landing-nav-mobile-menu'

const PublicNav = ({ showSections = false, onNavClick }) => {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const handleBrandClick = (e) => {
    if (showSections && onNavClick) {
      e.preventDefault()
      onNavClick(e, 'top')
    }
    closeMenu()
  }

  const handleNavLinkClick = (e, section) => {
    onNavClick?.(e, section)
    closeMenu()
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 600) setMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeMenu()
    }
    if (menuOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [menuOpen, closeMenu])

  return (
    <header className={`landing-nav ${menuOpen ? 'menu-open' : ''}`}>
      {showSections ? (
        <a className="brand" href="#top" onClick={handleBrandClick}>BugTracker<span>+</span></a>
      ) : (
        <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>BugTracker<span>+</span></Link>
      )}
      {showSections ? (
        <nav className="landing-nav-desktop">
          <a href="#problem" onClick={(e) => onNavClick?.(e, 'problem')}>Problem</a>
          <a href="#features" onClick={(e) => onNavClick?.(e, 'features')}>Features</a>
          <a href="#workflow" onClick={(e) => onNavClick?.(e, 'workflow')}>Workflow</a>
          <a href="#cta" onClick={(e) => onNavClick?.(e, 'cta')}>Get Started</a>
        </nav>
      ) : (
        <div className="nav-placeholder" />
      )}
      <div className="actions landing-nav-actions-desktop">
        <Link className="ghost" to="/login">Sign in</Link>
        <Link className="primary" to="/register">Create account</Link>
      </div>
      <button
        type="button"
        className="landing-nav-toggle"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-controls={MOBILE_MENU_ID}
        onClick={() => setMenuOpen((o) => !o)}
      >
        <span className="hamburger-line" aria-hidden />
        <span className="hamburger-line" aria-hidden />
        <span className="hamburger-line" aria-hidden />
      </button>
      <div id={MOBILE_MENU_ID} className="landing-nav-mobile-menu" role="region" aria-label="Mobile navigation">
        {showSections && (
          <nav className="landing-nav-mobile-links">
            <a href="#problem" onClick={(e) => handleNavLinkClick(e, 'problem')}>Problem</a>
            <a href="#features" onClick={(e) => handleNavLinkClick(e, 'features')}>Features</a>
            <a href="#workflow" onClick={(e) => handleNavLinkClick(e, 'workflow')}>Workflow</a>
            <a href="#cta" onClick={(e) => handleNavLinkClick(e, 'cta')}>Get Started</a>
          </nav>
        )}
        <div className="landing-nav-mobile-actions">
          <Link className="ghost" to="/login" onClick={closeMenu}>Sign in</Link>
          <Link className="primary" to="/register" onClick={closeMenu}>Create account</Link>
        </div>
      </div>
    </header>
  )
}

export default PublicNav
