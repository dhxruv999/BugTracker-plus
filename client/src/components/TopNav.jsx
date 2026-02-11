import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

const TopNav = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [pendingCount, setPendingCount] = useState(0)

  const isAdmin = user?.role === 'org_admin' || user?.role === 'project_admin'
  const roleLabelMap = {
    org_admin: 'Org Admin',
    project_admin: 'Project Admin',
    developer: 'Developer',
    tester: 'Tester'
  }
  const roleLabel = user ? (roleLabelMap[user.role] || user.role) : ''

  useEffect(() => {
    if (!user || !isAdmin) {
      setPendingCount(0)
      return undefined
    }

    let isMounted = true

    const fetchPending = async () => {
      try {
        const { data } = await api.get('/users/alerts-count')
        if (isMounted) setPendingCount(Number(data?.total || 0))
      } catch (err) {
        if (isMounted) setPendingCount(0)
      }
    }

    fetchPending()
    const interval = setInterval(fetchPending, 30000)
    const handler = () => fetchPending()
    window.addEventListener('pending-approvals-updated', handler)

    return () => {
      isMounted = false
      clearInterval(interval)
      window.removeEventListener('pending-approvals-updated', handler)
    }
  }, [isAdmin, location.pathname, user])

  if (!user) return null

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
            {pendingCount > 0 && (
              <span className="nav-badge" aria-label={`${pendingCount} pending approvals`} title={`${pendingCount} pending approvals`}>
                {pendingCount}
              </span>
            )}
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
