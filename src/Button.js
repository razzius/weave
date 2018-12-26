import React from 'react'
import { Link } from 'react-router-dom'

// todo deprecate NextButton
const Button = props => {
  if (props.to) {
    return (
      <Link className="button next-button" to={props.to}>
        {props.text}
      </Link>
    )
  }
  return (
    <button onClick={props.onClick} className="button next-button" {...props}>
      {props.children}
    </button>
  )
}

export default Button
