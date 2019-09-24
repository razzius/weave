// @flow
import React from 'react'
import { Link } from 'react-router-dom'

type Props = any

const Button = ({ to, onClick, children, ...props }: Props) => {
  if (to) {
    return (
      <Link className="button next-button" to={to}>
        {props.text}
      </Link>
    )
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="button next-button"
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
