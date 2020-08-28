// @flow
import React from 'react'
import { type RouterHistory } from 'react-router-dom'

import ProfileForm from './ProfileForm'
import { type Profile } from './api'
import RoleSpecificStudentProfileView from './RoleSpecificStudentProfileView'
import RoleSpecificStudentFields from './RoleSpecificStudentFields'
import RoleSpecificStudentCheckboxes from './RoleSpecificStudentCheckboxes'
import RoleSpecificStudentExpectations from './RoleSpecificStudentExpectations'

type Props = {
  loadInitial?: any => void,
  // TODO profileId is passed in updateProfile but not in createProfile. Can't seem to get types to support this without `any`
  saveProfile: (profile: Profile, profileId: any) => Object,
  profileId?: string,
  setProfileId: ?Function,
  history: RouterHistory,
  firstTimePublish: boolean,
}

const StudentProfileForm = ({
  loadInitial,
  saveProfile,
  profileId,
  setProfileId,
  history,
  firstTimePublish,
}: Props) => (
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
