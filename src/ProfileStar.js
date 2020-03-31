// @flow
import React from 'react'

export default ({ onClick, active }: { onClick: Function, active: boolean }) => (
  <img
    alt="Star"
    className={`profile-star ${active ? 'active' : ''}`}
    src="/assets/star-outline.png"
    onClick={onClick}
  />
)
