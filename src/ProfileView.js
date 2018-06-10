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

          <h4>Contact Information</h4>
          <p>
            <a href={`mailto:${data.email}`}>{data.email}</a>
          </p>

          <div style={{marginTop: '1.2em'}}>
            <h4>Cadence</h4>
            {data.cadence === 'other' ? data.other_cadence : capitalize(data.cadence)}
          </div>

          <h4>Additional Opportunities</h4>

          <div className="expectation">
            <label className={!data.willing_shadowing && 'grayed-out'}>
              <input
                type="checkbox"
                disabled="true"
                checked={data.willing_shadowing}
              />
              Will allow shadowing opportunities for mentee(s).
            </label>
          </div>

          <div className="expectation">
            <label className={!data.willing_networking && 'grayed-out'}>
              <input
                type="checkbox"
                disabled="true"
                checked={data.willing_networking}
              />
              Will help mentee(s) with networking as deemed appropriate.
            </label>
          </div>

          <div className="expectation">
            <label className={!data.willing_goal_setting && 'grayed-out'}>
              <input
                type="checkbox"
                disabled="true"
                checked={data.willing_goal_setting}
              />
              Will help mentee(s) with goal setting.
            </label>
          </div>

          <div className="expectation">
            <label className={!data.willing_discuss_personal && 'grayed-out'}>
              <input
                type="checkbox"
                disabled="true"
                checked={data.willing_discuss_personal}
              />
              Willing to discuss personal as well as professional life.
            </label>
          </div>

          <div className="expectation">
            <label className={!data.willing_residency_application && 'grayed-out'}>
              <input
                type="checkbox"
                disabled="true"
                checked={data.willing_residency_application}
              />
              Willing to advise for residency application.
            </label>
          </div>
        </div>
        <div className="about" style={{ width: '450px' }}>
          <h1>{data.name}</h1>

          <h4 style={{marginTop: '2em'}}>Hospital Affiliations</h4>

          <p style={{ paddingBottom: '1em' }}>{data.affiliations.join(', ')}</p>

          <h4>Clinical Specialties</h4>
          <p style={{ paddingBottom: '1em' }}>
            {data.clinical_specialties.join(', ')}
          </p>

          <h4>Additional Interests</h4>
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
