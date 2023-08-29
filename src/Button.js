import React from 'react'
import { Link } from 'react-router-dom'

const Button = ({ to, onClick, children, style, disabled }) => {
  if (to) {
    return (
      <Link className="button" to={to}>
        {children}
      </Link>
    )
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="button"
      style={style}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
