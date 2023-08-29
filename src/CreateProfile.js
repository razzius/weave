import React from 'react'
import { withRouter } from 'react-router-dom'

import AppScreen from './AppScreen'
import { createProfile } from './api'
import FacultyProfileForm from './FacultyProfileForm'

const CreateProfile = ({ setProfileId, account, history }) => {
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
