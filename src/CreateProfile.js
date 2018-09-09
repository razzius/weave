import React from 'react'
import { createProfile } from './api'
import ProfileForm from './ProfileForm'

const CreateProfile = props => (
  <ProfileForm
    loadInitial={false}
    saveProfile={createProfile}
    setAvailableForMentoring={props.setAvailableForMentoring}
    {...props}
  />
)

export default CreateProfile
