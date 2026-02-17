import React, { useState, useEffect, useRef } from 'react'

const StatCard = ({ label, value, accent, onClick }) => {
  const [displayValue, setDisplayValue] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef(null)

  useEffect(() => {
    const targetValue = typeof value === 'number' ? value : parseInt(value) || 0
    const duration = 1000
    const steps = 60
    const increment = targetValue / steps
    const stepDuration = duration / steps

    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= targetValue) {
        setDisplayValue(targetValue)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [value])

  return (
    <div
      ref={cardRef}
      className={`stat-card ${onClick ? 'stat-card-clickable' : ''} ${isHovered ? 'stat-card-hovered' : ''}`}
      style={{ 
        borderColor: accent,
        '--accent-color': accent,
        cursor: onClick ? 'pointer' : 'default'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <p>{label}</p>
      <h3>{displayValue}</h3>
      <div className="stat-card-glow" style={{ backgroundColor: accent }} />
    </div>
  )
}

export default StatCard
