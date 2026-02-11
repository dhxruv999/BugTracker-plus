import React from 'react'

const Reports = () => {
  const downloadCsv = () => {
    const token = localStorage.getItem('bt_token')
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
    const url = `${baseUrl}/reports/bugs.csv`

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.blob())
      .then((blob) => {
        const href = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = href
        link.download = 'bugs-report.csv'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(href)
      })
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Reports & Exports</h2>
          <p>Generate CSV exports for audits and evaluations.</p>
        </div>
      </div>

      <div className="card">
        <h3>Bug Export</h3>
        <p>Download a CSV snapshot of all tracked bugs.</p>
        <button className="primary" onClick={downloadCsv}>Export CSV</button>
      </div>
    </div>
  )
}

export default Reports
