import React from 'react'
import Avatar from 'react-avatar'

const ProfileAvatar = ({ imageUrl, name, size }) =>
  imageUrl ? (
    <img
      alt="Profile"
      className="profile-image column"
      style={{ padding: '20px' }}
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

export default ProfileAvatar
