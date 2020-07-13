// @flow
import React from 'react'
import { withRouter, type RouterHistory } from 'react-router-dom'

import AppScreen from './AppScreen'
import { createProfile } from './api'
import StudentProfileForm from './StudentProfileForm'

type Props = {
  setProfileId: string => void,
  history: RouterHistory,
}

const CreatePeerProfile = ({ setProfileId, history }: Props) => (
  <AppScreen>
    <StudentProfileForm
      firstTimePublish
      saveProfile={createProfile}
      setProfileId={setProfileId}
      history={history}
    />
  </AppScreen>
)

export default withRouter(CreatePeerProfile)
