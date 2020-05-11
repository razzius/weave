// @flow
import React from 'react'
import { type RouterHistory } from 'react-router-dom'

import AppScreen from './AppScreen'
import { createProfile, type Account } from './api'
import ProfileForm from './ProfileForm'

type Props = {
  setProfileId: string => void,
  account: Account | null,
  history: RouterHistory,
}

const CreateProfile = ({ setProfileId, account, history }: Props) => {
  if (account === null) {
    return 'You are not logged in. Click "Login" above to log in.'
  }

  return (
    <AppScreen>
      <ProfileForm
        firstTimePublish={false}
        saveProfile={createProfile}
        setProfileId={setProfileId}
        history={history}
      />
    </AppScreen>
  )
}

export default CreateProfile
