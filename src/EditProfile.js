// @flow
import React from 'react'

import AppScreen from './AppScreen'
import { getProfile, updateProfile } from './api'
import ProfileForm from './ProfileForm'

type Props = {
  token: string,
  profileId: string,
  isAdmin: ?boolean,
  setProfileId: ?Function,
  history: History,
}


const EditProfile = ({
  token,
  history,
  setProfileId,
  profileId,
  isAdmin,
}: Props) => (
  <AppScreen>
    <ProfileForm
      loadInitial={() => getProfile(token, profileId)}
      firstTimePublish={false}
      saveProfile={updateProfile}
      history={history}
      setProfileId={setProfileId}
      profileId={profileId}
      isAdmin={isAdmin}
    />
  </AppScreen>
)

export default EditProfile
