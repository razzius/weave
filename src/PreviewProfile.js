// @flow
import React from 'react'
import ProfileView, { type BaseProfileData } from './ProfileView'

type Props = {
  data: BaseProfileData,
  firstTimePublish: boolean,
  onEdit: any => null,
  onPublish: any => null,
}

const PreviewProfile = (props: Props) => {
  const {
    data,
    firstTimePublish,
    onEdit,
    onPublish,
  } = props

  return <div>
    <ProfileView
      data={data}
      editing
      firstTimePublish={firstTimePublish}
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
}

export default PreviewProfile
