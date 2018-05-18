import React from "react"

const NextButton = props => (
  <a href={props.href} onClick={props.onClick} className="button next-button">
    {props.text}
  </a>
)

export default NextButton
