import React from 'react'
import Avatar from 'react-avatar'

const ProfileAvatar = ({ profileImageUrl, name, size }) => (
  profileImageUrl ? (
    <img
      alt="Profile"
      className="profile-image column"
      style={{padding: '20px'}}
      src={profileImageUrl}
      />
  ) : (
    <Avatar style={{padding: '20px'}} name={name} size={size} round textSizeRatio={3} />
  )
)

export default ProfileAvatar
