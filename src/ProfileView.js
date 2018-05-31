import React from 'react'
import AppScreen from './AppScreen'

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
          <h1>{data.name}</h1>
          <a href={`mailto:${data.email}`}>{data.email}</a>
        </div>
        <div className="about" style={{ width: '450px' }}>
          <p>Affiliations: {data.affiliations.join(', ')}</p>
          <p>Clinical specialties: {data.clinical_specialties.join(', ')}</p>
          <p>Additional interests: {data.additional_interests.join(', ')}</p>
          {data.additional_information && (
            <div>
              <p>Additional Information:</p>
              <p>{data.additional_information}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </AppScreen>
)

export default ProfileView
