import React from 'react'

export default ({ children, className = '' }) => (
  <div className={`App-body ${className}`}>{children}</div>
)
