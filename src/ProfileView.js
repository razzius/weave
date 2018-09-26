import React from 'react'
import Avatar from 'react-avatar'

import AppScreen from './AppScreen'
import { capitalize } from './utils'
import NextButton from './NextButton'

const ProfileView = ({ data, ownProfile }) => (
  <AppScreen>
    <div className="profile-contact">
      <div className="columns">
        <div className="column contact">
          {data.profile_image_url ? (
            <img
              alt="Profile"
              className="profile-image column"
              src={data.profile_image_url}
            />
          ) : (
            <Avatar name={data.name} size={200} round textSizeRatio={3} />
          )}

          <h4>Contact Information</h4>

          <p>
            <a href={`mailto:${data.contact_email}`}>{data.contact_email}</a>
          </p>

          <div style={{ marginTop: '1.2em' }}>
            <h4>Meeting Cadence</h4>
            {data.cadence === 'other'
              ? data.other_cadence
              : capitalize(data.cadence)}
          </div>

          <h4>I am available to help in the following ways:</h4>

          <div className="expectation">
            <label className={!data.willing_shadowing ? 'grayed-out' : ''}>
              <input
                type="checkbox"
                disabled="true"
                checked={data.willing_shadowing}
              />
              Clinical shadowing opportunities
            </label>
          </div>

          <div className="expectation">
            <label className={!data.willing_networking ? 'grayed-out' : ''}>
              <input
                type="checkbox"
                disabled="true"
                checked={data.willing_networking}
              />
              Networking
            </label>
          </div>

          <div className="expectation">
            <label className={!data.willing_goal_setting ? 'grayed-out' : ''}>
              <input
                type="checkbox"
                disabled="true"
                checked={data.willing_goal_setting}
              />
              Goal setting
            </label>
          </div>

          <div className="expectation">
            <label
              className={!data.willing_discuss_personal ? 'grayed-out' : ''}
            >
              <input
                type="checkbox"
                disabled="true"
                checked={data.willing_discuss_personal}
              />
              Discussing personal as well as professional life
            </label>
          </div>

          <div className="expectation">
            <label
              className={!data.willing_career_guidance ? 'grayed-out' : ''}
            >
              <input
                type="checkbox"
                disabled="true"
                checked={data.willing_career_guidance}
              />
              Career guidance
            </label>
          </div>

          <div className="expectation">
            <label className={!data.willing_student_group ? 'grayed-out' : ''}>
              <input
                type="checkbox"
                disabled="true"
                checked={data.willing_student_group}
              />
              Student interest group support or speaking at student events
            </label>
          </div>
        </div>
        <div className="about" style={{ width: '450px' }}>
          {ownProfile && (
            <NextButton href="/edit-profile" text="Edit profile" />
          )}
          {ownProfile === false && (
            <NextButton href="/browse" text="Back to list" />
          )}
          <h1>{data.name}</h1>

          <h4 style={{ marginTop: '2em' }}>Hospital Affiliations</h4>
          <p style={{ paddingBottom: '1em' }}>{data.affiliations.join(', ')}</p>

          {data.clinical_specialties.length > 0 && (
            <div>
              <h4>Clinical Interests</h4>
              <p style={{ paddingBottom: '1em' }}>
                {data.clinical_specialties.join(', ')}
              </p>
            </div>
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
              <p style={{ paddingBottom: '1em' }}>
                {data.parts_of_me.map(({ value }) => value).join(', ')}
              </p>
            </div>
          )}

          {data.activities.length > 0 && (
            <div>
              <h4>Activities I Enjoy</h4>
              <p style={{ paddingBottom: '1em' }}>
                {data.activities.join(', ')}
              </p>
            </div>
          )}

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
