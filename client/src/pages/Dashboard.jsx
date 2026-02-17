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
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import StatCard from '../components/StatCard'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const Dashboard = () => {
  const [summary, setSummary] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoading(true)
        const { data } = await api.get('/dashboard/summary')
        setSummary(data)
      } catch (error) {
        console.error('Failed to fetch dashboard summary:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSummary()
  }, [])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed.y || context.parsed}`
          }
        }
      }
    },
    onHover: (event, activeElements) => {
      event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default'
    }
  }

  const doughnutOptions = {
    ...chartOptions,
    cutout: '60%',
    plugins: {
      ...chartOptions.plugins,
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          padding: 15,
          font: {
            size: 12
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      }
    }
  }

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
          backgroundColor: ['#ffb703', '#219ebc', '#8ecae6', '#adb5bd', '#ef476f'],
          borderColor: ['#ffb703', '#219ebc', '#8ecae6', '#adb5bd', '#ef476f'],
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
          hoverBackgroundColor: ['#ffc947', '#2db3d6', '#a5d8f0', '#c4d0d9', '#ff6b8a'],
          hoverBorderWidth: 3
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
          backgroundColor: ['#6c757d', '#ffd166', '#ef476f', '#c1121f'],
          borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
          borderWidth: 2,
          hoverBackgroundColor: ['#8a939b', '#ffe085', '#ff6b8a', '#e63946'],
          hoverBorderWidth: 3
        }
      ]
    }
  }, [summary])

  const handleStatCardClick = (status) => {
    if (status) {
      navigate(`/bugs?status=${encodeURIComponent(status)}`)
    }
  }

  if (isLoading) {
    return (
      <div className="page">
        <div className="dashboard-loading">
          <div className="loading-skeleton">
            <div className="skeleton-header" />
            <div className="skeleton-stats">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="skeleton-stat-card" />
              ))}
            </div>
            <div className="skeleton-charts">
              <div className="skeleton-chart" />
              <div className="skeleton-chart" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!summary) {
    return <div className="page"><div className="card">Failed to load dashboard data.</div></div>
  }

  return (
    <div className="page dashboard-page">
      <div className="page-header">
        <div>
          <h2>Team Overview</h2>
          <p>Stay on top of active bugs and resolution velocity.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard 
          label="Total Bugs" 
          value={summary.total} 
          accent="#f77f00"
          onClick={() => navigate('/bugs')}
        />
        {summary.byStatus.map((item) => (
          <StatCard 
            key={item.status} 
            label={item.status} 
            value={item.count} 
            accent="#4cc9f0"
            onClick={() => handleStatCardClick(item.status)}
          />
        ))}
      </div>

      <div className="chart-grid">
        <div className="card chart-card">
          <h3>Status Distribution</h3>
          <div className="chart-container">
            {statusChart && <Bar data={statusChart} options={chartOptions} />}
          </div>
        </div>
        <div className="card chart-card">
          <h3>Priority Mix</h3>
          <div className="chart-container">
            {priorityChart && <Doughnut data={priorityChart} options={doughnutOptions} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
