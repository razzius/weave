import React from 'react'
import profiles from './profiles'

function placehold(size) {
  return `//placehold.it/${size}`
}

export default ({match}) => {

  // todo janky. pass in profile directly!
  const profile = profiles.filter(({ id }) => id === parseInt(match.params.id, 10))[0]

  return <div className="profile-contact">
    <div className="columns">
      <div className="column contact">
        <img className="profile-image column" src={placehold(150)}/>
        <p>
          <p>{profile.email}</p>
        </p>
      </div>
      <div className="about" style={{width: '350px'}}>
        <p>Interests</p>
        <p>Hospital Affiliations</p>
        <p>Clinical</p>
        <p>Non-clinical</p>
      </div>
      <img src={placehold(150)}/>
    </div>
    <div>
      <h2>Expectations</h2>
      <h2>Cadence</h2>
    </div>
  </div>
}
