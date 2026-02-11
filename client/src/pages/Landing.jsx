import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import PublicNav from '../components/PublicNav'

const Landing = () => {
  const [activeRole, setActiveRole] = useState('project_admin')
  const [metrics, setMetrics] = useState({
    totalBugs: 0,
    statusCounts: {},
    pendingApprovals: 0
  })

  const roleContent = useMemo(
    () => ({
      org_admin: {
        title: 'Organization Admin',
        subtitle: 'Ownership, security, and escalation control.',
        points: [
          'Approve Project Admins and safeguard resets with the security phrase.',
          'Oversee every project, report, and escalation path.',
          'Promote or reassign leadership without breaking compliance.'
        ]
      },
      project_admin: {
        title: 'Project Admin',
        subtitle: 'Run day-to-day delivery with clear guardrails.',
        points: [
          'Approve Developers and Testers in seconds.',
          'Assign bugs to the right engineer and unblock sprints.',
          'Update any issue state with structured transitions.'
        ]
      },
      developer: {
        title: 'Developer',
        subtitle: 'Focus on ownership, not paperwork.',
        points: [
          'Work only on bugs assigned to you.',
          'Move issues from Open → In Progress → Resolved.',
          'Keep the trail clean with comments and updates.'
        ]
      },
      tester: {
        title: 'Tester',
        subtitle: 'Ship quality with structured feedback.',
        points: [
          'Create precise bug tickets with evidence.',
          'Reopen or close resolved items after verification.',
          'Track coverage with dashboards and reports.'
        ]
      }
    }),
    []
  )

  const active = roleContent[activeRole]

  const handleScroll = (e, targetId) => {
    e.preventDefault()
    const target = document.getElementById(targetId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.history.replaceState(null, '', `#${targetId}`)
    }
  }

  useEffect(() => {
    let isMounted = true
    const fetchMetrics = async () => {
      try {
        const { data } = await api.get('/public/metrics')
        if (isMounted) {
          setMetrics({
            totalBugs: data?.totalBugs || 0,
            statusCounts: data?.statusCounts || {},
            pendingApprovals: data?.pendingApprovals || 0
          })
        }
      } catch (err) {
        if (isMounted) {
          setMetrics((prev) => ({ ...prev }))
        }
      }
    }
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 30000)
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  const total = metrics.totalBugs || 0
  const countOpen = metrics.statusCounts?.Open || 0
  const countInProgress = metrics.statusCounts?.['In Progress'] || 0
  const countResolved = metrics.statusCounts?.Resolved || 0
  const pendingApprovals = metrics.pendingApprovals || 0
  const percent = (value) => {
    if (!total) return '0%'
    return `${Math.round((value / total) * 100)}%`
  }

  return (
    <div className="landing-page">
      <PublicNav showSections onNavClick={handleScroll} />

      <section className="hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">BugTracker+</p>
            <h1>Classy, approval-driven bug flow for modern product teams.</h1>
            <p className="lead">
              BugTracker+ keeps approvals, roles, and accountability sharp—so your team ships with confidence,
              without losing the paper trail.
            </p>
            <div className="hero-actions">
              <Link className="primary" to="/register">Create account</Link>
              <Link className="ghost" to="/login">I already have access</Link>
            </div>
            <div className="hero-stats">
              <div>
                <h3>{total}</h3>
                <p>Total bugs</p>
              </div>
              <div>
                <h3>{countOpen}</h3>
                <p>Open bugs</p>
              </div>
              <div>
                <h3>{pendingApprovals}</h3>
                <p>Pending approvals</p>
              </div>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-header">
              <span className="pulse" />
              <p>Approval-Driven Workflow Mini Kanban Board</p>
              <span className="tag">Current data</span>
            </div>
            <div className="hero-card-body">
              <div className="metric">
                <div className="metric-row">
                  <span>Open</span>
                  <strong>{countOpen}</strong>
                </div>
                <div className="bar">
                  <div className="fill" style={{ width: percent(countOpen) }} />
                </div>
              </div>
              <div className="metric">
                <div className="metric-row">
                  <span>In Progress</span>
                  <strong>{countInProgress}</strong>
                </div>
                <div className="bar">
                  <div className="fill alt" style={{ width: percent(countInProgress) }} />
                </div>
              </div>
              <div className="metric">
                <div className="metric-row">
                  <span>Resolved</span>
                  <strong>{countResolved}</strong>
                </div>
                <div className="bar">
                  <div className="fill warn" style={{ width: percent(countResolved) }} />
                </div>
              </div>
              <div className="metric">
                <div className="metric-row">
                  <span>Pending approvals</span>
                  <strong>{pendingApprovals}</strong>
                </div>
                <div className="bar">
                  <div className="fill warn" style={{ width: percent(pendingApprovals) }} />
                </div>
              </div>
            </div>
            <div className="hero-card-footer">
              <p>Clean, fast, and aligned with real workflows.</p>
            </div>
          </div>
        </div>
        <div className="hero-orbits">
          <span className="orbit dot-1" />
          <span className="orbit dot-2" />
          <span className="orbit dot-3" />
        </div>
      </section>

      <section className="section" id="features">
        <div className="section-title">
          <h2>Core Features, elevated</h2>
          <p>Everything you asked for, polished to feel enterprise-grade.</p>
        </div>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Approval-first access</h3>
            <p>First user becomes Org Admin, everyone else is reviewed before they touch a ticket.</p>
          </div>
          <div className="feature-card">
            <h3>Structured transitions</h3>
            <p>Open → In Progress → Resolved → Closed, with controlled reopen for QA.</p>
          </div>
          <div className="feature-card">
            <h3>Assign + trace</h3>
            <p>Every assignment records who assigned it. Perfect for accountability.</p>
          </div>
          <div className="feature-card">
            <h3>Soft delete & audit logs</h3>
            <p>Nothing disappears — issues and comments remain recoverable.</p>
          </div>
        </div>
      </section>

      <section className="section workflow" id="workflow">
        <div className="section-title">
          <h2>Workflow that matches real teams</h2>
          <p>Designed for QA, Engineering, and Leadership in one loop.</p>
        </div>
        <div className="workflow-grid">
          <div className="workflow-card">
            <h4>1. Submit</h4>
            <p>Testers create tickets with screenshots, priority, and impact.</p>
          </div>
          <div className="workflow-card">
            <h4>2. Assign</h4>
            <p>Project Admins allocate ownership to developers instantly.</p>
          </div>
          <div className="workflow-card">
            <h4>3. Resolve</h4>
            <p>Developers move the issue to Resolved with full context.</p>
          </div>
          <div className="workflow-card">
            <h4>4. Verify</h4>
            <p>Testers close or reopen with feedback and comments.</p>
          </div>
        </div>
      </section>

      <section className="section role-section" id="roles">
        <div className="section-title">
          <h2>Role clarity, zero confusion</h2>
          <p>Switch between roles to see what each user can do.</p>
        </div>
        <div className="role-switch">
          <button className={activeRole === 'org_admin' ? 'active' : ''} onClick={() => setActiveRole('org_admin')}>
            Org Admin
          </button>
          <button className={activeRole === 'project_admin' ? 'active' : ''} onClick={() => setActiveRole('project_admin')}>
            Project Admin
          </button>
          <button className={activeRole === 'developer' ? 'active' : ''} onClick={() => setActiveRole('developer')}>
            Developer
          </button>
          <button className={activeRole === 'tester' ? 'active' : ''} onClick={() => setActiveRole('tester')}>
            Tester
          </button>
        </div>
        <div className="role-panel">
          <h3>{active.title}</h3>
          <p className="role-subtitle">{active.subtitle}</p>
          <div className="role-points">
            {active.points.map((point) => (
              <div key={point} className="role-point">
                <span className="dot" />
                <p>{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section reports" id="reports">
        <div className="section-title">
          <h2>Reports that speak for you</h2>
          <p>Export CSVs, visualize trends, and share quarterly QA insights.</p>
        </div>
        <div className="report-grid">
          <div className="report-card">
            <h4>Status distribution</h4>
            <div className="stack">
              <span style={{ width: '38%' }} />
              <span style={{ width: '26%' }} />
              <span style={{ width: '24%' }} />
              <span style={{ width: '12%' }} />
            </div>
            <p>Instant view of Open vs Closed velocity.</p>
          </div>
          <div className="report-card">
            <h4>Priority heat</h4>
            <div className="heat">
              <span />
              <span />
              <span />
              <span />
            </div>
            <p>Spot critical issues before they hit production.</p>
          </div>
          <div className="report-card">
            <h4>CSV export ready</h4>
            <p>One click to share a clean audit trail with leadership.</p>
            <Link className="ghost" to="/login">Export demo</Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        © {new Date().getFullYear()} BugTracker+. All rights reserved.
      </footer>
    </div>
  )
}

export default Landing
