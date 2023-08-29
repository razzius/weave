import React from 'react'
import Avatar from 'react-avatar'

function ProfileAvatar({ imageUrl, name, size }) {
  return imageUrl ? (
    <img
      alt="Profile"
      className="profile-image column"
      style={{ padding: '20px', flexBasis: '200px', flexShrink: '0' }}
      src={imageUrl}
    />
  ) : (
    <Avatar
      style={{ padding: '20px' }}
      name={name}
      size={size}
      round
      textSizeRatio={3}
    />
  )
}

export default ProfileAvatar
