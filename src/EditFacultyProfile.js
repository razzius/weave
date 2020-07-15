// @flow
import React from 'react'

import EditProfile from './EditProfile'
import { getFacultyProfile, updateFacultyProfile } from './api'
import RoleSpecificFacultyFields from './RoleSpecificFacultyFields'
import RoleSpecificFacultyProfileView from './RoleSpecificFacultyProfileView'

const EditFacultyProfile = ({
  account,
  profileId,
  isAdmin,
  setProfileId,
  history,
}: Object) => (
  <EditProfile
    account={account}
    profileId={profileId}
    isAdmin={isAdmin}
    setProfileId={setProfileId}
    history={history}
    getProfile={getFacultyProfile}
    updateProfile={updateFacultyProfile}
    RoleSpecificFields={RoleSpecificFacultyFields}
    RoleSpecificProfileView={RoleSpecificFacultyProfileView}
    profileBaseUrl="profiles"
  />
)

export default EditFacultyProfile
