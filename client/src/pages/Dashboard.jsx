import React, { useEffect, useMemo, useState } from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'
import api from '../services/api'
import StatCard from '../components/StatCard'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const Dashboard = () => {
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    const fetchSummary = async () => {
      const { data } = await api.get('/dashboard/summary')
      setSummary(data)
    }
    fetchSummary()
  }, [])

  const statusChart = useMemo(() => {
    if (!summary) return null
    const labels = summary.byStatus.map((item) => item.status)
    const values = summary.byStatus.map((item) => item.count)
    return {
      labels,
      datasets: [
        {
          label: 'Bugs by Status',
          data: values,
          backgroundColor: ['#ffb703', '#219ebc', '#8ecae6', '#adb5bd', '#ef476f']
        }
      ]
    }
  }, [summary])

  const priorityChart = useMemo(() => {
    if (!summary) return null
    const labels = summary.byPriority.map((item) => item.priority)
    const values = summary.byPriority.map((item) => item.count)
    return {
      labels,
      datasets: [
        {
          label: 'Bugs by Priority',
          data: values,
          backgroundColor: ['#6c757d', '#ffd166', '#ef476f', '#c1121f']
        }
      ]
    }
  }, [summary])

  if (!summary) {
    return <div className="page"><div className="card">Loading dashboard...</div></div>
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Team Overview</h2>
          <p>Stay on top of active bugs and resolution velocity.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Bugs" value={summary.total} accent="#f77f00" />
        {summary.byStatus.map((item) => (
          <StatCard key={item.status} label={item.status} value={item.count} accent="#4cc9f0" />
        ))}
      </div>

      <div className="chart-grid">
        <div className="card">
          <h3>Status Distribution</h3>
          {statusChart && <Bar data={statusChart} />}
        </div>
        <div className="card">
          <h3>Priority Mix</h3>
          {priorityChart && <Doughnut data={priorityChart} />}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
