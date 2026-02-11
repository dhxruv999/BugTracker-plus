import React from 'react'

const StatCard = ({ label, value, accent }) => (
  <div className="stat-card" style={{ borderColor: accent }}>
    <p>{label}</p>
    <h3>{value}</h3>
  </div>
)

export default StatCard
