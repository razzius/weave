// @flow
import React from 'react'
import Avatar from 'react-avatar'

type Props = {
  imageUrl: ?string,
  name: string,
  size: number,
}

const ProfileAvatar = ({ imageUrl, name, size }: Props) =>
  imageUrl ? (
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

export default ProfileAvatar
