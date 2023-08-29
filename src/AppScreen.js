import React from 'react'

export default function AppScreen({ children, className = '' }) {
  return <div className={`App-body ${className}`}>{children}</div>
}
