import React from 'react'
import Avatar from 'react-avatar'

const ProfileAvatar = ({profileImageUrl, name}) =>
  profileImageUrl ? (
    <img alt="Profile" className="profile-image column" src={profileImageUrl} />
  ) : (
    <Avatar name={name} size={200} round textSizeRatio={3} />
  )

export default ProfileAvatar
