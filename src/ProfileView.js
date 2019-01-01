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
      <label className={!data.willing_shadowing ? 'grayed-out' : ''}>
        <input
          type="checkbox"
          disabled={true}
          checked={data.willing_shadowing}
        />
        Clinical shadowing opportunities
      </label>
    </div>

    <div className="expectation">
      <label className={!data.willing_networking ? 'grayed-out' : ''}>
        <input
          type="checkbox"
          disabled={true}
          checked={data.willing_networking}
        />
        Networking
      </label>
    </div>

    <div className="expectation">
      <label className={!data.willing_goal_setting ? 'grayed-out' : ''}>
        <input
          type="checkbox"
          disabled={true}
          checked={data.willing_goal_setting}
        />
        Goal setting
      </label>
    </div>

    <div className="expectation">
      <label className={!data.willing_discuss_personal ? 'grayed-out' : ''}>
        <input
          type="checkbox"
          disabled={true}
          checked={data.willing_discuss_personal}
        />
        Discussing personal as well as professional life
      </label>
    </div>

    <div className="expectation">
      <label className={!data.willing_career_guidance ? 'grayed-out' : ''}>
        <input
          type="checkbox"
          disabled={true}
          checked={data.willing_career_guidance}
        />
        Career guidance
      </label>
    </div>

    <div className="expectation">
      <label className={!data.willing_student_group ? 'grayed-out' : ''}>
        <input
          type="checkbox"
          disabled={true}
          checked={data.willing_student_group}
        />
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

    {data.clinical_specialties.length > 0 && (
      <ClinicalInterests interests={data.clinical_specialties.join(', ')} />
    )}

    {data.professional_interests.length > 0 && (
      <div>
        <h4>Professional Interests</h4>
        <p style={{ paddingBottom: '1em' }}>
          {data.professional_interests.join(', ')}
        </p>
      </div>
    )}

    {data.parts_of_me.length > 0 && (
      <div>
        <h4>Parts Of Me</h4>
        <p style={{ paddingBottom: '1em' }}>{data.parts_of_me.join(', ')}</p>
      </div>
    )}

    {data.activities.length > 0 && (
      <div>
        <h4>Activities I Enjoy</h4>
        <p style={{ paddingBottom: '1em' }}>{data.activities.join(', ')}</p>
      </div>
    )}

    {data.additional_information && (
      <div>
        <h4>Additional Information</h4>
        <p>{data.additional_information}</p>
      </div>
    )}
  </Fragment>
)

const ContactInformation = data => (
  <Fragment>
    <h4>Contact Information</h4>

    <a className="contact-email" href={`mailto:${data.contact_email}`}>
      {data.contact_email}
    </a>
  </Fragment>
)

const ProfileView = ({ data, ownProfile, firstTimePublish, editing }) => (
  <Fragment>
    <MediaQuery query="(max-device-width: 750px)">
      <div className="profile-contact">
        <Buttons {...{ ownProfile, firstTimePublish, editing }} />

        <ProfileAvatar
          profileImageUrl={data.profile_image_url}
          name={data.name}
          size={200}
        />

        <h1>{data.name}</h1>

        <ContactInformation {...data} />

        <Cadence cadence={data.cadence} otherCadence={data.other_cadence} />

        <Expectations {...data} />
        <AboutInfo {...data} />
      </div>
    </MediaQuery>

    <MediaQuery query="(min-device-width: 750px)">
      <div className="profile-contact">
        <div className="columns">
          <div className="column contact">
            <ProfileAvatar
              profileImageUrl={data.profile_image_url}
              name={data.name}
              size={200}
            />

            <ContactInformation {...data} />

            <Cadence cadence={data.cadence} otherCadence={data.other_cadence} />

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
