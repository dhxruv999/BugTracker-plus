import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const TopNav = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  if (!user) return null

  return (
    <header className="topnav">
      <div className="brand">BugTracker<span>+</span></div>
      <nav>
        <Link className={location.pathname === '/dashboard' ? 'active' : ''} to="/dashboard">Dashboard</Link>
        <Link className={location.pathname === '/bugs' ? 'active' : ''} to="/bugs">Bugs</Link>
        <Link className={location.pathname === '/reports' ? 'active' : ''} to="/reports">Reports</Link>
      </nav>
      <div className="profile">
        <span>{user.name} · {user.role}</span>
        <button className="ghost" onClick={logout}>Sign out</button>
      </div>
    </header>
  )
}

export default TopNav
