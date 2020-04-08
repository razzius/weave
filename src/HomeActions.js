// @flow
import React from 'react'

import Button from './Button'

function getFacultyLink(token, profileId) {
  if (profileId == null) return '/create-profile'
  return `/profiles/${profileId}`
}

function getFacultyText(token, profileId) {
  if (token === null) return 'Register as a faculty member'
  if (profileId === null) return 'Create profile'
  return 'View my profile'
}

const FacultyLanding = ({
  profileId,
  token,
  isMentor,
}: {
  profileId: ?string,
  token: string | null,
  isMentor: boolean,
}) => (
  <div>
    <h1>Faculty</h1>
    <Button to={getFacultyLink(token, profileId)}>
      {getFacultyText(token, profileId)}
    </Button>
    {isMentor && (
      <div>
        <Button to="/browse">Browse all profiles</Button>
      </div>
    )}
  </div>
)

export default ({
  token,
  isMentor,
  profileId,
}: {
  token: string | null,
  isMentor: boolean,
  profileId: ?string,
}) => {
  if (token === null) {
    return (
      <div>
        <h1>Students</h1>
        <Button to="/student-expectations">Register as a student</Button>

        <h1>Faculty</h1>
        <Button to="/faculty-expectations">Register as a faculty member</Button>
      </div>
    )
  }

  if (!isMentor) {
    return (
      <div>
        <h1>Students</h1>
        <div>
          <Button to={profileId ? `profiles/${profileId}` : 'create-profile'}>
            {profileId
              ? 'View peer mentorship profile'
              : 'Create peer mentorship profile'}
          </Button>
        </div>
        <Button to="/browse">Browse all profiles</Button>
      </div>
    )
  }
  return (
    <FacultyLanding
      token={token}
      isMentor={Boolean(isMentor)}
      profileId={profileId}
    />
  )
}
