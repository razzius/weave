// @flow
import React from 'react'
import { type RouterHistory } from 'react-router-dom'

import AppScreen from './AppScreen'
import { createProfile } from './api'
import ProfileForm from './ProfileForm'

type Props = {
  setProfileId: string => void,
  token: string | null,
  history: RouterHistory,
}

const CreateProfile = ({ setProfileId, token, history }: Props) => {
  if (token === null) {
    return 'You are not logged in. Click "Login" above to log in.'
  }

  return (
    <AppScreen>
      <ProfileForm
        firstTimePublish={false}
        saveProfile={createProfile}
        setProfileId={setProfileId}
        token={token}
        history={history}
      />
    </AppScreen>
  )
}

export default CreateProfile
