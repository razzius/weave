import React from 'react'

import ProfileForm from './ProfileForm'
import RoleSpecificFacultyFields from './RoleSpecificFacultyFields'
import RoleSpecificFacultyProfileView from './RoleSpecificFacultyProfileView'
import RoleSpecificFacultyCheckboxes from './RoleSpecificFacultyCheckboxes'
import RoleSpecificFacultyExpectations from './RoleSpecificFacultyExpectations'

function FacultyProfileForm({
  loadInitial,
  saveProfile,
  profileId,
  setProfileId,
  history,
  firstTimePublish,
}) {
  return (
    <ProfileForm
      firstTimePublish={firstTimePublish}
      history={history}
      loadInitial={loadInitial}
      profileId={profileId}
      saveProfile={saveProfile}
      setProfileId={setProfileId}
      profileBaseUrl="profiles"
      RoleSpecificFields={RoleSpecificFacultyFields}
      RoleSpecificProfileView={RoleSpecificFacultyProfileView}
      RoleSpecificCheckboxes={RoleSpecificFacultyCheckboxes}
      RoleSpecificExpectations={RoleSpecificFacultyExpectations}
      isStudent={false}
    />
  )
}

export default FacultyProfileForm
