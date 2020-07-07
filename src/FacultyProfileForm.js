// @flow
import React from 'react'
import { type RouterHistory } from 'react-router-dom'

import ProfileForm from './ProfileForm'
import CreatableTagSelect from './CreatableTagSelect'
import { degreeOptions } from './options'
import { type Profile } from './api'

const RoleSpecificFields = ({ fields, handleChange, handleCreate }: Object) => (
  <div>
    <p>Academic Degrees</p>
    <CreatableTagSelect
      values={fields.degrees}
      options={degreeOptions}
      handleChange={handleChange('degrees')}
      handleAdd={handleCreate('degrees')}
    />
  </div>
)

type Props = {
  loadInitial?: any => void,
  // TODO profileId is passed in updateProfile but not in createProfile. Can't seem to get types to support this without `any`
  saveProfile: (profile: Profile, profileId: any) => Object,
  profileId?: string,
  setProfileId: ?Function,
  history: RouterHistory,
  firstTimePublish: boolean,
}

const FacultyProfileForm = ({
  loadInitial,
  saveProfile,
  profileId,
  setProfileId,
  history,
  firstTimePublish,
}: Props) => (
  <ProfileForm
    RoleSpecificFields={RoleSpecificFields}
    firstTimePublish={firstTimePublish}
    history={history}
    loadInitial={loadInitial}
    profileId={profileId}
    saveProfile={saveProfile}
    setProfileId={setProfileId}
  />
)

export default FacultyProfileForm
