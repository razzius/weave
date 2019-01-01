import React from 'react'

import AppScreen from './AppScreen'
import { getProfile, updateProfile, payloadToProfile } from './api'
import ProfileForm from './ProfileForm'

const EditProfile = props => (
  <AppScreen>
    <ProfileForm
      loadInitial={() =>
        getProfile(props.token, props.profileId).then(response =>
          payloadToProfile(response)
        )
      }
      firstTimePublish={false}
      saveProfile={updateProfile}
      {...props}
    />
  </AppScreen>
)

export default EditProfile
