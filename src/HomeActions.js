import React from 'react'

import { HashLink as Link } from 'react-router-hash-link'

import Button from './Button'

function getFacultyLink(profileId) {
  if (profileId == null) return '/create-profile'
  return `/profiles/${profileId}`
}

function getFacultyText(account, profileId) {
  if (account === null) return 'Register as a faculty member'
  if (profileId === null) return 'Create profile'
  return 'View my profile'
}

function FacultyLanding({ account, profileId, isMentor }) {
  return (
    <div>
      <h1>Faculty</h1>
      <Button to={getFacultyLink(profileId)}>
        {getFacultyText(account, profileId)}
      </Button>
      {isMentor && (
        <div>
          <Button to="/browse">Browse all profiles</Button>
        </div>
      )}
      <p>
        <Link to="/help#how-do-i-create-a-profile">
          Read how to create a profile
        </Link>
      </p>
    </div>
  )
}

export default function HomeActions({ account, isMentor, profileId }) {
  if (account === null) {
    return (
      <div>
        <h1>Trainees</h1>
        <Button to="/student-expectations">Register as a trainee</Button>
        <h1>Faculty</h1>
        <Button to="/faculty-expectations">Register as a faculty member</Button>
      </div>
    )
  }

  if (!isMentor) {
    return (
      <div>
        <h1>Trainees</h1>
        <Button to="/browse">View Faculty Mentor Profiles</Button>
        <hr />
        <div>
          <Button to="/peer-mentorship">View Student Mentor Profiles</Button>
        </div>
        <div>
          {profileId ? (
            <Button to={`/peer-profiles/${profileId}`}>View My Profile</Button>
          ) : (
            <Button to="/create-peer-profile">
              Create Student Mentor Profile
            </Button>
          )}
        </div>
        <p>
          <Link to="/help#how-do-i-create-a-profile">
            Read how to create a profile
          </Link>
        </p>
      </div>
    )
  }
  return (
    <FacultyLanding
      account={account}
      isMentor={Boolean(isMentor)}
      profileId={profileId}
    />
  )
}
