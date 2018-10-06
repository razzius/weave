import React from 'react'
import { Link } from 'react-router-dom'

const NextButton = props => {
  if (props.to) {
    return (
      <Link className="button next-button" to={props.to}>
        {props.text}
      </Link>
    )
  }
  return (
    <button onClick={props.onClick} className="button next-button">
      {props.text}
    </button>
  )
}

export default NextButton
