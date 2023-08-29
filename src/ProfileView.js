import React, { Fragment, useState } from 'react'
import MediaQuery from 'react-responsive'
import { withRouter } from 'react-router-dom'
import { Tooltip } from 'react-tooltip'

import { starProfile, unstarProfile } from './api'
import Button from './Button'
import ProfileAvatar from './ProfileAvatar'
import ProfileStar from './ProfileStar'
import { CADENCE_LABELS } from './CadenceOption'

function Buttons({
  ownProfile,
  firstTimePublish,
  editing,
  location,
  adminButton,
  browseUrl,
  editUrl,
}) {
  return (
    <Fragment>
      {ownProfile && editUrl && <Button to={editUrl}>Edit Profile</Button>}
      {adminButton}
      {!firstTimePublish && !editing && (
        <Button
          to={{
            pathname: browseUrl,
            state: location.state,
          }}
        >
          Back to list
        </Button>
      )}
    </Fragment>
  )
}

function displayCadence(cadence, otherCadence) {
  if (cadence === 'other') {
    return otherCadence
  }

  return CADENCE_LABELS[cadence]
}

function Cadence({ cadence, otherCadence }) {
  return (
    <div style={{ marginTop: '1.2em' }}>
      <h4>Meeting Cadence</h4>
      {displayCadence(cadence, otherCadence)}
    </div>
  )
}

function ClinicalInterests({ interests }) {
  return (
    <div>
      <h4>Clinical Interests</h4>
      <p style={{ paddingBottom: '1em' }}>{interests.join(', ')}</p>
    </div>
  )
}

function AboutInfo({
  degrees,
  affiliations,
  clinicalSpecialties,
  professionalInterests,
  partsOfMe,
  additionalInformation,
  activities,
  program,
  pceSite,
  currentYear,
  RoleSpecificProfileView,
}) {
  return (
    <Fragment>
      <RoleSpecificProfileView
        degrees={degrees}
        program={program}
        pceSite={pceSite}
        currentYear={currentYear}
        affiliations={affiliations}
      />
      {clinicalSpecialties.length > 0 && (
        <ClinicalInterests interests={clinicalSpecialties} />
      )}
      {professionalInterests.length > 0 && (
        <div>
          <h4>Professional Interests</h4>
          <p style={{ paddingBottom: '1em' }}>
            {professionalInterests.join(', ')}
          </p>
        </div>
      )}
      {partsOfMe.length > 0 && (
        <div>
          <h4>Parts Of Me</h4>
          <p style={{ paddingBottom: '1em' }}>{partsOfMe.join(', ')}</p>
        </div>
      )}
      {activities.length > 0 && (
        <div>
          <h4>Activities I Enjoy</h4>
          <p style={{ paddingBottom: '1em' }}>{activities.join(', ')}</p>
        </div>
      )}
      {additionalInformation && (
        <div>
          <h4>Additional Information</h4>
          <p>{additionalInformation}</p>
        </div>
      )}
    </Fragment>
  )
}

function ContactInformation({ contactEmail }) {
  const [username, domain] = contactEmail.split('@')
  return (
    <Fragment>
      <h4>Contact Information</h4>

      <a className="contact-email" href={`mailto:${contactEmail}`}>
        {username}
        <wbr />@{domain}
      </a>
    </Fragment>
  )
}

function ProfileView({
  data,
  ownProfile = false,
  firstTimePublish = false,
  editing = false,
  isAdmin,
  location,
  profileId,
  dateUpdated,
  starred,
  history,
  RoleSpecificProfileView,
  browseUrl,
  editUrl,
  adminEditBaseUrl,
  RoleSpecificExpectations,
}) {
  const [starredState, setStarred] = useState(Boolean(starred))

  const adminButton =
    isAdmin && !ownProfile && profileId && adminEditBaseUrl ? (
      <Button to={`/${adminEditBaseUrl}/${profileId}`}>
        Edit profile as admin
      </Button>
    ) : null

  const buttons = (
    <Buttons
      ownProfile={ownProfile}
      firstTimePublish={firstTimePublish}
      editing={editing}
      location={location}
      adminButton={adminButton}
      browseUrl={browseUrl}
      editUrl={editUrl}
    />
  )
  const avatar = (
    <ProfileAvatar imageUrl={data.imageUrl} name={data.name} size={200} />
  )

  const lastUpdated =
    dateUpdated == null ? null : (
      <small>Profile last updated {dateUpdated.toLocaleDateString()}</small>
    )

  const aboutInfo = (
    <AboutInfo
      degrees={data.degrees}
      affiliations={data.affiliations}
      clinicalSpecialties={data.clinicalSpecialties}
      professionalInterests={data.professionalInterests}
      partsOfMe={data.partsOfMe}
      additionalInformation={data.additionalInformation}
      activities={data.activities}
      program={data.program}
      pceSite={data.pceSite}
      currentYear={data.currentYear}
      RoleSpecificProfileView={RoleSpecificProfileView}
    />
  )

  const roleSpecificExpecations = (
    <RoleSpecificExpectations
      willingShadowing={data.willingShadowing}
      willingNetworking={data.willingNetworking}
      willingGoalSetting={data.willingGoalSetting}
      willingDiscussPersonal={data.willingDiscussPersonal}
      willingCareerGuidance={data.willingCareerGuidance}
      willingStudentGroup={data.willingStudentGroup}
      willingDualDegrees={data.willingDualDegrees}
      willingAdviceClinicalRotations={data.willingAdviceClinicalRotations}
      willingResearch={data.willingResearch}
      willingResidency={data.willingResidency}
    />
  )

  return (
    <Fragment>
      <MediaQuery query="(max-device-width: 750px)">
        <div className="profile-contact">
          {buttons}

          {avatar}

          <h1>{data.name}</h1>

          <ContactInformation contactEmail={data.contactEmail} />

          <Cadence cadence={data.cadence} otherCadence={data.otherCadence} />

          {roleSpecificExpecations}

          {aboutInfo}

          {lastUpdated}
        </div>
      </MediaQuery>

      <MediaQuery query="(min-device-width: 750px)">
        <div className="profile-contact">
          <div className="columns">
            <div className="column contact">
              {profileId != null && !ownProfile && (
                <div data-tip data-for="starTooltip">
                  <Tooltip id="starTooltip" place="top">
                    Click here to{' '}
                    {starredState ? 'remove star' : 'mark profile as starred'}
                  </Tooltip>
                  <ProfileStar
                    active={starredState}
                    onClick={() => {
                      const newStarred = !starredState
                      setStarred(newStarred)
                      if (newStarred) {
                        starProfile(profileId)
                      } else {
                        unstarProfile(profileId)
                      }
                      history.replace(location.pathname, null)
                    }}
                    type="button"
                  />
                </div>
              )}

              {avatar}
              <ContactInformation contactEmail={data.contactEmail} />

              <Cadence
                cadence={data.cadence}
                otherCadence={data.otherCadence}
              />

              {roleSpecificExpecations}
            </div>
            <div className="about">
              {buttons}

              <h1>{data.name}</h1>

              {aboutInfo}

              {lastUpdated}
            </div>
          </div>
        </div>
      </MediaQuery>
    </Fragment>
  )
}

export default withRouter(ProfileView)
