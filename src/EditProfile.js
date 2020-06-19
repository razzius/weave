// @flow
import React from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { type RouterHistory } from 'react-router-dom'

import AppScreen from './AppScreen'
import { getProfile, updateProfile, type Account } from './api'
import ProfileForm from './ProfileForm'

type Props = {
  account: Account | null,
  profileId?: ?string,
  isAdmin?: boolean,
  setProfileId?: string => void,
  history: RouterHistory,
}

const EditProfile = ({
  account,
  history,
  setProfileId,
  profileId,
  isAdmin = false,
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
      />
    </AppScreen>
  )
}

export default EditProfile
