import React from 'react'
import Avatar from 'react-avatar'

const ProfileAvatar = ({ profileImageUrl, name }) => (
  <div className="avatar">
    {profileImageUrl ? (
      <img
        alt="Profile"
        className="profile-image column"
        src={profileImageUrl}
      />
    ) : (
      <Avatar name={name} size={200} round textSizeRatio={3} />
    )}
  </div>
)

export default ProfileAvatar
