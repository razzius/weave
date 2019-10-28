// @flow
import React from 'react'
import { useBeforeunload } from 'react-beforeunload'
import { type RouterHistory } from 'react-router-dom'

import AppScreen from './AppScreen'
import { getProfile, updateProfile } from './api'
import ProfileForm from './ProfileForm'

type Props = {
  token: string | null,
  profileId?: ?string,
  isAdmin?: boolean,
  setProfileId?: string => void,
  history: RouterHistory,
}

const EditProfile = ({
  token,
  history,
  setProfileId,
  profileId,
  isAdmin = false,
}: Props) => {
  const unchangedWarning = 'Your changes to your profile have not been saved.'
  useBeforeunload(() => unchangedWarning)

  if (token === null) {
    return 'You are not logged in. Please log in.'
  }

  if (profileId == null) {
    return 'You are attempting to edit an invalid profile. Check your URL.'
  }

  return (
    <AppScreen>
      <ProfileForm
        loadInitial={() => getProfile(token, profileId)}
        firstTimePublish={false}
        saveProfile={updateProfile}
        history={history}
        setProfileId={setProfileId}
        profileId={profileId}
        isAdmin={isAdmin}
        token={token}
      />
    </AppScreen>
  )
}

export default EditProfile
