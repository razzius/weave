// @flow
import React from 'react'

import AppScreen from './AppScreen'
import { createProfile } from './api'
import ProfileForm from './ProfileForm'

type Props = any

const CreateProfile = ({
  setAvailableForMentoring,
  availableForMentoring,
  setProfileId,
  token,
  history,
}: Props) => (
  <AppScreen>
    <ProfileForm
      firstTimePublish={false}
      saveProfile={createProfile}
      setAvailableForMentoring={setAvailableForMentoring}
      availableForMentoring={availableForMentoring}
      setProfileId={setProfileId}
      token={token}
      history={history}
    />
  </AppScreen>
)

export default CreateProfile
