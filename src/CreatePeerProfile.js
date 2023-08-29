import React from 'react'
import { withRouter } from 'react-router-dom'

import AppScreen from './AppScreen'
import { createStudentProfile } from './api'
import StudentProfileForm from './StudentProfileForm'

function CreatePeerProfile({ setProfileId, history }) {
  return (
    <AppScreen>
      <StudentProfileForm
        firstTimePublish
        saveProfile={createStudentProfile}
        setProfileId={setProfileId}
        history={history}
      />
    </AppScreen>
  )
}

export default withRouter(CreatePeerProfile)
