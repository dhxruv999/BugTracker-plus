import React, { useState } from 'react'
import { API_BASE_URL } from '../services/api'

const Reports = () => {
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

  const downloadCsv = async () => {
    setIsExporting(true)
    setExportSuccess(false)
    const token = localStorage.getItem('bt_token')
    const url = `${API_BASE_URL}/reports/bugs.csv`

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Export failed')
      }

      const blob = await response.blob()
      const href = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = href
      link.download = `bugs-report-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(href)
      
      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 3000)
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="page reports-page">
      <div className="page-header">
        <div>
          <h2>Reports & Exports</h2>
          <p>Generate CSV exports for audits and evaluations.</p>
        </div>
      </div>

      <div className="reports-grid">
        <div className="card card-animate export-card">
          <div className="export-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
          <h3>Bug Export</h3>
          <p>Your export respects role-based access (assigned or created bugs only).</p>
          <div className="export-info">
            <div className="info-item">
              <span className="info-label">Format:</span>
              <span className="info-value">CSV</span>
            </div>
            <div className="info-item">
              <span className="info-label">Includes:</span>
              <span className="info-value">All bug details, status, priority, assignments</span>
            </div>
          </div>
          <button 
            className={`primary export-btn ${isExporting ? 'loading' : ''} ${exportSuccess ? 'success' : ''}`}
            onClick={downloadCsv}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <span className="spinner" />
                Exporting...
              </>
            ) : exportSuccess ? (
              <>
                <span className="success-icon">✓</span>
                Export Complete
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export CSV
              </>
            )}
          </button>
        </div>

        <div className="card card-animate info-card">
          <h3>Export Details</h3>
          <ul className="info-list">
            <li>
              <strong>Role-based filtering:</strong> Only bugs you're assigned to or created by you are included
            </li>
            <li>
              <strong>Complete data:</strong> All bug fields including status, priority, assignments, and timestamps
            </li>
            <li>
              <strong>Audit-ready:</strong> Formatted for easy import into spreadsheet applications
            </li>
            <li>
              <strong>Timestamped:</strong> File name includes export date for easy organization
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Reports
