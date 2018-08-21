import React from 'react'
import AppScreen from './AppScreen'
import { capitalize } from './utils'
import NextButton from "./NextButton"

const ProfileView = ({ data, ownProfile }) => (
  <AppScreen>
    <div className="profile-contact">
      <div className="columns">
        <div className="column contact">
          <img
            alt="Profile"
            className="profile-image column"
            src={data.profile_image_url}
          />

          <h4>Contact Information</h4>
          <p>
            <a href={`mailto:${data.contact_email}`}>{data.contact_email}</a>
          </p>

          <div style={{marginTop: '1.2em'}}>
            <h4>Meeting Cadence</h4>
            {data.cadence === 'other' ? data.other_cadence : capitalize(data.cadence)}
          </div>

          <h4>Additional Opportunities</h4>

          <div className="expectation">
            <label className={!data.willing_shadowing ? 'grayed-out' : ''}>
              <input
                type="checkbox"
                disabled="true"
                checked={data.willing_shadowing}
              />
              Will allow shadowing opportunities for mentee(s).
            </label>
          </div>

          <div className="expectation">
            <label className={!data.willing_networking ? 'grayed-out' : ''}>
              <input
                type="checkbox"
                disabled="true"
                checked={data.willing_networking}
              />
              Will help mentee(s) with networking as deemed appropriate.
            </label>
          </div>

          <div className="expectation">
            <label className={!data.willing_goal_setting ? 'grayed-out' : ''}>
              <input
                type="checkbox"
                disabled="true"
                checked={data.willing_goal_setting}
              />
              Will help mentee(s) with goal setting.
            </label>
          </div>

          <div className="expectation">
            <label className={!data.willing_discuss_personal ? 'grayed-out' : ''}>
              <input
                type="checkbox"
                disabled="true"
                checked={data.willing_discuss_personal}
              />
              Willing to discuss personal as well as professional life.
            </label>
          </div>

          <div className="expectation">
            <label className={!data.willing_career_guidance ? 'grayed-out' : ''}>
              <input
                type="checkbox"
                disabled="true"
                checked={data.willing_career_guidance}
              />
              Willing to advise for residency application.
            </label>
          </div>
        </div>
        <div className="about" style={{ width: '450px' }}>
          {ownProfile && <NextButton href="/edit-profile" text="Edit profile"/>}
          {ownProfile === false && <NextButton href="/browse" text="Back to list"/>}
          <h1>{data.name}</h1>

          <h4 style={{marginTop: '2em'}}>Hospital Affiliations</h4>

          <p style={{ paddingBottom: '1em' }}>{data.affiliations.join(', ')}</p>

          <h4>Clinical Specialties</h4>
          <p style={{ paddingBottom: '1em' }}>
            {data.clinical_specialties.join(', ')}
          </p>

          <h4>Professional Interests</h4>
          <p style={{ paddingBottom: '1em' }}>
            {data.professional_interests.join(', ')}
          </p>

          <h4>Parts Of Me</h4>
          <p style={{ paddingBottom: '1em' }}>
            {data.parts_of_me.join(', ')}
          </p>

          {data.additional_information && (
            <div>
              <h4>Additional Information</h4>
              <p>{data.additional_information}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </AppScreen>
)

export default ProfileView
