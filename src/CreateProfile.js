// @flow
import React from 'react'

import AppScreen from './AppScreen'
import { createProfile } from './api'
import ProfileForm from './ProfileForm'

type Props = any

const CreateProfile = ({ setAvailableForMentoring, ...props }: Props) => (
  <AppScreen>
    <ProfileForm
      loadInitial={false}
      firstTimePublish={false}
      saveProfile={createProfile}
      setAvailableForMentoring={setAvailableForMentoring}
      {...props}
    />
  </AppScreen>
)

export default CreateProfile
