import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const TopNav = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  if (!user) return null

  const isAdmin = user.role === 'org_admin' || user.role === 'project_admin'
  const roleLabelMap = {
    org_admin: 'Org Admin',
    project_admin: 'Project Admin',
    developer: 'Developer',
    tester: 'Tester'
  }
  const roleLabel = roleLabelMap[user.role] || user.role

  return (
    <header className="topnav">
      <div className="brand">BugTracker<span>+</span></div>
      <nav>
        <Link className={location.pathname === '/dashboard' ? 'active' : ''} to="/dashboard">Dashboard</Link>
        <Link className={location.pathname === '/bugs' ? 'active' : ''} to="/bugs">Bugs</Link>
        <Link className={location.pathname === '/reports' ? 'active' : ''} to="/reports">Reports</Link>
        {isAdmin && (
          <Link className={location.pathname.startsWith('/admin') ? 'active' : ''} to="/admin/users">
            User Management
          </Link>
        )}
      </nav>
      <div className="profile">
        <Link className="profile-link" to="/account">{user.name} · {roleLabel}</Link>
        <button className="ghost" onClick={logout}>Sign out</button>
      </div>
    </header>
  )
}

export default TopNav
