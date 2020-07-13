import React from 'react'
import { Link } from 'react-router-dom'

function getLinkUrl(account) {
  if (account.isMentor) {
    if (account.profileId) {
      return `/profiles/${account.profileId}`
    }
    return 'create-profile'
  }
  if (account.profileId) {
    return `/peer-profiles/${account.profileId}`
  }
  return 'create-peer-profile'
}

const OwnProfileLink = account => {
  const linkText = account.profileId ? 'My Profile' : 'Create Profile'
  const linkUrl = getLinkUrl(account)
  return (
    <Link to={linkUrl} className="App-title">
      {linkText}
    </Link>
  )
}

export default OwnProfileLink
