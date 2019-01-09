import React from 'react'

import AppScreen from './AppScreen'
import { createProfile } from './api'
import ProfileForm from './ProfileForm'

const CreateProfile = props => (
  <AppScreen>
    <ProfileForm
      loadInitial={false}
      firstTimePublish={false}
      saveProfile={createProfile}
      setAvailableForMentoring={props.setAvailableForMentoring}
      {...props}
    />
  </AppScreen>
)

export default CreateProfile
