// @flow
import React from 'react'
import Profile from './Profile'

import RoleSpecificFacultyProfileView from './RoleSpecificFacultyProfileView'
import RoleSpecificFacultyFields from './RoleSpecificFacultyFields'
import { getFacultyProfile } from './api'

const FacultyProfile = ({ account, match }: Object) => (
  <Profile
    account={account}
    profileId={match.params.id}
    getProfile={getFacultyProfile}
    RoleSpecificProfileView={RoleSpecificFacultyProfileView}
    RoleSpecificFields={RoleSpecificFacultyFields}
    browseUrl="/browse"
    editUrl="/edit-profile"
    adminEditBaseUrl="admin-edit-profile"
  />
)

export default FacultyProfile
