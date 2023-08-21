// @flow
import React from 'react'
import { useBeforeunload } from 'react-beforeunload' // @flow: ignore
import { type RouterHistory } from 'react-router-dom'

import AppScreen from './AppScreen'
import { type Account } from './api'
import ProfileForm from './ProfileForm'

type Props = {
  account: Account | null,
  profileId?: ?string,
  isAdmin?: boolean,
  setProfileId?: (string) => void,
  history: RouterHistory,
  getProfile: Function,
  updateProfile: Function,
  RoleSpecificFields: Object,
  RoleSpecificProfileView: Object,
  RoleSpecificCheckboxes: Object,
  RoleSpecificExpectations: Object,
  profileBaseUrl: string,
  isStudent: boolean,
}

const EditProfile = ({
  account,
  history,
  setProfileId,
  profileId,
  isAdmin = false,
  getProfile,
  updateProfile,
  RoleSpecificFields,
  RoleSpecificProfileView,
  RoleSpecificCheckboxes,
  RoleSpecificExpectations,
  profileBaseUrl,
  isStudent,
}: Props) => {
  const unchangedWarning = 'Your changes to your profile have not been saved.'
  useBeforeunload(() => unchangedWarning)

  if (account === null) {
    return 'You are not logged in. Please log in.'
  }

  if (profileId == null) {
    return 'You are attempting to edit an invalid profile. Check your URL.'
  }

  return (
    <AppScreen>
      <ProfileForm
        loadInitial={() => getProfile(profileId)}
        firstTimePublish={false}
        saveProfile={updateProfile}
        history={history}
        setProfileId={setProfileId}
        profileId={profileId}
        isAdmin={isAdmin}
        RoleSpecificFields={RoleSpecificFields}
        RoleSpecificProfileView={RoleSpecificProfileView}
        RoleSpecificCheckboxes={RoleSpecificCheckboxes}
        RoleSpecificExpectations={RoleSpecificExpectations}
        profileBaseUrl={profileBaseUrl}
        isStudent={isStudent}
      />
    </AppScreen>
  )
}

export default EditProfile
