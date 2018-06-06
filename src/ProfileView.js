import React from 'react'
import AppScreen from './AppScreen'

function capitalize(text) {
  return text[0].toUpperCase() + text.slice(1)
}

const ProfileView = ({ data }) => (
  <AppScreen>
    <div className="profile-contact">
      <div className="columns">
        <div className="column contact">
          <img
            alt="Profile"
            className="profile-image column"
            src={data.profile_image_url}
          />
          <p>
            <a href={`mailto:${data.email}`}>{data.email}</a>
          </p>
          <div className="expectation">
            <label>
              <input
                type="checkbox"
                disabled="true"
                checked={data.willing_shadowing}
              />
              Will allow shadowing opportunities for mentee(s).
            </label>
          </div>

          <div className="expectation">
            <label>
              <input
                type="checkbox"
                disabled="true"
                checked={data.willing_networking}
              />
              Will help mentee(s) with networking as deemed appropriate.
            </label>
          </div>

          <div className="expectation">
            <label>
              <input
                type="checkbox"
                disabled="true"
                checked={data.willing_goal_setting}
              />
              Will help mentee(s) with goal setting.
            </label>
          </div>

          <div className="expectation">
            <label>
              <input type="checkbox" />
              Willing to discuss personal as well as professional life.
            </label>
          </div>

          <div className="expectation">
            <label>
              <input
                type="checkbox"
                disabled="true"
                checked={data.willing_goal_setting}
              />
              Willing to advise for residency application.
            </label>
          </div>

          <h4>Cadence</h4>
          {data.cadence === 'other' ? data.other_cadence : capitalize(data.cadence)}
        </div>
        <div className="about" style={{ width: '450px' }}>
          <h2>{data.name}</h2>
          <h4>Hospital Affiliations</h4>
          <p style={{ paddingBottom: '1em' }}>{data.affiliations.join(', ')}</p>

          <h4>Clinical specialties</h4>
          <p style={{ paddingBottom: '1em' }}>
            {data.clinical_specialties.join(', ')}
          </p>

          <h4>Additional interests</h4>
          <p style={{ paddingBottom: '1em' }}>
            {data.additional_interests.join(', ')}
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
