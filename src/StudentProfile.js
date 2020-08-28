// @flow
import React from 'react'
import Profile from './Profile'

import RoleSpecificStudentProfileView from './RoleSpecificStudentProfileView'
import RoleSpecificStudentFields from './RoleSpecificStudentFields'
import RoleSpecificStudentExpectations from './RoleSpecificStudentExpectations'
import { getStudentProfile } from './api'

const StudentProfile = ({ account, match }: Object) => (
  <Profile
    account={account}
    profileId={match.params.id}
    getProfile={getStudentProfile}
    RoleSpecificProfileView={RoleSpecificStudentProfileView}
    RoleSpecificFields={RoleSpecificStudentFields}
    RoleSpecificExpectations={RoleSpecificStudentExpectations}
    browseUrl="/peer-mentorship"
    editUrl="/edit-student-profile"
    adminEditBaseUrl="admin-edit-student-profile"
  />
)

export default StudentProfile
