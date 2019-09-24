// @flow
import React, { Fragment } from 'react'
import MediaQuery from 'react-responsive'
import { withRouter } from 'react-router-dom'

import { capitalize } from './utils'
import NextButton from './NextButton'
import ProfileAvatar from './ProfileAvatar'

const Buttons = ({
  ownProfile,
  firstTimePublish,
  editing,
  profileId,
  isAdmin,
  location,
}: {
  ownProfile: boolean,
  firstTimePublish: boolean,
  editing: boolean,
  profileId: string,
  isAdmin: boolean,
  location: Object,
}) => (
  <Fragment>
    {ownProfile && <NextButton to="/edit-profile" text="Edit profile" />}
    {isAdmin && (
      <NextButton
        to={`/admin-edit-profile/${profileId}`}
        text="Edit profile as admin"
      />
    )}
    {!firstTimePublish && !editing && (
      <NextButton
        className="button next-button"
        to={{ pathname: '/browse', state: location.state }}
        text="Back to list"
      />
    )}
  </Fragment>
)

const ExpectationDisplay = ({
  name,
  value,
}: {
  name: string,
  value: boolean,
}) => {
  const id = name.split().join('-')

  return (
    <div className="expectation">
      <label htmlFor={id} className={!value ? 'grayed-out' : ''}>
        <input id={id} type="checkbox" disabled checked={value} />
        {name}
      </label>
    </div>
  )
}

export type BaseProfileData = {|
  name: string,
  contactEmail: string,
  imageUrl: ?string,

  affiliations: Array<string>,
  clinicalSpecialties: Array<string>,
  professionalInterests: Array<string>,
  partsOfMe: Array<string>,
  activities: Array<string>,
  degrees: Array<string>,

  additionalInformation: string,

  willingShadowing: boolean,
  willingNetworking: boolean,
  willingGoalSetting: boolean,
  willingDiscussPersonal: boolean,
  willingCareerGuidance: boolean,
  willingStudentGroup: boolean,

  cadence: string,
  otherCadence: ?string,
|}

type ProfileData = {|
  id: string,
  ...BaseProfileData,
|}

const Expectations = (data: ProfileData) => (
  <Fragment>
    <h4>I am available to help in the following ways:</h4>

    <ExpectationDisplay
      name="Clinical shadowing opportunities"
      value={data.willingShadowing}
    />

    <ExpectationDisplay name="Networking" value={data.willingNetworking} />

    <ExpectationDisplay name="Goal setting" value={data.willingGoalSetting} />

    <ExpectationDisplay
      name="Discussing personal as well as professional life"
      value={data.willingDiscussPersonal}
    />

    <ExpectationDisplay
      name="Career guidance"
      value={data.willingCareerGuidance}
    />
    <ExpectationDisplay
      name="Student interest group support or speaking at student events"
      value={data.willingStudentGroup}
    />
  </Fragment>
)

const Cadence = ({
  cadence,
  otherCadence,
}: {
  cadence: string,
  otherCadence: ?string,
}) => (
  <div style={{ marginTop: '1.2em' }}>
    <h4>Meeting Cadence</h4>
    {cadence === 'other' ? otherCadence : capitalize(cadence)}
  </div>
)

const HospitalAffiliations = ({ affiliations }: { affiliations: string }) => (
  <Fragment>
    <h4>Institutional Affiliations</h4>
    <p style={{ paddingBottom: '1em' }}>{affiliations}</p>
  </Fragment>
)

const AcademicDegrees = ({ degrees }: { degrees: string }) => (
  <Fragment>
    <h4 style={{ marginTop: '2em' }}>Academic Degrees</h4>
    <p style={{ paddingBottom: '1em' }}>{degrees}</p>
  </Fragment>
)

const ClinicalInterests = ({ interests }: { interests: string }) => (
  <div>
    <h4>Clinical Interests</h4>
    <p style={{ paddingBottom: '1em' }}>{interests}</p>
  </div>
)

const AboutInfo = ({
  degrees,
  affiliations,
  clinicalSpecialties,
  professionalInterests,
  partsOfMe,
  additionalInformation,
  activities,
}: Object) => (
  <Fragment>
    {degrees.length > 0 && <AcademicDegrees degrees={degrees.join(', ')} />}

    <HospitalAffiliations affiliations={affiliations.join(', ')} />
    {clinicalSpecialties.length > 0 && (
      <ClinicalInterests interests={clinicalSpecialties.join(', ')} />
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

const ContactInformation = data => {
  const [username, domain] = data.contactEmail.split('@')
  return (
    <Fragment>
      <h4>Contact Information</h4>

      <a className="contact-email" href={`mailto:${data.contactEmail}`}>
        {username}
        <wbr />@{domain}
      </a>
    </Fragment>
  )
}

const ProfileView = ({
  data,
  ownProfile,
  firstTimePublish,
  editing,
  isAdmin,
  location,
}: {
  data: ProfileData,
  ownProfile: boolean,
  firstTimePublish: boolean,
  editing: boolean,
  isAdmin: boolean,
  location: Object,
}) => {
  const buttons = (
    <Buttons
      profileId={data.id}
      {...{ ownProfile, firstTimePublish, editing, isAdmin, location }}
    />
  )
  return (
    <Fragment>
      <MediaQuery query="(max-device-width: 750px)">
        <div className="profile-contact">
          {buttons}

          <ProfileAvatar imageUrl={data.imageUrl} name={data.name} size={200} />

          <h1>{data.name}</h1>

          <ContactInformation {...data} />

          <Cadence cadence={data.cadence} otherCadence={data.otherCadence} />

          <Expectations {...data} />
          <AboutInfo {...data} />
        </div>
      </MediaQuery>

      <MediaQuery query="(min-device-width: 750px)">
        <div className="profile-contact">
          <div className="columns">
            <div className="column contact">
              <ProfileAvatar
                imageUrl={data.imageUrl}
                name={data.name}
                size={200}
              />

              <ContactInformation {...data} />

              <Cadence
                cadence={data.cadence}
                otherCadence={data.otherCadence}
              />

              <Expectations {...data} />
            </div>
            <div className="about">
              {buttons}

              <h1>{data.name}</h1>

              <AboutInfo {...data} />
            </div>
          </div>
        </div>
      </MediaQuery>
    </Fragment>
  )
}

export default withRouter(ProfileView)
