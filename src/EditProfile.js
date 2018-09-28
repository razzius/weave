import React from 'react'
import { getProfile, updateProfile, payloadToProfile } from './api'
import ProfileForm from './ProfileForm'

const EditProfile = props => (
  <ProfileForm
    loadInitial={() =>
      getProfile(props.token, props.profileId).then(response =>
        payloadToProfile(response)
      )
    }
    firstTimePublish={false}
    saveProfile={updateProfile}
    {...props}
  />
)

export default EditProfile
