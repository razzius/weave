import React, { Fragment } from 'react'
import MediaQuery from 'react-responsive'

import { capitalize } from './utils'
import NextButton from './NextButton'
import ProfileAvatar from './ProfileAvatar'

const Buttons = ({ ownProfile, firstTimePublish, editing }) => (
  <Fragment>
    {ownProfile && <NextButton to="/edit-profile" text="Edit profile" />}
    {!firstTimePublish &&
      !editing && <NextButton to="/browse" text="Back to list" />}
  </Fragment>
)

const Expectations = data => (
  <Fragment>
    <h4>I am available to help in the following ways:</h4>

    <div className="expectation">
      <label className={!data.willingShadowing ? 'grayed-out' : ''}>
        <input type="checkbox" disabled checked={data.willing_shadowing} />
        Clinical shadowing opportunities
      </label>
    </div>

    <div className="expectation">
      <label className={!data.willingNetworking ? 'grayed-out' : ''}>
        <input type="checkbox" disabled checked={data.willing_networking} />
        Networking
      </label>
    </div>

    <div className="expectation">
      <label className={!data.willingGoalSetting ? 'grayed-out' : ''}>
        <input type="checkbox" disabled checked={data.willing_goal_setting} />
        Goal setting
      </label>
    </div>

    <div className="expectation">
      <label className={!data.willingDiscussPersonal ? 'grayed-out' : ''}>
        <input type="checkbox" disabled checked={data.willingDiscussPersonal} />
        Discussing personal as well as professional life
      </label>
    </div>

    <div className="expectation">
      <label className={!data.willingCareerGuidance ? 'grayed-out' : ''}>
        <input type="checkbox" disabled checked={data.willingCareerGuidance} />
        Career guidance
      </label>
    </div>

    <div className="expectation">
      <label className={!data.willingStudentGroup ? 'grayed-out' : ''}>
        <input type="checkbox" disabled checked={data.willingStudentGroup} />
        Student interest group support or speaking at student events
      </label>
    </div>
  </Fragment>
)

const Cadence = ({ cadence, otherCadence }) => (
  <div style={{ marginTop: '1.2em' }}>
    <h4>Meeting Cadence</h4>
    {cadence === 'other' ? otherCadence : capitalize(cadence)}
  </div>
)

const HospitalAffiliations = ({ affiliations }) => (
  <Fragment>
    <h4 style={{ marginTop: '2em' }}>Hospital Affiliations</h4>
    <p style={{ paddingBottom: '1em' }}>{affiliations}</p>
  </Fragment>
)

const ClinicalInterests = ({ interests }) => (
  <div>
    <h4>Clinical Interests</h4>
    <p style={{ paddingBottom: '1em' }}>{interests}</p>
  </div>
)

const AboutInfo = data => (
  <Fragment>
    <HospitalAffiliations affiliations={data.affiliations.join(', ')} />

    {data.clinicalSpecialties.length > 0 && (
      <ClinicalInterests interests={data.clinicalSpecialties.join(', ')} />
    )}

    {data.professionalInterests.length > 0 && (
      <div>
        <h4>Professional Interests</h4>
        <p style={{ paddingBottom: '1em' }}>
          {data.professionalInterests.join(', ')}
        </p>
      </div>
    )}

    {data.partsOfMe.length > 0 && (
      <div>
        <h4>Parts Of Me</h4>
        <p style={{ paddingBottom: '1em' }}>{data.partsOfMe.join(', ')}</p>
      </div>
    )}

    {data.activities.length > 0 && (
      <div>
        <h4>Activities I Enjoy</h4>
        <p style={{ paddingBottom: '1em' }}>{data.activities.join(', ')}</p>
      </div>
    )}

    {data.additionalInformation && (
      <div>
        <h4>Additional Information</h4>
        <p>{data.additionalInformation}</p>
      </div>
    )}
  </Fragment>
)

const ContactInformation = data => (
  <Fragment>
    <h4>Contact Information</h4>

    <a className="contact-email" href={`mailto:${data.contactEmail}`}>
      {data.contactEmail}
    </a>
  </Fragment>
)

const ProfileView = ({ data, ownProfile, firstTimePublish, editing }) => (
  <Fragment>
    <MediaQuery query="(max-device-width: 750px)">
      <div className="profile-contact">
        <Buttons {...{ ownProfile, firstTimePublish, editing }} />

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

            <Cadence cadence={data.cadence} otherCadence={data.otherCadence} />

            <Expectations {...data} />
          </div>
          <div className="about">
            <Buttons {...{ ownProfile, firstTimePublish, editing }} />

            <h1>{data.name}</h1>

            <AboutInfo {...data} />
          </div>
        </div>
      </div>
    </MediaQuery>
  </Fragment>
)

export default ProfileView
