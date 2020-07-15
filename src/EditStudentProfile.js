// @flow
import React from 'react'

import EditProfile from './EditProfile'
import RoleSpecificStudentFields from './RoleSpecificStudentFields'
import RoleSpecificStudentProfileView from './RoleSpecificStudentProfileView'
import { getStudentProfile, updateStudentProfile } from './api'

const EditStudentProfile = ({
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
    getProfile={getStudentProfile}
    updateProfile={updateStudentProfile}
    RoleSpecificFields={RoleSpecificStudentFields}
    RoleSpecificProfileView={RoleSpecificStudentProfileView}
    profileBaseUrl="peer-profiles"
  />
)

export default EditStudentProfile
