import React from 'react'

import EditProfile from './EditProfile'
import RoleSpecificStudentFields from './RoleSpecificStudentFields'
import RoleSpecificStudentProfileView from './RoleSpecificStudentProfileView'
import RoleSpecificStudentCheckboxes from './RoleSpecificStudentCheckboxes'
import RoleSpecificStudentExpectations from './RoleSpecificStudentExpectations'
import { getStudentProfile, updateStudentProfile } from './api'

function EditStudentProfile({
  account,
  profileId,
  isAdmin,
  setProfileId,
  history,
}) {
  return (
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
      RoleSpecificCheckboxes={RoleSpecificStudentCheckboxes}
      RoleSpecificExpectations={RoleSpecificStudentExpectations}
      profileBaseUrl="peer-profiles"
      isStudent
    />
  )
}

export default EditStudentProfile
