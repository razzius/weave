import React from 'react'

export default function ProfileStar({ onClick, active }) {
  const starActive = new URL('./assets/star-active.svg', import.meta.url)
  const starInactive = new URL('./assets/star-inactive.svg', import.meta.url)

  return (
    <input
      type="image"
      alt="Star"
      className={`profile-star ${active ? 'active' : ''}`}
      src={active ? starActive : starInactive}
      onClick={onClick}
    />
  )
}
