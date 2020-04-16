// @flow
import React from 'react'

export default ({
  onClick,
  active,
}: {
  onClick?: Function,
  active: boolean,
}) => (
  <input
    type="image"
    alt="Star"
    className={`profile-star ${active ? 'active' : ''}`}
    src={active ? "/assets/star-active.svg" : '/assets/star-inactive.svg'}
    onClick={onClick}
  />
)
