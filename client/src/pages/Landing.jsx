import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PublicNav from '../components/PublicNav'

const Landing = () => {
  const [activeSpotlight, setActiveSpotlight] = useState(0)
  const [activeProblem, setActiveProblem] = useState(0)
  const [activeStep, setActiveStep] = useState(0)

  const spotlights = [
    {
      title: 'Approvals',
      metric: 'New users stay pending until approved',
      detail: 'Keep access controlled so every role is verified before joining the organization.',
      bullets: ['Pending queue visibility', 'Role assignment controls', 'Approval accountability']
    },
    {
      title: 'Assignments',
      metric: 'Clear ownership for every issue',
      detail: 'Assign with confidence and always know who owns the next action.',
      bullets: ['Owner visibility', 'Assignment tracking', 'Priority alignment']
    },
    {
      title: 'Reporting',
      metric: 'Leadership-ready visibility',
      detail: 'Track progress, surface bottlenecks, and export clean reports.',
      bullets: ['Progress snapshots', 'Audit-ready exports', 'Trend visibility']
    }
  ]

  const problemPairs = [
    {
      title: 'Role Confusion',
      problem: 'Unclear permissions lead to security risks and workflow breakdowns.',
      solution: '4-tier role hierarchy with enforced boundaries and clear permissions.',
      fixes: ['Role-based access control', 'Enforced status transitions']
    },
    {
      title: 'Uncontrolled Access',
      problem: 'Anyone can join without verification, creating security vulnerabilities.',
      solution: 'Mandatory admin approval ensures only trusted team members gain access.',
      fixes: ['Pending approval queue', 'Role assignment on approval']
    },
    {
      title: 'Lost Assignments',
      problem: 'Hard to track ownership, leading to bugs sitting unaddressed.',
      solution: 'Clear assignment tracking with visible ownership and workload visibility.',
      fixes: ['Assignment history', 'Dashboard workload tracking']
    },
    {
      title: 'Missing Audit Trail',
      problem: 'Status changes and decisions disappear without context.',
      solution: 'Complete audit trail with timestamped actions and exportable reports.',
      fixes: ['Activity history', 'Exportable reports']
    }
  ]

  const features = [
    {
      title: 'Role-Based Access',
      detail: 'Org Admin, Project Admin, Developer, Tester hierarchy.'
    },
    {
      title: 'Approval Workflow',
      detail: 'New accounts require admin approval before access.'
    },
    {
      title: 'Controlled Status Transitions',
      detail: 'Enforced lifecycle rules based on role.'
    },
    {
      title: 'Comment System',
      detail: 'Structured collaboration with recoverable history.'
    },
    {
      title: 'Dashboard and Reports',
      detail: 'Real-time stats plus CSV export for audits.'
    },
    {
      title: 'Ownership Visibility',
      detail: 'Assignments stay visible with clear accountability.'
    }
  ]

  const steps = [
    {
      title: 'Register & Request Access',
      detail: 'New users sign up and wait for admin approval. Your account stays in pending status until verified.',
      points: ['Secure registration', 'Pending approval queue', 'Role assignment on approval']
    },
    {
      title: 'Admin Approval',
      detail: 'Org Admins or Project Admins review and approve new members, assigning appropriate roles.',
      points: ['Review pending users', 'Assign roles (Developer/Tester)', 'Activate accounts']
    },
    {
      title: 'Create & Assign Bugs',
      detail: 'Testers create bugs, Project Admins assign them to Developers based on priority and expertise.',
      points: ['Tester creates bug reports', 'Admin assigns to Developer', 'Priority-based routing']
    },
    {
      title: 'Track & Resolve',
      detail: 'Developers update status, move bugs through lifecycle, and generate reports for insights.',
      points: ['Status transitions', 'Lifecycle tracking', 'Export reports']
    }
  ]

  const handleScroll = (e, targetId) => {
    e.preventDefault()
    const target = document.getElementById(targetId)
    if (target) {
      const navHeight = 72 // var(--nav-height)
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      })
      window.history.replaceState(null, '', `#${targetId}`)
    }
  }

  const activeSpotlightItem = spotlights[activeSpotlight]
  const activeProblemItem = problemPairs[activeProblem]
  const activeStepItem = steps[activeStep]

  useEffect(() => {
    // Trigger animation when problem changes
    const solutionCard = document.querySelector('.solution-card')
    if (solutionCard) {
      solutionCard.classList.remove('fade-in')
      setTimeout(() => {
        solutionCard.classList.add('fade-in')
      }, 10)
    }
  }, [activeProblem])

  useEffect(() => {
    // Trigger animation when step changes
    const stepperPanel = document.querySelector('.stepper-panel')
    if (stepperPanel) {
      stepperPanel.classList.remove('fade-in')
      setTimeout(() => {
        stepperPanel.classList.add('fade-in')
      }, 10)
    }
  }, [activeStep])

  const goNext = () => {
    setActiveSpotlight((prev) => (prev + 1) % spotlights.length)
  }

  const goPrev = () => {
    setActiveSpotlight((prev) => (prev - 1 + spotlights.length) % spotlights.length)
  }

  return (
    <div className="landing-page landing-v2">
      <PublicNav showSections onNavClick={handleScroll} />

      <section className="hero" id="top">
        <div className="hero-grid">
          <div className="hero-copy">
            <h1>Track Bugs Precisely. Control Teams Securely.</h1>
            <p className="lead">
              A focused bug tracking system with role-based workflows, approvals, and clear accountability.
            </p>
            <div className="hero-actions">
              <Link className="primary" to="/register">Get Started</Link>
              <Link className="ghost" to="/login">Login</Link>
            </div>
            <div className="hero-metrics">
              <div className="metric-card">
                <h3>Approval-first access</h3>
                <p>Every new account is reviewed.</p>
              </div>
              <div className="metric-card">
                <h3>Role-driven workflow</h3>
                <p>Clear responsibilities at each level.</p>
              </div>
              <div className="metric-card">
                <h3>Audit-ready trail</h3>
                <p>Updates remain traceable and accountable.</p>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-header">
              <span>Product Focus</span>
              <span className="visual-tag">Interactive</span>
            </div>
            <div className="visual-body">
              <div className="spotlight-tabs">
                {spotlights.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    className={`spotlight-tab ${index === activeSpotlight ? 'active' : ''}`}
                    onClick={() => setActiveSpotlight(index)}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
              <div className="spotlight-panel">
                <h3>{activeSpotlightItem.title}</h3>
                <p>{activeSpotlightItem.detail}</p>
                <span className="spotlight-metric">{activeSpotlightItem.metric}</span>
                <ul className="spotlight-list">
                  {activeSpotlightItem.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="spotlight-actions">
                <button type="button" className="ghost" onClick={goPrev}>Previous</button>
                <button type="button" className="primary" onClick={goNext}>Next</button>
              </div>
            </div>
            <div className="visual-footer">
              Click a tab or cycle through the focus areas.
            </div>
          </div>
        </div>
      </section>

      <section className="section problem" id="problem">
        <div className="problem-layout">
          <div className="problem-tabs">
            <h2>Why Traditional Bug Tracking Fails</h2>
            <p className="problem-intro">Traditional bug trackers lack structure, leading to confusion, security risks, and lost accountability. See how BugTracker+ solves these critical problems.</p>
            <div className="problem-tab-list">
              {problemPairs.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  className={`problem-tab ${index === activeProblem ? 'active' : ''}`}
                  onClick={() => setActiveProblem(index)}
                  onMouseEnter={() => {
                    if (index !== activeProblem) {
                      document.querySelectorAll('.problem-tab')[index].style.transform = 'translateX(4px)'
                    }
                  }}
                  onMouseLeave={() => {
                    if (index !== activeProblem) {
                      document.querySelectorAll('.problem-tab')[index].style.transform = ''
                    }
                  }}
                >
                  <span className="problem-tab-icon">
                    {index === activeProblem ? '✓' : index + 1}
                  </span>
                  <div className="problem-tab-content">
                    <span className="problem-tab-title">{item.title}</span>
                    <span className="problem-sub">{item.problem.substring(0, 100)}...</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className={`solution-card ${activeProblem === 0 ? 'fade-in' : ''}`} key={activeProblem}>
            <div className="solution-header">
              <span className="solution-kicker">BugTracker+ Solution</span>
            </div>
            <h3>{activeProblemItem.title}</h3>
            <div className="problem-vs-solution">
              <div className="problem-box">
                <div className="problem-label">Problem</div>
                <p className="problem-detail">{activeProblemItem.problem}</p>
              </div>
              <div className="solution-arrow">→</div>
              <div className="solution-box">
                <div className="solution-label">Solution</div>
                <p className="solution-detail">{activeProblemItem.solution}</p>
              </div>
            </div>
            <ul className="solution-list">
              {activeProblemItem.fixes.map((item, fixIndex) => (
                <li key={item} style={{ animationDelay: `${fixIndex * 0.1}s` }}>
                  <span className="fix-icon">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section" id="features">
        <div className="section-title">
          <h2>Key Features</h2>
          <p>Clean, secure, and easy to explain.</p>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <div key={feature.title} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section workflow" id="workflow">
        <div className="section-title">
          <h2>How It Works</h2>
          <p>A simple 4-step workflow that keeps your team organized.</p>
        </div>
        <div className="stepper">
          <div className="stepper-tabs">
            {steps.map((step, index) => (
              <button
                key={step.title}
                type="button"
                className={`stepper-tab ${index === activeStep ? 'active' : ''}`}
                onClick={() => setActiveStep(index)}
              >
                <span className="step-number">{index + 1}</span>
                <div className="step-content">
                  <span className="step-title">{step.title}</span>
                </div>
              </button>
            ))}
          </div>
          <div className={`stepper-panel ${activeStep === 0 ? 'fade-in' : ''}`} key={activeStep}>
            <div className="stepper-header">
              <span className="step-badge">Step {activeStep + 1}</span>
            </div>
            <h3>{activeStepItem.title}</h3>
            <p>{activeStepItem.detail}</p>
            <div className="stepper-features">
              <ul className="stepper-list">
                {activeStepItem.points.map((item, pointIndex) => (
                  <li key={item} style={{ animationDelay: `${pointIndex * 0.1}s` }}>
                    <span className="step-check">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="cta" id="cta">
        <div className="cta-card">
          <div>
            <h2>Ready to streamline your bug management?</h2>
            <p>Make approvals, ownership, and reporting effortless.</p>
          </div>
          <div className="cta-actions">
            <Link className="primary" to="/register">Create Account</Link>
          </div>
        </div>
        <div className="cta-footer">
          <div className="footer-tagline">
            BugTracker+ | Structured Bug Lifecycle | Approval-Driven Access Control | Real-Time Dashboard Insights
          </div>
          <div className="footer-copy">© 2026 Dhruv Maheshwari. All rights reserved.</div>
        </div>
      </section>
    </div>
  )
}

export default Landing
