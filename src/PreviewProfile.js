import React from 'react'

import ProfileView from './ProfileView'

function PreviewProfile(props) {
  const {
    data,
    firstTimePublish,
    onEdit,
    onPublish,
    RoleSpecificProfileView,
    RoleSpecificExpectations,
  } = props

  return (
    <div>
      <ProfileView
        data={data}
        editing
        firstTimePublish={firstTimePublish}
        RoleSpecificProfileView={RoleSpecificProfileView}
        RoleSpecificExpectations={RoleSpecificExpectations}
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
