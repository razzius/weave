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
}

const EditProfile = (props: Props) => (
  <AppScreen>
    <ProfileForm
      loadInitial={() => getProfile(props.token, props.profileId)}
      firstTimePublish={false}
      saveProfile={updateProfile}
      {...props}
    />
  </AppScreen>
)

export default EditProfile
