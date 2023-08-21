// @flow
import React from 'react'

import ProfileForm from './ProfileForm'
import RoleSpecificStudentProfileView from './RoleSpecificStudentProfileView'
import RoleSpecificStudentFields from './RoleSpecificStudentFields'
import RoleSpecificStudentCheckboxes from './RoleSpecificStudentCheckboxes'
import RoleSpecificStudentExpectations from './RoleSpecificStudentExpectations'

const StudentProfileForm = ({
  loadInitial,
  saveProfile,
  profileId,
  setProfileId,
  history,
  firstTimePublish,
}) => (
  <ProfileForm
    RoleSpecificFields={RoleSpecificStudentFields}
    RoleSpecificProfileView={RoleSpecificStudentProfileView}
    RoleSpecificCheckboxes={RoleSpecificStudentCheckboxes}
    RoleSpecificExpectations={RoleSpecificStudentExpectations}
    firstTimePublish={firstTimePublish}
    history={history}
    loadInitial={loadInitial}
    profileId={profileId}
    saveProfile={saveProfile}
    setProfileId={setProfileId}
    profileBaseUrl="peer-profiles"
    isStudent
  />
)

export default StudentProfileForm
