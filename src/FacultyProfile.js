import React from 'react'
import Profile from './Profile'

import RoleSpecificFacultyProfileView from './RoleSpecificFacultyProfileView'
import RoleSpecificFacultyFields from './RoleSpecificFacultyFields'
import RoleSpecificFacultyExpectations from './RoleSpecificFacultyExpectations'
import { getFacultyProfile } from './api'

function FacultyProfile({ account, match }) {
  return (
    <Profile
      account={account}
      profileId={match.params.id}
      getProfile={getFacultyProfile}
      RoleSpecificProfileView={RoleSpecificFacultyProfileView}
      RoleSpecificFields={RoleSpecificFacultyFields}
      RoleSpecificExpectations={RoleSpecificFacultyExpectations}
      browseUrl="/browse"
      editUrl="/edit-profile"
      adminEditBaseUrl="admin-edit-profile"
    />
  )
}

export default FacultyProfile
