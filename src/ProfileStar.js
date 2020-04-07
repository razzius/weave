// @flow
import React from 'react'

export default ({
  onClick,
  active,
}: {
  onClick: ?Function,
  active: boolean,
}) => (
  <img
    tabIndex="1"
    alt="Star"
    className={`profile-star ${active ? 'active' : ''}`}
    src="/assets/star-outline.png"
    onClick={onClick}
    onKeyDown={e => {
      e.preventDefault()
      if ((e.key === 'Enter' || e.key === ' ') && onClick) {
        onClick()
      }
    }}
  />
)
