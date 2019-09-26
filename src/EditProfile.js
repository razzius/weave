// @flow
import React from 'react'
import { useBeforeunload } from 'react-beforeunload';

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
}: Props) => {
  useBeforeunload(() => "Your changes to your profile have not been saved.")

  return <AppScreen>
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
}

export default EditProfile
