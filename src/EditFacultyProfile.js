// @flow
import React from 'react'

import EditProfile from './EditProfile'
import { getFacultyProfile, updateFacultyProfile } from './api'
import RoleSpecificFacultyFields from './RoleSpecificFacultyFields'
import RoleSpecificFacultyProfileView from './RoleSpecificFacultyProfileView'
import RoleSpecificFacultyCheckboxes from './RoleSpecificFacultyCheckboxes'
import RoleSpecificFacultyExpectations from './RoleSpecificFacultyExpectations'

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
    RoleSpecificCheckboxes={RoleSpecificFacultyCheckboxes}
    RoleSpecificExpectations={RoleSpecificFacultyExpectations}
    profileBaseUrl="profiles"
  />
)

export default EditFacultyProfile
