import React from 'react'

import AppScreen from './AppScreen'
import { getProfile, updateProfile } from './api'
import ProfileForm from './ProfileForm'

const EditProfile = props => (
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
