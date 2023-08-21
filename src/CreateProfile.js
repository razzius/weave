// @flow
import React from 'react'
import { withRouter, type RouterHistory } from 'react-router-dom'

import AppScreen from './AppScreen'
import { createProfile, type Account } from './api'
import FacultyProfileForm from './FacultyProfileForm'

type Props = {
  setProfileId: (string) => void,
  account: Account | null,
  history: RouterHistory,
}

const CreateProfile = ({ setProfileId, account, history }: Props) => {
  if (account === null) {
    return 'You are not logged in. Click "Login" above to log in.'
  }

  return (
    <AppScreen>
      <FacultyProfileForm
        firstTimePublish
        saveProfile={createProfile}
        setProfileId={setProfileId}
        history={history}
      />
    </AppScreen>
  )
}

export default withRouter(CreateProfile)
