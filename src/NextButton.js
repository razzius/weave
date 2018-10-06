import React from 'react'
import { Link } from 'react-router-dom'


const NextButton = props => (
  <Link to={props.href} onClick={props.onClick} className="button next-button">
    {props.text}
  </Link>
)

export default NextButton
