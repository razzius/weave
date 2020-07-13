// @flow
import React from 'react'
import Select from 'react-select'
import { type RouterHistory } from 'react-router-dom'

import ProfileForm from './ProfileForm'
import { type Profile } from './api'

const RoleSpecificFields = ({ fields, options, handleChangeField }: Object) => (
  <div>
    <p>Program</p>
    <Select
      onChange={handleChangeField('program')}
      options={options.programOptions}
      value={{ label: fields.program, value: fields.program }}
    />
    <p>Current Year</p>
    <p>PCE Site</p>
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

const StudentProfileForm = ({
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

export default StudentProfileForm
