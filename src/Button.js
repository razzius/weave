// @flow
import React from 'react'
import { Link } from 'react-router-dom'

type Props = any

const Button = ({ to, onClick, children, style, disabled }: Props) => {
  if (to) {
    return (
      <Link className="button next-button" to={to}>
        {children}
      </Link>
    )
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="button next-button"
      style={style}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
