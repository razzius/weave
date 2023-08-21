// @flow
import React from 'react'
import { type RouterHistory } from 'react-router-dom'

import ProfileForm from './ProfileForm'
import { type Profile } from './api'
import RoleSpecificFacultyFields from './RoleSpecificFacultyFields'
import RoleSpecificFacultyProfileView from './RoleSpecificFacultyProfileView'
import RoleSpecificFacultyCheckboxes from './RoleSpecificFacultyCheckboxes'
import RoleSpecificFacultyExpectations from './RoleSpecificFacultyExpectations'

type Props = {
  loadInitial?: (any) => void,
  // TODO profileId is passed in updateProfile but not in createProfile. Can't seem to get types to support this without `any`
  saveProfile: (profile: Profile, profileId: any) => Object,
  profileId?: string,
  setProfileId: ?Function,
  history: RouterHistory,
  firstTimePublish: boolean,
}

const FacultyProfileForm = ({
  loadInitial,
  saveProfile,
  profileId,
  setProfileId,
  history,
  firstTimePublish,
}: Props) => (
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

export default FacultyProfileForm
