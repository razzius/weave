// @flow
import React from 'react'
import ProfileView, { type BaseProfileData } from './ProfileView'

type Props = {
  data: BaseProfileData,
  firstTimePublish: boolean,
  onEdit: any => void,
  onPublish: any => any,
  token: string,
}

const PreviewProfile = (props: Props) => {
  const { data, firstTimePublish, onEdit, onPublish, token } = props

  return (
    <div>
      <ProfileView
        data={data}
        editing
        firstTimePublish={firstTimePublish}
        token={token}
      />
      <div>
        <button type="button" className="button" onClick={onEdit}>
          Edit
        </button>
        <button type="submit" className="button" onClick={onPublish}>
          {firstTimePublish ? 'Publish' : 'Save'} profile
        </button>
      </div>
    </div>
  )
}

export default PreviewProfile
