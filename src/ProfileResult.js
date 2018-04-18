import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Select from 'react-select'
import {interestOptions, hospitalOptions} from './options'

export default ({
  id,
  name,
  affiliations,
  interests,
  clinicalInterests,
  levelOfInvolvement,
  meetingFrequency
}) => (
  <Link to={`/faculty/${id}`} className="profile-result">
    <img className="profile-image" src="//placehold.it/150"/>
    <div>
      <h2>{name}</h2>
      <p>{interests.map(interest => <span key={interest} className="interest"> {interest} </span>)}</p>
      <p>{clinicalInterests.map(interest => <span key={interest} className="clinical-interest"> {interest} </span>)}</p>
    </div>
    <div className="profile-result-right">
      <p>Level of involvement: {levelOfInvolvement}</p>
      <p>Meeting frequency: {meetingFrequency}</p>
    </div>
  </Link>
)
